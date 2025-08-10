import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Database, 
  Server, 
  Shield, 
  Clock, 
  HardDrive, 
  Cpu, 
  ArrowUpRight,
  Activity,
  TrendingUp,
  RefreshCw,
  Settings
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SystemSettings() {
  const [refreshing, setRefreshing] = useState(false)

  // Enhanced stats data
  const statsData = [
    {
      title: "System Uptime",
      value: "98.5%",
      change: "+0.3%",
      changeType: "increase",
      description: "Last 30 days",
      icon: Server,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: [95, 96, 97, 98, 98.5, 98.2, 98.5]
    },
    {
      title: "Performance Score",
      value: "92",
      change: "+5",
      changeType: "increase", 
      description: "System health index",
      icon: Cpu,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: [85, 87, 89, 90, 91, 92, 92]
    },
    {
      title: "Storage Used",
      value: "2.1GB",
      change: "+120MB",
      changeType: "increase",
      description: "of 10GB allocated",
      icon: HardDrive,
      color: "text-purple-600", 
      bgColor: "bg-purple-100",
      trend: [1.8, 1.9, 2.0, 2.0, 2.1, 2.1, 2.1]
    },
    {
      title: "Security Rating",
      value: "A+",
      change: "Excellent",
      changeType: "stable",
      description: "All systems secure",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100", 
      trend: [95, 96, 97, 98, 99, 99, 100]
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000)
  }
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                System Configuration
              </h2>
              <p className="text-gray-600">Monitor and configure system performance</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index} className="overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <CardContent className="p-6">
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

        {/* Enhanced Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-white">Server Settings</CardTitle>
                  <CardDescription className="text-white/80">
                    Configure server performance and behavior
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="serverPort" className="text-sm font-medium text-gray-700">Server Port</Label>
                <Input 
                  id="serverPort" 
                  defaultValue="3000" 
                  type="number" 
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxConnections" className="text-sm font-medium text-gray-700">Max Connections</Label>
                <Input 
                  id="maxConnections" 
                  defaultValue="1000" 
                  type="number" 
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeoutDuration" className="text-sm font-medium text-gray-700">Request Timeout (seconds)</Label>
                <Input 
                  id="timeoutDuration" 
                  defaultValue="30" 
                  type="number" 
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Enable Compression</Label>
                  <p className="text-xs text-gray-500">Compress responses to reduce bandwidth</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-white">Database Settings</CardTitle>
                  <CardDescription className="text-white/80">
                    Configure database connection and performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <Label htmlFor="dbHost" className="text-sm font-medium text-gray-700">Database Host</Label>
                <Input 
                  id="dbHost" 
                  defaultValue="localhost" 
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dbPort" className="text-sm font-medium text-gray-700">Database Port</Label>
                <Input 
                  id="dbPort" 
                  defaultValue="5432" 
                  type="number" 
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connectionPool" className="text-sm font-medium text-gray-700">Connection Pool Size</Label>
                <Input 
                  id="connectionPool" 
                  defaultValue="20" 
                  type="number" 
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Enable SSL</Label>
                  <p className="text-xs text-gray-500">Use SSL for database connections</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Security Settings */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-white">Security Settings</CardTitle>
                <CardDescription className="text-white/80">
                  Configure system security and access controls
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-sm font-medium text-gray-700">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    defaultValue="60" 
                    type="number" 
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts" className="text-sm font-medium text-gray-700">Max Login Attempts</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    defaultValue="5" 
                    type="number" 
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy" className="text-sm font-medium text-gray-700">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/80 backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">Require 2FA for all users</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">IP Whitelisting</Label>
                    <p className="text-xs text-gray-500">Restrict access by IP address</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Audit Logging</Label>
                    <p className="text-xs text-gray-500">Log all system access and changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Performance Monitoring */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-white">Performance Monitoring</CardTitle>
                <CardDescription className="text-white/80">
                  System performance metrics and monitoring
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">98.5%</div>
                <div className="text-sm font-medium text-gray-700 mb-2">System Uptime</div>
                <Badge className="bg-green-100 text-green-800 border border-green-200 shadow-sm">Excellent</Badge>
              </div>
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1">45ms</div>
                <div className="text-sm font-medium text-gray-700 mb-2">Avg Response Time</div>
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">Good</Badge>
              </div>
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">2.1GB</div>
                <div className="text-sm font-medium text-gray-700 mb-2">Memory Usage</div>
                <Badge className="bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">Normal</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Enable Performance Monitoring</Label>
                  <p className="text-xs text-gray-500">Track system performance metrics</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Auto-scaling</Label>
                  <p className="text-xs text-gray-500">Automatically scale resources based on load</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Backup & Maintenance */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-white">Backup & Maintenance</CardTitle>
                <CardDescription className="text-white/80">
                  Configure automated backups and maintenance schedules
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency" className="text-sm font-medium text-gray-700">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white/80 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retentionPeriod" className="text-sm font-medium text-gray-700">Retention Period (days)</Label>
                <Input 
                  id="retentionPeriod" 
                  defaultValue="30" 
                  type="number" 
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50/70 backdrop-blur-sm rounded-lg border border-gray-200">
              <div>
                <Label className="text-sm font-medium text-gray-700">Automatic Maintenance</Label>
                <p className="text-xs text-gray-500">Run maintenance tasks during off-peak hours</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Save Button */}
        <div className="flex justify-end">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg px-8 py-3"
          >
            <Settings className="w-5 h-5 mr-2" />
            Save System Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}