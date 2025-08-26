import {
  ChevronDown,
  Menu,
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

const services = [
  {
    category: "Cleaning Services",
    items: [
      "Home cleaning services",
      "Deep cleaning",
      "Carpet cleaning",
      "Office cleaning services",
      "Pool cleaning"
    ]
  },
  {
    category: "Maintenance & Handyman",
    items: [
      "Handyman",
      "Electrician",
      "Plumber",
      "Painting",
      "Furniture assembly"
    ]
  },
  {
    category: "Salon at Home",
    items: [
      "Women's Salon At Home",
      "Spa at Home",
      "Men's Salon at Home",
      "Luxury Salon at Home"
    ]
  },
  {
    category: "Health at Home",
    items: [
      "Doctor on Call",
      "Nurse at Home",
      "IV Drip at Home",
      "Blood Tests at Home"
    ]
  }
];

export const Navbar = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get auth state
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
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
        {/* Services Dropdown */}
        <div>
          <button
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-gray-50"
          >
            <span className="font-semibold">Our Services</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isServicesOpen && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              {services.map((serviceGroup, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-gray-800 mb-2">{serviceGroup.category}</h4>
                  <ul className="space-y-1">
                    {serviceGroup.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link 
                          to={`/services/${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-sm text-gray-600 hover:text-blue-600 block py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="flex flex-col space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
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
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/">
              <img src="/jl-logo.svg" alt="Logo" className="h-10" />
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">Our Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-4 w-96">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold text-gray-800">Our Services</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {services.map((serviceGroup, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">{serviceGroup.category}</h4>
                        <ul className="space-y-1">
                          {serviceGroup.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/services/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-sm text-gray-600 hover:text-primary block py-1"
                                onClick={() => setIsServicesOpen(false)}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Login/Profile Button */}
          <div className="relative">
            <button
              className="rounded-full px-4 py-2 flex items-center gap-2 h-12 border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {isAuthenticated ? (
                <>
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
                  <span className="text-sm font-medium">Login</span>
                </>
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {isAuthenticated ? (
                  <>
                    <div className="p-4 border-b bg-red-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
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
                  </>
                )}
                
                <hr className="border-gray-300" />
                <div className="flex gap-4 p-5 justify-center">
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src="/icons/appstore.webp" className="h-10" alt="App Store" />
                  </a>
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="/icons/playstore.webp"
                      className="h-10"
                      alt="Google Play"
                    />
                  </a>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && <MobileDrawer />}
      {isLoginModalOpen && <LoginModal setLoginModalOpen={setLoginModalOpen} />}
    </div>
  );
};