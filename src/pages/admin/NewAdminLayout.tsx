import React, { ReactNode, useState, useEffect } from 'react';
import NewAdminSidebar from './NewAdminSidebar';
import { Menu, ArrowLeft } from 'lucide-react';

interface NewAdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const NewAdminLayout: React.FC<NewAdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  onBackClick 
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <NewAdminSidebar 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Header */}
        {(title || subtitle) && (
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {/* Back Button */}
                  {showBackButton && (
                    <button
                      onClick={onBackClick}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  
                  {/* Title and Subtitle */}
                  <div className="min-w-0">
                    {title && (
                      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-sm text-gray-600 mt-0.5 truncate">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Header Actions (if needed in future) */}
                <div className="flex items-center space-x-3">
                  {/* Add any header actions here */}
                </div>
              </div>
            </div>
          </header>
        )}
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewAdminLayout;
