import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { buildApiUrl } from '@/config/api';
import NewAdminLayout from '@/pages/admin/NewAdminLayout';

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  hero_image_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface CategoryForm {
  name: string;
  slug: string;
  image_url: string;
  hero_image_url: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

const ServiceCategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [form, setForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    image_url: '',
    hero_image_url: '',
    description: '',
    is_active: true,
    sort_order: 0
  });
  const { toast } = useToast();

  // Stable form handlers using useCallback
  const handleFormChange = useCallback((field: keyof CategoryForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const generateSlug = useCallback((name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setForm(prev => ({ 
      ...prev, 
      name: newName,
      slug: prev.slug || newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }));
  }, []);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('slug', e.target.value);
  }, [handleFormChange]);

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('image_url', e.target.value);
  }, [handleFormChange]);

  const handleHeroImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('hero_image_url', e.target.value);
  }, [handleFormChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFormChange('description', e.target.value);
  }, [handleFormChange]);

  const handleSortOrderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('sort_order', parseInt(e.target.value) || 0);
  }, [handleFormChange]);

  const handleActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('is_active', e.target.checked);
  }, [handleFormChange]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/service-categories'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load service categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const isEditing = selectedCategory !== null;
      
      const url = isEditing 
        ? buildApiUrl(`/api/admin/service-categories/${selectedCategory.id}`)
        : buildApiUrl('/api/admin/service-categories');
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      toast({
        title: "Success",
        description: `Service category ${isEditing ? 'updated' : 'created'} successfully`
      });

      await fetchCategories();
      resetForm();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save service category",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service category?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/admin/service-categories/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      toast({
        title: "Success",
        description: "Service category deleted successfully"
      });

      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete service category",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      image_url: category.image_url || '',
      hero_image_url: category.hero_image_url || '',
      description: category.description || '',
      is_active: category.is_active,
      sort_order: category.sort_order
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      image_url: '',
      hero_image_url: '',
      description: '',
      is_active: true,
      sort_order: 0
    });
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <NewAdminLayout
        title="Service Categories"
        subtitle="Manage service categories and subcategories"
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout
      title="Service Categories"
      subtitle="Manage service categories and subcategories"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <Button 
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Service Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No categories match your search.' : 'No service categories found.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Category
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-gray-900">Category</th>
                      <th className="pb-3 font-medium text-gray-900">Slug</th>
                      <th className="pb-3 font-medium text-gray-900">Status</th>
                      <th className="pb-3 font-medium text-gray-900">Sort Order</th>
                      <th className="pb-3 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="border-b last:border-b-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {category.image_url && (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-10 h-10 rounded-md object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{category.name}</p>
                              {category.description && (
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600 font-mono text-sm">{category.slug}</td>
                        <td className="py-4">
                          <Badge 
                            variant={category.is_active ? "default" : "secondary"}
                            className={category.is_active ? "bg-green-100 text-green-800" : ""}
                          >
                            {category.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 text-gray-600">{category.sort_order}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Category Dialog */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add Service Category</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="category-slug"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={form.image_url}
                      onChange={handleImageUrlChange}
                      placeholder="/path/to/image.webp"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                    <Input
                      value={form.hero_image_url}
                      onChange={handleHeroImageUrlChange}
                      placeholder="/path/to/hero-image.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <Input
                      type="number"
                      value={form.sort_order}
                      onChange={handleSortOrderChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={form.is_active}
                      onChange={handleActiveChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Dialog */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Service Category</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="category-slug"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={form.image_url}
                      onChange={handleImageUrlChange}
                      placeholder="/path/to/image.webp"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                    <Input
                      value={form.hero_image_url}
                      onChange={handleHeroImageUrlChange}
                      placeholder="/path/to/hero-image.png"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter category description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <Input
                      type="number"
                      value={form.sort_order}
                      onChange={handleSortOrderChange}
                      min="0"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={form.is_active}
                      onChange={handleActiveChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </NewAdminLayout>
  );
};

export default ServiceCategoriesManagement;
