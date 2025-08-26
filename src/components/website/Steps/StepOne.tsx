import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ServiceOptionsModal from "@/components/website/ServiceOptionsModal";
import { buildApiUrl } from "@/config/api";

// No fallback data - force database usage only

const StepOne = ({ 
  handleAddItemsClick, 
  handleRemoveItemClick, 
  cartItems, 
  category, 
  serviceSlug 
}) => {
  console.log('StepOne props received:', { category, serviceSlug });
  const [selected, setSelected] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [modalCategory, setModalCategory] = useState("");
  const inputRef = useRef(null);
  const categoryRef = useRef(null);
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);

  // Fetch service items categories from API (these will be shown in the tabs)
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["service-items-category", category, serviceSlug],
    queryFn: async () => {
      let url = buildApiUrl('/api/service-items-category');
      
      console.log('StepOne received params:', { category, serviceSlug });
      
      // If we have a specific service item (serviceSlug), filter by that service item only
      if (serviceSlug) {
        url += `?parentServiceItemSlug=${encodeURIComponent(serviceSlug)}`;
        console.log('Filtering by serviceSlug:', serviceSlug);
      } else if (category) {
        // Legacy: filter by category if no specific service item
        url += `?parentCategorySlug=${encodeURIComponent(category)}`;
        console.log('Filtering by category:', category);
      } else {
        // Only fetch all categories when no specific filtering is needed
        url += '?limit=100&active=true';
        console.log('Fetching ALL active categories');
      }
      
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch service items categories from database');
      }
      const data = await response.json();
      console.log('Service items categories fetched from database:', data);
      console.log('Number of categories found:', data.length);
      data.forEach((cat, index) => {
        console.log(`Category ${index}:`, {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          parent_category_name: cat.parent_category_name,
          parent_category_slug: cat.parent_category_slug,
          is_active: cat.is_active
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

  // Set initial selected category when categories load
  useEffect(() => {
    if (categories.length > 0 && !selected) {
      // Always select the first available category
      setSelected(categories[0].slug);
    }
  }, [categories, selected]);

  // Determine which categories to show
  // When serviceSlug is provided, show only categories for that service item
  // When category is provided, show only categories for that category
  // Otherwise, show all categories
  const displayCategories = categories;

  // Debug logging for display categories
  console.log('Display categories debug:', {
    totalCategories: categories.length,
    displayCategoriesCount: displayCategories.length,
    serviceSlug,
    category,
    categoriesList: categories.map(cat => ({ id: cat.id, name: cat.name, slug: cat.slug, is_active: cat.is_active })),
    displayCategoriesList: displayCategories.map(cat => ({ id: cat.id, name: cat.name, slug: cat.slug, is_active: cat.is_active }))
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

  // Detect current category based on scroll position (services list)
  useEffect(() => {
    if (searchOpen || displayCategories.length === 0) return; // skip while searching

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;

      let currentCat = selected;
      let minDistance = Infinity;

      for (const cat of displayCategories) {
        const section = sectionRefs.current[cat.slug];
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionCenter = sectionTop + sectionHeight / 2;
          const distance = Math.abs(scrollTop + windowHeight / 2 - sectionCenter);

          if (distance < minDistance) {
            minDistance = distance;
            currentCat = cat.slug;
          }
        }
      }
      
      // Only update if the detected category is significantly different
      // This prevents the scroll detection from overriding manual clicks
      if (currentCat !== selected && minDistance < 100) {
        console.log('Scroll detection updating selected from', selected, 'to', currentCat, 'distance:', minDistance);
        setSelected(currentCat);
        // Also scroll the category tab into view
        scrollCategoryIntoView(currentCat);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [displayCategories, selected, searchOpen]);

  // Scroll to section when category clicked
  const scrollToCategory = (catSlug) => {
    console.log('scrollToCategory called with:', catSlug);
    console.log('Current selected before update:', selected);
    
    // Update selected state immediately
    setSelected(catSlug);
    
    // Add a small delay to prevent scroll detection from overriding
    setTimeout(() => {
      // Then scroll to the section
      if (!sectionRefs.current[catSlug]) {
        console.log('Section ref not found for:', catSlug);
        return;
      }

      // Scroll to the section with offset to account for sticky header
      const section = sectionRefs.current[catSlug];
      const headerHeight = 120; // Approximate height of sticky header
      const sectionTop = section.offsetTop - headerHeight;
      
      // Use window.scrollTo for page scrolling
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }, 50);
    
    console.log('Selected state updated to:', catSlug);
  };

  // Scroll category tab into view
  const scrollCategoryIntoView = (catSlug) => {
    if (!categoryRef.current) return;
    
    const categoryButton = categoryRef.current.querySelector(`[data-category="${catSlug}"]`);
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
  const PropertyTypeCard = ({ property, currentCategory }) => {
    const handleOptionsClick = () => {
      console.log('PropertyTypeCard - handleOptionsClick called with:', {
        propertyName: property.name,
        currentCategory: currentCategory,
        property: property
      });
      setSelectedPropertyType(property.name);
      setModalCategory(currentCategory);
      setIsModalOpen(true);
    };

    return (
      <div className="flex gap-4 items-center bg-white pb-4 border-b border-gray-300">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={property.image_url || property.image}
            alt={`${property.name} Cleaning`}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-base md:text-xl font-semibold mb-1">
            {property.name}
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mb-2">
            {property.description}
          </p>
                     <div className="flex justify-between items-center">
             <div className="flex flex-col md:flex-row md:items-center md:gap-2">
               <span className="text-xs md:text-sm text-gray-500 font-normal">
                 Starting from
               </span>
               <span className="text-sm md:text-lg font-semibold">
                 AED {property.base_price || property.price}
               </span>
             </div>
            <button
              className="flex text-primary items-center gap-1 p-2 text-xs border border-primary"
              onClick={handleOptionsClick}
            >
              Options
              <ChevronRight className="w-4 h-4" />
            </button>
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
        const response = await fetch(buildApiUrl(`/api/service-items-category-property-types/${encodeURIComponent(category.slug)}`));
        if (!response.ok) {
          if (response.status === 404) {
            console.log('No property types configured for category:', category.slug);
            return [];
          }
          throw new Error('Failed to fetch property types for service category');
        }
        const data = await response.json();
        console.log('Property types for category:', category.slug, data);
        data.forEach((prop, index) => {
          console.log(`Property type ${index} for category ${category.slug}:`, {
            id: prop.id,
            name: prop.name,
            slug: prop.slug,
            image_url: prop.image_url,
            description: prop.description
          });
        });
        return data;
      },
      enabled: !!category.slug,
    });

         return (
       <div ref={(el) => (sectionRefs.current[category.slug] = el)}>
         {/* Hero Banner */}
         <div className="relative mb-8 rounded-sm overflow-hidden h-[200px]">
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
                <span className="font-bold text-blue-600">
                  AED {service.currentPrice}
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
    console.error('Database fetch errors:', { 
      categoriesError
    });
    return (
      <div className="px-4 py-6">
        <div className="text-red-600 font-semibold">Error loading services from database:</div>
        {categoriesError && <div className="text-sm text-red-500">Service Items Categories: {categoriesError.message}</div>}
        <div className="text-sm text-gray-600 mt-2">Please check console for detailed logs.</div>
      </div>
    );
  }

  console.log('Final data loaded:', { 
    serviceItemsCategories: categories?.length,
    serviceItemsCategoriesList: categories,
    serviceSlug,
    category,
    displayCategories: displayCategories?.length,
    displayCategoriesList: displayCategories,
    isFilteredByServiceItem: !!serviceSlug,
    isFilteredByCategory: !!category
  });

  // Additional debugging: Check if any categories are inactive
  if (categories && categories.length > 0) {
    const inactiveCategories = categories.filter(cat => !cat.is_active);
    if (inactiveCategories.length > 0) {
      console.log('Inactive categories found:', inactiveCategories.map(cat => cat.name));
    }
  }

  const handleModalAddService = (service) => {
    handleAddItemsClick(service);
  };

  const handleModalRemoveService = (service) => {
    handleRemoveItemClick(service.id);
  };

  return (
    <div className="px-4 md:px-0">
      {/* Sticky Search Bar + Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-4">
        {/* Search Bar */}
        <div className="mb-4 px-2 pt-2 pb-2 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* Categories Section */}
        <div className="p-2 pt-0 bg-white">
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Categories Container */}
            <div
              ref={categoryRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide mx-6"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                             {displayCategories.map((cat) => {
                 const isSelected = selected === cat.slug;
                 console.log(`Rendering category ${cat.name} (${cat.slug}): selected=${isSelected}, current selected=${selected}`);
                 
                 return (
                   <button
                     key={cat.slug}
                     data-category={cat.slug}
                     onClick={() => {
                       console.log(`Category button clicked: ${cat.name} (${cat.slug})`);
                       scrollToCategory(cat.slug);
                     }}
                                           className={`flex items-center gap-2 min-w-fit px-4 py-2 rounded-full transition-all duration-200 ${
                        isSelected
                          ? "bg-gray-100 border-2 border-gray-400 text-gray-800 shadow-sm"
                          : "bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                      }`}
                   >
                     <span className="text-sm font-medium capitalize whitespace-nowrap">
                       {cat.name}
                     </span>
                   </button>
                 );
               })}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-50 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* End sticky wrapper */}
      </div>

      {/* Services Content */}
      <div
        ref={scrollContainerRef}
        className="flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
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
        category={modalCategory} // FIXED: Use modalCategory instead of selected
        onAddService={handleModalAddService}
        onRemoveService={handleModalRemoveService}
      />
    </div>
  );
};

export default StepOne;

