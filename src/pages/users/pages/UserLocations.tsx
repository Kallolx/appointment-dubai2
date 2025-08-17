import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, Home, Building, User, Star, Navigation, X } from 'lucide-react';
import GoogleMapPicker from "@/components/ui/GoogleMapPicker";
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import NewUserLayout from "../NewUserLayout";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface UserAddress {
  id: number;
  user_id: number;
  address_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface AddressFormData {
  address_type: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

const UserLocations: React.FC = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("form"); // "form", "map"
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);

  const [formData, setFormData] = useState<AddressFormData>({
    address_type: 'Home',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'UAE',
    is_default: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(buildApiUrl('/api/user/addresses'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load saved locations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      address_type: 'Home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'UAE',
      is_default: false
    });
    setCurrentStep("form");
    setCurrentAddressId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address_line1: location.address,
      city: location.city,
      state: location.area || location.city
    }));
    setShowMapPicker(false);
    setCurrentStep("form");
  };

  const handleAddAddress = async () => {
    try {
      setSaveLoading(true);
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate form
      if (!formData.address_line1 || !formData.city || !formData.state || !formData.postal_code) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }

      await axios.post(buildApiUrl('/api/user/addresses'), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Address added successfully"
      });
      
      setIsAddDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add address",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditAddress = (address: UserAddress) => {
    setFormData({
      address_type: address.address_type,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default
    });
    setCurrentAddressId(address.id);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAddress = async () => {
    try {
      setSaveLoading(true);
      
      if (!token || !currentAddressId) {
        navigate('/login');
        return;
      }

      // Validate form
      if (!formData.address_line1 || !formData.city || !formData.state || !formData.postal_code) {
        toast({
          title: "Error",
          description: "Please fill all required fields",
          variant: "destructive"
        });
        return;
      }

      await axios.put(buildApiUrl(`/api/user/addresses/${currentAddressId}`), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Address updated successfully"
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error: any) {
      console.error('Error updating address:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update address",
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      setDeleteLoading(true);
      
      if (!token || !currentAddressId) {
        navigate('/login');
        return;
      }

      await axios.delete(buildApiUrl(`/api/user/addresses/${currentAddressId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Address deleted successfully"
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentAddressId(null);
      fetchAddresses();
    } catch (error: any) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete address",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'office':
      case 'work':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return "bg-green-100 text-green-800 border-green-200";
      case 'office':
      case 'work':
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatFullAddress = (address: UserAddress) => {
    const parts = [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.postal_code,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  if (loading) {
    return (
      <NewUserLayout
        title="Saved Locations"
        subtitle="Manage your saved addresses"
      >
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading addresses...</p>
          </div>
        </div>
      </NewUserLayout>
    );
  }

  return (
    <NewUserLayout
      title="Saved Locations"
      subtitle="Manage your saved addresses"
    >
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              Add and manage your frequently used addresses for faster booking
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved locations</h3>
              <p className="text-gray-500 mb-6">Add your frequently used addresses to make booking faster and easier</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Location
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                        {getAddressTypeIcon(address.address_type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{address.address_type}</h3>
                          <Badge className={getAddressTypeColor(address.address_type)}>
                            {address.address_type}
                          </Badge>
                          {address.is_default && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-gray-700 font-medium">{address.address_line1}</p>
                          {address.address_line2 && (
                            <p className="text-gray-600">{address.address_line2}</p>
                          )}
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAddress(address)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentAddressId(address.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Address Dialog - Hide when map picker is open */}
        <Dialog open={isAddDialogOpen && !showMapPicker} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Add a new address to your saved locations for faster booking.
              </DialogDescription>
            </DialogHeader>
            
            {currentStep === "form" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address_type">Location Type</Label>
                  <Select value={formData.address_type} onValueChange={(value) => handleSelectChange('address_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line1">Address Line 1 *</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="address_line1" 
                      name="address_line1" 
                      value={formData.address_line1} 
                      onChange={handleInputChange}
                      placeholder="Street address, building name"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMapPicker(true)}
                      className="px-3"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input 
                    id="address_line2" 
                    name="address_line2" 
                    value={formData.address_line2} 
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Area *</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange}
                      placeholder="State or Area"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code *</Label>
                    <Input 
                      id="postal_code" 
                      name="postal_code" 
                      value={formData.postal_code} 
                      onChange={handleInputChange}
                      placeholder="Postal/ZIP code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UAE">United Arab Emirates</SelectItem>
                        <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                        <SelectItem value="Qatar">Qatar</SelectItem>
                        <SelectItem value="Kuwait">Kuwait</SelectItem>
                        <SelectItem value="Bahrain">Bahrain</SelectItem>
                        <SelectItem value="Oman">Oman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_default" className="text-sm">
                    Set as default address
                  </Label>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
                disabled={saveLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddAddress}
                disabled={saveLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saveLoading ? "Saving..." : "Save Location"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Address Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Update your saved location details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_address_type">Location Type</Label>
                <Select value={formData.address_type} onValueChange={(value) => handleSelectChange('address_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_address_line1">Address Line 1 *</Label>
                <div className="flex gap-2">
                  <Input 
                    id="edit_address_line1" 
                    name="address_line1" 
                    value={formData.address_line1} 
                    onChange={handleInputChange}
                    placeholder="Street address, building name"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMapPicker(true)}
                    className="px-3"
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_address_line2">Address Line 2</Label>
                <Input 
                  id="edit_address_line2" 
                  name="address_line2" 
                  value={formData.address_line2} 
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_city">City *</Label>
                  <Input 
                    id="edit_city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_state">State/Area *</Label>
                  <Input 
                    id="edit_state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange}
                    placeholder="State or Area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_postal_code">Postal Code *</Label>
                  <Input 
                    id="edit_postal_code" 
                    name="postal_code" 
                    value={formData.postal_code} 
                    onChange={handleInputChange}
                    placeholder="Postal/ZIP code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UAE">United Arab Emirates</SelectItem>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="Qatar">Qatar</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                      <SelectItem value="Bahrain">Bahrain</SelectItem>
                      <SelectItem value="Oman">Oman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_default"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit_is_default" className="text-sm">
                  Set as default address
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
                disabled={saveLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateAddress}
                disabled={saveLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saveLoading ? "Updating..." : "Update Location"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Google Map Picker */}
        {/* Google Map Picker - Use the standalone component */}
        {showMapPicker && GOOGLE_MAPS_API_KEY && (
          <GoogleMapPicker
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowMapPicker(false)}
            apiKey={GOOGLE_MAPS_API_KEY}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Location</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this saved location? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCurrentAddressId(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAddress}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </NewUserLayout>
  );
};

export default UserLocations;
