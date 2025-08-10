import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  ArrowUpRight, 
  Activity, 
  RefreshCw, 
  MoreVertical,
  Crown,
  UserCheck,
  TrendingUp,
  Settings,
  Lock
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const roles = [
  { 
    id: 1, 
    name: "Super Admin", 
    users: 1, 
    permissions: 25, 
    color: "bg-gradient-to-r from-purple-600 to-blue-600",
    icon: Crown,
    description: "Full system access",
    trend: [20, 22, 23, 24, 25, 25, 25]
  },
  { 
    id: 2, 
    name: "Admin", 
    users: 3, 
    permissions: 18, 
    color: "bg-orange-500",
    icon: Shield,
    description: "Administrative access",
    trend: [15, 16, 17, 17, 18, 18, 18]
  },
  { 
    id: 3, 
    name: "Manager", 
    users: 8, 
    permissions: 12, 
    color: "bg-green-500",
    icon: UserCheck,
    description: "Management access",
    trend: [8, 9, 10, 11, 12, 12, 12]
  },
  { 
    id: 4, 
    name: "User", 
    users: 156, 
    permissions: 5, 
    color: "bg-gray-500",
    icon: Users,
    description: "Basic user access",
    trend: [3, 4, 4, 5, 5, 5, 5]
  },
]

export default function RoleManagement() {
  const [refreshing, setRefreshing] = useState(false)

  const stats = [
    {
      title: "Total Roles",
      value: roles.length.toString(),
      change: "+2.5%",
      changeType: "increase",
      icon: Settings,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "System roles",
      trend: [3, 3, 4, 4, 4, 4, roles.length],
    },
    {
      title: "Total Users",
      value: roles.reduce((sum, role) => sum + role.users, 0).toString(),
      change: "+12.3%",
      changeType: "increase",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "All users",
      trend: [140, 145, 150, 155, 160, 165, roles.reduce((sum, role) => sum + role.users, 0)],
    },
    {
      title: "Avg Permissions",
      value: Math.round(roles.reduce((sum, role) => sum + role.permissions, 0) / roles.length).toString(),
      change: "+5.1%",
      changeType: "increase",
      icon: Lock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Per role",
      trend: [12, 13, 14, 14, 15, 15, Math.round(roles.reduce((sum, role) => sum + role.permissions, 0) / roles.length)],
    },
    {
      title: "Active Admins",
      value: roles.filter(r => ['Super Admin', 'Admin'].includes(r.name)).reduce((sum, role) => sum + role.users, 0).toString(),
      change: "+8.7%",
      changeType: "increase",
      icon: Shield,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "Admin users",
      trend: [3, 3, 4, 4, 4, 4, roles.filter(r => ['Super Admin', 'Admin'].includes(r.name)).reduce((sum, role) => sum + role.users, 0)],
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Role Management
            </h1>
            <Badge
              variant="outline"
              className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1.5"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse" />
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
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
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

        {/* Enhanced Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {roles.map((role) => (
            <Card key={role.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${role.color} shadow-sm`}>
                      <role.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Badge className={`${role.color} text-white border-0 shadow-sm font-medium`}>
                        {role.name}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="w-4 h-4 mr-2" />
                        View Users
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Users</span>
                  <span className="font-medium text-gray-900">{role.users}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Permissions</span>
                  <span className="font-medium text-gray-900">{role.permissions}</span>
                </div>
                {/* Mini Trend */}
                <div className="mt-3 h-4 flex items-end gap-0.5">
                  {role.trend.map((value, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-sm bg-gray-200"
                      style={{
                        height: `${
                          (value / Math.max(...role.trend)) * 100
                        }%`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Role Details Table */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Role Details</CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed view of all roles and their configurations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900">Role Name</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold text-gray-900">Users</TableHead>
                    <TableHead className="hidden md:table-cell font-semibold text-gray-900">Permissions</TableHead>
                    <TableHead className="hidden lg:table-cell font-semibold text-gray-900">Created</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${role.color} shadow-sm`}>
                            <role.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <Badge className={`${role.color} text-white border-0 shadow-sm font-medium`}>
                              {role.name}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{role.users}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="font-medium text-gray-900">{role.permissions}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600">
                        2024-01-15
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              View Users
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}