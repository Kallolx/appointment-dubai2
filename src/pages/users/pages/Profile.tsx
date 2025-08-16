import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { User, Phone, Mail, MapPin, Shield, LogOut, Edit, Eye, EyeOff, Lock, Plus, Home, Building, Star } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import NewUserLayout from "../NewUserLayout";

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  created_at: string;
}

interface UserAddress {
  id: number;
  user_id: number;
  address_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const Profile: React.FC = () => {
  const { toast } = useToast();
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addressesLoading, setAddressesLoading] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState<boolean>(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    address: ''
  });

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfile();
    fetchSavedAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3001/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
      setEditFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        address: response.data.address ? formatAddress(response.data.address) : ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      setAddressesLoading(true);
      
      if (!token) {
        return;
      }

      const response = await axios.get('http://localhost:3001/api/user/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSavedAddresses(response.data);
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
      // Don't show error toast for addresses as it's not critical
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      setEditLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate form
      if (!editFormData.fullName.trim()) {
        toast({
          title: "Error",
          description: "Name is required",
          variant: "destructive"
        });
        return;
      }

      if (editFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email address",
          variant: "destructive"
        });
        return;
      }

      await axios.put('http://localhost:3001/api/user/profile', editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setIsEditDialogOpen(false);
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate form
      if (!passwordFormData.currentPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
        toast({
          title: "Error",
          description: "All password fields are required",
          variant: "destructive"
        });
        return;
      }

      if (passwordFormData.newPassword.length < 6) {
        toast({
          title: "Error",
          description: "New password must be at least 6 characters long",
          variant: "destructive"
        });
        return;
      }

      if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive"
        });
        return;
      }

      await axios.put('http://localhost:3001/api/user/change-password', {
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Password changed successfully"
      });
      
      setIsPasswordDialogOpen(false);
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Success",
      description: "Logged out successfully"
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Manager</Badge>;
      case 'user':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Customer</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAddress = (addressString: string) => {
    try {
      const addressObj = JSON.parse(addressString);
      const parts = [];
      
      if (addressObj.buildingInfo) {
        parts.push(addressObj.buildingInfo);
      }
      if (addressObj.streetInfo) {
        parts.push(addressObj.streetInfo);
      }
      if (addressObj.locality) {
        parts.push(addressObj.locality);
      }
      if (addressObj.city) {
        parts.push(addressObj.city);
      }
      if (addressObj.country) {
        parts.push(addressObj.country);
      }
      
      return parts.filter(Boolean).join(', ');
    } catch (error) {
      // If it's not JSON or parsing fails, return the original string
      return addressString;
    }
  };

  const getAddressComponents = (addressString: string) => {
    try {
      const addressObj = JSON.parse(addressString);
      return {
        building: addressObj.buildingInfo || '',
        street: addressObj.streetInfo || '',
        locality: addressObj.locality || '',
        city: addressObj.city || '',
        country: addressObj.country || '',
        recipientName: addressObj.recipientName || ''
      };
    } catch (error) {
      return null;
    }
  };

  if (loading) {
    return (
      <NewUserLayout
        title="Profile"
        subtitle="Manage your account information"
      >
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </NewUserLayout>
    );
  }

  if (!profile) {
    return (
      <NewUserLayout
        title="Profile"
        subtitle="Manage your account information"
      >
        <div className="text-center py-12 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
          <p className="text-gray-500 mb-6">There was an error loading your profile</p>
          <Button onClick={fetchProfile}>
            Try Again
          </Button>
        </div>
      </NewUserLayout>
    );
  }

  return (
    <NewUserLayout
      title="Profile"
      subtitle="Manage your account information"
    >
      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" alt={profile.fullName} />
                <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {getRoleBadge(profile.role || 'user')}
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsEditDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>
                {profile.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                {profile.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Address</p>
                      {(() => {
                        const addressComponents = getAddressComponents(profile.address);
                        if (addressComponents) {
                          return (
                            <div className="font-medium space-y-1">
                              {(addressComponents.building || addressComponents.street) && (
                                <p>
                                  {[addressComponents.building, addressComponents.street]
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              )}
                              {addressComponents.locality && (
                                <p className="text-gray-600">{addressComponents.locality}</p>
                              )}
                              {(addressComponents.city || addressComponents.country) && (
                                <p className="text-gray-600">
                                  {[addressComponents.city, addressComponents.country]
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          );
                        } else {
                          return <p className="font-medium">{profile.address}</p>;
                        }
                      })()}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Locations Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Locations
              </CardTitle>
              <Button 
                onClick={() => navigate('/user/locations')}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Manage Locations
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {addressesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600">Loading saved locations...</span>
              </div>
            ) : savedAddresses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No saved locations yet</p>
                <Button 
                  onClick={() => navigate('/user/locations')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedAddresses.slice(0, 3).map((address) => (
                  <div key={address.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      {address.address_type.toLowerCase() === 'home' ? (
                        <Home className="h-5 w-5 text-green-600" />
                      ) : address.address_type.toLowerCase() === 'office' || address.address_type.toLowerCase() === 'work' ? (
                        <Building className="h-5 w-5 text-blue-600" />
                      ) : (
                        <MapPin className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{address.address_type}</h4>
                        {address.is_default && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{address.address_line1}</p>
                      <p className="text-gray-500 text-sm">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                    </div>
                  </div>
                ))}
                {savedAddresses.length > 3 && (
                  <div className="text-center pt-2">
                    <Button 
                      onClick={() => navigate('/user/locations')}
                      variant="outline"
                      size="sm"
                    >
                      View All {savedAddresses.length} Locations
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Security Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-500">Change your account password</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsPasswordDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  Change Password
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">Sign Out</h4>
                    <p className="text-sm text-gray-500">Sign out of your account on this device</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal information below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName" 
                  value={editFormData.fullName} 
                  onChange={handleEditInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={editFormData.email} 
                  onChange={handleEditInputChange}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  value={editFormData.address} 
                  onChange={handleEditInputChange}
                  placeholder="Enter your complete address"
                />
                <p className="text-xs text-gray-500">
                  Enter your full address including building, street, locality, city, and country
                </p>
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">Note:</p>
                <p>Phone number cannot be changed as it's used for account verification.</p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProfile}
                disabled={editLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="currentPassword" 
                    name="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordFormData.currentPassword} 
                    onChange={handlePasswordInputChange}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type={showNewPassword ? "text" : "password"}
                    value={passwordFormData.newPassword} 
                    onChange={handlePasswordInputChange}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordFormData.confirmPassword} 
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">Password Requirements:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Must be different from current password</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setPasswordFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                disabled={passwordLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Logout Confirmation Dialog */}
        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign Out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out? You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </NewUserLayout>
  );
};

export default Profile;
