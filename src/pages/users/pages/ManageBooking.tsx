import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  X,
  Phone,
  Plus,
  Clock,
  MessageCircle,
  Copy,
} from "lucide-react";
import axios from 'axios';
import { buildApiUrl } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StepTwo from "../../../components/website/Steps/StepTwo";
import StepThree from "../../../components/website/Steps/StepThree";
import StepFour from "../../../components/website/Steps/StepFour";
import Navbar from "@/components/website/Navbar";
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
  const [modalType, setModalType] = useState<"cancel" | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: "",
    time: "",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const order = location.state?.orderData;
    if (order) {
      setOrderData(order);
      // Initialize form data with existing booking details
      setSelectedDateTime({
        date: order.appointment_date,
        time: order.appointment_time,
      });
      try {
        setSelectedAddress(JSON.parse(order.location));
      } catch (e) {
        setSelectedAddress(null);
      }
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

  const handleCancelBooking = () => {
    setModalType("cancel");
    setShowModal(true);
  };

  const performCancel = async () => {
    if (!bookingId) return;
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(buildApiUrl(`/api/user/appointments/${bookingId}`), { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Notify other parts of app to refresh bookings
      window.dispatchEvent(new CustomEvent('booking:changed', { detail: { id: bookingId, action: 'cancelled' } }));

      toast({ title: 'Success', description: 'Booking cancelled' });

      // Close modal and navigate back to bookings list
      setShowModal(false);
      navigate('/user/bookings');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({ title: 'Error', description: 'Failed to cancel booking', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = () => {
    navigate("/customer-support");
  };

  const copyPhoneNumber = (phoneNumber: string) => {
    navigator.clipboard.writeText(phoneNumber);
    toast({ title: 'Copied', description: 'Phone number copied to clipboard' });
  };

  const openWhatsAppChat = () => {
    const phoneNumber = "+971501234567"; // Replace with your actual WhatsApp number
    const message = `Hi, I need help with my booking #${bookingId}`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
      id: "phone",
      title: "Call Customer Support",
      subtitle: SUPPORT_PHONE,
      icon: Phone,
      onClick: () => copyPhoneNumber(SUPPORT_PHONE_RAW),
      className: "text-blue-600 hover:bg-blue-50",
      actionText: "Tap to copy number"
    },
    {
      id: "whatsapp",
      title: "Live Chat Support",
      subtitle: "Get instant help via WhatsApp",
      icon: MessageCircle,
      onClick: openWhatsAppChat,
      className: "text-green-600 hover:bg-green-50",
      actionText: "Start chat"
    },
    {
      id: "cancel",
      title: "Cancel Booking",
      subtitle: "Cancel your current booking",
      icon: X,
      onClick: handleCancelBooking,
      className: "text-red-600 hover:bg-red-50",
      actionText: "Cancel booking"
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Need Help?</h2>
            <p className="text-gray-600">Get quick support or manage your booking</p>
          </div>
          
          <div className="space-y-4">
            {managementOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className={`w-full p-4 bg-white border border-gray-200 rounded-lg transition-colors ${
                    option.className || "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      option.id === 'phone' ? 'bg-blue-100' :
                      option.id === 'whatsapp' ? 'bg-green-100' :
                      'bg-red-100'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">{option.subtitle}</p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{option.actionText}</span>
                      {option.id === 'phone' && (
                        <Copy className="w-4 h-4 text-gray-400 mt-1 ml-auto" />
                      )}
                      {option.id === 'whatsapp' && (
                        <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180 mt-1 ml-auto" />
                      )}
                      {option.id === 'cancel' && (
                        <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Modal for cancel confirmation */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 relative !fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2">
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
              {/* Custom Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Consider Rescheduling
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-4 pt-0">
                <div className="border-b border-dashed border-gray-300 pb-4 mb-6">
                  <p className="text-gray-900 text-base">
                    Change of plans? Reschedule easily
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      Pick any time that suits you
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">
                      Skip hassle of rebooking
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => performCancel()}
                    className="flex-1 px-4 py-3 border border-[#01788e] text-[#01788e] rounded-lg hover:bg-[#01788e] hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cancelling...' : 'YES, CANCEL ANYWAY'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    KEEP BOOKING
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooking;
