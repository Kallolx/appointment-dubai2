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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Key, 
  Copy, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  Activity, 
  RefreshCw, 
  MoreVertical,
  Mail,
  Smartphone,
  CreditCard,
  Shield
} from "lucide-react"

const apiKeys = [
  { id: 1, name: "Production API", key: "sk_prod_1234567890abcdef", status: "active", created: "2024-01-15" },
  { id: 2, name: "Development API", key: "sk_dev_abcdef1234567890", status: "active", created: "2024-01-10" },
  { id: 3, name: "Testing API", key: "sk_test_0987654321fedcba", status: "inactive", created: "2024-01-05" },
]

export default function ApiCredentials() {
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({})
  const [refreshing, setRefreshing] = useState(false)

  const stats = [
    {
      title: "Active API Keys",
      value: apiKeys.filter(k => k.status === 'active').length.toString(),
      change: "+1",
      changeType: "increase",
      icon: Key,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Currently active",
      trend: [2, 2, 3, 3, 3, 3, apiKeys.filter(k => k.status === 'active').length],
    },
    {
      title: "Total Integrations",
      value: "4",
      change: "+1",
      changeType: "increase",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Connected services",
      trend: [2, 3, 3, 4, 4, 4, 4],
    },
    {
      title: "Security Score",
      value: "98%",
      change: "+2%",
      changeType: "increase",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "API security",
      trend: [92, 94, 95, 96, 97, 98, 98],
    },
    {
      title: "Monthly Requests",
      value: "12.5K",
      change: "+8.2%",
      changeType: "increase",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "API calls",
      trend: [8000, 9000, 10000, 11000, 11500, 12000, 12500],
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const toggleKeyVisibility = (keyId: number) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              API Credentials
            </h1>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
              Secure Access
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
              Generate New Key
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

        {/* Enhanced API Keys Card */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-900">Active API Keys</CardTitle>
                <CardDescription className="text-gray-600">
                  Manage your API keys for secure access to the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-white transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                        <Badge 
                          className={`shadow-sm font-medium ${
                            apiKey.status === "active" 
                              ? "bg-green-100 text-green-800 border border-green-200" 
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <span className="flex-1 text-gray-700">
                          {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-gray-100"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys[apiKey.id] ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-100">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Created: {apiKey.created}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Regenerate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete Key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Service Integration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                <div className="p-2 rounded-lg bg-green-50 shadow-sm">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                Email Service
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure email service provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="emailProvider" className="text-sm font-medium text-gray-700">Email Provider</Label>
                <Input id="emailProvider" defaultValue="SendGrid" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailApiKey" className="text-sm font-medium text-gray-700">API Key</Label>
                <Input id="emailApiKey" type="password" placeholder="Enter API key..." className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail" className="text-sm font-medium text-gray-700">From Email</Label>
                <Input id="fromEmail" type="email" defaultValue="noreply@appointpro.com" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md">
                Save Email Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
                <div className="p-2 rounded-lg bg-orange-50 shadow-sm">
                  <Smartphone className="w-5 h-5 text-orange-600" />
                </div>
                SMS Service
              </CardTitle>
              <CardDescription className="text-gray-600">
                Configure SMS service provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider" className="text-sm font-medium text-gray-700">SMS Provider</Label>
                <Input id="smsProvider" defaultValue="Twilio" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsApiKey" className="text-sm font-medium text-gray-700">API Key</Label>
                <Input id="smsApiKey" type="password" placeholder="Enter API key..." className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsFrom" className="text-sm font-medium text-gray-700">From Number</Label>
                <Input id="smsFrom" placeholder="+1 (555) 123-4567" className="bg-white border-gray-200 shadow-sm" />
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md">
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Payment Gateway Card */}
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm shadow-md rounded-xl">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              <div className="p-2 rounded-lg bg-purple-50 shadow-sm">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              Payment Gateway
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configure payment processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripePublishable" className="text-sm font-medium text-gray-700">Stripe Publishable Key</Label>
                <Input id="stripePublishable" placeholder="pk_..." className="bg-white border-gray-200 shadow-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeSecret" className="text-sm font-medium text-gray-700">Stripe Secret Key</Label>
                <Input id="stripeSecret" type="password" placeholder="sk_..." className="bg-white border-gray-200 shadow-sm" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md">
                Save Payment Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}