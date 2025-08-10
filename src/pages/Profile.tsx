import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSidebar } from '@/pages/users/UserSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, Mail, MapPin, Shield, LogOut } from 'lucide-react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

const Profile: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        email: response.data.email || '',
        phone: response.data.phone || ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate form
      if (!formData.fullName) {
        toast({
          title: "Error",
          description: "Name is required",
          variant: "destructive"
        });
        return;
      }

      await axios.put('/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Admin</span>;
      case 'manager':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Manager</span>;
      case 'user':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">User</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{role}</span>;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <UserSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-border bg-white shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 lg:px-6 h-full">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">My Profile</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Manage your personal information
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 lg:p-6 space-y-6 bg-secondary/30">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={profile.fullName} />
                    <AvatarFallback className="text-lg">{getInitials(profile.fullName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Shield className="h-4 w-4 mr-1" />
                      Account Type: {getRoleBadge(profile.role || 'user')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Phone number cannot be changed</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </CardFooter>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Change your account password</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/user/change-password')}>Change Password</Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Log Out</h4>
                      <p className="text-sm text-muted-foreground">Sign out of your account</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-red-500">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg">
            <User className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-medium mt-4">Profile not found</h3>
            <p className="text-muted-foreground mt-1">There was an error loading your profile</p>
            <Button 
              className="mt-4" 
              onClick={fetchProfile}
            >
              Retry
            </Button>
          </div>
        )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;