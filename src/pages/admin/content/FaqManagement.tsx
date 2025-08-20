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
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { buildApiUrl } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FaqManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    is_active: true,
  });
  const { toast } = useToast();

  // categories will be derived from DB rows so the admin filters always match DB values
  const [categories, setCategories] = useState<string[]>([]);

  // Ensure FAQs are loaded on mount (and categories set from the results)
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Try admin endpoint first (returns full rows). If it fails (missing endpoint or auth), fallback to public endpoint.
      let res = null;
      if (token) {
        res = await fetch(buildApiUrl("/api/admin/faqs"), {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (!res || !res.ok) {
        res = await fetch(buildApiUrl("/api/faqs"));
      }

      if (!res.ok) throw new Error("Failed to fetch FAQs");

      const data = await res.json();

      // Normalize: data might be { faqs: [...] } or an array
      let list: any[] = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.faqs)) list = data.faqs;
      else if (Array.isArray(data.rows)) list = data.rows;

      // Map DB rows to local FAQ shape (best-effort)
      const normalized = list.map((r: any) => ({
        id: r.id,
        question: r.question || r.section_title || r.title || "",
        answer: r.answer || r.content || "",
        category: r.category || r.section || r.section_name || "General",
        is_active: r.is_active === undefined ? true : !!r.is_active,
        created_at: r.created_at || r.createdAt || new Date().toISOString(),
        updated_at: r.updated_at || r.updatedAt || new Date().toISOString(),
      }));

      setFaqs(normalized);

      // derive categories from returned rows so filters match DB values
      const uniq = Array.from(new Set(normalized.map((f: any) => (f.category || 'General'))));
      if (!uniq.includes('Other')) uniq.push('Other');
      setCategories(uniq);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast({ title: "Error", description: "Failed to fetch FAQs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Question and answer are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = editingFaq
        ? buildApiUrl(`/api/admin/faqs/${editingFaq.id}`)
        : buildApiUrl("/api/admin/faqs");
      
      const method = editingFaq ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingFaq ? "update" : "create"} FAQ`);
      }

      toast({
        title: "Success",
        description: `FAQ ${editingFaq ? "updated" : "created"} successfully`,
      });

      setIsDialogOpen(false);
      setEditingFaq(null);
      setFormData({ question: "", answer: "", category: "", is_active: true });
      fetchFaqs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingFaq ? "update" : "create"} FAQ`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      is_active: faq.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/faqs/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete FAQ");
      }

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });

      fetchFaqs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const faq = faqs.find(f => f.id === id);
      if (!faq) return;
      
      const response = await fetch(buildApiUrl(`/api/admin/faqs/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: faq.category,
          question: faq.question,
          answer: faq.answer,
          sort_order: 0,
          is_active: !currentStatus
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update FAQ status");
      }

      toast({
        title: "Success",
        description: "FAQ status updated successfully",
      });

      fetchFaqs();
    } catch (error) {
      console.error("Error updating FAQ status:", error);
      toast({
        title: "Error",
        description: "Failed to update FAQ status",
        variant: "destructive",
      });
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              <CardTitle>FAQ Management</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingFaq(null);
                    setFormData({ question: "", answer: "", category: "", is_active: true });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question *</Label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      placeholder="Enter the question"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer">Answer *</Label>
                    <Textarea
                      id="answer"
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                      placeholder="Enter the answer"
                      rows={4}
                      required
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
                      {editingFaq ? "Update" : "Create"} FAQ
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
                  placeholder="Search FAQs..."
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

      {/* FAQs Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading FAQs...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No FAQs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFaqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="max-w-md">
                        <div className="truncate font-medium">{faq.question}</div>
                        <div className="text-sm text-gray-500 truncate mt-1">
                          {faq.answer}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{faq.category || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatus(faq.id, faq.is_active)}
                          className="p-1"
                        >
                          {faq.is_active ? (
                            <Eye className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(faq.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(faq)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(faq.id)}
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

export default FaqManagement;
