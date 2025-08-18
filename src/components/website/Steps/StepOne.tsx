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

const StepOne = ({ handleAddItemsClick, handleRemoveItemClick, cartItems }) => {
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

  // Fetch service categories from API
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/api/service-categories'));
      if (!response.ok) {
        throw new Error('Failed to fetch categories from database');
      }
      const data = await response.json();
      console.log('Categories fetched from database:', data);
      return data;
    },
  });

  // Fetch property types from API
  const {
    data: propertyTypes = [],
    isLoading: propertyTypesLoading,
    error: propertyTypesError,
  } = useQuery({
    queryKey: ["property-types"],
    queryFn: async () => {
      const response = await fetch(buildApiUrl('/api/property-types'));
      if (!response.ok) {
        throw new Error('Failed to fetch property types from database');
      }
      const data = await response.json();
      console.log('Property types fetched from database:', data);
      return data;
    },
  });

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
      setSelected(categories[0].slug);
    }
  }, [categories, selected]);

  // Group services by category with search filtering (for legacy search)
  const servicesByCategory = categories.reduce((acc, cat) => {
    acc[cat.slug] = services.filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        s.category === cat.slug
    );
    return acc;
  }, {});

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    else setSearchTerm("");
  }, [searchOpen]);

  // Detect current category based on scroll position (services list)
  useEffect(() => {
    if (searchOpen || categories.length === 0) return; // skip while searching

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollTop = scrollContainerRef.current.scrollTop;
      const containerOffsetTop = scrollContainerRef.current.offsetTop;

      let currentCat = selected;

      for (const cat of categories) {
        const section = sectionRefs.current[cat.slug];
        if (section) {
          const offsetTop = section.offsetTop - containerOffsetTop;
          const offsetHeight = section.offsetHeight;
          if (
            scrollTop >= offsetTop - 50 &&
            scrollTop < offsetTop + offsetHeight - 50
          ) {
            currentCat = cat.slug;
            break;
          }
        }
      }
      if (currentCat !== selected) setSelected(currentCat);
    };

    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [categories, selected, searchOpen]);

  // Scroll to section when category clicked
  const scrollToCategory = (catSlug) => {
    if (!sectionRefs.current[catSlug]) return;

    sectionRefs.current[catSlug].scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    setSelected(catSlug);
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
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-500">
                Starting from
              </span>
              <span className="text-base md:text-lg font-semibold">
                AED {property.base_price || property.price}
              </span>
            </div>
            <Button
              variant="outline"
              className="flex text-primary items-center gap-1 px-3 py-1 md:px-4 md:py-2 text-xs md:text-base"
              onClick={handleOptionsClick}
            >
              Options
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Component for rendering category section
  const CategorySection = ({ category }) => {
    if (!category) return null;

    return (
      <div ref={(el) => (sectionRefs.current[category.slug] = el)}>
        {/* Hero Banner */}
        <div className="relative mb-8 rounded-sm overflow-hidden h-[200px]">
          <img
            src={category.hero_image_url || "/steps/s1.png"}
            alt={`${category.name} Cleaning`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 items-center bg-black bg-opacity-20 flex">
          </div>
        </div>

        {/* Property Type Cards */}
        <div className="mb-8 space-y-4">
          {propertyTypes.map((property, index) => (
            <PropertyTypeCard
              key={index}
              property={property}
              currentCategory={category.slug}
            />
          ))}
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

  if (categoriesLoading || propertyTypesLoading) {
    return <div className="px-4 py-6">Loading services from database...</div>;
  }
  
  if (categoriesError || propertyTypesError) {
    console.error('Database fetch errors:', { categoriesError, propertyTypesError });
    return (
      <div className="px-4 py-6">
        <div className="text-red-600 font-semibold">Error loading services from database:</div>
        {categoriesError && <div className="text-sm text-red-500">Categories: {categoriesError.message}</div>}
        {propertyTypesError && <div className="text-sm text-red-500">Property types: {propertyTypesError.message}</div>}
        <div className="text-sm text-gray-600 mt-2">Please check console for detailed logs.</div>
      </div>
    );
  }

  console.log('Final data loaded:', { 
    categories: categories?.length, 
    propertyTypes: propertyTypes?.length,
    categoriesList: categories,
    propertyTypesList: propertyTypes
  });

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
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Categories Container */}
            <div
              ref={categoryRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide mx-6 max-w-[calc(100vw-100px)] md:max-w-[600px]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={`flex items-center gap-2 min-w-fit px-4 py-2 rounded-full transition-all ${
                    selected === cat.slug
                      ? "bg-gray-50 border border-black"
                      : "bg-gray-50 border border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700 capitalize whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 hover:bg-gray-100"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
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
            {categories.map((cat) => (
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
