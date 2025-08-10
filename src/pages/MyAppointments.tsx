import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSidebar } from '@/pages/users/UserSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Clock, MapPin, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  price: number;
  status: string;
  notes?: string;
}

const MyAppointments: React.FC = () => {
  const { toast } = useToast();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const upcomingResponse = await axios.get('/api/user/appointments/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const pastResponse = await axios.get('/api/user/appointments/past', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUpcomingAppointments(upcomingResponse.data);
        setPastAppointments(pastResponse.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCancelAppointment = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(`/api/user/appointments/${id}`, 
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Update the local state
      setUpcomingAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        )
      );

      toast({
        title: "Success",
        description: "Appointment cancelled successfully"
      });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderAppointmentCard = (appointment: Appointment, isPast: boolean = false) => {
    // Parse location from JSON string if needed
    let locationDisplay = appointment.location;
    try {
      const locationObj = JSON.parse(appointment.location);
      locationDisplay = locationObj.address || locationObj.name || appointment.location;
    } catch (e) {
      // If parsing fails, use the original string
    }

    return (
      <Card key={appointment.id} className="mb-4 overflow-hidden border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{appointment.service}</CardTitle>
            {getStatusBadge(appointment.status)}
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Appointment #{appointment.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(appointment.appointment_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatTime(appointment.appointment_time)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{locationDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>${appointment.price.toFixed(2)}</span>
            </div>
            {appointment.notes && (
              <div className="flex items-start gap-2 mt-2">
                <AlertCircle className="h-4 w-4 text-primary mt-1" />
                <span className="text-sm">{appointment.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {!isPast && appointment.status.toLowerCase() !== 'cancelled' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCancelAppointment(appointment.id)}
                className="text-red-500 border-red-500 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/user/reschedule/${appointment.id}`)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </div>
          )}
          {isPast && appointment.status.toLowerCase() === 'completed' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/user/review/${appointment.id}`)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Leave Review
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <UserSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-border bg-white shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 lg:px-6 h-full">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">My Appointments</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    View and manage your appointments
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 lg:p-6 space-y-6 bg-secondary/30">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">View and manage all your appointments</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => renderAppointmentCard(appointment))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No upcoming appointments</h3>
                <p className="text-muted-foreground mt-1">Book a new appointment to get started</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/book')}
                >
                  Book Appointment
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading appointments...</p>
              </div>
            ) : pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map(appointment => renderAppointmentCard(appointment, true))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No past appointments</h3>
                <p className="text-muted-foreground mt-1">Your appointment history will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MyAppointments;