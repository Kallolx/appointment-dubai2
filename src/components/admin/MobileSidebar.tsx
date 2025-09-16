import React from "react";
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
  Menu,
  User,
  Layers,
  Tag,
  Box,
  List,
  LogOut,
  X,
  Home,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Flat menu structure for mobile - no nesting
  const mobileMenuItems = [
    // Main
    { icon: BarChart3, label: 'Dashboard', path: '/admin', category: 'Main' },
    { icon: Calendar, label: 'Appointments', path: '/admin/appointments', category: 'Main' },
    
    // Services
    { icon: Tag, label: 'Service Categories', path: '/admin/service-categories', category: 'Services' },
    { icon: Menu, label: 'Service Items', path: '/admin/service-items', category: 'Services' },
    { icon: Settings, label: 'Property Types', path: '/admin/property-types', category: 'Services' },
    { icon: List, label: 'Items Category', path: '/admin/service-items-category', category: 'Services' },
    { icon: Box, label: 'Room Types', path: '/admin/room-types', category: 'Services' },
    { icon: FileText, label: 'Service Pricing', path: '/admin/service-pricing', category: 'Services' },
    
    // Scheduling
    { icon: Clock, label: 'Available Dates', path: '/admin/available-dates', category: 'Scheduling' },
    { icon: Clock, label: 'Time Slots', path: '/admin/time-slots', category: 'Scheduling' },
    
    // Management
    { icon: Users, label: 'Users', path: '/admin/users', category: 'Management' },
    { icon: FileText, label: 'Content', path: '/admin/content', category: 'Management' },
    { icon: Database, label: 'Reports', path: '/admin/reports', category: 'Management' },
    { icon: Database, label: 'Support', path: '/admin/support', category: 'Management' },
    
    // Settings
    { icon: User, label: 'Profile', path: '/admin/profile', category: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleLinkClick = () => {
    onClose();
  };

  // Group items by category
  const groupedItems = mobileMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof mobileMenuItems>);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Admin Panel</h2>
              <p className="text-blue-100 text-xs">Management System</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Info - Fixed */}
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 truncate">
                {user?.fullName || "Administrator"}
              </p>
              <p className="text-sm text-gray-500">Admin Access</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="pb-4">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="py-3">
                {/* Category Header */}
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category}
                  </h3>
                </div>
                
                {/* Category Items */}
                <div className="space-y-1 px-2">
                  {items.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={`
                          flex items-center space-x-3 px-3 py-3 mx-2 rounded-lg transition-all duration-150 text-sm
                          ${active 
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium flex-1">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div className="border-t border-gray-200 p-4 space-y-2 flex-shrink-0 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;