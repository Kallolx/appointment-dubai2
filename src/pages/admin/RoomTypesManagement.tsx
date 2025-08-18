import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';
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
}

interface RoomType {
  id: number;
  property_type_id: number;
  name: string;
  slug: string;
  icon_url: string | null;
  description: string | null;
  max_bedrooms: number | null;
  max_bathrooms: number | null;
  base_multiplier: number;
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
  icon_url: string;
  description: string;
  max_bedrooms: number | null;
  max_bathrooms: number | null;
  base_multiplier: number;
  is_active: boolean;
  sort_order: number;
}

const RoomTypesManagement: React.FC = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [form, setForm] = useState<RoomForm>({
    property_type_id: 0,
    name: '',
    slug: '',
    icon_url: '',
    description: '',
    max_bedrooms: null,
    max_bathrooms: null,
    base_multiplier: 1,
    is_active: true,
    sort_order: 0
  });
  const { toast } = useToast();

  // Stable form change handlers
  const handleFormChange = useCallback((field: keyof RoomForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handlePropertyTypeFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPropertyType(e.target.value ? parseInt(e.target.value) : null);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm(prev => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()
    }));
  }, []);

  const handlePropertyTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFormChange('property_type_id', parseInt(e.target.value));
  }, [handleFormChange]);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('slug', e.target.value);
  }, [handleFormChange]);

  const handleIconUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('icon_url', e.target.value);
  }, [handleFormChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFormChange('description', e.target.value);
  }, [handleFormChange]);

  const handleMaxBedroomsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('max_bedrooms', e.target.value ? parseInt(e.target.value) : null);
  }, [handleFormChange]);

  const handleMaxBathroomsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('max_bathrooms', e.target.value ? parseInt(e.target.value) : null);
  }, [handleFormChange]);

  const handleBaseMultiplierChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('base_multiplier', parseFloat(e.target.value) || 1);
  }, [handleFormChange]);

  const handleSortOrderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('sort_order', parseInt(e.target.value) || 0);
  }, [handleFormChange]);

  const handleActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('is_active', e.target.checked);
  }, [handleFormChange]);

  useEffect(() => {
    Promise.all([fetchRoomTypes(), fetchPropertyTypes()]);
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/room-types'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room types');
      }

      const data = await response.json();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
      toast({
        title: "Error",
        description: "Failed to load room types",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyTypes = async () => {
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
      setPropertyTypes(data);
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const isEditing = selectedRoom !== null;
      
      const url = isEditing 
        ? buildApiUrl(`/api/admin/room-types/${selectedRoom.id}`)
        : buildApiUrl('/api/admin/room-types');
      
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
        throw new Error(errorData.message || 'Failed to save room type');
      }

      toast({
        title: "Success",
        description: `Room type ${isEditing ? 'updated' : 'created'} successfully`
      });

      await fetchRoomTypes();
      resetForm();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving room type:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save room type",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (roomType: RoomType) => {
    setSelectedRoom(roomType);
    setForm({
      property_type_id: roomType.property_type_id,
      name: roomType.name,
      slug: roomType.slug,
      icon_url: roomType.icon_url || '',
      description: roomType.description || '',
      max_bedrooms: roomType.max_bedrooms,
      max_bathrooms: roomType.max_bathrooms,
      base_multiplier: roomType.base_multiplier,
      is_active: roomType.is_active,
      sort_order: roomType.sort_order
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setForm({
      property_type_id: 0,
      name: '',
      slug: '',
      icon_url: '',
      description: '',
      max_bedrooms: null,
      max_bathrooms: null,
      base_multiplier: 1,
      is_active: true,
      sort_order: 0
    });
    setSelectedRoom(null);
  };

  const filteredRoomTypes = roomTypes.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.property_type_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPropertyType = selectedPropertyType === null || room.property_type_id === selectedPropertyType;
    
    return matchesSearch && matchesPropertyType;
  });

  if (loading) {
    return (
      <NewAdminLayout
        title="Room Types"
        subtitle="Manage apartment and villa room configurations"
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
      title="Room Types"
      subtitle="Manage apartment and villa room configurations"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search room types..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedPropertyType || ''}
              onChange={handlePropertyTypeFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Property Types</option>
              {propertyTypes.map(pt => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Room Type
          </Button>
        </div>

        {/* Room Types List */}
        <Card>
          <CardHeader>
            <CardTitle>Room Types ({filteredRoomTypes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRoomTypes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedPropertyType ? 'No room types match your filters.' : 'No room types found.'}
                </p>
                {!searchTerm && !selectedPropertyType && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Room Type
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-gray-900">Room Type</th>
                      <th className="pb-3 font-medium text-gray-900">Property Type</th>
                      <th className="pb-3 font-medium text-gray-900">Slug</th>
                      <th className="pb-3 font-medium text-gray-900">Rooms</th>
                      <th className="pb-3 font-medium text-gray-900">Multiplier</th>
                      <th className="pb-3 font-medium text-gray-900">Status</th>
                      <th className="pb-3 font-medium text-gray-900">Sort</th>
                      <th className="pb-3 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoomTypes.map((room) => (
                      <tr key={room.id} className="border-b last:border-b-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            {room.icon_url && (
                              <img
                                src={room.icon_url}
                                alt={room.name}
                                className="w-8 h-8 rounded object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{room.name}</p>
                              {room.description && (
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {room.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline">{room.property_type_name}</Badge>
                        </td>
                        <td className="py-4 text-gray-600 font-mono text-sm">{room.slug}</td>
                        <td className="py-4 text-gray-600">
                          {room.max_bedrooms && `${room.max_bedrooms} bed`}
                          {room.max_bedrooms && room.max_bathrooms && ', '}
                          {room.max_bathrooms && `${room.max_bathrooms} bath`}
                          {!room.max_bedrooms && !room.max_bathrooms && '-'}
                        </td>
                        <td className="py-4 text-gray-900 font-medium">×{room.base_multiplier}</td>
                        <td className="py-4">
                          <Badge 
                            variant={room.is_active ? "default" : "secondary"}
                            className={room.is_active ? "bg-green-100 text-green-800" : ""}
                          >
                            {room.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4 text-gray-600">{room.sort_order}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(room)}
                            >
                              <Edit className="w-4 h-4" />
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

        {/* Add Room Dialog */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Add Room Type</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsAddDialogOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type *</label>
                    <select
                      value={form.property_type_id}
                      onChange={handlePropertyTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Property Type</option>
                      {propertyTypes.map(pt => (
                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Enter room type name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <Input
                    value={form.slug}
                    onChange={handleSlugChange}
                    placeholder="room-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon URL</label>
                  <Input
                    value={form.icon_url}
                    onChange={handleIconUrlChange}
                    placeholder="/path/to/icon.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter room type description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Bedrooms</label>
                    <Input
                      type="number"
                      min="0"
                      value={form.max_bedrooms || ''}
                      onChange={handleMaxBedroomsChange}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Bathrooms</label>
                    <Input
                      type="number"
                      min="0"
                      value={form.max_bathrooms || ''}
                      onChange={handleMaxBathroomsChange}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Multiplier</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.base_multiplier}
                      onChange={handleBaseMultiplierChange}
                      required
                    />
                  </div>
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

        {/* Edit Room Dialog */}
        {isEditDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Room Type</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type *</label>
                    <select
                      value={form.property_type_id}
                      onChange={handlePropertyTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Property Type</option>
                      {propertyTypes.map(pt => (
                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <Input
                      value={form.name}
                      onChange={handleNameChange}
                      placeholder="Enter room type name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <Input
                    value={form.slug}
                    onChange={handleSlugChange}
                    placeholder="room-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon URL</label>
                  <Input
                    value={form.icon_url}
                    onChange={handleIconUrlChange}
                    placeholder="/path/to/icon.png"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter room type description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Bedrooms</label>
                    <Input
                      type="number"
                      min="0"
                      value={form.max_bedrooms || ''}
                      onChange={handleMaxBedroomsChange}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Bathrooms</label>
                    <Input
                      type="number"
                      min="0"
                      value={form.max_bathrooms || ''}
                      onChange={handleMaxBathroomsChange}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Multiplier</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={form.base_multiplier}
                      onChange={handleBaseMultiplierChange}
                      required
                    />
                  </div>
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

export default RoomTypesManagement;
