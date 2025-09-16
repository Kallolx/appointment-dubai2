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
  appointmentData?: {
    customer_name?: string;
    service?: string;
    appointment_date?: string;
    appointment_time?: string;
  };
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

  const shareToWhatsApp = () => {
    if (!shareData) return;
    
    const customerName = appointmentData?.customer_name || 'Customer';
    const message = `Appointment Details for ${customerName}\n\n${shareData.shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Generate link when modal opens
  React.useEffect(() => {
    if (isOpen && !shareData) {
      generateShareLink();
    }
    if (!isOpen) {
      setShareData(null);
      setShowQR(false);
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