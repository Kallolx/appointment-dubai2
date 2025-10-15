import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  BarChart3,
  Settings,
  Shield,
  Database,
  FileText,
  ChevronRight,
  User,
  Layers,
  Tag,
  Box,
  List,
  LogOut,
  Home,
  Menu,
  Percent,
  Gift,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import MobileSidebar from "@/components/admin/MobileSidebar";

interface NewAdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const NewAdminSidebar: React.FC<NewAdminSidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Desktop menu structure with groups
  const menuGroups = [
    {
      id: "main",
      icon: Home,
      label: "Main",
      children: [
        { icon: BarChart3, label: "Dashboard", path: "/admin" },
        { icon: Calendar, label: "Appointments", path: "/admin/appointments" },
      ],
    },
    {
      id: "services",
      icon: Layers,
      label: "Services",
      children: [
        { icon: Tag, label: "Sections", path: "/admin/service-categories" },
        { icon: Menu, label: "Services", path: "/admin/service-items" },
                {
          icon: List,
          label: "Service Categories",
          path: "/admin/service-items-category",
        },
        {
          icon: Settings,
          label: "Property Types",
          path: "/admin/property-types",
        },

        { icon: Box, label: "Room Types", path: "/admin/room-types" },
        { icon: FileText, label: "Pricing", path: "/admin/service-pricing" },
      ],
    },
    {
      id: "scheduling",
      icon: Clock,
      label: "Scheduling",
      children: [
        {
          icon: Clock,
          label: "Available Dates",
          path: "/admin/available-dates",
        },
        { icon: Clock, label: "Time Slots", path: "/admin/time-slots" },
      ],
    },
    {
      id: "management",
      icon: Users,
      label: "Management",
      children: [
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: Gift, label: "Offer Codes", path: "/admin/offer-codes" },
        { icon: FileText, label: "Content", path: "/admin/content" },
        { icon: Database, label: "Reports", path: "/admin/reports" },
        { icon: Database, label: "Support", path: "/admin/support" },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const STORAGE_KEY = "adminSidebarExpanded";

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      if (typeof window === "undefined") return { main: true };

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse sidebar state from localStorage");
      }
      return { main: true };
    }
  );

  // Auto-expand group containing active route
  useEffect(() => {
    const activeGroup = menuGroups.find((group) =>
      group.children.some((child) => child.path === location.pathname)
    );

    if (activeGroup && !expandedGroups[activeGroup.id]) {
      setExpandedGroups((prev) => {
        const next = { ...prev, [activeGroup.id]: true };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.warn("Failed to save sidebar state to localStorage");
        }
        return next;
      });
    }
  }, [location.pathname, expandedGroups, menuGroups]);

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to save sidebar state to localStorage");
      }
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Component-scoped styles to hide sidebar scrollbar (WebKit, Firefox, IE/Edge) */}
      <style>{`.new-admin-sidebar-nav::-webkit-scrollbar{display:none}.new-admin-sidebar-nav{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
      {/* Mobile Sidebar Component */}
      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Desktop Sidebar */}
  <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 shadow-lg flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || "Administrator"}
              </p>
              <p className="text-xs text-gray-500">Admin Access</p>
            </div>
          </div>
        </div>

  {/* Navigation */}
  <nav className="new-admin-sidebar-nav flex-1 overflow-y-auto p-3 pb-24 space-y-1">
          {menuGroups.map((group) => {
            const GroupIcon = group.icon;
            const isGroupExpanded = expandedGroups[group.id];
            const hasActiveChild = group.children.some((child) =>
              isActive(child.path)
            );

            return (
              <div key={group.id}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors
                    ${
                      hasActiveChild
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <GroupIcon
                      className={`w-5 h-5 ${
                        hasActiveChild ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium">{group.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isGroupExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Group Children */}
                {isGroupExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {group.children.map((child) => {
                      const ChildIcon = child.icon;
                      const active = isActive(child.path);

                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`
                            flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors
                            ${
                              active
                                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                          `}
                        >
                          <ChildIcon
                            className={`w-4 h-4 ${
                              active ? "text-blue-600" : "text-gray-400"
                            }`}
                          />
                          <span className="truncate">{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

  {/* Footer (fixed to bottom) */}
  <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3 bg-white">
          {/* Profile Link */}
          <Link
            to="/admin/profile"
            className={`
              flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors mb-2
              ${
                isActive("/admin/profile")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default NewAdminSidebar;
