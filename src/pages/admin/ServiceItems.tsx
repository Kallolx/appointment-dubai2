/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from '@/pages/admin/NewAdminLayout';
import { Plus, Edit, Trash2 } from "lucide-react";

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  category_name: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ServiceItems = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const queryClient = useQueryClient();

  // Fetch service items
  const { data: serviceItems = [], isLoading } = useQuery({
    queryKey: ["admin-service-items"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/api/admin/service-items'), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    },
  });

  // Fetch categories for dropdown
  const { data: categories = [] }: { data: Category[] } = useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/api/service-categories'));
      return response.json();
    },
  });

  // Add service item
  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(buildApiUrl('/api/admin/service-items'), {
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
      queryClient.invalidateQueries({ queryKey: ["admin-service-items"] });
      setIsAddModalOpen(false);
    },
  });

  // Update service item
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(buildApiUrl(`/api/admin/service-items/${id}`), {
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
      queryClient.invalidateQueries({ queryKey: ["admin-service-items"] });
      setEditingItem(null);
    },
  });

  // Delete service item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(buildApiUrl(`/api/admin/service-items/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-items"] });
    },
  });

  const ServiceItemForm = ({ item, onSubmit, onCancel }: { item?: ServiceItem | null; onSubmit: (data: any) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      name: item?.name || '',
      slug: item?.slug || '',
      category_id: item?.category_id || '',
      description: item?.description || '',
      image_url: item?.image_url || '',
      sort_order: item?.sort_order || 0,
      is_active: item?.is_active !== false
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadToCloudinary = async (file: File) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setUploadError(null);
      try {
        let dataToSend = { ...formData };

        if (selectedFile) {
          setUploading(true);
          const uploadedUrl = await uploadToCloudinary(selectedFile);
          dataToSend = { ...dataToSend, image_url: uploadedUrl };
          setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
        }

        onSubmit(dataToSend);
      } catch (err: any) {
        console.error('Cloudinary upload error', err);
        setUploadError(err?.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Service Name"
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
          value={formData.category_id.toString()}
          onValueChange={(value) => setFormData({ ...formData, category_id: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm block mb-2">Image</label>
            <Avatar>
              {formData.image_url ? (
                <AvatarImage src={formData.image_url} alt={formData.name || 'service image'} />
              ) : (
                <AvatarFallback>{formData.name ? formData.name.charAt(0) : 'S'}</AvatarFallback>
              )}
            </Avatar>
          </div>
          <div>
            <label className="text-sm">Upload image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                setSelectedFile(f || null);
                if (f) {
                  // show a local preview immediately
                  const preview = URL.createObjectURL(f);
                  setFormData((prev) => ({ ...prev, image_url: preview }));
                }
              }}
            />
            {uploading && <p className="text-xs text-gray-500">Uploading image...</p>}
            {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
          </div>
        </div>
        <Input
          type="number"
          placeholder="Sort Order"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <label>Active</label>
        </div>
        <div className="flex gap-2">
          <Button type="submit">{item ? 'Update' : 'Add'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <NewAdminLayout title="Service Items" subtitle="Manage service items and link them to categories">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout title="Service Items" subtitle="Manage service items and link them to categories">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Service Items Management</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Service Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Item</DialogTitle>
            </DialogHeader>
            <ServiceItemForm
              onSubmit={(data) => addMutation.mutate(data)}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {serviceItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category_name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Service Item</DialogTitle>
                  </DialogHeader>
                  <ServiceItemForm
                    item={editingItem}
                    onSubmit={(data) => updateMutation.mutate({ id: item.id, data })}
                    onCancel={() => setEditingItem(null)}
                  />
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteMutation.mutate(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </NewAdminLayout>
  );
};

export default ServiceItems;
