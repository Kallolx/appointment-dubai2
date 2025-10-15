import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { buildApiUrl } from "@/config/api";
import axios from 'axios';
import QRCode from 'react-qr-code';
import { 
  Share2, 
  Copy, 
  MessageCircle,
  QrCode,
  Loader2,
  X
} from 'lucide-react';

interface ShareAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  appointmentData?: any; // Accept full appointment object
}

interface ShareData {
  shareToken: string;
  shareUrl: string;
  expiresAt: string;
}

const ShareAppointmentModal: React.FC<ShareAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  appointmentData
}) => {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [appointmentFull, setAppointmentFull] = useState<any | null>(null);
  const { toast } = useToast();

  const generateShareLink = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        buildApiUrl(`/api/admin/appointments/${appointmentId}/share`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShareData(response.data);
    } catch (error) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the link.",
        variant: "destructive"
      });
    }
  };

  const formatAddressFromObject = (loc: any) => {
    if (!loc || typeof loc !== 'object') {
      return 'Address not available';
    }

    const addressParts: string[] = [];
    if (loc.address_line1) {
      addressParts.push(loc.address_line1);
      if (loc.address_line2) addressParts.push(loc.address_line2);
      if (loc.state) addressParts.push(loc.state);
      if (loc.city) addressParts.push(loc.city);
      if (loc.postal_code && loc.postal_code !== '00000') addressParts.push(loc.postal_code);
      if (loc.country) addressParts.push(loc.country);
    } else if (loc.address) {
      addressParts.push(loc.address);
      if (loc.apartmentNo) addressParts.push(loc.apartmentNo);
      if (loc.area) addressParts.push(loc.area);
      if (loc.city) addressParts.push(loc.city);
    } else {
      const possibleFields = ['street', 'building', 'apartment', 'area', 'district', 'city', 'state', 'country'];
      for (const field of possibleFields) {
        if (loc[field]) addressParts.push(loc[field]);
      }
    }

    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  const shareToWhatsApp = async () => {
    // Prefer full appointment data when available
    let appt: any = appointmentFull || appointmentData || {};
    
    // Debug: log the appointment data
    console.log('Full appointment data for WhatsApp:', appt);
    console.log('Available fields:', Object.keys(appt));

    const formatDate = (d: string) => {
      try {
        return new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        return d || '';
      }
    }

    const formatTime = (t: string) => {
      try {
        return new Date(`1970-01-01T${t}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      } catch {
        return t || '';
      }
    }

    const formatLocation = (loc: any) => {
      try {
        if (!loc) return '';
        let l = loc;
        if (typeof loc === 'string') {
          try { l = JSON.parse(loc); } catch { return loc; }
        }
        return formatAddressFromObject(l);
      } catch {
        return '';
      }
    };

    const lines: string[] = [];
    lines.push(`🗓️ *Appointment #${appt.id || appointmentId || ''}*`);
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    
    // Status
    const status = appt.status || appt.appointment_status;
    if (status) lines.push(`📋 *Status:* ${status}`);
    
    // Date and Time
    if (appt.appointment_date) lines.push(`📅 *Date:* ${formatDate(appt.appointment_date)}`);
    if (appt.appointment_time) lines.push(`🕐 *Time:* ${formatTime(appt.appointment_time)}`);
    
    // Customer Details Section
    lines.push('');
    lines.push('👤 *Customer Details*');
    const customerName = appt.customer_name || appt.name || appt.user_name;
    const customerPhone = appt.customer_phone || appt.phone || appt.mobile || appt.contact_number;
    const customerEmail = appt.customer_email || appt.email;
    
    if (customerName) lines.push(`Name: ${customerName}`);
    if (customerPhone) lines.push(`Phone: ${customerPhone}`);
    if (customerEmail) lines.push(`Email: ${customerEmail}`);
    
    lines.push('');
    lines.push('🔧 *Service Details*');
    
    // Build service hierarchy in a cleaner way
    // Category name (not slug)
    if (appt.service_category) {
      lines.push(`Category: ${appt.service_category}`);
    }
    
    
    // Property type - use slug if available (e.g. "2-bedroom-apartment"), otherwise use type name
    if (appt.property_type_slug) {
      lines.push(`Property: ${appt.property_type_slug}${appt.property_type ? ` (${appt.property_type})` : ''}`);
    } else if (appt.property_type) {
      lines.push(`Property: ${appt.property_type}`);
    }
    
    // Room types - use slug if available
    if (appt.room_type_slug) {
      lines.push(`Rooms: ${appt.room_type_slug}${appt.room_type ? ` (${appt.room_type})` : ''}`);
    } else if (appt.room_type) {
      const rooms = appt.room_type.split(',').map((r: string) => r.trim()).filter(Boolean);
      if (rooms.length > 1) {
        lines.push(`Rooms:`);
        rooms.forEach(r => lines.push(`   • ${r}`));
      } else {
        lines.push(`Rooms: ${appt.room_type}`);
      }
    }
    
    // Add other service-related fields that might exist
    if (appt.area_size) lines.push(`Area Size: ${appt.area_size}`);
    if (appt.no_of_rooms) lines.push(`Number of Rooms: ${appt.no_of_rooms}`);
    if (appt.frequency) lines.push(`Frequency: ${appt.frequency}`);

    let address = formatLocation(appt.location || appt.address || appt.location_data);

    // If address is empty, try fetching the public shared appointment using the share token
    if ((!address || address === '' || address === 'Address not available') && shareData?.shareUrl) {
      try {
        const shareUrl = shareData.shareUrl;
        const parsed = new URL(shareUrl);
        const parts = parsed.pathname.split('/').filter(Boolean);
        const token = parts.length ? parts[parts.length - 1] : null;
        if (token) {
          const resp = await axios.get(buildApiUrl(`/api/shared-appointment/${token}`));
          const shared = resp.data;
          address = formatLocation(shared.location || shared.address || shared.location_data) || address;
          // prefer other fields from shared view if missing
          if (!appt.customer_name && shared.customer_name) appt.customer_name = shared.customer_name;
          if (!appt.customer_phone && shared.customer_phone) appt.customer_phone = shared.customer_phone;
        }
      } catch (err) {
        // ignore and proceed
        // console.warn('Failed to fetch shared appointment for address fallback', err);
      }
    }
    
    if (address && address !== 'Address not available') {
      lines.push('');
      lines.push('📍 *Location*');
      lines.push(address);
    }

    const base = Number(appt.price || 0);
    const extra = Number(appt.extra_price || 0);
    const cod = Number(appt.cod_fee || 0);
    const total = base + extra + cod;
    
    if (total > 0) {
      lines.push('');
      lines.push('💰 *Pricing*');
      if (base) lines.push(`Base Price: AED ${base.toFixed(2)}`);
      if (extra) lines.push(`Extra Charges: AED ${extra.toFixed(2)}`);
      if (cod) lines.push(`COD Fee: AED ${cod.toFixed(2)}`);
      lines.push(`*Total: AED ${total.toFixed(2)}*`);
    }

    if (appt.payment_method) {
      lines.push(`Payment Method: ${appt.payment_method}`);
    }
    
    if (appt.notes) {
      lines.push('');
      lines.push('📝 *Notes*');
      lines.push(appt.notes);
    }

    // Include share link if available
    if (shareData?.shareUrl) {
      lines.push('');
      lines.push('━━━━━━━━━━━━━━━━━━━━');
      lines.push('🔗 View Full Details:');
      lines.push(shareData.shareUrl);
    }

    const message = lines.join('\n');
    const wa = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(wa, '_blank');
  };

  // Generate link and fetch full appointment when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (!shareData) generateShareLink();
      // fetch full appointment details (simple, minimal)
      const token = localStorage.getItem('token');
      if (token) {
        axios.get(buildApiUrl(`/api/admin/appointments/${appointmentId}`), { headers: { Authorization: `Bearer ${token}` } })
          .then(r => setAppointmentFull(r.data))
          .catch(() => setAppointmentFull(null));
      }
    }
    if (!isOpen) {
      setShareData(null);
      setShowQR(false);
      setAppointmentFull(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Appointment
            </div>            
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}

          {shareData && (
            <>
              {/* Share URL */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={shareData.shareUrl}
                    readOnly
                    className="flex-1 text-sm bg-gray-50"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(shareData.shareUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              {showQR && (
                <div className="flex justify-center p-4 bg-white border rounded-lg">
                  <QRCode value={shareData.shareUrl} size={120} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={shareToWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                 <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowQR(!showQR)}
                  size="sm"
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  QR
                </Button>

                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(shareData.shareUrl)}
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAppointmentModal;