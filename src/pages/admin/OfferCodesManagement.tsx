import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, Percent, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { buildApiUrl } from '@/config/api';
import NewAdminLayout from './NewAdminLayout';

interface OfferCode {
  id: number;
  code: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order_amount: number;
  maximum_discount_amount: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  applicable_services: string;
  created_by_name: string;
  created_at: string;
}

const OfferCodesManagement: React.FC = () => {
  const [offerCodes, setOfferCodes] = useState<OfferCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferCode | null>(null);
  const [usageData, setUsageData] = useState([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minimumOrderAmount: '0',
    maximumDiscountAmount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    isActive: true,
    applicableServices: null
  });

  useEffect(() => {
    fetchOfferCodes();
  }, []);

  const fetchOfferCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/offer-codes'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOfferCodes(data.offers || []);
      } else {
        throw new Error('Failed to fetch offer codes');
      }
    } catch (error) {
      console.error('Error fetching offer codes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch offer codes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/offer-codes'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer code created successfully"
        });
        setShowCreateModal(false);
        resetForm();
        fetchOfferCodes();
      } else {
        throw new Error(data.message || 'Failed to create offer code');
      }
    } catch (error) {
      console.error('Error creating offer code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create offer code",
        variant: "destructive"
      });
    }
  };

  const handleUpdateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOffer) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/admin/offer-codes/${selectedOffer.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer code updated successfully"
        });
        setShowEditModal(false);
        setSelectedOffer(null);
        resetForm();
        fetchOfferCodes();
      } else {
        throw new Error(data.message || 'Failed to update offer code');
      }
    } catch (error) {
      console.error('Error updating offer code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update offer code",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this offer code?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/admin/offer-codes/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer code deleted successfully"
        });
        fetchOfferCodes();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete offer code');
      }
    } catch (error) {
      console.error('Error deleting offer code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer code",
        variant: "destructive"
      });
    }
  };

  const handleViewUsage = async (offer: OfferCode) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl(`/api/admin/offer-codes/${offer.id}/usage`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsageData(data.usage || []);
        setSelectedOffer(offer);
        setShowUsageModal(true);
      } else {
        throw new Error('Failed to fetch usage data');
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch usage data",
        variant: "destructive"
      });
    }
  };

  const handleEditOffer = (offer: OfferCode) => {
    setSelectedOffer(offer);
    setFormData({
      code: offer.code,
      name: offer.name,
      description: offer.description,
      discountType: offer.discount_type,
      discountValue: offer.discount_value.toString(),
      minimumOrderAmount: offer.minimum_order_amount.toString(),
      maximumDiscountAmount: offer.maximum_discount_amount?.toString() || '',
      usageLimit: offer.usage_limit?.toString() || '',
      startDate: new Date(offer.start_date).toISOString().slice(0, 16),
      endDate: new Date(offer.end_date).toISOString().slice(0, 16),
      isActive: offer.is_active,
      applicableServices: offer.applicable_services ? JSON.parse(offer.applicable_services) : null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minimumOrderAmount: '0',
      maximumDiscountAmount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      isActive: true,
      applicableServices: null
    });
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  const filteredOffers = offerCodes.filter(offer =>
    offer.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (offer: OfferCode) => {
    if (!offer.is_active) return 'bg-gray-100 text-gray-800';
    
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);
    
    if (now < startDate) return 'bg-blue-100 text-blue-800';
    if (now > endDate) return 'bg-red-100 text-red-800';
    if (offer.usage_limit && offer.used_count >= offer.usage_limit) return 'bg-orange-100 text-orange-800';
    
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (offer: OfferCode) => {
    if (!offer.is_active) return 'Inactive';
    
    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);
    
    if (now < startDate) return 'Scheduled';
    if (now > endDate) return 'Expired';
    if (offer.usage_limit && offer.used_count >= offer.usage_limit) return 'Used Up';
    
    return 'Active';
  };

  if (isLoading) {
    return (
      <NewAdminLayout title="Offer Codes" subtitle="Manage discount codes and promotions">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </NewAdminLayout>
    );
  }

  return (
    <NewAdminLayout title="Offer Codes" subtitle="Manage discount codes and promotions">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search offer codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Offer Code</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{offerCodes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Offers</p>
              <p className="text-2xl font-bold text-green-900">
                {offerCodes.filter(offer => {
                  const now = new Date();
                  const startDate = new Date(offer.start_date);
                  const endDate = new Date(offer.end_date);
                  return offer.is_active && now >= startDate && now <= endDate;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-900">
                {offerCodes.reduce((sum, offer) => sum + offer.used_count, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-red-900">
                {offerCodes.filter(offer => new Date(offer.end_date) < new Date()).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Offer Codes Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code & Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.code}</div>
                      <div className="text-sm text-gray-500">{offer.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {offer.discount_type === 'percentage' ? `${offer.discount_value}%` : `AED ${offer.discount_value}`}
                    </div>
                    {offer.minimum_order_amount > 0 && (
                      <div className="text-xs text-gray-500">Min: AED {offer.minimum_order_amount}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {offer.used_count} {offer.usage_limit ? `/ ${offer.usage_limit}` : '/ ∞'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(offer.start_date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {new Date(offer.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer)}`}>
                      {getStatusText(offer)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUsage(offer)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Usage"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditOffer(offer)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <Percent className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No offer codes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new offer code.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-3 border-b">
              <h3 className="text-lg font-medium">
                {showCreateModal ? 'Create Offer' : 'Edit Offer'}
              </h3>
            </div>
            
            <form onSubmit={showCreateModal ? handleCreateOffer : handleUpdateOffer} className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SAVE20"
                    maxLength={20}
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-2 text-xs bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20% Off"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                    step="0.01"
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (AED)</label>
                  <input
                    type="number"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Active</label>
              </div>
              
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setSelectedOffer(null);
                    resetForm();
                  }}
                  className="px-3 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {showCreateModal ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage Modal */}
      {showUsageModal && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Usage Statistics - {selectedOffer.code}
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">{selectedOffer.used_count}</div>
                    <div className="text-sm text-blue-600">Total Uses</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">
                      AED {usageData.reduce((sum, usage) => sum + usage.discount_amount, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600">Total Savings</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">
                      AED {usageData.reduce((sum, usage) => sum + usage.order_amount, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-purple-600">Total Order Value</div>
                  </div>
                </div>
              </div>
              
              {usageData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Order Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Discount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Service
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Date Used
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {usageData.map((usage, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <div>
                              <div className="font-medium text-gray-900">{usage.user_name}</div>
                              <div className="text-sm text-gray-500">{usage.user_phone}</div>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            AED {usage.order_amount}
                          </td>
                          <td className="px-4 py-2 text-sm text-green-600 font-medium">
                            AED {usage.discount_amount}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {usage.appointment_service || 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {new Date(usage.used_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No usage yet</h3>
                  <p className="mt-1 text-sm text-gray-500">This offer code hasn't been used by any customers.</p>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowUsageModal(false);
                    setSelectedOffer(null);
                    setUsageData([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NewAdminLayout>
  );
};

export default OfferCodesManagement;