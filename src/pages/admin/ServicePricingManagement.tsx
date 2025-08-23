import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, DollarSign, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

interface PropertyType {
  id: number;
  name: string;
  slug: string;
}

interface RoomType {
  id: number;
  name: string;
  slug: string;
  property_type_id: number;
  description?: string;
}

interface ServicePricing {
  id: number;
  service_category_id: number;
  property_type_id: number;
  room_type_id: number;
  price: number;
  discount_price?: number;
  description?: string;
  is_special: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  property_type_name: string;
  room_type_name: string;
}

interface PricingForm {
  service_category_id: number;
  property_type_id: number;
  room_type_id: number;
  price: number;
  discount_price?: number;
  description: string;
  is_special: boolean;
  is_active: boolean;
}

interface PricingFilters {
  category_id: string;
  property_type_id: string;
  room_type_id: string;
  status: string; // 'all', 'active', 'inactive'
  special: string; // 'all', 'special', 'regular'
  price_range: string; // 'all', '0-100', '100-500', '500+'
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

const ServicePricingManagement: React.FC = () => {
  const [pricings, setPricings] = useState<ServicePricing[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<ServicePricing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<PricingFilters>({
    category_id: '',
    property_type_id: '',
    room_type_id: '',
    status: 'all',
    special: 'all',
    price_range: 'all'
  });

  // Pagination states
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  const [form, setForm] = useState<PricingForm>({
    service_category_id: 0,
    property_type_id: 0,
    room_type_id: 0,
    price: 0,
    discount_price: undefined,
    description: '',
    is_special: false,
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchPricings(),
      fetchCategories(),
      fetchPropertyTypes(),
      fetchRoomTypes()
    ]);
  };

  const fetchPricings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/service-pricing'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service pricing');
      }

      const data = await response.json();
      setPricings(data);
    } catch (error) {
      console.error('Error fetching service pricing:', error);
      toast({
        title: "Error",
        description: "Failed to load service pricing",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/service-categories'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

      if (!response.ok) throw new Error('Failed to fetch property types');
      const data = await response.json();
      setPropertyTypes(data);
    } catch (error) {
      console.error('Error fetching property types:', error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/room-types'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch room types');
      const data = await response.json();
      setRoomTypes(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const isEditing = selectedPricing !== null;
      
      const url = isEditing 
        ? buildApiUrl(`/api/admin/service-pricing/${selectedPricing.id}`)
        : buildApiUrl('/api/admin/service-pricing');
      
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
        throw new Error(errorData.message || 'Failed to save pricing');
      }

      toast({
        title: "Success",
        description: `Pricing ${isEditing ? 'updated' : 'created'} successfully`
      });

      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      resetForm();
      fetchPricings();
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save pricing",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pricing?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/admin/service-pricing/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete pricing');
      }

      toast({
        title: "Success",
        description: "Pricing deleted successfully"
      });

      fetchPricings();
    } catch (error) {
      console.error('Error deleting pricing:', error);
      toast({
        title: "Error",
        description: "Failed to delete pricing",
        variant: "destructive"
      });
    }
  };

  const resetForm = useCallback(() => {
    setForm({
      service_category_id: 0,
      property_type_id: 0,
      room_type_id: 0,
      price: 0,
      discount_price: undefined,
      description: '',
      is_special: false,
      is_active: true
    });
    setSelectedPricing(null);
  }, []);

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((pricing: ServicePricing) => {
    setForm({
      service_category_id: pricing.service_category_id,
      property_type_id: pricing.property_type_id,
      room_type_id: pricing.room_type_id,
      price: pricing.price,
      discount_price: pricing.discount_price,
      description: pricing.description || '',
      is_special: pricing.is_special,
      is_active: pricing.is_active
    });
    setSelectedPricing(pricing);
    setIsEditDialogOpen(true);
  }, []);

  const closeDialogs = useCallback(() => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    resetForm();
  }, [resetForm]);

  // Get filtered room types based on selected property type
  const getFilteredRoomTypes = useCallback(() => {
    if (!form.property_type_id) return [];
    return roomTypes.filter(room => room.property_type_id === form.property_type_id);
  }, [roomTypes, form.property_type_id]);

  // Advanced filtering and pagination logic
  const filteredAndPaginatedData = useMemo(() => {
    let filtered = pricings.filter(pricing => {
      // Search term filter
      const searchMatch = !searchTerm || 
        pricing.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.property_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.room_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pricing.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const categoryMatch = !filters.category_id || 
        pricing.service_category_id.toString() === filters.category_id;

      // Property type filter
      const propertyMatch = !filters.property_type_id || 
        pricing.property_type_id.toString() === filters.property_type_id;

      // Room type filter
      const roomMatch = !filters.room_type_id || 
        pricing.room_type_id.toString() === filters.room_type_id;

      // Status filter
      const statusMatch = filters.status === 'all' || 
        (filters.status === 'active' && pricing.is_active) ||
        (filters.status === 'inactive' && !pricing.is_active);

      // Special filter
      const specialMatch = filters.special === 'all' || 
        (filters.special === 'special' && pricing.is_special) ||
        (filters.special === 'regular' && !pricing.is_special);

      // Price range filter
      const priceMatch = (() => {
        if (filters.price_range === 'all') return true;
        const price = pricing.discount_price || pricing.price;
        switch (filters.price_range) {
          case '0-100': return price <= 100;
          case '100-500': return price > 100 && price <= 500;
          case '500+': return price > 500;
          default: return true;
        }
      })();

      return searchMatch && categoryMatch && propertyMatch && roomMatch && statusMatch && specialMatch && priceMatch;
    });

    // Update pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);

    // Update pagination state if needed
    if (totalItems !== pagination.totalItems || totalPages !== pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        totalItems,
        totalPages,
        currentPage: Math.min(prev.currentPage, totalPages || 1)
      }));
    }

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      hasFiltersApplied: !!(searchTerm || 
        filters.category_id || 
        filters.property_type_id || 
        filters.room_type_id || 
        filters.status !== 'all' || 
        filters.special !== 'all' || 
        filters.price_range !== 'all')
    };
  }, [pricings, searchTerm, filters, pagination.currentPage, pagination.itemsPerPage, pagination.totalItems, pagination.totalPages]);

  // Filter pricings based on search term
  const filteredPricings = pricings.filter(pricing =>
    pricing.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pricing.property_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pricing.room_type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stable input handlers
  const handleFormChange = useCallback((field: keyof PricingForm, value: any) => {
    setForm(prev => {
      const newForm = { ...prev, [field]: value };
      
      // Reset room type when property type changes
      if (field === 'property_type_id') {
        newForm.room_type_id = 0;
      }
      
      return newForm;
    });
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFormChange('service_category_id', parseInt(e.target.value));
  }, [handleFormChange]);

  const handlePropertyTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFormChange('property_type_id', parseInt(e.target.value));
  }, [handleFormChange]);

  const handleRoomTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFormChange('room_type_id', parseInt(e.target.value));
  }, [handleFormChange]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('price', parseFloat(e.target.value) || 0);
  }, [handleFormChange]);

  const handleDiscountPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('discount_price', e.target.value ? parseFloat(e.target.value) : undefined);
  }, [handleFormChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFormChange('description', e.target.value);
  }, [handleFormChange]);

  const handleSpecialChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('is_special', e.target.checked);
  }, [handleFormChange]);

  const handleActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFormChange('is_active', e.target.checked);
  }, [handleFormChange]);

  // Filter handlers
  const handleFilterChange = useCallback((field: keyof PricingFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Reset room type when property type changes
      ...(field === 'property_type_id' ? { room_type_id: '' } : {})
    }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category_id: '',
      property_type_id: '',
      room_type_id: '',
      status: 'all',
      special: 'all',
      price_range: 'all'
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage, 
      currentPage: 1,
      totalPages: Math.ceil(prev.totalItems / itemsPerPage)
    }));
  }, []);

  // Get room types filtered by selected property type in filters
  const getFilteredRoomTypesForFilter = useCallback(() => {
    if (!filters.property_type_id) return roomTypes;
    return roomTypes.filter(room => room.property_type_id.toString() === filters.property_type_id);
  }, [roomTypes, filters.property_type_id]);

  if (loading) {
    return (
      <NewAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading service pricing...</div>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout 
      title="Service Pricing Management"
      subtitle="Manage pricing for services across property and room types"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Pricing
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by category, property type, room type, or description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
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
                  {filteredAndPaginatedData.hasFiltersApplied && (
                    <Badge variant="secondary" className="ml-1">
                      Active
                    </Badge>
                  )}
                </Button>
                {filteredAndPaginatedData.hasFiltersApplied && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={filters.category_id}
                      onChange={(e) => handleFilterChange('category_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Property Type</label>
                    <select
                      value={filters.property_type_id}
                      onChange={(e) => handleFilterChange('property_type_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Property Types</option>
                      {propertyTypes.map(pt => (
                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Room Type</label>
                    <select
                      value={filters.room_type_id}
                      onChange={(e) => handleFilterChange('room_type_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!filters.property_type_id}
                    >
                      <option value="">All Room Types</option>
                      {getFilteredRoomTypesForFilter().map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Special Offers</label>
                    <select
                      value={filters.special}
                      onChange={(e) => handleFilterChange('special', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="special">Special Offers</option>
                      <option value="regular">Regular Pricing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Price Range</label>
                    <select
                      value={filters.price_range}
                      onChange={(e) => handleFilterChange('price_range', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-100">AED 0 - 100</option>
                      <option value="100-500">AED 100 - 500</option>
                      <option value="500+">AED 500+</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Service Pricing ({filteredAndPaginatedData.totalItems} total, showing {filteredAndPaginatedData.data.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={pagination.itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAndPaginatedData.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filteredAndPaginatedData.hasFiltersApplied ? 
                  'No pricing found matching your search and filters.' : 
                  'No service pricing found. Add your first pricing entry.'
                }
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Service Category</th>
                        <th className="text-left py-3 px-2">Property Type</th>
                        <th className="text-left py-3 px-2">Room Type</th>
                        <th className="text-left py-3 px-2">Price (AED)</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndPaginatedData.data.map((pricing) => (
                        <tr key={pricing.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{pricing.category_name}</Badge>
                              {pricing.is_special && <Badge variant="secondary">Special</Badge>}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <Badge variant="secondary">{pricing.property_type_name}</Badge>
                          </td>
                          <td className="py-4 px-2 font-medium text-gray-900">{pricing.room_type_name}</td>
                          <td className="py-4 px-2">
                            <div className="flex flex-col">
                              <span className="font-semibold">AED {pricing.price}</span>
                              {pricing.discount_price && (
                                <span className="text-sm text-green-600">Discount: AED {pricing.discount_price}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <Badge variant={pricing.is_active ? "default" : "secondary"}>
                              {pricing.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openEditDialog(pricing)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDelete(pricing.id)}
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, filteredAndPaginatedData.totalItems)} of{' '}
                      {filteredAndPaginatedData.totalItems} results
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage <= 1}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {[...Array(pagination.totalPages)].map((_, index) => {
                          const page = index + 1;
                          const isCurrentPage = page === pagination.currentPage;
                          const shouldShow = 
                            page === 1 || 
                            page === pagination.totalPages || 
                            (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2);
                          
                          if (!shouldShow) {
                            if (page === pagination.currentPage - 3 || page === pagination.currentPage + 3) {
                              return <span key={page} className="px-2 text-gray-500">...</span>;
                            }
                            return null;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        {(isAddDialogOpen || isEditDialogOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {isEditDialogOpen ? 'Edit Service Pricing' : 'Add New Service Pricing'}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeDialogs}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Category *</label>
                    <select
                      value={form.service_category_id}
                      onChange={handleCategoryChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
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
                    <label className="block text-sm font-medium mb-2">Room Type *</label>
                    <select
                      value={form.room_type_id}
                      onChange={handleRoomTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!form.property_type_id}
                    >
                      <option value="">Select Room Type</option>
                      {getFilteredRoomTypes().map(room => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Regular Price (AED) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price || ''}
                      onChange={handlePriceChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount Price (AED)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.discount_price || ''}
                      onChange={handleDiscountPriceChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={form.description}
                    onChange={handleDescriptionChange}
                    placeholder="Additional description for this pricing..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.is_special}
                      onChange={handleSpecialChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Special Offer</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={handleActiveChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={closeDialogs}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {isEditDialogOpen ? 'Update' : 'Create'} Pricing
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

export default ServicePricingManagement;
