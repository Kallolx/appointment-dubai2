import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Save, 
  Eye, 
  EyeOff,
  Shield,
  Calendar,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import SuperAdminLayout from '@/components/dashboard/SuperAdminLayout';

interface ProfileData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  address: {
    recipientName: string;
    buildingInfo: string;
    streetInfo: string;
    locality: string;
    city: string;
    country: string;
  };
}

const SuperAdminProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  
  const [addressInfo, setAddressInfo] = useState({
    recipientName: '',
    buildingInfo: '',
    streetInfo: '',
    locality: '',
    city: '',
    country: ''
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profile);
        
        // Set form data
        setPersonalInfo({
          fullName: data.profile.fullName,
          email: data.profile.email,
          phone: data.profile.phone
        });
        
        setAddressInfo(data.profile.address);
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update personal information
  const handleUpdatePersonalInfo = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/profile/personal', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personalInfo)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update auth context
        updateUser({
          ...user!,
          fullName: personalInfo.fullName,
          email: personalInfo.email,
          phone: personalInfo.phone
        });
        
        toast({
          title: "Success",
          description: "Personal information updated successfully.",
          variant: "default"
        });
        
        // Refresh profile data
        fetchProfile();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update personal information');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update personal information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update address information
  const handleUpdateAddress = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/profile/address', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressInfo)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Address information updated successfully.",
          variant: "default"
        });
        
        // Refresh profile data
        fetchProfile();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordInfo.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/profile/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordInfo.currentPassword,
          newPassword: passwordInfo.newPassword
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Password changed successfully.",
          variant: "default"
        });
        
        // Clear password form
        setPasswordInfo({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Password Change Failed",
        description: error.message || "Could not change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <SuperAdminLayout title="Profile Settings" subtitle="Manage your super admin profile">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-lg">Loading profile...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout title="Profile Settings" subtitle="Manage your super admin profile">
      <div className="space-y-6">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Super Admin Profile
            </CardTitle>
            <CardDescription>
              Your super administrator account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {profileData?.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profileData?.fullName}</h3>
                <p className="text-gray-600">{profileData?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Super Administrator
                  </span>
                </div>
              </div>
            </div>
            {profileData && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since: {new Date(profileData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone: {profileData.phone}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your basic personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            </div>
            <Button onClick={handleUpdatePersonalInfo} disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Personal Info'}
            </Button>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Address Information
            </CardTitle>
            <CardDescription>
              Update your address details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input
                  id="recipientName"
                  value={addressInfo.recipientName}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, recipientName: e.target.value }))}
                  placeholder="Enter recipient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buildingInfo">Building Name/Number</Label>
                <Input
                  id="buildingInfo"
                  value={addressInfo.buildingInfo}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, buildingInfo: e.target.value }))}
                  placeholder="Enter building info"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="streetInfo">Street Name/Number</Label>
                <Input
                  id="streetInfo"
                  value={addressInfo.streetInfo}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, streetInfo: e.target.value }))}
                  placeholder="Enter street info"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locality">Locality</Label>
                <Input
                  id="locality"
                  value={addressInfo.locality}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, locality: e.target.value }))}
                  placeholder="Enter locality"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={addressInfo.city}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={addressInfo.country}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="Enter country"
                />
              </div>
            </div>
            <Button onClick={handleUpdateAddress} disabled={isSaving} variant="outline" className="flex items-center gap-2">
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Address'}
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password for security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordInfo.currentPassword}
                  onChange={(e) => setPasswordInfo(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordInfo.newPassword}
                    onChange={(e) => setPasswordInfo(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordInfo.confirmPassword}
                    onChange={(e) => setPasswordInfo(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <Button onClick={handleChangePassword} disabled={isSaving} variant="destructive" className="flex items-center gap-2">
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {isSaving ? 'Changing...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminProfile;
