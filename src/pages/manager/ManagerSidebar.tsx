import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {
  Calendar,
  Users,
  Settings,
  BarChart3,
  FileText,
  Ticket,
  Building2,
  Clock,
  UserCheck,
  Globe,
  ChevronDown,
  LogOut,
  User,
  MessageSquare,
  Shield,
  DollarSign,
  Edit,
  FolderTree,
  Layout,
  UserCog,
  Database,
  TrendingUp,
  Calendar as CalendarIcon,
  BookOpen,
  Lock,
  MapPin,
  Star,
  CheckCircle2
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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

const managerMenuItems = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: BarChart3,
    description: "Overview & Analytics"
  },
  
  // Appointment Management
  {
    title: "Appointments",
    url: "/manager/appointments",
    icon: Calendar,
    badge: "45",
    description: "View & manage bookings",
    category: "appointments"
  },
  {
    title: "Schedule Management",
    url: "/dashboard/schedule",
    icon: Clock,
    description: "Time slots & availability",
    category: "appointments"
  },
  {
    title: "Appointment Status",
    url: "/dashboard/appointment",
    icon: CheckCircle2,
    badge: "12",
    description: "Pending approvals",
    category: "appointments"
  },
  
  // Service Management
  {
    title: "Service Areas",
    url: "/dashboard/service-areas",
    icon: MapPin,
    badge: "8",
    description: "Coverage locations",
    category: "services"
  },
  {
    title: "Service Management",
    url: "/dashboard/services",
    icon: Building2,
    badge: "15",
    description: "Available services",
    category: "services"
  },
  {
    title: "Service Quality",
    url: "/manager/quality",
    icon: Star,
    description: "Ratings & reviews",
    category: "services"
  },
  
  // Customer Management
  {
    title: "Customer Management",
    url: "/dashboard/customers",
    icon: Users,
    badge: "234",
    description: "Customer database",
    category: "customers"
  },
  {
    title: "Customer Support",
    url: "/dashboard/support",
    icon: Ticket,
    badge: "8",
    description: "Support tickets",
    category: "customers"
  },
  {
    title: "Customer Feedback",
    url: "/manager/feedback",
    icon: MessageSquare,
    description: "Reviews & feedback",
    category: "customers"
  },
  
  // Reports & Analytics
  {
    title: "Performance Reports",
    url: "/manager/reports",
    icon: FileText,
    description: "Daily, weekly reports",
    category: "reports"
  },
  {
    title: "Revenue Analytics",
    url: "/manager/revenue",
    icon: DollarSign,
    description: "Financial insights",
    category: "reports"
  },
  {
    title: "Team Performance",
    url: "/manager/team-performance",
    icon: TrendingUp,
    description: "Staff analytics",
    category: "reports"
  },
  
  // Settings
  {
    title: "Profile Settings",
    url: "/manager/profile",
    icon: User,
    description: "Manager profile & preferences",
    category: "settings"
  },
  {
    title: "Notification Settings",
    url: "/manager/notifications",
    icon: Settings,
    description: "Alert preferences",
    category: "settings"
  }
]

const menuCategories = [
  { 
    id: "appointments", 
    label: "Appointments", 
    icon: CalendarIcon,
    color: "text-blue-600"
  },
  { 
    id: "services", 
    label: "Services", 
    icon: Building2,
    color: "text-purple-600"
  },
  { 
    id: "customers", 
    label: "Customers", 
    icon: Users,
    color: "text-indigo-600"
  },
  { 
    id: "reports", 
    label: "Reports & Analytics", 
    icon: BarChart3,
    color: "text-orange-600"
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: Settings,
    color: "text-gray-600"
  }
]

export function ManagerSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const currentPath = location.pathname
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "appointments", "services", "customers"
  ])
  
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
    navigate("/manager/profile")
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
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
              <UserCheck className="w-3 h-3 mr-1 text-blue-600" />
              Manager
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Dashboard - Always visible */}
        <SidebarGroup className="mb-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/manager" 
                    className={getNavCls}
                  >
                    <BarChart3 className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categorized Menu Items */}
        {menuCategories.map((category) => {
          const categoryItems = managerMenuItems.filter(item => item.category === category.id)
          const isExpanded = expandedCategories.includes(category.id)
          
          if (categoryItems.length === 0) return null
          
          return (
            <SidebarGroup key={category.id} className="mb-1">
              <SidebarGroupLabel 
                className="text-gray-700 font-medium cursor-pointer hover:text-gray-900 transition-colors py-2 px-2 rounded-md hover:bg-gray-50 flex items-center justify-between group"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-2">
                  <category.icon className={`w-4 h-4 ${category.color}`} />
                  <span className="text-sm">{category.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </SidebarGroupLabel>
              
              {isExpanded && (
                <SidebarGroupContent className="mt-0.5">
                  <SidebarMenu className="space-y-0.5 ml-2">
                    {categoryItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink 
                            to={item.url} 
                            className={getNavCls}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <div className="flex items-center justify-between w-full min-w-0">
                              <span className="font-medium truncate text-sm">{item.title}</span>
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
              )}
            </SidebarGroup>
          )
        })}
      </SidebarContent>

  <SidebarFooter className="border-t border-gray-100 p-4 bg-gray-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Manager User</div>
                <div className="text-xs text-gray-500">Area Manager</div>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
            <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-blue-50 rounded-md cursor-pointer">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/manager/notifications")} className="hover:bg-purple-50 rounded-md cursor-pointer">
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
