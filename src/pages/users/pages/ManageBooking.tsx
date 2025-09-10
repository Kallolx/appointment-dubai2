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
} from "lucide-react";
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
  const [modalType, setModalType] = useState<
    "date" | "address" | "payment" | "cancel" | null
  >(null);
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

  const handleOptionClick = (
    type: "date" | "address" | "payment" | "cancel" | "report"
  ) => {
    if (type === "report") {
      // Handle report delay functionality
      console.log("Reporting technician delay...");
      return;
    }
    setModalType(type as "date" | "address" | "payment" | "cancel");
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      // Here you would save the changes to the backend
      console.log("Saving changes...", {
        bookingId,
        selectedDateTime,
        selectedAddress,
        modalType,
        selectedPayment,
      });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close modal and redirect to booking details
      setShowModal(false);
      setModalType(null);

      // Navigate to booking details with success state
      navigate(`/booking-details/${bookingId}`, {
        state: {
          orderData,
          showUpdateToast: true,
          updateType: modalType,
        },
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      // You can add error handling here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = () => {
    handleOptionClick("cancel");
  };

  const handleContactSupport = () => {
    navigate("/customer-support");
  };

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
      id: "report",
      title: "Report a delay in the technician's arrival",
      onClick: () => handleOptionClick("report"),
      className: "text-red-600 hover:bg-red-50",
    },
    {
      id: "date",
      title: "Change booking date or time",
      onClick: () => handleOptionClick("date"),
    },
    {
      id: "address",
      title: "Change the address",
      onClick: () => handleOptionClick("address"),
    },
    {
      id: "payment",
      title: "Change the payment method",
      onClick: () => handleOptionClick("payment"),
    },
    {
      id: "cancel",
      title: "Cancel the booking",
      onClick: handleCancelBooking,
      className: "text-gray-900 hover:bg-gray-50",
    },
    {
      id: "support",
      title: "Contact Customer Support",
      onClick: handleContactSupport,
    },
  ];

  const renderModalContent = () => {
    switch (modalType) {
      case "date":
        return (
          <StepThree
            onSelectionChange={(data) => {
              setSelectedDateTime({
                date: data.date || "",
                time: data.time || "",
              });
            }}
            category={null}
          />
        );
      case "address":
        return (
          <StepTwo
            handleAddItemsClick={() => {}}
            handleRemoveItemClick={() => {}}
            cartItems={[]}
            onSelectionChange={(data) => {
              setSelectedAddress(data.address);
            }}
          />
        );
      case "payment":
        return (
          <StepFour
            cartItems={[
              {
                service: {
                  id: 1,
                  name: orderData.service,
                  price:
                    typeof orderData.price === "string"
                      ? parseFloat(orderData.price)
                      : orderData.price,
                },
                count: 1,
              },
            ]}
            selectedDateTime={selectedDateTime}
            subtotal={
              typeof orderData.price === "string"
                ? parseFloat(orderData.price)
                : orderData.price
            }
            selectedAddress={selectedAddress}
            selectedPayment={undefined}
            setSelectedPayment={undefined}
            category={undefined}
          />
        );
      default:
        return null;
    }
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
          <div className="space-y-4">
            {managementOptions.map((option) => {
              return (
                <button
                  key={option.id}
                  onClick={option.onClick}
                  className={`w-full p-4 bg-white border border-gray-200 rounded-lg ${
                    option.className || "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-left text-sm md:text-md font-medium ${
                        option.className?.includes("text-red-600")
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {option.title}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Modal for editing options */}
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
          {modalType === "date" && (
            <>
              {/* Custom Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Date & Time
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-3 pt-0">
                {renderModalContent()}

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 text-sm font-bold">
                        !
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      We can not guarantee the availability of the selected or
                      preferred technician once the date/time of service is
                      changed or any other changes are requested.
                    </p>
                  </div>
                </div>

                {/* CONFIRM Button */}
                <div className="mt-6">
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors text-base flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      "CONFIRM"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {modalType === "address" && (
            <>
              {/* Custom Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Address
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-3 pt-0">
                {renderModalContent()}

                {/* CONFIRM Button */}
                <div className="mt-6">
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors text-base flex items-center justify-center gap-2 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      "CONFIRM"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {modalType === "payment" && (
            <>
              {/* Custom Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Pay With
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-3 pt-0">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select preferred payment method
                  </h3>
                  <p className="text-sm text-gray-600">
                    You pay only after the service is completed.
                  </p>
                </div>

                {/* Payment Options */}
                <div className="space-y-4 mb-6">
                  {/* Cash On Delivery */}
                  <button
                    onClick={() => setSelectedPayment("cod")}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-900 font-medium">
                        Cash On Delivery
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        +AED 5
                      </div>
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        {selectedPayment === "cod" && (
                          <div className="w-3 h-3 bg-[#01788e] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Add New Card */}
                  <button
                    onClick={() => setSelectedPayment("card")}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-900 font-medium">
                        Add New Card
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        {selectedPayment === "card" && (
                          <div className="w-3 h-3 bg-[#01788e] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* SAVE Button */}
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 transition-colors text-base flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    "SAVE"
                  )}
                </button>
              </div>
            </>
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
                    onClick={() => {
                      // Handle cancel anyway logic
                      console.log("Cancelling booking...", bookingId);
                      navigate("/user/bookings");
                    }}
                    className="flex-1 px-4 py-3 border border-[#01788e] text-[#01788e] rounded-lg hover:bg-[#01788e] hover:text-white transition-colors"
                  >
                    YES, CANCEL ANYWAY
                  </button>
                  <button
                    onClick={() => {
                      setModalType("date");
                    }}
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    RESCHEDULE
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
