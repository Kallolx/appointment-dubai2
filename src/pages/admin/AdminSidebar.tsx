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
  Lock
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

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    description: "Overview & Analytics"
  },
  
  // Core Management
  {
    title: "Role Management", 
    url: "/dashboard/roles",
    icon: Shield,
    badge: "New",
    description: "Admin, Manager, User roles",
    category: "management"
  },
  {
    title: "User Management",
    url: "/dashboard/users", 
    icon: Users,
    badge: "2,847",
    description: "Manage all users",
    category: "management"
  },
  {
    title: "Manager Dashboard",
    url: "/admin/managers",
    icon: UserCheck,
    badge: "12",
    description: "Active managers",
    category: "management"
  },
  
  // Appointments & Services
  {
    title: "Appointments",
    url: "/dashboard/appointments",
    icon: Calendar,
    badge: "156",
    description: "All bookings",
    category: "operations"
  },
  {
    title: "Service Categories",
    url: "/dashboard/service-categories",
    icon: FolderTree,
    description: "Categories & subcategories",
    category: "operations"
  },
  {
    title: "Service Management",
    url: "/admin/services",
    icon: Building2,
    badge: "47",
    description: "Pricing, locations, details",
    category: "operations"
  },
  {
    title: "Time Slots",
    url: "/admin/slots",
    icon: Clock,
    description: "Service availability",
    category: "operations"
  },
  
  // Content Management
  {
    title: "Page Builder",
    url: "/admin/page-builder",
    icon: Layout,
    badge: "Pro",
    description: "Create custom pages",
    category: "content"
  },
  {
    title: "Web Pages",
    url: "/admin/pages",
    icon: Globe,
    description: "Terms, Privacy, etc.",
    category: "content"
  },
  {
    title: "Website Settings",
    url: "/dashboard/website-settings",
    icon: Settings,
    description: "Site configuration",
    category: "content"
  },
  
  // Support & Communication
  {
    title: "Support Tickets",
    url: "/admin/tickets",
    icon: Ticket,
    badge: "23",
    description: "Customer support",
    category: "support"
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: MessageSquare,
    description: "System alerts",
    category: "support"
  },
  
  // Analytics & Reports
  {
    title: "Analytics Dashboard",
    url: "/admin/analytics",
    icon: TrendingUp,
    description: "Performance metrics",
    category: "analytics"
  },
  {
    title: "Reports & Exports",
    url: "/admin/reports",
    icon: FileText,
    description: "Weekly, Monthly, Yearly",
    category: "analytics"
  },
  {
    title: "Payment History",
    url: "/admin/payments",
    icon: DollarSign,
    description: "Transaction records",
    category: "analytics"
  },
  
  // System
  {
    title: "System Settings",
    url: "/dashboard/system",
    icon: Database,
    description: "Core configuration",
    category: "system"
  },
  {
    title: "Profile Settings",
    url: "/admin/profile",
    icon: User,
    description: "Admin profile & password",
    category: "system"
  }
]

const menuCategories = [
  { 
    id: "management", 
    label: "User Management", 
    icon: UserCog,
    color: "text-blue-600"
  },
  { 
    id: "operations", 
    label: "Operations", 
    icon: CalendarIcon,
    color: "text-green-600"
  },
  { 
    id: "content", 
    label: "Content & Pages", 
    icon: Edit,
    color: "text-purple-600"
  },
  { 
    id: "support", 
    label: "Support", 
    icon: Ticket,
    color: "text-orange-600"
  },
  { 
    id: "analytics", 
    label: "Analytics & Reports", 
    icon: BarChart3,
    color: "text-indigo-600"
  },
  { 
    id: "system", 
    label: "System", 
    icon: Settings,
    color: "text-gray-600"
  }
]

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const currentPath = location.pathname
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "management", "operations", "content"
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
    navigate("/admin/profile")
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
              <Shield className="w-3 h-3 mr-1" />
              Admin
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
                    to="/admin" 
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
          const categoryItems = adminMenuItems.filter(item => item.category === category.id)
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
                <div className="text-sm font-medium text-gray-900 truncate">Admin User</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
            <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-blue-50 rounded-md cursor-pointer">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/system")} className="hover:bg-purple-50 rounded-md cursor-pointer">
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