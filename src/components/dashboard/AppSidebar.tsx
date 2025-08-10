import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Calendar,
  Users,
  Settings,
  BarChart3,
  FileText,
  Ticket,
  Shield,
  MapPin,
  Clock,
  CreditCard,
  UserCheck,
  Building2,
  MessageSquare,
  Globe,
  Database,
  Key,
  Crown,
  ChevronDown,
  LogOut,
  User
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock user role - in real app this would come from context/auth
const currentUserRole = "super_admin" // super_admin, admin, manager, user

const menuItems = {
  super_admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: Users,
      badge: "12"
    },
        {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: Calendar,
    },
    {
      title: "Role Management",
      url: "/dashboard/roles",
      icon: Shield,
    },
    {
      title: "Website Settings",
      url: "/dashboard/website-settings",
      icon: Settings,
    },
    {
      title: "API Credentials",
      url: "/dashboard/api-credentials",
      icon: Key,
    },
    {
      title: "Service Areas",
      url: "/dashboard/service-areas",
      icon: MapPin,
    },
    {
      title: "System Settings",
      url: "/dashboard/system",
      icon: Database,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: Calendar,
      badge: "8"
    },
    {
      title: "Managers",
      url: "/dashboard/managers",
      icon: UserCheck,
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: Building2,
    },
    {
      title: "Support Tickets",
      url: "/dashboard/tickets",
      icon: Ticket,
      badge: "3"
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileText,
    },
    {
      title: "Web Pages",
      url: "/dashboard/pages",
      icon: Globe,
    },
    {
      title: "Time Slots",
      url: "/dashboard/slots",
      icon: Clock,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  manager: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: Calendar,
      badge: "5"
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: Building2,
    },
    {
      title: "Support Tickets",
      url: "/dashboard/tickets",
      icon: Ticket,
      badge: "2"
    },
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: FileText,
    },
    {
      title: "Web Pages",
      url: "/dashboard/pages",
      icon: Globe,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  user: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "My Appointments",
      url: "/dashboard/my-appointments",
      icon: Calendar,
      badge: "2"
    },
    {
      title: "My Addresses",
      url: "/dashboard/addresses",
      icon: MapPin,
    },
    {
      title: "Support",
      url: "/dashboard/support",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
}

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const currentPath = location.pathname
  
  const userMenuItems = menuItems[currentUserRole as keyof typeof menuItems] || []

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    setTimeout(() => {
      navigate("/")
    }, 1000)
  }

  const handleProfileClick = () => {
    navigate("/dashboard/profile")
  }
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `${isActive 
      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-3 border-blue-500 rounded-r-lg shadow-sm" 
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
    } transition-all duration-200 group px-3 py-2`

  const getBadgeVariant = (badge: string) => {
    if (badge === "New" || badge === "Pro") return "bg-green-100 text-green-700 border-green-200"
    if (parseInt(badge) > 0) return "bg-blue-100 text-blue-700 border-blue-200"
    return "bg-gray-100 text-gray-700 border-gray-200"
  }

  const getRoleIcon = () => {
    switch (currentUserRole as string) {
      case 'super_admin': return Shield
      case 'admin': return Shield
      case 'manager': return UserCheck
      case 'user': return User
      default: return User
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin'
      case 'admin': return 'Admin'
      case 'manager': return 'Manager'
      default: return 'User'
    }
  }

  const RoleIcon = getRoleIcon()

  return (
    <Sidebar className="w-64 lg:w-72 bg-white border-r border-gray-200 shadow-sm flex-shrink-0">
      <SidebarHeader className="border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">AppointPro</h2>
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium mt-1">
              <RoleIcon className="w-3 h-3 mr-1" />
              {getRoleLabel(currentUserRole)}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="font-medium truncate">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="outline" 
                            className={`ml-2 text-xs px-1.5 py-0.5 ${getBadgeVariant(item.badge)} flex-shrink-0`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4 bg-gray-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">John Doe</div>
                <div className="text-xs text-gray-500">
                  {getRoleLabel(currentUserRole)}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
            <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-blue-50 rounded-md cursor-pointer">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/system")} className="hover:bg-purple-50 rounded-md cursor-pointer">
              <Settings className="w-4 h-4 mr-2 text-purple-600" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}