import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  X,
  Phone,
  Clock,
  MessageCircle,
  ChevronRight,
  Headphones,
  Undo2,
} from "lucide-react";
import axios from "axios";
import { buildApiUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EditDateTimeModal from "@/components/website/modals/EditDateTimeModal";
import EditAddressModal from "@/components/website/modals/EditAddressModal2";
import EditPaymentModal from "@/components/website/modals/EditPaymentModal";
import Footer from "@/components/website/Footer";

interface OrderData {
  id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  price: number | string;
  status: string;
  notes?: string;
  created_at: string;
}

const ManageBooking: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"cancel" | "support" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states for edit modals
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const order = location.state?.orderData;
    if (order) {
      setOrderData(order);
    } else {
      navigate("/user/bookings");
    }
  }, [location.state, navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    setModalType(null);
  };

  const { token } = useAuth();
  const { toast } = useToast();

  // If the page was opened with a bookingId route param (but no location state), fetch the appointment
  useEffect(() => {
    const fetchOrder = async () => {
      if (orderData || !bookingId) return; // already have data or no id to fetch
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const url = buildApiUrl(`/api/user/appointments/${bookingId}`);
        console.log("ManageBooking - fetching order from", url);
        const resp = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp?.data) {
          setOrderData(resp.data);
        } else {
          console.warn("ManageBooking - empty response fetching order", resp);
          navigate("/user/bookings");
        }
      } catch (err) {
        console.error("ManageBooking - failed to fetch order:", err);
        toast({
          title: "Error",
          description: "Failed to load booking",
          variant: "destructive",
        });
        navigate("/user/bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [bookingId, orderData, token, navigate, toast]);

  const performCancel = async () => {
    // Use route param bookingId if available, otherwise fallback to orderData.id
    const rawId = bookingId ?? orderData?.id;
    const idToCancel = rawId ? Number(rawId) : undefined;
    if (!idToCancel) {
      console.error(
        "performCancel: Missing booking id (route param and orderData.id are both undefined)"
      );
      toast({
        title: "Error",
        description: "Unable to determine booking id for cancellation",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      const url = buildApiUrl(`/api/user/appointments/${idToCancel}`);
      console.log("performCancel - calling URL:", url, "payload:", {
        status: "cancelled",
      });

      // Mirror MyBookings cancel request
      const response = await axios.put(
        url,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("performCancel - response:", response.status, response.data);

      // Notify other parts of app to refresh bookings
      window.dispatchEvent(
        new CustomEvent("booking:changed", {
          detail: { id: idToCancel, action: "cancelled" },
        })
      );

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });

      // Close modal and navigate back to bookings list
      setShowModal(false);
      navigate("/user/bookings");
    } catch (error: any) {
      console.error(
        "Error cancelling booking:",
        error?.response || error.message || error
      );
      const status = error?.response?.status;
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error.message;
      toast({
        title: "Error",
        description: `Failed to cancel booking${
          status ? ` (status ${status})` : ""
        }${serverMessage ? `: ${serverMessage}` : ""}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingUpdate = (updatedData: any) => {
    setOrderData(updatedData);
  };

  const handleDateTimeChange = () => {
    setIsDateTimeModalOpen(true);
  };

  const handleAddressChange = () => {
    setIsAddressModalOpen(true);
  };

  const handlePaymentChange = () => {
    setIsPaymentModalOpen(true);
  };

  const handleCancelBooking = () => {
    setModalType("cancel");
    setShowModal(true);
  };

  const handleContactSupport = () => {
    setModalType("support");
    setShowModal(true);
  };

  const copyPhoneNumber = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber);
    toast({ title: "Copied", description: "Phone number copied to clipboard" });
  };

  const openWhatsAppChat = () => {
    const phoneNumber = "+971501234567"; // Replace with your actual WhatsApp number
    const message = `Hi, I need help with my booking #${bookingId}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Configuration - Replace these with your actual contact details
  const SUPPORT_PHONE = "+971 50 123 4567";
  const SUPPORT_PHONE_RAW = "+971501234567";

  if (!orderData) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex justify-center items-center h-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading booking details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const managementOptions = [
    {
      id: "datetime",
      title: "Change booking date or time",
      icon: Calendar,
      onClick: handleDateTimeChange,
    },
    {
      id: "address",
      title: "Change the address",
      icon: MapPin,
      onClick: handleAddressChange,
    },
    {
      id: "payment",
      title: "Change the payment method",
      icon: CreditCard,
      onClick: handlePaymentChange,
    },
    {
      id: "cancel",
      title: "Cancel the booking",
      icon: X,
      onClick: handleCancelBooking,
    },
    {
      id: "support",
      title: "Contact Customer Support",
      icon: Headphones,
      onClick: handleContactSupport,
    },
  ];

  const renderModalContent = () => {
    return null; // Only cancel modal is used now
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Top navbar-style header */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-200 mb-4">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Manage Booking
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mt-8 mx-auto px-4">
          <div className="bg-white rounded-lg overflow-hidden">
            {managementOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className="w-full p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {option.title}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Modal for cancel confirmation */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          hideClose
          className="max-w-lg max-h-[90vh] overflow-y-auto p-0 relative !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2"
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Updating your booking...
                </p>
              </div>
            </div>
          )}

          {modalType === "cancel" && (
            <>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Consider Rescheduling
                  </DialogTitle>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 border-t border-dashed border-gray-200"></div>

                <p className="text-gray-700 mb-4">
                  Change of plans? Schedule easily
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Pick any time that suits you
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Undo2 className="w-5 h-5 text-gray-600" />
                    <div className="text-sm font-medium text-gray-900">
                      Skip hassle of rebooking
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => performCancel()}
                    className="flex-1 px-4 py-3 bg-[#01788e] text-white rounded-lg hover:bg-teal-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cancelling..." : "YES, CANCEL ANYWAY"}
                  </button>

                  <button
                    onClick={() => performCancel()}
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Cancelling..." : "CANCEL"}
                  </button>
                </div>
              </div>
            </>
          )}

          {modalType === "support" && (
            <>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Contact Support
                  </DialogTitle>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 border-t border-dashed border-gray-200"></div>

                <div className="p-0">
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        copyPhoneNumber(SUPPORT_PHONE_RAW);
                        setShowModal(false);
                      }}
                      className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">
                            Phone Support
                          </div>
                          <div className="text-sm text-gray-600">
                            {SUPPORT_PHONE}
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        openWhatsAppChat();
                        setShowModal(false);
                      }}
                      className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">
                            Live Message
                          </div>
                          <div className="text-sm text-gray-600">
                            Chat via WhatsApp
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modals */}
      {orderData && (
        <>
          <EditDateTimeModal
            isOpen={isDateTimeModalOpen}
            onClose={() => setIsDateTimeModalOpen(false)}
            orderData={orderData}
            onUpdate={handleBookingUpdate}
          />

          <EditAddressModal
            isOpen={isAddressModalOpen}
            onClose={() => setIsAddressModalOpen(false)}
            orderData={orderData}
            onUpdate={handleBookingUpdate}
          />

          <EditPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            orderData={orderData}
            onUpdate={handleBookingUpdate}
          />
        </>
      )}
    </div>
  );
};

export default ManageBooking;
