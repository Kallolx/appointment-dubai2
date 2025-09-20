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
  X,
  User,
  ArrowRight,
} from "lucide-react";
import { useGoogleMapsLoader } from "@/contexts/GoogleMapsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ziinaService } from "@/services/ziinaService";


const StepFour = ({
  cartItems,
  selectedDateTime,
  subtotal,
  selectedAddress,
  selectedPayment,
  setSelectedPayment,
  category,
  appliedOffer = null,
  discountAmount = 0,
  onOfferChange = (offer, discount) => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  // Offer code states (now received as props, keeping local state for validation)
  const [offerCode, setOfferCode] = useState("");
  const [isValidatingOffer, setIsValidatingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [finalAmount, setFinalAmount] = useState(subtotal - discountAmount);

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

  // Update final amount when subtotal or discount changes
  useEffect(() => {
    setFinalAmount(Math.max(0, subtotal - discountAmount));
  }, [subtotal, discountAmount]);

  // Offer code validation function
  const validateOfferCode = async () => {
    if (!offerCode.trim()) {
      setOfferError("Please enter an offer code");
      return;
    }

    setIsValidatingOffer(true);
    setOfferError("");

    try {
      const response = await fetch(buildApiUrl('/api/offer-codes/validate'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: offerCode.trim(),
          orderAmount: subtotal,
          serviceIds: cartItems.map(item => item.id || item.serviceId)
        })
      });

      const data = await response.json();

      if (data.success) {
        onOfferChange(data.offer, data.discountAmount);
        setFinalAmount(data.finalAmount);
        setOfferError("");
        toast({
          title: "Offer Applied!",
          description: `You saved AED ${data.savings} with ${data.offer.name}`,
          variant: "default"
        });
      } else {
        setOfferError(data.message || "Invalid offer code");
        onOfferChange(null, 0);
      }
    } catch (error) {
      console.error('Error validating offer code:', error);
      setOfferError("Failed to validate offer code. Please try again.");
    } finally {
      setIsValidatingOffer(false);
    }
  };

  // Remove applied offer
  const removeOffer = () => {
    onOfferChange(null, 0);
    setOfferCode("");
    setOfferError("");
    toast({
      title: "Offer Removed",
      description: "The offer code has been removed from your order",
      variant: "default"
    });
  };

  useEffect(() => {
    if (!isLoaded) return;
    const container = mapContainerRef.current;
    if (!container) return;

    // Debug: Log the selectedAddress to understand its structure
    console.log('StepFour - selectedAddress:', selectedAddress);

    // derive lat/lng from selectedAddress with several possible keys
    let lat, lng;
    
    if (selectedAddress?.coordinates) {
      // For addresses selected from map (has coordinates object)
      lat = Number(selectedAddress.coordinates.lat);
      lng = Number(selectedAddress.coordinates.lng);
    } else {
      // For saved addresses or other formats
      lat = Number(
        selectedAddress?.lat ??
          selectedAddress?.latitude ??
          selectedAddress?.location?.lat ??
          25.2048
      );
      lng = Number(
        selectedAddress?.lng ??
          selectedAddress?.longitude ??
          selectedAddress?.location?.lng ??
          55.2708
      );
    }

    console.log('StepFour - Extracted coordinates:', { lat, lng });

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
      // Extract room type and property type from cart items
      const firstItem = cartItems[0];
      const roomType = firstItem?.service?.roomType || firstItem?.service?.context?.selectedRoomType || 'Studio';
      const propertyType = firstItem?.service?.propertyType || firstItem?.service?.context?.selectedPropertyType || 'Apartment';
      const quantity = firstItem?.count || 1;

      // Calculate total including fees and VAT
      const codFee = selectedPayment === "cod" ? 5 : 0;
      const extraPrice = Number(selectedDateTime.extra_price) || 0;
      const total = subtotal + extraPrice + codFee + (subtotal + extraPrice + codFee) * 0.05;

      // Note: Time format is now correctly sent from StepThree in database format (HH:MM:SS)
      // No conversion needed since StepThree.tsx now sends the actual start_time from database

      // Extract service items category from cart items
      const serviceItemsCategory = cartItems.length > 0 
        ? cartItems[0].service.service_items_category || cartItems[0].service.category 
        : null;

      // Prepare appointment data
      const appointmentData = {
        service: cartItems
          .map((item) => `${item.service.name} (x${item.count})`)
          .join(", "),
        appointment_date: selectedDateTime.dbDate || selectedDateTime.date,
        appointment_time: selectedDateTime.time, // Use database time format directly
        location: selectedAddress,
        price: finalAmount, // Use final amount after discount
        original_price: subtotal, // Keep original price for reference
        discount_amount: discountAmount,
        extra_price: extraPrice,
        cod_fee: codFee,
        room_type: roomType,
        property_type: propertyType,
        quantity: quantity,
        service_category: firstItem?.service?.category || category || 'general',
        service_items_category: serviceItemsCategory,
        payment_method: getPaymentMethodName(selectedPayment),
        offer_code_id: appliedOffer?.id || null,
        notes: `Payment Method: ${getPaymentMethodName(selectedPayment)}. Items: ${cartItems
          .map((item) => `${item.service.name} (x${item.count})`)
          .join(", ")}${appliedOffer ? `. Applied Offer: ${appliedOffer.name} (${appliedOffer.code})` : ''}`,
      };

      // Debug: Log the appointment data being sent
      console.log('StepFour - selectedDateTime object:', selectedDateTime);
      console.log('StepFour - database time format:', selectedDateTime.time);
      console.log('StepFour - appointment_date being sent:', selectedDateTime.dbDate || selectedDateTime.date);
      console.log('StepFour - Appointment data being sent:', appointmentData);
      console.log('StepFour - First item details:', firstItem);
      console.log('StepFour - Category:', category);

      // Handle different payment methods
      if (selectedPayment === "ziina") {
        await handleZiinaPayment(appointmentData);
      } else {
        await handleRegularPayment(appointmentData);
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

  const getPaymentMethodName = (paymentId: string) => {
    switch (paymentId) {
      case "card":
        return "Credit/Debit Card";
      case "ziina":
        return "Ziina";
      case "cod":
        return "Cash on Delivery";
      default:
        return "Unknown";
    }
  };

  const handleRegularPayment = async (appointmentData: any) => {
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
      // Apply offer code if one was used
      if (appliedOffer && data.appointment?.id) {
        try {
          await fetch(buildApiUrl('/api/offer-codes/apply'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              offerId: appliedOffer.id,
              orderAmount: subtotal,
              appointmentId: data.appointment.id
            })
          });
        } catch (offerError) {
          console.error('Failed to apply offer code:', offerError);
          // Don't block the booking process if offer application fails
        }
      }
      
      // Clear all cart data after successful booking
      try {
        localStorage.removeItem('checkout_cart_items');
        localStorage.removeItem('pendingCartItems');
      } catch (error) {
        console.error('Failed to clear cart data:', error);
      }
      
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
  };

  const handleZiinaPayment = async (appointmentData: any) => {
    try {
      // First create the appointment with pending payment status
      const response = await fetch(buildApiUrl("/api/user/appointments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...appointmentData,
          status: "pending",
          payment_method: "Ziina",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      // Check if appointment data exists
      if (!data.appointment_id) {
        console.error("Missing appointment data:", data);
        throw new Error("Appointment creation failed - missing appointment ID");
      }

      // Calculate total with VAT
      const codFee = 0; // No COD fee for Ziina
      const extraPrice = Number(selectedDateTime.extra_price) || 0;
      const total = subtotal + extraPrice + (subtotal + extraPrice) * 0.05;

      // Create Ziina payment
      const paymentData = {
        amount: total,
        currency: "AED",
        description: `Payment for ${appointmentData.service}`,
        order_id: `appointment_${data.appointment_id}`,
        customer_email: user?.email,
        customer_phone: user?.phone,
        return_url: `${window.location.origin}/order-confirmation?appointment_id=${data.appointment_id}&payment_success=true`,
        cancel_url: `${window.location.origin}/payment-cancelled?appointment_id=${data.appointment_id}`,
      };

      const paymentResponse = await ziinaService.createPaymentViaBackend(paymentData);

      if (paymentResponse.success && paymentResponse.payment_url) {
        // Clear cart data before redirecting
        try {
          localStorage.removeItem('checkout_cart_items');
          localStorage.removeItem('pendingCartItems');
        } catch (error) {
          console.error('Failed to clear cart data:', error);
        }
        
        // Redirect to Ziina payment page
        window.location.href = paymentResponse.payment_url;
      } else {
        throw new Error(paymentResponse.message || "Failed to create payment");
      }
    } catch (error) {
      console.error("Ziina payment error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Add New Card",
      icon: <PlusCircle className="w-5 h-5" />,
    },
    {
      id: "ziina",
      name: "Pay with Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      logo: "/icons/ziina-logo.svg", // Add Ziina logo if available
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: <Banknote className="w-5 h-5" />,
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
                    alt={item.service.serviceItem?.name || item.service.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {/* NEW: Show enhanced context if available */}
                          {item.service.context?.selectedServiceItem ||
                            item.service.serviceItem?.name ||
                            item.service.name}
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
                  <div className="mt-3 border-t border-gray-300 pt-3 text-sm text-gray-600 space-y-2">
                    {/* Show data in the requested format: Room type - Property type x Quantity AED Price */}
                    <div className="flex text-gray-500 text-sm justify-between items-center">
                      <div>
                        <span>
                          {item.service.name} - {item.service.propertyType} x 1
                        </span>
                      </div>
                      <div>
                        <span>
                          AED{" "}
                          {typeof item.service.price === "number"
                            ? item.service.price.toFixed(2)
                            : (parseFloat(item.service.price) || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* stacked date/time/location */}
          <div className="mt-4 p-2 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <div className="text-sm text-gray-700">
                {selectedDateTime?.date || "Not selected"}
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-4 h-4 text-gray-600" />
              <div className="text-sm text-gray-700">
                {selectedDateTime?.time || "Not selected"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-600" />
              <div className="text-sm text-gray-700 break-words w-full">
                {selectedAddress ? (
                  <>
                    {/* For saved addresses from database */}
                    {selectedAddress.address_line1 && (
                      <>
                        {selectedAddress.address_line1}
                        {selectedAddress.address_line2 && selectedAddress.address_line2.trim() !== "" && selectedAddress.address_line2 !== "0" && `, ${selectedAddress.address_line2}`}
                        , {selectedAddress.state}
                        , {selectedAddress.city}
                      </>
                    )}
                    {/* For addresses selected from map or locally added */}
                    {!selectedAddress.address_line1 && (
                      <>
                        {selectedAddress.address || "Address not available"}
                        {selectedAddress.apartmentNo && `, ${selectedAddress.apartmentNo}`}
                        , {selectedAddress.area || "Area not available"}
                        , {selectedAddress.city || "City not available"}
                      </>
                    )}
                  </>
                ) : (
                  "Address not available"
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Offers Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Offers & Discounts
        </h2>
        
        {!appliedOffer ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={offerCode}
                  onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isValidatingOffer}
                />
                {offerError && (
                  <p className="text-red-500 text-sm mt-1">{offerError}</p>
                )}
              </div>
              <button
                onClick={validateOfferCode}
                disabled={isValidatingOffer || !offerCode.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
              >
                {isValidatingOffer ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">{appliedOffer.name}</p>
                  <p className="text-sm text-green-600">Code: {appliedOffer.code}</p>
                  <p className="text-sm text-green-600">You saved AED {discountAmount.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={removeOffer}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove offer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="mb-8 p-6">
        <h2 className="text-xl flex items-center gap-2 font-semibold text-gray-900 mb-4">
          Pay With
          <Info className="w-4 h-4 text-gray-600" />
        </h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => {
                if (method.id === "card") {
                  setShowAddCardModal(true);
                } else {
                  setSelectedPayment(method.id);
                }
              }}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                selectedPayment === method.id
                  ? "border-[#01788e]"
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
                      <h3 className="font-medium text-gray-900">
                        {method.name}
                      </h3>                      
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.id === "cod" && (
                    <div className="text-xs text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-md">
                      + AED 5
                    </div>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      selectedPayment === method.id
                        ? "border-[#01788e]"
                        : "border-[#01788e]"
                    }`}
                  >
                    {selectedPayment === method.id && (
                      <div className="w-full h-full rounded-full bg-[#01788e] scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 hidden md:block">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Payment Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Service Charges</span>
            <span className="font-medium text-sm">AED {subtotal.toFixed(2)}</span>
          </div>

          {extraPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Time Slot Fee</span>
              <span className="font-medium text-orange-600 text-sm">
                +{extraPrice.toFixed(2)} AED
              </span>
            </div>
          )}

          {codFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Cash on Delivery Fee</span>
              <span className="font-medium text-orange-600 text-sm">
                +{codFee.toFixed(2)} AED
              </span>
            </div>
          )}

          {appliedOffer && discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-green-600 text-sm flex items-center gap-1">
                <Check className="w-4 h-4" />
                Discount ({appliedOffer.code})
              </span>
              <span className="font-medium text-green-600 text-sm">
                -{discountAmount.toFixed(2)} AED
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">VAT (5%)</span>
            <span className="font-medium text-sm">AED {(finalAmount * 0.05).toFixed(2)}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-base font-semibold">Total to Pay</span>
              <span className="text-base font-bold text-gray-600">
                AED {(finalAmount + (finalAmount * 0.05) + extraPrice + codFee).toFixed(2)}
              </span>
            </div>
            {appliedOffer && (
              <div className="text-sm text-green-600 mt-1">
                You saved AED {discountAmount.toFixed(2)}!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="text-center hidden md:block">
        <button
          onClick={handleBookNow}
          disabled={!selectedPayment || isLoading}
          className={`w-full py-4 font-semibold text-white text-lg transition-all flex items-center justify-center gap-3 ${
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
            <>
              Book Now
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Add New Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-xl md:rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out">
            {/* Draggable Handle - Mobile Only */}
            <div className="flex md:hidden justify-center mb-4">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Card</h2>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Card Holder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01788e] focus:border-[#01788e] pr-12"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Credit Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01788e] focus:border-[#01788e] pr-12"
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Expiry Date and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01788e] focus:border-[#01788e] pr-12"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter CVV"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01788e] focus:border-[#01788e] pr-12"
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    We will reserve and then release AED 1 to confirm your card.
                  </p>
                </div>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => {
                setShowAddCardModal(false);
                // Here you can add logic to handle card addition
              }}
              className="w-full bg-[#ed6329] text-white py-4 font-semibold text-lg mt-6 hover:bg-orange-600 transition-colors"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      )}

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
