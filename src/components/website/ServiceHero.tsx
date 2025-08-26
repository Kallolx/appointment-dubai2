import { useState } from "react";
import {
  Search,
  MapPin,
  Users,
  Star,
  MessageSquare,
  Shield,
  Phone,
} from "lucide-react";

const cities = [
  { name: "Dubai", value: "dubai" },
  { name: "Abu Dhabi", value: "abu-dhabi" },
  { name: "Sharjah", value: "sharjah" },
];

const stats = [
  {
    icon: Users,
    text: "150,000+ happy customers",
  },
  {
    icon: MessageSquare,
    text: "Over 15,000 reviews",
  },
  {
    icon: Star,
    text: "Rated 4.8 out of 5",
  },
  {
    icon: Shield,
    text: "Trusted service professionals",
  },
  {
    icon: Phone,
    text: "Live customer support",
  },
];

const ServiceHero: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("dubai");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery, "in", selectedCity);
  };

  return (
    <div className="relative w-full mb-8">
      {/* Background Image */}
      <div
        className="w-full h-[400px] bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/dubai.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
          {/* Main Title */}
          <h1 className="text-2xl tracking-tight md:text-4xl font-bold mb-4 leading-tight">
            Sit back, we'll take it from here
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-lg mb-8 max-w-2xl opacity-90">
            Book or get free quotes for over 25 home services from trusted
            companies in Dubai
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-2 shadow-lg">
              {/* Search Input */}
              <div className="flex-1 flex items-center bg-gray-50 rounded-md px-4 py-3">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need?"
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                />
              </div>

              {/* City Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 rounded-md px-4 py-3 min-w-[140px] hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800 font-medium">
                    {cities.find((city) => city.value === selectedCity)?.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isCityDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* City Dropdown */}
                {isCityDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {cities.map((city) => (
                      <button
                        key={city.value}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city.value);
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                          selectedCity === city.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-800"
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-[#FFC107] transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#01788e] hidden md:block py-6 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center text-white flex-1 justify-center"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-6 h-6 text-white" />
                  <span className="text-sm md:text-base font-medium whitespace-nowrap">
                    {stat.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHero;
