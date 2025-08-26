import React from "react";

const locations = [
  {
    name: "Dubai",
    image: "/dubai.png",
    description: "The vibrant heart of the UAE"
  },
  {
    name: "Abu Dhabi",
    image: "/abu.png",
    description: "The capital city of the UAE"
  },
  {
    name: "Sharjah",
    image: "/sharjah.png",
    description: "The cultural capital of the UAE"
  }
];

const PromiseSection: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ServiceMarket Locations
          </h2>
          <p className="text-gray-600">
            We are currently available in:
          </p>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[4/2] relative">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-2xl font-bold">
                    {location.name}
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    {location.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromiseSection;
