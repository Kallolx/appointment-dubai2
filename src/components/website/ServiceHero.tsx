import { useState } from "react";
import {
  Search,
  Users,
  Star,
  MessageSquare,
  Shield,
  Phone,
} from "lucide-react";

const cities = [
  { name: "Dubai", value: "dubai", image: "/home.png", mobileImage: "/mobile.png" },
  { name: "Abu Dhabi", value: "abu-dhabi", image: "/home2.png", mobileImage: "/mobile2.png" },
  { name: "Sharjah", value: "sharjah", image: "/home3.png", mobileImage: "/mobile3.png" },
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

const servicesList = [
  "Local Moving In Dubai",
  "International Moving From Dubai",
  "Villa Moving In Dubai",
  "Furniture Moving In Dubai",
  "Office Moving In Dubai",
  "Storage In Dubai",
  "Furniture Storage In Dubai",
  "Self Storage In Dubai",
  "Car Shipping In Dubai",
  "Moving To Australia From Dubai",
  "Moving To Canada From Dubai",
  "Moving To India From Dubai",
  "Moving To Lebanon From Dubai",
  "Moving To The UK From Dubai",
  "Moving To The USA From Dubai",
  "Home Cleaning Services In Dubai",
  "Laundry Services In Dubai",
  "Sofa Cleaning In Dubai",
  "Car Wash At Home In Dubai",
  "Deep Cleaning In Dubai",
  "Carpet Cleaning In Dubai",
  "Mattress Cleaning In Dubai",
  "Curtain Cleaning In Dubai",
  "Office Cleaning Services In Dubai",
  "Water Tank Cleaning In Dubai",
  "Window Cleaning For Villas In Dubai",
  "Holiday Home Cleaning In Dubai",
  "Handyman In Dubai",
  "Annual Maintenance Contracts In Dubai",
  "Building And Flooring In Dubai",
  "Carpentry In Dubai",
  "Curtain And Blinds Hanging In Dubai",
  "Curtains And Blinds In Dubai",
  "Electrician In Dubai",
  "Furniture Assembly In Dubai",
  "Light Bulbs And Spotlights In Dubai",
  "Locksmiths In Dubai",
  "Plumber In Dubai",
  "TV Mounting In Dubai",
  "Annual Gardening Contract In Dubai",
  "Gardening In Dubai",
  "Gazebos, Decks And Porches In Dubai",
  "Grass Lawns In Dubai",
  "Landscaping In Dubai",
  "Swimming Pools And Water Features In Dubai",
  "Women's Salon At Home In Dubai",
  "Spa At Home In Dubai",
  "Men's Salon At Home In Dubai",
  "Nails At Home In Dubai",
  "Waxing At Home In Dubai",
  "Hair At Home In Dubai",
  "Luxury Salon At Home In Dubai",
  "Lashes And Brows At Home In Dubai",
  "Doctor On Call In Dubai",
  "Nurse At Home In Dubai",
  "IV Drip At Home In Dubai",
  "Blood Tests At Home In Dubai",
  "Babysitters And Nannies In Dubai",
  "Full-Time Maids In Dubai",
  "Part-Time Maids In Dubai",
  "AC Cleaning In Dubai",
  "AC Duct Cleaning In Dubai",
  "AC Installation In Dubai",
  "AC Maintenance In Dubai",
  "AC Repair In Dubai",
  "Pest Control In Dubai",
  "Mosquitoes Pest Control In Dubai",
  "Ants Pest Control In Dubai",
  "Bed Bugs Pest Control In Dubai",
  "Cockroach Pest Control In Dubai",
  "Rats And Mice Pest Control In Dubai",
  "Termites Pest Control In Dubai",
  "Painting In Dubai",
  "Exterior Painting In Dubai",
  "Pet Grooming",
];

interface ServiceHeroProps {
  updateCity?: (city: string) => void;
}

const ServiceHero: React.FC<ServiceHeroProps> = ({ updateCity }) => {
  const [selectedCity, setSelectedCity] = useState("dubai");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery, "in", selectedCity);
  };

  const filteredServices = searchQuery.trim()
    ? servicesList.filter((s) => s.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  const renderHighlighted = (text: string, q: string) => {
    const qi = q.trim().toLowerCase();
    if (!qi) return <>{text}</>;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(qi);
    if (idx === -1) return <>{text}</>;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + qi.length);
    const after = text.slice(idx + qi.length);
    return (
      <>
        {before}
        <span className="font-semibold">{match}</span>
        {after}
      </>
    );
  };

  return (
    <div className="relative w-full mb-8">
      {/* Background Image: dynamic based on city selection */}
      <div className="relative w-full h-[400px]">
        <img 
          src={cities.find(city => city.value === selectedCity)?.mobileImage || "/mobile.png"} 
          alt={`hero mobile ${cities.find(city => city.value === selectedCity)?.name || 'Dubai'}`} 
          className="block md:hidden w-full h-full object-cover" 
        />
        <img 
          src={cities.find(city => city.value === selectedCity)?.image || "/home.png"} 
          alt={`hero desktop ${cities.find(city => city.value === selectedCity)?.name || 'Dubai'}`} 
          className="hidden md:block w-full h-full object-cover" 
        />

        {/*Dark Overlay*/}
        <div className="absolute inset-0 bg-black opacity-20"></div>

        {/* Decorative badge (top-right) */}
        <img
          src="/badge.png"
          alt="badge"
          aria-hidden="true"
          className="absolute hidden md:block top-44 right-64 z-20 w-40 pointer-events-none select-none"
        />

        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center text-white mt-32 md:mt-0">
          {/* Main Title */}
          <h1 className="text-2xl px-4 tracking-tight md:text-4xl font-bold mb-4 leading-tight">
            Sit back, we'll take it from here
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] md:text-[15px] mb-8">
            Book or get free quotes for over 25 home services from trusted
            companies in {cities.find(city => city.value === selectedCity)?.name || 'Dubai'}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-sm py-1 md:py-1.5 px-2 md:px-3 shadow-lg">
              {/* City selector on the left inside the bar */}
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                  className="flex items-center justify-center gap-1 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 transition-colors text-sm h-8 md:h-9 min-w-[110px]"
                >
                  <span className="text-xs font-semibold leading-none">
                    {cities.find((city) => city.value === selectedCity)?.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-black transition-transform ml-1 ${isCityDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* City Dropdown (absolute) - anchored to this button wrapper */}
                {isCityDropdownOpen && (
                  <div className="absolute top-full -left-2 md:-left-3 mt-1 bg-white border-t border-gray-200 rounded-b-md shadow-lg z-50 min-w-[140px] md:min-w-[200px] max-w-xs">
                    {cities.map((city) => (
                      <button
                        key={city.value}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city.value);
                          setIsCityDropdownOpen(false);
                          // Notify parent component about city change
                          if (updateCity) {
                            updateCity(city.value);
                          }
                        }}
                        className={`w-full text-left text-sm text-[#01788e] px-4 py-2 ${
                          selectedCity === city.value
                        }`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="h-8 md:h-9 w-px bg-gray-300" />

              {/* Main search input */}
              <div className="flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSuggestionsOpen(true);
                  }}
                  placeholder="Start typing to find a service"
                  className="w-full bg-transparent placeholder:text-xs placeholder:text-gray-400 outline-none text-gray-800 px-2 py-1 md:py-1 text-sm md:text-base"
                />
              </div>

              {/* Search icon on the right */}
              <button type="submit" className="p-2 md:px-3 rounded-md text-gray-700 hover:bg-gray-50">
                <Search className="w-4 h-4 hidden md:block" />
              </button>
              {/* Suggestions dropdown (under the search bar) */}
              {isSuggestionsOpen && searchQuery.trim() && (
                <div className="absolute left-0 top-full mt-2 z-50 w-full">
                  <div className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredServices.length > 0 ? (
                      filteredServices.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSearchQuery(s);
                            setIsSuggestionsOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-800"
                        >
                          {renderHighlighted(s, searchQuery)}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500">No results</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#01788e] hidden md:block py-4 px-12">
        <div className="max-w-9xl mx-auto">
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center text-white flex-1 justify-center"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-5 h-5 text-white" fill="currentColor" />
                  <span className="text-sm font-medium whitespace-nowrap">
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
