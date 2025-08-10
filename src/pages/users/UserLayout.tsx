import { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserSidebar } from "./UserSidebar"
import { Button } from "@/components/ui/button"
import { Bell, Search, Settings, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface UserLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function UserLayout({ children, title, subtitle }: UserLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Search Initiated",
        description: `Searching for: "${searchQuery}"`,
      })
      console.log("Searching for:", searchQuery)
    }
  }

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 2 new notifications",
    })
  }

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Opening profile settings",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <UserSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-14 sm:h-16 border-b border-border bg-white shadow-sm sticky top-0 z-40">
              <div className="flex items-center justify-between h-full px-4 sm:px-6">
                <div className="flex items-center gap-2 sm:gap-4 flex-1">
                  <SidebarTrigger />
                  
                  {/* Desktop Search */}
                  <div className="hidden lg:block flex-1 max-w-md">
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search appointments, services..."
                          className="pl-10 bg-background border-border rounded-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </form>
                  </div>

                  {/* Mobile Search Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative rounded-full hover:bg-secondary"
                    onClick={handleNotificationClick}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center bg-primary text-white p-0 shadow-sm">
                      2
                    </Badge>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-secondary"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                  </Button>
                </div>
              </div>
            </header>

            {/* Mobile Search Sheet */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetContent side="top" className="h-auto bg-white border-b border-border shadow-md">
                <div className="flex items-center gap-3 pt-6">
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-4 h-4" />
                      <Input
                        placeholder="Search appointments, services..."
                        className="pl-10 border-border rounded-lg shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </form>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-secondary"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 overflow-auto bg-secondary/30">
              {(title || subtitle) && (
                <div className="mb-6 sm:mb-8">
                  {title && (
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-muted-foreground text-base sm:text-lg">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
