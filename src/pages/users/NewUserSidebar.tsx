import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  MapPin,
  HeadphonesIcon,
  LogOut,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NewUserSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const NewUserSidebar: React.FC<NewUserSidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // When collapsed, keep the compact width on md+ but show full width on mobile
  const widthClass = isCollapsed ? "w-64 md:w-16" : "w-64";

  const menuItems = [
    { icon: Calendar, label: "My Bookings", path: "/user/bookings" },
    { icon: User, label: "My Profile", path: "/user/profile" },
    { icon: Calendar, label: "Outstanding payments", path: "/user/outstanding-payments" },
    { icon: MapPin, label: "Saved Locations", path: "/user/locations" },
    { icon: Calendar, label: "Payment Methods", path: "/user/outstanding-payments" },
    { icon: HeadphonesIcon, label: "Support", path: "/user/support" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Parse and format address
  const formatAddress = (addressData: any) => {
    if (!addressData) return "No address saved";

    try {
      // If it's already an object, use it directly
      const address =
        typeof addressData === "string" ? JSON.parse(addressData) : addressData;

      const parts = [
        address.buildingInfo,
        address.streetInfo,
        address.locality,
        address.city,
        address.country,
      ].filter(Boolean);

      return parts.join(", ") || "No address saved";
    } catch (e) {
      return addressData.toString() || "No address saved";
    }
  };

  return (
    <>
      {/* Mobile Drawer - matching Navbar style */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile menu drawer - 80% width matching Navbar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.4,
              }}
              className="fixed left-0 top-0 h-full w-4/5 bg-white z-50 md:hidden shadow-2xl"
            >
              {/* Close button positioned absolutely at top-right corner */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-0 right-0 w-6 h-6 bg-red-500 flex items-center justify-center z-10"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              {/* Menu content */}
              <div className="flex flex-col">
                <Link
                  to="/"
                  onClick={() => setIsMobileOpen(false)}
                  className="border-b border-gray-200 block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                >
                  Home
                </Link>
                {/* User Name Section - matching Navbar */}
                <div className="border-b border-gray-200">
                  <button className="flex items-center justify-between w-full px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-sm">
                      {user?.fullName?.split(" ")[0] || "User"}
                    </span>
                  </button>
                </div>

                {/* User Menu Items - matching Navbar exactly */}
                <div className="border-b border-gray-200">
                  <Link
                    to="/user/bookings"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/user/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/user/outstanding-payments"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Outstanding payments
                  </Link>
                  <Link
                    to="/user/locations"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Saved Locations
                  </Link>
                  <Link
                    to="/user/bookings"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Payment Methods
                  </Link>
                  <Link
                    to="/user/support"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Support
                  </Link>

                  <Link
                    to="#"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-5 py-3 text-red-600 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Delete Account
                  </Link>

                  <button
                    onClick={() => {
                      logout?.();
                      setIsMobileOpen(false);
                      navigate("/login");
                    }}
                    className="block w-full text-left px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - hidden on mobile, shown on md+ */}
      <div
        className={`
        ${widthClass}
        bg-white border-r border-gray-200 h-screen flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-lg
        hidden md:flex
      `}
      >
        {/* User Profile Section - show full profile when not collapsed */}
        <div
          className={
            isCollapsed ? "hidden" : "px-4 py-6 border-b border-gray-200"
          }
        >
          <div className="flex flex-col items-center text-center">
            {/* User Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>

            {/* User Name */}
            <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">
              {user?.fullName || "Guest User"}
            </h3>
          </div>
        </div>

        {/* Collapsed User Avatar for md+ only */}
        {isCollapsed && (
          <div className="flex justify-center py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Navigation Menu (scrollable) */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isCollapsed ? "mx-auto" : ""
                      } flex-shrink-0`}
                    />
                    <span
                      className={`${
                        isCollapsed ? "hidden" : ""
                      } font-medium text-sm`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - pinned to bottom */}
        <div className="border-t border-gray-100 p-3 bg-white">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                logout?.();
                navigate("/login");
              }}
              title={isCollapsed ? "Sign out" : ""}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-150 text-gray-700 hover:bg-gray-50 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span
                className={`${isCollapsed ? "hidden" : ""} font-medium text-sm`}
              >
                Sign out
              </span>
            </button>

            <button
              onClick={() => navigate("/")}
              title={isCollapsed ? "Return to site" : ""}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-150 text-gray-700 hover:bg-gray-50 ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span
                className={`${isCollapsed ? "hidden" : ""} font-medium text-sm`}
              >
                Return to site
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUserSidebar;
