import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Edit, Trash2, Search, Save, X, Filter, SlidersHorizontal, MapPin, Building2, Eye, EyeOff, SortAsc, SortDesc } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl } from "@/config/api";
import NewAdminLayout from "@/pages/admin/NewAdminLayout";

interface PropertyType {
  id: number;
  name: string;
  slug: string;
}

interface RoomType {
  id: number;
  property_type_id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  whats_included: string[] | string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  property_type_name: string;
}

interface RoomForm {
  property_type_id: number;
  name: string;
  slug: string;
  image_url: string;
  description: string;
  whats_included: string[];
  is_active: boolean;
  sort_order: number;
}

export default function RoomTypesManagement() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<RoomType | null>(null);
  
  // Enhanced filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "",
    status: "all", // all, active, inactive
    sortBy: "name", // name, created_at, sort_order
    sortOrder: "asc" // asc, desc
  });

  const [form, setForm] = useState<RoomForm>({
    property_type_id: 0,
    name: "",
    slug: "",
    image_url: "",
    description: "",
    whats_included: [],
    is_active: true,
    sort_order: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFormChange = useCallback((field: keyof RoomForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      handleFormChange("name", name);
      if (!editingRoom) {
        handleFormChange("slug", generateSlug(name));
      }
    },
    [handleFormChange, generateSlug, editingRoom]
  );

  const fetchPropertyTypes = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/admin/property-types"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch property types");
      const data = await response.json();
      setPropertyTypes(data);
    } catch (error) {
      console.error("Error fetching property types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch property types",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl("/api/admin/room-types"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch room types");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPropertyTypes();
    fetchRooms();
  }, [fetchPropertyTypes, fetchRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room type name",
        variant: "destructive",
      });
      return;
    }

    if (!form.property_type_id) {
      toast({
        title: "Error",
        description: "Please select a property type",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Build payload from form; if file selected, upload to Cloudinary first
      let payload: any = { ...form, sort_order: form.sort_order || 0 };

      if (selectedFile) {
        try {
          setUploading(true);
          const uploadedUrl = await (async (file: File) => {
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
          })(selectedFile);

          payload = { ...payload, image_url: uploadedUrl };
          setForm((prev) => ({ ...prev, image_url: uploadedUrl }));
        } catch (err: any) {
          console.error('Cloudinary upload error', err);
          setUploadError(err?.message || 'Upload failed');
          setUploading(false);
          setSubmitting(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      const url = editingRoom
        ? buildApiUrl(`/api/admin/room-types/${editingRoom.id}`)
        : buildApiUrl("/api/admin/room-types");

      const method = editingRoom ? "PUT" : "POST";

      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save room type");
      }

      toast({
        title: "Success",
        description: `Room type ${
          editingRoom ? "updated" : "created"
        } successfully`,
      });

      await fetchRooms();
      resetForm();
    } catch (error) {
      console.error("Error saving room type:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save room type",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (roomType: RoomType) => {
    setEditingRoom(roomType);
    
    // Parse whats_included if it's a JSON string
    let whatsIncluded = [];
    if (roomType.whats_included) {
      if (Array.isArray(roomType.whats_included)) {
        whatsIncluded = roomType.whats_included;
      } else if (typeof roomType.whats_included === 'string') {
        try {
          whatsIncluded = JSON.parse(roomType.whats_included);
        } catch (e) {
          whatsIncluded = [];
        }
      }
    }
    
    setForm({
      property_type_id: roomType.property_type_id,
      name: roomType.name,
      slug: roomType.slug,
      image_url: roomType.image_url || "",
      description: roomType.description || "",
      whats_included: whatsIncluded,
      is_active: roomType.is_active,
      sort_order: roomType.sort_order,
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/room-types/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete room type (${response.status})`);
      }

      toast({
        title: "Success",
        description: "Room type deleted successfully",
      });

      setDeleteModalOpen(false);
      setDeletingRoom(null);
      await fetchRooms();
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete room type",
        variant: "destructive",
      });
      setDeleteModalOpen(false);
      setDeletingRoom(null);
    }
  };

  const handleDeleteClick = (room: RoomType) => {
    setDeletingRoom(room);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingRoom) {
      handleDelete(deletingRoom.id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeletingRoom(null);
  };

  const resetForm = () => {
    setForm({
      property_type_id: 0,
      name: "",
      slug: "",
      image_url: "",
      description: "",
      whats_included: [],
      is_active: true,
      sort_order: 0,
    });
    setEditingRoom(null);
    setShowForm(false);
    setIsModalOpen(false);
    setSelectedFile(null);
    setUploadError(null);
  };

  // Enhanced filtering and sorting logic
  const filteredAndSortedRooms = rooms
    .filter((room) => {
      // Search filter
      const matchesSearch = 
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.property_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Property type filter
      const matchesPropertyType = !filters.propertyType || 
        room.property_type_name === filters.propertyType;
      
      // Status filter
      const matchesStatus = 
        filters.status === "all" ||
        (filters.status === "active" && room.is_active) ||
        (filters.status === "inactive" && !room.is_active);
      
      return matchesSearch && matchesPropertyType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "sort_order":
          comparison = a.sort_order - b.sort_order;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

  // Get unique property types for filter dropdown
  const uniquePropertyTypes = Array.from(
    new Set(rooms.map(room => room.property_type_name))
  ).sort();

  // Get filter statistics
  const filterStats = {
    total: rooms.length,
    filtered: filteredAndSortedRooms.length,
    active: rooms.filter(room => room.is_active).length,
    inactive: rooms.filter(room => !room.is_active).length
  };

  if (loading) {
    return (
      <NewAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading room types...</div>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout
      title="Room Types Management"
      subtitle="Manage and organize room types for your properties"
    >
      <div className="space-y-6">
        {/* Enhanced Search and Filter Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search room types, descriptions, slugs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {Object.values(filters).some(v => v !== "" && v !== "all" && v !== "name" && v !== "asc") && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </div>

                             {/* Action Button */}
               <Button
                 onClick={() => {
                   setEditingRoom(null);
                   setForm({
                     property_type_id: 0,
                     name: "",
                     slug: "",
                     image_url: "",
                     description: "",
                     whats_included: [],
                     is_active: true,
                     sort_order: 0,
                   });
                   setSelectedFile(null);
                   setUploadError(null);
                   setIsModalOpen(true);
                 }}
                 className="flex items-center gap-2"
               >
                 <Plus className="w-4 h-4" />
                 Add Room Type
               </Button>
            </div>

            {/* Filter Statistics */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Total: <span className="font-semibold">{filterStats.total}</span></span>
              <span>Showing: <span className="font-semibold">{filterStats.filtered}</span></span>
              <span>Active: <span className="font-semibold text-green-600">{filterStats.active}</span></span>
              <span>Inactive: <span className="font-semibold text-red-600">{filterStats.inactive}</span></span>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Property Type Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Property Types</option>
                      {uniquePropertyTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="name">Name</option>
                      <option value="created_at">Created Date</option>
                      <option value="sort_order">Sort Order</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort Order</label>
                    <div className="flex gap-2">
                      <Button
                        variant={filters.sortOrder === "asc" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, sortOrder: "asc" }))}
                        className="flex items-center gap-1"
                      >
                        <SortAsc className="w-3 h-3" />
                        Asc
                      </Button>
                      <Button
                        variant={filters.sortOrder === "desc" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, sortOrder: "desc" }))}
                        className="flex items-center gap-1"
                      >
                        <SortDesc className="w-3 h-3" />
                        Desc
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters({
                        propertyType: "",
                        status: "all",
                        sortBy: "name",
                        sortOrder: "asc"
                      });
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

                 {/* Room Type Modal */}
         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
             <DialogHeader>
               <DialogTitle>
                 {editingRoom ? "Edit Room Type" : "Add New Room Type"}
               </DialogTitle>
             </DialogHeader>
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">
                     Property Type *
                   </label>
                   <select
                     value={form.property_type_id}
                     onChange={(e) =>
                       handleFormChange(
                         "property_type_id",
                         parseInt(e.target.value)
                       )
                     }
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     required
                   >
                     <option value={0}>Select Property Type</option>
                     {propertyTypes.map((type) => (
                       <option key={type.id} value={type.id}>
                         {type.slug} ({type.name})
                       </option>
                     ))}
                   </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium mb-1">
                     Name *
                   </label>
                   <Input
                     value={form.name}
                     onChange={handleNameChange}
                     placeholder="e.g., Living Room"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium mb-1">
                     Slug *
                   </label>
                   <Input
                     value={form.slug}
                     onChange={(e) => handleFormChange("slug", e.target.value)}
                     placeholder="e.g., living-room"
                     required
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium mb-1">Image</label>
                   <div className="flex items-center gap-3">
                     <Avatar>
                       {form.image_url ? (
                         <AvatarImage src={form.image_url} alt={form.name || 'room image'} />
                       ) : (
                         <AvatarFallback>{form.name ? form.name.charAt(0) : 'R'}</AvatarFallback>
                       )}
                     </Avatar>

                     <div>
                       <input
                         ref={fileInputRef}
                         type="file"
                         accept="image/*"
                         className="hidden"
                         onChange={(e) => {
                           const f = e.target.files && e.target.files[0];
                           setSelectedFile(f || null);
                           if (f) {
                             const preview = URL.createObjectURL(f);
                             setForm((prev) => ({ ...prev, image_url: preview }));
                           }
                         }}
                       />
                       <div className="flex items-center gap-2">
                         <Button type="button" onClick={() => fileInputRef.current?.click()}>
                           Choose
                         </Button>
                         {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                       </div>
                       {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
                     </div>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium mb-1">
                     Sort Order
                   </label>
                   <Input
                     type="number"
                     value={form.sort_order}
                     onChange={(e) =>
                       handleFormChange(
                         "sort_order",
                         parseInt(e.target.value) || 0
                       )
                     }
                     placeholder="0"
                     min="0"
                   />
                 </div>

                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="is_active"
                     checked={form.is_active}
                     onChange={(e) =>
                       handleFormChange("is_active", e.target.checked)
                     }
                     className="rounded"
                   />
                   <label htmlFor="is_active" className="text-sm font-medium">
                     Active
                   </label>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-1">
                   Description
                 </label>
                 <Textarea
                   value={form.description}
                   onChange={(e) =>
                     handleFormChange("description", e.target.value)
                   }
                   placeholder="Description of this room type..."
                   rows={3}
                 />
               </div>

               {/* What's Included Section */}
               <div>
                 <label className="block text-sm font-medium mb-2">
                   What's Included
                 </label>
                 <div className="space-y-2">
                   {Array.isArray(form.whats_included) ? form.whats_included.map((item, index) => (
                     <div key={index} className="flex items-center space-x-2">
                       <Input
                         value={item}
                         onChange={(e) => {
                           const newItems = [...(Array.isArray(form.whats_included) ? form.whats_included : [])];
                           newItems[index] = e.target.value;
                           handleFormChange("whats_included", newItems);
                         }}
                         placeholder="Enter what's included..."
                         className="flex-1"
                       />
                       <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           const currentArray = Array.isArray(form.whats_included) ? form.whats_included : [];
                           const newItems = currentArray.filter((_, i) => i !== index);
                           handleFormChange("whats_included", newItems);
                         }}
                         className="text-red-600 hover:text-red-700"
                       >
                         <X className="w-4 h-4" />
                       </Button>
                     </div>
                   )) : null}
                   <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={() => {
                       const currentArray = Array.isArray(form.whats_included) ? form.whats_included : [];
                       handleFormChange("whats_included", [...currentArray, ""]);
                     }}
                     className="w-full border-dashed"
                   >
                     <Plus className="w-4 h-4 mr-2" />
                     Add Item
                   </Button>
                 </div>
               </div>

               <div className="flex justify-end space-x-2 pt-4 border-t">
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => setIsModalOpen(false)}
                   disabled={submitting}
                 >
                   <X className="w-4 h-4 mr-2" />
                   Cancel
                 </Button>
                 <Button type="submit" disabled={submitting}>
                   <Save className="w-4 h-4 mr-2" />
                   {submitting
                     ? "Saving..."
                     : editingRoom
                     ? "Update"
                     : "Create"}
                 </Button>
               </div>
             </form>
           </DialogContent>
         </Dialog>

        {/* Enhanced Room Types List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Room Types ({filteredAndSortedRooms.length})</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>Filtered from {filterStats.total} total</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAndSortedRooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Building2 className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No room types found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || Object.values(filters).some(v => v !== "" && v !== "all" && v !== "name" && v !== "asc")
                      ? "Try adjusting your search or filter criteria."
                      : "Get started by adding your first room type."}
                  </p>
                                     {!searchTerm && Object.values(filters).every(v => v === "" || v === "all" || v === "name" || v === "asc") && (
                     <Button onClick={() => {
                       setEditingRoom(null);
                       setForm({
                         property_type_id: 0,
                         name: "",
                         slug: "",
                         image_url: "",
                         description: "",
                         whats_included: [],
                         is_active: true,
                         sort_order: 0,
                       });
                       setSelectedFile(null);
                       setUploadError(null);
                       setIsModalOpen(true);
                     }} className="flex items-center gap-2">
                       <Plus className="w-4 h-4" />
                       Add First Room Type
                     </Button>
                   )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredAndSortedRooms.map((room) => (
                    <div
                      key={room.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {/* Room Image */}
                            <div className="flex-shrink-0">
                              {room.image_url ? (
                                <img
                                  src={room.image_url}
                                  alt={room.name}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border flex items-center justify-center text-gray-500 font-semibold">
                                  {room.name ? room.name.charAt(0).toUpperCase() : 'R'}
                                </div>
                              )}
                            </div>

                            {/* Room Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{room.name}</h3>
                                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Building2 className="w-3 h-3" />
                                      {room.property_type_name}
                                    </span>
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                      {room.slug}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Status Badge */}
                                <Badge
                                  variant={room.is_active ? "default" : "secondary"}
                                  className="flex items-center gap-1"
                                >
                                  {room.is_active ? (
                                    <>
                                      <Eye className="w-3 h-3" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-3 h-3" />
                                      Inactive
                                    </>
                                  )}
                                </Badge>
                              </div>

                              {/* Description */}
                              {room.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {room.description}
                                </p>
                              )}

                              {/* Additional Info */}
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Sort Order: <span className="font-medium">{room.sort_order}</span></span>
                                <span>Created: <span className="font-medium">{new Date(room.created_at).toLocaleDateString()}</span></span>
                              </div>
                            </div>
                          </div>


                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(room)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(room)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delete confirmation modal */}
        {deleteModalOpen && deletingRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Delete Room Type</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete "<strong>{deletingRoom.name}</strong>"?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The room type will be permanently removed.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleDeleteCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NewAdminLayout>
  );
}
