import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, Save, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

  const [form, setForm] = useState<RoomForm>({
    property_type_id: 0,
    name: "",
    slug: "",
    image_url: "",
    description: "",
    is_active: true,
    sort_order: 0,
  });

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
        body: JSON.stringify({
          ...form,
          sort_order: form.sort_order || 0,
        }),
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
    setForm({
      property_type_id: roomType.property_type_id,
      name: roomType.name,
      slug: roomType.slug,
      image_url: roomType.image_url || "",
      description: roomType.description || "",
      is_active: roomType.is_active,
      sort_order: roomType.sort_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this room type?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(buildApiUrl(`/api/admin/room-types/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete room type");

      toast({
        title: "Success",
        description: "Room type deleted successfully",
      });

      await fetchRooms();
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast({
        title: "Error",
        description: "Failed to delete room type",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setForm({
      property_type_id: 0,
      name: "",
      slug: "",
      image_url: "",
      description: "",
      is_active: true,
      sort_order: 0,
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.property_type_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      room.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Search */}
        <Card>
          <CardContent className="pt-6 flex justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search property types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Room Type
            </Button>
          </CardContent>
        </Card>

        {/* Room Type Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingRoom ? "Edit Room Type" : "Add New Room Type"}
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                          {type.name}
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
                    <label className="block text-sm font-medium mb-1">
                      Image URL
                    </label>
                    <Input
                      value={form.image_url}
                      onChange={(e) =>
                        handleFormChange("image_url", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
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

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
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
            </CardContent>
          </Card>
        )}

        {/* Room Types List */}
        <Card>
          <CardHeader>
            <CardTitle>Room Types ({filteredRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm
                    ? "No room types found matching your search."
                    : "No room types found."}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {room.image_url && (
                              <img
                                src={room.image_url}
                                alt={room.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-lg">
                                {room.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Property Type: {room.property_type_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Slug: {room.slug}
                              </p>
                            </div>
                          </div>

                          {room.description && (
                            <p className="text-gray-600 mb-2">
                              {room.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Sort: {room.sort_order}</span>
                            <Badge
                              variant={room.is_active ? "default" : "secondary"}
                            >
                              {room.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(room)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </NewAdminLayout>
  );
}
