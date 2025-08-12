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

const category = [
  { name: "general", image: "/general_cleaning/homecleaning.webp" },
  { name: "cockroaches", image: "/pest.webp" },
  { name: "mosquitoes", image: "/pest.webp" },
  { name: "ants", image: "/pest.webp" },
  { name: "bed bugs", image: "/pest.webp" },
];

// Category configuration with specific images for hero banners
const categoryConfig = {
  general: {
    heroImage: "/general_cleaning/homecleaning.webp",
    title: "General"
  },
  cockroaches: {
    heroImage: "/general_cleaning/deepcleaning.webp",
    title: "Cockroaches"
  },
  ants: {
    heroImage: "/general_cleaning/243.webp",
    title: "Ants"
  },
  mosquitoes: {
    heroImage: "/general_cleaning/345.webp",
    title: "Mosquitoes"
  },
  "bed bugs": {
    heroImage: "/general_cleaning/deepcleaning.webp",
    title: "Bed Bugs"
  }
};

// Property types data
const propertyTypes = [
  {
    name: "Apartment",
    description: "Get rid of common pests and keep your home safe with General Pest Control.",
    price: "199",
    image: "/general_cleaning/homecleaning.webp"
  },
  {
    name: "Villa",
    description: "Keep your villa pest-free with our easy and effective General Pest Control service.",
    price: "299",
    image: "/general_cleaning/homecleaning.webp"
  }
];

const StepOne = ({ handleAddItemsClick, handleRemoveItemClick, cartItems }) => {
  const [selected, setSelected] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  // NEW: Store the category that was selected when opening the modal
  const [modalCategory, setModalCategory] = useState("");
  const inputRef = useRef(null);
  const categoryRef = useRef(null);
  const sectionRefs = useRef({});
  const scrollContainerRef = useRef(null);

  const {
    data: services = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      try {
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        console.log("Fetched services:", data);
        return data;
      } catch (err) {
        console.error("Error fetching services:", err);
        throw err;
      }
    },
  });

  // Group services by category with search filtering
  const servicesByCategory = category.reduce((acc, cat) => {
    acc[cat.name] = services.filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        s.category === cat.name
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
    if (searchOpen) return; // skip while searching

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollTop = scrollContainerRef.current.scrollTop;
      const containerOffsetTop = scrollContainerRef.current.offsetTop;

      let currentCat = selected;

      for (const cat of category) {
        const section = sectionRefs.current[cat.name];
        if (section) {
          const offsetTop = section.offsetTop - containerOffsetTop;
          const offsetHeight = section.offsetHeight;
          if (
            scrollTop >= offsetTop - 50 &&
            scrollTop < offsetTop + offsetHeight - 50
          ) {
            currentCat = cat.name;
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
  }, [category, selected]);

  // Scroll to section when category clicked
  const scrollToCategory = (catName) => {
    if (!sectionRefs.current[catName]) return;

    sectionRefs.current[catName].scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    setSelected(catName);
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
      // FIXED: Store the current category when opening modal
      setModalCategory(currentCategory);
      setIsModalOpen(true);
    };

    return (
      <div className="flex gap-4 items-center bg-white pb-4 border-b border-gray-300">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={property.image}
            alt={`${property.name} Cleaning`}
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-base md:text-xl font-semibold mb-1">{property.name}</h3>
          <p className="text-gray-500 text-xs md:text-sm mb-2">
            {property.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-500">
                Starting from
              </span>
              <span className="text-base md:text-lg font-semibold">AED {property.price}</span>
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
  const CategorySection = ({ categoryName }) => {
    const config = categoryConfig[categoryName];
    if (!config) return null;

    return (
      <div ref={(el) => (sectionRefs.current[categoryName] = el)}>
        {/* Hero Banner */}
        <div className="relative mb-8 rounded-sm overflow-hidden h-[200px]">
          <img
            src={config.heroImage}
            alt={`${config.title} Cleaning`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 items-center bg-black bg-opacity-20 flex">
            <div className="text-white w-full flex justify-center items-center">
              <h2 className="text-4xl font-bold">{config.title}</h2>
            </div>
          </div>
        </div>

        {/* Property Type Cards */}
        <div className="mb-8 space-y-4">
          {propertyTypes.map((property, index) => (
            <PropertyTypeCard 
              key={index} 
              property={property} 
              currentCategory={categoryName} 
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

  if (isLoading) return <div className="px-4 py-6">Loading services...</div>;
  if (error) return <div className="px-4 py-6">Error loading services.</div>;

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
            {category.map((cat) => (
              <button
                key={cat.name}
                onClick={() => scrollToCategory(cat.name)}
                className={`flex items-center gap-2 min-w-fit px-4 py-2 rounded-full transition-all ${
                  selected === cat.name
                    ? "bg-blue-50 border border-black"
                    : "bg-gray-50 border border-black"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-6 h-6 object-cover rounded-full"
                />
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
            {category.map((cat) => (
              <CategorySection key={cat.name} categoryName={cat.name} />
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