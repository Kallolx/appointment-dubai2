import { ArrowRight, ChevronDown, ChevronUp, Info, X } from "lucide-react";
import React, { useState } from "react";

interface ServiceItem {
  id: string;
  title?: string;
  name?: string;
  count: number;
  discountPrice?: number;
  currentPrice?: number;
  price?: number;
  discount_price?: number;
}

interface SelectedDateTime {
  professional: { name: string } | string | null;
  date: string | null;
  time: string | null;
  extra_price?: number;
}

interface CalculationProps {
  cartItems: Record<string, ServiceItem>;
  selectedDateTime: SelectedDateTime;
  nextStep?: () => void;
  hasItems?: boolean;
  handleAddItemsClick?: (item: ServiceItem) => void;
  handleRemoveItemClick?: (id: string) => void;
  selectedPayment?: string; // Add payment method prop
  handleBookNow?: () => void; // Add order creation function
  currentStep?: number; // Add current step number
}

const Calculation: React.FC<CalculationProps> = ({
  cartItems = {},
  selectedDateTime,
  nextStep,
  hasItems = false,
  handleAddItemsClick,
  handleRemoveItemClick,
  selectedPayment,
  handleBookNow,
  currentStep,
}) => {
  const { professional, date, time } = selectedDateTime || {};
  const [showDrawer, setShowDrawer] = useState(false);

  // Helper function to safely get price from any service structure
  const getServicePrice = (item: ServiceItem): number => {
    // Try discount price first, then regular price, then fallback to 0
    const price = Number(
      item.discount_price ??
        item.discountPrice ??
        item.price ??
        item.currentPrice ??
        0
    );
    return isNaN(price) ? 0 : price;
  };

  const totalPrice = Object.values(cartItems).reduce(
    (sum, item) => sum + getServicePrice(item) * (item.count ?? 1),
    0
  );

  const extraPrice = Number(selectedDateTime.extra_price) || 0;
  const codFee = selectedPayment === "cod" ? 5 : 0; // AED 5 for Cash on Delivery
  const finalTotal = totalPrice + extraPrice;

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:flex flex-col gap-10">
        <div className="bg-white rounded-lg space-y-3 p-4">
          <h2 className="font-bold text-sm pb-3">Booking Details</h2>

          <div className="flex justify-between">
            <p className="w-1/2 text-gray-400">Address:</p>
            <p className="w-1/2">
              34HQ+W25 - Jumeirah Beach Residence - Dubai - UAE
            </p>
          </div>

          <div className="flex justify-between">
            <p className="w-1/2 text-gray-400">Service:</p>
            <p className="w-1/2">Furniture Cleaning</p>
          </div>

          {Object.keys(cartItems).length > 0 && (
            <div className="flex">
              <p className="text-gray-400 w-1/2 pr-4">Service Details</p>
              <div className="w-1/2 flex flex-col space-y-1">
                {Object.values(cartItems).map((item, index) => (
                  <p key={index}>
                    {item.count ?? 1}× {item.title || item.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {date && (
            <div className="flex justify-between">
              <p className="w-1/2 text-gray-400">Date:</p>
              <p className="w-1/2">
                {date},
                <br />
                {time}
              </p>
            </div>
          )}

          {/* {time && (
            <div className="flex justify-between">
              <p className="w-1/2 text-gray-400">Time:</p>
              <p className="w-1/2">{time}</p>
            </div>
          )} */}

          {professional && (
            <div className="flex justify-between">
              <p className="w-1/2 text-gray-400">Professional:</p>
              <p className="w-1/2">
                {typeof professional === "string"
                  ? professional
                  : professional.name}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-4">
          <h2 className="font-bold text-sm pb-3">Payment Summary</h2>
          <div className="flex justify-between">
            <p className="w-1/2">Total</p>
            <p className="w-1/2">AED {finalTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Mobile bottom drawer */}
      <div className="md:hidden w-full">
        {/* Slide-Up Drawer */}
        <div
          className={`fixed bottom-12 left-0 right-0 bg-white transition-transform duration-300 transform max-h-[70vh] overflow-y-auto rounded-t-xl shadow-lg z-[60] ${
            showDrawer ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}
        >
          {/* Draggable Handle */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Close Button */}
          <div className="absolute top-2 right-3">
            <button
              onClick={() => setShowDrawer(false)}
              className="p-1.5 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="px-4 pt-6 pb-8">
            <h2 className="font-bold text-base pb-3 text-gray-900">Summary</h2>

            {Object.values(cartItems).length > 0 ? (
              <>
                {/* Main Items */}
                {Object.values(cartItems).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-gray-800 text-sm">
                      {item.title || item.name} x {item.count}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">
                      AED {getServicePrice(item).toFixed(2)}
                    </span>
                  </div>
                ))}

                {/* Separator */}
                <div className="border-t border-gray-200 my-2"></div>

                {/* Service Charges */}
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-600 text-sm">Service Charges</span>
                  <span className="text-gray-800 text-sm">
                    AED {finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Discount (if any) */}
                {extraPrice > 0 && (
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-gray-600 text-sm">Time Slot Fee</span>
                    <span className="text-orange-600 text-sm">
                      + AED {extraPrice.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* COD Fee (if applicable) */}
                {codFee > 0 && (
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-gray-600 text-sm">Cash on Delivery Fee</span>
                    <span className="text-orange-600 text-sm">
                      + AED {codFee.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Sub Total */}
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-600 text-sm">Sub Total</span>
                  <span className="font-semibold text-gray-800 text-sm">
                    AED {(finalTotal + extraPrice + codFee).toFixed(2)}
                  </span>
                </div>

                {/* VAT */}
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-600 text-sm">VAT (5%)</span>
                  <span className="text-gray-800 text-sm">
                    AED {((finalTotal + extraPrice + codFee) * 0.05).toFixed(2)}
                  </span>
                </div>

                {/* Total to Pay */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total to Pay</span>
                    <span className="text-base font-bold text-gray-800">
                      AED {(finalTotal + extraPrice + codFee + (finalTotal + extraPrice + codFee) * 0.05).toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No items added yet.
              </p>
            )}
          </div>
        </div>

        {/* Tabby Installment Info - Behind Summary Section */}
        <div className="fixed bottom-[65px] left-0 right-0 bg-white px-6 py-5 border-t border-gray-200 z-[59]">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium text-sm">
              AED{" "}
              {(
                (finalTotal + extraPrice + codFee + (finalTotal + extraPrice + codFee) * 0.05) /
                4
              ).toFixed(2)}
              /month{" "}
              <span className="text-gray-500 font-normal">
                for 4 months with
              </span>
            </span>
            <span className="flex items-center gap-1">
              <img src="/icons/tabby.svg" alt="Tabby" className="h-5" />
              <Info className="w-4 h-4 text-gray-600" />
            </span>
          </div>
        </div>

        {/* Bottom Total Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 flex items-center justify-between z-[70]"
          style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}
        >
          <div
            onClick={() => setShowDrawer(!showDrawer)}
            className="cursor-pointer flex items-center gap-1"
          >
            <div className="font-semibold flex flex-col leading-none">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="text-xl text-gray-600 font-bold ">
                AED {(finalTotal + extraPrice + codFee + (finalTotal + extraPrice + codFee) * 0.05).toFixed(2)}
              </span>
            </div>
            {showDrawer ? (
              <ChevronDown className="w-5 h-5 mt-4" />
            ) : (
              <ChevronUp className="w-5 h-5 mt-4" />
            )}
          </div>

          <button
            onClick={currentStep === 4 ? handleBookNow : nextStep}
            disabled={!hasItems || (currentStep === 4 && !selectedPayment)}
            className={`ml-4 px-12 py-2 flex items-center justify-center gap-2 text-white text-lg font-semibold ${
              hasItems && (currentStep !== 4 || selectedPayment)
                ? "bg-primary hover:bg-orange-600"
                : "bg-primary opacity-50 cursor-not-allowed"
            }`}
          >
            NEXT
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Calculation;
