import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowUpRight, 
  Activity, 
  RefreshCw, 
  MoreVertical,
  TrendingUp,
  Users,
  Map
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const serviceAreas = [
  { id: 1, name: "Downtown", zipCodes: ["10001", "10002", "10003"], status: "active", services: 12 },
  { id: 2, name: "Midtown", zipCodes: ["10018", "10019", "10020"], status: "active", services: 8 },
  { id: 3, name: "Upper East Side", zipCodes: ["10021", "10028", "10075"], status: "active", services: 15 },
  { id: 4, name: "Brooklyn Heights", zipCodes: ["11201", "11205", "11206"], status: "inactive", services: 5 },
  { id: 5, name: "Queens", zipCodes: ["11101", "11102", "11103"], status: "active", services: 10 },
]

export default function ServiceAreas() {
  const [refreshing, setRefreshing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const stats = [
    {
      title: "Total Areas",
      value: serviceAreas.length.toString(),
      change: "+1",
      changeType: "increase",
      icon: Map,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Service coverage",
      trend: [4, 4, 5, 5, 5, 5, serviceAreas.length],
    },
    {
      title: "Active Areas",
      value: serviceAreas.filter(a => a.status === 'active').length.toString(),
      change: "+25%",
      changeType: "increase",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Currently serving",
      trend: [3, 3, 4, 4, 4, 4, serviceAreas.filter(a => a.status === 'active').length],
    },
    {
      title: "Total Services",
      value: serviceAreas.reduce((sum, area) => sum + area.services, 0).toString(),
      change: "+12.5%",
      changeType: "increase",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Available services",
      trend: [40, 42, 45, 47, 48, 49, serviceAreas.reduce((sum, area) => sum + area.services, 0)],
    },
    {
      title: "Zip Codes",
      value: serviceAreas.reduce((sum, area) => sum + area.zipCodes.length, 0).toString(),
      change: "+3",
      changeType: "increase",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Coverage zones",
      trend: [12, 13, 14, 15, 15, 15, serviceAreas.reduce((sum, area) => sum + area.zipCodes.length, 0)],
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
              Service Areas
            </h1>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Coverage Map
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
              Add Service Area
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

        {/* Enhanced Area Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {serviceAreas.slice(0, 3).map((area) => (
            <Card key={area.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{area.name}</h3>
                  <Badge 
                    className={`shadow-sm font-medium ${
                      area.status === "active" 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {area.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Zip Codes</p>
                    <div className="flex flex-wrap gap-1">
                      {area.zipCodes.map((zip) => (
                        <Badge key={zip} variant="outline" className="text-xs border-gray-200 text-gray-700">
                          {zip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Services</span>
                    <span className="font-medium text-gray-900">{area.services}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 border-gray-200 hover:bg-gray-50">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Area
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Area
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced All Service Areas Table */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-white">All Service Areas</CardTitle>
                  <CardDescription className="text-white/80">
                    Complete list of service coverage areas
                  </CardDescription>
                </div>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
                <Input
                  placeholder="Search areas..."
                  className="pl-10 w-full sm:w-64 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70 focus:border-white/50"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {serviceAreas.map((area) => (
                <div key={area.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-gray-50/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{area.name}</h3>
                        <Badge 
                          className={`shadow-sm font-medium ${
                            area.status === "active" 
                              ? "bg-green-100 text-green-800 border border-green-200" 
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {area.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-1">Zip Codes</p>
                          <div className="flex flex-wrap gap-1">
                            {area.zipCodes.map((zip) => (
                              <Badge key={zip} variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                {zip}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-1">Active Services</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">{area.services}</span>
                            <Badge className="bg-green-100 text-green-800 border border-green-200">
                              Available
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-1">Coverage</p>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">{area.zipCodes.length} ZIP codes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-gray-200 shadow-lg">
                        <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                          <Edit className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-blue-600">Edit Area</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-green-50 cursor-pointer">
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-green-600">View Coverage</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Area
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Add Area Form */}
        {showAddForm && (
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-white">Add New Service Area</CardTitle>
                    <CardDescription className="text-white/80">
                      Define a new geographical area for service coverage
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowAddForm(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="areaName" className="text-sm font-medium text-gray-700">Area Name</Label>
                    <Input 
                      id="areaName" 
                      placeholder="Enter area name..." 
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCodes" className="text-sm font-medium text-gray-700">Zip Codes</Label>
                    <Input 
                      id="zipCodes" 
                      placeholder="10001, 10002, 10003..." 
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="services" className="text-sm font-medium text-gray-700">Number of Services</Label>
                    <Input 
                      id="services" 
                      type="number" 
                      placeholder="0" 
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                    <select 
                      id="status" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500/20 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service Area
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}