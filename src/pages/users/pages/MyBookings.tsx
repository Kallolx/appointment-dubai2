import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, Phone, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import NewUserLayout from "./../NewUserLayout";

interface Appointment {
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

const MyBookings: React.FC = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<Appointment[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Appointment[]>([]);
  const [unpaidBookings, setUnpaidBookings] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3001/api/user/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const appointments = response.data;

      // Categorize appointments
      const today = new Date();
      const upcoming = appointments.filter((apt: Appointment) => {
        const appointmentDate = new Date(apt.appointment_date);
        return appointmentDate >= today && apt.status !== 'completed' && apt.status !== 'cancelled';
      });
      const history = appointments.filter((apt: Appointment) => {
        const appointmentDate = new Date(apt.appointment_date);
        return appointmentDate < today || apt.status === 'completed' || apt.status === 'cancelled';
      });
      const unpaid = appointments.filter((apt: Appointment) => 
        apt.status === 'pending' && apt.notes?.includes('Cash on Delivery')
      );

      setUpcomingBookings(upcoming);
      setHistoryBookings(history);
      setUnpaidBookings(unpaid);
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      month: 'short', 
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
      case 'in-progress':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">In Progress</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getLocationDisplay = (location: string) => {
    try {
      const locationObj = JSON.parse(location);
      return `${locationObj.area || ''}, ${locationObj.city || ''}`.replace(/^,\s*/, '');
    } catch (e) {
      return location;
    }
  };

  const renderBookingCard = (booking: Appointment) => (
    <Card key={booking.id} className="mb-4 border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
              {getStatusBadge(booking.status)}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="break-words">{formatDate(booking.appointment_date)} between</span>
              </div>
              <div className="flex items-center gap-2 ml-6">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="break-words">{formatTime(booking.appointment_time)} - {
                  (() => {
                    const [hours, minutes] = booking.appointment_time.split(':');
                    const endTime = new Date();
                    endTime.setHours(parseInt(hours, 10) + 1);
                    endTime.setMinutes(parseInt(minutes, 10));
                    return endTime.toLocaleTimeString([], { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    });
                  })()
                }</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="break-words">{getLocationDisplay(booking.location)}</span>
              </div>
            </div>
          </div>
          
          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 lg:text-right lg:ml-4">
            <div className="order-1 sm:order-2 lg:order-1">
              <div className="text-xl font-bold text-gray-900 mb-2">
                AED {typeof booking.price === 'string' ? parseFloat(booking.price).toFixed(2) : booking.price?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            {/* Action buttons for different states */}
            <div className="order-2 sm:order-1 lg:order-2 w-full sm:w-auto">
              {booking.status === 'confirmed' && (
                <div className="flex flex-row sm:flex-col lg:flex-col gap-2">
                  <button className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-sm font-medium flex-1 sm:flex-none justify-center">
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">Call Professional</span>
                    <span className="sm:hidden">Call</span>
                  </button>
                  <button className="flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm font-medium flex-1 sm:flex-none justify-center">
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat</span>
                  </button>
                </div>
              )}
              
              {booking.status === 'pending' && (
                <div className="flex flex-row sm:flex-col lg:flex-col gap-2">
                  <button className="bg-red-50 text-red-700 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors text-sm font-medium flex-1 sm:flex-none">
                    Cancel
                  </button>
                </div>
              )}
              
              {booking.status === 'completed' && (
                <div className="flex flex-row sm:flex-col lg:flex-col gap-2">
                  <button className="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors text-sm font-medium flex-1 sm:flex-none">
                    Rate & Review
                  </button>
                  <button className="bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-sm font-medium flex-1 sm:flex-none">
                    Book Again
                  </button>
                </div>
              )}
              
              {/* View Details Button - Always shown */}
              <button 
                onClick={() => navigate(`/order-confirmation`, { 
                  state: { orderData: booking } 
                })}
                className="w-full mt-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    let bookings: Appointment[] = [];
    let emptyMessage = "";
    let emptySubtext = "";

    switch (activeTab) {
      case "upcoming":
        bookings = upcomingBookings;
        emptyMessage = "No upcoming bookings";
        emptySubtext = "Your future appointments will appear here";
        break;
      case "history":
        bookings = historyBookings;
        emptyMessage = "No booking history";
        emptySubtext = "Your past appointments will appear here";
        break;
      case "unpaid":
        bookings = unpaidBookings;
        emptyMessage = "No unpaid bookings";
        emptySubtext = "Bookings pending payment will appear here";
        break;
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-gray-500 mb-6">{emptySubtext}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book a Service
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {bookings.map(booking => renderBookingCard(booking))}
      </div>
    );
  };

  return (
    <NewUserLayout
      title="My Bookings"
      subtitle="View and manage your service appointments"
    >
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Navigation */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
            {[
              { key: "upcoming", label: "Upcoming" },
              { key: "history", label: "History" },
              { key: "unpaid", label: "Unpaid" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </NewUserLayout>
  );
};

export default MyBookings;
