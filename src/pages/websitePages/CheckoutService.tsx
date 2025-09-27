/* eslint-disable @typescript-eslint/no-explicit-any */
import StepFour from "@/components/website/Steps/StepFour";
import StepOne from "@/components/website/Steps/StepOne";
import StepThree from "@/components/website/Steps/StepThree";
import StepTwo from "@/components/website/Steps/StepTwo";
import { ArrowLeft, Info, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/website/LoginModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "@/config/api";
import Calculation from "./Calculation";
import { ziinaService } from "@/services/ziinaService";
import { useToast } from "@/hooks/use-toast";

// Small reusable AED icon component (uses public/aed.svg)
const AEDIcon = ({ className = "inline-block w-4 h-4 mr-2" }: { className?: string }) => (
  <img src="/aed.svg" alt="AED" className={className} />
);

interface Service {
  id: string;
  name: string;
  price: number;
  [key: string]: any;
}

interface CartItem {
  service: Service;
  count: number;
}

interface SelectedDateTime {
  professional: string | null;
  date: string | null;
  dbDate?: string | null;
  time: string | null;
  displayTime?: string | null;
  extra_price?: number;
}

interface SelectedAddress {
  id: number;
  type: string;
  displayName: string;
  address: string;
  area: string;
  city: string;
  apartmentNo?: string;
}

interface CheckoutServiceProps {
  category?: string;
  serviceSlug?: string;
}

const CheckoutService = ({ category, serviceSlug }: CheckoutServiceProps) => {
  const [step, setStep] = useState<number>(1);
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>({});
  const [selectedDateTime, setSelectedDateTime] = useState<SelectedDateTime>({
    professional: null,
    date: null,
    time: null,
  });
  const [selectedAddress, setSelectedAddress] =
    useState<SelectedAddress | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Offer code states
  const [offerCode, setOfferCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [isValidatingOffer, setIsValidatingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  
  const auth = useAuth();
  const { toast } = useToast();

  const cartItemsArray = Object.values(cartItems).filter(
    (item) => item.count > 0
  );
  
  // Compute the service category slug for date/time filtering
  const firstItem = cartItemsArray[0];
  const serviceCategorySlug = 
    firstItem?.service?.category_slug ||
    firstItem?.service?.context?.selectedCategorySlug ||
    category?.toLowerCase()?.replace(/\s+/g, '-') || null;
  
  const subtotal = cartItemsArray.reduce((total, item) => {
    return total + item.service.price * item.count;
  }, 0);
  
  // Calculate discount amount from applied offer if not already set
  let calculatedDiscount = discountAmount;
  if (appliedOffer && discountAmount === 0) {
    if (appliedOffer.discount_type === 'percentage') {
      calculatedDiscount = subtotal * (parseFloat(appliedOffer.discount_value) / 100);
    } else if (appliedOffer.discount_type === 'fixed') {
      calculatedDiscount = parseFloat(appliedOffer.discount_value);
    }
  }
  
  const discount = calculatedDiscount; // Use calculated discount amount
  console.log("CheckoutService - Debug:", { subtotal, discount, discountAmount, calculatedDiscount, appliedOffer });
  const extraPrice = Number(selectedDateTime.extra_price) || 0;
  const finalAmount = Math.max(0, subtotal - discount); // Calculate final amount after discount
  const totalToPay = finalAmount + extraPrice;
  
  // Calculate final total with VAT for monthly installment
  const finalTotalWithVAT = finalAmount + extraPrice + (finalAmount + extraPrice) * 0.05;
  const monthlyInstallment = (finalTotalWithVAT / 4).toFixed(2);

  const navigate = useNavigate();

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
          serviceIds: cartItemsArray.map(item => item.service.id)
        })
      });

      const data = await response.json();
      console.log("API Response:", response.status, data); // Debug log

      if (data.success) {
        setAppliedOffer(data.offer);
        setDiscountAmount(data.discountAmount);
        setOfferError("");
        setShowOfferInput(false);
        toast({
          title: "Offer Applied!",
          description: `You saved AED ${data.discountAmount.toFixed(2)} with ${data.offer.name}`,
          variant: "default"
        });
        console.log("Offer applied successfully:", data);
      } else {
        setOfferError(data.message || "Invalid offer code");
        setAppliedOffer(null);
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error('Error validating offer code:', error);
      setOfferError("Failed to validate offer code. Please try again.");
      
      // Temporary fallback for testing - remove this in production
      if (offerCode.trim().toUpperCase() === 'IX90IJCP') {
        console.log("Using fallback calculation for IX90IJCP");
        const calculatedDiscount = subtotal * 0.30; // 30% discount
        setAppliedOffer({
          id: 1,
          code: 'IX90IJCP',
          name: '30% Off',
          description: 'Special 30% discount'
        });
        setDiscountAmount(calculatedDiscount);
        setOfferError("");
        setShowOfferInput(false);
        toast({
          title: "Offer Applied! (Fallback)",
          description: `You saved AED ${calculatedDiscount.toFixed(2)} with 30% discount`,
          variant: "default"
        });
      }
    } finally {
      setIsValidatingOffer(false);
    }
  };

  // Remove applied offer
  const removeOffer = () => {
    setAppliedOffer(null);
    setDiscountAmount(0);
    setOfferCode("");
    setOfferError("");
    setShowOfferInput(false);
  };

  // Cart clearing functions
  const clearAllCartData = () => {
    try {
      // Set booking completed flag to prevent cart restoration
      setBookingCompleted(true);
      // Clear localStorage
      localStorage.removeItem('checkout_cart_items');
      localStorage.removeItem('pendingCartItems');
      // Mark that the user intentionally cleared the cart so a refresh won't restore it
      try {
        localStorage.setItem('checkout_cart_cleared', String(Date.now()));
      } catch (e) {
        // ignore
      }
      // Clear React state immediately
      setCartItems({});
      // Also clear any applied offers
      setAppliedOffer(null);
      setDiscountAmount(0);
      setOfferCode("");
      setOfferError("");
      setShowOfferInput(false);
      console.log('All cart data and offers cleared completely');
    } catch (error) {
      console.error('Failed to clear cart data:', error);
    }
  };

  // Cart persistence functions for login flow
  const saveCartToStorage = (cartData: Record<string, CartItem>) => {
    try {
      localStorage.setItem('checkout_cart_items', JSON.stringify(cartData));
      // If we're saving a new cart, remove the cleared flag so future loads can restore
      localStorage.removeItem('checkout_cart_cleared');
      console.log('Cart saved to localStorage');
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const loadCartFromStorage = (): Record<string, CartItem> => {
    try {
      // If user recently cleared the cart, don't restore anything
      const cleared = localStorage.getItem('checkout_cart_cleared');
      if (cleared) {
        try {
          localStorage.removeItem('checkout_cart_items');
          localStorage.removeItem('pendingCartItems');
        } catch (e) {}
        // remove the flag so it doesn't block future legitimate restores
        try {
          localStorage.removeItem('checkout_cart_cleared');
        } catch (e) {}
        return {};
      }
      const saved = localStorage.getItem('checkout_cart_items');
      const pending = localStorage.getItem('pendingCartItems');
      
      // Prioritize pending cart items (from login flow)
      if (pending) {
        const pendingCart = JSON.parse(pending);
        localStorage.removeItem('pendingCartItems'); // Clean up after loading
        return pendingCart;
      }
      
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    return {};
  };

  // Load cart from localStorage on component mount (but not if booking was completed)
  useEffect(() => {
    if (!bookingCompleted) {
      const savedCart = loadCartFromStorage();
      if (Object.keys(savedCart).length > 0) {
        setCartItems(savedCart);
        console.log('Cart restored from localStorage');
      }
    }
  }, [bookingCompleted]);

  // Save cart to localStorage whenever cartItems changes (but not after booking completion)
  useEffect(() => {
    if (!bookingCompleted) {
      if (Object.keys(cartItems).length > 0) {
        saveCartToStorage(cartItems);
      } else {
        // Cart is empty -> remove persisted keys so refresh won't restore old data
        try {
          localStorage.removeItem('checkout_cart_items');
          localStorage.removeItem('pendingCartItems');
          localStorage.setItem('checkout_cart_cleared', String(Date.now()));
        } catch (e) {
          // ignore
        }
      }
    }
  }, [cartItems, bookingCompleted]);

  const handleAddItemsClick = (service: Service) => {
    setCartItems((prev) => {
      const existing = prev[service.id];
      const count = existing ? existing.count + 1 : 1;
      return {
        ...prev,
        [service.id]: { service, count },
      };
    });
  };

  const handleRemoveItemClick = (serviceId: string) => {
    setCartItems((prev) => {
      const existing = prev[serviceId];
      if (!existing) return prev;
      const count = existing.count - 1;
      if (count <= 0) {
        const { [serviceId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [serviceId]: { ...existing, count },
      };
    });
  };

  const handleRemoveItemCompletely = (serviceId: string) => {
    setCartItems((prev) => {
      const { [serviceId]: removed, ...rest } = prev;
      return rest;
    });
  };

  // Transform cartItems to match ServiceItem interface for Calculation component
  const transformedCartItems = Object.fromEntries(
    Object.entries(cartItems).map(([key, item]) => [
      key,
      {
        id: item.service.id,
        title: item.service.name,
        count: item.count,
        currentPrice: item.service.price,
      },
    ])
  );

  const hasItems = Object.keys(cartItems).length > 0;

  const nextStep = () => {
    // If user is not authenticated, open login modal and don't advance
    if (!auth.isAuthenticated && step === 1) {
      setLoginModalOpen(true);
      return;
    }

    setStep((prev) => Math.min(prev + 1, 4));
    // Scroll to top when moving to next step
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    if (step === 1) {
      navigate("/");
    }
    // Scroll to top when moving to previous step
    window.scrollTo(0, 0);
  };

  const goToStep = (targetStep: number) => {
    // Only allow navigation to steps that are accessible
    if (targetStep <= step || targetStep === 1) {
      setStep(targetStep);
      // Scroll to top when navigating to any step
      window.scrollTo(0, 0);
    }
  };

  const handleSelectionChange = (selection: any) => {
    if (selection.address) {
      setSelectedAddress(selection.address);
    }
    if (selection.date || selection.time || selection.professional) {
      setSelectedDateTime((prev) => ({
        ...prev,
        ...selection,
      }));
    }
  };

  const getPaymentMethodName = (paymentId: string) => {
    switch (paymentId) {
      case "card":
        return "Credit/Debit Card";
      case "ziina":
        return "Ziina";
      case "tabby":
        return "Tabby";
      case "cod":
        return "Cash on Delivery";
      default:
        return "Unknown";
    }
  };

  const handleZiinaPayment = async (appointmentData: any) => {
    try {
      // First create the appointment with pending status
      const response = await fetch(buildApiUrl("/api/user/appointments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          ...appointmentData,
          status: "pending",
        }),
      });

      const data = await response.json();

      console.log(
        "CheckoutService - Ziina appointment creation response:",
        data
      );

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      // Check if appointment data exists
      if (!data.appointment_id) {
        console.error("CheckoutService - Missing appointment data:", data);
        throw new Error("Appointment creation failed - missing appointment ID");
      }

      // Create Ziina payment
      const paymentData = {
        amount: appointmentData.price || 0,
        currency: "AED",
        description: `Payment for ${appointmentData.service}`,
        order_id: `appointment_${data.appointment_id}`,
        customer_email: auth.user?.email,
        customer_phone: auth.user?.phone,
        return_url: `${window.location.origin}/order-confirmation?appointment_id=${data.appointment_id}&payment_success=true`,
        cancel_url: `${window.location.origin}/payment-cancelled?appointment_id=${data.appointment_id}`,
      };

      console.log("CheckoutService - Ziina payment data:", paymentData);

      const paymentResponse = await ziinaService.createPaymentViaBackend(
        paymentData
      );

      console.log("CheckoutService - Ziina payment response:", paymentResponse);

      if (paymentResponse.success && paymentResponse.payment_url) {
        // Clear all cart data before redirecting to payment
        clearAllCartData();
        
        // Redirect to Ziina payment page
        window.location.href = paymentResponse.payment_url;
      } else {
        throw new Error(paymentResponse.message || "Failed to create payment");
      }
    } catch (error) {
      console.error("CheckoutService - Ziina payment error:", error);
      throw error;
    }
  };

  const handleRegularPayment = async (appointmentData: any) => {
    const response = await fetch(buildApiUrl("/api/user/appointments"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(appointmentData),
    });

    const data = await response.json();

    if (response.ok) {
      // Clear all cart data after successful booking
      clearAllCartData();
      
      // Navigate to order confirmation page with order data
      navigate("/order-confirmation", {
        state: {
          orderData: {
            ...data.appointment,
            ...appointmentData,
            status: data.appointment?.status || "pending", // Ensure status is always present
          },
        },
      });
      console.log(
        "Booking Confirmed! Your appointment has been successfully booked."
      );
    } else {
      throw new Error(data.message || "Failed to create appointment");
    }
  };

  const handleBookNow = async () => {
    if (!selectedPayment) {
      console.log("Please select a payment method");
      return;
    }

    if (!auth.isAuthenticated) {
      console.log("Please log in to book an appointment");
      setLoginModalOpen(true);
      return;
    }

    if (!selectedDateTime.date || !selectedDateTime.time) {
      console.log("Please select date and time for your appointment");
      return;
    }

    if (!selectedAddress) {
      console.log("Please select a service address");
      return;
    }

    try {
      // Calculate total including COD fee and VAT
      const codFee = selectedPayment === "cod" ? 5 : 0;
      const extraPrice = Number(selectedDateTime.extra_price) || 0;
      const total =
        finalAmount +
        extraPrice +
        codFee +
        (finalAmount + extraPrice + codFee) * 0.05;

      // Extract room type and property type from cart items
      const firstItem = cartItemsArray[0];
      const roomType =
        firstItem?.service?.roomType ||
        firstItem?.service?.context?.selectedRoomType ||
        "Studio";
      const roomTypeSlug = 
        firstItem?.service?.room_type_slug ||
        firstItem?.service?.context?.selectedRoomTypeSlug ||
        "studio";
      const propertyType =
        firstItem?.service?.propertyType ||
        firstItem?.service?.context?.selectedPropertyType ||
        "Apartment";
      const propertyTypeSlug =
        firstItem?.service?.property_type_slug ||
        firstItem?.service?.context?.selectedPropertyTypeSlug ||
        "apartment";
      const serviceCategory = firstItem?.service?.category || category || "general";
      const quantity = firstItem?.count || 1;

      // Prepare appointment data
      // Extract service items category from cart items
      const serviceItemsCategory = cartItemsArray.length > 0 
        ? cartItemsArray[0].service.service_items_category || cartItemsArray[0].service.category 
        : null;

      const appointmentData = {
        service: cartItemsArray
          .map((item) => `${item.service.name} (x${item.count})`)
          .join(", "),
        appointment_date: selectedDateTime.dbDate || selectedDateTime.date,
        appointment_time: selectedDateTime.time,
        location: selectedAddress,
        price: total,
        extra_price: extraPrice,
        cod_fee: codFee,
        discount_amount: discountAmount,
        offer_code: appliedOffer?.code || null,
        room_type: roomType,
        room_type_slug: roomTypeSlug,
        property_type: propertyType,
        property_type_slug: propertyTypeSlug,
        quantity: quantity,
        service_category: serviceCategory,
        service_category_slug: serviceCategorySlug,
        service_items_category: serviceItemsCategory,
        payment_method: getPaymentMethodName(selectedPayment),
        notes: `Payment Method: ${getPaymentMethodName(
          selectedPayment
        )}. Items: ${cartItemsArray
          .map((item) => `${item.service.name} (x${item.count})`)
          .join(", ")}${appliedOffer ? `. Offer: ${appliedOffer.code} (${appliedOffer.name})` : ''}`,
      };

      // Debug: Log the exact data being sent to production
      console.log("CheckoutService - PRODUCTION DEBUG - Full appointment data:", appointmentData);
      console.log("CheckoutService - PRODUCTION DEBUG - selectedDateTime object:", selectedDateTime);
      console.log("CheckoutService - PRODUCTION DEBUG - selectedAddress object:", selectedAddress);
      console.log("CheckoutService - PRODUCTION DEBUG - Data types:", {
        appointment_date: typeof appointmentData.appointment_date,
        appointment_time: typeof appointmentData.appointment_time,
        location: typeof appointmentData.location,
        price: typeof appointmentData.price
      });
      console.log("CheckoutService - PRODUCTION DEBUG - Time value:", appointmentData.appointment_time);
      console.log("CheckoutService - PRODUCTION DEBUG - Date value:", appointmentData.appointment_date);

      // Debug: Log the appointment data being sent
      console.log(
        "CheckoutService - Appointment data being sent:",
        appointmentData
      );
      console.log("CheckoutService - First item details:", firstItem);
      console.log("CheckoutService - Category:", category);
      console.log(
        "CheckoutService - Selected payment method:",
        selectedPayment
      );

      // Handle different payment methods
      if (selectedPayment === "ziina") {
        await handleZiinaPayment(appointmentData);
      } else {
        await handleRegularPayment(appointmentData);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      console.log("Failed to create appointment. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            handleAddItemsClick={handleAddItemsClick}
            handleRemoveItemClick={handleRemoveItemClick}
            cartItems={cartItems}
            category={category}
            serviceSlug={serviceSlug}
          />
        );
      case 2:
        return (
          <StepTwo
            handleAddItemsClick={handleAddItemsClick}
            handleRemoveItemClick={handleRemoveItemClick}
            cartItems={cartItems}
            onSelectionChange={handleSelectionChange}
          />
        );
      case 3:
        console.log('🔍 CheckoutService - Passing category to StepThree:', serviceCategorySlug);
        return <StepThree onSelectionChange={handleSelectionChange} category={serviceCategorySlug} />;
      case 4:
        return (
          <StepFour
            cartItems={cartItemsArray}
            selectedDateTime={selectedDateTime}
            subtotal={subtotal}
            selectedAddress={selectedAddress}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            category={category}
            appliedOffer={appliedOffer}
            discountAmount={calculatedDiscount}
            onOfferChange={(offer, discount) => {
              setAppliedOffer(offer);
              setDiscountAmount(discount);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Step Progress Header */}
      <div className="py-2 md:py-4 px-4 md:px-0">
        <div className="w-full max-w-[1100px] mx-auto">
          <div className="flex justify-center items-center mb-2 md:mb-4">
            <h1 className="hidden md:block text-2xl font-bold text-gray-800">
              {step === 1
                ? "Service Details"
                : step === 2
                ? "Address"
                : step === 3
                ? "Date & Time"
                : "Review & Confirm"}
            </h1>
          </div>

          {/* Horizontal Progress Steps */}
          <div className="flex justify-center items-center gap-1 md:gap-2">
            {[1, 2, 3, 4].map((stepNum, index) => (
              <div key={stepNum} className="flex items-center">
                <div
                  onClick={() => goToStep(stepNum)}
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    stepNum <= step
                      ? "bg-[#01788e] w-20 md:w-28"
                      : "bg-gray-300 w-16 md:w-20"
                  } ${
                    stepNum <= step || stepNum === 1
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  title={`Go to step ${stepNum}`}
                ></div>
                {index < 3 && <div className="w-1 md:w-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

  <section className="w-full max-w-[1000px] mx-auto py-4 gap-2 flex flex-col md:flex-row relative pb-24">
        {/* Conditional Layout for Step 4 */}
        {step === 4 ? (
          <div className="w-full flex justify-center">
            <div className="bg-white rounded shadow md:p-6 max-w-2xl w-full">
              {renderStep()}
            </div>
          </div>
        ) : (
          <>
            {/* Left Section for Steps 1-3 */}
            <div className="w-full px-4 md:max-w-[60%] min-w-0">
              <div className="md:bg-white rounded md:p-6 min-h-[600px]">
                {/* For Step 1, render without the white background wrapper to allow edge-to-edge hero */}
                {step === 1 ? (
                  renderStep()
                ) : (
                  <div className="md:bg-white rounded min-h-[600px]">
                    {renderStep()}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section for Steps 1-3 */}
            <div className="hidden md:block min-w-64">
              <div className="sticky top-40 z-30">
                <div className="bg-white rounded-sm shadow-lg mb-4 w-full max-w-md mx-auto overflow-hidden">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Summary
                    </h2>

                    {/* Service Details */}
                    <div className="mb-2 border-b border-gray-300">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Service Details
                      </h3>
                      <div className="space-y-1">
                        {cartItemsArray.map((item) => (
                          <div
                            key={item.service.id}
                            className="flex justify-between items-center"
                          >
                            <div className="flex-1 pr-2">
                              <span className="text-sm text-gray-600 block truncate" title={`${item.service.name} x ${item.count}`}>
                                {item.service.name} x {item.count}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium flex items-center">
                                <AEDIcon className="inline-block w-4 h-4 mr-2" />{(item.service.price * item.count).toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleRemoveItemClick(item.service.id)}
                                className="hover:bg-gray-100 border border-gray-300 rounded"
                                title="Remove 1"
                              >
                                <X className="w-3 h-3 text-black hover:text-red-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="mb-2 border-b border-gray-300">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Date & Time
                      </h3>
                      <div className="space-y-0.5">
                        <div className="text-sm text-gray-600">
                          {selectedDateTime.date}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedDateTime.displayTime || selectedDateTime.time}
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">
                          Payment Details
                        </h3>
                      </div>

                      {/* Offer Code Section */}
                      {!appliedOffer ? (
                        showOfferInput ? (
                          <div className="mb-3 p-3 border border-gray-200 rounded-lg">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Enter promo code"
                                value={offerCode}
                                onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isValidatingOffer}
                              />
                              <button
                                onClick={validateOfferCode}
                                disabled={isValidatingOffer || !offerCode.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 text-sm min-w-[70px]"
                              >
                                {isValidatingOffer ? "..." : "Apply"}
                              </button>
                            </div>
                            {offerError && (
                              <p className="text-red-500 text-xs">{offerError}</p>
                            )}
                            <button
                              onClick={() => setShowOfferInput(false)}
                              className="text-xs text-gray-500 underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 cursor-pointer">
                              Discount
                            </span>
                            <button
                              onClick={() => setShowOfferInput(true)}
                              className="text-xs underline text-[#01788e]"
                            >
                              Apply promo
                            </button>
                          </div>
                        )
                      ) : (
                        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-green-800">{appliedOffer.name}</p>
                              <p className="text-xs text-green-600">Code: {appliedOffer.code}</p>
                            </div>
                            <button
                              onClick={removeOffer}
                              className="text-red-500 hover:text-red-700 text-xs underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {cartItemsArray.length > 0 && (
                        <>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">
                              Service Charges
                            </span>
                            <span className="text-sm flex items-center"><AEDIcon className="inline-block w-4 h-4 mr-2" />{subtotal.toFixed(2)}</span>
                          </div>

                          {appliedOffer && calculatedDiscount > 0 && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-green-600">
                                Discount ({appliedOffer.code})
                              </span>
                              <span className="text-sm text-green-600 flex items-center">-<AEDIcon className="inline-block w-4 h-4 mr-2" />{calculatedDiscount.toFixed(2)}</span>
                            </div>
                          )}

                          {selectedDateTime.extra_price &&
                            Number(selectedDateTime.extra_price) > 0 && (
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">
                                  Time Slot Fee
                                </span>
                                <span className="text-sm text-gray-600">
                                  +
                                  {Number(selectedDateTime.extra_price).toFixed(
                                    2
                                  )}{" "}
                                  AED
                                </span>
                              </div>
                            )}

                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">
                              Sub Total
                            </span>
                            <span className="text-sm">
                              AED{" "}
                              {(
                                finalAmount +
                                (Number(selectedDateTime.extra_price) || 0)
                              ).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              VAT (5%)
                            </span>
                            <span className="text-sm">
                              AED{" "}
                              {(
                                (finalAmount +
                                  (Number(selectedDateTime.extra_price) || 0)) *
                                0.05
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center text-gray-600 border-t pt-2">
                        <span className="font-semibold text-md">
                          Total to pay
                        </span>
                        <span className="font-bold text-lg">
                          AED{" "}
                          {(
                            finalAmount +
                            (Number(selectedDateTime.extra_price) || 0) +
                            (finalAmount +
                              (Number(selectedDateTime.extra_price) || 0)) *
                              0.05
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fixed Next Button - Desktop Only */}
        {step < 4 && (
          <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="w-full max-w-[400px] mx-auto">
              <button
                onClick={nextStep}
                disabled={!hasItems}
                className={`w-3/4 mx-auto py-4 font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  !hasItems ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
                }`}
              >
                <span>NEXT</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Mobile Bottom Drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-40">
        <div className="px-4 py-4">
          <Calculation
            cartItems={transformedCartItems}
            selectedDateTime={selectedDateTime}
            nextStep={nextStep}
            hasItems={hasItems}
            selectedPayment={selectedPayment}
            handleRemoveItemClick={handleRemoveItemClick}
            handleBookNow={handleBookNow}
            currentStep={step}
            discountAmount={calculatedDiscount}
            appliedOffer={appliedOffer}
          />
        </div>
      </div>

      {/* Modal */}
      {loginModalOpen && (
        <LoginModal 
          setLoginModalOpen={setLoginModalOpen} 
          redirectTo={window.location.pathname + window.location.search}
        />
      )}
    </div>
  );
};

export default CheckoutService;
