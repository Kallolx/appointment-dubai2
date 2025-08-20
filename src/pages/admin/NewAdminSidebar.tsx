import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  BarChart3,
  Settings,
  Shield,
  Database,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NewAdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const NewAdminSidebar: React.FC<NewAdminSidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/admin" },
    { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
    { icon: Settings, label: "Property Types", path: "/admin/property-types" },
    {
      icon: User,
      label: "Service Categories",
      path: "/admin/service-categories",
    },
    { icon: Menu, label: "Room Types", path: "/admin/room-types" },
    { icon: User, label: "Service Pricing", path: "/admin/service-pricing" },
    { icon: Clock, label: "Available Dates", path: "/admin/available-dates" },
    { icon: Clock, label: "Time Slots", path: "/admin/time-slots" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: FileText, label: "Content Management", path: "/admin/content" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
    { icon: Database, label: "Support Tickets", path: "/admin/support" },
    { icon: User, label: "Profile", path: "/admin/profile" },
    { icon: Shield, label: "Website Settings", path: "/admin/website" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${isCollapsed ? "w-16" : "w-64"} 
        bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-lg overflow-y-auto
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Admin Header Section */}
        {!isCollapsed && (
          <div className="px-4 py-6 border-b border-gray-200">
            <div className="flex flex-col items-center text-center">

              {/* Admin Name */}
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {user?.fullName || "Admin"}
              </h3>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                Administrator
              </span>
            </div>
          </div>
        )}

        {/* Collapsed Admin Avatar */}
        {isCollapsed && (
          <div className="flex justify-center py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-red-50 text-red-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isCollapsed ? "mx-auto" : ""
                      } flex-shrink-0`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer/Bottom Section */}
        {!isCollapsed && (
          <div className="p-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2025 AppointPro Admin
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewAdminSidebar;
