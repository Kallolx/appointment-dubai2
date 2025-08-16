import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  Crown,
  Calendar,
  Mail,
  Phone,
  MapPin,
  LogIn,
  AlertTriangle,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
  appointmentsCount?: number;
  address?: {
    city: string;
    country: string;
  };
}

const SuperAdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [impersonating, setImpersonating] = useState<number | null>(null);
  
  // Create user form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin'
  });
  
  const { toast } = useToast();
  const { user: currentUser, login: authLogin } = useAuth();
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term and role
  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  // Handle impersonation (login as another user)
  const handleImpersonate = async (targetUser: User) => {
    if (targetUser.role === 'super_admin') {
      toast({
        title: "Access Denied",
        description: "Cannot impersonate another super admin.",
        variant: "destructive"
      });
      return;
    }

    try {
      setImpersonating(targetUser.id);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/impersonate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          targetUserId: targetUser.id,
          originalUserId: currentUser?.id 
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store original user data for restoration
        localStorage.setItem('originalUser', JSON.stringify(currentUser));
        localStorage.setItem('originalToken', localStorage.getItem('token') || '');
        localStorage.setItem('isImpersonating', 'true');
        
        // Update current user context using authLogin
        authLogin(data.user, data.token);

        toast({
          title: "Impersonation Started",
          description: `You are now logged in as ${targetUser.fullName}`,
          variant: "default"
        });

        // Navigate based on the target user's role
        if (targetUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        throw new Error('Impersonation failed');
      }
    } catch (error) {
      console.error('Error during impersonation:', error);
      toast({
        title: "Impersonation Failed",
        description: "Could not log in as this user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImpersonating(null);
    }
  };

  // Handle creating new user
  const handleCreateUser = async () => {
    if (!createForm.fullName || !createForm.email || !createForm.phone || !createForm.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/superadmin/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: createForm.fullName,
          email: createForm.email,
          phone: createForm.phone,
          password: createForm.password,
          role: createForm.role
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: "User Created Successfully",
          description: `${createForm.fullName} has been created with role ${createForm.role}`,
          variant: "default"
        });
        
        // Reset form and close dialog
        setCreateForm({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          role: 'admin'
        });
        setIsCreateDialogOpen(false);
        
        // Refresh users list
        fetchUsers();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Could not create user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'admin':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      case 'manager':
        return 'bg-gradient-to-r from-green-500 to-teal-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    managers: users.filter(u => u.role === 'manager').length,
    users: users.filter(u => u.role === 'user').length,
    active: users.filter(u => u.status === 'active').length
  };

  return (
    <SuperAdminLayout 
      title="User Management" 
      subtitle="Manage and monitor all system users"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-xl font-bold">{stats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Managers</p>
                  <p className="text-xl font-bold">{stats.managers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Regular Users</p>
                  <p className="text-xl font-bold">{stats.users}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Total: {filteredUsers.length} users</span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="w-4 h-4" />
                  Create Admin/Manager
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Admin/Manager</DialogTitle>
                  <DialogDescription>
                    Create a new admin or manager with minimal information. They can login with these credentials.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter full name"
                      value={createForm.fullName}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={createForm.email}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">One-time Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter temporary password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <select
                      id="role"
                      value={createForm.role}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateUser}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        'Create User'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={fetchUsers} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {localStorage.getItem('isImpersonating') === 'true' && (
              <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <span className="text-orange-800 text-sm font-medium">
                    You are currently impersonating another user. Return to super admin to exit.
                  </span>
                </div>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${getRoleBadgeColor(user.role)} border-0`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                          {user.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                          {user.address && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              {user.address.city}, {user.address.country}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {user.role !== 'super_admin' && user.id !== currentUser?.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleImpersonate(user)}
                              disabled={impersonating === user.id}
                              className="flex items-center gap-1"
                            >
                              {impersonating === user.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <LogIn className="w-3 h-3" />
                              )}
                              {impersonating === user.id ? 'Logging in...' : 'Login As'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminUserManagement;
