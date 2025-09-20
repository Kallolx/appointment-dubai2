import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, Phone, MessageCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import NewUserLayout from "./../NewUserLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  // Additional fields
  extra_price?: number;
  cod_fee?: number;
  room_type?: string;
  property_type?: string;
  service_category?: string;
  quantity?: number;
  payment_method?: string;
}

const MyBookings: React.FC = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<Appointment[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Appointment[]>([]);
  const [unpaidBookings, setUnpaidBookings] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookings();
  }, []);

  // Listen for booking changes from other parts of the app (e.g., ManageBooking)
  useEffect(() => {
    const handler = (e: Event) => {
      // Re-fetch bookings to reflect updated status
      fetchBookings();
    };

    window.addEventListener('booking:changed', handler as EventListener);
    return () => window.removeEventListener('booking:changed', handler as EventListener);
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(buildApiUrl('/api/user/appointments'), {
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

  const handleCancelBooking = async (id: number) => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      setIsCancelling(true);

      await axios.put(buildApiUrl(`/api/user/appointments/${id}`), { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // After successful API call, re-fetch all bookings to get updated data
      await fetchBookings();

      toast({
        title: 'Success',
        description: 'Booking cancelled successfully'
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancellingId) return;
    setShowCancelDialog(false);
    await handleCancelBooking(cancellingId);
    setCancellingId(null);
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

  const renderBookingCard = (booking: Appointment) => {
    // Safe number parsing
    const parsePrice = (value: any): number => {
      if (value === null || value === undefined || value === '') return 0;
      const parsed = typeof value === 'string' ? parseFloat(value) : Number(value);
      return isNaN(parsed) ? 0 : parsed;
    };

    const basePrice = parsePrice(booking.price);
    const total = basePrice + parsePrice(booking.extra_price) + parsePrice(booking.cod_fee);

    return (
      <Card key={booking.id} className="mb-3 border border-gray-200 hover:shadow-sm transition-shadow">
        <CardContent className="p-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
            {/* ID & Service */}
            <div className="md:col-span-2">
              <div className="font-medium text-gray-900">{booking.service}</div>
              <div className="text-xs text-gray-500">Order #{booking.id}</div>
              {booking.service_category && (
                <div className="text-xs text-blue-600">{booking.service_category}</div>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(booking.appointment_date)}
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(booking.appointment_time)}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="text-sm text-gray-900 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="truncate">{getLocationDisplay(booking.location)}</span>
              </div>
              {booking.property_type && (
                <div className="text-xs text-gray-500">{booking.property_type}</div>
              )}
            </div>

            {/* Status & Price */}
            <div className="text-center">
              {getStatusBadge(booking.status)}
              <div className="text-lg font-bold text-gray-900 mt-1">AED {total.toFixed(2)}</div>
              {booking.payment_method && (
                <div className="text-xs text-gray-500">{booking.payment_method}</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              {booking.status === 'confirmed' && (
                <button className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200 hover:bg-blue-100">
                  <Phone className="w-3 h-3" />
                  Call
                </button>
              )}
              
              {(booking.status || '').toLowerCase() !== 'cancelled' && (booking.status || '').toLowerCase() !== 'completed' && (
                <button
                  onClick={() => {
                    setCancellingId(booking.id);
                    setShowCancelDialog(true);
                  }}
                  className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-200 hover:bg-red-100 flex items-center"
                  disabled={isCancelling}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  {isCancelling && cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                </button>
              )}
              
              {booking.status === 'completed' && (
                <button className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs border border-yellow-200 hover:bg-yellow-100">
                  Rate
                </button>
              )}
              
              <button 
                onClick={() => navigate(`/order-confirmation`, { 
                  state: { orderData: booking } 
                })}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200 hover:bg-gray-200"
              >
                Details
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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

      {/* Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-sm text-gray-700">Are you sure you want to cancel this booking? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelDialog(false)}
                className="flex-1"
                disabled={isCancelling}
              >
                No, Keep It
              </Button>
              <Button 
                onClick={confirmCancel}
                disabled={isCancelling}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NewUserLayout>
  );
};

export default MyBookings;
