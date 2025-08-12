import { useState, useEffect } from "react";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ServiceOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyType: string; // "Apartment" or "Villa"
  category: string; // "general", "cockroaches", etc.
  onAddService: (service: ServiceOption) => void;
  onRemoveService?: (service: ServiceOption) => void;
}

// Function to get category display name
const getCategoryDisplayName = (category: string): string => {
  const categoryNames = {
    general: "General",
    cockroaches: "Cockroaches",
    "bed bugs": "Bed Bugs", // FIXED: Use correct key with space
    bedbugs: "Bed Bugs", 
    termite: "Termite",
    ants: "Ants",
    mosquitoes: "Mosquitoes", // ADDED: Missing mosquitoes mapping
    "deep-clean": "Deep Clean",
    maintenance: "Maintenance"
  };
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

const serviceOptions = {
  apartment: {
    general: [
      {
        id: "apt-studio",
        name: "Studio",
        description: "Specialized treatment aimed at eradicating bed bugs.",
        price: 149,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "apt-1bed",
        name: "1 Bedroom Apartment",
        description: "Specialized treatment aimed at eradicating bed bugs.",
        price: 179,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "apt-2bed",
        name: "2 Bedroom Apartment",
        description: "Specialized treatment aimed at eradicating bed bugs.",
        price: 199,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "apt-3bed",
        name: "3 Bedroom Apartment",
        description: "Specialized treatment aimed at eradicating bed bugs.",
        price: 229,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "apt-4bed",
        name: "4 Bedroom Apartment",
        description: "Specialized treatment aimed at eradicating bed bugs.",
        price: 249,
        image: "/general_cleaning/homecleaning.webp"
      }
    ],
    cockroaches: [
      {
        id: "apt-studio-cock",
        name: "Studio",
        description: "Professional cockroach control for studio apartments.",
        price: 129,
        image: "/pest.webp"
      },
      {
        id: "apt-1bed-cock",
        name: "1 Bedroom Apartment",
        description: "Professional cockroach control for 1 bedroom apartments.",
        price: 159,
        image: "/pest.webp"
      },
      {
        id: "apt-2bed-cock",
        name: "2 Bedroom Apartment",
        description: "Professional cockroach control for 2 bedroom apartments.",
        price: 179,
        image: "/pest.webp"
      },
      {
        id: "apt-3bed-cock",
        name: "3 Bedroom Apartment",
        description: "Professional cockroach control for 3 bedroom apartments.",
        price: 209,
        image: "/pest.webp"
      },
      {
        id: "apt-4bed-cock",
        name: "4 Bedroom Apartment",
        description: "Professional cockroach control for 4 bedroom apartments.",
        price: 229,
        image: "/pest.webp"
      }
    ],
    ants: [
      {
        id: "apt-studio-ants",
        name: "Studio",
        description: "Professional ant control for studio apartments.",
        price: 119,
        image: "/pest.webp"
      },
      {
        id: "apt-1bed-ants",
        name: "1 Bedroom Apartment",
        description: "Professional ant control for 1 bedroom apartments.",
        price: 149,
        image: "/pest.webp"
      },
      {
        id: "apt-2bed-ants",
        name: "2 Bedroom Apartment",
        description: "Professional ant control for 2 bedroom apartments.",
        price: 169,
        image: "/pest.webp"
      },
      {
        id: "apt-3bed-ants",
        name: "3 Bedroom Apartment",
        description: "Professional ant control for 3 bedroom apartments.",
        price: 199,
        image: "/pest.webp"
      },
      {
        id: "apt-4bed-ants",
        name: "4 Bedroom Apartment",
        description: "Professional ant control for 4 bedroom apartments.",
        price: 219,
        image: "/pest.webp"
      }
    ],
    mosquitoes: [
      {
        id: "apt-studio-mosq",
        name: "Studio",
        description: "Professional mosquito control for studio apartments.",
        price: 139,
        image: "/pest.webp"
      },
      {
        id: "apt-1bed-mosq",
        name: "1 Bedroom Apartment",
        description: "Professional mosquito control for 1 bedroom apartments.",
        price: 169,
        image: "/pest.webp"
      },
      {
        id: "apt-2bed-mosq",
        name: "2 Bedroom Apartment",
        description: "Professional mosquito control for 2 bedroom apartments.",
        price: 189,
        image: "/pest.webp"
      },
      {
        id: "apt-3bed-mosq",
        name: "3 Bedroom Apartment",
        description: "Professional mosquito control for 3 bedroom apartments.",
        price: 219,
        image: "/pest.webp"
      },
      {
        id: "apt-4bed-mosq",
        name: "4 Bedroom Apartment",
        description: "Professional mosquito control for 4 bedroom apartments.",
        price: 239,
        image: "/pest.webp"
      }
    ],
    "bed bugs": [
      {
        id: "apt-studio-bugs",
        name: "Studio",
        description: "Professional bed bug control for studio apartments.",
        price: 159,
        image: "/pest.webp"
      },
      {
        id: "apt-1bed-bugs",
        name: "1 Bedroom Apartment",
        description: "Professional bed bug control for 1 bedroom apartments.",
        price: 189,
        image: "/pest.webp"
      },
      {
        id: "apt-2bed-bugs",
        name: "2 Bedroom Apartment",
        description: "Professional bed bug control for 2 bedroom apartments.",
        price: 209,
        image: "/pest.webp"
      },
      {
        id: "apt-3bed-bugs",
        name: "3 Bedroom Apartment",
        description: "Professional bed bug control for 3 bedroom apartments.",
        price: 239,
        image: "/pest.webp"
      },
      {
        id: "apt-4bed-bugs",
        name: "4 Bedroom Apartment",
        description: "Professional bed bug control for 4 bedroom apartments.",
        price: 259,
        image: "/pest.webp"
      }
    ]
  },
  villa: {
    general: [
      {
        id: "villa-2bed",
        name: "2 Bedroom Villa",
        description: "Comprehensive cleaning service for 2 bedroom villas.",
        price: 299,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "villa-3bed",
        name: "3 Bedroom Villa",
        description: "Comprehensive cleaning service for 3 bedroom villas.",
        price: 349,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "villa-4bed",
        name: "4 Bedroom Villa",
        description: "Comprehensive cleaning service for 4 bedroom villas.",
        price: 399,
        image: "/general_cleaning/homecleaning.webp"
      },
      {
        id: "villa-5bed",
        name: "5 Bedroom Villa",
        description: "Comprehensive cleaning service for 5 bedroom villas.",
        price: 449,
        image: "/general_cleaning/homecleaning.webp"
      }
    ],
    cockroaches: [
      {
        id: "villa-2bed-cock",
        name: "2 Bedroom Villa",
        description: "Professional cockroach control for 2 bedroom villas.",
        price: 279,
        image: "/pest.webp"
      },
      {
        id: "villa-3bed-cock",
        name: "3 Bedroom Villa",
        description: "Professional cockroach control for 3 bedroom villas.",
        price: 329,
        image: "/pest.webp"
      },
      {
        id: "villa-4bed-cock",
        name: "4 Bedroom Villa",
        description: "Professional cockroach control for 4 bedroom villas.",
        price: 379,
        image: "/pest.webp"
      },
      {
        id: "villa-5bed-cock",
        name: "5 Bedroom Villa",
        description: "Professional cockroach control for 5 bedroom villas.",
        price: 429,
        image: "/pest.webp"
      }
    ],
    ants: [
      {
        id: "villa-2bed-ants",
        name: "2 Bedroom Villa",
        description: "Professional ant control for 2 bedroom villas.",
        price: 259,
        image: "/pest.webp"
      },
      {
        id: "villa-3bed-ants",
        name: "3 Bedroom Villa",
        description: "Professional ant control for 3 bedroom villas.",
        price: 309,
        image: "/pest.webp"
      },
      {
        id: "villa-4bed-ants",
        name: "4 Bedroom Villa",
        description: "Professional ant control for 4 bedroom villas.",
        price: 359,
        image: "/pest.webp"
      },
      {
        id: "villa-5bed-ants",
        name: "5 Bedroom Villa",
        description: "Professional ant control for 5 bedroom villas.",
        price: 409,
        image: "/pest.webp"
      }
    ],
    mosquitoes: [
      {
        id: "villa-2bed-mosq",
        name: "2 Bedroom Villa",
        description: "Professional mosquito control for 2 bedroom villas.",
        price: 289,
        image: "/pest.webp"
      },
      {
        id: "villa-3bed-mosq",
        name: "3 Bedroom Villa",
        description: "Professional mosquito control for 3 bedroom villas.",
        price: 339,
        image: "/pest.webp"
      },
      {
        id: "villa-4bed-mosq",
        name: "4 Bedroom Villa",
        description: "Professional mosquito control for 4 bedroom villas.",
        price: 389,
        image: "/pest.webp"
      },
      {
        id: "villa-5bed-mosq",
        name: "5 Bedroom Villa",
        description: "Professional mosquito control for 5 bedroom villas.",
        price: 439,
        image: "/pest.webp"
      }
    ],
    "bed bugs": [
      {
        id: "villa-2bed-bugs",
        name: "2 Bedroom Villa",
        description: "Professional bed bug control for 2 bedroom villas.",
        price: 309,
        image: "/pest.webp"
      },
      {
        id: "villa-3bed-bugs",
        name: "3 Bedroom Villa",
        description: "Professional bed bug control for 3 bedroom villas.",
        price: 359,
        image: "/pest.webp"
      },
      {
        id: "villa-4bed-bugs",
        name: "4 Bedroom Villa",
        description: "Professional bed bug control for 4 bedroom villas.",
        price: 409,
        image: "/pest.webp"
      },
      {
        id: "villa-5bed-bugs",
        name: "5 Bedroom Villa",
        description: "Professional bed bug control for 5 bedroom villas.",
        price: 459,
        image: "/pest.webp"
      }
    ]
  }
};

const ServiceOptionsModal: React.FC<ServiceOptionsModalProps> = ({
  isOpen,
  onClose,
  propertyType,
  category,
  onAddService,
  onRemoveService
}) => {
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});

  // Reset selected services when category or property type changes
  useEffect(() => {
    setSelectedServices({});
  }, [category, propertyType]);

  // Prevent body scroll when modal is open and ensure modal opens from top
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      // Scroll to top when modal opens
      window.scrollTo(0, 0);
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ADDED: Debug logging to track category changes
  useEffect(() => {
    console.log("Modal category changed to:", category);
    console.log("Property type:", propertyType);
  }, [category, propertyType]);

  if (!isOpen) return null;

  const propertyKey = propertyType.toLowerCase() as keyof typeof serviceOptions;
  const categoryKey = category as keyof typeof serviceOptions.apartment;
  const options = serviceOptions[propertyKey]?.[categoryKey] || [];

  // ADDED: Debug logging for options lookup
  console.log("Looking up options for:", { propertyKey, categoryKey, optionsFound: options.length });

  const handleAddService = (service: ServiceOption) => {
    const currentCount = selectedServices[service.id] || 0;
    setSelectedServices(prev => ({
      ...prev,
      [service.id]: currentCount + 1
    }));
    
    // FIXED: Add category information to the service with proper display name
    const serviceWithCategory = {
      ...service,
      name: `${service.name} - ${getCategoryDisplayName(category)}`,
      category: category,
      propertyType: propertyType // ADDED: Also include property type for better tracking
    };
    
    console.log("Adding service with category info:", serviceWithCategory);
    onAddService(serviceWithCategory);
  };

  const handleRemoveService = (serviceId: string) => {
    const currentCount = selectedServices[serviceId] || 0;
    if (currentCount > 0) {
      setSelectedServices(prev => ({
        ...prev,
        [serviceId]: currentCount - 1
      }));
      
      // Find the service option to pass to onRemoveService
      const service = serviceOptions[propertyKey]?.[categoryKey]?.find(option => option.id === serviceId);
      if (service && onRemoveService) {
        const serviceWithCategory = {
          ...service,
          name: `${service.name} - ${getCategoryDisplayName(category)}`,
          category: category,
          propertyType: propertyType
        };
        console.log("Removing service with category info:", serviceWithCategory);
        onRemoveService(serviceWithCategory);
      }
    }
  };

  const handleContinue = () => {
    onClose();
    setSelectedServices({});
    // Restore scroll when closing
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto mt-4 mb-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-center p-4">
          <h2 className="text-xl font-semibold text-gray-900 text-center flex-1">{propertyType} - {getCategoryDisplayName(category)}</h2>
          <button
            onClick={() => {
              onClose();
              // Restore scroll when closing via X button
              document.body.style.overflow = 'unset';
            }}
            className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            style={{ top: '1rem' }}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {options.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No options available for this category and property type.</p>
            </div>
          ) : (
            options.map((option) => (
              <div key={option.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex gap-3">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1">{option.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">AED {option.price}</span>
                      {(selectedServices[option.id] || 0) === 0 ? (
                        <Button
                          onClick={() => handleAddService(option)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          ADD +
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveService(option.id)}
                            className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                            {selectedServices[option.id]}
                          </span>
                          <button
                            onClick={() => handleAddService(option)}
                            className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 bg-white">
          <Button
            onClick={handleContinue}
            className="w-full bg-primary text-white py-3"
            style={{ transition: 'none', transform: 'none' }}
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceOptionsModal;