import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSidebar } from '@/pages/users/UserSidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Building, MapPin, Edit, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface Address {
  id: number;
  address_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
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

const initialFormData: AddressFormData = {
  address_type: 'home',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'United States',
  is_default: false
};

const MyAddresses: React.FC = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [currentAddressId, setCurrentAddressId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/api/user/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_default: checked }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentAddressId(null);
  };

  const handleAddAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      
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

      await axios.post('/api/user/addresses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Address added successfully",
        variant: "default"
      });
      setIsAddDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive"
      });
    }
  };

  const handleEditAddress = (address: Address) => {
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
      if (!currentAddressId) return;

      const token = localStorage.getItem('token');
      
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

      await axios.put(`/api/user/addresses/${currentAddressId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Address updated successfully",
        variant: "default"
      });
      setIsEditDialogOpen(false);
      resetForm();
      fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      toast({
        title: "Error",
        description: "Failed to update address",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`/api/user/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Address deleted successfully",
        variant: "default"
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(`/api/user/addresses/${id}`, { is_default: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Success",
        description: "Default address updated",
        variant: "default"
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive"
      });
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="h-5 w-5 text-primary" />;
      case 'work':
        return <Building className="h-5 w-5 text-primary" />;
      default:
        return <MapPin className="h-5 w-5 text-primary" />;
    }
  };

  const renderAddressCard = (address: Address) => {
    return (
      <Card key={address.id} className={`mb-4 ${address.is_default ? 'border-primary' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getAddressTypeIcon(address.address_type)}
              <CardTitle className="text-lg capitalize">{address.address_type}</CardTitle>
            </div>
            {address.is_default && <Badge>Default</Badge>}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-1">
            <p>{address.address_line1}</p>
            {address.address_line2 && <p>{address.address_line2}</p>}
            <p>{address.city}, {address.state} {address.postal_code}</p>
            <p>{address.country}</p>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditAddress(address)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDeleteAddress(address.id)}
              className="text-red-500 border-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
          {!address.is_default && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleSetDefault(address.id)}
            >
              Set as Default
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  const renderAddressForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="address_type">Address Type</Label>
        <Select 
          value={formData.address_type} 
          onValueChange={(value) => handleSelectChange('address_type', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select address type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address_line1">Address Line 1 *</Label>
        <Input 
          id="address_line1" 
          name="address_line1" 
          value={formData.address_line1} 
          onChange={handleInputChange} 
          placeholder="Street address"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address_line2">Address Line 2</Label>
        <Input 
          id="address_line2" 
          name="address_line2" 
          value={formData.address_line2} 
          onChange={handleInputChange} 
          placeholder="Apartment, suite, unit, etc. (optional)"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City *</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State/Province *</Label>
          <Input 
            id="state" 
            name="state" 
            value={formData.state} 
            onChange={handleInputChange} 
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="postal_code">Postal Code *</Label>
          <Input 
            id="postal_code" 
            name="postal_code" 
            value={formData.postal_code} 
            onChange={handleInputChange} 
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            name="country" 
            value={formData.country} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="is_default" 
          checked={formData.is_default} 
          onCheckedChange={handleCheckboxChange} 
        />
        <Label htmlFor="is_default">Set as default address</Label>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <UserSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="h-16 border-b border-border bg-white shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 lg:px-6 h-full">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-foreground">My Addresses</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Manage your saved addresses
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 lg:p-6 space-y-6 bg-secondary/30">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
                <p className="text-muted-foreground">Manage your saved addresses</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new address to your account.
                    </DialogDescription>
                  </DialogHeader>
                  {renderAddressForm()}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddAddress}>Save Address</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading addresses...</p>
              </div>
            ) : addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map(address => renderAddressCard(address))}
              </div>
            ) : (
              <div className="text-center py-10 border rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No addresses saved</h3>
                <p className="text-muted-foreground mt-1">Add an address to get started</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add New Address
                </Button>
              </div>
            )}
          </div>

          {/* Edit Address Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Address</DialogTitle>
                <DialogDescription>
                  Update your address details below.
                </DialogDescription>
              </DialogHeader>
              {renderAddressForm()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdateAddress}>Update Address</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MyAddresses;