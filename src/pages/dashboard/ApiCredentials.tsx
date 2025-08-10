import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, RotateCcw, Eye, EyeOff, Plus } from "lucide-react"
import { useState } from "react"

const apiKeys = [
  { id: 1, name: "Production API", key: "sk_prod_1234567890abcdef", status: "active", created: "2024-01-15" },
  { id: 2, name: "Development API", key: "sk_dev_abcdef1234567890", status: "active", created: "2024-01-10" },
  { id: 3, name: "Testing API", key: "sk_test_0987654321fedcba", status: "inactive", created: "2024-01-05" },
]

export default function ApiCredentials() {
  const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({})

  const toggleKeyVisibility = (keyId: number) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4)
  }

  return (
    <DashboardLayout
      title="API Credentials"
      subtitle="Manage API keys and external service integrations"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Key className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">API Keys</h2>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for secure access to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-sm bg-muted p-2 rounded">
                        <span className="flex-1">
                          {visibleKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys[apiKey.id] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created: {apiKey.created}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Service</CardTitle>
              <CardDescription>
                Configure email service provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailProvider">Email Provider</Label>
                <Input id="emailProvider" defaultValue="SendGrid" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailApiKey">API Key</Label>
                <Input id="emailApiKey" type="password" placeholder="Enter API key..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input id="fromEmail" type="email" defaultValue="noreply@appointpro.com" />
              </div>
              <Button className="w-full">
                Save Email Settings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Service</CardTitle>
              <CardDescription>
                Configure SMS service provider settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <Input id="smsProvider" defaultValue="Twilio" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsApiKey">API Key</Label>
                <Input id="smsApiKey" type="password" placeholder="Enter API key..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsFrom">From Number</Label>
                <Input id="smsFrom" placeholder="+1 (555) 123-4567" />
              </div>
              <Button className="w-full">
                Save SMS Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway</CardTitle>
            <CardDescription>
              Configure payment processing settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripePublishable">Stripe Publishable Key</Label>
                <Input id="stripePublishable" placeholder="pk_..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripeSecret">Stripe Secret Key</Label>
                <Input id="stripeSecret" type="password" placeholder="sk_..." />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>
                Save Payment Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}