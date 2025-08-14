import React, { ReactNode, useState, useEffect } from 'react';
import NewUserSidebar from './NewUserSidebar';
import { Menu, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface NewUserLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const NewUserLayout: React.FC<NewUserLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  onBackClick 
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <NewUserSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      {/* Main Content */}
      <div className={`${isMobile ? 'ml-0' : (isSidebarCollapsed ? 'ml-16' : 'ml-64')} transition-all duration-300`}>
        <div className="w-full">
          {/* Header (if title/subtitle provided) */}
          {(title || subtitle) && (
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-10">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Back Button */}
                  {showBackButton && (
                    <button
                      onClick={onBackClick}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                  
                  {/* Mobile Menu Button */}
                  {isMobile && (
                    <button
                      onClick={() => setIsMobileOpen(true)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
                    >
                      <Menu className="w-5 h-5 text-gray-700" />
                    </button>
                  )}
                  
                  {/* Desktop Toggle Button */}
                  {!isMobile && !showBackButton && (
                    <button
                      onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
                    >
                      {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                  )}
                  
                  <div>
                    {title && (
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-gray-600 text-sm sm:text-base mt-1">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Page Content */}
          <main className="p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NewUserLayout;
