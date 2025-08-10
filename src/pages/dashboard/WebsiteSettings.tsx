import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Globe, Save, Upload, Palette } from "lucide-react"

export default function WebsiteSettings() {
  return (
    <DashboardLayout
      title="Website Settings"
      subtitle="Configure your website appearance and behavior"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Website Configuration</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Site Identity
              </CardTitle>
              <CardDescription>
                Configure your website's basic information and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="AppointPro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteTagline">Tagline</Label>
                <Input id="siteTagline" defaultValue="Professional Appointment Management" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea 
                  id="siteDescription" 
                  rows={3}
                  defaultValue="Streamline your appointment scheduling with our comprehensive management system."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteLogo">Site Logo</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input id="siteLogo" placeholder="Upload logo..." className="flex-1" />
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Display contact details on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" defaultValue="contact@appointpro.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input id="contactPhone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Address</Label>
                <Textarea 
                  id="contactAddress" 
                  rows={3}
                  defaultValue="123 Business St, Suite 100, City, State 12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessHours">Business Hours</Label>
                <Textarea 
                  id="businessHours" 
                  rows={2}
                  defaultValue="Monday - Friday: 9:00 AM - 6:00 PM"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Website Features</CardTitle>
            <CardDescription>
              Enable or disable website functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Online Booking</Label>
                    <p className="text-sm text-muted-foreground">Allow customers to book appointments online</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send automated email confirmations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send SMS appointment reminders</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Customer Reviews</Label>
                    <p className="text-sm text-muted-foreground">Enable customer review system</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">Track website visitor analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put website in maintenance mode</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}