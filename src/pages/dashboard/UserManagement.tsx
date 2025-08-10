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
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  Crown,
  ArrowUpRight,
  Activity,
  RefreshCw,
  MoreVertical,
  TrendingUp
} from "lucide-react"

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const users = [
    {
      id: "USR001",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      role: "super_admin",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM",
      joinDate: "2023-01-15",
      totalAppointments: 0,
      location: "New York, NY"
    },
    {
      id: "USR002",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 987-6543",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM",
      joinDate: "2023-03-20",
      totalAppointments: 0,
      location: "Los Angeles, CA"
    },
    {
      id: "USR003",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 456-7890",
      role: "manager",
      status: "active",
      lastLogin: "2024-01-14 05:45 PM",
      joinDate: "2023-05-10",
      totalAppointments: 0,
      location: "Chicago, IL"
    },
    {
      id: "USR004",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 321-0987",
      role: "user",
      status: "active",
      lastLogin: "2024-01-15 08:20 AM",
      joinDate: "2023-08-15",
      totalAppointments: 12,
      location: "Houston, TX"
    },
    {
      id: "USR005",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 654-3210",
      role: "user",
      status: "inactive",
      lastLogin: "2024-01-10 02:30 PM",
      joinDate: "2023-09-22",
      totalAppointments: 8,
      location: "Phoenix, AZ"
    },
    {
      id: "USR006",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+1 (555) 789-0123",
      role: "user",
      status: "suspended",
      lastLogin: "2024-01-08 11:15 AM",
      joinDate: "2023-11-05",
      totalAppointments: 5,
      location: "Philadelphia, PA"
    }
  ]

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+12.5%",
      changeType: "increase",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "All registered",
      trend: [150, 160, 165, 170, 175, 180, users.length],
    },
    {
      title: "Active Users",
      value: users.filter(u => u.status === 'active').length.toString(),
      change: "+8.2%",
      changeType: "increase",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Currently active",
      trend: [120, 125, 128, 130, 132, 135, users.filter(u => u.status === 'active').length],
    },
    {
      title: "Admins",
      value: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length.toString(),
      change: "+5.1%",
      changeType: "increase",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "System admins",
      trend: [8, 9, 10, 11, 12, 13, users.filter(u => ['super_admin', 'admin'].includes(u.role)).length],
    },
    {
      title: "This Month",
      value: "+24",
      change: "+15.3%",
      changeType: "increase",
      icon: Calendar,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "New signups",
      trend: [15, 18, 20, 22, 24, 26, 24],
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-sm font-medium"><Crown className="w-3 h-3 mr-1" />Super Admin</Badge>
      case "admin":
        return <Badge className="bg-orange-100 text-orange-800 border border-orange-200 shadow-sm font-medium"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
      case "manager":
        return <Badge className="bg-green-100 text-green-800 border border-green-200 shadow-sm font-medium"><UserCheck className="w-3 h-3 mr-1" />Manager</Badge>
      case "user":
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm font-medium"><Users className="w-3 h-3 mr-1" />User</Badge>
      default:
        return <Badge variant="secondary" className="shadow-sm font-medium">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border border-green-200 shadow-sm font-medium">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm font-medium">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 border border-red-200 shadow-sm font-medium">Suspended</Badge>
      default:
        return <Badge variant="secondary" className="shadow-sm font-medium">{status}</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
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
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 shadow-sm"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48 bg-white border-gray-200 shadow-sm">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-white border-gray-200 shadow-sm">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input placeholder="Enter email address" type="email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="Enter location" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input placeholder="Enter password" type="password" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input placeholder="Confirm password" type="password" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsDialogOpen(false)}>Add User</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Enhanced Users Table */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">User Directory</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage user accounts and permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900">User</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-900">Role</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Appointments</TableHead>
                    <TableHead className="font-semibold text-gray-900">Last Login</TableHead>
                    <TableHead className="font-semibold text-gray-900">Join Date</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-sm font-bold text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {user.phone}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {user.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium text-lg text-gray-900">{user.totalAppointments}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">{user.lastLogin}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">{user.joinDate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
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
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or add a new user.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default UserManagement