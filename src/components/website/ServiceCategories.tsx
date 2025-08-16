import { Link } from "react-router-dom";

interface Service {
  name: string;
  icon: string;
}

const services: Service[] = [
  { name: "General Cleaning", icon: "./icons/cleaning.webp" },
  { name: "Salon & Spa at Home", icon: "./icons/spa.webp" },
  { name: "Handyman & Maintenance", icon: "./icons/maintanance.webp" },
  { name: "Healthcare at Home", icon: "./icons/health.webp" },
  { name: "AC Cleaning at Home", icon: "./icons/cleaning.webp" },
  { name: "Deep Cleaning", icon: "./icons/deepClean.webp" },
  { name: "Pest Control", icon: "./icons/pest.webp" },
  { name: "Packers & Movers", icon: "./icons/mover.webp" },
  { name: "Pet Care at Home", icon: "./icons/pet.webp" },
];

const ServiceCategories: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center py-8">
      {/* {services.map((service) => (
        <Link
          to={`/single-category/${service.name}`}
          key={service.name}
          className="flex flex-col items-center text-center w-32 hover:cursor-pointer"
        >
          <div className="rounded-full flex items-center justify-center shadow-md hover:bg-gray-200  p-1">
            <img
              src={service.icon}
              alt={service.name}
              className="w-16 h-16 object-cover"
            />
          </div>
          <p className="mt-2 text-sm ">{service.name}</p>
        </Link>
      ))} */}
      <div
        style={{
          // Hide scrollbar styles
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE & Edge
        }}
        className="overflow-x-auto"
      >
        <div className="flex w-max gap-4 md:gap-8">
          {services.map((service) => (
            <Link
              to={`/single-category/${service.name}`}
              key={service.name}
              className="flex flex-col items-center text-center w-28 shrink-0"
            >
              <div className="rounded-full flex border border-gray-300 items-center justify-center hover:bg-gray-200 p-1">
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-16 h-16 object-cover"
                />
              </div>
              <p className="mt-2 text-md tracking-wide">{service.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCategories;
