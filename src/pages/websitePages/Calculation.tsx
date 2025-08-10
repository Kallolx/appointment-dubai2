import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface ServiceItem {
  id: string;
  title?: string;
  count: number;
  discountPrice?: number;
  currentPrice?: number;
}

interface SelectedDateTime {
  professional: { name: string } | string | null;
  date: string | null;
  time: string | null;
}

interface CalculationProps {
  cartItems: Record<string, ServiceItem>;
  selectedDateTime: SelectedDateTime;
  nextStep?: () => void;
  hasItems?: boolean;
  handleAddItemsClick?: (item: ServiceItem) => void;
  handleRemoveItemClick?: (id: string) => void;
}

const Calculation: React.FC<CalculationProps> = ({
  cartItems = {},
  selectedDateTime,
  nextStep,
  hasItems = false,
  handleAddItemsClick,
  handleRemoveItemClick,
}) => {
  const { professional, date, time } = selectedDateTime || {};
  const [showDrawer, setShowDrawer] = useState(false);

  const totalPrice = Object.values(cartItems).reduce(
    (sum, item) =>
      sum + (item.discountPrice ?? item.currentPrice ?? 0) * (item.count ?? 1),
    0
  );

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
                    {item.count ?? 1}× {item.title}
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
            <p className="w-1/2">AED {totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Mobile bottom drawer */}
      <div className="md:hidden w-full">
        {/* Slide-Up Drawer */}
        <div
          className={`fixed bottom-12 left-0 right-0 bg-white transition-transform duration-300 transform max-h-[70vh] overflow-y-auto rounded-t-xl shadow-lg ${
            showDrawer ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}
        >
          <div className="p-4">
            <h2 className="font-bold text-sm pb-3">Booking Details</h2>

            {Object.values(cartItems).length > 0 ? (
              Object.values(cartItems).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-3"
                >
                  <div className="flex flex-col w-3/4">
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-gray-500 text-sm">
                      AED{" "}
                      {(item.discountPrice ?? item.currentPrice ?? 0).toFixed(
                        2
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-1/4 justify-end text-gray-700 font-semibold">
                    <button
                      onClick={() => handleRemoveItemClick?.(item.id)}
                      className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xl select-none"
                    >
                      −
                    </button>
                    <span>{item.count}</span>
                    <button
                      onClick={() => handleAddItemsClick?.(item)}
                      className="border border-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xl select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items added yet.</p>
            )}
          </div>
        </div>

        {/* Bottom Total Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-md flex items-center justify-between z-50">
          <div
            onClick={() => setShowDrawer(!showDrawer)}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="font-semibold flex flex-col leading-none">
              <span className="text-gray-500 text-xs">Total</span>
              <span className="text-base">AED {totalPrice.toFixed(2)}</span>
            </div>
            {showDrawer ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </div>

          <button
            onClick={nextStep}
            disabled={!hasItems}
            className={`ml-4 px-5 py-2 rounded-full text-white text-sm font-semibold ${
              hasItems
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-yellow-400 opacity-50 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Calculation;
