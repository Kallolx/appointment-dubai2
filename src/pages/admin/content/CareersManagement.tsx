import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Career {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  employment_type: string;
  salary_range?: string;
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CareersManagement: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    employment_type: "",
    salary_range: "",
    department: "",
    is_active: true,
  });
  const { toast } = useToast();
  const [departments, setDepartments] = useState<string[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/admin/careers"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch careers");
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.rows || data.careers || [];
      const normalized = rows.map((r: any) => ({
        id: r.id,
        title: r.job_title || r.title || r.name || '',
        description: r.description || r.body || '',
        requirements: r.requirements || r.req || '',
        location: r.location || r.city || 'Remote',
        employment_type: (r.job_type || r.employment_type || 'Full-time'),
        salary_range: r.salary_range || r.salary || '',
        department: r.department || 'General',
        is_active: r.is_active === undefined ? true : !!r.is_active,
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString(),
      }));

      setCareers(normalized);

      const uniqDept = Array.from(new Set(normalized.map((c: any) => c.department || 'General'))) as string[];
      if (!uniqDept.includes('Other')) uniqDept.push('Other');
      setDepartments(uniqDept);

      const uniqTypes = Array.from(new Set(normalized.map((c: any) => c.employment_type || 'Full-time'))) as string[];
      if (!uniqTypes.includes('Remote')) uniqTypes.push('Remote');
      setEmploymentTypes(uniqTypes);
    } catch (error) {
      console.error("Error fetching careers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch careers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingCareer
        ? buildApiUrl(`/api/admin/careers/${editingCareer.id}`)
        : buildApiUrl("/api/admin/careers");
      
      const method = editingCareer ? "PUT" : "POST";

      // backend expects: job_title, department, location, job_type, description, requirements, benefits, salary_range, is_active
      const payload: any = {
        job_title: formData.title,
        department: formData.department || 'General',
        location: formData.location || 'Remote',
        job_type: formData.employment_type || formData.employment_type || 'full-time',
        description: formData.description,
        requirements: formData.requirements || null,
        benefits: null,
        salary_range: formData.salary_range || null,
        is_active: formData.is_active,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingCareer ? "update" : "create"} career`);
      }

      toast({
        title: "Success",
        description: `Career ${editingCareer ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      setEditingCareer(null);
      setFormData({ 
        title: "", 
        description: "", 
        requirements: "", 
        location: "", 
        employment_type: "", 
        salary_range: "", 
        department: "", 
        is_active: true 
      });
      fetchCareers();
    } catch (error) {
      console.error("Error saving career:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingCareer ? "update" : "create"} career`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      description: career.description,
      requirements: career.requirements,
      location: career.location,
      employment_type: career.employment_type,
      salary_range: career.salary_range || "",
      department: career.department,
      is_active: career.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this career posting?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/careers/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete career");
      }

      toast({
        title: "Success",
        description: "Career deleted successfully",
      });

      fetchCareers();
    } catch (error) {
      console.error("Error deleting career:", error);
      toast({
        title: "Error",
        description: "Failed to delete career",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const item = careers.find(c => c.id === id);
      if (!item) throw new Error('Career not found');

      const payload = {
        job_title: item.title,
        department: item.department || 'General',
        location: item.location || 'Remote',
        job_type: item.employment_type || 'full-time',
        description: item.description,
        requirements: item.requirements || null,
        benefits: null,
        salary_range: item.salary_range || null,
        is_active: !currentStatus,
      };

      const response = await fetch(buildApiUrl(`/api/admin/careers/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update career status");
      }

      toast({
        title: "Success",
        description: "Career status updated successfully",
      });

      fetchCareers();
    } catch (error) {
      console.error("Error updating career status:", error);
      toast({
        title: "Error",
        description: "Failed to update career status",
        variant: "destructive",
      });
    }
  };

  const filteredCareers = careers.filter((career) => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         career.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || career.department === selectedDepartment;
    const matchesEmploymentType = selectedEmploymentType === "all" || career.employment_type === selectedEmploymentType;
    return matchesSearch && matchesDepartment && matchesEmploymentType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-6 h-6 text-red-500" />
              <CardTitle>Careers Management</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCareer(null);
                    setFormData({ 
                      title: "", 
                      description: "", 
                      requirements: "", 
                      location: "", 
                      employment_type: "", 
                      salary_range: "", 
                      department: "", 
                      is_active: true 
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Career
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCareer ? "Edit Career" : "Add New Career"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter the job title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g., Dubai, UAE or Remote"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <select
                        id="department"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="employment_type">Employment Type</Label>
                      <select
                        id="employment_type"
                        value={formData.employment_type}
                        onChange={(e) =>
                          setFormData({ ...formData, employment_type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select employment type</option>
                        {employmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="salary_range">Salary Range</Label>
                      <Input
                        id="salary_range"
                        value={formData.salary_range}
                        onChange={(e) =>
                          setFormData({ ...formData, salary_range: e.target.value })
                        }
                        placeholder="e.g., AED 5,000 - 8,000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Enter the job description"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({ ...formData, requirements: e.target.value })
                      }
                      placeholder="Enter the job requirements and qualifications"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="is_active">Active (Visible to job seekers)</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCareer ? "Update" : "Create"} Career
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search careers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedEmploymentType}
                onChange={(e) => setSelectedEmploymentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Careers Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading careers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCareers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No careers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCareers.map((career) => (
                    <TableRow key={career.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate font-medium">{career.title}</div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {career.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{career.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{career.department || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{career.employment_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {career.salary_range && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{career.salary_range}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(career.id, career.is_active)}
                          className="p-1"
                        >
                          {career.is_active ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(career.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(career)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(career.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareersManagement;
