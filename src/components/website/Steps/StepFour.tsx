import React, { useState } from "react";
import { Check, CreditCard, Banknote, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const StepFour = ({ cartItems, selectedDateTime, subtotal, selectedAddress }) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  const handleBookNow = async () => {
    if (!selectedPayment) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (!selectedDateTime.date || !selectedDateTime.time) {
      toast({
        title: "Missing Information",
        description: "Please select date and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAddress) {
      toast({
        title: "Missing Address",
        description: "Please select a service address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare appointment data
      const appointmentData = {
        service: cartItems.map(item => `${item.service.name} (x${item.count})`).join(', '),
        appointment_date: selectedDateTime.date,
        appointment_time: selectedDateTime.time,
        location: selectedAddress,
        price: total,
        notes: `Payment Method: ${selectedPayment === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}. Items: ${cartItems.map(item => `${item.service.name} (x${item.count})`).join(', ')}`
      };

      // Make API call to create appointment
      const response = await fetch('http://localhost:3001/api/user/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to order confirmation page with order data
        navigate("/order-confirmation", { 
          state: { 
            orderData: {
              ...data.appointment,
              ...appointmentData
            }
          }
        });
        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been successfully booked.",
        });
      } else {
        throw new Error(data.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Pay with Add New Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Secure payment with credit/debit card",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Banknote className="w-5 h-5" />,
      description: "Pay when service is completed",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Service Details Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          Service Details
        </h2>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.service.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900">
                  {item.service.name}
                </h3>
                <p className="text-sm text-gray-500">Quantity: {item.count}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  AED {(item.service.price * item.count).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  AED {item.service.price} each
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date & Time Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          Date & Time
        </h2>
        <div className="bg-white p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Selected Date</p>
              <p className="font-medium text-gray-900">
                {selectedDateTime.date || "Not selected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Selected Time</p>
              <p className="font-medium text-gray-900">
                {selectedDateTime.time || "Not selected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          Service Address
        </h2>
        <div className="bg-white p-4 rounded-lg">
          {selectedAddress ? (
            <div>
              <p className="font-medium text-gray-900">{selectedAddress.displayName || selectedAddress.type}</p>
              <p className="text-gray-600">
                {selectedAddress.address}, {selectedAddress.area}, {selectedAddress.city}
                {selectedAddress.apartmentNo && ` - ${selectedAddress.apartmentNo}`}
              </p>
            </div>
          ) : (
            <p className="text-gray-600">No address selected</p>
          )}
        </div>
      </div>

      {/* Offers Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          Offers & Discounts
        </h2>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-gray-600">No offers applied</p>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
            Apply Promo Code
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payment Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Charges</span>
            <span className="font-medium">AED {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">VAT (5%)</span>
            <span className="font-medium">AED {vat.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Total to Pay</span>
              <span className="text-lg font-bold text-green-600">
                AED {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payment Method
        </h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                selectedPayment === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      selectedPayment === method.id
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedPayment === method.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Now Button */}
      <div className="text-center">
        <button
          onClick={handleBookNow}
          disabled={!selectedPayment || isLoading}
          className={`w-full py-4 px-8 rounded-lg font-semibold text-white text-lg transition-all flex items-center justify-center gap-3 ${
            !selectedPayment || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing...
            </>
          ) : (
            "Book Now"
          )}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked. You will receive a
              confirmation message shortly.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/user/bookings");
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepFour;
