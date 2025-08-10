import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  Users,
  Settings,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Shield,
  Zap,
  Award
} from "lucide-react"

const Index = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Calendar,
      title: "Smart Appointment Booking",
      description: "Intelligent scheduling system with real-time availability"
    },
    {
      icon: Users,
      title: "Multi-Role Management", 
      description: "Super Admin, Admin, Manager, and User role system"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Role-based access control and secure authentication"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Live notifications and status updates"
    },
    {
      icon: Award,
      title: "Professional Services",
      description: "Complete service management and tracking"
    },
    {
      icon: Settings,
      title: "Customizable System",
      description: "Flexible configuration and white-label options"
    }
  ]

  const stats = [
    { label: "Active Users", value: "2,847" },
    { label: "Appointments", value: "12,543" },
    { label: "Service Areas", value: "25+" },
    { label: "Uptime", value: "99.9%" }
  ]

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AppointPro</h1>
                <p className="text-xs text-muted-foreground">Professional Appointment System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={() => navigate('/administrator')}>
                Admin Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30">
            🚀 Advanced Appointment Management Platform
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Complete Appointment
            <span className="bg-gradient-primary bg-clip-text text-transparent"> System</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional-grade appointment management with multi-role access, real-time scheduling, 
            payment integration, and comprehensive admin controls.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="gap-2" onClick={() => navigate('/dashboard')}>
              <Calendar className="w-5 h-5" />
              Access Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/administrator')}>
              <Shield className="w-5 h-5" />
              Super Admin
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage appointments, users, and services in one comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-gradient-card border-border/40 hover:shadow-card transition-all duration-300 hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Multi-Role Dashboard Access
            </h2>
            <p className="text-muted-foreground text-lg">
              Tailored experiences for every user type with comprehensive role-based permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-card border-border/40 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Super Admin</h3>
              <p className="text-sm text-muted-foreground mb-4">Complete system control, user management, API setup</p>
              <Button size="sm" variant="premium" onClick={() => navigate('/administrator')}>
                Access Panel
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/40 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Admin</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage appointments, services, reports, pages</p>
              <Button size="sm" variant="dashboard" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/40 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Manager</h3>
              <p className="text-sm text-muted-foreground mb-4">Appointment management, user support, limited admin</p>
              <Button size="sm" variant="dashboard" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/40 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">User</h3>
              <p className="text-sm text-muted-foreground mb-4">Book appointments, manage profile, track orders</p>
              <Button size="sm" variant="dashboard" onClick={() => navigate('/dashboard')}>
                My Account
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Experience the complete appointment management solution with role-based access and professional features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>contact@appointpro.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>123 Business Ave, City, State</span>
            </div>
          </div>

          <Button size="lg" className="gap-2" onClick={() => navigate('/dashboard')}>
            <Star className="w-5 h-5" />
            Start Using AppointPro
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">AppointPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AppointPro. Professional Appointment Management System.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
