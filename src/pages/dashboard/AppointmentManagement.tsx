import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  AlertCircle,
  ArrowUpRight,
  Activity,
  RefreshCw,
  MoreVertical,
  TrendingUp,
  DollarSign
} from "lucide-react"

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

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

  const stats = [
    {
      title: "Total Appointments",
      value: appointments.length.toString(),
      change: "+8.2%",
      changeType: "increase",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "All appointments",
      trend: [45, 48, 52, 55, 58, 62, appointments.length],
    },
    {
      title: "Confirmed",
      value: appointments.filter(a => a.status === 'confirmed').length.toString(),
      change: "+12.5%",
      changeType: "increase",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Ready to go",
      trend: [15, 18, 20, 22, 25, 28, appointments.filter(a => a.status === 'confirmed').length],
    },
    {
      title: "Total Revenue",
      value: "$" + appointments.reduce((sum, apt) => sum + parseInt(apt.price.replace('$', '')), 0).toString(),
      change: "+15.3%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "This period",
      trend: [800, 850, 900, 950, 1000, 1050, appointments.reduce((sum, apt) => sum + parseInt(apt.price.replace('$', '')), 0)],
    },
    {
      title: "Pending",
      value: appointments.filter(a => a.status === 'pending').length.toString(),
      change: "+5.1%",
      changeType: "increase",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Awaiting confirm",
      trend: [8, 10, 12, 15, 18, 20, appointments.filter(a => a.status === 'pending').length],
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border border-green-200 shadow-sm font-medium"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm font-medium"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200 shadow-sm font-medium"><AlertCircle className="w-3 h-3 mr-1" />In Progress</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm font-medium"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border border-red-200 shadow-sm font-medium"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="secondary" className="shadow-sm font-medium">{status}</Badge>
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
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Appointment Management
            </h1>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live Data
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-lg ${stat.bgColor} shadow-sm`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                      stat.changeType === "increase"
                        ? "text-green-700 bg-green-100"
                        : stat.changeType === "decrease"
                        ? "text-red-700 bg-red-100"
                        : "text-gray-700 bg-gray-100"
                    }`}
                  >
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : stat.changeType === "decrease" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <Activity className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>

                {/* Mini Chart */}
                <div className="mt-3 h-6 flex items-end gap-0.5">
                  {stat.trend.map((value, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-sm ${stat.color
                        .replace("text-", "bg-")
                        .replace("-600", "-200")}`}
                      style={{
                        height: `${
                          (value / Math.max(...stat.trend)) * 100
                        }%`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Enhanced Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search appointments by customer, service, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 shadow-sm"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white border-gray-200 shadow-sm">
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
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
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

        {/* Enhanced Appointments Table */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Appointment Directory</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage and track all appointments in your system
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900">Appointment ID</TableHead>
                    <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-900">Service</TableHead>
                    <TableHead className="font-semibold text-gray-900">Date & Time</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Assigned To</TableHead>
                    <TableHead className="font-semibold text-gray-900">Price</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium text-blue-600">
                        {appointment.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{appointment.customerName}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {appointment.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{appointment.service}</div>
                          <div className="text-sm text-gray-600">{appointment.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {appointment.date}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {appointment.time} ({appointment.duration})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{appointment.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {appointment.price}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Appointment
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancel Appointment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredAppointments.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or create a new appointment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default AppointmentManagement