import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  MapPin,
  MessageSquare,
  User,
  Phone,
  Mail,
  Star,
  Heart,
  CreditCard,
  RefreshCw,
  Plus,
  Eye,
  MoreVertical
} from "lucide-react"
import { UserLayout } from "@/pages/users/UserLayout"
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

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly")
  const [refreshing, setRefreshing] = useState(false)

  const stats = [
    {
      title: "Total Appointments",
      value: "12",
      change: "+3",
      changeType: "increase",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "This month",
      trend: [8, 9, 10, 8, 11, 10, 12],
    },
    {
      title: "Upcoming",
      value: "3",
      change: "+1",
      changeType: "increase",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Next 7 days",
      trend: [2, 1, 3, 2, 4, 2, 3],
    },
    {
      title: "Completed",
      value: "8",
      change: "+2",
      changeType: "increase",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "This month",
      trend: [4, 5, 6, 5, 7, 6, 8],
    },
    {
      title: "Saved Addresses",
      value: "2",
      change: "0",
      changeType: "neutral",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Active locations",
      trend: [2, 2, 2, 2, 2, 2, 2],
    },
    {
      title: "Favorite Services",
      value: "5",
      change: "+1",
      changeType: "increase",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Saved services",
      trend: [3, 4, 4, 4, 5, 4, 5],
    },
    {
      title: "Total Spent",
      value: "$1,240",
      change: "+$180",
      changeType: "increase",
      icon: CreditCard,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "This month",
      trend: [800, 900, 950, 1000, 1100, 1200, 1240],
    }
  ]

  const upcomingAppointments = [
    {
      id: "APT-001",
      service: "Home Cleaning",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed",
      location: "123 Main St, Apt 4B",
      price: "$89.99",
      category: "Cleaning",
      provider: "CleanPro Services",
      rating: 4.8
    },
    {
      id: "APT-002",
      service: "AC Maintenance",
      date: "2024-01-18",
      time: "2:00 PM",
      status: "pending",
      location: "123 Main St, Apt 4B",
      price: "$129.99",
      category: "Maintenance",
      provider: "CoolTech Solutions",
      rating: 4.9
    },
    {
      id: "APT-003",
      service: "Furniture Cleaning",
      date: "2024-01-22",
      time: "11:30 AM",
      status: "confirmed",
      location: "456 Park Ave, Suite 10",
      price: "$149.99",
      category: "Cleaning",
      provider: "FurniCare Pro",
      rating: 4.7
    }
  ]

  const pastAppointments = [
    {
      id: "APT-004",
      service: "Home Cleaning",
      date: "2023-12-15",
      time: "10:00 AM",
      status: "completed",
      location: "123 Main St, Apt 4B",
      price: "$89.99",
      category: "Cleaning",
      provider: "CleanPro Services",
      rating: 4.8
    },
    {
      id: "APT-005",
      service: "Pest Control",
      date: "2023-12-05",
      time: "9:00 AM",
      status: "completed",
      location: "123 Main St, Apt 4B",
      price: "$119.99",
      category: "Health",
      provider: "PestAway Solutions",
      rating: 4.6
    },
    {
      id: "APT-006",
      service: "Plumbing Repair",
      date: "2023-11-28",
      time: "3:30 PM",
      status: "completed",
      location: "123 Main St, Apt 4B",
      price: "$199.99",
      category: "Maintenance",
      provider: "FixIt Plumbing",
      rating: 4.5
    }
  ]

  const favoriteServices = [
    {
      name: "Home Cleaning",
      bookings: 8,
      lastUsed: "2024-01-10",
      rating: 4.8,
      category: "Cleaning",
      provider: "CleanPro Services",
      price: "$89.99"
    },
    {
      name: "AC Maintenance", 
      bookings: 3,
      lastUsed: "2023-12-20",
      rating: 4.9,
      category: "Maintenance",
      provider: "CoolTech Solutions",
      price: "$129.99"
    },
    {
      name: "Pest Control",
      bookings: 2,
      lastUsed: "2023-12-05", 
      rating: 4.6,
      category: "Health",
      provider: "PestAway Solutions",
      price: "$119.99"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed'
      case 'pending': return 'Pending'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cleaning': return 'bg-blue-100 text-blue-800'
      case 'Maintenance': return 'bg-green-100 text-green-800'
      case 'Health': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  return (
    <UserLayout>
      <div className="flex flex-col w-full min-h-screen">
        {/* Enhanced Header */}
        <header className="h-14 sm:h-16 sticky top-0 z-40 mb-6">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  User Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate">
                  Welcome back! Manage your appointments and track your services.
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
                <span className="hidden md:inline">Active</span>
                <span className="md:hidden">•</span>
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="space-y-4 sm:space-y-6">
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

            {/* Enhanced Appointments Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <Card className="xl:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
                <CardHeader className="pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">My Appointments</CardTitle>
                      <CardDescription className="text-gray-600">
                        View and manage your upcoming and past appointments
                      </CardDescription>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
                      <Plus className="w-4 h-4 mr-2" />
                      Book New
                    </Button>
                  </div>
                  <div className="flex mt-4 border-b border-gray-100">
                    <Button 
                      variant="ghost" 
                      className={`rounded-none border-b-2 px-6 ${activeTab === 'upcoming' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500'}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      Upcoming ({upcomingAppointments.length})
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`rounded-none border-b-2 px-6 ${activeTab === 'past' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500'}`}
                      onClick={() => setActiveTab('past')}
                    >
                      Past ({pastAppointments.length})
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((appointment) => (
                    <div key={appointment.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:shadow-md transition-all duration-300 hover:bg-white">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{appointment.service}</h3>
                              <Badge className={`text-xs px-2 py-1 ${getCategoryColor(appointment.category)}`}>
                                {appointment.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{appointment.date} at {appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{appointment.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{appointment.provider}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{appointment.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col lg:items-end gap-3">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs px-2 py-1 border ${getStatusColor(appointment.status)}`}>
                              {getStatusText(appointment.status)}
                            </Badge>
                            <span className="text-lg font-bold text-gray-900">{appointment.price}</span>
                          </div>
                          <div className="flex gap-2">
                            {activeTab === 'upcoming' && (
                              <>
                                <Button size="sm" variant="outline" className="text-xs h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-8 px-3 border-orange-200 text-orange-600 hover:bg-orange-50">
                                  Reschedule
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-xs h-8 px-2 border-gray-200">
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            )}
                            {activeTab === 'past' && (
                              <>
                                <Button size="sm" variant="outline" className="text-xs h-8 px-3 border-blue-200 text-blue-600 hover:bg-blue-50">
                                  <Plus className="w-3 h-3 mr-1" />
                                  Book Again
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-8 px-3 border-green-200 text-green-600 hover:bg-green-50">
                                  Review
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions & Favorite Services */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all duration-300 rounded-lg h-12" variant="default">
                      <div className="p-2 rounded-md bg-white/20 mr-3">
                        <Calendar className="w-4 h-4" />
                      </div>
                      Book New Appointment
                    </Button>
                    <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg h-12" variant="outline">
                      <div className="p-2 rounded-md bg-green-100 mr-3">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      Manage Addresses
                    </Button>
                    <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg h-12" variant="outline">
                      <div className="p-2 rounded-md bg-orange-100 mr-3">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                      </div>
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900">Favorite Services</CardTitle>
                    <CardDescription className="text-gray-600">Your most used services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {favoriteServices.map((service, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gray-50 border border-gray-200 hover:shadow-sm transition-all duration-300 hover:bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900">{service.name}</div>
                                <div className="text-xs text-gray-500">{service.bookings} bookings</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-gray-900">{service.price}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{service.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </UserLayout>
  )
}

export default UserDashboard