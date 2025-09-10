import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/config/api";

interface ServiceOption {
  room_type_name: string;
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  max_orders?: number | null;
  image: string;
  room_type_id: number;
  room_type_slug: string;
  category_slug?: string; // Add category slug
  property_type_slug?: string; // Add property type slug
  whats_included?: string[]; // Add whats_included
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
  propertyType: string; // "Apartment" or "Villa" - display name
  propertyTypeId: number; // Unique ID for filtering
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
  max_orders?: number | null;
  category_name: string;
  category_slug: string;
  property_type_name: string;
  property_type_slug: string; // Add property type slug
  room_type_name: string;
  room_type_slug: string;
  room_image: string | null;  // Changed from room_icon_url to match backend response
  room_description: string | null;
  whats_included: string[] | string | null; // Add whats_included from room types
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
  propertyTypeId,
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
    queryKey: ["service-pricing", propertyTypeId, category],
    queryFn: async () => {
      try {
        const response = await fetch(buildApiUrl('/api/service-pricing'));
        if (!response.ok) {
          throw new Error('Failed to fetch pricing data');
        }
        const data: ServicePricing[] = await response.json();
        
        console.log('ServiceOptionsModal - Fetched pricing data:', data);
        console.log('ServiceOptionsModal - Filtering by:', { propertyType, propertyTypeId, category });
        
        // Log detailed comparison for debugging
        data.forEach((pricing, index) => {
          console.log(`Pricing ${index}:`, {
            id: pricing.id,
            category_name: pricing.category_name,
            category_slug: pricing.category_slug, 
            property_type_id: pricing.property_type_id,
            property_type_name: pricing.property_type_name,
            room_type_name: pricing.room_type_name,
            price: pricing.price,
            matches_property: pricing.property_type_id === propertyTypeId,
            matches_category: pricing.category_slug.toLowerCase() === category.toLowerCase(),
            propertyTypeId_passed: propertyTypeId,
            category_passed: category
          });
        });
        
        // Filter by current property type ID and category
        // Use property_type_id instead of property_type_name for unique identification
        const filtered = data.filter(pricing => 
          pricing.property_type_id === propertyTypeId &&
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

      // Parse whats_included if it's a JSON string
      let whatsIncluded: string[] = [];
      if (pricing.whats_included) {
        if (Array.isArray(pricing.whats_included)) {
          whatsIncluded = pricing.whats_included;
        } else if (typeof pricing.whats_included === 'string') {
          try {
            whatsIncluded = JSON.parse(pricing.whats_included);
          } catch (e) {
            whatsIncluded = [];
          }
        }
      }

      return {
        id: `${propertyType.toLowerCase()}-${pricing.room_type_slug}-${category.replace(/\s+/g, '')}`,
        // Use exactly the room type name from the database
        name: pricing.room_type_name,
        room_type_name: pricing.room_type_name, // Add the required property
        // Use exact room description from DB or empty string if null
        description: pricing.room_description || '',
        price: pricing.price,
        discount_price: pricing.discount_price,
        max_orders: pricing.max_orders,
        image: getImagePath(propertyType, pricing.room_type_slug, pricing.room_image),
        room_type_id: pricing.room_type_id,
        room_type_slug: pricing.room_type_slug,
        category_slug: pricing.category_slug, // Add category slug
        property_type_slug: pricing.property_type_slug, // Add property type slug
        whats_included: whatsIncluded, // Add whats_included
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

  console.log("Generated options:", { propertyType, propertyTypeId, category, optionsFound: options.length });

  const handleAddService = (service: ServiceOption) => {
    const currentCount = selectedServices[service.id] || 0;
    
    // Check max orders limit
    if (service.max_orders && currentCount >= service.max_orders) {
      // Could show a toast notification here if needed
      console.log(`Maximum orders reached for ${service.name}. Limit: ${service.max_orders}`);
      return;
    }
    
    setSelectedServices(prev => ({
      ...prev,
      [service.id]: currentCount + 1
    }));
    
    const serviceWithCategory = {
      ...service,
      name: service.name,
      category: category,
      category_slug: service.category_slug || category, // Include category slug
      propertyType: propertyType,
      property_type_slug: service.property_type_slug || '', // Include property type slug
      roomType: service.room_type_name || 'Studio',
      room_type_slug: service.room_type_slug || '', // Include room type slug
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
          category_slug: service.category_slug || category, // Include category slug
          propertyType: propertyType,
          property_type_slug: service.property_type_slug || '', // Include property type slug
          roomType: service.room_type_name || 'Studio',
          room_type_slug: service.room_type_slug || '', // Include room type slug
          // NEW: Include context if available
          context: context ? {
            selectedCategory: context.selectedCategory,
            selectedPropertyType: context.selectedPropertyType,
            selectedServiceItem: context.selectedServiceItem
          } : undefined
        };
        console.log("Removing service with category and slug info:", serviceWithCategory);
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
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end items-end md:items-center md:justify-center z-[60] p-0 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-lg md:rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto mt-0 md:mt-4 mb-0 md:mb-4 animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 duration-300">
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01788e] mx-auto mb-3"></div>
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
                          className="text-[#01788e] border-[#01788e] rounded-none transform-none hover:scale-100 transition-none"
                          disabled={option.max_orders && (selectedServices[option.id] || 0) >= option.max_orders}
                        >
                          ADD +
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveService(option.id); }}
                            className="w-8 h-8 rounded-full border border-[#01788e] text-[#01788e] hover:bg-blue-50 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                            {selectedServices[option.id]}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAddService(option); }}
                            disabled={option.max_orders && (selectedServices[option.id] || 0) >= option.max_orders}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                              option.max_orders && (selectedServices[option.id] || 0) >= option.max_orders
                                ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                                : 'border-[#01788e] text-[#01788e] hover:bg-blue-50'
                            }`}
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
        <div className="bg-white rounded-sm max-w-lg w-full max-h-[85vh] flex flex-col">
          {/* Header with image */}
          <div className="relative flex-shrink-0">
            <img 
              src={detailOption.image} 
              alt={detailOption.name} 
              className="w-full h-48 object-cover"
            />
            <button 
              onClick={() => setDetailModalOpen(false)} 
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Title and Price */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">{detailOption.name}</h3>
              <div className="text-right">
                <div className="text-base font-semibold text-gray-900">
                  AED {detailOption.discount_price ?? detailOption.price}
                </div>
                {detailOption.discount_price && (
                  <div className="text-sm text-gray-500 line-through">
                    AED {detailOption.price}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {detailOption.description && (
              <p className="text-gray-600 mb-4">{detailOption.description}</p>
            )}

            {/* What's included section */}
            {detailOption.whats_included && detailOption.whats_included.length > 0 && (
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-3">What's included</h4>
                <div className="space-y-2">
                  {detailOption.whats_included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed bottom section with quantity and button */}
          <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-white">
            {/* Quantity selector */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#01788e] hover:text-[#01788e]"
              >
                −
              </button>
              <div className="text-xl font-medium min-w-[40px] text-center">
                {detailQuantity}
              </div>
              <button
                onClick={() => {
                  const currentCount = selectedServices[detailOption.id] || 0;
                  const maxAllowed = detailOption.max_orders ? detailOption.max_orders - currentCount : Infinity;
                  if (detailQuantity < maxAllowed) {
                    setDetailQuantity(q => q + 1);
                  }
                }}
                disabled={
                  detailOption.max_orders && 
                  (selectedServices[detailOption.id] || 0) + detailQuantity >= detailOption.max_orders
                }
                className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                  detailOption.max_orders && 
                  (selectedServices[detailOption.id] || 0) + detailQuantity >= detailOption.max_orders
                    ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:border-[#01788e] hover:text-[#01788e]'
                }`}
              >
                +
              </button>
            </div>

            {/* Add to basket button */}
            <Button
              onClick={() => {
                // Check max orders before adding
                const currentCount = selectedServices[detailOption.id] || 0;
                const maxAllowed = detailOption.max_orders ? detailOption.max_orders - currentCount : detailQuantity;
                const quantityToAdd = Math.min(detailQuantity, maxAllowed);
                
                // Add quantity times (respecting max limit)
                for (let i = 0; i < quantityToAdd; i++) {
                  handleAddService(detailOption);
                }
                setDetailModalOpen(false);
              }}
              disabled={
                detailOption.max_orders && 
                (selectedServices[detailOption.id] || 0) >= detailOption.max_orders
              }
              className="w-full bg-white border-2 border-[#01788e] text-[#01788e]  py-3 text-base font-medium rounded-none disabled:opacity-50 disabled:cursor-not-allowed transform-none hover:scale-100 transition-none"
            >
              + ADD TO BASKET
              {detailOption.max_orders && (selectedServices[detailOption.id] || 0) >= detailOption.max_orders && (
                <span className="ml-2 text-xs">(Max reached)</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ServiceOptionsModal;
