import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Camera, Bell, Shield, Key, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileSettings() {
  const { toast } = useToast()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Address fields
  const [recipientName, setRecipientName] = useState("")
  const [buildingInfo, setBuildingInfo] = useState("")
  const [streetInfo, setStreetInfo] = useState("")
  const [locality, setLocality] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  
  // Handle saving profile changes
  const handleSaveChanges = async () => {
    if (!userData) return
    
    setSaving(true)
    
    try {
      // Create address object
      const addressObj = {
        recipientName,
        buildingInfo,
        streetInfo,
        locality,
        city,
        country
      }
      
      // Update user data in local storage
      const updatedUser = {
        ...userData,
        address: addressObj
      }
      
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUserData(updatedUser)
      
      // In a real application, you would send this data to the backend
      // For now, we'll just show a success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }
  
  useEffect(() => {
    // Get user data from local storage
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    
    if (user && token) {
      setUserData(user)
      
      // If address is in JSON format, parse it
      if (user.address && typeof user.address === 'string') {
        try {
          const addressObj = JSON.parse(user.address)
          setRecipientName(addressObj.recipientName || "")
          setBuildingInfo(addressObj.buildingInfo || "")
          setStreetInfo(addressObj.streetInfo || "")
          setLocality(addressObj.locality || "")
          setCity(addressObj.city || "")
          setCountry(addressObj.country || "")
        } catch (error) {
          // If address is not in JSON format, use it as is
          setRecipientName(user.fullName || "")
          setStreetInfo(user.address || "")
        }
      }
      setLoading(false)
    }
  }, [])
  return (
    <DashboardLayout
      title="Profile Settings"
      subtitle="Manage your account information and preferences"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Account Settings</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg">JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or SVG. Max size 2MB.
                </p>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Picture
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Physical Address</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient's Name</Label>
                <Input 
                  id="recipientName" 
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buildingInfo">Building Name/Number</Label>
                <Input 
                  id="buildingInfo" 
                  value={buildingInfo}
                  onChange={(e) => setBuildingInfo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streetInfo">Street Name/Number</Label>
                <Input 
                  id="streetInfo" 
                  value={streetInfo}
                  onChange={(e) => setStreetInfo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locality">Locality</Label>
                <Input 
                  id="locality" 
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                rows={3}
                placeholder="Tell us about yourself..."
                defaultValue="Experienced administrator with expertise in appointment management systems."
              />
            </div>

            <div className="space-y-2">
              <Label>Current Role</Label>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-primary text-primary-foreground">
                  Super Admin
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Full system access and administration privileges
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage your account security and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <Button className="w-full sm:w-auto">
                <Key className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">New appointments</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Appointment reminders</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">System updates</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Marketing emails</Label>
                    <Switch />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Urgent notifications</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Daily summaries</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Weekly reports</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Mobile notifications</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that will permanently affect your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1 sm:flex-none"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none">
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}