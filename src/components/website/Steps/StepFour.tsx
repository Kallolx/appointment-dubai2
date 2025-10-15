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
  onCartItemsChange = (items) => {},
  isBookingLoading = false,
}) => {
  // helper to make labels nicer
  const formatLabel = (s) => {
    if (!s) return '';
    // replace dashes/underscores and collapse spaces
    const cleaned = String(s).replace(/[-_]+/g, ' ').trim();
    return cleaned
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  // Local cart items state to allow quantity changes in final step
  const [localItems, setLocalItems] = useState(() => cartItems || []);
  
  // Offer code states (now received as props, keeping local state for validation)
  const [offerCode, setOfferCode] = useState("");
  const [isValidatingOffer, setIsValidatingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [finalAmount, setFinalAmount] = useState(0);

  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Local AED icon helper (uses public/aed.svg)
  const AEDIcon = ({ className = "w-4 h-4 inline-block mr-1" }: { className?: string }) => (
    <img src="/aed.svg" alt="AED" className={className} />
  );

  // Google Maps refs and loader
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const { isLoaded } = useGoogleMapsLoader();
  const [expandedItemId, setExpandedItemId] = useState<string | number | null>(
    null
  );

  // Sync prop changes into local items
  useEffect(() => {
    setLocalItems(cartItems || []);
  }, [cartItems]);

  // Compute local subtotal based on quantities
  const localSubtotal = localItems.reduce((sum, it) => {
    const price = typeof it.service.price === 'number' ? it.service.price : parseFloat(it.service.price) || 0;
    const qty = it.count || 1;
    return sum + price * qty;
  }, 0);

  // Update final amount when localSubtotal or discount changes
  useEffect(() => {
    setFinalAmount(Math.max(0, localSubtotal - discountAmount));
  }, [localSubtotal, discountAmount]);

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
          orderAmount: localSubtotal,
          serviceIds: localItems.map(item => item.id || item.serviceId || item.service?.id || item.service?.serviceId)
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

  // Calculate fees and totals (use localSubtotal so changes reflect immediately)
  const extraPrice = Number(selectedDateTime?.extra_price) || 0;
  const codFee = selectedPayment === "cod" ? 5 : 0;
  const vat = (localSubtotal + extraPrice + codFee) * 0.05;
  const total = localSubtotal + extraPrice + codFee + vat;

  // Fetch available offers from database
  useEffect(() => {
    const fetchAvailableOffers = async () => {
      try {
        const response = await fetch(buildApiUrl('/api/offers/active'));
        if (response.ok) {
          const data = await response.json();
          setAvailableOffers(data);
        }
      } catch (error) {
        console.error('Error fetching available offers:', error);
      }
    };

    fetchAvailableOffers();
  }, []);

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
      // Calculate fees (will be distributed across appointments)
      const codFee = selectedPayment === "cod" ? 5 : 0;
      const extraPrice = Number(selectedDateTime.extra_price) || 0;
      
      // Calculate per-item discount if offer is applied
      const perItemDiscount = discountAmount / localItems.length;
      
      // Distribute COD fee and extra price across items proportionally
      const totalItemsPrice = localSubtotal;
      
      // Create separate appointments for each cart item
      const appointmentPromises = localItems.map(async (item, index) => {
        const itemPrice = typeof item.service.price === 'number' 
          ? item.service.price 
          : parseFloat(item.service.price) || 0;
        
        const itemTotal = itemPrice * (item.count || 1);
        const itemProportion = itemTotal / totalItemsPrice;
        
        // Distribute fees proportionally
        const itemCodFee = index === 0 ? codFee : 0; // Add COD fee to first item only
        const itemExtraPrice = Math.round(extraPrice * itemProportion * 100) / 100;
        const itemDiscountAmount = Math.round(perItemDiscount * 100) / 100;
        
        const roomType = item.service?.roomType || item.service?.context?.selectedRoomType || 'Studio';
        const propertyType = item.service?.propertyType || item.service?.context?.selectedPropertyType || 'Apartment';
        
        const appointmentData = {
          service: `${item.service.name} (x${item.count || 1})`,
          appointment_date: selectedDateTime.dbDate || selectedDateTime.date,
          appointment_time: selectedDateTime.time,
          location: selectedAddress,
          price: itemTotal - itemDiscountAmount, // Item price after discount
          original_price: itemTotal,
          discount_amount: itemDiscountAmount,
          extra_price: itemExtraPrice,
          cod_fee: itemCodFee,
          room_type: roomType,
          property_type: propertyType,
          quantity: item.count || 1,
          service_category: item.service?.category || category || 'general',
          service_items_category: item.service.service_items_category || item.service.category,
          payment_method: getPaymentMethodName(selectedPayment),
          offer_code_id: index === 0 ? (appliedOffer?.id || null) : null, // Apply offer to first item only
          notes: `Payment Method: ${getPaymentMethodName(selectedPayment)}${appliedOffer && index === 0 ? `. Applied Offer: ${appliedOffer.name} (${appliedOffer.code})` : ''}${localItems.length > 1 ? `. Part of multi-service booking (${index + 1}/${localItems.length})` : ''}`,
        };

        return appointmentData;
      });

      const appointmentsData = await Promise.all(appointmentPromises);

      console.log('StepFour - Creating separate appointments:', appointmentsData);

      // Handle different payment methods
      if (selectedPayment === "ziina") {
        await handleZiinaPayment(appointmentsData);
      } else {
        await handleRegularPayment(appointmentsData);
      }
    } catch (error) {
      console.error("Error creating appointments:", error);
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

  const handleRegularPayment = async (appointmentsData: any[]) => {
    // Create all appointments
    const createdAppointments = [];
    
    for (const appointmentData of appointmentsData) {
      const response = await fetch(buildApiUrl("/api/user/appointments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create appointment");
      }

      createdAppointments.push(data.appointment);
    }

    // Apply offer code to the first appointment if one was used
    if (appliedOffer && createdAppointments[0]?.id) {
      try {
        await fetch(buildApiUrl('/api/offer-codes/apply'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            offerId: appliedOffer.id,
            orderAmount: localSubtotal,
            appointmentId: createdAppointments[0].id
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
    
    // Navigate to order confirmation page with all appointments data
    navigate("/order-confirmation", {
      state: {
        orderData: createdAppointments.length === 1 
          ? createdAppointments[0]
          : {
              appointments: createdAppointments,
              isMultipleBookings: true,
              totalBookings: createdAppointments.length
            },
      },
    });
    
    toast({
      title: "Booking Confirmed!",
      description: `${createdAppointments.length} appointment${createdAppointments.length > 1 ? 's have' : ' has'} been successfully booked.`,
    });
  };

  const handleZiinaPayment = async (appointmentsData: any[]) => {
    try {
      // Create all appointments with pending payment status
      const createdAppointments = [];
      
      for (const appointmentData of appointmentsData) {
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

        createdAppointments.push(data.appointment_id);
      }

      // Calculate total with VAT for all appointments
      const codFee = 0; // No COD fee for Ziina
      const extraPrice = Number(selectedDateTime.extra_price) || 0;
      const total = localSubtotal + extraPrice + (localSubtotal + extraPrice) * 0.05;

      // Create single Ziina payment for all appointments
      const appointmentIds = createdAppointments.join(',');
      const serviceDescription = appointmentsData.map(a => a.service).join(', ');
      
      const paymentData = {
        amount: total,
        currency: "AED",
        description: `Payment for ${appointmentsData.length} service${appointmentsData.length > 1 ? 's' : ''}: ${serviceDescription}`,
        order_id: `appointments_${appointmentIds}`,
        customer_email: user?.email,
        customer_phone: user?.phone,
        return_url: `${window.location.origin}/order-confirmation?appointment_ids=${appointmentIds}&payment_success=true`,
        cancel_url: `${window.location.origin}/payment-cancelled?appointment_ids=${appointmentIds}`,
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
          {(() => {
            // Group items by category
            type CartItem = typeof localItems[0];
            const grouped = localItems.reduce((acc, item) => {
              const cat = item.service.category || 'uncategorized';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {} as Record<string, CartItem[]>);

            return Object.entries(grouped).map(([category, items]: [string, CartItem[]]) => {
              const firstItem = items[0];
              const isOpen = expandedItemId === category;
              // Use any item's image from this category
              const imgSrc =
                firstItem.service.image_url ||
                firstItem.service.image ||
                firstItem.service.imageUrl ||
                firstItem.service.thumbnail ||
                "";
              
              return (
                <div
                  key={category}
                  className="bg-white border-2 border-gray-200 mb-4 rounded-sm p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={imgSrc || "/placeholder.svg"}
                      alt={category}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatLabel(category)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedItemId(isOpen ? null : category)
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
                      {/* Show all items in this category */}
                      {items.map((item) => (
                        <div key={item.service.id} className="flex text-gray-500 text-sm items-center py-1">
                          <div className="flex-1 min-w-0 mr-3">
                            <span
                              className="block text-sm text-gray-700 whitespace-normal break-words"
                              title={`${formatLabel(item.service.context?.selectedRoomType || item.service.roomType || 'Studio')} - ${formatLabel(item.service.service_items_category || item.service.serviceItemCategory || item.service.category || 'General')} x ${item.count || 1}`}
                            >
                              {formatLabel(item.service.context?.selectedRoomType || item.service.roomType || 'Studio')} - {formatLabel(item.service.service_items_category || item.service.serviceItemCategory || item.service.category || 'General')} x {item.count || 1}
                            </span>
                          </div>

                          <div className="flex-none flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const updated = localItems.map((li) => {
                                  if ((li.service.id || li.service.serviceId) === (item.service.id || item.service.serviceId)) {
                                    const newCount = Math.max(0, (li.count || 1) - 1);
                                    return { ...li, count: newCount };
                                  }
                                  return li;
                                }).filter(li => (li.count || 1) > 0);
                                setLocalItems(updated);
                                onCartItemsChange(updated);
                                try {
                              localStorage.setItem('checkout_cart_items', JSON.stringify(updated));
                              localStorage.setItem('pendingCartItems', JSON.stringify(updated));
                            } catch (err) {
                              console.error('Failed to persist cart items', err);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded text-sm"
                          title="Decrease quantity"
                        >
                          <span className="select-none">−</span>
                        </button>
                        <div className="w-6 text-center text-sm">{item.count || 1}</div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = localItems.map((li) => {
                              if ((li.service.id || li.service.serviceId) === (item.service.id || item.service.serviceId)) {
                                const newCount = (li.count || 1) + 1;
                                return { ...li, count: newCount };
                              }
                              return li;
                            });
                            setLocalItems(updated);
                            onCartItemsChange(updated);
                            try {
                              localStorage.setItem('checkout_cart_items', JSON.stringify(updated));
                              localStorage.setItem('pendingCartItems', JSON.stringify(updated));
                            } catch (err) {
                              console.error('Failed to persist cart items', err);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded text-sm"
                          title="Increase quantity"
                        >
                          <span className="select-none">+</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = localItems.filter((li) => (li.service.id || li.service.serviceId) !== (item.service.id || item.service.serviceId));
                            setLocalItems(updated);
                            onCartItemsChange(updated);
                            try {
                              localStorage.setItem('checkout_cart_items', JSON.stringify(updated));
                              localStorage.setItem('pendingCartItems', JSON.stringify(updated));
                            } catch (err) {
                              console.error('Failed to persist cart items', err);
                            }
                          }}
                          className="ml-1 w-7 h-7 p-0.5 text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="ml-2 text-right min-w-[64px]">
                          <span className="text-sm">
                            <AEDIcon className="w-4 h-4 inline-block mr-1" />
                            {(
                              (typeof item.service.price === 'number'
                                ? item.service.price
                                : parseFloat(item.service.price) || 0) * (item.count || 1)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}

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
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900 flex items-center gap-2">
            Offers & Discounts
          </h2>
          {!appliedOffer && (
            <button
              onClick={() => setShowOffersModal(true)}
              className="text-blue-600 underline text-sm font-medium hover:text-blue-700"
            >
              Apply
            </button>
          )}
        </div>
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
                      + <AEDIcon className="w-3 h-3 inline-block mr-1" />5
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
            <span className="font-medium text-sm"><AEDIcon className="w-4 h-4 inline-block mr-1" />{localSubtotal.toFixed(2)}</span>
          </div>

          {extraPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Time Slot Fee</span>
              <span className="font-medium text-orange-600 text-sm">
                +<AEDIcon className="w-4 h-4 inline-block mr-1" />{extraPrice.toFixed(2)}
              </span>
            </div>
          )}

          {codFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Cash on Delivery Fee</span>
              <span className="font-medium text-orange-600 text-sm">
                +<AEDIcon className="w-4 h-4 inline-block mr-1" />{codFee.toFixed(2)}
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
                -<AEDIcon className="w-4 h-4 inline-block mr-1" />{discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">VAT (5%)</span>
            <span className="font-medium text-sm"><AEDIcon className="w-4 h-4 inline-block mr-1" />{(finalAmount * 0.05).toFixed(2)}</span>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-base font-semibold">Total to Pay</span>
              <span className="text-base font-bold text-gray-600">
                <AEDIcon className="w-4 h-4 inline-block mr-1" />{(finalAmount + (finalAmount * 0.05) + extraPrice + codFee).toFixed(2)}
              </span>
            </div>
            {appliedOffer && (
              <div className="text-sm text-green-600 mt-1">
                You saved <AEDIcon className="w-4 h-4 inline-block mr-1" />{discountAmount.toFixed(2)}!
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

      {/* Offers Modal */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-xl md:rounded-lg w-full md:max-w-lg max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out">
            {/* Draggable Handle - Mobile Only */}
            <div className="flex md:hidden justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Apply Offer Code</h2>
              <button
                onClick={() => {
                  setShowOffersModal(false);
                  setOfferError("");
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 py-6 space-y-6">
              {/* Offer Code Input */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={offerCode}
                    onChange={(e) => {
                      setOfferCode(e.target.value.toUpperCase());
                      setOfferError("");
                    }}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      offerError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    onClick={validateOfferCode}
                    disabled={isValidatingOffer || !offerCode.trim()}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isValidatingOffer ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
                {offerError && (
                  <p className="mt-2 text-sm text-red-600">{offerError}</p>
                )}
              </div>

              {/* Available Offers */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Available Offers</h3>
                
                {availableOffers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No offers available at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableOffers.map((offer) => (
                      <div
                        key={offer.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Left side - Offer details */}
                          <div className="flex-1">
                            <div className="flex flex-col gap-1">
                              {/* Discount Value */}
                              {offer.discount_type === 'percentage' && (
                                <span className="text-green-600 font-bold text-lg">
                                  {offer.discount_value}% OFF
                                </span>
                              )}
                              {offer.discount_type === 'fixed' && (
                                <span className="text-green-600 font-bold text-lg">
                                  <AEDIcon className="w-4 h-4 inline-block" />
                                  {offer.discount_value} OFF
                                </span>
                              )}
                              
                              {/* Code */}
                              <span className="text-gray-900 font-semibold text-sm">
                                {offer.code}
                              </span>
                              
                              {/* Valid Till */}
                              <span className="text-gray-500 text-xs">
                                Valid till: {new Date(offer.end_date).toLocaleDateString('en-GB', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                          
                          {/* Right side - Apply button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOfferCode(offer.code);
                              validateOfferCode();
                            }}
                            className="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepFour;
