import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

const StepTwo = ({
  handleAddItemsClick,
  handleRemoveItemClick,
  cartItems,
  onSelectionChange,
}) => {
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        date: "14 Aug 2025",
      });
    }
  }, [onSelectionChange]);
  const {
    data: popular = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["popular"],
    queryFn: async () => {
      const res = await fetch("/data2.json");
      if (!res.ok) throw new Error("Failed to fetch popular");
      return res.json();
    },
  });

  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -208, behavior: "smooth" }); // Match card width
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 208, behavior: "smooth" });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading popular services.</p>;

  return (
    <div className="h-[500px] px-4 md:px-0">
      <h2 className="font-bold mb-4">People also added</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-sky-500" />
        </button>

        {/* Scrollable Horizontal Cards */}
        <div
          ref={scrollRef}
          style={{
            // Hide scrollbar styles
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE & Edge
          }}
          className="category-scroll flex overflow-x-auto space-x-4 px-8  pb-10 snap-x snap-mandatory"
        >
          {popular.map((service, index) => (
            <div
              key={index}
              className="w-44 flex-shrink-0 snap-start rounded-lg border-2 border-gray-300 hover:border-sky-400 transition-colors duration-300 flex flex-col justify-between bg-white"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-28 w-full object-cover rounded-md mb-2"
              />

              <div className="pl-3  ">
                <h4 className="font-semibold text-sm">{service.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {service.description}
                </p>

                <a href="#" className="text-sky-600 text-sm font-medium mt-1">
                  Learn more
                </a>

                <div className="text-sm font-semibold mt-1 pb-5">
                  AED {service.currentPrice}
                  <span className="line-through text-gray-400 text-xs ml-2">
                    AED {service.previousPrice}
                  </span>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="absolute -bottom-4">
                  {(cartItems[service.id]?.count || 0) === 0 ? (
                    <button
                      onClick={() => handleAddItemsClick(service)}
                      className="bg-[#00B9F2] hover:bg-[#0099CC] text-white font-semibold px-4 py-1 rounded-full transition duration-300 ease-in-out"
                    >
                      Add +
                    </button>
                  ) : (
                    <div className="flex items-center bg-[#F6F8FA] rounded-full px-2 py-1 space-x-3">
                      <button
                        onClick={() => handleRemoveItemClick(service.id)}
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
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-1 rounded-full"
        >
          <ChevronRight className="h-5 w-5 text-sky-500" />
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
