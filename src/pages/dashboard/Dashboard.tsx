import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  MapPin,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
  Eye,
  MoreVertical,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")
  const [activeTab, setActiveTab] = useState("recent")

  const stats = [
    {
      title: "Total Appointments",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "This month",
      trend: [2200, 2350, 2500, 2400, 2650, 2750, 2847],
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8.2%",
      changeType: "increase",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Registered users",
      trend: [1000, 1050, 1100, 1150, 1200, 1220, 1234],
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+15.3%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "This month",
      trend: [35000, 38000, 40000, 42000, 43000, 44000, 45678],
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "+5.1%",
      changeType: "increase",
      icon: TrendingUp,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "Month over month",
      trend: [15, 17, 19, 20, 21, 22, 23.5],
    },
    {
      title: "Pending Requests",
      value: "86",
      change: "+12",
      changeType: "increase",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Awaiting approval",
      trend: [65, 70, 72, 75, 78, 82, 86],
    },
    {
      title: "Completed Today",
      value: "142",
      change: "+28",
      changeType: "increase",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Finished services",
      trend: [100, 110, 115, 120, 125, 135, 142],
    }
  ]

  const recentAppointments = [
    {
      id: 1,
      customerName: "Sarah Johnson",
      service: "Home Cleaning",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed",
      location: "Downtown Area",
      phone: "+1 (555) 123-4567"
    },
    {
      id: 2,
      customerName: "Mike Chen",
      service: "AC Maintenance",
      date: "2024-01-15",
      time: "2:00 PM",
      status: "pending",
      location: "Business District",
      phone: "+1 (555) 987-6543"
    },
    {
      id: 3,
      customerName: "Emily Davis",
      service: "Plumbing Repair",
      date: "2024-01-16",
      time: "9:00 AM",
      status: "in-progress",
      location: "Residential Area",
      phone: "+1 (555) 456-7890"
    },
    {
      id: 4,
      customerName: "James Wilson",
      service: "Electrical Work",
      date: "2024-01-16",
      time: "11:30 AM",
      status: "completed",
      location: "Industrial Zone",
      phone: "+1 (555) 321-0987"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border border-green-200 shadow-sm font-medium">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm font-medium">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200 shadow-sm font-medium">In Progress</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm font-medium">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border border-red-200 shadow-sm font-medium">Cancelled</Badge>
      default:
        return <Badge variant="secondary" className="shadow-sm font-medium">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "in-progress":
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-gray-600" />
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
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
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-32 bg-white border-gray-200 shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

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

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
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
                      <ArrowDownRight className="w-3 h-3" />
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

        {/* Enhanced Recent Appointments */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Recent Appointments</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest appointments and their current status
                </CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {recentAppointments.map((appointment) => (
              <div 
                key={appointment.id}
                className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:shadow-md transition-all duration-300 hover:bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                      {getStatusIcon(appointment.status)}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-gray-900">{appointment.customerName}</h4>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(appointment.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <Button variant="outline" className="w-full rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
              View All Appointments
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard