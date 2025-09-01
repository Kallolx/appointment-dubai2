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

  useEffect(() => {
    window.scrollTo(0, 0);

    // First try to get data from location state (for immediate navigation)
    const order = location.state?.orderData;
    if (order) {
      setOrderData(order);
    }

    // Always fetch fresh data from backend to ensure we have the latest
    if (bookingId) {
      fetchBookingDetails();
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
    try {
      const locationObj =
        typeof location === "string" ? JSON.parse(location) : location;
      return {
        full: `${locationObj.address}, ${locationObj.area}, ${locationObj.city}`,
        address: locationObj.address,
        area: locationObj.area,
        city: locationObj.city,
        apartmentNo: locationObj.apartmentNo,
      };
    } catch (e) {
      return {
        full: location,
        address: location,
        area: "",
        city: "",
        apartmentNo: "",
      };
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
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

  const locationData = getLocationDisplay(orderData.location);
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
          {/* Hero image + same status progress as OrderConfirmation */}
          <div className="overflow-hidden rounded-lg mb-4">
            <img
              src="/general_cleaning/1.webp"
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
                              A service provider has accepted your booking. Your
                              booking will be delivered as per the booked date
                              and time.
                            </p>
                          </div>
                        </div>
                      )}
                      {/* Booking Delivered */}
                      {isTimelineExpanded && (
                        <div className="flex items-start gap-4">
                          <div className="relative z-10">
                            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                          </div>
                          <div className="flex-1 pt-1">
                            <h3 className="font-semibold text-gray-900 text-base">
                              Booking delivered
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              Your booking will be completed soon.
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
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <img
                      src="/icons/pest.webp"
                      alt="Service"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base mt-2 font-medium text-gray-900">
                        {orderData.service}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-gray-200 my-2"></div>
                <div className="flex justify-between items-center text-sm text-gray-700 font-medium">
                  <span>
                    {orderData.room_type} - {orderData.property_type} x{" "}
                    {orderData.quantity || 1}
                  </span>
                  <span>AED {formatPrice(orderData.price)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-gray-900">
                    Reference ID:
                  </span>
                  <span className="text-sm font-mono text-gray-700">
                    {referenceId}
                  </span>
                </div>
              </div>

              {/* Date/Time/Location Info */}
              <div className="mt-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Booking Details
                </h2>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-700">
                    {formatDate(orderData.appointment_date)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-700">
                    {formatTime(orderData.appointment_time)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div className="text-sm text-gray-700 break-words w-full">
                    {typeof locationData.full === "string"
                      ? locationData.full
                      : JSON.stringify(locationData.full)}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-4">
                <div className="w-full h-36 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Location Map</p>
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
                    <span className="text-gray-900">
                      AED {formatPrice(serviceCharges)}
                    </span>
                  </div>
                  {codFee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        Cash on Delivery Fee
                      </span>
                      <span className="text-orange-600 font-medium">
                        +{formatPrice(codFee)} AED
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">VAT (5%)</span>
                    <span className="text-gray-900">
                      AED {formatPrice(vatAmount)}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-semibold">
                      Total to Pay
                    </span>
                    <span className="text-gray-900 font-semibold">
                      AED {formatPrice(totalPrice)}
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
            className="w-fit px-12 items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-sm transition-colors text-base"
          >
            MANAGE BOOKING
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
