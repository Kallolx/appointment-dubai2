import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, CheckCircle, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const NewAdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalUsers: 0,
    availableSlots: 0,
    todayRevenue: 0
  });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        return;
      }

      // Fetch appointments and users in parallel
      const [appointmentsResponse, usersResponse] = await Promise.all([
        axios.get(buildApiUrl('/api/admin/appointments'), {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(buildApiUrl('/api/admin/users'), {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allAppointments = appointmentsResponse.data || [];
      const allUsers = usersResponse.data || [];
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Filter today's appointments
      const todayAppointments = allAppointments.filter((apt: any) => {
        const aptDate = apt.appointment_date;
        if (typeof aptDate === 'string') {
          return aptDate.split('T')[0] === today;
        }
        return false;
      });

      // Calculate today's revenue
      const todayRevenue = todayAppointments.reduce((sum: number, apt: any) => 
        sum + (parseFloat(apt.price) || 0), 0
      );

      // Get pending appointments count (as available slots indicator)
      const pendingAppointments = allAppointments.filter((apt: any) => apt.status === 'pending').length;

      // For stats, let's show upcoming appointments (future + today) instead of just today
      const currentDate = new Date().toISOString().split('T')[0];
      const upcomingAppointments = allAppointments.filter((apt: any) => {
        const aptDate = apt.appointment_date;
        if (typeof aptDate === 'string') {
          return aptDate.split('T')[0] >= currentDate; // Today or future
        }
        return false;
      });

      setStats({
        todayAppointments: upcomingAppointments.length, // Show upcoming instead of just today
        totalUsers: allUsers.length,
        availableSlots: pendingAppointments, // Show pending appointments instead
        todayRevenue: todayRevenue
      });

      // Set appointments to display (today's first, then recent)
      const appointmentsToShow = todayAppointments.length > 0 
        ? todayAppointments.slice(0, 4)
        : allAppointments.slice(0, 4);
      
      setAppointments(appointmentsToShow);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      
      // Set default values on error
      setStats({
        todayAppointments: 0,
        totalUsers: 0,
        availableSlots: 0,
        todayRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Appointments",
      value: loading ? "..." : stats.todayAppointments.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "Today & future"
    },
    {
      title: "Total Customers",
      value: loading ? "..." : stats.totalUsers.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "All registered users"
    },
    {
      title: "Pending Appointments",
      value: loading ? "..." : stats.availableSlots.toString(),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "Awaiting confirmation"
    },
    {
      title: "Revenue Today",
      value: loading ? "..." : `AED ${stats.todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "Today's earnings"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const parseAddress = (addressData: any) => {
    if (!addressData) return 'No address';
    
    try {
      const address = typeof addressData === 'string' ? JSON.parse(addressData) : addressData;
      return address.area || address.city || 'Dubai';
    } catch (e) {
      return 'Dubai';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <NewAdminLayout 
      title={`Welcome back, ${user?.fullName || 'Admin'}!`}
      subtitle="Manage appointments and system settings from here"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Appointments</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading appointments...</span>
              </div>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {appointment.customer_name ? appointment.customer_name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.customer_name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-600">{appointment.service}</p>
                        <p className="text-xs text-gray-500">{parseAddress(appointment.location)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatTime(appointment.appointment_time)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No appointments scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Database</p>
                  <p className="text-sm text-green-700">Connected</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">API Services</p>
                  <p className="text-sm text-green-700">Online</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Backup</p>
                  <p className="text-sm text-yellow-700">Scheduled for tonight</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default NewAdminDashboard;
