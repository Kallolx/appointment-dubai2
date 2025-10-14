import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  X,
  Phone,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import { buildApiUrl } from "@/config/api";
import EditDateTimeModal from "@/components/website/modals/EditDateTimeModal";
import EditAddressModal from "@/components/website/modals/EditAddressModal2";
import EditPaymentModal from "@/components/website/modals/EditPaymentModal";

interface OrderData {
  id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  location: string | object;
  price: number | string;
  status: string;
  notes?: string;
  created_at: string;
  service_category?: string;
  property_type?: string;
  room_type?: string;
  quantity?: number;
  [key: string]: any;
}

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  // Local AED icon helper (uses public/aed.svg)
  const AEDIcon = ({ className = "w-4 h-4 inline-block mr-1" }: { className?: string }) => (
    <img src="/aed.svg" alt="AED" className={className} />
  );
  
  // Modal states
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [categoryHeroImage, setCategoryHeroImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Always fetch fresh data from backend first
    if (bookingId) {
      fetchBookingDetails();
    } else {
      // Only use location state if no bookingId (fallback)
      const order = location.state?.orderData;
      if (order) {
        setOrderData(order);
      }
    }

    // Check for payment success/failure parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const paymentCancelled = urlParams.get('payment_cancelled');

    if (paymentSuccess === 'true') {
      // Handle successful payment
      handlePaymentSuccess();
    } else if (paymentCancelled === 'true') {
      // Handle cancelled payment
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive",
        duration: 5000,
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Show toast if redirected from ManageBooking with updates
    if (location.state?.showUpdateToast) {
      const updateType = location.state.updateType;
      let message = "Your booking has been updated successfully!";

      if (updateType === "date") {
        message = "Your booking date and time have been updated successfully!";
      } else if (updateType === "address") {
        message = "Your booking address has been updated successfully!";
      } else if (updateType === "payment") {
        message = "Your payment method has been updated successfully!";
      }

      toast({
        title: "Booking Updated",
        description: message,
        duration: 5000,
      });
    }
  }, [location.state, navigate, bookingId, toast]);

  // When we have orderData, try to fetch the service-items-category to get the hero image
  useEffect(() => {
    const fetchCategoryHero = async () => {
      try {
        const catSlug = (orderData?.service_items_category || orderData?.service_category || "").toString();
        if (!catSlug) return;

        // Use the public API used in StepOne: filter by parentCategorySlug
        const url = buildApiUrl(`/api/service-items-category?parentCategorySlug=${encodeURIComponent(catSlug)}`);
        const resp = await fetch(url);
        if (!resp.ok) {
          console.debug("No category hero image found, status:", resp.status);
          return;
        }
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          if (first && (first.hero_image_url || first.hero_image)) {
            setCategoryHeroImage(first.hero_image_url || first.hero_image || null);
            console.log("BookingDetails - using category hero image:", first.hero_image_url || first.hero_image);
            return;
          }
        }
      } catch (e) {
        console.warn("Error fetching category hero image:", e);
      }
    };

    if (orderData) fetchCategoryHero();
  }, [orderData]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        buildApiUrl(`/api/user/appointments/${bookingId}`),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched booking details from backend:", data);
        setOrderData(data);
      } else {
        console.error("Failed to fetch booking details");
        // If backend fetch fails, try to use location state data
        const order = location.state?.orderData;
        if (order) {
          setOrderData(order);
        } else {
          navigate("/user/bookings");
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      // Fallback to location state data
      const order = location.state?.orderData;
      if (order) {
        setOrderData(order);
      } else {
        navigate("/user/bookings");
      }
    }
  };

  // Debug: Log the current orderData
  useEffect(() => {
    if (orderData) {
      console.log("BookingDetails - Current orderData:", orderData);
      console.log("BookingDetails - room_type:", orderData.room_type);
      console.log("BookingDetails - property_type:", orderData.property_type);
      console.log("BookingDetails - quantity:", orderData.quantity);
      console.log(
        "BookingDetails - service_category:",
        orderData.service_category
      );
    }
  }, [orderData]);

  const handleEditClick = (section: string) => {
    switch (section) {
      case 'date':
      case 'time':
        setIsDateTimeModalOpen(true);
        break;
      case 'address':
        setIsAddressModalOpen(true);
        break;
      case 'payment':
        setIsPaymentModalOpen(true);
        break;
      default:
        // Fallback to original manage booking page for other sections
        if (orderData) {
          navigate(`/manage-booking/${orderData.id}`, {
            state: { orderData, editSection: section },
          });
        }
        break;
    }
  };

  const handleBookingUpdate = (updatedData: any) => {
    setOrderData(updatedData);
    // Optionally refetch from backend to ensure consistency
    if (bookingId) {
      fetchBookingDetails();
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !bookingId) return;

      // Update appointment with successful payment info
      const response = await fetch(
        buildApiUrl(`/api/user/appointments/${bookingId}`),
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payment_method: 'Pay with Credit/Debit Card',
            status: 'confirmed'
          })
        }
      );

      if (response.ok) {
        // Refresh booking data
        await fetchBookingDetails();
        
        // Show success toast
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully. Your booking is now confirmed.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Payment Processed",
        description: "Your payment was successful, but there was an issue updating your booking status. Please contact support if needed.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const getPaymentMethod = () => {
    if (!orderData) return "";
    if (orderData.payment_method) return orderData.payment_method;
    const notes = (orderData.notes || "").toString();
    const match = notes.match(/Payment Method:\s*([^\.\n]+)/i);
    if (match) return match[1].trim();
    // fallback check for common words
    if (notes.toLowerCase().includes("cash on delivery"))
      return "Cash on Delivery";
    if (notes.toLowerCase().includes("ziina")) return "Ziina";
    return "";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLocationDisplay = (location: string | object) => {
    // If it's a string, try to parse it as JSON first
    if (typeof location === "string") {
      try {
        const parsedLocation = JSON.parse(location);
        return formatAddressFromObject(parsedLocation);
      } catch {
        // If parsing fails, return the string as is
        return location;
      }
    }

    // If it's already an object, format it
    if (typeof location === "object" && location !== null) {
      return formatAddressFromObject(location);
    }

    return "Address not available";
  };

  const formatAddressFromObject = (loc: any) => {
    const addressParts = [];

    // For saved addresses from database (raw JSON format)
    if (loc.address_line1) {
      addressParts.push(loc.address_line1);
      if (loc.address_line2) addressParts.push(loc.address_line2);
      if (loc.state) addressParts.push(loc.state);
      if (loc.city) addressParts.push(loc.city);
      if (loc.postal_code && loc.postal_code !== "00000")
        addressParts.push(loc.postal_code);
      if (loc.country) addressParts.push(loc.country);
    }
    // For addresses from map/form
    else if (loc.address) {
      addressParts.push(loc.address);
      if (loc.apartmentNo) addressParts.push(loc.apartmentNo);
      if (loc.area) addressParts.push(loc.area);
      if (loc.city) addressParts.push(loc.city);
    }
    // For other object formats
    else {
      // Try to extract any available address fields
      const possibleFields = [
        "street",
        "building",
        "apartment",
        "area",
        "district",
        "city",
        "state",
        "country",
      ];
      for (const field of possibleFields) {
        if (loc[field]) {
          addressParts.push(loc[field]);
        }
      }
    }

    return addressParts.length > 0
      ? addressParts.join(", ")
      : "Address not available";
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const getServiceCategoryImage = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "general_cleaning":
        return "/general_cleaning/1.webp";
      case "healthcare_at_home":
        return "/healthcare_at_home/1.webp";
      case "salons_and_spa":
        return "/salons_and_spa/1.webp";
      case "pest_control":
        return "/icons/pest.webp";
      case "maintenance":
        return "/icons/maintanance.webp";
      case "deep_cleaning":
        return "/icons/deepClean.webp";
      default:
        return "/general_cleaning/1.webp"; // Default fallback
    }
  };

  const getServiceCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "pest_control":
        return "/icons/pest.webp";
      case "maintenance":
        return "/icons/maintanance.webp";
      case "deep_cleaning":
        return "/icons/deepClean.webp";
      case "healthcare_at_home":
        return "/icons/health.webp";
      case "salons_and_spa":
        return "/icons/spa.webp";
      case "general_cleaning":
        return "/icons/cleaning.webp";
      default:
        return "/icons/cleaning.webp"; // Default fallback
    }
  };

  const formatLabel = (s?: string) => {
    if (!s) return "";
    return String(s)
      .replace(/[-_]+/g, " ")
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  if (!orderData) {
    return (
      <div>
        <Navbar />
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

  const referenceId = `20250${(orderData.id || 0)
    .toString()
    .padStart(6, "0")}MPDXB`;

  // Derive payment summary (service charges, COD fee, VAT, total)
  const totalPrice =
    typeof orderData.price === "string"
      ? parseFloat(orderData.price)
      : orderData.price;
  const isCOD = (orderData.notes || "")
    .toLowerCase()
    .includes("cash on delivery");
  const codFee = isCOD ? 5 : 0;
  const serviceCharges = Math.max(0, (totalPrice - codFee) / 1.05);
  const vatAmount = Math.max(0, totalPrice - codFee - serviceCharges);

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
              Booking Details
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          {/* Hero image based on service category */}
          <div className="overflow-hidden rounded-lg mb-4">
            <img
              src={
                categoryHeroImage ||
                getServiceCategoryImage(orderData.service_category)
              }
              alt="Booking"
              className="w-full h-36 md:h-48 object-cover"
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
            <div className={`transition-all duration-300`}>
              <CardContent className="p-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Vertical Timeline */}
                    <div className="relative">
                      {isTimelineExpanded && (
                        <div
                          className={`absolute left-2.5 top-0 w-0.5 bg-gray-200 md:h-40 h-52`}
                        ></div>
                      )}
                      {/* Booking Requested */}
                      <div className={`flex items-start gap-4 mb-6`}>
                        <div className="relative z-10">
                          <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <h3 className="font-semibold text-gray-900 text-base">
                            Booking requested
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            Your booking has been received. Please wait for
                            confirmation from a service provider.
                          </p>
                        </div>
                      </div>
                      {/* Booking Confirmed */}
                      {isTimelineExpanded && (
                        <div className="flex items-start gap-4 mb-6">
                          <div className="relative z-10">
                            <div className="w-6 h-6 bg-[#01788e] rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              Booking confirmed
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {orderData.status === "confirmed" ||
                              orderData.status === "completed"
                                ? "A service provider has accepted your booking. Your booking will be delivered as per the booked date and time."
                                : "Waiting for service provider confirmation..."}
                            </p>
                          </div>
                        </div>
                      )}
                      {/* Booking Delivered */}
                      {isTimelineExpanded && (
                        <div className="flex items-start gap-4">
                          <div className="relative z-10">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                orderData.status === "completed"
                                  ? "bg-[#01788e]"
                                  : "bg-white border-2 border-gray-300"
                              }`}
                            >
                              {orderData.status === "completed" && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              Booking delivered
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {orderData.status === "completed"
                                ? "Your booking has been completed successfully."
                                : "Your booking will be completed soon."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {isTimelineExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>

          {/* Service Details - Expandable Card */}
          <div className="">
            {/* Service Details Header */}
            <div className="px-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Details
                </h2>
                <button className="p-1 rounded-full hover:bg-gray-100"></button>
              </div>
            </div>

            {/* Service Details Content */}
            <div className="p-2">
              {/* Service Item Details */}
              <div className="border-2 border-gray-200 rounded-md p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={
                        (orderData.service_image as string) ||
                        (orderData.image as string) ||
                        getServiceCategoryIcon(orderData.service_category)
                      }
                      alt={orderData.service}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="md:truncate">
                        <h3 className="text-base font-medium text-gray-900" title={formatLabel(orderData.service_items_category || orderData.service_category || orderData.service)}>
                          {formatLabel(orderData.service_category)}
                        </h3>
                        <div className="text-sm text-gray-600 md:truncate break-words whitespace-normal" title={`${formatLabel(orderData.room_type)} - ${formatLabel(orderData.service_items_category || orderData.service_category || orderData.service)} x ${orderData.quantity || 1}`}>
                          {formatLabel(orderData.room_type)} - {formatLabel(orderData.service_items_category || orderData.service_category || orderData.service)} x {orderData.quantity || 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-none ml-4 text-right w-28">
                    <div className="text-sm font-medium"><AEDIcon className="w-4 h-4 inline-block mr-1" />{formatPrice(orderData.price)}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-gray-900">Reference ID:</span>
                  <span className="text-sm font-mono text-gray-700">{referenceId}</span>
                </div>
              </div>

              {/* Date/Time/Location Info */}
              <div className="mt-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Booking Details
                </h2>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-700 flex-1">
                    {formatDate(orderData.appointment_date)}
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleEditClick("date")}
                      className="text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-700 flex-1">
                    {formatTime(orderData.appointment_time)}
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleEditClick("time")}
                      className="text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-700 break-words w-full">
                    {getLocationDisplay(orderData.location)}
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <button
                      onClick={() => handleEditClick("address")}
                      className="text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Pay With Section */}
              <div className="mt-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pay with
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <CreditCard className="w-4 h-4 inline-block mr-2 text-gray-600" />
                    {getPaymentMethod() || "N/A"}
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditClick("payment")}
                      className="text-sm text-blue-600 underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-6 bg-gray-50 p-2">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Service Charges</span>
                    <span className="text-gray-900"><AEDIcon className="w-4 h-4 inline-block mr-1" />{formatPrice(serviceCharges)}</span>
                  </div>
                  {codFee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        Cash on Delivery Fee
                      </span>
                      <span className="text-orange-600 font-medium">
                          +<AEDIcon className="w-4 h-4 inline-block mr-1" />{formatPrice(codFee)}
                        </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">VAT (5%)</span>
                    <span className="text-gray-900"><AEDIcon className="w-4 h-4 inline-block mr-1" />{formatPrice(vatAmount)}</span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold">
                      Total to Pay
                    </span>
                    <span className="text-gray-900 font-semibold">
                      <AEDIcon className="w-4 h-4 inline-block mr-1" />{formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Booking Button */}
        </div>
        <div className="w-full sticky bottom-0 bg-white py-4 px-4 flex justify-center shadow-[0_-6px_12px_rgba(0,0,0,0.06)]">
          <button
            onClick={() =>
              navigate(`/manage-booking/${orderData.id}`, {
                state: { orderData },
              })
            }
            className="w-fit px-12 items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 transition-colors text-base"
          >
            MANAGE BOOKING
          </button>
        </div>
      </div>
      
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

export default BookingDetails;
