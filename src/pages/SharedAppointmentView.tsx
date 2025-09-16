import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buildApiUrl } from "@/config/api";
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Package, 
  Building, 
  Home, 
  DollarSign, 
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Share2
} from 'lucide-react';

interface AppointmentData {
  id: number;
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

const SharedAppointmentView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchAppointmentDetails();
    }
  }, [token]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(buildApiUrl(`/api/shared-appointment/${token}`));
      setAppointment(response.data);
    } catch (err: any) {
      console.error('Error fetching shared appointment:', err);
      if (err.response?.status === 404) {
        setError('This appointment link is invalid or has expired.');
      } else {
        setError('Failed to load appointment details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
      let loc = location;
      if (typeof location === "string") {
        try {
          loc = JSON.parse(location);
        } catch {
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
    
    if (loc.address_line1) {
      addressParts.push(loc.address_line1);
      if (loc.address_line2) addressParts.push(loc.address_line2);
      if (loc.state) addressParts.push(loc.state);
      if (loc.city) addressParts.push(loc.city);
      if (loc.postal_code && loc.postal_code !== "00000") addressParts.push(loc.postal_code);
      if (loc.country) addressParts.push(loc.country);
    } else if (loc.address) {
      addressParts.push(loc.address);
      if (loc.apartmentNo) addressParts.push(loc.apartmentNo);
      if (loc.area) addressParts.push(loc.area);
      if (loc.city) addressParts.push(loc.city);
    } else {
      const possibleFields = ['street', 'building', 'apartment', 'area', 'district', 'city', 'state', 'country'];
      for (const field of possibleFields) {
        if (loc[field]) {
          addressParts.push(loc[field]);
        }
      }
    }
    
    return addressParts.length > 0 ? addressParts.join(', ') : "Address not available";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentInfo = (appointment: AppointmentData) => {
    const basePrice = parseFloat(appointment.price?.toString() || '0') || 0;
    const extraPrice = parseFloat(appointment.extra_price?.toString() || '0') || 0;
    const codFee = parseFloat(appointment.cod_fee?.toString() || '0') || 0;
    
    return {
      basePrice,
      extraPrice,
      codFee,
      total: basePrice + extraPrice + codFee,
      method: appointment.payment_method || 'Not specified'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Appointment</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Appointment Not Found</h2>
              <p className="text-gray-600">The appointment you're looking for doesn't exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const paymentInfo = getPaymentInfo(appointment);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Share2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
          </div>
          <p className="text-gray-600">Appointment #{appointment.id}</p>
        </div>

        <div className="space-y-6">
          {/* Status & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">Status & Schedule</span>
                <Badge className={`${getStatusColor(appointment.status)} flex items-center gap-1`}>
                  {getStatusIcon(appointment.status)}
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(appointment.appointment_date)}</p>
                    <p className="text-sm text-gray-600">Appointment Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{formatTime(appointment.appointment_time)}</p>
                    <p className="text-sm text-gray-600">Appointment Time</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{appointment.customer_name || 'Not provided'}</p>
                </div>
                {appointment.customer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{appointment.customer_phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointment.service_category && (
                  <div>
                    <p className="text-sm text-gray-600">Service Category</p>
                    <p className="font-medium text-gray-900">{appointment.service_category}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointment.property_type && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Property Type</p>
                        <p className="font-medium text-gray-900">{appointment.property_type}</p>
                        {appointment.property_type_slug && (
                          <p className="text-xs text-gray-500">({appointment.property_type_slug})</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {appointment.room_type && (
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Room Type</p>
                        <p className="font-medium text-gray-900">{appointment.room_type}</p>
                        {appointment.room_type_slug && (
                          <p className="text-xs text-gray-500">({appointment.room_type_slug})</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Services Requested</p>
                  <p className="font-medium text-gray-900">{appointment.service}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 leading-relaxed">
                {formatLocation(appointment.location)}
              </p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">AED {paymentInfo.basePrice.toFixed(2)}</span>
                </div>
                
                {paymentInfo.extraPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extra Charges</span>
                    <span className="font-medium">AED {paymentInfo.extraPrice.toFixed(2)}</span>
                  </div>
                )}
                
                {paymentInfo.codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">COD Fee</span>
                    <span className="font-medium">AED {paymentInfo.codFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">AED {paymentInfo.total.toFixed(2)}</span>
                </div>
                
                {appointment.payment_method && (
                  <div className="text-sm text-gray-600">
                    Payment Method: <span className="font-medium">{appointment.payment_method}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {appointment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Special Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 leading-relaxed">{appointment.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              This is a secure shared view of the appointment details.
              <br />
              Created on {new Date(appointment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedAppointmentView;