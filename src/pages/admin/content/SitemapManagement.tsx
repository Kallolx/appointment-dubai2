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
  MapPin,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Sitemap {
  id: number;
  title: string;
  url: string;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SitemapManagement: React.FC = () => {
  const [sitemapItems, setSitemapItems] = useState<Sitemap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSitemap, setEditingSitemap] = useState<Sitemap | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
    is_active: true,
  });
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchSitemapItems();
  }, []);

  const fetchSitemapItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/admin/sitemap"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sitemap items");
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.rows || data.sitemap || [];
      const normalized = rows.map((r: any) => ({
        id: r.id,
        title: r.page_title || r.title || r.name || "",
        url: r.page_url || r.url || r.path || "",
        description: r.description || r.meta || '',
        category: r.section_name || r.category || 'Other',
        is_active: r.is_active === undefined ? true : !!r.is_active,
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString(),
      }));

      setSitemapItems(normalized);

      const uniq = Array.from(new Set(normalized.map((s: any) => s.category || 'Other'))) as string[];
      if (!uniq.includes('Other')) uniq.push('Other');
      setCategories(uniq);
    } catch (error) {
      console.error("Error fetching sitemap items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sitemap items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingSitemap
        ? buildApiUrl(`/api/admin/sitemap/${editingSitemap.id}`)
        : buildApiUrl("/api/admin/sitemap");
      
      const method = editingSitemap ? "PUT" : "POST";

      // backend expects: section_name, page_title, page_url, sort_order, is_active
      const payload = {
        section_name: formData.category || 'Other',
        page_title: formData.title,
        page_url: formData.url,
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
        throw new Error(`Failed to ${editingSitemap ? "update" : "create"} sitemap item`);
      }

      toast({
        title: "Success",
        description: `Sitemap item ${editingSitemap ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      setEditingSitemap(null);
      setFormData({ title: "", url: "", description: "", category: "", is_active: true });
      fetchSitemapItems();
    } catch (error) {
      console.error("Error saving sitemap item:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingSitemap ? "update" : "create"} sitemap item`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (sitemap: Sitemap) => {
    setEditingSitemap(sitemap);
    setFormData({
      title: sitemap.title,
      url: sitemap.url,
      description: sitemap.description || "",
      category: sitemap.category,
      is_active: sitemap.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this sitemap item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/sitemap/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete sitemap item");
      }

      toast({
        title: "Success",
        description: "Sitemap item deleted successfully",
      });

      fetchSitemapItems();
    } catch (error) {
      console.error("Error deleting sitemap item:", error);
      toast({
        title: "Error",
        description: "Failed to delete sitemap item",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const item = sitemapItems.find(s => s.id === id);
      if (!item) throw new Error('Sitemap item not found');
      
      const payload = {
        section_name: item.category || 'Other',
        page_title: item.title,
        page_url: item.url,
        sort_order: 0,
        is_active: !currentStatus,
      };

      const response = await fetch(buildApiUrl(`/api/admin/sitemap/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update sitemap item status");
      }

      toast({
        title: "Success",
        description: "Sitemap item status updated successfully",
      });

      fetchSitemapItems();
    } catch (error) {
      console.error("Error updating sitemap item status:", error);
      toast({
        title: "Error",
        description: "Failed to update sitemap item status",
        variant: "destructive",
      });
    }
  };

  const filteredSitemapItems = sitemapItems.filter((sitemap) => {
    const matchesSearch = sitemap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sitemap.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sitemap.description && sitemap.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || sitemap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-orange-500" />
              <CardTitle>Sitemap Management</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingSitemap(null);
                    setFormData({ title: "", url: "", description: "", category: "", is_active: true });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sitemap Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSitemap ? "Edit Sitemap Item" : "Add New Sitemap Item"}
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
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      placeholder="Enter the URL (e.g., /about, /services)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Enter the description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
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
                      {editingSitemap ? "Update" : "Create"} Sitemap Item
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
                  placeholder="Search sitemap items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sitemap Items Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading sitemap items...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSitemapItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No sitemap items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSitemapItems.map((sitemap) => (
                    <TableRow key={sitemap.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate font-medium">{sitemap.title}</div>
                        {sitemap.description && (
                          <div className="text-sm text-gray-500 truncate mt-1">
                            {sitemap.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {sitemap.url}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(sitemap.url, '_blank')}
                            className="p-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sitemap.category || "Other"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(sitemap.id, sitemap.is_active)}
                          className="p-1"
                        >
                          {sitemap.is_active ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(sitemap.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(sitemap)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(sitemap.id)}
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

export default SitemapManagement;
