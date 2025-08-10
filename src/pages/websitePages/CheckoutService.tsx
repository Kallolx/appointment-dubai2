/* eslint-disable @typescript-eslint/no-explicit-any */
import StepFour from "@/components/website/Steps/StepFour";
import StepOne from "@/components/website/Steps/StepOne";
import StepThree from "@/components/website/Steps/StepThree";
import StepTwo from "@/components/website/Steps/StepTwo";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calculation from "./Calculation";

interface Service {
  id: string;
  name: string;
  price: number;
  [key: string]: any;
}

interface CartItem extends Service {
  count: number;
}

interface SelectedDateTime {
  professional: string | null;
  date: string | null;
  time: string | null;
}

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

const CheckoutService = ({ category }) => {
  const [step, setStep] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>({});
  const [selectedDateTime, setSelectedDateTime] = useState<SelectedDateTime>({
    professional: null,
    date: null,
    time: null,
  });
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    "United Arab Emirates"
  );
  const [countrySearch, setCountrySearch] = useState("");

  const toggleCountryDrawer = () => {
    setIsCountryDrawerOpen(!isCountryDrawerOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country.name);
    setIsCountryDrawerOpen(false);
  };

  const navigate = useNavigate();

  const handleAddItemsClick = (service: Service) => {
    setCartItems((prev) => {
      const existing = prev[service.id];
      const count = existing ? existing.count + 1 : 1;
      return {
        ...prev,
        [service.id]: { ...service, count },
      };
    });
  };

  const handleRemoveItemClick = (serviceId: string) => {
    setCartItems((prev) => {
      const existing = prev[serviceId];
      if (!existing) return prev;
      const count = existing.count - 1;
      if (count <= 0) {
        const { [serviceId]: removed, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [serviceId]: { ...existing, count },
      };
    });
  };

  const hasItems = Object.keys(cartItems).length > 0;

  const nextStep = () => {
    if (step === 3) setShowModal(true);
    else setStep((prev) => Math.min(prev + 1, 4));
  };

  const confirmModalAndProceed = () => {
    setShowModal(false);
    setStep(4);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    if (step === 1) {
      navigate("/");
    }
  };

  const handleSelectionChange = (selection: SelectedDateTime) => {
    setSelectedDateTime(selection);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            handleAddItemsClick={handleAddItemsClick}
            handleRemoveItemClick={handleRemoveItemClick}
            cartItems={cartItems}
            specialCategory={category}
          />
        );
      case 2:
        return (
          <StepTwo
            handleAddItemsClick={handleAddItemsClick}
            handleRemoveItemClick={handleRemoveItemClick}
            cartItems={cartItems}
            onSelectionChange={handleSelectionChange}
          />
        );
      case 3:
        return <StepThree onSelectionChange={handleSelectionChange} />;
      case 4:
        return <StepFour />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FAFAFA]">
      <section className="w-full max-w-[1100px] mx-auto py-16 gap-10 flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-full md:basis-[60%] md:max-w-[60%] min-w-0 px- md:px-0">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 mb-4 pt-4 px-4 md:px-0"
          >
            <ArrowLeft className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Step {step} of 4</h2>
          </button>

          <h2 className="font-bold text-2xl my-3 px-4 md:px-0">
            {step === 1
              ? `${category}`
              : step === 2
              ? "Popular Add-ons"
              : "Date & Time"}
          </h2>

          <div className="bg-white rounded shadow md:p-6 relative min-h-[400px]">
            {renderStep()}
            {step < 4 && (
              <div className="absolute bottom-0 left-0 w-full px-6">
                <div className="bg-white rounded-lg py-6 hidden md:block">
                  <button
                    onClick={nextStep}
                    disabled={!hasItems}
                    className={`bg-yellow-400 py-3 rounded-full text-white font-bold w-full ${
                      !hasItems
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-yellow-500"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block md:basis-[40%] md:max-w-[40%] min-w-0 py-28">
          <Calculation
            cartItems={cartItems}
            selectedDateTime={selectedDateTime}
            nextStep={nextStep}
            hasItems={hasItems}
          />
        </div>
      </section>

      {/* Mobile Bottom Drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-40">
        <div className="px-4 py-4">
          <Calculation
            cartItems={cartItems}
            selectedDateTime={selectedDateTime}
            nextStep={nextStep}
            hasItems={hasItems}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Login or Sign Up</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <hr className="border-gray-300 mb-10" />

            <p className="text-gray-400 mb-3">Your Phone Number</p>
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
                    {
                      countries.find((c) => c.name === selectedCountry)
                        ?.dial_code
                    }
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
                type="number"
                className="rounded w-full p-3 border border-gray-300 focus:outline-none"
                placeholder="50 123 45 67"
              />
            </div>

            <hr className="border-gray-300 mb-3" />

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmModalAndProceed}
                disabled={true}
                className="px-6 py-2 rounded-full w-full text-white bg-yellow-300 cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutService;
