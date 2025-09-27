import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Star,
  Info,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ServiceOptionsModal from "@/components/website/ServiceOptionsModal";
import { buildApiUrl } from "@/config/api";

// Small reusable AED icon component (uses public/aed.svg)
const AEDIcon = ({ className = "inline-block w-4 h-4 mr-2" }: { className?: string }) => (
  <img src="/aed.svg" alt="AED" className={className} />
);

// No fallback data - force database usage only

const StepOne = ({
  handleAddItemsClick,
  handleRemoveItemClick,
  cartItems,
  category,
  serviceSlug,
}) => {
  console.log("StepOne props received:", { category, serviceSlug });
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState(0);
  const [modalCategory, setModalCategory] = useState("");
  const [selectedServiceItemsCategory, setSelectedServiceItemsCategory] = useState("");
  const inputRef = useRef(null);
  const categoryRef = useRef(null);
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);

  // Fetch service item details for hero section
  const {
    data: serviceItem = null,
    isLoading: serviceItemLoading,
    error: serviceItemError,
  } = useQuery({
    queryKey: ["service-item", serviceSlug],
    queryFn: async () => {
      if (!serviceSlug) return null;

      // Use the working endpoint that returns all service items
      const url = buildApiUrl("/api/service-items/");
      console.log("Fetching all service items from:", url);
      console.log("ServiceSlug received:", serviceSlug);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch service items");
      }

      const allItems = await response.json();
      console.log("All service items fetched:", allItems);

      // Find the specific service item by slug
      const foundItem = allItems.find(
        (item) =>
          item.slug === serviceSlug ||
          item.slug.toLowerCase() === serviceSlug.toLowerCase()
      );

      if (foundItem) {
        console.log("Found service item by slug:", foundItem);
        return foundItem;
      }

      console.log("Service item not found for slug:", serviceSlug);
      return null;
    },
    enabled: !!serviceSlug,
  });

  // Fetch service items categories from API (these will be shown in the tabs)
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["service-items-category", category, serviceSlug],
    queryFn: async () => {
      let url = buildApiUrl("/api/service-items-category");

      console.log("StepOne received params:", { category, serviceSlug });

      // If we have a specific service item (serviceSlug), filter by that service item only
      if (serviceSlug) {
        url += `?parentServiceItemSlug=${encodeURIComponent(serviceSlug)}`;
        console.log("Filtering by serviceSlug:", serviceSlug);
      } else if (category) {
        // Legacy: filter by category if no specific service item
        url += `?parentCategorySlug=${encodeURIComponent(category)}`;
        console.log("Filtering by category:", category);
      } else {
        // Only fetch all categories when no specific filtering is needed
        url += "?limit=100&active=true";
        console.log("Fetching ALL active categories");
      }

      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Failed to fetch service items categories from database"
        );
      }
      const data = await response.json();
      console.log("Service items categories fetched from database:", data);
      console.log("Number of categories found:", data.length);
      data.forEach((cat, index) => {
        console.log(`Category ${index}:`, {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          parent_category_name: cat.parent_category_name,
          parent_category_slug: cat.parent_category_slug,
          is_active: cat.is_active,
        });
      });

      return data;
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Legacy services data for search functionality
  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        return data;
      } catch (err) {
        console.error("Error fetching services:", err);
        return [];
      }
    },
  });

  // Fetch all service pricing (used for search panel showing room types/pricing)
  const {
    data: allPricing = [],
    isLoading: allPricingLoading,
    error: allPricingError,
  } = useQuery({
    queryKey: ["service-pricing-all"],
    queryFn: async () => {
      try {
        const resp = await fetch(buildApiUrl('/api/service-pricing'));
        if (!resp.ok) throw new Error('Failed to fetch pricing');
        const data = await resp.json();
        return data;
      } catch (e) {
        console.warn('service-pricing-all error', e);
        return [];
      }
    },
    enabled: true,
  });

  // No initial selection - let user choose
  // useEffect(() => {
  //   if (categories.length > 0 && !selected) {
  //     // Always select the first available category
  //     setSelected(categories[0].slug);
  //   }
  // }, [categories, selected]);

  // Determine which categories to show
  // When serviceSlug is provided, show only categories for that service item
  // When category is provided, show only categories for that category
  // Otherwise, show all categories
  const displayCategories = categories;

  // Debug logging for display categories
  console.log("Display categories debug:", {
    totalCategories: categories.length,
    displayCategoriesCount: displayCategories.length,
    serviceSlug,
    category,
    categoriesList: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      is_active: cat.is_active,
    })),
    displayCategoriesList: displayCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      is_active: cat.is_active,
    })),
  });

  // Group services by category with search filtering (for legacy search)
  const servicesByCategory = displayCategories.reduce((acc, cat) => {
    if (cat && cat.slug) {
      acc[cat.slug] = services.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          s.category === cat.slug
      );
    }
    return acc;
  }, {});

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    else setSearchTerm("");
  }, [searchOpen]);

  // Detect current category based on scroll position (services list) - DISABLED FOR TESTING
  useEffect(() => {
    // Temporarily disabled to test scrolling
    return;
    
    if (searchOpen || displayCategories.length === 0) return; // skip while searching

    let scrollTimeout;
    const handleScroll = () => {
      // Clear previous timeout to debounce
      if (scrollTimeout) clearTimeout(scrollTimeout);
      
      // Add delay to avoid interfering with smooth scrolling
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let currentCat = selected;
        let bestMatch = null;
        let maxVisibleArea = 0;

        for (const cat of displayCategories) {
          const section = sectionRefs.current[cat.slug];
          if (section) {
            const rect = section.getBoundingClientRect();
            // Calculate visible area of the section
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(window.innerHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Only consider sections that are significantly visible
            if (visibleHeight > maxVisibleArea && visibleHeight > 200) {
              maxVisibleArea = visibleHeight;
              bestMatch = cat.slug;
            }
          }
        }

        // Only update if we have a clear winner and it's different from current
        if (bestMatch && bestMatch !== selected && maxVisibleArea > 300) {
          setSelected(bestMatch);
          scrollCategoryIntoView(bestMatch);
        }
      }, 300); // Longer delay to reduce interference
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [displayCategories, selected, searchOpen]);

  // Scroll to section when category clicked
  const scrollToCategory = (catSlug) => {
    console.log("scrollToCategory called with:", catSlug);

    // Update selected state immediately
    setSelected(catSlug);

    // Scroll to the section with a small delay
    setTimeout(() => {
      const section = sectionRefs.current[catSlug];
      if (!section) {
        console.log("Section ref not found for:", catSlug);
        return;
      }

      // Calculate position with offset for sticky header
      const headerHeight = 70; // Account for sticky tabs
      const elementPosition = section.offsetTop - headerHeight;

      // Smooth scroll to position
      window.scrollTo({
        top: Math.max(0, elementPosition),
        behavior: "smooth",
      });
    }, 100);
  };

  // Scroll category tab into view
  const scrollCategoryIntoView = (catSlug) => {
    if (!categoryRef.current) return;

    const categoryButton = categoryRef.current.querySelector(
      `[data-category="${catSlug}"]`
    );
    if (categoryButton) {
      categoryButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  // Scroll categories container by fixed amount with arrows
  const scrollCategories = (direction = "left") => {
    if (!categoryRef.current) return;
    const scrollAmount = 150; // px per click
    const currentScrollLeft = categoryRef.current.scrollLeft;
    const newScrollLeft =
      direction === "left"
        ? currentScrollLeft - scrollAmount
        : currentScrollLeft + scrollAmount;
    categoryRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  // Component for rendering property type cards
  const PropertyTypeCard = ({ property, currentCategory, categoryName }) => {
    const handleCardClick = () => {
      console.log("PropertyTypeCard - handleCardClick called with:", {
        propertyName: property.name,
        propertyId: property.id,
        currentCategory: currentCategory,
        categoryName: categoryName,
        property: property,
      });
      setSelectedPropertyType(property.name);
      setSelectedPropertyTypeId(property.id);
      setModalCategory(currentCategory);
      setSelectedServiceItemsCategory(categoryName); // Store the actual service items category name
      setIsModalOpen(true);
    };

    return (
      <div 
        className="flex gap-4 items-start p-0 bg-white pb-4 border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleCardClick}
      >
        <div className="w-20 h-20 flex-shrink-0">
          <img
            src={property.image_url || property.image}
            alt={`${property.name} Cleaning`}
            className="w-full h-full object-cover rounded-[5px]"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-base text-gray-600  font-medium mb-1">
            {property.name}
          </h3>
          <p className="text-gray-500 text-xs mb-2">
            {property.description}
          </p>
          <div className="flex justify-between items-center">
              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <span className="text-xs md:text-sm text-gray-500 font-normal">
                Starting from
              </span>
              <span className="text-sm md:text-md text-gray-600 font-semibold flex items-center">
                <AEDIcon className="inline-block w-4 h-4 mr-2" />{property.base_price || property.price}
              </span>
            </div>
            <div className="flex text-[#01788e] items-center gap-1 p-2 text-xs border border-[#01788e]">
              Options
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Component for rendering category section
  const CategorySection = ({ category }) => {
    if (!category) return null;

    // Fetch property types specific to this category
    const {
      data: categoryPropertyTypes = [],
      isLoading: categoryPropertyTypesLoading,
    } = useQuery({
      queryKey: ["service-category-property-types", category.slug],
      queryFn: async () => {
        const response = await fetch(
          buildApiUrl(
            `/api/service-items-category-property-types/${encodeURIComponent(
              category.slug
            )}`
          )
        );
        if (!response.ok) {
          if (response.status === 404) {
            console.log(
              "No property types configured for category:",
              category.slug
            );
            return [];
          }
          throw new Error(
            "Failed to fetch property types for service category"
          );
        }
        const data = await response.json();
        console.log("Property types for category:", category.slug, data);
        data.forEach((prop, index) => {
          console.log(`Property type ${index} for category ${category.slug}:`, {
            id: prop.id,
            name: prop.name,
            slug: prop.slug,
            image_url: prop.image_url,
            description: prop.description,
          });
        });
        return data;
      },
      enabled: !!category.slug,
    });

    return (
      <div ref={(el) => (sectionRefs.current[category.slug] = el)}>
        {/* Hero Banner */}
        <div className="relative mb-8 rounded-[5px] overflow-hidden h-[150px]">
          <img
            src={category.hero_image_url || "/steps/s1.png"}
            alt={`${category.name} Cleaning`}
            className="w-full h-full object-cover"
          />
          {/* Darker overlay with category name */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center px-4">
              {category.name}
            </h2>
          </div>
        </div>

        {/* Property Type Cards */}
        <div className="mb-8 space-y-4">
          {categoryPropertyTypesLoading ? (
            <div className="text-center py-4">Loading property types...</div>
          ) : categoryPropertyTypes.length > 0 ? (
            categoryPropertyTypes.map((property, index) => (
              <PropertyTypeCard
                key={index}
                property={property}
                currentCategory={category.parent_category_slug || category.slug}
                categoryName={category.name}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No property types available for this service
            </div>
          )}
        </div>
      </div>
    );
  };

  // Component for rendering search results
  const SearchResults = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">
        Search Results for "{searchTerm}"
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services
          .filter((service) =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-semibold text-gray-800 mb-2">
                {service.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {service.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600 flex items-center">
                  <AEDIcon className="inline-block w-4 h-4 mr-2" />{service.currentPrice}
                </span>
                {(cartItems[service.id]?.count || 0) === 0 ? (
                  <button
                    onClick={() => handleAddItemsClick(service)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Add +
                  </button>
                ) : (
                  <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1 space-x-2">
                    <button
                      onClick={() => handleRemoveItemClick(service.id)}
                      className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center transition"
                    >
                      −
                    </button>
                    <span className="text-black font-semibold">
                      {cartItems[service.id].count}
                    </span>
                    <button
                      onClick={() => handleAddItemsClick(service)}
                      className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white w-8 h-8 rounded-full text-lg font-bold flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  if (categoriesLoading) {
    return <div className="px-4 py-6">Loading services from database...</div>;
  }

  if (categoriesError) {
    console.error("Database fetch errors:", {
      categoriesError,
    });
    return (
      <div className="px-4 py-6">
        <div className="text-red-600 font-semibold">
          Error loading services from database:
        </div>
        {categoriesError && (
          <div className="text-sm text-red-500">
            Service Items Categories: {categoriesError.message}
          </div>
        )}
        <div className="text-sm text-gray-600 mt-2">
          Please check console for detailed logs.
        </div>
      </div>
    );
  }

  console.log("Final data loaded:", {
    serviceItemsCategories: categories?.length,
    serviceItemsCategoriesList: categories,
    serviceSlug,
    category,
    displayCategories: displayCategories?.length,
    displayCategoriesList: displayCategories,
    isFilteredByServiceItem: !!serviceSlug,
    isFilteredByCategory: !!category,
  });

  // Additional debugging: Check if any categories are inactive
  if (categories && categories.length > 0) {
    const inactiveCategories = categories.filter((cat) => !cat.is_active);
    if (inactiveCategories.length > 0) {
      console.log(
        "Inactive categories found:",
        inactiveCategories.map((cat) => cat.name)
      );
    }
  }

  const handleModalAddService = (service) => {
    handleAddItemsClick(service);
  };

  const handleModalRemoveService = (service) => {
    handleRemoveItemClick(service.id);
  };

  return (
    <>
      {/* Hero Section - Service Name and Image (Above the slider) */}
      {serviceSlug && (
        <div className="mb-6 -mx-4 md:mx-0 relative">
          {/* Search Bar - Hidden on Mobile */}
          <div className="hidden md:block mb-4 px-2 pt-2 pb-2 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setSearchOpen(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Inline pricing/search panel (appears when search is opened) */}
              {searchOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-[#cddcdc] rounded shadow-lg z-40 max-h-[420px] overflow-y-auto">
                  <div className="flex items-center justify-between p-3 border-b border-gray-100">
                    <div className="text-sm text-gray-700">Select room type</div>
                    <button onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-gray-800">Close</button>
                  </div>

                  {allPricing.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No room types available</div>
                  ) : (
                    allPricing.map((p) => {
                      // Build a consistent service id key similar to the modal output
                      const serviceId = `${(p.property_type_slug || 'property')}-${p.room_type_slug}-${(p.category_slug || '').replace(/\s+/g, '')}`;
                      const qty = (cartItems && cartItems[serviceId] && cartItems[serviceId].count) || 0;
                      const serviceObj = {
                        id: serviceId,
                        title: p.room_type_name,
                        name: p.room_type_name,
                        description: p.room_description || '',
                        price: p.price,
                        discount_price: p.discount_price ?? null,
                        image: p.room_image || '',
                        room_type_id: p.room_type_id,
                        room_type_slug: p.room_type_slug,
                        category: p.category_name || category || '',
                        category_slug: p.category_slug || '',
                      };

                      return (
                        <div key={p.id} className="flex gap-4 items-start p-3 border-b last:border-b-0">
                          <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            <img src={p.room_image || '/steps/apart/1.png'} alt={p.room_type_name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{p.room_type_name}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.room_description || ''}</p>
                            <div className="text-sm text-gray-700 mt-2 flex items-center"><AEDIcon className="inline-block w-4 h-4 mr-2" />{p.discount_price ?? p.price}</div>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            {qty > 0 ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleRemoveItemClick && handleRemoveItemClick(serviceId)}
                                  className="w-8 h-8 rounded-full border border-[#01788e] text-[#01788e] bg-white flex items-center justify-center"
                                >
                                  −
                                </button>
                                <span className="min-w-[24px] text-center">{qty}</span>
                                <button
                                  onClick={() => handleAddItemsClick && handleAddItemsClick(serviceObj)}
                                  className="w-8 h-8 rounded-full border border-[#01788e] text-[#01788e] bg-white flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddItemsClick && handleAddItemsClick(serviceObj)}
                                className="px-3 py-1.5 border border-[#01788e] text-[#01788e] rounded text-sm"
                              >
                                ADD +
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
          {serviceItemLoading ? (
            <div className="h-[200px] md:h-[250px] bg-gray-200 rounded-sm flex items-center justify-center">
              <div className="text-gray-500">Loading service details...</div>
            </div>
          ) : serviceItem ? (
            <div>
              {/* Hero Image */}
              <div className="relative overflow-hidden h-[170px] md:h-[200px] mb-4">
                <img
                  src={serviceItem.image_url || "/steps/s1.png"}
                  alt={`${serviceItem.name} service`}
                  className="w-full h-full object-cover"
                />
                {/* Mobile Header Icons - Overlay on Hero Image */}
                  <div className="md:hidden absolute top-4 left-4 right-4 flex items-center justify-between">
                  <button className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center hover:bg-opacity-50 transition-all">
                    <ChevronLeft className="w-5 h-5 text-black" />
                  </button>
                  <button onClick={() => setSearchOpen(true)} className="w-10 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-center hover:bg-opacity-50 transition-all">
                    <Search className="w-5 h-5 text-black" />
                  </button>
                </div>
              </div>
              {/* Service Name below the image */}
              <div className="md:px-0 px-4">
                <div className="flex flex-row justify-between items-center px-4">
                  <h1 className="text-md md:text-lg font-bold text-gray-600 text-left">
                    {serviceItem.name}
                  </h1>
                  <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded transition-colors"
                  >
                    <Info className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {/* Rating Section */}
                <div className="flex items-center justify-between px-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-600 fill-current" />
                    <span className="text-sm text-gray-600">
                      {serviceItem.rating_text || "4.7/5 (15K bookings)"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Hero Image */}
              <div className="relative rounded-sm overflow-hidden h-[200px] md:h-[250px] mb-4">
                <img
                  src="/steps/s1.png"
                  alt={`${serviceSlug} service`}
                  className="w-full h-full object-cover"
                />
                {/* Mobile Header Icons - Overlay on Hero Image */}
                <div className="md:hidden absolute top-4 left-4 right-4 flex items-center justify-between">
                  <button className="w-10 h-10 rounded-full bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-all">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button onClick={() => setSearchOpen(true)} className="w-10 h-10 rounded-full bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-50 transition-all">
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </div>
                {/* Debug info */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                  Debug: serviceSlug="{serviceSlug}" | serviceItem:{" "}
                  {serviceItem ? "Found" : "Not found"}
                </div>
              </div>
              {/* Service Name below the image */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center px-4 capitalize">
                {serviceSlug.replace(/-/g, " ")}
              </h1>
              {/* Rating Section */}
              <div className="flex items-center justify-between px-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    4.7/5 (15K bookings)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Service Info</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">i</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile compact bottom-sheet search results (appears on mobile and sits above bottom bar) */}
      {searchOpen && (
        <div className="md:hidden fixed left-3 right-3 bottom-[72px] z-50 bg-white rounded-t-lg shadow-lg max-h-[55vh] overflow-y-auto">
          <div className="p-3 border-b flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search room types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="px-3 py-2 text-sm text-gray-600"
            >
              Close
            </button>
          </div>

          <div className="p-2">
            {allPricing.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No room types available</div>
            ) : (
              allPricing
                .filter((p) => {
                  if (!searchTerm) return true;
                  const q = searchTerm.toLowerCase();
                  return (
                    (p.room_type_name || "").toLowerCase().includes(q) ||
                    (p.room_description || "").toLowerCase().includes(q) ||
                    (p.category_name || "").toLowerCase().includes(q)
                  );
                })
                .map((p) => {
                  const serviceId = `${(p.property_type_slug || 'property')}-${p.room_type_slug}-${(p.category_slug || '').replace(/\s+/g, '')}`;
                  const qty = (cartItems && cartItems[serviceId] && cartItems[serviceId].count) || 0;
                  const serviceObj = {
                    id: serviceId,
                    title: p.room_type_name,
                    name: p.room_type_name,
                    description: p.room_description || '',
                    price: p.price,
                    discount_price: p.discount_price ?? null,
                    image: p.room_image || '',
                    room_type_id: p.room_type_id,
                    room_type_slug: p.room_type_slug,
                    category: p.category_name || category || '',
                    category_slug: p.category_slug || '',
                  };

                  return (
                    <div key={p.id} className="flex gap-3 items-start p-2 border-b last:border-b-0">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <img src={p.room_image || '/steps/apart/1.png'} alt={p.room_type_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800">{p.room_type_name}</h4>
                        <div className="text-xs text-gray-600 line-clamp-2">{p.room_description || ''}</div>
                        <div className="text-sm text-gray-700 mt-1 flex items-center"><AEDIcon className="inline-block w-4 h-4 mr-2" />{p.discount_price ?? p.price}</div>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        {qty > 0 ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRemoveItemClick && handleRemoveItemClick(serviceId)}
                              className="w-8 h-8 rounded-full border border-[#01788e] text-[#01788e] bg-white flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="min-w-[24px] text-center">{qty}</span>
                            <button
                              onClick={() => handleAddItemsClick && handleAddItemsClick(serviceObj)}
                              className="w-8 h-8 rounded-full border border-[#01788e] text-[#01788e] bg-white flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddItemsClick && handleAddItemsClick(serviceObj)}
                            className="px-3 py-1.5 border border-[#01788e] text-[#01788e] rounded text-sm"
                          >
                            ADD +
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* Main Content Container with Padding */}
      <div>
        {/* Sticky Tabs */}
        <div className="sticky top-0 -mx-4 border-b border-gray-200 z-30 mb-4 bg-white">
          {/* Categories Section */}
          <div className="p-3 bg-white">
            <div className="relative">
              {/* Left Arrow - Hidden on mobile */}
              <button
                onClick={() => scrollCategories("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-1 hidden md:block bg-white shadow-sm rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {/* Categories Container - Full width on mobile, with margins on desktop */}
              <div
                ref={categoryRef}
                className="flex gap-3 overflow-x-auto mx-0 md:mx-6 w-full md:w-auto py-1"
                style={{ 
                  scrollbarWidth: "none", 
                  msOverflowStyle: "none"
                }}
              >
                {displayCategories.map((cat) => {
                  const isSelected = selected === cat.slug;
                  console.log(
                    `Rendering category ${cat.name} (${cat.slug}): selected=${isSelected}, current selected=${selected}`
                  );

                  return (
                    <button
                      key={cat.slug}
                      data-category={cat.slug}
                      onClick={() => {
                        console.log(
                          `Category button clicked: ${cat.name} (${cat.slug})`
                        );
                        scrollToCategory(cat.slug);
                      }}
                      className={`flex items-center gap-2 min-w-fit px-4 py-2 rounded-full transition-all duration-200 ${
                        isSelected
                          ? "bg-orange-50 border-2 border-orange-400 text-orange-500 shadow-sm"
                          : "bg-white border border-[#01788e] text-gray-600"
                      }`}
                    >
                      {/* Circular Icon */}
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={cat.icon_url || cat.hero_image_url || "/icons/pest.webp"}
                          alt={`${cat.name} icon`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium capitalize whitespace-nowrap">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow - Hidden on mobile */}
              <button
                onClick={() => scrollCategories("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-1 hidden md:block bg-white shadow-sm rounded-full"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* End sticky wrapper */}
        </div>

        {/* Services Content */}
        <div className="flex-1">
          {searchOpen && searchTerm ? (
            <SearchResults />
          ) : (
            <div className="space-y-8">
              {/* Render all category sections */}
              {displayCategories.map((cat) => (
                <CategorySection key={cat.slug} category={cat} />
              ))}

              {/* Special Instructions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-gray-800">
                  Special Instructions
                </h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requirements or instructions for our team..."
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Service Options Modal */}
        <ServiceOptionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyType={selectedPropertyType}
          propertyTypeId={selectedPropertyTypeId}
          category={modalCategory} // FIXED: Use modalCategory instead of selected
          onAddService={handleModalAddService}
          onRemoveService={handleModalRemoveService}
          // NEW: Add context for complete selection information
          context={{
            selectedCategory: modalCategory,
            selectedServiceItemsCategory: selectedServiceItemsCategory, // Pass the actual service items category name
            selectedPropertyType: selectedPropertyType,
            selectedServiceItem: serviceSlug || "Service", // Use serviceSlug if available
          }}
        />

        {/* Service Info Modal */}
        {isInfoModalOpen && (
          <div className="fixed inset-0 flex justify-end items-end z-[100] md:items-center md:justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              onClick={() => setIsInfoModalOpen(false)}
            />

            <div className="bg-white rounded-t-lg shadow-lg w-full mx-0 z-[110] md:mx-0 md:max-w-md md:rounded-sm">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="font-bold text-lg text-gray-800">
                    Our {serviceItem?.name || serviceSlug?.replace(/-/g, " ")}{" "}
                    service includes:
                  </h2>
                  <button
                    onClick={() => setIsInfoModalOpen(false)}
                    aria-label="Close modal"
                    className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        High-quality, municipality-approved treatment carried
                        out by a licensed pest control company
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Treatments are safe and suitable for your homes and
                        gardens, and safe for children and pets
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        One month guarantee with one free follow up visit is
                        included in the service
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StepOne;
