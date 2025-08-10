import { useState } from "react"
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  Crown
} from "lucide-react"

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const users = [
    {
      id: "USR001",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      role: "super_admin",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM",
      joinDate: "2023-01-15",
      totalAppointments: 0,
      location: "New York, NY"
    },
    {
      id: "USR002",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 987-6543",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM",
      joinDate: "2023-03-20",
      totalAppointments: 0,
      location: "Los Angeles, CA"
    },
    {
      id: "USR003",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 456-7890",
      role: "manager",
      status: "active",
      lastLogin: "2024-01-14 05:45 PM",
      joinDate: "2023-05-10",
      totalAppointments: 0,
      location: "Chicago, IL"
    },
    {
      id: "USR004",
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 321-0987",
      role: "user",
      status: "active",
      lastLogin: "2024-01-15 08:20 AM",
      joinDate: "2023-08-15",
      totalAppointments: 12,
      location: "Houston, TX"
    },
    {
      id: "USR005",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 654-3210",
      role: "user",
      status: "inactive",
      lastLogin: "2024-01-10 02:30 PM",
      joinDate: "2023-09-22",
      totalAppointments: 8,
      location: "Phoenix, AZ"
    },
    {
      id: "USR006",
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phone: "+1 (555) 789-0123",
      role: "user",
      status: "suspended",
      lastLogin: "2024-01-08 11:15 AM",
      joinDate: "2023-11-05",
      totalAppointments: 5,
      location: "Philadelphia, PA"
    }
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-gradient-primary text-primary-foreground"><Crown className="w-3 h-3 mr-1" />Super Admin</Badge>
      case "admin":
        return <Badge className="bg-warning/20 text-warning border-warning/30"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
      case "manager":
        return <Badge className="bg-success/20 text-success border-success/30"><UserCheck className="w-3 h-3 mr-1" />Manager</Badge>
      case "user":
        return <Badge variant="secondary"><Users className="w-3 h-3 mr-1" />User</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
      case "inactive":
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <DashboardLayout 
      title="User Management" 
      subtitle="Manage users, roles, and permissions across your system"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-card border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-card border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-foreground">{users.filter(u => u.status === 'active').length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-success" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-card border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold text-foreground">{users.filter(u => ['super_admin', 'admin'].includes(u.role)).length}</p>
            </div>
            <Shield className="w-8 h-8 text-warning" />
          </div>
        </Card>
        <Card className="p-6 bg-gradient-card border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-foreground">+24</p>
            </div>
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input placeholder="Enter email address" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="Enter phone number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input placeholder="Enter password" type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input placeholder="Confirm password" type="password" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Add User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card className="bg-gradient-card border-border/40">
        <div className="p-6">
          <div className="rounded-lg border border-border/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium text-lg">{user.totalAppointments}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.lastLogin}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.joinDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or add a new user.</p>
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default UserManagement