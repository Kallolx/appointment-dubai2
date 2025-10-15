import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, MessageSquare, Clock, LifeBuoy, Phone, Mail, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import NewUserLayout from "../NewUserLayout";

interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  admin_response?: string; // Add admin response field
}

const Support: React.FC = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  // Open WhatsApp with a prefilled message (no specific recipient so user picks contact)
  const openWhatsApp = (text?: string) => {
    const message = text || 'Hello, I need assistance with my account.';
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(buildApiUrl('/api/user/support-tickets'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateTicket = async () => {
    try {
      if (!formData.subject.trim() || !formData.message.trim()) {
        toast({
          title: "Error",
          description: "Please provide both subject and message",
          variant: "destructive"
        });
        return;
      }

      setSubmitLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(buildApiUrl('/api/user/support-tickets'), 
        {
          subject: formData.subject,
          message: formData.message
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast({
        title: "Success",
        description: "Support ticket created successfully"
      });
      
      setIsNewTicketDialogOpen(false);
      setFormData({ subject: '', message: '' });
      fetchTickets();
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive"
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Closed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  return (
    <NewUserLayout
      title="Support Center"
      subtitle="Get help and submit support tickets"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div></div>
          <Button 
            onClick={() => setIsNewTicketDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Support Ticket
          </Button>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Call Us</h3>
                <p className="text-sm text-gray-600">+971 4 XXX XXXX</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            role="button"
            onClick={() => openWhatsApp('Hello, I need help with my account')}
            aria-label="Open Live Chat on WhatsApp"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Available 9 AM - 6 PM</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-sm text-gray-600">support@company.com</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Support Tickets */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Support Tickets</h2>
          
          {loading ? (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading support tickets...</span>
              </div>
            </Card>
          ) : tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium text-gray-900">
                          {ticket.subject}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Ticket #{ticket.id} • Created {formatDate(ticket.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 mb-1">Your Message:</p>
                          <p className="text-gray-700 whitespace-pre-line">{ticket.message}</p>
                        </div>
                      </div>
                      
                      {ticket.admin_response && (
                        <div className="flex items-start gap-3 pt-3 border-t">
                          <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-blue-600 mb-1">Support Response:</p>
                            <p className="text-gray-700 whitespace-pre-line">{ticket.admin_response}</p>
                          </div>
                        </div>
                      )}
                      
                      {!ticket.admin_response && (ticket.status === 'open' || ticket.status === 'in_progress') ? (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-orange-600 font-medium">Awaiting response</span>
                        </div>
                      ) : ticket.admin_response ? (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <MessageSquare className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">Response received</span>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <LifeBuoy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                <p className="text-gray-600 mb-4">
                  You haven't created any support tickets yet. Create one if you need assistance.
                </p>
                <Button 
                  onClick={() => setIsNewTicketDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Support Ticket
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* New Support Ticket Dialog */}
        <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and our support team will get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  disabled={submitLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Please provide detailed information about your issue..."
                  rows={5}
                  disabled={submitLoading}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsNewTicketDialogOpen(false);
                  setFormData({ subject: '', message: '' });
                }}
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTicket}
                disabled={submitLoading || !formData.subject.trim() || !formData.message.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitLoading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NewUserLayout>
  );
};

export default Support;
