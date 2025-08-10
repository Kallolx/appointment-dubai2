import {
  ChartSpline,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  MapPin,
  Search,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";

interface Service {
  name: string;
  icon: string;
}
const popularSearches = [
  "Home Cleaning",
  "Women's Salon",
  "Women's Spa",
  "Handyman & Maintenance",
  "Men's Spa",
];

const topServices: Service[] = [
  { name: "General Cleaning", icon: "./cleaning.webp" },
  { name: "Salon & Spa at Home", icon: "./spa.webp" },
  { name: "Handyman & Maintenance", icon: "./maintanance.webp" },
  { name: "Healthcare at Home", icon: "./health.webp" },
  { name: "AC Cleaning at Home", icon: "./cleaning.webp" },
  { name: "Deep Cleaning", icon: "./deepClean.webp" },
  { name: "Pest Control", icon: "./pest.webp" },
  { name: "Packers & Movers", icon: "./mover.webp" },
  { name: "Pet Care at Home", icon: "./pet.webp" },
];

const countries = [
  { name: "United Arab Emirates", code: "ae" },
  { name: "Palestinian Territories", code: "ps" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "Qatar", code: "qa" },
];

const ServiceSlider = ({ services }) => {
  const scrollRef = useRef(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 150;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      {/* Scrollable Services */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 px-8 pb-3 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="min-w-[80px] flex-shrink-0 flex flex-col items-center"
          >
            <img src={service.icon} alt="" className="w-10 h-10 object-cover" />
            <p className="text-center text-sm text-gray-700 leading-tight">
              {service.name}
            </p>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
};

export const Navbar = () => {
  const [location, setLocation] = useState("Dubai Marina");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    "United Arab Emirates"
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Detected Location");
        },
        (error) => {
          alert("Error detecting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const toggleCountryDrawer = () => {
    setIsCountryDrawerOpen(!isCountryDrawerOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country.name);
    setIsCountryDrawerOpen(false);
  };

  return (
    <div className="shadow-sm bg-white hidden md:block">
      <div className="max-w-7xl mx-auto">
        <header className="w-full px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={"/"}>
              <img src="/jl-logo.svg" alt="Logo" className="h-10" />
            </Link>
            <div className="flex items-center bg-blue-50 rounded-full px-4 py-1 shadow-sm">
              <MapPin className="text-blue-500" size={25} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search for area, street name"
                className="bg-transparent outline-none font-semibold placeholder:text-gray-400 text-[16px] py-2 px-3"
              />
              <button onClick={handleDetectLocation} className="ml-2">
                <LocateFixed className="w-5 h-5 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Search Drawer */}
          <div className="relative w-full max-w-lg mx-4">
            <div
              className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-full bg-white shadow-sm cursor-pointer"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <Search className="text-gray-400 w-4 h-4 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services"
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-[16px] "
              />
            </div>

            {isDrawerOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-3 w-full max-w-3xl">
                <div className="p-6">
                  <h3 className="flex items-center gap-1 font-semibold text-lg text-gray-800 mb-4">
                    <ThumbsUp />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((item, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-100 text-sm transition"
                      >
                        <ChartSpline size={15} />
                        {item}
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-gray-200 my-6" />

                  <h3 className="flex items-center gap-1 font-semibold text-lg text-gray-800 mb-4">
                    <Star color="orange" fill="orange" />
                    Top services for you
                  </h3>
                  <ServiceSlider services={topServices} />
                </div>
              </div>
            )}
          </div>

          {/* Language, Country, Profile */}
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-full hover:border border-gray-300 bg-white flex items-center justify-center text-sm font-medium cursor-pointer">
              العربية
            </button>

            <div className="relative">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={toggleCountryDrawer}
              >
                <div className="w-12 h-12 rounded-full hover:border border-gray-300 bg-white flex items-center justify-center">
                  <img
                    src={`https://flagcdn.com/w40/${
                      countries.find((c) => c.name === selectedCountry)?.code ||
                      "ae"
                    }.png`}
                    className="w-6 h-6 object-cover rounded-full"
                  />
                </div>
              </div>

              {isCountryDrawerOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                  <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b">
                    Select Country
                  </div>
                  <ul className="py-1">
                    {countries.map((country) => (
                      <li
                        key={country.code}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                          selectedCountry === country.name
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                        onClick={() => selectCountry(country)}
                      >
                        <div className="flex items-center">
                          <img
                            src={`https://flagcdn.com/w20/${country.code}.png`}
                            className="w-4 h-4 mr-2 rounded-full"
                          />
                          {country.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Profile Button */}
            <div className="relative">
              <button
                className="rounded-full px-3 py-2 flex items-center gap-2 h-12 border border-gray-300 bg-white hover:bg-gray-100"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {/* <CircleUserRound className="w-6 h-6" /> */}
                <img
                  src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/person.svg"
                  alt=""
                />
                <img
                  src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/hamburger-menu.svg"
                  alt=""
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-4">
                    <button
                      onClick={() => setLoginModalOpen(true)}
                      className="bg-[#FFD03E] text-white py-2 px-4 rounded-full font-bold w-full hover:bg-[#FFC107] transition"
                    >
                      Sign Up or Login
                    </button>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                      <img
                        width={18}
                        src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/question-mark-outlined.svg"
                      />
                      <span className="text-sm font-medium">Help</span>
                    </div>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex gap-4 p-5 justify-center">
                    <a href="https://www.apple.com/app-store/" target="_blank">
                      <img src="/appstore.webp" className="h-10" />
                    </a>
                    <a href="https://play.google.com/store" target="_blank">
                      <img src="/playstore.webp" className="h-10" />
                    </a>
                  </div>
                </div>
              )}
              {isLoginModalOpen && (
                <LoginModal setLoginModalOpen={setLoginModalOpen} />
              )}
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};
