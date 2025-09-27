import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  MapPin, 
  HeadphonesIcon,
  LogOut,
  ArrowLeft,
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // When collapsed, keep the compact width on md+ but show full width on mobile
  const widthClass = isCollapsed ? 'w-64 md:w-16' : 'w-64'

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
        ${widthClass}
        bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-lg
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* User Profile Section - show full profile on mobile; on md+ hide when collapsed */}
        <div className={isCollapsed ? 'px-4 py-6 border-b border-gray-200 md:hidden' : 'px-4 py-6 border-b border-gray-200'}>
          <div className="flex flex-col items-center text-center">
            {/* User Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>

            {/* User Name */}
            <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">
              {user?.fullName || 'Guest User'}
            </h3>
          </div>
        </div>

        {/* Collapsed User Avatar for md+ only */}
        {isCollapsed && (
          <div className="hidden md:flex justify-center py-4 border-b border-gray-200">
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
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className={`w-4 h-4 ${isCollapsed ? 'md:mx-auto' : ''} flex-shrink-0`} />
                    {/* Always render label; hide on md+ when collapsed */}
                    <span className={`${isCollapsed ? 'md:hidden' : ''} font-medium text-sm`}>{item.label}</span>
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
                setIsMobileOpen(false);
                navigate('/login');
              }}
              title={isCollapsed ? 'Sign out' : ''}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-150 text-gray-700 hover:bg-gray-50 ${isCollapsed ? 'md:justify-center' : ''}`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className={`${isCollapsed ? 'md:hidden' : ''} font-medium text-sm`}>Sign out</span>
            </button>

            <button
              onClick={() => {
                setIsMobileOpen(false);
                navigate('/');
              }}
              title={isCollapsed ? 'Return to site' : ''}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-150 text-gray-700 hover:bg-gray-50 ${isCollapsed ? 'md:justify-center' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className={`${isCollapsed ? 'md:hidden' : ''} font-medium text-sm`}>Return to site</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewUserSidebar;
