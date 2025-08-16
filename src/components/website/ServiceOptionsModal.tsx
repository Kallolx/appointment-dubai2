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

// Centralized image mapping to avoid duplication
const PROPERTY_IMAGES = {
  apartment: {
    studio: "/steps/apart/1.png",
    "1bed": "/steps/apart/2.png", 
    "2bed": "/steps/apart/3.png",
    "3bed": "/steps/apart/4.png",
    "4bed": "/steps/apart/5.png"
  },
  villa: {
    "2bed": "/steps/villa/1.png",
    "3bed": "/steps/villa/2.png", 
    "4bed": "/steps/villa/3.png",
    "5bed": "/steps/villa/4.png"
  },
  special: "/pest.webp" // For special cases
};

// Function to get category display name
const getCategoryDisplayName = (category: string): string => {
  const categoryNames = {
    general: "General",
    cockroaches: "Cockroaches",
    "bed bugs": "Bed Bugs",
    bedbugs: "Bed Bugs", 
    termite: "Termite",
    ants: "Ants",
    mosquitoes: "Mosquitoes",
    "deep-clean": "Deep Clean",
    maintenance: "Maintenance"
  };
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
};

// Helper function to get image path
const getImagePath = (propertyType: string, roomType: string, isSpecial = false): string => {
  if (isSpecial) return PROPERTY_IMAGES.special;
  
  const propertyKey = propertyType.toLowerCase() as keyof typeof PROPERTY_IMAGES;
  return PROPERTY_IMAGES[propertyKey]?.[roomType] || PROPERTY_IMAGES.special;
};

// Base service configurations - prices only, images generated dynamically
const SERVICE_CONFIGS = {
  apartment: {
    general: {
      studio: { price: 149, description: "Specialized treatment aimed at eradicating bed bugs." },
      "1bed": { price: 179, description: "Specialized treatment aimed at eradicating bed bugs." },
      "2bed": { price: 199, description: "Specialized treatment aimed at eradicating bed bugs." },
      "3bed": { price: 229, description: "Specialized treatment aimed at eradicating bed bugs." },
      "4bed": { price: 249, description: "Specialized treatment aimed at eradicating bed bugs." }
    },
    cockroaches: {
      studio: { price: 129, description: "Professional cockroach control for studio apartments." },
      "1bed": { price: 159, description: "Professional cockroach control for 1 bedroom apartments." },
      "2bed": { price: 179, description: "Professional cockroach control for 2 bedroom apartments." },
      "3bed": { price: 209, description: "Professional cockroach control for 3 bedroom apartments.", special: true },
      "4bed": { price: 229, description: "Professional cockroach control for 4 bedroom apartments." }
    },
    ants: {
      studio: { price: 119, description: "Professional ant control for studio apartments." },
      "1bed": { price: 149, description: "Professional ant control for 1 bedroom apartments." },
      "2bed": { price: 169, description: "Professional ant control for 2 bedroom apartments." },
      "3bed": { price: 199, description: "Professional ant control for 3 bedroom apartments." },
      "4bed": { price: 219, description: "Professional ant control for 4 bedroom apartments." }
    },
    mosquitoes: {
      studio: { price: 139, description: "Professional mosquito control for studio apartments." },
      "1bed": { price: 169, description: "Professional mosquito control for 1 bedroom apartments." },
      "2bed": { price: 189, description: "Professional mosquito control for 2 bedroom apartments." },
      "3bed": { price: 219, description: "Professional mosquito control for 3 bedroom apartments." },
      "4bed": { price: 239, description: "Professional mosquito control for 4 bedroom apartments." }
    },
    "bed bugs": {
      studio: { price: 159, description: "Professional bed bug control for studio apartments." },
      "1bed": { price: 189, description: "Professional bed bug control for 1 bedroom apartments." },
      "2bed": { price: 209, description: "Professional bed bug control for 2 bedroom apartments." },
      "3bed": { price: 239, description: "Professional bed bug control for 3 bedroom apartments." },
      "4bed": { price: 259, description: "Professional bed bug control for 4 bedroom apartments." }
    }
  },
  villa: {
    general: {
      "2bed": { price: 299, description: "Comprehensive cleaning service for 2 bedroom villas." },
      "3bed": { price: 349, description: "Comprehensive cleaning service for 3 bedroom villas." },
      "4bed": { price: 399, description: "Comprehensive cleaning service for 4 bedroom villas." },
      "5bed": { price: 449, description: "Comprehensive cleaning service for 5 bedroom villas." }
    },
    cockroaches: {
      "2bed": { price: 279, description: "Professional cockroach control for 2 bedroom villas." },
      "3bed": { price: 329, description: "Professional cockroach control for 3 bedroom villas." },
      "4bed": { price: 379, description: "Professional cockroach control for 4 bedroom villas." },
      "5bed": { price: 429, description: "Professional cockroach control for 5 bedroom villas." }
    },
    ants: {
      "2bed": { price: 259, description: "Professional ant control for 2 bedroom villas." },
      "3bed": { price: 309, description: "Professional ant control for 3 bedroom villas." },
      "4bed": { price: 359, description: "Professional ant control for 4 bedroom villas." },
      "5bed": { price: 409, description: "Professional ant control for 5 bedroom villas." }
    },
    mosquitoes: {
      "2bed": { price: 289, description: "Professional mosquito control for 2 bedroom villas." },
      "3bed": { price: 339, description: "Professional mosquito control for 3 bedroom villas." },
      "4bed": { price: 389, description: "Professional mosquito control for 4 bedroom villas." },
      "5bed": { price: 439, description: "Professional mosquito control for 5 bedroom villas." }
    },
    "bed bugs": {
      "2bed": { price: 309, description: "Professional bed bug control for 2 bedroom villas." },
      "3bed": { price: 359, description: "Professional bed bug control for 3 bedroom villas.", special: true },
      "4bed": { price: 409, description: "Professional bed bug control for 4 bedroom villas." },
      "5bed": { price: 459, description: "Professional bed bug control for 5 bedroom villas." }
    }
  }
};

// Room type display names
const ROOM_DISPLAY_NAMES = {
  studio: "Studio",
  "1bed": "1 Bedroom Apartment",
  "2bed": "2 Bedroom",
  "3bed": "3 Bedroom", 
  "4bed": "4 Bedroom",
  "5bed": "5 Bedroom"
};

// Generate service options dynamically
const generateServiceOptions = (propertyType: string, category: string): ServiceOption[] => {
  const propertyKey = propertyType.toLowerCase() as keyof typeof SERVICE_CONFIGS;
  const categoryKey = category as keyof typeof SERVICE_CONFIGS.apartment;
  const configs = SERVICE_CONFIGS[propertyKey]?.[categoryKey];
  
  if (!configs) return [];
  
  return Object.entries(configs).map(([roomType, config]) => {
    const propertyTypeSuffix = propertyType === "Apartment" ? 
      (roomType === "studio" ? "" : " Apartment") : 
      " Villa";
    
    return {
      id: `${propertyType.toLowerCase()}-${roomType}-${category.replace(/\s+/g, '')}`,
      name: `${ROOM_DISPLAY_NAMES[roomType]}${propertyTypeSuffix}`,
      description: config.description,
      price: config.price,
      image: getImagePath(propertyType, roomType, (config as { special?: boolean }).special || false)
    };
  });
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
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Debug logging to track category changes
  useEffect(() => {
    console.log("Modal category changed to:", category);
    console.log("Property type:", propertyType);
  }, [category, propertyType]);

  if (!isOpen) return null;

  // Generate options dynamically
  const options = generateServiceOptions(propertyType, category);

  console.log("Generated options:", { propertyType, category, optionsFound: options.length });

  const handleAddService = (service: ServiceOption) => {
    const currentCount = selectedServices[service.id] || 0;
    setSelectedServices(prev => ({
      ...prev,
      [service.id]: currentCount + 1
    }));
    
    const serviceWithCategory = {
      ...service,
      name: `${service.name} - ${getCategoryDisplayName(category)}`,
      category: category,
      propertyType: propertyType
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
      
      const service = options.find(option => option.id === serviceId);
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
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto mt-4 mb-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-center p-4">
          <h2 className="text-xl font-semibold text-gray-900 text-center flex-1">
            {propertyType} - {getCategoryDisplayName(category)}
          </h2>
          <button
            onClick={() => {
              onClose();
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
                      loading="lazy"
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