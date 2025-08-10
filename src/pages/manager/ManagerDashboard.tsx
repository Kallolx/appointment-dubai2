import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ManagerLayout } from "./ManagerLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  Building2, 
  TrendingUp,
  Clock,
  Ticket,
  BarChart3,
  CheckCircle,
  ArrowUp,
  Activity,
  Star,
  DollarSign,
  AlertCircle,
  UserPlus,
  Settings,
  Bell,
  Eye,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function ManagerDashboard() {
  const isMobile = useIsMobile()
  const [selectedTab, setSelectedTab] = useState('overview')
  
  const stats = [
    {
      title: "Today's Appointments",
      value: "8",
      change: "+2 from yesterday",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "124",
      change: "+12% this month",
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Revenue Today",
      value: "$2,847",
      change: "+18% from yesterday",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Pending Tasks",
      value: "5",
      change: "2 urgent",
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ]

  const todayAppointments = [
    { 
      id: "APT001",
      time: "09:00 AM", 
      client: "Sarah Johnson", 
      service: "Business Consultation", 
      status: "confirmed",
      duration: "45 min",
      location: "Room 201",
      phone: "+1 234-567-8900",
      email: "sarah.j@email.com"
    },
    { 
      id: "APT002",
      time: "10:30 AM", 
      client: "Michael Chen", 
      service: "Project Review", 
      status: "in-progress",
      duration: "60 min",
      location: "Room 105",
      phone: "+1 234-567-8901",
      email: "m.chen@email.com"
    },
    { 
      id: "APT003",
      time: "02:00 PM", 
      client: "Emma Williams", 
      service: "Strategy Meeting", 
      status: "pending",
      duration: "30 min",
      location: "Conference Room A",
      phone: "+1 234-567-8902",
      email: "emma.w@email.com"
    },
    { 
      id: "APT004",
      time: "04:00 PM", 
      client: "David Brown", 
      service: "Follow-up Session", 
      status: "confirmed",
      duration: "30 min",
      location: "Room 303",
      phone: "+1 234-567-8903",
      email: "d.brown@email.com"
    }
  ]

  const recentActivities = [
    { type: "appointment", message: "New appointment scheduled with Alex Thompson", time: "5 min ago", icon: Calendar },
    { type: "user", message: "User profile updated: Jennifer Lee", time: "12 min ago", icon: Users },
    { type: "service", message: "Service pricing updated: Premium Consultation", time: "1 hour ago", icon: Building2 },
    { type: "ticket", message: "Support ticket resolved: #ST-2024-001", time: "2 hours ago", icon: Ticket }
  ]

  const quickStats = [
    { label: "Completion Rate", value: "96%", icon: CheckCircle2, color: "text-green-600" },
    { label: "Avg. Rating", value: "4.9", icon: Star, color: "text-yellow-600" },
    { label: "Response Time", value: "2.1h", icon: Clock, color: "text-blue-600" }
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed': 
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-700', 
          border: 'border-green-200',
          icon: CheckCircle2 
        }
      case 'in-progress': 
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-700', 
          border: 'border-blue-200',
          icon: Activity 
        }
      case 'pending': 
        return { 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-700', 
          border: 'border-yellow-200',
          icon: AlertTriangle 
        }
      default: 
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-700', 
          border: 'border-gray-200',
          icon: AlertCircle 
        }
    }
  }

  return (
    <ManagerLayout>
      <div className="flex flex-col w-full min-h-screen">
        {/* Enhanced Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Good morning, Manager! 👋
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      Here's what's happening with your team today
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-700 border-green-200 hidden sm:flex">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Online
                  </Badge>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
                  <CardHeader className="pb-3 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {stat.change}
                    </p>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Quick Performance Stats */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
              <CardHeader className="pb-4 p-6">
                <CardTitle className="text-lg font-bold flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Quick Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Appointments - Enhanced */}
              <div className="lg:col-span-2">
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="pb-4 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-3">
                          <Calendar className="w-6 h-6 text-blue-600" />
                          Today's Appointments
                        </CardTitle>
                        <CardDescription className="text-gray-600 mt-1">
                          {todayAppointments.length} appointments scheduled
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => {
                        const statusConfig = getStatusConfig(appointment.status)
                        const StatusIcon = statusConfig.icon
                        
                        return (
                          <div key={appointment.id} className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden">
                            {/* Mobile Layout */}
                            <div className="block lg:hidden p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{appointment.client}</h4>
                                    <p className="text-sm text-gray-600">{appointment.time}</p>
                                  </div>
                                </div>
                                <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {appointment.status}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{appointment.service}</p>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {appointment.duration}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {appointment.location}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-xs text-gray-500">ID: {appointment.id}</span>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                      <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                      <Mail className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden lg:flex items-center justify-between p-6">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-semibold text-gray-900">{appointment.client}</h4>
                                    <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border text-xs`}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">{appointment.service}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {appointment.time} • {appointment.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {appointment.location}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" title="Call">
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Email">
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="View Details">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Quick Actions - Enhanced */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="pb-4 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl rounded-xl py-4 px-6 transition-all duration-200">
                      <Calendar className="w-5 h-5 mr-4" />
                      <span className="font-semibold">New Appointment</span>
                    </Button>

                    <Button className="w-full justify-start bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:border-blue-600 text-gray-900 hover:text-white rounded-xl py-4 px-6 transition-all duration-200 group hover:shadow-lg">
                      <Users className="w-5 h-5 mr-4 text-gray-600 group-hover:text-white" />
                      <span className="font-semibold">Manage Users</span>
                    </Button>

                    <Button className="w-full justify-start bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:border-blue-600 text-gray-900 hover:text-white rounded-xl py-4 px-6 transition-all duration-200 group hover:shadow-lg">
                      <Building2 className="w-5 h-5 mr-4 text-gray-600 group-hover:text-white" />
                      <span className="font-semibold">Update Services</span>
                    </Button>

                    <Button className="w-full justify-start bg-white border border-gray-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:border-blue-600 text-gray-900 hover:text-white rounded-xl py-4 px-6 transition-all duration-200 group hover:shadow-lg">
                      <Ticket className="w-5 h-5 mr-4 text-gray-600 group-hover:text-white" />
                      <span className="font-semibold">Support Tickets</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                  <CardHeader className="pb-4 p-6">
                    <CardTitle className="text-lg font-bold flex items-center gap-3">
                      <Activity className="w-5 h-5 text-green-600" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-1.5 bg-white rounded-lg shadow-sm">
                            <activity.icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 leading-relaxed">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ManagerLayout>
  )
}