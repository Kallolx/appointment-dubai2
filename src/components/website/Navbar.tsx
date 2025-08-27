import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  User,
  Calendar,
  LogOut,
  Settings,
  Gift,
} from "lucide-react";
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
      "Pool cleaning",
    ],
  },
  {
    category: "Maintenance & Handyman",
    items: [
      "Handyman",
      "Electrician",
      "Plumber",
      "Painting",
      "Furniture assembly",
    ],
  },
  {
    category: "Salon at Home",
    items: [
      "Women's Salon At Home",
      "Spa at Home",
      "Men's Salon at Home",
      "Luxury Salon at Home",
    ],
  },
  {
    category: "Health at Home",
    items: [
      "Doctor on Call",
      "Nurse at Home",
      "IV Drip at Home",
      "Blood Tests at Home",
    ],
  },
];

const Navbar: React.FC = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

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
        <div>
          <button
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-gray-50"
          >
            <span className="font-semibold">Our Services</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isServicesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isServicesOpen && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              {services.map((serviceGroup, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {serviceGroup.category}
                  </h4>
                  <ul className="space-y-1">
                    {serviceGroup.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          to={`/services/${item
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
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

        {isAuthenticated ? (
          <div className="flex flex-col space-y-4">

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
    <div className="shadow-lg bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 2xl:max-w-[1600px]">
        <header className="w-full py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/">
              <img src="/jl-logo.svg" alt="Logo" className="h-8" />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/">
              <img src="/jl-logo.svg" alt="Logo" className="h-10" />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-sm text-gray-800">
                  Our Services
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-4 w-96">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold text-gray-800">
                      Our Services
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {services.map((serviceGroup, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                          {serviceGroup.category}
                        </h4>
                        <ul className="space-y-1">
                          {serviceGroup.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                to={`/services/${item
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
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

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="relative">
                  <button
                    className="rounded-sm px-3 py-1 flex items-center gap-2 h-9 border border-gray-400 bg-white hover:bg-gray-100 transition-colors text-sm text-[#047a8f]"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="text-sm font-medium max-w-20 truncate">
                      {user?.fullName?.split(" ")[0] || "User"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#047a8f]" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="py-2">
                        <Link
                          to="/user/bookings"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          to="/user/profile"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden lg:flex items-center ml-3">
                  <div className="h-9 w-0.5 bg-gray-300" />
                  <div className="flex items-center px-3 py-1 rounded-md text-orange-600 text-sm">
                    <div className="flex-shrink-0 mr-3 flex items-center">
                      <Gift className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm font-bold">AED 0</div>
                      <div className="text-xs -mt-0.5 font-medium text-orange-700">
                        Credit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-3 py-1 hover:bg-gray-100 rounded-md text-md font-semibold"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      {mobileMenuOpen && <MobileDrawer />}
      {isLoginModalOpen && <LoginModal setLoginModalOpen={setLoginModalOpen} />}
    </div>
  );
};

export default Navbar;
