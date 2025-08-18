import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { buildApiUrl } from '@/config/api';
import NewAdminLayout from '@/pages/admin/NewAdminLayout';

interface PropertyType {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  base_price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface PropertyForm {
  name: string;
  slug: string;
  image_url: string;
  description: string;
  base_price: number;
  is_active: boolean;
  sort_order: number;
}

const PropertyTypesManagement: React.FC = () => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [form, setForm] = useState<PropertyForm>({
    name: '',
    slug: '',
    image_url: '',
    description: '',
    base_price: 0,
    is_active: true,
    sort_order: 0
  });
  const { toast } = useToast();

  // Stable form handlers using useCallback
  const handleFormChange = useCallback((field: keyof PropertyForm, value: any) => {
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

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFormChange('description', e.target.value);
  }, [handleFormChange]);

  const handleBasePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('base_price', parseFloat(e.target.value) || 0);
  }, [handleFormChange]);

  const handleSortOrderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('sort_order', parseInt(e.target.value) || 0);
  }, [handleFormChange]);

  const handleActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('is_active', e.target.checked);
  }, [handleFormChange]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/property-types'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property types');
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching property types:', error);
      toast({
        title: "Error",
        description: "Failed to load property types",
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
      const isEditing = selectedProperty !== null;
      
      const url = isEditing 
        ? buildApiUrl(`/api/admin/property-types/${selectedProperty.id}`)
        : buildApiUrl('/api/admin/property-types');
      
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
        throw new Error(errorData.message || 'Failed to save property type');
      }

      toast({
        title: "Success",
        description: `Property type ${isEditing ? 'updated' : 'created'} successfully`
      });

      await fetchProperties();
      resetForm();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving property type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save property type",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (property: PropertyType) => {
    setSelectedProperty(property);
    setForm({
      name: property.name,
      slug: property.slug,
      image_url: property.image_url || '',
      description: property.description || '',
      base_price: property.base_price,
      is_active: property.is_active,
      sort_order: property.sort_order
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = useCallback(async (propertyId: number) => {
    if (!confirm('Are you sure you want to delete this property type? This will remove the property type and may affect linked pricing or references.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/admin/property-types/${propertyId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errData.message || 'Failed to delete property type');
      }

      toast({
        title: 'Success',
        description: 'Property type deleted successfully'
      });

      await fetchProperties();
    } catch (error: any) {
      console.error('Error deleting property type:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete property type',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      image_url: '',
      description: '',
      base_price: 0,
      is_active: true,
      sort_order: 0
    });
    setSelectedProperty(null);
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <NewAdminLayout
        title="Property Types"
        subtitle="Manage apartment and villa property types"
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
      title="Property Types"
      subtitle="Manage apartment and villa property types"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search property types..."
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
            Add Property Type
          </Button>
        </div>

        {/* Property Types List */}
        <Card>
          <CardHeader>
            <CardTitle>Property Types ({filteredProperties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'No property types match your search.' : 'No property types found.'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Property Type
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-gray-900">Property Type</th>
                      <th className="pb-3 font-medium text-gray-900">Slug</th>
                      <th className="pb-3 font-medium text-gray-900">Base Price</th>
                      <th className="pb-3 font-medium text-gray-900">Status</th>
                      <th className="pb-3 font-medium text-gray-900">Sort Order</th>
                      <th className="pb-3 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((property) => (
                      <tr key={property.id} className="border-b last:border-b-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {property.image_url && (
                              <img
                                src={property.image_url}
                                alt={property.name}
                                className="w-10 h-10 rounded-md object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{property.name}</p>
                              {property.description && (
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {property.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600 font-mono text-sm">{property.slug}</td>
                        <td className="py-4 text-gray-900 font-medium">AED {Number(property.base_price).toFixed(2)}</td>
                        <td className="py-4">
                          <Badge 
                            variant={property.is_active ? "default" : "secondary"}
                            className={property.is_active ? "bg-green-100 text-green-800" : ""}
                          >
                            {property.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 text-gray-600">{property.sort_order}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(property)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(property.id)}
                              className="text-red-600 hover:text-red-700"
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

        {/* Add Property Dialog */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add Property Type</h2>
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
                      placeholder="Enter property type name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="property-slug"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={form.image_url}
                    onChange={handleImageUrlChange}
                    placeholder="/path/to/image.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter property type description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price (AED)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.base_price}
                      onChange={handleBasePriceChange}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <Input
                      type="number"
                      value={form.sort_order}
                      onChange={handleSortOrderChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={handleActiveChange}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">Active</label>
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

        {/* Edit Property Dialog */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Property Type</h2>
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
                      placeholder="Enter property type name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Slug *</label>
                    <Input
                      value={form.slug}
                      onChange={handleSlugChange}
                      placeholder="property-slug"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={form.image_url}
                    onChange={handleImageUrlChange}
                    placeholder="/path/to/image.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter property type description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price (AED)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.base_price}
                      onChange={handleBasePriceChange}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <Input
                      type="number"
                      value={form.sort_order}
                      onChange={handleSortOrderChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={handleActiveChange}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">Active</label>
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

export default PropertyTypesManagement;
