import React, { useState, useEffect } from "react";
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
  Layers,
  Tag,
  Box,
  List,
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

  // Grouped menu to support collapsible tree structure
  const menuGroups = [
    {
      id: 'main',
      icon: BarChart3,
      label: 'Main',
      children: [
        { icon: BarChart3, label: 'Dashboard', path: '/admin' },
        { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
      ],
    },
    {
      id: 'services',
      icon: Layers,
      label: 'Services',
      children: [
        { icon: Tag, label: 'Service Categories', path: '/admin/service-categories' },
        { icon: Menu, label: 'Service Items', path: '/admin/service-items' },
        { icon: Settings, label: 'Property Types', path: '/admin/property-types' },
        { icon: List, label: 'Service Items Category', path: '/admin/service-items-category' },
        { icon: Box, label: 'Room Types', path: '/admin/room-types' },
        { icon: FileText, label: 'Service Pricing', path: '/admin/service-pricing' },
      ],
    },
    {
      id: 'scheduling',
      icon: Clock,
      label: 'Scheduling',
      children: [
        { icon: Clock, label: 'Available Dates', path: '/admin/available-dates' },
        { icon: Clock, label: 'Time Slots', path: '/admin/time-slots' },
      ],
    },
    {
      id: 'management',
      icon: Users,
      label: 'Management',
      children: [
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: FileText, label: 'Content Management', path: '/admin/content' },
        { icon: Database, label: 'Reports', path: '/admin/reports' },
        { icon: Database, label: 'Support Tickets', path: '/admin/support' },
      ],
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      children: [
        { icon: User, label: 'Profile', path: '/admin/profile' },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const STORAGE_KEY = 'adminSidebarExpanded';

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }

    // default: expand main and services
    return { main: true, services: true };
  });

  // On first mount, if there is no saved state, ensure the group containing the active route is expanded
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        const next = { ...expandedGroups };
        menuGroups.forEach(g => {
          if (g.children.some((c: any) => c.path === location.pathname)) {
            next[g.id] = true;
          }
        });
        setExpandedGroups(next);
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

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
          <ul className="space-y-2">
            {menuGroups.map(group => {
              const GroupIcon = group.icon;
              const isGroupExpanded = !!expandedGroups[group.id];
              return (
                <li key={group.id} className="">
                  <div
                    className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={() => toggleGroup(group.id)}
                    title={isCollapsed ? group.label : ''}
                  >
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                      <GroupIcon className="w-4 h-4 text-gray-600" />
                      {!isCollapsed && <span className="font-semibold text-sm text-gray-700">{group.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <button className={`p-1 rounded-md text-gray-500 hover:bg-gray-100`}>
                        <ChevronRight className={`w-4 h-4 transform transition-transform ${isGroupExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    )}
                  </div>

                  {isGroupExpanded && (
                    <ul className={`mt-2 pl-6 pr-2 ${isCollapsed ? 'hidden' : ''}`}>
                      {group.children.map(child => {
                        const Icon = child.icon;
                        return (
                          <li key={child.path} className="mb-1">
                            <Link
                              to={child.path}
                              onClick={() => setIsMobileOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group ${isActive(child.path) ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm">{child.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NewAdminSidebar;
