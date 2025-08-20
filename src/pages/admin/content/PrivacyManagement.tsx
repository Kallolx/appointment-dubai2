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
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Privacy {
  id: number;
  title: string;
  content: string;
  section: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PrivacyManagement: React.FC = () => {
  const [privacyItems, setPrivacyItems] = useState<Privacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrivacy, setEditingPrivacy] = useState<Privacy | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    section: "",
    is_active: true,
  });
  const { toast } = useToast();

  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    fetchPrivacyItems();
  }, []);

  const fetchPrivacyItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/admin/privacy-policy"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch privacy items");
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.rows || data.privacy || [];
      const normalized = rows.map((r: any) => ({
        id: r.id,
        title: r.section_title || r.title || r.name || "",
        content: r.content || r.body || "",
        section: r.section || r.section_title || 'General',
        is_active: r.is_active === undefined ? true : !!r.is_active,
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString(),
      }));

      setPrivacyItems(normalized);

      const uniq = Array.from(new Set(normalized.map((p: any) => (p.section || 'General')))) as string[];
      if (!uniq.includes('Other')) uniq.push('Other');
      setSections(uniq);
    } catch (error) {
      console.error("Error fetching privacy items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch privacy items",
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
      const url = editingPrivacy
        ? buildApiUrl(`/api/admin/privacy-policy/${editingPrivacy.id}`)
        : buildApiUrl("/api/admin/privacy-policy");
      
      const method = editingPrivacy ? "PUT" : "POST";

      // backend expects: section_title, content, sort_order, is_active
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
        throw new Error(`Failed to ${editingPrivacy ? "update" : "create"} privacy item`);
      }

      toast({
        title: "Success",
        description: `Privacy item ${editingPrivacy ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      setEditingPrivacy(null);
      setFormData({ title: "", content: "", section: "", is_active: true });
      fetchPrivacyItems();
    } catch (error) {
      console.error("Error saving privacy item:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingPrivacy ? "update" : "create"} privacy item`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (privacy: Privacy) => {
    setEditingPrivacy(privacy);
    setFormData({
      title: privacy.title,
      content: privacy.content,
      section: privacy.section,
      is_active: privacy.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this privacy item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/privacy-policy/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete privacy item");
      }

      toast({
        title: "Success",
        description: "Privacy item deleted successfully",
      });

      fetchPrivacyItems();
    } catch (error) {
      console.error("Error deleting privacy item:", error);
      toast({
        title: "Error",
        description: "Failed to delete privacy item",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const item = privacyItems.find(p => p.id === id);
      if (!item) throw new Error('Privacy item not found');

      const payload = {
        section_title: item.title,
        content: item.content,
        sort_order: 0,
        is_active: !currentStatus,
      };

      const response = await fetch(buildApiUrl(`/api/admin/privacy-policy/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update privacy item status");
      }

      toast({
        title: "Success",
        description: "Privacy item status updated successfully",
      });

      fetchPrivacyItems();
    } catch (error) {
      console.error("Error updating privacy item status:", error);
      toast({
        title: "Error",
        description: "Failed to update privacy item status",
        variant: "destructive",
      });
    }
  };

  const filteredPrivacyItems = privacyItems.filter((privacy) => {
    const matchesSearch = privacy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         privacy.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === "all" || privacy.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-purple-500" />
              <CardTitle>Privacy Policy Management</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPrivacy(null);
                    setFormData({ title: "", content: "", section: "", is_active: true });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Privacy Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPrivacy ? "Edit Privacy Item" : "Add New Privacy Item"}
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
                      {editingPrivacy ? "Update" : "Create"} Privacy Item
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
                  placeholder="Search privacy items..."
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

      {/* Privacy Items Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading privacy items...</div>
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
                {filteredPrivacyItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No privacy items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrivacyItems.map((privacy) => (
                    <TableRow key={privacy.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate font-medium">{privacy.title}</div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {privacy.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{privacy.section || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(privacy.id, privacy.is_active)}
                          className="p-1"
                        >
                          {privacy.is_active ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(privacy.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(privacy)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(privacy.id)}
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

export default PrivacyManagement;
