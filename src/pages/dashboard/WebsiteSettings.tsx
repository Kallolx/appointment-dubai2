import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Globe, 
  Save, 
  Upload, 
  Palette, 
  Settings,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Shield,
  Mail,
  Smartphone,
  BarChart3,
  Calendar
} from "lucide-react"

export default function WebsiteSettings() {
  const [refreshing, setRefreshing] = useState(false)

  const stats = [
    {
      title: "Active Features",
      value: "6",
      change: "+2",
      changeType: "increase",
      icon: Settings,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Enabled settings",
      trend: [4, 4, 5, 5, 6, 6, 6],
    },
    {
      title: "Website Status",
      value: "Online",
      change: "100%",
      changeType: "increase",
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Uptime today",
      trend: [98, 99, 100, 100, 100, 100, 100],
    },
    {
      title: "Security Level",
      value: "High",
      change: "+5.2%",
      changeType: "increase",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Protection score",
      trend: [85, 87, 90, 92, 95, 97, 95],
    },
    {
      title: "Notifications",
      value: "3",
      change: "+1",
      changeType: "increase",
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Active channels",
      trend: [2, 2, 2, 3, 3, 3, 3],
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
              Website Settings
            </h1>
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1.5"
            >
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
              Configuration
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

        {/* Enhanced Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                <div className="p-2 rounded-lg bg-blue-50 shadow-sm">
                  <Palette className="w-5 h-5 text-blue-600" />
                </div>
                Site Identity
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure your website's basic information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm font-medium text-gray-700">Site Name</Label>
                <Input id="siteName" defaultValue="AppointPro" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTagline" className="text-sm font-medium text-gray-700">Tagline</Label>
                <Input id="siteTagline" defaultValue="Professional Appointment Management" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea 
                  id="siteDescription" 
                  rows={3}
                  defaultValue="Streamline your appointment scheduling with our comprehensive management system."
                  className="bg-white border-gray-200 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteLogo" className="text-sm font-medium text-gray-700">Site Logo</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input id="siteLogo" placeholder="Upload logo..." className="flex-1 bg-white border-gray-200 shadow-sm" />
                  <Button variant="outline" className="w-full sm:w-auto border-gray-200 hover:bg-gray-50 shadow-sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                <div className="p-2 rounded-lg bg-green-50 shadow-sm">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                Contact Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Display contact details on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">Contact Email</Label>
                <Input id="contactEmail" type="email" defaultValue="contact@appointpro.com" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input id="contactPhone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress" className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea 
                  id="contactAddress" 
                  rows={3}
                  defaultValue="123 Business St, Suite 100, City, State 12345"
                  className="bg-white border-gray-200 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessHours" className="text-sm font-medium text-gray-700">Business Hours</Label>
                <Textarea 
                  id="businessHours" 
                  rows={2}
                  defaultValue="Monday - Friday: 9:00 AM - 6:00 PM"
                  className="bg-white border-gray-200 shadow-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Card */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              <div className="p-2 rounded-lg bg-purple-50 shadow-sm">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              Website Features
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enable or disable website functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <Label className="font-medium text-gray-900">Online Booking</Label>
                      <p className="text-sm text-gray-600">Allow customers to book appointments online</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <Mail className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <Label className="font-medium text-gray-900">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Send automated email confirmations</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-50">
                      <Smartphone className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <Label className="font-medium text-gray-900">SMS Reminders</Label>
                      <p className="text-sm text-gray-600">Send SMS appointment reminders</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-50">
                      <Activity className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <Label className="font-medium text-gray-900">Customer Reviews</Label>
                      <p className="text-sm text-gray-600">Enable customer review system</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-50">
                      <BarChart3 className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <Label className="font-medium text-gray-900">Analytics Tracking</Label>
                      <p className="text-sm text-gray-600">Track website visitor analytics</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50">
                      <Settings className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <Label className="font-medium text-gray-900">Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Put website in maintenance mode</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Save Button */}
        <div className="flex justify-end">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}