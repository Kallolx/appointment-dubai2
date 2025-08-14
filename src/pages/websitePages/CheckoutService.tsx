/* eslint-disable @typescript-eslint/no-explicit-any */
import StepFour from "@/components/website/Steps/StepFour";
import StepOne from "@/components/website/Steps/StepOne";
import StepThree from "@/components/website/Steps/StepThree";
import StepTwo from "@/components/website/Steps/StepTwo";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calculation from "./Calculation";

interface Service {
  id: string;
  name: string;
  price: number;
  [key: string]: any;
}

interface CartItem {
  service: Service;
  count: number;
}

interface SelectedDateTime {
  professional: string | null;
  date: string | null;
  time: string | null;
}

interface SelectedAddress {
  id: number;
  type: string;
  displayName: string;
  address: string;
  area: string;
  city: string;
  apartmentNo?: string;
}

const CheckoutService = ({ category }) => {
  const [step, setStep] = useState<number>(1);
  const [cartItems, setCartItems] = useState<Record<string, CartItem>>({});
  const [selectedDateTime, setSelectedDateTime] = useState<SelectedDateTime>({
    professional: null,
    date: null,
    time: null,
  });
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);

  const cartItemsArray = Object.values(cartItems).filter(item => item.count > 0);
  const subtotal = cartItemsArray.reduce((total, item) => {
    return total + (item.service.price * item.count);
  }, 0);
  const discount = 0; // You can implement discount logic here
  const totalToPay = subtotal - discount;
  const monthlyInstallment = (totalToPay / 4).toFixed(2);

  const navigate = useNavigate();

  const handleAddItemsClick = (service: Service) => {
    setCartItems((prev) => {
      const existing = prev[service.id];
      const count = existing ? existing.count + 1 : 1;
      return {
        ...prev,
        [service.id]: { service, count },
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

  // Transform cartItems to match ServiceItem interface for Calculation component
  const transformedCartItems = Object.fromEntries(
    Object.entries(cartItems).map(([key, item]) => [
      key,
      {
        id: item.service.id,
        title: item.service.name,
        count: item.count,
        currentPrice: item.service.price,
      }
    ])
  );

  const hasItems = Object.keys(cartItems).length > 0;

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
    // Scroll to top when moving to next step
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    if (step === 1) {
      navigate("/");
    }
    // Scroll to top when moving to previous step
    window.scrollTo(0, 0);
  };

  const goToStep = (targetStep: number) => {
    // Only allow navigation to steps that are accessible
    if (targetStep <= step || targetStep === 1) {
      setStep(targetStep);
      // Scroll to top when navigating to any step
      window.scrollTo(0, 0);
    }
  };

  const handleSelectionChange = (selection: any) => {
    if (selection.address) {
      setSelectedAddress(selection.address);
    }
    if (selection.date || selection.time || selection.professional) {
      setSelectedDateTime(prev => ({
        ...prev,
        ...selection
      }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            handleAddItemsClick={handleAddItemsClick}
            handleRemoveItemClick={handleRemoveItemClick}
            cartItems={cartItems}
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
        return (
          <StepFour 
            cartItems={cartItemsArray}
            selectedDateTime={selectedDateTime}
            subtotal={subtotal}
            selectedAddress={selectedAddress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Step Progress Header - Hidden on Mobile */}
      <div className="py-4 px-4 md:px-0 hidden md:block">
        <div className="w-full max-w-[1100px] mx-auto">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {step === 1 ? "Service Details" : step === 2 ? "Address" : step === 3 ? "Date & Time" : "Review & Confirm"}
            </h1>
          </div>

          {/* Horizontal Progress Steps */}
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4].map((stepNum, index) => (
              <div key={stepNum} className="flex items-center">
                <div
                  onClick={() => goToStep(stepNum)}
                  className={`h-2 w-32 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    stepNum <= step ? "bg-teal-600 w-16" : "bg-gray-300 w-12"
                  } ${stepNum <= step || stepNum === 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                  title={`Go to step ${stepNum}`}
                ></div>
                {index < 3 && <div className="w-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="w-full max-w-[1000px] mx-auto py-4 gap-10 flex flex-col md:flex-row relative pb-24">
        {/* Conditional Layout for Step 4 */}
        {step === 4 ? (
          <div className="w-full flex justify-center">
            <div className="bg-white rounded shadow md:p-6 max-w-2xl w-full">
              {renderStep()}
            </div>
          </div>
        ) : (
          <>
            {/* Left Section for Steps 1-3 */}
            <div className="w-full md:basis-[60%] md:max-w-[60%] min-w-0 px-4 md:px-0">
              <div className="bg-white rounded shadow md:p-6 min-h-[600px]">{renderStep()}</div>
            </div>

            {/* Right Section for Steps 1-3 */}
            <div className="hidden md:block md:basis-[40%] md:max-w-[40%] min-w-0 py-0">
              <div className="sticky top-40 z-30">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 w-full max-w-md mx-auto">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Summary
                  </h2>

                  {/* Service Details */}
                  <div className="mb-2 pb-2 border-b border-gray-300">
                    <h3 className="text-sm font-medium text-gray-700">Service Details</h3>
                      <div className="space-y-2">
                        {cartItemsArray.map((item) => (
                          <div key={item.service.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {item.service.name} x {item.count}
                            </span>
                            <span className="text-sm font-medium">
                              AED {(item.service.price * item.count).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>               
                  </div>

              {/* Date & Time */}
              <div className="mb-2 pb-2 border-b border-gray-300">
                <h3 className="text-sm font-medium text-gray-700">Date & Time</h3>
                {selectedDateTime.date && selectedDateTime.time ? (
                  <div className="mt-1 space-y-1">
                    <div className="text-sm text-gray-600">
                      {selectedDateTime.date}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedDateTime.time}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 mt-1">
                    Not selected yet
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Payment Details</h3>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-600 cursor-pointer">Discount</span>
                  <span className="text-sm text-blue-600">Apply promo</span>
                </div>
                
                {cartItemsArray.length > 0 && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Service Charges</span>
                      <span className="text-sm">AED {subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Sub Total</span>
                      <span className="text-sm">AED {subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">VAT (5%)</span>
                      <span className="text-sm">AED {(subtotal * 0.05).toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center font-semibold text-lg border-t pt-3">
                  <span>Total to pay</span>
                  <span>AED {(subtotal + (subtotal * 0.05)).toFixed(2)}</span>
                </div>
              </div>

              {/* Tabby Installment Info */}
              <div className="bg-gray-50 p-3 mt-6 rounded-lg flex items-center justify-between">
                <span className="text-gray-700 font-medium text-sm">
                  AED {monthlyInstallment}/month{" "}
                  <span className="text-gray-500 font-normal">
                    for 4 months with
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-green-200 text-green-900 font-bold px-2 py-1 rounded-md text-xs">
                    tabby
                  </span>
                  <span className="text-gray-400 text-base ml-1">ⓘ</span>
                </span>
              </div>
            </div>
          </div>
        </div>
            </>
        )}

        {/* Fixed Next Button - Desktop Only */}
        {step < 4 && (
          <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
            <div className="w-full max-w-[400px] mx-auto">
              <button
                onClick={nextStep}
                disabled={!hasItems}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  !hasItems
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-yellow-500"
                }`}
              >
                <span>NEXT</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Mobile Bottom Drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-40">
        <div className="px-4 py-4">
          <Calculation
            cartItems={transformedCartItems}
            selectedDateTime={selectedDateTime}
            nextStep={nextStep}
            hasItems={hasItems}
          />
        </div>
      </div>

      {/* Modal */}
    </div>
  );
};

export default CheckoutService;
