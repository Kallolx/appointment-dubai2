import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="md:mb-10 mb-1 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="md:text-2xl text-xl font-semibold">{heading}</h2>
        <div className="flex items-center space-x-2">
          <Link to={`/single-category/${heading}`} className="text-[#00c3ff]">
            See All
          </Link>
          <button
            onClick={() => scroll("left")}
            className="rounded-full border border-gray-300 hover:bg-gray-300 bg-white 
                   text-sm font-medium 
                   cursor-pointer p-1"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border border-gray-300 hover:bg-gray-300 bg-white 
                   text-sm font-medium 
                   cursor-pointer p-1"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Scrollable Service Cards */}
      <div
        ref={scrollRef}
        style={{
          // Hide scrollbar styles
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE & Edge
        }}
        className="flex overflow-x-auto space-x-4 pb-2 scroll-smooth no-scrollbar"
      >
        {services.map((service, index) => {
          // Determine the correct link based on whether it's a service item or category
          const linkTo = service.isServiceItem && service.slug 
            ? `/service-item/${service.slug}` 
            : `/service/${encodeURIComponent(service.title)}`;
            
          return (
            <div
              key={index}
              className="min-w-[240px] hover:cursor-pointer rounded-md flex flex-col"
            >
              <Link
                to={linkTo}
                className="relative block"
              >
                {/* Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-md"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black rounded-md opacity-20 hover:opacity-0 transition-opacity "></div>
              </Link>
              {/* Title */}
              <p className="font-bold pt-2 text-left">{service.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSection;
