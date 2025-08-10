import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Database, Server, Shield, Clock, HardDrive, Cpu } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SystemSettings() {
  return (
    <DashboardLayout
      title="System Settings"
      subtitle="Configure system-wide settings and performance parameters"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">System Configuration</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Server Settings
              </CardTitle>
              <CardDescription>
                Configure server performance and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serverPort">Server Port</Label>
                <Input id="serverPort" defaultValue="3000" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxConnections">Max Connections</Label>
                <Input id="maxConnections" defaultValue="1000" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeoutDuration">Request Timeout (seconds)</Label>
                <Input id="timeoutDuration" defaultValue="30" type="number" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">Compress responses to reduce bandwidth</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Database Settings
              </CardTitle>
              <CardDescription>
                Configure database connection and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dbHost">Database Host</Label>
                <Input id="dbHost" defaultValue="localhost" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dbPort">Database Port</Label>
                <Input id="dbPort" defaultValue="5432" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connectionPool">Connection Pool Size</Label>
                <Input id="connectionPool" defaultValue="20" type="number" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable SSL</Label>
                  <p className="text-sm text-muted-foreground">Use SSL for database connections</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure system security and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input id="sessionTimeout" defaultValue="60" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input id="maxLoginAttempts" defaultValue="5" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
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
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">Restrict access by IP address</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all system access and changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Performance Monitoring
            </CardTitle>
            <CardDescription>
              System performance metrics and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">98.5%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
                <Badge variant="default" className="mt-2">Excellent</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">45ms</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
                <Badge variant="default" className="mt-2">Good</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">2.1GB</div>
                <div className="text-sm text-muted-foreground">Memory Usage</div>
                <Badge variant="secondary" className="mt-2">Normal</Badge>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Performance Monitoring</Label>
                  <p className="text-sm text-muted-foreground">Track system performance metrics</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-scaling</Label>
                  <p className="text-sm text-muted-foreground">Automatically scale resources based on load</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Backup & Maintenance
            </CardTitle>
            <CardDescription>
              Configure automated backups and maintenance schedules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
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
                <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                <Input id="retentionPeriod" defaultValue="30" type="number" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Maintenance</Label>
                <p className="text-sm text-muted-foreground">Run maintenance tasks during off-peak hours</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg">
            Save System Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}