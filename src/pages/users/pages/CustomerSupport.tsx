import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CustomerSupport: React.FC = () => {
  const navigate = useNavigate();

  const supportOptions = [
    {
      id: "technician",
      title: "Change or request a specific technician",
    },
    {
      id: "reschedule",
      title: "Reschedule booking",
    },
    {
      id: "duration",
      title: "Change duration / number of cleaners",
    },
    {
      id: "payment",
      title: "Change the payment method",
    },
    {
      id: "services",
      title: "Add additional services",
    },
    {
      id: "materials",
      title: "Add materials to your cleaning service",
    },
    {
      id: "cancel",
      title: "Cancel my booking",
    },
    {
      id: "complaint",
      title: "I have a complaint",
    },
    {
      id: "address",
      title: "Change the address for your booking",
    },
    {
      id: "gatepass",
      title: "Obtain a gate pass for your Technician",
    },
    {
      id: "contact",
      title: "Change contact info on my booking (phone number or email)",
    },
    {
      id: "ticket",
      title: "Follow up on an existing ticket",
    },
    {
      id: "other",
      title: "Something else",
    },
  ];

  const handleOptionClick = (optionId: string) => {
    // Handle each support option - you can implement specific logic for each
    console.log("Support option clicked:", optionId);
    
    // For now, just show an alert - you can replace this with actual functionality
    alert(`Support option: ${supportOptions.find(opt => opt.id === optionId)?.title}`);
  };

  return (
    <div>
      <div className="min-h-screen mb-16 bg-gray-50">
        {/* Top navbar-style header */}
        <div className="bg-white sticky top-0 z-40 border-b border-gray-200 mb-4">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Customer Support
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4">
          {/* Support Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Please choose what you need help with:
            </h2>
          </div>

          {/* Support Options */}
          <div className="space-y-3">
            {supportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="w-full p-4 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-all duration-200 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium text-sm">
                    {option.title}
                  </span>
                  <div className="w-5 h-5 bg-[#01788e] rounded-full flex items-center justify-center">
                    <ArrowLeft className="w-3 h-3 text-white transform rotate-180" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
