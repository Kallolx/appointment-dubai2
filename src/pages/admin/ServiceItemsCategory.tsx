/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from '@/pages/admin/NewAdminLayout';
import { Plus, Edit, Trash2 } from "lucide-react";

interface ServiceItemsCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_service_item_id: number | null;
  parent_service_item_name?: string;
  parent_service_item_slug?: string;
  parent_category_name?: string;
  parent_category_slug?: string;
  image_url: string;
  hero_image_url: string;
  icon_url: string;
  sort_order: number;
  is_active: boolean;
}

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  category_name?: string;
}

interface PropertyType {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

const ServiceItemsCategory = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceItemsCategory | null>(null);
  const queryClient = useQueryClient();

  // Fetch service items categories
  const { data: categories = [], isLoading, error: categoriesError } = useQuery({
    queryKey: ["admin-service-items-category"],
    queryFn: async () => {
      try {
        const response = await fetch(buildApiUrl('/api/admin/service-items-category'), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!response.ok) {
          // Try the test endpoint to check table structure
          const testResponse = await fetch(buildApiUrl('/api/test/service-items-category-table'));
          const testData = await testResponse.json();
          console.log('Table structure:', testData);
          
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Categories response:', data);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch service categories for parent selection
  const { data: serviceCategories = [] }: { data: ServiceCategory[] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/api/service-categories'));
      if (!response.ok) {
        throw new Error(`Failed to fetch service categories: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch all property types for selection
  const { data: propertyTypes = [] }: { data: PropertyType[] } = useQuery({
    queryKey: ["property-types"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/api/property-types'));
      if (!response.ok) {
        throw new Error(`Failed to fetch property types: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Add category
  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(buildApiUrl('/api/admin/service-items-category'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-items-category"] });
      setIsAddModalOpen(false);
    },
  });

  // Update category
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(buildApiUrl(`/api/admin/service-items-category/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-items-category"] });
      setEditingCategory(null);
    },
  });

  // Delete category
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(buildApiUrl(`/api/admin/service-items-category/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-items-category"] });
    },
  });

  // Update property types for a category
  const updatePropertyTypesMutation = useMutation({
    mutationFn: async ({ categoryId, propertyTypeIds }: { categoryId: number; propertyTypeIds: number[] }) => {
      const response = await fetch(buildApiUrl(`/api/admin/service-items-category/${categoryId}/property-types`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ propertyTypeIds }),
      });
      if (!response.ok) {
        throw new Error('Failed to update property types');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-items-category"] });
    },
  });

  const CategoryForm = ({ category, onSubmit, onCancel }: { category?: ServiceItemsCategory | null; onSubmit: (data: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      selectedCategoryId: '',
      parent_service_item_id: category?.parent_service_item_id || null,
      image_url: category?.image_url || '',
      hero_image_url: category?.hero_image_url || '',
      icon_url: category?.icon_url || '',
      sort_order: category?.sort_order || 0,
      is_active: category?.is_active !== false,
      selectedPropertyTypes: [] as number[]
    });

    // Fetch existing property types for this category when editing
    const { data: existingPropertyTypes = [] } = useQuery({
      queryKey: ["service-category-property-types", category?.id],
      queryFn: async () => {
        if (!category?.id) return [];
        const response = await fetch(buildApiUrl(`/api/service-items-category/${category.id}/property-types`));
        if (!response.ok) return [];
        return await response.json();
      },
      enabled: !!category?.id,
    });

    // Update selectedPropertyTypes when existingPropertyTypes changes
    useEffect(() => {
      if (existingPropertyTypes.length > 0) {
        setFormData(prev => ({
          ...prev,
          selectedPropertyTypes: existingPropertyTypes.map((pt: PropertyType) => pt.id)
        }));
      }
    }, [existingPropertyTypes]);

    // Fetch service items when a category is selected
    const { data: serviceItems = [] }: { data: ServiceItem[] } = useQuery({
      queryKey: ["service-items-by-category", formData.selectedCategoryId],
      queryFn: async () => {
        if (!formData.selectedCategoryId || formData.selectedCategoryId === "none") return [];
        const response = await fetch(buildApiUrl(`/api/admin/service-items/by-category/${formData.selectedCategoryId}`), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch service items: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
      },
      enabled: !!formData.selectedCategoryId && formData.selectedCategoryId !== "none",
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const submitData = {
        ...formData,
        selectedCategoryId: undefined // Remove this from the submitted data, but keep selectedPropertyTypes
      };
      
      try {
        // Pass the full data including selectedPropertyTypes to the parent
        await onSubmit(submitData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          placeholder="Slug (URL-friendly name)"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
        <Select
          value={formData.selectedCategoryId || "none"}
          onValueChange={(value) => setFormData({ ...formData, selectedCategoryId: value === "none" ? "" : value, parent_service_item_id: null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="1. Select Service Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Category Selected</SelectItem>
            {serviceCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {formData.selectedCategoryId && formData.selectedCategoryId !== "none" && (
          <Select
            value={formData.parent_service_item_id != null ? formData.parent_service_item_id.toString() : 'none'}
            onValueChange={(value) => setFormData({ ...formData, parent_service_item_id: value === 'none' ? null : parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="2. Select Parent Service Item (Optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Parent Service Item</SelectItem>
              {serviceItems.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          placeholder="Image URL"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
        <Input
          placeholder="Hero Image URL"
          value={formData.hero_image_url}
          onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
        />
        <Input
          placeholder="Icon URL"
          value={formData.icon_url}
          onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Sort Order"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
        />
        
        {/* Property Types Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Property Types</label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypes.map((propertyType) => (
              <div key={propertyType.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`property-${propertyType.id}`}
                  checked={formData.selectedPropertyTypes.includes(propertyType.id)}
                  onChange={(e) => {
                    const updatedTypes = e.target.checked
                      ? [...formData.selectedPropertyTypes, propertyType.id]
                      : formData.selectedPropertyTypes.filter(id => id !== propertyType.id);
                    setFormData({ ...formData, selectedPropertyTypes: updatedTypes });
                  }}
                />
                <label htmlFor={`property-${propertyType.id}`} className="text-sm">
                  {propertyType.name}
                </label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Select which property types are available for this service category
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <label>Active</label>
        </div>
        <div className="flex gap-2">
          <Button type="submit">{category ? 'Update' : 'Add'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <NewAdminLayout title="Service Item Categories" subtitle="Manage categories used for service items">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </NewAdminLayout>
    );
  }

  if (categoriesError) {
    return (
      <NewAdminLayout title="Service Item Categories" subtitle="Manage categories used for service items">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-600">
            <p className="font-semibold">Error loading categories</p>
            <p className="text-sm">{categoriesError.message}</p>
          </div>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout title="Service Item Categories" subtitle="Manage categories used for service items">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Items Categories Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Items Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={async (data) => {
                // Create the category first
                const result = await addMutation.mutateAsync(data);
                
                // If we have property types selected and got a category ID back
                if (data.selectedPropertyTypes?.length > 0 && result?.id) {
                  await updatePropertyTypesMutation.mutateAsync({ 
                    categoryId: result.id, 
                    propertyTypeIds: data.selectedPropertyTypes 
                  });
                }
                
                setIsAddModalOpen(false);
              }}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category: ServiceItemsCategory) => (
            <div key={category.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {category.icon_url && (
                  <img src={category.icon_url} alt={category.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.slug}</p>
                  {category.parent_service_item_name && (
                    <p className="text-xs text-blue-600">Parent Service Item: {category.parent_service_item_name}</p>
                  )}
                  {category.parent_category_name && (
                    <p className="text-xs text-green-600">Category: {category.parent_category_name}</p>
                  )}
                  <p className="text-xs text-gray-500">{category.description}</p>
                  <p className="text-xs text-gray-400">Sort: {category.sort_order} | Active: {category.is_active ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Service Items Category</DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                      category={editingCategory}
                      onSubmit={async (data) => {
                        // Update the category first
                        await updateMutation.mutateAsync({ id: category.id, data });
                        
                        // Then update property types
                        if (data.selectedPropertyTypes !== undefined) {
                          await updatePropertyTypesMutation.mutateAsync({ 
                            categoryId: category.id, 
                            propertyTypeIds: data.selectedPropertyTypes 
                          });
                        }
                        
                        setEditingCategory(null);
                      }}
                      onCancel={() => setEditingCategory(null)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteMutation.mutate(category.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No service item categories found
          </div>
        )}
      </div>
    </div>
    </NewAdminLayout>
  );
};

export default ServiceItemsCategory;
