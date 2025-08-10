import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Clock,
  Ticket,
  BarChart3,
  Plus,
  Eye,
  Edit,
  UserPlus,
  Globe,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Star,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  RefreshCw,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const isMobile = useIsMobile();
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [refreshing, setRefreshing] = useState(false);

  const stats = [
    {
      title: "Total Appointments",
      value: "1,245",
      change: "+12.5%",
      changeType: "increase",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "This month",
      trend: [65, 70, 68, 75, 80, 78, 85],
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8.2%",
      changeType: "increase",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Total registered",
      trend: [45, 52, 48, 58, 62, 65, 70],
    },
    {
      title: "Services Available",
      value: "47",
      change: "+5",
      changeType: "increase",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Active services",
      trend: [30, 32, 35, 38, 42, 45, 47],
    },
    {
      title: "Monthly Revenue",
      value: "$48,290",
      change: "+18.7%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "This month",
      trend: [25000, 28000, 32000, 35000, 38000, 42000, 48290],
    },
    {
      title: "Pending Tickets",
      value: "23",
      change: "-15%",
      changeType: "decrease",
      icon: Ticket,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Needs attention",
      trend: [35, 32, 28, 30, 27, 25, 23],
    },
    {
      title: "Active Managers",
      value: "12",
      change: "+2",
      changeType: "increase",
      icon: UserPlus,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "Currently online",
      trend: [8, 9, 10, 10, 11, 11, 12],
    },
  ];

  const recentAppointments = [
    {
      id: "APT-001",
      customer: "John Doe",
      service: "Deep Cleaning",
      date: "2024-12-15",
      time: "10:00 AM",
      status: "confirmed",
      location: "New York, NY",
      price: "$120",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "APT-002",
      customer: "Sarah Wilson",
      service: "Furniture Cleaning",
      date: "2024-12-15",
      time: "2:30 PM",
      status: "pending",
      location: "Brooklyn, NY",
      price: "$85",
      phone: "+1 (555) 987-6543",
    },
    {
      id: "APT-003",
      customer: "Mike Johnson",
      service: "AC Maintenance",
      date: "2024-12-16",
      time: "9:00 AM",
      status: "in-progress",
      location: "Manhattan, NY",
      price: "$200",
      phone: "+1 (555) 456-7890",
    },
    {
      id: "APT-004",
      customer: "Emily Davis",
      service: "Pest Control",
      date: "2024-12-16",
      time: "3:00 PM",
      status: "completed",
      location: "Queens, NY",
      price: "$150",
      phone: "+1 (555) 321-0987",
    },
  ];

  const recentActivities = [
    {
      type: "appointment",
      message: "New appointment scheduled by John Doe",
      time: "2 mins ago",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      type: "manager",
      message: "Manager role assigned to Sarah Chen",
      time: "15 mins ago",
      icon: UserPlus,
      color: "text-green-600",
    },
  ];

  const topServices = [
    {
      name: "Deep Cleaning",
      bookings: 156,
      revenue: "$18,720",
      growth: "+23%",
      rating: 4.8,
      category: "Cleaning",
    },
    {
      name: "AC Maintenance",
      bookings: 98,
      revenue: "$19,600",
      growth: "+12%",
      rating: 4.9,
      category: "Maintenance",
    },
    {
      name: "Pest Control",
      bookings: 67,
      revenue: "$10,050",
      growth: "+8%",
      rating: 4.7,
      category: "Health",
    },
    {
      name: "Furniture Cleaning",
      bookings: 45,
      revenue: "$3,825",
      growth: "+15%",
      rating: 4.6,
      category: "Cleaning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-3 h-3" />;
      case "pending":
        return <Clock3 className="w-3 h-3" />;
      case "in-progress":
        return <Activity className="w-3 h-3" />;
      case "completed":
        return <CheckCircle2 className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col w-full min-h-screen">
        {/* Enhanced Header */}
        <header className="h-14 sm:h-16 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <SidebarTrigger className="lg:hidden flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate">
                  Welcome back! Here's what's happening with your business
                  today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Select
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              >
                <SelectTrigger className="w-24 sm:w-32 bg-white border-gray-200 shadow-sm text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
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
                className="bg-white border-gray-200 hover:bg-gray-50 w-8 h-8 sm:w-9 sm:h-9 shadow-sm"
              >
                <RefreshCw
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </Button>

              <Badge
                variant="outline"
                className="hidden sm:flex bg-green-50 text-green-700 border-green-200 px-2 sm:px-3 py-1 sm:py-1.5 text-xs"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse" />
                <span className="hidden md:inline">Online</span>
                <span className="md:hidden">•</span>
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content with proper spacing */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
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
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {stat.changeType === "increase" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
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

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              {/* Recent Appointments - Spans 2 columns */}
              <div className="xl:col-span-2">
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="pb-4 sm:pb-6 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-3">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          Recent Appointments
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-sm sm:text-base">
                          Latest bookings and their status
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white border-gray-200 shadow-sm px-3 py-2 sm:px-4 text-sm w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="space-y-3 sm:space-y-4">
                      {recentAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200"
                        >
                          {/* Mobile Layout */}
                          <div className="block sm:hidden p-4">
                            {/* Top Row - Customer, Status, Actions */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-base text-gray-900 truncate mb-1">
                                    {appointment.customer}
                                  </h4>
                                  <Badge
                                    className={`text-xs px-2 py-1 ${getStatusColor(
                                      appointment.status
                                    )} w-fit`}
                                  >
                                    {getStatusIcon(appointment.status)}
                                    <span className="ml-1 capitalize">
                                      {appointment.status}
                                    </span>
                                  </Badge>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8 flex-shrink-0"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call Customer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Service Name */}
                            <p className="text-sm text-gray-700 font-medium mb-3 ml-13">
                              {appointment.service}
                            </p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-500 ml-13 mb-3">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                                <span>{appointment.date}</span>
                                <Clock className="w-3 h-3 flex-shrink-0 ml-2" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {appointment.location}
                                </span>
                              </div>
                            </div>

                            {/* Price and ID */}
                            <div className="flex items-center justify-between ml-13">
                              <div className="text-lg font-bold text-green-600">
                                {appointment.price}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {appointment.id}
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden sm:flex items-center justify-between p-4 sm:p-6">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CalendarIcon className="w-6 h-6 text-blue-600" />
                              </div>

                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-semibold text-base text-gray-900 truncate">
                                    {appointment.customer}
                                  </h4>
                                  <Badge
                                    className={`text-xs px-2 py-1 ${getStatusColor(
                                      appointment.status
                                    )} flex-shrink-0`}
                                  >
                                    {getStatusIcon(appointment.status)}
                                    <span className="ml-1 capitalize">
                                      {appointment.status}
                                    </span>
                                  </Badge>
                                </div>

                                <p className="text-sm text-gray-700 font-medium mb-2">
                                  {appointment.service}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    {appointment.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {appointment.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate max-w-32">
                                      {appointment.location}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              <div className="text-right space-y-1 flex-shrink-0">
                                <p className="text-lg font-bold text-green-600">
                                  {appointment.price}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {appointment.id}
                                </p>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-3 w-8 h-8"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call Customer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="pb-4 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-6 pb-6">
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg rounded-xl py-2.5 px-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      New Appointment
                    </Button>
                    <Button className="w-full justify-start bg-white text-black border border-gray-200 hover:bg-green-50 hover:border-green-200 rounded-xl py-2.5 px-4">
                      <UserPlus className="w-4 h-4 mr-2 text-green-600" />
                      Add Manager
                    </Button>
                    <Button className="w-full justify-start bg-white text-black border border-gray-200 hover:bg-purple-50 hover:border-purple-200 rounded-xl py-2.5 px-4">
                      <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                      Add Service
                    </Button>
                    <Button className="w-full justify-start bg-white text-black border border-gray-200 hover:bg-orange-50 hover:border-orange-200 rounded-xl py-2.5 px-4">
                      <Globe className="w-4 h-4 mr-2 text-orange-600" />
                      Create Page
                    </Button>
                    <Button className="w-full justify-start bg-white text-black border border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-xl py-2.5 px-4">
                      <Ticket className="w-4 h-4 mr-2 text-red-600" />
                      Support Tickets
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="pb-4 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Recent Activities
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Latest system activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-3">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200"
                        >
                          <div className="p-2 rounded-lg bg-gray-50">
                            <activity.icon
                              className={`h-4 w-4 ${activity.color}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 leading-relaxed">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Section - Top Services and Performance */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Top Services */}
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                <CardHeader className="pb-4 sm:pb-6 p-4 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                        Top Services
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm sm:text-base">
                        Most popular services this{" "}
                        {selectedTimeframe.replace("ly", "")}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-gray-200 shadow-sm px-3 py-2 sm:px-4 text-sm w-full sm:w-auto"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="px-4 sm:px-8 pb-4 sm:pb-8">
                  <div className="space-y-3 sm:space-y-6">
                    {topServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200"
                      >
                        {/* Rank Badge */}
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 self-start sm:self-center">
                          <span className="text-base sm:text-lg font-bold text-yellow-600">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                          {/* Service Name and Category */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <h4 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                              {service.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 w-fit"
                            >
                              {service.category}
                            </Badge>
                          </div>

                          {/* Stats Row */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600">
                            <span className="font-medium">
                              {service.bookings} bookings
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium">
                                {service.rating}
                              </span>
                            </span>
                          </div>

                          {/* Revenue and Growth */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                            <span className="text-lg sm:text-xl font-bold text-green-600">
                              {service.revenue}
                            </span>
                            <span className="text-xs sm:text-sm text-green-600 font-semibold bg-green-100 px-2 sm:px-3 py-1 rounded-full w-fit">
                              {service.growth}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Performance */}
              <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                <CardHeader className="pb-6 p-8">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    System Performance
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Real-time system metrics and health
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 px-8 pb-8">
                  {/* Server Health */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-100">
                          <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        Server Health
                      </div>
                      <div className="text-base font-bold text-green-600">
                        98.5%
                      </div>
                    </div>
                    <Progress value={98.5} className="h-3 rounded-full" />
                  </div>

                  {/* Database Performance */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-100">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        Database Performance
                      </div>
                      <div className="text-base font-bold text-blue-600">
                        94.2%
                      </div>
                    </div>
                    <Progress value={94.2} className="h-3 rounded-full" />
                  </div>

                  {/* API Response Time */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange-100">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        API Response Time
                      </div>
                      <div className="text-base font-bold text-orange-600">
                        125ms
                      </div>
                    </div>
                    <Progress value={87} className="h-3 rounded-full" />
                  </div>

                  {/* User Satisfaction */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-purple-100">
                          <Star className="h-5 w-5 text-purple-600" />
                        </div>
                        User Satisfaction
                      </div>
                      <div className="text-base font-bold text-purple-600">
                        4.8/5.0
                      </div>
                    </div>
                    <Progress value={96} className="h-3 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
