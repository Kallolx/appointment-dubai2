import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3,
  Settings, 
  Shield,
  Key,
  Map,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Menu,
  Globe,
  Database,
  Users,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SuperAdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: 'System Overview', path: '/superadmin' },
    { icon: Users, label: 'User Management', path: '/superadmin/users' },
    { icon: Key, label: 'API Configuration', path: '/superadmin/apis' },
    { icon: Database, label: 'Database Management', path: '/superadmin/database' },
    { icon: Globe, label: 'System Settings', path: '/superadmin/system-settings' },
    { icon: Shield, label: 'Security Settings', path: '/superadmin/security' },
    { icon: User, label: 'Profile Settings', path: '/superadmin/profile' },
    { icon: Settings, label: 'General Settings', path: '/superadmin/settings' },
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
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        bg-gradient-to-b from-purple-900 to-indigo-900 border-r border-purple-700 h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-2xl overflow-y-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Super Admin Header Section */}
        {!isCollapsed && (
          <div className="px-4 py-6 border-b border-purple-700">
            <div className="flex flex-col items-center text-center">
              {/* Super Admin Badge */}
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg border-2 border-yellow-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              {/* Super Admin Name */}
              <h3 className="text-base font-semibold text-white mb-1">
                {user?.fullName || 'Super Admin'}
              </h3>
              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-medium">
                Super Administrator
              </span>
            </div>
          </div>
        )}

        {/* Collapsed Super Admin Avatar */}
        {isCollapsed && (
          <div className="flex justify-center py-4 border-b border-purple-700">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
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
                        ? 'bg-yellow-400 text-yellow-900 shadow-md'
                        : 'text-purple-100 hover:bg-purple-800 hover:text-white'
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

        {/* Toggle Button */}
        <div className="p-3 border-t border-purple-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-purple-100 hover:bg-purple-800 transition-colors duration-200"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Footer/Bottom Section */}
        {!isCollapsed && (
          <div className="p-3 border-t border-purple-700">
            <div className="text-xs text-purple-300 text-center">
              © 2025 AppointPro Super Admin
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperAdminSidebar;
