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
  // Add service item data from admin panel
  serviceItem?: {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category_name: string;
    description: string;
    image_url: string;
    sort_order: number;
    is_active: boolean;
  };
  // NEW: Add context for complete selection information
  context?: {
    selectedCategory: string;      // "General", "Mosquitoes", etc.
    selectedPropertyType: string;  // "Apartment", "Villa", etc.
    selectedServiceItem: string;   // "Pest control in Dubai", etc.
  };
}

interface ServiceOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyType: string; // "Apartment" or "Villa"
  category: string; // "general", "cockroaches", etc.
  onAddService: (service: ServiceOption) => void;
  onRemoveService?: (service: ServiceOption) => void;
  // NEW: Add context for complete selection information
  context?: {
    selectedCategory: string;      // "General", "Mosquitoes", etc.
    selectedPropertyType: string;  // "Apartment", "Villa", etc.
    selectedServiceItem: string;   // "Pest control in Dubai", etc.
  };
}

interface ServicePricing {
  id: number;
  service_category_id: number;
  property_type_id: number;
  room_type_id: number;
  price: number;
  discount_price: number | null;
  category_name: string;
  category_slug: string;
  property_type_name: string;
  room_type_name: string;
  room_type_slug: string;
  room_image: string | null;  // Changed from room_icon_url to match backend response
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
  onRemoveService,
  context
}) => {
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailOption, setDetailOption] = useState<ServiceOption | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

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
        
        console.log('ServiceOptionsModal - Fetched pricing data:', data);
        console.log('ServiceOptionsModal - Filtering by:', { propertyType, category });
        
        // Log detailed comparison for debugging
        data.forEach((pricing, index) => {
          console.log(`Pricing ${index}:`, {
            id: pricing.id,
            category_name: pricing.category_name,
            category_slug: pricing.category_slug, 
            property_type_name: pricing.property_type_name,
            room_type_name: pricing.room_type_name,
            price: pricing.price,
            matches_property: pricing.property_type_name.toLowerCase() === propertyType.toLowerCase(),
            matches_category: pricing.category_slug.toLowerCase() === category.toLowerCase(),
            propertyType_passed: propertyType,
            category_passed: category
          });
        });
        
        // Filter by current property type and category
        // Note: StepOne passes category.slug as category, so we filter by category_slug
        const filtered = data.filter(pricing => 
          pricing.property_type_name.toLowerCase() === propertyType.toLowerCase() &&
          pricing.category_slug.toLowerCase() === category.toLowerCase()
        );
        
        console.log('ServiceOptionsModal - Filtered pricing data:', filtered);
        return filtered;
      } catch (error) {
        console.warn('Error fetching pricing data:', error);
        return [];
      }
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  // Fetch service items data from admin panel
  const {
    data: serviceItems = [],
    isLoading: serviceItemsLoading,
  } = useQuery({
    queryKey: ["admin-service-items"],
    queryFn: async () => {
      try {
        const response = await fetch(buildApiUrl('/api/admin/service-items'));
        if (!response.ok) {
          throw new Error('Failed to fetch service items');
        }
        const data = await response.json();
        console.log('ServiceOptionsModal - Fetched service items:', data);
        return data;
      } catch (error) {
        console.warn('Error fetching service items:', error);
        return [];
      }
    },
    enabled: isOpen, // Only fetch when modal is open
  });

  // Generate service options from pricing data
  const generateServiceOptions = (): ServiceOption[] => {
    return servicePricing.map((pricing) => {
      // Find matching service item from admin panel
      const matchingServiceItem = serviceItems.find(item => 
        item.category_name.toLowerCase().includes(pricing.category_name.toLowerCase()) ||
        item.category_name.toLowerCase().includes(category.toLowerCase())
      );

      return {
        id: `${propertyType.toLowerCase()}-${pricing.room_type_slug}-${category.replace(/\s+/g, '')}`,
        // Use exactly the room type name from the database
        name: pricing.room_type_name,
        // Use exact room description from DB or empty string if null
        description: pricing.room_description || '',
        price: pricing.price,
        discount_price: pricing.discount_price,
        image: getImagePath(propertyType, pricing.room_type_slug, pricing.room_image),
        room_type_id: pricing.room_type_id,
        room_type_slug: pricing.room_type_slug,
        // Include the matching service item data
        serviceItem: matchingServiceItem
      };
    });
  };

  // Reset selected services when category or property type changes
  useEffect(() => {
    setSelectedServices({});
  }, [category, propertyType]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
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
      name: service.name,
      category: category,
      propertyType: propertyType,
      roomType: service.room_type_name || 'Studio',
      // NEW: Include context if available
      context: context ? {
        selectedCategory: context.selectedCategory,
        selectedPropertyType: context.selectedPropertyType,
        selectedServiceItem: context.selectedServiceItem
      } : undefined
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
          name: service.name,
          category: category,
          propertyType: propertyType,
          roomType: service.room_type_name || 'Studio',
          // NEW: Include context if available
          context: context ? {
            selectedCategory: context.selectedCategory,
            selectedPropertyType: context.selectedPropertyType,
            selectedServiceItem: context.selectedServiceItem
          } : undefined
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
  <>
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto mt-4 mb-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-center p-4">
          <h2 className="text-xl font-semibold text-gray-900 text-center flex-1">
            {propertyType}
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
          {isLoading || serviceItemsLoading ? (
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
                <div
                  className="flex gap-3 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => { setDetailOption(option); setDetailQuantity(1); setDetailModalOpen(true); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setDetailOption(option); setDetailQuantity(1); setDetailModalOpen(true); } }}
                >
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={option.image}
                      alt={option.name}
                      className="w-full h-full object-cover rounded-sm"
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
                            <button
                              type="button"
                              onClick={() => { setDetailOption(option); setDetailQuantity(1); setDetailModalOpen(true); }}
                              className="font-semibold text-green-600 text-left"
                            >
                              AED {option.discount_price}
                            </button>
                            <button
                              type="button"
                              onClick={() => { setDetailOption(option); setDetailQuantity(1); setDetailModalOpen(true); }}
                              className="text-sm text-gray-500 line-through"
                            >
                              AED {option.price}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setDetailOption(option); setDetailQuantity(1); setDetailModalOpen(true); }}
                            className="font-semibold text-gray-900 text-left"
                          >
                            AED {option.price}
                          </button>
                        )}
                      </div>
                      {(selectedServices[option.id] || 0) === 0 ? (
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleAddService(option); }}
                          variant="outline"
                          size="sm"
                          className="text-blue-800 border-blue-800 rounded-none hover:bg-blue-50"
                        >
                          ADD +
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveService(option.id); }}
                            className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                            {selectedServices[option.id]}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAddService(option); }}
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
            className="w-full bg-primary rounded-none text-white py-3"
            style={{ transition: 'none', transform: 'none' }}
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>

    {/* Detail modal for a single price/option */}
    {detailModalOpen && detailOption && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-sm max-w-sm w-full p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">{detailOption.name}</h3>
            <button onClick={() => setDetailModalOpen(false)} className="text-gray-500">✕</button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="w-20 h-20">
              <img src={detailOption.image} alt={detailOption.name} className="w-full h-full object-cover rounded" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">{detailOption.description}</p>
              <div className="text-lg font-semibold">AED {detailOption.discount_price ?? detailOption.price}</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >-</button>
              <div className="min-w-[36px] text-center">{detailQuantity}</div>
              <button
                onClick={() => setDetailQuantity(q => q + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >+</button>
            </div>
            <div className="text-sm text-gray-600">Total: <span className="font-semibold">AED {(detailOption.discount_price ?? detailOption.price) * detailQuantity}</span></div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                // Add quantity times
                for (let i = 0; i < detailQuantity; i++) {
                  handleAddService(detailOption);
                }
                setDetailModalOpen(false);
              }}
              className="flex-1"
            >
              Add {detailQuantity}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // If any selected, remove one per click up to quantity
                const current = selectedServices[detailOption.id] || 0;
                const toRemove = Math.min(detailQuantity, current);
                for (let i = 0; i < toRemove; i++) {
                  handleRemoveService(detailOption.id);
                }
                setDetailModalOpen(false);
              }}
              className="flex-1"
            >
              Remove {detailQuantity}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ServiceOptionsModal;
