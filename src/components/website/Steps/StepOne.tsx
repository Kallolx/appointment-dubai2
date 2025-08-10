import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const category = [
  "general",
  "cockroaches",
  "ants",
  "bed bugs",
  "rodents",
  "mosquitoes",
];

const StepOne = ({ handleAddItemsClick, handleRemoveItemClick, cartItems }) => {
  const [selected, setSelected] = useState("General");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  // Ref for category scroll container
  const categoryRef = useRef(null);

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

  // add items to cart

  // Group services by category with search filtering
  const servicesByCategory = category.reduce((acc, cat) => {
    acc[cat] = services.filter(
      (s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        s.category === cat
    );
    return acc;
  }, {});

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
    else setSearchTerm("");
  }, [searchOpen]);

  // Refs for each category section
  const sectionRefs = useRef({});

  // Scroll container ref for services list
  const scrollContainerRef = useRef(null);

  // Detect current category based on scroll position (services list)
  useEffect(() => {
    if (searchOpen) return; // skip while searching

    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollTop = scrollContainerRef.current.scrollTop;
      const containerOffsetTop = scrollContainerRef.current.offsetTop;

      let currentCat = selected;

      for (const cat of category) {
        const section = sectionRefs.current[cat];
        if (section) {
          const offsetTop = section.offsetTop - containerOffsetTop;
          const offsetHeight = section.offsetHeight;
          if (
            scrollTop >= offsetTop - 50 &&
            scrollTop < offsetTop + offsetHeight - 50
          ) {
            currentCat = cat;
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
  }, [category, selected, searchOpen]);

  // Scroll to section when category clicked
  const scrollToCategory = (cat) => {
    if (!sectionRefs.current[cat]) return;

    sectionRefs.current[cat].scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    setSelected(cat);
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

  return (
    <div className="flex flex-col h-auto md:h-[500px]  rounded shadow-lg w-full max-w-full min-w-0">
      {/* Fixed top category & search bar */}
      <div className="flex items-center gap-4  bg-white sticky top-0 z-10 py-4 ">
        {/* Search input with icon inside */}
        <div className="relative flex items-center flex-shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-opacity duration-300 ${
              searchOpen ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-label="Open search"
            style={{ backgroundColor: "transparent" }}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          <div
            className={`relative flex items-center transition-all duration-300 ease-in-out ${
              searchOpen
                ? "w-64 opacity-100 md:ml-2"
                : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <Search
              className="absolute left-3 w-5 h-5 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in Furniture cleaning"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full outline-none focus:ring-0 focus:border-gray-400"
            />
          </div>

          {searchOpen && (
            <button
              onClick={() => setSearchOpen(false)}
              className="ml-2 text-[#00C3FF] font-semibold hover:underline whitespace-nowrap"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Categories - horizontally scrollable with arrows */}
        {!searchOpen && (
          <div className="flex items-center gap-2 w-[85%] md:w-11/12">
            {/* Left Arrow */}
            <button
              aria-label="Scroll categories left"
              onClick={() => scrollCategories("left")}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Scrollable categories container */}
            <div
              ref={categoryRef}
              style={{
                // Hide scrollbar styles
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE & Edge
              }}
              className="flex gap-2 overflow-x-auto whitespace-nowrap flex-1 hide-scrollbar"
            >
              {category.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2  capitalize rounded-full transition-all duration-300 ease-in-out flex-shrink-0 ${
                    selected === cat
                      ? "bg-[#00B9F2] text-white font-bold"
                      : "bg-white text-[#666666] font-bold"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              aria-label="Scroll categories right"
              onClick={() => scrollCategories("right")}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Scrollable services list */}
      <div
        ref={scrollContainerRef}
        style={{
          // Hide scrollbar styles
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE & Edge
        }}
        className="overflow-y-auto flex-1 mb-16 p-1 md:p-4 space-y-6 bg-gray-50"
      >
        {isLoading && <p>Loading services...</p>}
        {error && <p>Error loading services.</p>}

        {/* Show 'No services found' only if all categories have zero filtered services */}
        {!isLoading &&
          !error &&
          category.every((cat) => servicesByCategory[cat]?.length === 0) && (
            <p>No services found.</p>
          )}

        {category.map((cat) => (
          <div
            key={cat}
            ref={(el) => (sectionRefs.current[cat] = el)}
            className="mb-8 "
          >
            {servicesByCategory[cat]?.length > 0 && (
              <>
                <h3 className="text-2xl  font-semibold capitalize mb-4 ml-3">
                  {cat}
                </h3>
                <img
                  src={"/cover.webp"}
                  className="w-full object-cover rounded"
                />
                {/* for desktop view */}
                {servicesByCategory[cat].map((service, idx) => (
                  <div
                    key={idx}
                    ref={scrollContainerRef}
                    className="rounded md:p-2 shadow-sm md:flex flex-col md:flex-row items-start md:items-center gap-4 mb-4 bg-white hidden"
                  >
                    <img
                      src={service.img}
                      alt={service.title}
                      className="w-full md:w-32 h-32 object-cover rounded"
                    />
                    <div className="flex-1 w-full">
                      <h4 className="text-base md:text-lg font-semibold">
                        {service.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Category: {service.description || cat}
                      </p>

                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex gap-2 items-center">
                          <span className="text-sm sm:text-base">
                            AED {service.discountPrice}
                          </span>
                          <span className="text-xs sm:text-sm line-through text-gray-400">
                            AED {service.previousPrice}
                          </span>
                        </div>

                        <div>
                          {(cartItems[service.id]?.count || 0) === 0 ? (
                            <button
                              onClick={() => handleAddItemsClick(service)}
                              className="bg-[#00B9F2] hover:bg-[#0099CC] text-white font-semibold px-4 py-1 rounded-full text-sm sm:text-base"
                            >
                              Add +
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#F6F8FA] rounded-full px-2 py-1 space-x-3">
                              <button
                                onClick={() =>
                                  handleRemoveItemClick(service.id)
                                }
                                className="bg-white text-[#00B9F2] hover:text-white hover:bg-[#00B9F2] w-7 h-7 rounded-full text-lg font-bold flex items-center justify-center transition"
                              >
                                −
                              </button>
                              <span className="text-black font-semibold">
                                {cartItems[service.id].count}
                              </span>
                              <button
                                onClick={() => handleAddItemsClick(service)}
                                className="bg-white text-[#00B9F2] hover:text-white hover:bg-[#00B9F2] w-7 h-7 rounded-full text-lg font-bold flex items-center justify-center transition"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* for mobile view */}
                {servicesByCategory[cat].map((service, idx) => (
                  <div
                    key={idx}
                    ref={scrollContainerRef}
                    style={{
                      // Hide scrollbar styles
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE & Edge
                    }}
                    className="flex items-start hide-scrollbar gap-4 p-4 bg-white rounded shadow-sm md:hidden"
                  >
                    <img
                      src={service.img}
                      alt={service.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Category: {service.description || cat}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-800">
                          AED {service.discountPrice}
                          <span className="line-through text-gray-400 text-xs ml-1">
                            AED {service.previousPrice}
                          </span>
                        </div>
                        <div>
                          {(cartItems[service.id]?.count || 0) === 0 ? (
                            <button
                              onClick={() => handleAddItemsClick(service)}
                              className="bg-[#00B9F2] hover:bg-[#0099CC] text-white font-semibold px-4 py-1 rounded-full text-sm sm:text-base"
                            >
                              Add +
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#F6F8FA] rounded-full px-2 py-1 space-x-3">
                              <button
                                onClick={() =>
                                  handleRemoveItemClick(service.id)
                                }
                                className="bg-white text-[#00B9F2] hover:text-white hover:bg-[#00B9F2] w-7 h-7 rounded-full text-lg font-bold flex items-center justify-center transition"
                              >
                                −
                              </button>
                              <span className="text-black font-semibold">
                                {cartItems[service.id].count}
                              </span>
                              <button
                                onClick={() => handleAddItemsClick(service)}
                                className="bg-white text-[#00B9F2] hover:text-white hover:bg-[#00B9F2] w-7 h-7 rounded-full text-lg font-bold flex items-center justify-center transition"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepOne;
