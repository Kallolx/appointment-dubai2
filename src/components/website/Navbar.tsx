import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

const services = [
  // Column 1: Moving & Storage + Cleaning Services
  [
    {
      category: "Moving & Storage",
      items: [
        "Home Moving",
        "Office Moving",
        "Storage Solutions",
        "Packing Services",
        "Furniture Moving",
      ],
    },
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
  ],
  // Column 2: Maintenance & Handyman + AC Services
  [
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
      category: "AC Services",
      items: [
        "AC Installation",
        "AC Repair",
        "AC Maintenance",
        "AC Cleaning",
        "AC Parts",
      ],
    },
  ],
  // Column 3: Salon at Home + Pet Services
  [
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
      category: "Pet Services",
      items: [
        "Pet Grooming",
        "Pet Sitting",
        "Pet Walking",
        "Pet Training",
        "Pet Health",
      ],
    },
  ],
  // Column 4: Health at Home + Nannies and Maids
  [
    {
      category: "Health at Home",
      items: [
        "Doctor on Call",
        "Nurse at Home",
        "IV Drip at Home",
        "Blood Tests at Home",
      ],
    },
    {
      category: "Nannies and Maids",
      items: [
        "House Cleaning",
        "Child Care",
        "Elder Care",
        "Cooking Services",
        "Laundry Services",
      ],
    },
  ],
];

const Navbar: React.FC = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useWebsiteSettings();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const MobileDrawer = () => {
    const [expandedServices, setExpandedServices] = useState<{ [key: string]: boolean }>({});
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleService = (category: string) => {
      setExpandedServices(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    return (
      <>
        {/* Dark overlay background */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Mobile menu drawer - 80% width */}
        <motion.div 
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 200,
            duration: 0.4
          }}
          className="fixed left-0 top-0 h-full w-4/5 bg-white z-50 lg:hidden shadow-2xl"
        >
          {/* Close button positioned absolutely at top-right corner */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-0 right-0 w-6 h-6 bg-red-500 flex items-center justify-center z-10"
          >
            <X className="w-3 h-3 text-white" />
          </button>

          {/* Menu content */}
          <div className="flex flex-col">
            {/* Home */}
            <div className="border-b border-gray-200">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
              >
                Home
              </Link>
            </div>

            {/* Login for unauthenticated users */}
            {!isAuthenticated && (
              <div className="border-b border-gray-200">
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-5 py-3 text-gray-800 font-semibold hover:bg-gray-50 transition-colors text-sm"
                >
                  Login
                </button>
              </div>
            )}

            {/* User menu for authenticated users */}
            {isAuthenticated && (
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-between w-full px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-sm">{user?.fullName?.split(" ")[0] || "User"}</span>
                  <motion.div
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 overflow-hidden"
                    >
                      <Link
                        to="/user/bookings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-8 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                      >
                        My Bookings
                      </Link>
                      <Link
                        to="/user/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-8 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-8 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

                        {/* Service Categories */}
            {services.flat().map((service, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => toggleService(service.category)}
                  className="flex items-center justify-between w-full px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm">{service.category}</span>
                  <motion.div
                    animate={{ rotate: expandedServices[service.category] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedServices[service.category] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 overflow-hidden"
                    >
                      {service.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={`/services/${item.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-8 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                        >
                          {item}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </div>
      </motion.div>
    </>
  );
};

  return (
    <div className="border-b border-[#01788e] md:border-gray-200 md:shadow-md bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 2xl:max-w-[1600px]">
        <header className="w-full py-3 flex items-center justify-between">
          <div className="flex items-center gap-8 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <Link to="/">
              <img 
                src={settings.logo_url} 
                alt={settings.site_name} 
                className="h-8"
                onError={(e) => {
                  e.currentTarget.src = "/logo.svg";
                }}
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/">
              <img 
                src={settings.logo_url} 
                alt={settings.site_name} 
                className="h-9"
                onError={(e) => {
                  e.currentTarget.src = "/logo.svg";
                }}
              />
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-sm text-gray-600">
                  Our Services
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-[1000px]">
                  {/* Close button in top-right corner */}
                  <button
                    onClick={() => setIsServicesOpen(false)}
                    className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center z-10 hover:bg-orange-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                  
                  {/* Content with padding to avoid close button */}
                  <div className="pt-8 px-6 pb-6 pr-12">
                    <div className="grid grid-cols-4 gap-0">
                      {services.map((column, columnIndex) => (
                        <div key={columnIndex} className="px-3">
                          {column.map((serviceGroup, groupIndex) => (
                            <div key={groupIndex} className={groupIndex > 0 ? "mt-4" : ""}>
                              <h4 className="font-bold text-gray-600 mb-1 text-sm">
                                {serviceGroup.category}
                              </h4>
                              <ul className="space-y-0.5">
                                {serviceGroup.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      to={`/services/${item
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                      className="text-sm text-gray-800 hover:text-primary block py-0.5 transition-colors"
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
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center">
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
                  className="hidden md:block px-5 py-1 shadow-sm rounded-sm text-md font-semibold"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && <MobileDrawer />}
      </AnimatePresence>
      {isLoginModalOpen && <LoginModal setLoginModalOpen={setLoginModalOpen} />}
    </div>
  );
};

export default Navbar;
