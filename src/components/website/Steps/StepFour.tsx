import React, { useEffect, useRef, useState } from "react";
import { buildApiUrl } from "@/config/api";
import {
  Check,
  CreditCard,
  Banknote,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Info,
  PlusCircle,
} from "lucide-react";
import { useGoogleMapsLoader } from "@/contexts/GoogleMapsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const StepFour = ({
  cartItems,
  selectedDateTime,
  subtotal,
  selectedAddress,
}) => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Google Maps refs and loader
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const { isLoaded } = useGoogleMapsLoader();
  const [expandedItemId, setExpandedItemId] = useState<string | number | null>(
    null
  );

  useEffect(() => {
    if (!isLoaded) return;
    const container = mapContainerRef.current;
    if (!container) return;

    // derive lat/lng from selectedAddress with several possible keys
    const lat = Number(
      selectedAddress?.lat ??
        selectedAddress?.latitude ??
        selectedAddress?.location?.lat ??
        25.2048
    );
    const lng = Number(
      selectedAddress?.lng ??
        selectedAddress?.longitude ??
        selectedAddress?.location?.lng ??
        55.2708
    );

    const center = { lat: lat || 25.2048, lng: lng || 55.2708 };

    // initialize map once
    if (!mapRef.current) {
      // @ts-ignore
      mapRef.current = new window.google.maps.Map(container, {
        center,
        zoom: 15,
        disableDefaultUI: true,
      });

      // @ts-ignore
      markerRef.current = new window.google.maps.Marker({
        position: center,
        map: mapRef.current,
      });
    } else {
      mapRef.current.setCenter(center);
      if (markerRef.current) {
        markerRef.current.setPosition(center);
      }
    }
  }, [isLoaded, selectedAddress]);

  // Calculate fees and totals
  const extraPrice = Number(selectedDateTime?.extra_price) || 0;
  const codFee = selectedPayment === "cod" ? 5 : 0;
  const vat = (subtotal + extraPrice + codFee) * 0.05;
  const total = subtotal + extraPrice + codFee + vat;

  const handleBookNow = async () => {
    if (!selectedPayment) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!selectedDateTime.date || !selectedDateTime.time) {
      toast({
        title: "Missing Information",
        description: "Please select date and time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAddress) {
      toast({
        title: "Missing Address",
        description: "Please select a service address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        service: cartItems
          .map((item) => `${item.service.name} (x${item.count})`)
          .join(", "),
        appointment_date: selectedDateTime.date,
        appointment_time: selectedDateTime.time,
        location: selectedAddress,
        price: total,
        extra_price: extraPrice,
        cod_fee: codFee,
        payment_method:
          selectedPayment === "card" ? "Credit/Debit Card" : "Cash on Delivery",
        notes: `Payment Method: ${
          selectedPayment === "card" ? "Credit/Debit Card" : "Cash on Delivery"
        }. Items: ${cartItems
          .map((item) => `${item.service.name} (x${item.count})`)
          .join(", ")}`,
      };

      // Make API call to create appointment
      const response = await fetch(buildApiUrl("/api/user/appointments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to order confirmation page with order data
        navigate("/order-confirmation", {
          state: {
            orderData: {
              ...data.appointment,
              ...appointmentData,
            },
          },
        });
        toast({
          title: "Booking Confirmed!",
          description: "Your appointment has been successfully booked.",
        });
      } else {
        throw new Error(data.message || "Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Pay with Add New Card",
      icon: <PlusCircle className="w-5 h-5" />,
      description: "Secure payment with credit/debit card",
    },
    {
      id: "tabby",
      name: "Tabby",
      // use the provided inline-styled span as the icon
      icon: (
        <span className="inline-block px-2 py-0 rounded-sm bg-gradient-to-r from-emerald-200 to-emerald-400 font-bold text-black mr-2">
          Tabby
        </span>
      ),
      description: "Split payments with Tabby",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Banknote className="w-5 h-5" />,
      description: "Pay when service is completed",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Service Details Section */}
      <div className="rounded-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            Service Details
          </h2>
        </div>

        <div className="space-y-3">
          {cartItems.map((item) => {
            const isOpen = expandedItemId === item.service.id;
            const imgSrc =
              item.service.image_url ||
              item.service.image ||
              item.service.imageUrl ||
              item.service.thumbnail ||
              "";
            return (
              <div
                key={item.service.id}
                className="bg-white border-2 border-gray-200 mb-4 rounded-sm p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={imgSrc || "/placeholder.svg"}
                    alt={item.service.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.service.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedItemId(isOpen ? null : item.service.id)
                        }
                        aria-expanded={isOpen}
                        className={`p-2 rounded-full transform transition-transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 border-t pt-3 text-sm text-gray-600 space-y-2">
                    {item.service.category && (
                      <div>
                        <strong>Category:</strong> {item.service.category}
                      </div>
                    )}
                    {item.service.propertyType && (
                      <div>
                        <strong>Property Type:</strong>{" "}
                        {item.service.propertyType}
                      </div>
                    )}
                    {item.service.duration && (
                      <div>
                        <strong>Duration:</strong> {item.service.duration}
                      </div>
                    )}
                    {item.service.materials && (
                      <div>
                        <strong>Materials:</strong> {item.service.materials}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* stacked date/time/location */}
          <div className="mt-4 p-6 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div className="text-md text-gray-700">
                {selectedDateTime?.date || "Not selected"}
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <div className="text-md text-gray-700">
                {selectedDateTime?.time || "Not selected"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div className="text-md text-gray-700 break-words w-full">
                {selectedAddress.address}, {selectedAddress.area},{" "}
                {selectedAddress.city}
              </div>
            </div>
          </div>

          {/* Map placeholder without rounded corners */}
          <div className="mt-4 w-full overflow-hidden">
            <div
              ref={(el) => (mapContainerRef.current = el)}
              className="w-full h-48 bg-gray-100 pointer-events-none select-none"
            />
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <div className="mb-6 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          Offers & Discounts
        </h2>
        <div className="flex justify-between">
          <p className="text-gray-600 hover:text-blue-800 text-sm font-medium">
            Promo Code
          </p>
          <p className="text-gray-600 cursor-pointer underline text-sm font-medium">
            Apply
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8 p-6">
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
                  <div className={`p-2 ${selectedPayment === method.id}`}>
                    {method.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      {method.id === 'tabby' && <Info className="w-5 h-5 text-gray-600 mt-0.5" />}
                    </div>
                    {method.id !== 'tabby' && method.description && (
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.id === "cod" && (
                    <div className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-md">
                      + AED 5
                    </div>
                  )}
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
            </div>
          ))}
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

          {extraPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Time Slot Fee</span>
              <span className="font-medium text-orange-600">
                +{extraPrice.toFixed(2)} AED
              </span>
            </div>
          )}

          {codFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cash on Delivery Fee</span>
              <span className="font-medium text-orange-600">
                +{codFee.toFixed(2)} AED
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">VAT (5%)</span>
            <span className="font-medium">AED {vat.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Total to Pay</span>
              <span className="text-lg font-bold text-gray-600">
                AED {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="text-center">
        <button
          onClick={handleBookNow}
          disabled={!selectedPayment || isLoading}
          className={`w-full py-4 px-4 rounded-sm font-semibold text-white text-lg transition-all flex items-center justify-center gap-3 ${
            !selectedPayment || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#ed6329] hover:shadow-xl"
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
