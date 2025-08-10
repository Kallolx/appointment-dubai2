import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const appointments = [
    {
      id: "APT001",
      customerName: "Sarah Johnson",
      customerPhone: "+1 (555) 123-4567",
      service: "Home Cleaning",
      category: "Cleaning",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "2 hours",
      status: "confirmed",
      address: "123 Main St, Downtown",
      price: "$150",
      assignedTo: "Maria Garcia",
      notes: "Deep cleaning required for kitchen and bathrooms"
    },
    {
      id: "APT002",
      customerName: "Mike Chen",
      customerPhone: "+1 (555) 987-6543",
      service: "AC Maintenance",
      category: "HVAC",
      date: "2024-01-15",
      time: "2:00 PM",
      duration: "1.5 hours",
      status: "pending",
      address: "456 Oak Ave, Business District",
      price: "$120",
      assignedTo: "John Smith",
      notes: "Annual maintenance check"
    },
    {
      id: "APT003",
      customerName: "Emily Davis",
      customerPhone: "+1 (555) 456-7890",
      service: "Plumbing Repair",
      category: "Plumbing",
      date: "2024-01-16",
      time: "9:00 AM",
      duration: "3 hours",
      status: "in-progress",
      address: "789 Pine Rd, Residential Area",
      price: "$280",
      assignedTo: "David Wilson",
      notes: "Kitchen sink and bathroom faucet issues"
    },
    {
      id: "APT004",
      customerName: "James Wilson",
      customerPhone: "+1 (555) 321-0987",
      service: "Electrical Work",
      category: "Electrical",
      date: "2024-01-16",
      time: "11:30 AM",
      duration: "2.5 hours",
      status: "completed",
      address: "321 Elm St, Industrial Zone",
      price: "$350",
      assignedTo: "Robert Johnson",
      notes: "Office lighting installation completed"
    },
    {
      id: "APT005",
      customerName: "Lisa Anderson",
      customerPhone: "+1 (555) 654-3210",
      service: "Carpet Cleaning",
      category: "Cleaning",
      date: "2024-01-17",
      time: "3:00 PM",
      duration: "2 hours",
      status: "cancelled",
      address: "654 Maple Dr, Suburb",
      price: "$180",
      assignedTo: "Maria Garcia",
      notes: "Customer rescheduled"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success/20 text-success border-success/30"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "in-progress":
        return <Badge className="bg-primary/20 text-primary border-primary/30"><AlertCircle className="w-3 h-3 mr-1" />In Progress</Badge>
      case "completed":
        return <Badge className="bg-muted text-muted-foreground"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case "cancelled":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout 
      title="Appointment Management" 
      subtitle="Manage and track all appointments in your system"
    >
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search appointments by customer, service, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Service</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home-cleaning">Home Cleaning</SelectItem>
                    <SelectItem value="ac-maintenance">AC Maintenance</SelectItem>
                    <SelectItem value="plumbing">Plumbing Repair</SelectItem>
                    <SelectItem value="electrical">Electrical Work</SelectItem>
                    <SelectItem value="carpet-cleaning">Carpet Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date & Time</label>
                <Input type="datetime-local" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input placeholder="Enter service address" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input placeholder="Additional notes..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Create Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Appointments Table */}
      <Card className="bg-gradient-card border-border/40">
        <div className="p-6">
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Appointment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-primary">
                      {appointment.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.customerName}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.customerPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.service}</div>
                        <div className="text-sm text-muted-foreground">{appointment.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {appointment.date}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appointment.time} ({appointment.duration})
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {appointment.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-success">
                      {appointment.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredAppointments.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No appointments found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or create a new appointment.</p>
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default AppointmentManagement