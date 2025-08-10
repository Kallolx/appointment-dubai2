import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

type Service = {
  title: string;
  image: string;
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
        {services.map((service, index) => (
          <div
            key={index}
            className=" min-w-[180px] bg-white overflow-hidden hover:cursor-pointer "
          >
            <Link
              to={`/service/${heading}`}
              className="relative transition-transform hover:scale-105 "
            >
              {/* Image */}
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-32 object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-30 hover:opacity-0 transition-opacity "></div>
            </Link>

            {/* Title */}
            <p className="font-medium py-2">{service.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
