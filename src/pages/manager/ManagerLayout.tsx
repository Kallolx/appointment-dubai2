import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ManagerSidebar } from "./ManagerSidebar";

interface ManagerLayoutProps {
  children: ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        {/* Sidebar */}
        <ManagerSidebar />
        
        {/* Main Content Area - Responsive */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 w-full max-w-none lg:max-w-7xl lg:mx-auto lg:px-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
