/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from '@/pages/admin/NewAdminLayout';
import { Plus, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
      console.log('Sending POST request with data:', data);
      const response = await fetch(buildApiUrl('/api/admin/service-items-category'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Server response:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-items-category"] });
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
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
      hero_image_url: category?.hero_image_url || '',
      sort_order: category?.sort_order || 0,
      is_active: category?.is_active !== false,
      selectedPropertyTypes: [] as number[]
    });

  const [selectedFiles, setSelectedFiles] = useState<{ hero?: File | null }>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  // icon removed

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
      const submitData: any = { ...formData };
      // remove UI-only field
      delete submitData.selectedCategoryId;

      // Upload any selected files to Cloudinary and set the returned URLs
      try {
        setUploadError(null);
        if (selectedFiles.hero) {
          const uploadFile = async (file: File) => {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            const folder = import.meta.env.VITE_CLOUDINARY_FOLDER_MODE;

            if (!cloudName || !uploadPreset) {
              throw new Error('Cloudinary config missing');
            }

            const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
            const fd = new FormData();
            fd.append('file', file);
            fd.append('upload_preset', uploadPreset);
            if (folder) fd.append('folder', folder);

            const res = await fetch(url, { method: 'POST', body: fd });
            if (!res.ok) {
              const text = await res.text();
              throw new Error(`Upload failed: ${text}`);
            }
            const json = await res.json();
            return json.secure_url || json.url;
          };

          setUploading(true);
          if (selectedFiles.hero) {
            const uploaded = await uploadFile(selectedFiles.hero);
            submitData.hero_image_url = uploaded;
          }
          setUploading(false);
        }

        // Add missing required fields that the backend might expect
        submitData.image_url = submitData.hero_image_url || ''; // Use hero_image_url as image_url if not set
        submitData.icon_url = submitData.hero_image_url || ''; // Use hero_image_url as icon_url if not set
        
        console.log('Submitting data:', submitData); // Debug log to see what's being sent

        // Pass the full data including selectedPropertyTypes to the parent
        await onSubmit(submitData);
      } catch (error: any) {
        console.error('Error submitting form:', error);
        setUploading(false);
        setUploadError(error?.message || 'Failed to upload images');
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

        {/* Compact image/upload controls: small circular previews and minimal height */}
        <div className="flex items-center gap-6 py-2">
          <div className="flex flex-col items-center">
            <label className="text-sm mb-1">Hero</label>
            <div className="flex items-center gap-2">
              <Avatar className="w-12 h-12">
                {formData.hero_image_url ? (
                  <AvatarImage src={formData.hero_image_url} alt={formData.name || 'hero'} />
                ) : (
                  <AvatarFallback>H</AvatarFallback>
                )}
              </Avatar>
              <input
                ref={heroInputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  setSelectedFiles(prev => ({ ...prev, hero: f || null }));
                  if (f) setFormData(prev => ({ ...prev, hero_image_url: URL.createObjectURL(f) }));
                }}
              />
              <Button type="button" size="sm" variant="outline" onClick={() => heroInputRef.current?.click()}>Choose</Button>
            </div>
          </div>
        </div>
        {uploading && <p className="text-xs text-gray-500">Uploading images...</p>}
        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
        <Input
          type="number"
          placeholder="Sort Order"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
        />
        
        {/* Property Types Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Property Types</label>
          <Select
            value={formData.selectedPropertyTypes.length > 0 ? "selected" : "none"}
            onValueChange={() => {}} // Controlled by individual checkboxes below
          >
            <SelectTrigger>
              <SelectValue>
                {formData.selectedPropertyTypes.length === 0 
                  ? "Select Property Types" 
                  : `${formData.selectedPropertyTypes.length} property type(s) selected`
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {propertyTypes.map((propertyType) => (
                <div key={propertyType.id} className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50">
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
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`property-${propertyType.id}`} className="text-sm cursor-pointer flex-1">
                    <span className="font-medium">{propertyType.slug}</span>
                    <span className="text-gray-500 ml-2">({propertyType.name})</span>
                  </label>
                </div>
              ))}
            </SelectContent>
          </Select>
          
          {/* Display selected property types */}
          {formData.selectedPropertyTypes.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Selected property types:</p>
              <div className="flex flex-wrap gap-1">
                {formData.selectedPropertyTypes.map(typeId => {
                  const propertyType = propertyTypes.find(pt => pt.id === typeId);
                  return propertyType ? (
                    <span 
                      key={typeId} 
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {propertyType.slug}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedTypes = formData.selectedPropertyTypes.filter(id => id !== typeId);
                          setFormData({ ...formData, selectedPropertyTypes: updatedTypes });
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
          
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <div key={category.id} className="border rounded-lg p-4 flex items-center gap-4">
              {/* Hero image */}
              {category.hero_image_url ? (
                <img src={category.hero_image_url} alt={category.name} className="w-40 h-24 object-cover rounded-md flex-shrink-0" />
              ) : (
                <div className="w-40 h-24 bg-gray-50 border rounded-md flex items-center justify-center text-gray-300">No Hero</div>
              )}

              <div className="flex-1 flex items-start gap-4">
                {/* Icon + main content */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600 font-mono">{category.slug}</p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-base text-gray-700 max-w-3xl">{category.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {category.parent_service_item_name && (<span className="mr-3 text-blue-600">Parent Item: {category.parent_service_item_name}</span>)}
                      {category.parent_category_name && (<span className="mr-3 text-green-600">Category: {category.parent_category_name}</span>)}
                      <span>Sort: {category.sort_order}</span>
                      <span className="ml-3">Active: <strong className={category.is_active ? 'text-green-600' : 'text-red-600'}>{category.is_active ? 'Yes' : 'No'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-auto">
                <Dialog open={editingCategory?.id === category.id} onOpenChange={(open) => !open && setEditingCategory(null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
