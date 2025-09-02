import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, MapPin, Clock, DollarSign, User, Phone } from 'lucide-react';

interface AppointmentData {
  id: number;
  user_id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  location: any;
  price: number;
  notes?: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(buildApiUrl('/api/admin/appointments'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(buildApiUrl(`/api/admin/appointments/${appointmentId}/status`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Refresh appointments
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to update appointment status');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatLocation = (location: any) => {
    try {
      // Parse JSON string if needed
      let loc = location;
      if (typeof location === "string") {
        try {
          loc = JSON.parse(location);
        } catch {
          // If it's not valid JSON, return the string as is
          return location;
        }
      }
      
      return formatAddressFromObject(loc);
    } catch (error) {
      console.error('Error formatting location:', error);
      return "Address not available";
    }
  };

  const formatAddressFromObject = (loc: any) => {
    if (!loc || typeof loc !== "object") {
      return "Address not available";
    }

    const addressParts = [];
    
    // For saved addresses from database (raw JSON format)
    if (loc.address_line1) {
      addressParts.push(loc.address_line1);
      if (loc.address_line2) addressParts.push(loc.address_line2);
      if (loc.state) addressParts.push(loc.state);
      if (loc.city) addressParts.push(loc.city);
      if (loc.postal_code && loc.postal_code !== "00000") addressParts.push(loc.postal_code);
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
      const possibleFields = ['street', 'building', 'apartment', 'area', 'district', 'city', 'state', 'country'];
      for (const field of possibleFields) {
        if (loc[field]) {
          addressParts.push(loc[field]);
        }
      }
    }
    
    return addressParts.length > 0 ? addressParts.join(', ') : "Address not available";
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const statusCounts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    'in-progress': appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <NewAdminLayout title="Appointments" subtitle="Manage all customer appointments">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading appointments...</span>
        </div>
      </NewAdminLayout>
    );
  }

  if (error) {
    return (
      <NewAdminLayout title="Appointments" subtitle="Manage all customer appointments">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <Button onClick={fetchAppointments} className="mt-2">
            Try Again
          </Button>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout title="Appointments" subtitle="Manage all customer appointments">
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={`transition-all ${
                    filter === status
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} 
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')} Appointments`}
              <span className="text-sm font-normal text-gray-500">({filteredAppointments.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found for the selected filter.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Customer Info */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                              {appointment.customer_name ? 
                                appointment.customer_name.split(' ').map(n => n[0]).join('') :
                                'U'
                              }
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {appointment.customer_name || `Customer #${appointment.user_id}`}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">{appointment.service}</p>
                            {appointment.customer_phone && (
                              <div className="flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{appointment.customer_phone}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <Badge className={`${getStatusColor(appointment.status)} text-xs font-medium`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                          </Badge>
                          
                          <div className="flex gap-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            )}
                            
                            {appointment.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'in-progress')}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Start Service
                              </Button>
                            )}
                            
                            {appointment.status === 'in-progress' && (
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                className="bg-gray-600 hover:bg-gray-700 text-white"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Appointment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date & Time */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Date & Time</p>
                            <p className="font-semibold text-gray-900">{formatDate(appointment.appointment_date)}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{formatTime(appointment.appointment_time)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Location</p>
                            <p className="font-semibold text-gray-900 text-sm leading-tight">
                              {formatLocation(appointment.location)}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Price</p>
                            <p className="font-semibold text-gray-900 text-lg">${appointment.price}</p>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {appointment.notes && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Notes</p>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                              {appointment.notes}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </NewAdminLayout>
  );
};

export default AdminAppointments;
