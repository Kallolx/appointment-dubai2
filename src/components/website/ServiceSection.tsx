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
    <div className="relative md:mb-14 p-4 mb-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-2xl text-gray-600 text-xl font-bold">{heading}</h2>
      </div>

      {/* Scrollable Service Cards */}
      <div
        ref={scrollRef}
        style={{
          // Hide scrollbar styles
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE & Edge
        }}
        className="flex overflow-x-auto space-x-3 sm:space-x-4 scroll-smooth no-scrollbar sm:px-0"
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
              className="max-w-[160px] md:max-w-[320px] hover:cursor-pointer rounded-sm flex flex-col"
            >
              <Link to={linkTo} className="relative block">
                {/* Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-20 md:h-40 object-cover rounded-sm"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black rounded-md opacity-20 hover:opacity-0 transition-opacity "></div>
              </Link>
              {/* Title */}
              <p className="font-semibold pt-2 text-lefttext-md md:text-lg max-w-[120px] sm:max-w-[140px] md:max-w-[200px]">{service.title}</p>
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
