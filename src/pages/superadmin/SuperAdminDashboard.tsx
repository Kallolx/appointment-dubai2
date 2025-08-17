import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Database, 
  Users, 
  Calendar, 
  Shield, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Map,
  MessageSquare,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface SystemStats {
  totalUsers: number;
  totalAppointments: number;
  activeAdmins: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  apiStatuses: {
    google_maps: 'active' | 'inactive' | 'testing';
    twilio: 'active' | 'inactive' | 'testing';
  };
  databaseSize: string;
  lastBackup: string;
}

const SuperAdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalAppointments: 0,
    activeAdmins: 0,
    systemHealth: 'healthy',
    apiStatuses: {
      google_maps: 'inactive',
      twilio: 'inactive'
    },
    databaseSize: '0 MB',
    lastBackup: 'Never'
  });

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        return;
      }

      const response = await axios.get(buildApiUrl('/api/superadmin/system-stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data);

    } catch (error) {
      console.error('Error fetching system stats:', error);
      toast({
        title: "Error",
        description: "Failed to load system statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout title="System Overview" subtitle="Monitor system health and performance">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading system overview...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout 
      title="System Overview" 
      subtitle="Monitor system health and performance"
    >
      <div className="space-y-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                System Health
              </div>
              <Badge className={getHealthColor(stats.systemHealth)}>
                {getHealthIcon(stats.systemHealth)}
                <span className="ml-1 capitalize">{stats.systemHealth}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
                <div className="text-sm text-gray-600">Total Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.activeAdmins}</div>
                <div className="text-sm text-gray-600">Active Admins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.databaseSize}</div>
                <div className="text-sm text-gray-600">Database Size</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Google Maps API
                </div>
                <Badge className={getApiStatusColor(stats.apiStatuses.google_maps)}>
                  <span className="capitalize">{stats.apiStatuses.google_maps}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Used for location services, geocoding, and map displays throughout the application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Twilio API
                </div>
                <Badge className={getApiStatusColor(stats.apiStatuses.twilio)}>
                  <span className="capitalize">{stats.apiStatuses.twilio}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Used for SMS notifications, OTP verification, and communication services.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => window.location.href = '/superadmin/apis'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage APIs</h3>
                  <p className="text-sm text-gray-600">Configure system API keys</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => window.location.href = '/superadmin/database'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Database</h3>
                  <p className="text-sm text-gray-600">Manage database operations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => window.location.href = '/superadmin/security'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Security</h3>
                  <p className="text-sm text-gray-600">System security settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Database Backup</span>
                <span className="text-sm font-medium">{stats.lastBackup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Database Size</span>
                <span className="text-sm font-medium">{stats.databaseSize}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">System Version</span>
                <span className="text-sm font-medium">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Environment</span>
                <Badge variant="outline">Production</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
