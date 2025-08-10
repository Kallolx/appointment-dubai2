import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Shield, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const roles = [
  { id: 1, name: "Super Admin", users: 1, permissions: 25, color: "bg-gradient-primary" },
  { id: 2, name: "Admin", users: 3, permissions: 18, color: "bg-warning" },
  { id: 3, name: "Manager", users: 8, permissions: 12, color: "bg-success" },
  { id: 4, name: "User", users: 156, permissions: 5, color: "bg-secondary" },
]

export default function RoleManagement() {
  return (
    <DashboardLayout
      title="Role Management"
      subtitle="Manage user roles and permissions across the system"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">System Roles</h2>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={`${role.color} text-primary-foreground`}>
                    {role.name}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-medium">{role.users}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permissions</span>
                    <span className="font-medium">{role.permissions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
            <CardDescription>
              Detailed view of all roles and their configurations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Users</TableHead>
                    <TableHead className="hidden md:table-cell">Permissions</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={`${role.color} text-primary-foreground`}>
                            {role.name}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {role.users}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{role.permissions}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        2024-01-15
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}