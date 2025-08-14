import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ChevronDown, ChevronUp, Loader2, Gift, Phone, Mail, CreditCard } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/website/Navbar";
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

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const order = location.state?.orderData;
    if (order) {
      setOrderData(order);
    } else {
      // Redirect back if no order data
      navigate('/user/bookings');
    }
  }, [location.state, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getLocationDisplay = (location: string) => {
    try {
      const locationObj = JSON.parse(location);
      return `${locationObj.address}, ${locationObj.area}, ${locationObj.city}`;
    } catch (e) {
      return location;
    }
  };

  const renderStatusIcon = (status: string, isCompleted: boolean, isActive: boolean) => {
    if (isCompleted) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    } else if (isActive) {
      return (
        <div className="w-6 h-6 bg-blue-50 border-2 border-blue-500 rounded-full flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-blue-500" />
        </div>
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
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Loading order details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isBookingRequested = true; // Always true for new bookings
  const isBookingConfirmed = orderData.status === 'confirmed' || orderData.status === 'completed';
  const isBookingDelivered = orderData.status === 'completed';

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h1>
          </div>

          {/* Status Progress */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Booking Requested */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {renderStatusIcon('requested', isBookingRequested, false)}
                    <div>
                      <h3 className="font-semibold text-gray-900">Booking requested</h3>
                      <p className="text-sm text-gray-600">Your booking has been received. Please wait for confirmation from a service provider.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Expanded Status Details */}
                {isExpanded && (
                  <div className="ml-9 space-y-4 border-l-2 border-gray-200 pl-6">
                    {/* Booking Confirmed */}
                    <div className="flex items-center gap-3">
                      {renderStatusIcon('confirmed', isBookingConfirmed, !isBookingConfirmed && orderData.status === 'pending')}
                      <div>
                        <h3 className="font-semibold text-gray-900">Booking confirmed</h3>
                        <p className="text-sm text-gray-600">
                          {isBookingConfirmed 
                            ? "A service provider has accepted your booking. Your booking will be delivered as per the booked date and time."
                            : "A service provider will accept your booking soon."
                          }
                        </p>
                      </div>
                    </div>

                    {/* Booking Delivered */}
                    <div className="flex items-center gap-3">
                      {renderStatusIcon('delivered', isBookingDelivered, false)}
                      <div>
                        <h3 className="font-semibold text-gray-900">Booking delivered</h3>
                        <p className="text-sm text-gray-600">Your booking has been completed.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* App Banner */}
          <Card className="mb-6 bg-gradient-to-r from-purple-600 to-purple-700">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Gift className="w-12 h-12 text-purple-200" />
                  <div>
                    <h3 className="text-lg font-bold">Earn 313 Smiles Points</h3>
                    <p className="text-purple-200 text-sm">
                      Download our app and earn points after your service is delivered
                    </p>
                  </div>
                </div>
                <button className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get App
                </button>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  We will send you an email shortly once a Service Provider has been assigned
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  Final amount will be charged on your preferred payment method once service is completed.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  You can cancel for free up to 6 hours before the service start time. 
                  <button className="text-blue-600 hover:underline ml-1">Cancellation policy</button>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Manage Booking Button */}
          <div className="text-center">
            <button
              onClick={() => navigate(`/booking-details/${orderData.id}`, { 
                state: { orderData } 
              })}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              MANAGE BOOKING
            </button>
            
            {/* Back to Bookings */}
            <button
              onClick={() => navigate('/user/bookings')}
              className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-8 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
