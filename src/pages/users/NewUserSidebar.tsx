import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  User, 
  CreditCard, 
  MapPin, 
  Wallet,
  HeadphonesIcon,
  Trash2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NewUserSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const NewUserSidebar: React.FC<NewUserSidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: Calendar, label: 'My Booking', path: '/user/bookings' },
    { icon: User, label: 'My Profile', path: '/user/profile' },
    { icon: MapPin, label: 'Saved locations', path: '/user/locations' },
    { icon: HeadphonesIcon, label: 'Support Ticket', path: '/user/support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Parse and format address
  const formatAddress = (addressData: any) => {
    if (!addressData) return 'No address saved';
    
    try {
      // If it's already an object, use it directly
      const address = typeof addressData === 'string' ? JSON.parse(addressData) : addressData;
      
      const parts = [
        address.buildingInfo,
        address.streetInfo,
        address.locality,
        address.city,
        address.country
      ].filter(Boolean);
      
      return parts.join(', ') || 'No address saved';
    } catch (e) {
      return addressData.toString() || 'No address saved';
    }
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
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-lg overflow-y-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* User Profile Section - Desktop Only */}
        {!isCollapsed && (
          <div className="px-4 py-6 border-b border-gray-200">
            <div className="flex flex-col items-center text-center">
              {/* User Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              
              {/* User Name */}
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {user?.fullName || 'Guest User'}
              </h3>
              
              {/* User Address */}
              <div className="bg-gray-50 rounded-lg p-2 w-full">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                  <p className="text-xs text-gray-600 leading-relaxed text-left">
                    {formatAddress(user?.address)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Avatar */}
        {isCollapsed && (
          <div className="flex justify-center py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
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
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''} flex-shrink-0`} />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default NewUserSidebar;
