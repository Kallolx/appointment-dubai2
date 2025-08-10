import { DashboardLayout } from "@/pages/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const serviceAreas = [
  { id: 1, name: "Downtown", zipCodes: ["10001", "10002", "10003"], status: "active", services: 12 },
  { id: 2, name: "Midtown", zipCodes: ["10018", "10019", "10020"], status: "active", services: 8 },
  { id: 3, name: "Upper East Side", zipCodes: ["10021", "10028", "10075"], status: "active", services: 15 },
  { id: 4, name: "Brooklyn Heights", zipCodes: ["11201", "11205", "11206"], status: "inactive", services: 5 },
  { id: 5, name: "Queens", zipCodes: ["11101", "11102", "11103"], status: "active", services: 10 },
]

export default function ServiceAreas() {
  return (
    <DashboardLayout
      title="Service Areas"
      subtitle="Manage geographical coverage and service zones"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Coverage Areas</h2>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Service Area
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceAreas.slice(0, 3).map((area) => (
            <Card key={area.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{area.name}</h3>
                  <Badge variant={area.status === "active" ? "default" : "secondary"}>
                    {area.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Zip Codes</p>
                    <div className="flex flex-wrap gap-1">
                      {area.zipCodes.map((zip) => (
                        <Badge key={zip} variant="outline" className="text-xs">
                          {zip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Services</span>
                    <span className="font-medium">{area.services}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Service Areas</CardTitle>
                <CardDescription>
                  Complete list of service coverage areas
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search areas..."
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Zip Codes</TableHead>
                    <TableHead className="hidden md:table-cell">Services</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {area.zipCodes.slice(0, 2).map((zip) => (
                            <Badge key={zip} variant="outline" className="text-xs">
                              {zip}
                            </Badge>
                          ))}
                          {area.zipCodes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{area.zipCodes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{area.services}</TableCell>
                      <TableCell>
                        <Badge variant={area.status === "active" ? "default" : "secondary"}>
                          {area.status}
                        </Badge>
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

        <Card>
          <CardHeader>
            <CardTitle>Add New Service Area</CardTitle>
            <CardDescription>
              Define a new geographical area for service coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="areaName">Area Name</Label>
                <Input id="areaName" placeholder="Enter area name..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCodes">Zip Codes</Label>
                <Input id="zipCodes" placeholder="10001, 10002, 10003..." />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Service Area
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}