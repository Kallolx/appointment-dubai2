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
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Terms {
  id: number;
  title: string;
  content: string;
  section: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TermsManagement: React.FC = () => {
  const [terms, setTerms] = useState<Terms[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Terms | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    section: "",
    is_active: true,
  });
  const { toast } = useToast();

  // sections derived from DB
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/admin/terms"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch terms");
      }

      const data = await response.json();
      // backend returns array of rows
      const rows = Array.isArray(data) ? data : data.rows || data.terms || [];
      const normalized = rows.map((r: any) => ({
        id: r.id,
        title: r.section_title || r.title || r.name || "",
        content: r.content || r.body || "",
        section: r.section || r.section_title || 'General',
        is_active: r.is_active === undefined ? true : !!r.is_active,
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString(),
      }));

      setTerms(normalized);

      // derive sections
      const uniq = Array.from(new Set(normalized.map((t: any) => t.section || 'General')));
      if (!uniq.includes('Other')) uniq.push('Other');
      setSections(uniq as string[]);
    } catch (error) {
      console.error("Error fetching terms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch terms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingTerm
        ? buildApiUrl(`/api/admin/terms/${editingTerm.id}`)
        : buildApiUrl("/api/admin/terms");
      
      const method = editingTerm ? "PUT" : "POST";

      // backend expects fields: section_title, content, sort_order, is_active
      const payload = {
        section_title: formData.title,
        content: formData.content,
        sort_order: 0,
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
        throw new Error(`Failed to ${editingTerm ? "update" : "create"} term`);
      }

      toast({
        title: "Success",
        description: `Term ${editingTerm ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      setEditingTerm(null);
      setFormData({ title: "", content: "", section: "", is_active: true });
      fetchTerms();
    } catch (error) {
      console.error("Error saving term:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingTerm ? "update" : "create"} term`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (term: Terms) => {
    setEditingTerm(term);
    setFormData({
      title: term.title,
      content: term.content,
      section: term.section,
      is_active: term.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this term?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/terms/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete term");
      }

      toast({
        title: "Success",
        description: "Term deleted successfully",
      });

      fetchTerms();
    } catch (error) {
      console.error("Error deleting term:", error);
      toast({
        title: "Error",
        description: "Failed to delete term",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const term = terms.find(t => t.id === id);
      if (!term) throw new Error('Term not found');

      // send full payload as backend requires section_title and content
      const response = await fetch(buildApiUrl(`/api/admin/terms/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section_title: term.title,
          content: term.content,
          sort_order: 0,
          is_active: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update term status");
      }

      toast({
        title: "Success",
        description: "Term status updated successfully",
      });

      fetchTerms();
    } catch (error) {
      console.error("Error updating term status:", error);
      toast({
        title: "Error",
        description: "Failed to update term status",
        variant: "destructive",
      });
    }
  };

  const filteredTerms = terms.filter((term) => {
    const matchesSearch = term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === "all" || term.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-green-500" />
              <CardTitle>Terms & Conditions Management</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingTerm(null);
                    setFormData({ title: "", content: "", section: "", is_active: true });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Term
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTerm ? "Edit Term" : "Add New Term"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter the title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Enter the content"
                      rows={6}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <select
                      id="section"
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a section</option>
                      {sections.map((section) => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
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
                    <Label htmlFor="is_active">Active</Label>
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
                      {editingTerm ? "Update" : "Create"} Term
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
                  placeholder="Search terms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sections</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading terms...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTerms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No terms found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTerms.map((term) => (
                    <TableRow key={term.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate font-medium">{term.title}</div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {term.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{term.section || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(term.id, term.is_active)}
                          className="p-1"
                        >
                          {term.is_active ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(term.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(term)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(term.id)}
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

export default TermsManagement;
