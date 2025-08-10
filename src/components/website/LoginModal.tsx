import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const countries = [
  { name: "United Arab Emirates", code: "ae", dial_code: "+971" },
  { name: "Saudi Arabia", code: "sa", dial_code: "+966" },
  { name: "Qatar", code: "qa", dial_code: "+974" },
  { name: "Kuwait", code: "kw", dial_code: "+965" },
  { name: "Bahrain", code: "bh", dial_code: "+973" },
  { name: "Oman", code: "om", dial_code: "+968" },
  { name: "India", code: "in", dial_code: "+91" },
  { name: "Bangladesh", code: "bd", dial_code: "+880" },
  { name: "Pakistan", code: "pk", dial_code: "+92" },
  { name: "Egypt", code: "eg", dial_code: "+20" },
  { name: "Jordan", code: "jo", dial_code: "+962" },
  { name: "Lebanon", code: "lb", dial_code: "+961" },
  { name: "Turkey", code: "tr", dial_code: "+90" },
  { name: "Philippines", code: "ph", dial_code: "+63" },
  { name: "Indonesia", code: "id", dial_code: "+62" },
  { name: "Malaysia", code: "my", dial_code: "+60" },
  { name: "Nepal", code: "np", dial_code: "+977" },
  { name: "Sri Lanka", code: "lk", dial_code: "+94" },
  { name: "Afghanistan", code: "af", dial_code: "+93" },
];

const LoginModal = ({ setLoginModalOpen }) => {
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    "United Arab Emirates"
  );
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Add validation for phone number format
  const validatePhoneNumber = (number) => {
    // Remove any non-digit characters
    const digitsOnly = number.replace(/\D/g, '');
    return digitsOnly.length >= 8;
  };

  const toggleCountryDrawer = () => {
    setIsCountryDrawerOpen(!isCountryDrawerOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country.name);
    setIsCountryDrawerOpen(false);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    // Enable button only if phone number passes validation
    setIsButtonDisabled(!validatePhoneNumber(value));
  };

  const handleContinue = async () => {
    // Validate phone number before proceeding
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with at least 8 digits",
        variant: "destructive"
      });
      return;
    }
    
    // Get the selected country dial code
    const dialCode = countries.find((c) => c.name === selectedCountry)?.dial_code || "+971";
    
    // Format the full phone number with country code
    const fullPhoneNumber = `${dialCode}${phoneNumber}`;
    
    setIsLoading(true);
    
    try {
      // Make API call to check if phone exists
      const response = await fetch('http://localhost:3001/api/auth/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhoneNumber })
      });
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (response.ok) {
        if (data.exists) {
          // Phone exists, redirect to login page
          window.location.href = `/login?phone=${encodeURIComponent(fullPhoneNumber)}`;
        } else {
          // Phone doesn't exist, redirect to signup page
          window.location.href = `/login?phone=${encodeURIComponent(fullPhoneNumber)}&new=true`;
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[100]">
      {/* Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[100]">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative z-[110]" style={{ position: 'relative', zIndex: 110 }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Login or Sign Up</h2>
            <button
              onClick={() => setLoginModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          <hr className="border-gray-300 mb-10" />

          <p className="text-gray-400">Your Phone Number</p>
          <div className="flex items-center mb-4 gap-3">
            {/* Country Selector */}
            <div
              className="relative flex items-center gap-2 cursor-pointer"
              onClick={toggleCountryDrawer}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <img
                  src={`https://flagcdn.com/w40/${
                    countries.find((c) => c.name === selectedCountry)?.code ||
                    "ae"
                  }.png`}
                  className="w-6 h-6 object-cover rounded-full"
                />
                <p>
                  {countries.find((c) => c.name === selectedCountry)?.dial_code}
                </p>
              </div>
              {isCountryDrawerOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
              {isCountryDrawerOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end md:items-center z-50">
                  <div
                    className="bg-white w-full md:w-[400px] h-screen rounded-t-2xl md:rounded-lg overflow-auto p-4 animate-slideUp"
                    onClick={(e) => e.stopPropagation()} // Prevent closing by background click
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">Select Country</h2>
                      <button
                        onClick={toggleCountryDrawer}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search Country..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>

                    <ul className="space-y-2">
                      {countries
                        .filter((country) =>
                          country.name
                            .toLowerCase()
                            .includes(countrySearch.toLowerCase())
                        )
                        .map((country) => (
                          <li
                            key={country.code}
                            className={`flex items-center p-3 rounded-lg cursor-pointer ${
                              selectedCountry === country.name
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => selectCountry(country)}
                          >
                            <img
                              src={`https://flagcdn.com/w40/${country.code}.png`}
                              className="w-6 h-6 mr-3 rounded-full"
                            />
                            {country.name}({country.dial_code})
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <input
              type="tel"
              className="rounded w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="50 123 45 67"
              value={phoneNumber}
              onChange={handlePhoneChange}
              style={{ position: 'relative', zIndex: 40 }}
              maxLength={15}
              autoFocus
            />
          </div>

          <hr className="border-gray-300 mb-3" />

          <div className="flex justify-center gap-4">
            <button
              onClick={handleContinue}
              disabled={isButtonDisabled || isLoading}
              className={`px-6 py-2 rounded-full w-full text-white font-medium ${isButtonDisabled || isLoading ? 'bg-yellow-300 opacity-70 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'}`}
              style={{ position: 'relative', zIndex: 50 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
