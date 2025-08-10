import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSidebar } from '@/pages/users/UserSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, MessageSquare, Clock, Plus } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: number;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  response?: string;
}

const Support: React.FC = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/user/support-tickets', {
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

  const handleCreateTicket = async () => {
    try {
      if (!subject.trim() || !message.trim()) {
        toast({
          title: "Error",
          description: "Please provide both subject and message",
          variant: "destructive"
        });
        return;
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('/api/user/support-tickets', 
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      toast({
        title: "Success",
        description: "Support ticket created successfully"
      });
      setIsNewTicketDialogOpen(false);
      setSubject('');
      setMessage('');
      fetchTickets();
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge className="bg-green-500">Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderTicketCard = (ticket: SupportTicket) => {
    return (
      <Card key={ticket.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
            {getStatusBadge(ticket.status || 'open')}
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Ticket #{ticket.id} • Created {formatDate(ticket.created_at)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Your Message:</p>
                <p className="whitespace-pre-line">{ticket.message}</p>
              </div>
            </div>
            
            {ticket.response && (
              <div className="flex items-start gap-2 border-t pt-4">
                <MessageSquare className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium text-blue-500">Support Response:</p>
                  <p className="whitespace-pre-line">{ticket.response}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {(ticket.status === 'open' || ticket.status === 'in_progress') && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Awaiting response</span>
            </div>
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
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">Support</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Get help with your account and appointments
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 lg:p-6 space-y-6 bg-secondary/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Support</h1>
                <p className="text-muted-foreground">Get help with your account or appointments</p>
              </div>
              <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Support Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                      Describe your issue and our support team will get back to you as soon as possible.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Please provide details about your issue"
                        rows={5}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewTicketDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateTicket}>Submit Ticket</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading support tickets...</p>
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.map(ticket => renderTicketCard(ticket))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <LifeBuoy className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No support tickets</h3>
                <p className="text-muted-foreground mt-1">Create a ticket if you need assistance</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsNewTicketDialogOpen(true)}
                >
                  Create Support Ticket
                </Button>
              </div>
            )}

            <div className="mt-8 p-6 border rounded-lg bg-muted/50">
              <h2 className="text-xl font-semibold mb-2">Need Immediate Assistance?</h2>
              <p className="mb-4">Our support team is available Monday to Friday, 9am to 5pm.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Call Support
                </Button>
                <Button variant="outline" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Support;