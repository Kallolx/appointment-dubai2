import React, { useState, useEffect } from 'react';
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

      // Fetch today's appointments
      const appointmentsResponse = await axios.get('http://localhost:3001/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch all users count
      const usersResponse = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Process data
      const allAppointments = appointmentsResponse.data;
      const today = new Date().toISOString().split('T')[0];
      
      const todayAppointments = allAppointments.filter(apt => 
        apt.appointment_date === today
      );

      const todayRevenue = todayAppointments.reduce((sum, apt) => 
        sum + parseFloat(apt.price || 0), 0
      );

      setStats({
        todayAppointments: todayAppointments.length,
        totalUsers: usersResponse.data.length,
        availableSlots: 36, // This would need a separate API endpoint
        todayRevenue: todayRevenue
      });

      // Set recent appointments (today's appointments)
      setAppointments(todayAppointments.slice(0, 4));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Today's Appointments",
      value: loading ? "..." : stats.todayAppointments.toString(),
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "Today"
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
      title: "Available Slots",
      value: loading ? "..." : stats.availableSlots.toString(),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "Next 7 days"
    },
    {
      title: "Revenue Today",
      value: loading ? "..." : `$${stats.todayRevenue.toFixed(2)}`,
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
                          {appointment.user_name ? appointment.user_name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.user_name || 'Unknown User'}</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Dates */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-50">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Available Dates</h3>
                  <p className="text-sm text-gray-600">Add or remove available booking dates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manage Time Slots */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-50">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Time Slots</h3>
                  <p className="text-sm text-gray-600">Configure available time slots</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View All Appointments */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-50">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">All Appointments</h3>
                  <p className="text-sm text-gray-600">View and manage all bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
