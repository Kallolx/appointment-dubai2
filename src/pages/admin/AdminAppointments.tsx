import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from './NewAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Clock, 
  CreditCard, 
  Building, 
  Home, 
  Tag, 
  Package, 
  Search, 
  Phone,
  DollarSign,
  User,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppointmentData {
  id: number;
  user_id: number;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  location: any;
  price: number;
  extra_price?: number;
  cod_fee?: number;
  room_type?: string;
  room_type_slug?: string;
  property_type?: string;
  property_type_slug?: string;
  service_category?: string;
  service_category_slug?: string;
  quantity?: number;
  payment_method?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

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
    // Status filter
    const statusMatch = filter === 'all' || appointment.status === filter;
    
    // Search filter
    const searchMatch = !searchTerm || 
      appointment.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customer_phone?.includes(searchTerm) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.property_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.room_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toString().includes(searchTerm);
    
    return statusMatch && searchMatch;
  });

  // Pagination calculations
  const totalAppointments = filteredAppointments.length;
  const calculatedTotalPages = Math.ceil(totalAppointments / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Update total pages when filtered data changes
  React.useEffect(() => {
    setTotalPages(calculatedTotalPages);
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [calculatedTotalPages, currentPage]);

  // Helper function to open appointment details modal
  const openAppointmentModal = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Helper function to close modal
  const closeModal = () => {
    setSelectedAppointment(null);
    setIsModalOpen(false);
  };

  // Helper function to get service details
  const getServiceDetails = (appointment: AppointmentData) => {
    const details = [];
    if (appointment.service_category) details.push(appointment.service_category);
    if (appointment.property_type) details.push(appointment.property_type);
    if (appointment.room_type) details.push(appointment.room_type);
    return details;
  };

  // Helper function to get payment details
  const getPaymentInfo = (appointment: AppointmentData) => {
    const info = {
      basePrice: appointment.price,
      extraPrice: appointment.extra_price || 0,
      codFee: appointment.cod_fee || 0,
      total: (appointment.price || 0) + (appointment.extra_price || 0) + (appointment.cod_fee || 0),
      method: appointment.payment_method || 'Not specified'
    };
    return info;
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
    <NewAdminLayout title="Appointments" subtitle="Manage customer appointments and service orders">
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by customer, service, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Results count */}
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, totalAppointments)} of {totalAppointments} appointments
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Filter Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setFilter(status);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className={filter === status 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'hover:bg-gray-50'
                  }
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
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paginatedAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No appointments match the selected filter.'}
                </p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service Details</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAppointments.map((appointment) => {
                      const paymentInfo = getPaymentInfo(appointment);
                      
                      return (
                        <TableRow 
                          key={appointment.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => openAppointmentModal(appointment)}
                        >
                          <TableCell className="font-medium">
                            #{appointment.id}
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">
                                  {appointment.customer_name ? 
                                    appointment.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2) :
                                    'U'
                                  }
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {appointment.customer_name || `Customer #${appointment.user_id}`}
                                </p>
                                {appointment.customer_phone && (
                                  <p className="text-xs text-gray-500">{appointment.customer_phone}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="space-y-1">
                              {appointment.service_category && (
                                <p className="text-sm font-medium text-gray-900">{appointment.service_category}</p>
                              )}
                              {appointment.property_type && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Building className="w-3 h-3" />
                                  <span>
                                    {appointment.property_type_slug ? 
                                      `${appointment.property_type_slug} (${appointment.property_type})` : 
                                      appointment.property_type
                                    }
                                  </span>
                                </div>
                              )}
                              {appointment.room_type && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <Home className="w-3 h-3" />
                                  <span>
                                    {appointment.room_type_slug ? 
                                      `${appointment.room_type_slug} (${appointment.room_type})` : 
                                      appointment.room_type
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(appointment.appointment_date)}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(appointment.appointment_time)}</span>
                              </div>
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          
                          <TableCell>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">AED {paymentInfo.total}</p>
                              {appointment.payment_method && (
                                <p className="text-xs text-gray-500">{appointment.payment_method}</p>
                              )}
                            </div>
                          </TableCell>
                          
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAppointmentModal(appointment);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              {appointment.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateAppointmentStatus(appointment.id, 'confirmed');
                                    }}
                                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateAppointmentStatus(appointment.id, 'cancelled');
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              
                              {appointment.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateAppointmentStatus(appointment.id, 'in-progress');
                                  }}
                                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                >
                                  Start
                                </Button>
                              )}
                              
                              {appointment.status === 'in-progress' && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateAppointmentStatus(appointment.id, 'completed');
                                  }}
                                  className="h-8 px-3 bg-gray-600 hover:bg-gray-700 text-white text-xs"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={currentPage <= 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                          let page;
                          if (totalPages <= 5) {
                            page = index + 1;
                          } else if (currentPage <= 3) {
                            page = index + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + index;
                          } else {
                            page = currentPage - 2 + index;
                          }
                          
                          if (page < 1 || page > totalPages) return null;
                          
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={currentPage >= totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Appointment Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                Appointment #{selectedAppointment?.id}
              </DialogTitle>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-4">
                {/* Customer & Service Info - Combined Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm">Customer</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {selectedAppointment.customer_name || `Customer #${selectedAppointment.user_id}`}
                      </p>
                      {selectedAppointment.customer_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <p className="text-xs text-gray-600">{selectedAppointment.customer_phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Details - Compact */}
                <div className="bg-blue-50 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">Service Details</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedAppointment.service_category && (
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-medium text-sm text-gray-900">{selectedAppointment.service_category}</p>
                      </div>
                    )}
                    
                    {selectedAppointment.property_type && (
                      <div>
                        <p className="text-xs text-gray-500">Property</p>
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-gray-600" />
                          <p className="font-medium text-sm text-gray-900">{selectedAppointment.property_type}</p>
                        </div>
                        {selectedAppointment.property_type_slug && (
                          <p className="text-xs text-gray-500">({selectedAppointment.property_type_slug})</p>
                        )}
                      </div>
                    )}
                    
                    {selectedAppointment.room_type && (
                      <div>
                        <p className="text-xs text-gray-500">Room Type</p>
                        <div className="flex items-center gap-1">
                          <Home className="w-3 h-3 text-gray-600" />
                          <p className="font-medium text-sm text-gray-900">{selectedAppointment.room_type}</p>
                        </div>
                        {selectedAppointment.room_type_slug && (
                          <p className="text-xs text-gray-500">({selectedAppointment.room_type_slug})</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <p className="text-xs text-gray-500">Services Ordered</p>
                    <p className="text-sm text-gray-700">{selectedAppointment.service}</p>
                  </div>
                </div>

                {/* Date & Location - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date & Time */}
                  <div className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm">Schedule</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedAppointment.appointment_date)}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <p className="text-xs text-gray-600">{formatTime(selectedAppointment.appointment_time)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-sm">Location</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {formatLocation(selectedAppointment.location)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className="border rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-sm">Notes</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-3 border-t">
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          updateAppointmentStatus(selectedAppointment.id, 'confirmed');
                          closeModal();
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                          closeModal();
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {selectedAppointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'in-progress');
                        closeModal();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Start Service
                    </Button>
                  )}
                  
                  {selectedAppointment.status === 'in-progress' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'completed');
                        closeModal();
                      }}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Complete
                    </Button>
                  )}
                  
                  <Button size="sm" variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </NewAdminLayout>
  );
};

export default AdminAppointments;
