import {
  ChartSpline,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  MapPin,
  Menu,
  Search,
  Star,
  ThumbsUp,
  X,
  User,
  Calendar,
  LogOut,
  Settings,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from "@/contexts/AuthContext";

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

const ServiceSlider = ({ services }: { services: Service[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -150 : 150,
      behavior: "smooth",
    });
  };
  return (
    <div className="relative w-full">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

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
  /* existing states */
  const [location, setLocation] = useState("Dubai Marina");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCountryDrawerOpen, setIsCountryDrawerOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* NEW: mobile menu toggle */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get auth state
  const { user, isAuthenticated, logout } = useAuth();

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocation("Detected Location"),
      (err) => alert(err.message)
    );
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const toggleCountryDrawer = () => setIsCountryDrawerOpen(!isCountryDrawerOpen);
  const selectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country.name);
    setIsCountryDrawerOpen(false);
  };

  /* ------- Mobile drawer contents ------- */
  const MobileDrawer = () => (
    <div className="fixed inset-0 bg-white z-50 flex flex-col lg:hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <img src="/jl-logo.svg" alt="Logo" className="h-10" />
        </Link>
        <button onClick={() => setMobileMenuOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Location */}
        <div className="flex items-center bg-blue-50 rounded-full px-3 py-2">
          <MapPin className="text-blue-500" size={20} />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search for area, street name"
            className="bg-transparent outline-none flex-1 px-2"
          />
          <button onClick={handleDetectLocation}>
            <LocateFixed className="w-4 h-4 text-sky-500" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="flex items-center w-full px-3 py-2 border rounded-full">
            <Search className="w-4 h-4 mr-2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for services"
              className="w-full outline-none bg-transparent"
            />
          </div>
          {/* mobile search drawer could be added here if needed */}
        </div>

        {/* Popular Searches */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <span
                key={item}
                className="text-sm px-3 py-1 border rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Top Services</h3>
          <ServiceSlider services={topServices} />
        </div>

        {/* Country */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">Country</h3>
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                selectCountry(c);
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full gap-2 p-2 rounded hover:bg-gray-100"
            >
              <img
                src={`https://flagcdn.com/w20/${c.code}.png`}
                className="w-5 h-auto"
                alt=""
              />
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="flex flex-col space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.fullName}</p>
                  <p className="text-sm text-gray-600">{user?.phone}</p>
                </div>
              </div>
            </div>
            
            <Link 
              to="/user/bookings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="w-5 h-5 text-gray-600" />
              <span>My Orders</span>
            </Link>
            
            <Link 
              to="/user/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Profile</span>
            </Link>
            
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setLoginModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="bg-[#FFD03E] text-white py-2 rounded-full font-bold"
          >
            Sign Up or Login
          </button>
        )}
      </div>
    </div>
  );

  /* -------------------------------------- */

  return (
    <div className="shadow-sm bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <header className="w-full px-4 py-3 flex items-center justify-between">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="lg:hidden">
            <img src="/jl-logo.svg" alt="Logo" className="h-8" />
          </Link>

          {/* Desktop layout */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/">
              <img src="/jl-logo.svg" alt="Logo" className="h-10" />
            </Link>
            <div className="flex items-center bg-blue-50 rounded-full px-4 py-1 shadow-sm">
              <MapPin className="text-blue-500" size={25} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search for area, street name"
                className="bg-transparent outline-none font-semibold placeholder:text-gray-400 text-base py-2 px-3"
              />
              <button onClick={handleDetectLocation} className="ml-2">
                <LocateFixed className="w-5 h-5 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Search drawer (desktop) */}
          <div className="hidden lg:block relative w-full max-w-lg mx-4">
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
                className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400 text-base"
              />
            </div>

            {isDrawerOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-3 w-full max-w-3xl">
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

                  <div className="w-full h-px bg-gray-200 my-6" />

                  <h3 className="flex items-center gap-1 font-semibold text-lg text-gray-800 mb-4">
                    <Star color="orange" fill="orange" />
                    Top services for you
                  </h3>
                  <ServiceSlider services={topServices} />
                </div>
              </div>
            )}
          </div>

          {/* Language / Country / Profile (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="w-12 h-12 rounded-full hover:border border-gray-300 bg-white flex items-center justify-center text-sm font-medium">
              العربية
            </button>

            <div className="relative">
              <div
                className="w-12 h-12 rounded-full hover:border border-gray-300 bg-white flex items-center justify-center cursor-pointer"
                onClick={toggleCountryDrawer}
              >
                <img
                  src={`https://flagcdn.com/w40/${
                    countries.find((c) => c.name === selectedCountry)?.code ||
                    "ae"
                  }.png`}
                  className="w-6 h-6 object-cover rounded-full"
                  alt=""
                />
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
                            alt=""
                          />
                          {country.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className="rounded-full px-3 py-2 flex items-center gap-2 h-12 border border-gray-300 bg-white hover:bg-gray-100"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                {isAuthenticated ? (
                  <>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium max-w-20 truncate">
                      {user?.fullName?.split(' ')[0] || 'User'}
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/person.svg"
                      className="w-5"
                      alt=""
                    />
                    <img
                      src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/hamburger-menu.svg"
                      className="w-5"
                      alt=""
                    />
                  </>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {isAuthenticated ? (
                    <>
                      <div className="p-4 border-b bg-blue-50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user?.fullName}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            <p className="text-xs text-gray-500">{user?.phone}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link 
                          to="/user/bookings"
                          className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">My Orders</span>
                        </Link>
                        
                        <Link 
                          to="/user/profile"
                          className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium">Profile</span>
                        </Link>
                        
                        <div className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded px-2 cursor-pointer">
                          <img
                            width={18}
                            src="https://deax38zvkau9d.cloudfront.net/prod/assets/static/svgs/question-mark-outlined.svg"
                            alt=""
                          />
                          <span className="text-sm font-medium">Help</span>
                        </div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 py-2 px-3 hover:bg-red-50 rounded cursor-pointer text-red-600"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4">
                        <button
                          onClick={() => {
                            setLoginModalOpen(true);
                            setIsProfileOpen(false);
                          }}
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
                            alt=""
                          />
                          <span className="text-sm font-medium">Help</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <hr className="border-gray-300" />
                  <div className="flex gap-4 p-5 justify-center">
                    <a
                      href="https://www.apple.com/app-store/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src="/appstore.webp" className="h-10" alt="App Store" />
                    </a>
                    <a
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/playstore.webp"
                        className="h-10"
                        alt="Google Play"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && <MobileDrawer />}
      {isLoginModalOpen && <LoginModal setLoginModalOpen={setLoginModalOpen} />}
    </div>
  );
};