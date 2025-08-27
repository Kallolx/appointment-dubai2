import { ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

type Service = {
  title: string;
  image: string;
  slug?: string; // Add slug for service items
  isServiceItem?: boolean; // Flag to distinguish between categories and items
};

type Props = {
  heading: string;
  services: Service[];
};

const ServiceSection: React.FC<Props> = ({ heading, services }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative md:mb-14 mb-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-2xl text-xl font-semibold">{heading}</h2>
      </div>

      {/* Scrollable Service Cards */}
      <div
        ref={scrollRef}
        style={{
          // Hide scrollbar styles
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE & Edge
        }}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-2 scroll-smooth no-scrollbar px-2 sm:px-0"
      >
        {services.map((service, index) => {
          // Determine the correct link based on whether it's a service item or category
          const linkTo =
            service.isServiceItem && service.slug
              ? `/service-item/${service.slug}`
              : `/service/${encodeURIComponent(service.title)}`;

          return (
            <div
              key={index}
              className="min-w-[120px] sm:min-w-[160px] md:min-w-[240px] hover:cursor-pointer rounded-md flex flex-col"
            >
              <Link to={linkTo} className="relative block">
                {/* Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-28 sm:h-36 md:h-48 object-cover rounded-md"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black rounded-md opacity-20 hover:opacity-0 transition-opacity "></div>
              </Link>
              {/* Title */}
              <p className="font-bold pt-2 text-left text-xs sm:text-sm md:text-lg truncate">{service.title}</p>
            </div>
          );
        })}
      </div>

      {/* Floating next button on the right of the cards */}
      <button
        onClick={() => scroll("right")}
        aria-label="Next services"
        className="hidden md:inline-flex absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-[#01788e] text-white rounded-full p-3 shadow-lg hover:shadow-xl focus:outline-none"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ServiceSection;
