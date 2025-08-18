import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/config/api";

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image: string;
  room_type_id: number;
  room_type_slug: string;
}

interface ServiceOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyType: string; // "Apartment" or "Villa"
  category: string; // "general", "cockroaches", etc.
  onAddService: (service: ServiceOption) => void;
  onRemoveService?: (service: ServiceOption) => void;
}

interface ServicePricing {
  id: number;
  service_category_id: number;
  property_type_id: number;
  room_type_id: number;
  price: number;
  discount_price: number | null;
  category_name: string;
  property_type_name: string;
  room_type_name: string;
  room_type_slug: string;
  room_icon_url: string | null;
  room_description: string | null;
}

// Centralized image mapping to avoid duplication (fallback for when no icons are provided)
const PROPERTY_IMAGES = {
  apartment: {
    studio: "/steps/apart/1.png",
    "1bed": "/steps/apart/2.png", 
    "1-bed": "/steps/apart/2.png",
    "2bed": "/steps/apart/3.png",
    "2-bed": "/steps/apart/3.png",
    "3bed": "/steps/apart/4.png",
    "3-bed": "/steps/apart/4.png",
    "4bed": "/steps/apart/5.png",
    "4-bed": "/steps/apart/5.png"
  },
  villa: {
    "2bed": "/steps/villa/1.png",
    "2-bed": "/steps/villa/1.png",
    "3bed": "/steps/villa/2.png", 
    "3-bed": "/steps/villa/2.png",
    "4bed": "/steps/villa/3.png",
    "4-bed": "/steps/villa/3.png",
    "5bed": "/steps/villa/4.png",
    "5-bed": "/steps/villa/4.png"
  },
  special: "/pest.webp" // For special cases
};

// Function to get category display name
const getCategoryDisplayName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
};

// Helper function to get image path (fallback when room type doesn't have icon)
const getImagePath = (propertyType: string, roomSlug: string, iconUrl?: string | null): string => {
  if (iconUrl) return iconUrl;
  
  const propertyKey = propertyType.toLowerCase() as keyof typeof PROPERTY_IMAGES;
  return PROPERTY_IMAGES[propertyKey]?.[roomSlug] || PROPERTY_IMAGES.special;
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

  // Fetch service pricing data
  const {
    data: servicePricing = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service-pricing", propertyType, category],
    queryFn: async () => {
      try {
        const response = await fetch(buildApiUrl('/api/service-pricing'));
        if (!response.ok) {
          throw new Error('Failed to fetch pricing data');
        }
        const data: ServicePricing[] = await response.json();
        
        // Filter by current property type and category
        return data.filter(pricing => 
          pricing.property_type_name.toLowerCase() === propertyType.toLowerCase() &&
          pricing.category_name.toLowerCase() === category.toLowerCase()
        );
      } catch (error) {
        console.warn('Error fetching pricing data:', error);
        return [];
      }
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  // Generate service options from pricing data
  const generateServiceOptions = (): ServiceOption[] => {
    return servicePricing.map((pricing) => {
      const propertyTypeSuffix = propertyType === "Apartment" ? 
        (pricing.room_type_slug === "studio" ? "" : " Apartment") : 
        " Villa";
      
      return {
        id: `${propertyType.toLowerCase()}-${pricing.room_type_slug}-${category.replace(/\s+/g, '')}`,
        name: `${pricing.room_type_name}${propertyTypeSuffix}`,
        description: pricing.room_description || `Professional ${category} service for ${pricing.room_type_name.toLowerCase()}.`,
        price: pricing.price,
        discount_price: pricing.discount_price,
        image: getImagePath(propertyType, pricing.room_type_slug, pricing.room_icon_url),
        room_type_id: pricing.room_type_id,
        room_type_slug: pricing.room_type_slug
      };
    });
  };

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
    if (isOpen) {
      console.log("Modal category changed to:", category);
      console.log("Property type:", propertyType);
    }
  }, [category, propertyType, isOpen]);

  if (!isOpen) return null;

  // Generate options dynamically
  const options = generateServiceOptions();

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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-500">Loading pricing options...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-2">Failed to load pricing data</p>
              <p className="text-gray-500 text-sm">Please try again later</p>
            </div>
          ) : options.length === 0 ? (
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
                      <div className="flex items-center gap-2">
                        {option.discount_price ? (
                          <>
                            <span className="font-semibold text-green-600">AED {option.discount_price}</span>
                            <span className="text-sm text-gray-500 line-through">AED {option.price}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-gray-900">AED {option.price}</span>
                        )}
                      </div>
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
