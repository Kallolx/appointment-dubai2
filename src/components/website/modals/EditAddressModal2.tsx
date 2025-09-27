import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  ChevronRight,
  MapPin,
  Home,
  Building,
  User,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl } from "@/config/api";
import GoogleMapPicker from "@/components/ui/GoogleMapPicker";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

// Use Vite env variable for Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define interfaces for saved addresses
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

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onUpdate: (updatedData: any) => void;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onUpdate,
}) => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState("list"); // "list", "map", "form"
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [addressType, setAddressType] = useState("Apartment");
  const [addresses, setAddresses] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [loadingSavedAddresses, setLoadingSavedAddresses] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    nickname: "",
    city: "",
    area: "",
    address: "",
    apartmentNo: "",
    coordinates: null,
    isDefault: false,
  });

  const cities = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ];

  // Fetch saved addresses on component mount
  const fetchSavedAddresses = async () => {
    if (!token) {
      setInitialLoadComplete(true);
      return;
    }

    try {
      setLoadingSavedAddresses(true);
      const response = await axios.get(buildApiUrl("/api/user/addresses"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(response.data);

      // Try to match current address from orderData
      if (orderData?.location) {
        const currentLocation = orderData.location;
        if (typeof currentLocation === "object" && currentLocation.id) {
          setSelectedAddress(currentLocation);
        } else if (typeof currentLocation === "string") {
          try {
            const parsedLocation = JSON.parse(currentLocation);
            if (parsedLocation.id) {
              const matchedAddress = response.data.find(
                (addr) => addr.id === parsedLocation.id
              );
              if (matchedAddress) {
                setSelectedAddress(matchedAddress);
              }
            }
          } catch (e) {
            // If it's not JSON, it's probably a plain text address
          }
        }
      }
    } catch (error) {
      console.error("Error fetching saved addresses:", error);
    } finally {
      setLoadingSavedAddresses(false);
      setInitialLoadComplete(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSavedAddresses();
    }
  }, [isOpen, token]);

  // Auto-switch to map view if user has no saved addresses (only after initial load is complete)
  useEffect(() => {
    if (
      initialLoadComplete &&
      savedAddresses.length === 0 &&
      addresses.length === 0
    ) {
      setCurrentStep("map");
    }
  }, [initialLoadComplete, savedAddresses.length, addresses.length]);

  // Helper functions for address display (same as Step 2)
  const getAddressTypeIcon = (type: string) => {
    if (!type) return <User className="h-5 w-5" />;

    switch (type.toLowerCase()) {
      case "home":
        return <Home className="h-5 w-5" />;
      case "office":
      case "work":
        return <Building className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getAddressTypeColor = (type: string) => {
    if (!type) return "bg-gray-100 text-gray-800 border-gray-200";

    switch (type.toLowerCase()) {
      case "home":
        return "bg-green-100 text-green-800 border-green-200";
      case "office":
      case "work":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  }) => {
    setAddressForm((prev) => ({
      ...prev,
      city: location.city,
      area: location.area,
      address: location.address,
      coordinates: { lat: location.lat, lng: location.lng },
    }));

    setCurrentStep("form");
  };

  const handleAddNewAddress = () => {
    setCurrentStep("map");
  };

  const handleInputChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAddress = async () => {
    if (!addressForm.area || !addressForm.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingAddress(true);

      // Prepare address data for database
      const addressData = {
        address_type: addressType,
        address_line1: addressForm.address,
        address_line2: addressForm.apartmentNo || "",
        city: addressForm.city || "Dubai",
        state: addressForm.area,
        postal_code: "00000", // Default postal code
        country: "UAE",
        is_default: addressForm.isDefault,
      };

      // Save to database if user is authenticated
      if (token) {
        const response = await axios.post(
          buildApiUrl("/api/user/addresses"),
          addressData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Refresh saved addresses from server to get the complete address data
        await fetchSavedAddresses();

        // Find and select the newly saved address
        const newAddressId = response.data.address_id || response.data.id;
        if (newAddressId) {
          // Wait a moment for the state to update, then select the new address
          setTimeout(() => {
            setSavedAddresses((current) => {
              const newAddress = current.find(
                (addr) => addr.id === newAddressId
              );
              if (newAddress) {
                setSelectedAddress(newAddress);
              }
              return current;
            });
          }, 100);
        }
      } else {
        // For non-authenticated users, save locally
        const newAddress = {
          id: Date.now(),
          type: addressType,
          city: addressForm.city || "Dubai",
          area: addressForm.area,
          address: addressForm.address,
          apartmentNo: addressForm.apartmentNo,
          coordinates: addressForm.coordinates,
          displayName:
            addressType === "Other" ? addressForm.nickname : addressType,
        };

        setAddresses((prev) => [...prev, newAddress]);
        setSelectedAddress(newAddress);
      }

      // Reset form and go back to list
      setCurrentStep("list");
      setAddressForm({
        nickname: "",
        city: "",
        area: "",
        address: "",
        apartmentNo: "",
        coordinates: null,
        isDefault: false,
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (addressId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(
        buildApiUrl(`/api/user/addresses/${addressId}`),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSavedAddresses((prev) =>
          prev.filter((addr) => addr.id !== addressId)
        );
        if (selectedAddress?.id === addressId) {
          setSelectedAddress(null);
        }
        toast({
          title: "Success",
          description: "Address deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select an address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        buildApiUrl(`/api/user/appointments/${orderData.id}`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: JSON.stringify(selectedAddress),
          }),
        }
      );

      if (response.ok) {
        const updatedData = {
          ...orderData,
          location: selectedAddress,
        };
        onUpdate(updatedData);
        toast({
          title: "Success",
          description: "Address updated successfully!",
        });
        onClose();
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAddressForm = () => (
    <div className="space-y-4">
      {/* Address Type Selection - Horizontal Slider (same as Step 2) */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["Apartment", "Villa", "Office", "Other"].map((type) => (
          <button
            key={type}
            onClick={() => setAddressType(type)}
            className={`flex items-center scrollbar-hide gap-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap flex-shrink-0 ${
              addressType === type
                ? "bg-[#01788e] border-[#01788e] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type === "Apartment" && <Building className="w-4 h-4" />}
            {type === "Villa" && <Home className="w-4 h-4" />}
            {type === "Office" && <Building className="w-4 h-4" />}
            {type === "Other" && <User className="w-4 h-4" />}
            {type}
          </button>
        ))}
      </div>

      {/* Form Fields - Dynamic based on address type (same as Step 2) */}
      <div className="space-y-4">
        {/* Area Field - Always shown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area
          </label>
          <input
            type="text"
            value={addressForm.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            placeholder="Enter Area"
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Dynamic fields based on address type */}
        {addressType === "Apartment" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building Name
              </label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter Building Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment No.
              </label>
              <input
                type="text"
                value={addressForm.apartmentNo}
                onChange={(e) =>
                  handleInputChange("apartmentNo", e.target.value)
                }
                placeholder="Enter Apartment No."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </>
        )}

        {addressType === "Villa" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Community/Street Name
              </label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter Community/Street Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Villa No.
              </label>
              <input
                type="text"
                value={addressForm.apartmentNo}
                onChange={(e) =>
                  handleInputChange("apartmentNo", e.target.value)
                }
                placeholder="Enter Villa No."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </>
        )}

        {addressType === "Office" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building Name
              </label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter Building Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office No.
              </label>
              <input
                type="text"
                value={addressForm.apartmentNo}
                onChange={(e) =>
                  handleInputChange("apartmentNo", e.target.value)
                }
                placeholder="Enter Office No."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </>
        )}

        {addressType === "Other" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nick Name
              </label>
              <input
                type="text"
                value={addressForm.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="Enter Nick Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street/Building Name
              </label>
              <input
                type="text"
                value={addressForm.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter Street/Building Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment/Villa No.
              </label>
              <input
                type="text"
                value={addressForm.apartmentNo}
                onChange={(e) =>
                  handleInputChange("apartmentNo", e.target.value)
                }
                placeholder="Enter Apartment/Villa No."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Set as Default Checkbox */}
      {token && (
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={addressForm.isDefault}
            onChange={(e) => handleInputChange("isDefault", e.target.checked)}
            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={handleSaveAddress}
          disabled={savingAddress}
          className="w-full py-3 px-4 bg-orange-500 text-white font-bold rounded-sm hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {savingAddress ? "SAVING..." : "SAVE"}
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full mx-0 mb-0 sm:mx-4 sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentStep === "list"
              ? "Edit Address"
              : currentStep === "map"
              ? "Where do you need the service?"
              : "Add Address Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Same as Step 2 */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {!initialLoadComplete ? (
            <div className="p-4">
              <div className="flex justify-center items-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading addresses...</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* List View - Show saved addresses and add new button */}
              {currentStep === "list" && (
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-6">
                    Please select your current address or add a new address.
                  </p>

                  {/* Saved Addresses from Database */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {savedAddresses
                        .filter(
                          (address) =>
                            address.address_line1?.trim() &&
                            address.state?.trim() &&
                            address.city?.trim()
                        )
                        .map((address) => (
                          <div
                            key={`saved-${address.id}`}
                            onClick={() => setSelectedAddress(address)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              selectedAddress?.id === address.id &&
                              selectedAddress?.id
                                ? "border-teal-500 bg-teal-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-5 h-5 text-gray-600">
                                  <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">
                                      {address.address_type}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {address.address_line1}
                                    {address.address_line2 &&
                                      address.address_line2.trim() !== "" &&
                                      address.address_line2 !== "0" &&
                                      `, ${address.address_line2}`}
                                    , {address.state}, {address.city}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="address"
                                  value={address.id}
                                  checked={
                                    selectedAddress?.id === address.id &&
                                    selectedAddress?.id
                                  }
                                  onChange={() => setSelectedAddress(address)}
                                  className="w-4 h-4 text-teal-500 border-gray-300 focus:ring-teal-500"
                                />
                                <button
                                  onClick={(e) => deleteAddress(address.id, e)}
                                  className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Loading state for saved addresses */}
                  {loadingSavedAddresses && (
                    <div className="p-4 text-center text-gray-500">
                      Loading saved locations...
                    </div>
                  )}

                  {/* No valid addresses message */}
                  {!loadingSavedAddresses &&
                    savedAddresses.filter(
                      (address) =>
                        address.address_line1?.trim() &&
                        address.state?.trim() &&
                        address.city?.trim()
                    ).length === 0 &&
                    addresses.filter(
                      (address) =>
                        address.address && address.area && address.city
                    ).length === 0 && (
                      <div className="p-4 text-center text-gray-500 mb-6">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No saved addresses found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Add a new address to continue
                        </p>
                      </div>
                    )}

                  {/* Add New Address Button */}
                  <button
                    onClick={handleAddNewAddress}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 text-gray-600">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          Add New Address
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              )}

              {/* Map View - Show Google Map */}
              {currentStep === "map" && (
                <div className="p-4">
                  <div className="w-full h-[400px] md:h-[500px] border border-gray-300 rounded-lg overflow-hidden">
                    <GoogleMapPicker
                      apiKey={GOOGLE_MAPS_API_KEY}
                      onLocationSelect={handleLocationSelect}
                      onClose={() => setCurrentStep("list")}
                      inline={true}
                    />
                  </div>
                </div>
              )}

              {/* Form View - Show address form */}
              {currentStep === "form" && (
                <div className="p-6">{renderAddressForm()}</div>
              )}
            </>
          )}
        </div>

        {/* Footer - only show when in list view */}
        {currentStep === "list" && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !selectedAddress}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Saving..." : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditAddressModal;
