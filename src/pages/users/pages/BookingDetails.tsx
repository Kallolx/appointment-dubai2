import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, X, Phone } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import  Navbar from "@/components/website/Navbar";
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

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const order = location.state?.orderData;
    if (order) {
      setOrderData(order);
    } else {
      navigate('/user/bookings');
    }
  }, [location.state, navigate, bookingId]);

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
      return {
        full: `${locationObj.address}, ${locationObj.area}, ${locationObj.city}`,
        address: locationObj.address,
        area: locationObj.area,
        city: locationObj.city,
        apartmentNo: locationObj.apartmentNo
      };
    } catch (e) {
      return {
        full: location,
        address: location,
        area: '',
        city: '',
        apartmentNo: ''
      };
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
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
  const referenceId = `20250${(orderData.id || 0).toString().padStart(6, '0')}MPDXB`;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          </div>

          {/* Status Header */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-8 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <img 
                  src="/icons/pest.webp" 
                  alt="Service" 
                  className=" object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">Booking confirmed</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              A service provider has accepted your booking. Your booking will be delivered as per
              the booked date and time.
            </p>
          </div>

          {/* Service Details */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>
                <p className="text-sm text-gray-500">Reference ID: {referenceId}</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center relative shrink-0">
                  <img 
                    src="/icons/pest.webp" 
                    alt="Service" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-medium text-gray-900">{orderData.service}</h3>
                    <p className="font-semibold text-gray-900">AED {formatPrice(orderData.price)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Details</h2>
              
              <div className="space-y-6">
                {/* Date */}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700 text-base">{formatDate(orderData.appointment_date)}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
                
                {/* Time */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-gray-700 text-base">
                        Between {formatTime(orderData.appointment_time)} and {
                          (() => {
                            const [hours, minutes] = orderData.appointment_time.split(':');
                            const endTime = new Date();
                            endTime.setHours(parseInt(hours, 10));
                            endTime.setMinutes(parseInt(minutes, 10) + 30);
                            return endTime.toLocaleTimeString([], { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            });
                          })()
                        }
                      </span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manage Booking Button */}
          <div>
            <button
              onClick={() => navigate(`/manage-booking/${orderData.id}`, { 
                state: { orderData } 
              })}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-colors mb-3 text-base"
            >
              MANAGE BOOKING
            </button>
            
            {/* Back to Bookings */}
            <button
              onClick={() => navigate('/user/bookings')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-medium transition-colors text-base"
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

export default BookingDetails;
