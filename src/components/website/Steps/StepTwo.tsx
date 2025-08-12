import { useState, useEffect } from "react";
import { Plus, ChevronRight, MapPin, Home, Building, User } from "lucide-react";

const StepTwo = ({
  handleAddItemsClick,
  handleRemoveItemClick,
  cartItems,
  onSelectionChange,
}) => {
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressType, setAddressType] = useState("Home");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    nickname: "",
    city: "",
    area: "",
    address: "",
    apartmentNo: ""
  });

  const cities = [
    "Dubai",
    "Abu Dhabi", 
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain"
  ];

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        address: selectedAddress,
      });
    }
  }, [selectedAddress, onSelectionChange]);

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
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
        }));
        alert("Location detected! Please review and complete the address details.");
      },
      (error) => {
        alert("Unable to retrieve your location. Please enter address manually.");
      }
    );
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
    setShowAddAddress(false);
    setAddressForm({
      nickname: "",
      city: "",
      area: "",
      address: "",
      apartmentNo: ""
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
            onClick={handleDetectLocation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Detect Location
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setShowAddAddress(false)}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Where do you need the Service?
        </h2>
        <p className="text-gray-600 mb-6">
          Please select your address or add a new address
        </p>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-3 mb-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => setSelectedAddress(address)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddress?.id === address.id
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
                    selectedAddress?.id === address.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}>
                    {selectedAddress?.id === address.id && (
                      <div className="w-full h-full rounded-full bg-white m-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Address Button or Form */}
        {!showAddAddress ? (
          <button
            onClick={() => setShowAddAddress(true)}
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
        ) : (
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
            {renderAddressForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
