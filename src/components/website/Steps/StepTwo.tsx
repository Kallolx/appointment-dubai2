import { useState, useEffect, useRef } from "react";
// Use Vite env variable for Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import { Plus, ChevronRight, MapPin, Home, Building, User, ArrowLeft, Star } from "lucide-react";
import GoogleMapPicker from "../../ui/GoogleMapPicker";
import { useAuth } from "@/contexts/AuthContext";
import axios from 'axios';

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

const StepTwo = ({
  handleAddItemsClick,
  handleRemoveItemClick,
  cartItems,
  onSelectionChange,
}) => {
  const { token } = useAuth();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [currentStep, setCurrentStep] = useState("list"); // "list", "map", "form"
  const [addressType, setAddressType] = useState("Home");
  const [addresses, setAddresses] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [loadingSavedAddresses, setLoadingSavedAddresses] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    nickname: "",
    city: "",
    area: "",
    address: "",
    apartmentNo: "",
    coordinates: null
  });

  // Google Maps API Key from env
  // (already imported at top)

  // Use ref to store the latest callback to avoid infinite loops
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  const cities = [
    "Dubai",
    "Abu Dhabi", 
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain"
  ];

  // Fetch saved addresses on component mount
  const fetchSavedAddresses = async () => {
    if (!token) return;
    
    try {
      setLoadingSavedAddresses(true);
      const response = await axios.get('http://localhost:3001/api/user/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedAddresses(response.data);
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    } finally {
      setLoadingSavedAddresses(false);
    }
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, [token]);

  // Helper functions for address display
  const getAddressTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'office':
      case 'work':
        return <Building className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
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

  useEffect(() => {
    if (onSelectionChangeRef.current) {
      onSelectionChangeRef.current({
        address: selectedAddress,
      });
    }
  }, [selectedAddress]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you'd reverse geocode these coordinates
        const { latitude, longitude } = position.coords;
        setAddressForm(prev => ({
          ...prev,
          city: "Dubai",
          area: "Detected Area",
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          coordinates: { lat: latitude, lng: longitude }
        }));
        alert("Location detected! Please review and complete the address details.");
      },
      (error) => {
        alert("Unable to retrieve your location. Please enter address manually.");
      }
    );
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  }) => {
    setAddressForm(prev => ({
      ...prev,
      city: location.city,
      area: location.area,
      address: location.address,
      coordinates: { lat: location.lat, lng: location.lng }
    }));
    setCurrentStep("form");
  };

  const handleAddNewAddress = () => {
    setCurrentStep("map");
  };

  const handleInputChange = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAddress = () => {
    if (!addressForm.city || !addressForm.area || !addressForm.address) {
      alert("Please fill in all required fields.");
      return;
    }

    const newAddress = {
      id: Date.now(),
      type: addressType,
      ...addressForm,
      displayName: addressType === "Other" ? addressForm.nickname : addressType
    };

    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    setCurrentStep("list");
    setAddressForm({
      nickname: "",
      city: "",
      area: "",
      address: "",
      apartmentNo: "",
      coordinates: null
    });
  };

  const renderAddressForm = () => (
    <div className="space-y-4">
      {/* Address Type Selection */}
      <div className="flex gap-2 mb-4">
        {["Home", "Office", "Other"].map((type) => (
          <button
            key={type}
            onClick={() => setAddressType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              addressType === type
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type === "Home" && <Home className="w-4 h-4" />}
            {type === "Office" && <Building className="w-4 h-4" />}
            {type === "Other" && <User className="w-4 h-4" />}
            {type}
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addressType === "Other" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nickname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={addressForm.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              placeholder="e.g., Friend's House"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={addressForm.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={addressForm.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            placeholder="e.g., Marina, Downtown"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address/Building Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={addressForm.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="e.g., Marina Plaza, Building Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment/Villa No
          </label>
          <input
            type="text"
            value={addressForm.apartmentNo}
            onChange={(e) => handleInputChange("apartmentNo", e.target.value)}
            placeholder="e.g., 1205, Villa 23"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setCurrentStep("map")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Select on Map
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setCurrentStep("list")}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAddress}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Address
        </button>
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="max-w-2xl">
        {/* Header with back button for map and form views */}
        {currentStep !== "list" && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCurrentStep(currentStep === "form" ? "map" : "list")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentStep === "map" ? "Select Location on Map" : "Add New Address"}
            </h2>
          </div>
        )}

        {/* Main header for list view */}
        {currentStep === "list" && (
          <>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Where do you need the Service?
            </h2>
            <p className="text-gray-600 mb-6">
              Please select your address or add a new address
            </p>
          </>
        )}

        {/* List View - Show saved addresses and add new button */}
        {currentStep === "list" && (
          <>
            {/* Saved Addresses from Database */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Saved Locations</h3>
                {savedAddresses.map((address) => (
                  <div
                    key={`saved-${address.id}`}
                    onClick={() => setSelectedAddress(address)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress?.id === address.id && selectedAddress?.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                          {getAddressTypeIcon(address.address_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{address.address_type}</span>
                            {address.is_default && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full text-xs">
                                <Star className="h-3 w-3" />
                                Default
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.address_line1}
                            {address.address_line2 && address.address_line2.trim() !== '' && address.address_line2 !== '0' && 
                              `, ${address.address_line2}`
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state}
                            {address.postal_code && address.postal_code.trim() !== '' && address.postal_code !== '0' && 
                              ` ${address.postal_code}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAddress?.id === address.id && selectedAddress?.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
                        {selectedAddress?.id === address.id && selectedAddress?.id && (
                          <div className="w-full h-full rounded-full bg-white m-0.5"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Locally Added Addresses (from current session) */}
            {addresses.length > 0 && (
              <div className="space-y-3 mb-6">
                {savedAddresses.length > 0 && <h3 className="text-sm font-medium text-gray-900 mb-3">Recently Added</h3>}
                {addresses.map((address) => (
                  <div
                    key={`local-${address.id}`}
                    onClick={() => setSelectedAddress(address)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress?.id === address.id && !selectedAddress?.user_id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {address.type === "Home" && <Home className="w-4 h-4 text-gray-600" />}
                          {address.type === "Office" && <Building className="w-4 h-4 text-gray-600" />}
                          {address.type === "Other" && <User className="w-4 h-4 text-gray-600" />}
                          <span className="font-medium text-gray-900">{address.displayName}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.address}, {address.area}, {address.city}
                          {address.apartmentNo && ` - ${address.apartmentNo}`}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedAddress?.id === address.id && !selectedAddress?.user_id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}>
                        {selectedAddress?.id === address.id && !selectedAddress?.user_id && (
                          <div className="w-full h-full rounded-full bg-white m-0.5"></div>
                        )}
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

            {/* Add New Address Button */}
            <button
              onClick={handleAddNewAddress}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-400 group-hover:border-blue-500 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                    Add new address
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
              </div>
            </button>
          </>
        )}

        {/* Map View - Show Google Map inline */}
        {currentStep === "map" && (
          <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
            <GoogleMapPicker
              apiKey={GOOGLE_MAPS_API_KEY}
              onLocationSelect={handleLocationSelect}
              onClose={() => setCurrentStep("list")}
              inline={true}
            />
          </div>
        )}

        {/* Form View - Show address form */}
        {currentStep === "form" && (
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            {renderAddressForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
