import React, { useState, useEffect } from 'react';
import { buildApiUrl } from "@/config/api";
import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, 
  MessageSquare, 
  CreditCard,
  Mail,
  Key, 
  Save, 
  TestTube, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface ApiConfiguration {
  id: number;
  service_name: string;
  api_key: string;
  additional_config?: any;
  status: 'active' | 'inactive' | 'testing';
  last_tested?: string;
  created_at: string;
  updated_at: string;
}

const SuperAdminApiConfig: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [apiConfigs, setApiConfigs] = useState<ApiConfiguration[]>([]);
  
  // Form states
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');
  const [twilioPhoneNumber, setTwilioPhoneNumber] = useState('');
  const [ziinaApiKey, setZiinaApiKey] = useState('');
  
  // SMTP Configuration states
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpSecurity, setSmtpSecurity] = useState('ssl');

  useEffect(() => {
    fetchApiConfigurations();
  }, []);

  const fetchApiConfigurations = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        return;
      }

      const response = await axios.get(buildApiUrl('/api/superadmin/api-configs'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApiConfigs(response.data);
      
      // Populate form fields
      response.data.forEach((config: ApiConfiguration) => {
        if (config.service_name === 'google_maps') {
          setGoogleMapsKey(config.api_key);
        } else if (config.service_name === 'twilio') {
          const additionalConfig = config.additional_config || {};
          setTwilioAccountSid(config.api_key);
          setTwilioAuthToken(additionalConfig.auth_token || '');
          setTwilioPhoneNumber(additionalConfig.phone_number || '');
        } else if (config.service_name === 'ziina') {
          setZiinaApiKey(config.api_key);
        } else if (config.service_name === 'smtp') {
          const additionalConfig = config.additional_config || {};
          setSmtpUsername(config.api_key);
          setSmtpPassword(additionalConfig.password || '');
          setSmtpServer(additionalConfig.server || '');
          setSmtpPort(additionalConfig.port || '465');
          setSmtpSecurity(additionalConfig.security || 'ssl');
        }
      });

    } catch (error) {
      console.error('Error fetching API configurations:', error);
      toast({
        title: "Error",
        description: "Failed to load API configurations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveApiConfiguration = async (serviceName: string) => {
    try {
      setSaving(true);
      
      let apiKey = '';
      let additionalConfig = {};
      
      if (serviceName === 'google_maps') {
        apiKey = googleMapsKey;
      } else if (serviceName === 'twilio') {
        apiKey = twilioAccountSid;
        additionalConfig = {
          auth_token: twilioAuthToken,
          phone_number: twilioPhoneNumber
        };
      } else if (serviceName === 'ziina') {
        apiKey = ziinaApiKey;
      } else if (serviceName === 'smtp') {
        apiKey = smtpUsername;
        additionalConfig = {
          password: smtpPassword,
          server: smtpServer,
          port: smtpPort,
          security: smtpSecurity
        };
      }

      const response = await axios.post(
        buildApiUrl('/api/superadmin/api-configs'),
        {
          service_name: serviceName,
          api_key: apiKey,
          additional_config: additionalConfig
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: `${serviceName.replace('_', ' ')} API configuration saved successfully`,
        });
        
        // Refresh configurations
        await fetchApiConfigurations();
      }
    } catch (error) {
      console.error('Error saving API configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save API configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testApiConfiguration = async (serviceName: string) => {
    try {
      setTesting(serviceName);
      
      const response = await axios.post(
        buildApiUrl(`/api/superadmin/api-configs/${serviceName}/test`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: `${serviceName.replace('_', ' ')} API test successful`,
        });
      } else {
        toast({
          title: "Test Failed",
          description: response.data.message || `${serviceName.replace('_', ' ')} API test failed`,
          variant: "destructive",
        });
      }
      
      // Refresh configurations to update test status
      await fetchApiConfigurations();
    } catch (error) {
      console.error('Error testing API configuration:', error);
      toast({
        title: "Error",
        description: "Failed to test API configuration",
        variant: "destructive",
      });
    } finally {
      setTesting(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout title="API Configuration" subtitle="Manage system API keys and configurations">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading API configurations...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout 
      title="API Configuration" 
      subtitle="Manage system API keys and configurations"
    >
      <div className="space-y-6">
        {/* API Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apiConfigs.map((config) => (
            <Card key={config.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {config.service_name === 'google_maps' ? (
                      <Map className="w-5 h-5 text-blue-600" />
                    ) : config.service_name === 'twilio' ? (
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    ) : config.service_name === 'smtp' ? (
                      <Mail className="w-5 h-5 text-orange-600" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    )}
                    <span className="capitalize">{config.service_name.replace('_', ' ')}</span>
                  </div>
                  <Badge className={getStatusColor(config.status)}>
                    {getStatusIcon(config.status)}
                    <span className="ml-1 capitalize">{config.status}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Last Updated: {new Date(config.updated_at).toLocaleDateString()}</p>
                  {config.last_tested && (
                    <p>Last Tested: {new Date(config.last_tested).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Configuration Tabs */}
        <Tabs defaultValue="google_maps" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="google_maps" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Google Maps
            </TabsTrigger>
            <TabsTrigger value="twilio" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Twilio
            </TabsTrigger>
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              SMTP
            </TabsTrigger>
            <TabsTrigger value="ziina" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Ziina
            </TabsTrigger>
          </TabsList>

          {/* Google Maps Configuration */}
          <TabsContent value="google_maps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Google Maps API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="google-maps-key">API Key</Label>
                  <Input
                    id="google-maps-key"
                    type="password"
                    value={googleMapsKey}
                    onChange={(e) => setGoogleMapsKey(e.target.value)}
                    placeholder="Enter Google Maps API Key"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for location services, geocoding, and map displays
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => saveApiConfiguration('google_maps')}
                    disabled={saving || !googleMapsKey.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Twilio Configuration */}
          <TabsContent value="twilio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  Twilio API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="twilio-account-sid">Account SID</Label>
                  <Input
                    id="twilio-account-sid"
                    type="password"
                    value={twilioAccountSid}
                    onChange={(e) => setTwilioAccountSid(e.target.value)}
                    placeholder="Enter Twilio Account SID"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="twilio-auth-token">Auth Token</Label>
                  <Input
                    id="twilio-auth-token"
                    type="password"
                    value={twilioAuthToken}
                    onChange={(e) => setTwilioAuthToken(e.target.value)}
                    placeholder="Enter Twilio Auth Token"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="twilio-phone">Phone Number</Label>
                  <Input
                    id="twilio-phone"
                    value={twilioPhoneNumber}
                    onChange={(e) => setTwilioPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for sending SMS notifications and OTP codes
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => saveApiConfiguration('twilio')}
                    disabled={saving || !twilioAccountSid.trim() || !twilioAuthToken.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SMTP Configuration */}
          <TabsContent value="smtp">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  SMTP Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-username">Username / Email</Label>
                    <Input
                      id="smtp-username"
                      value={smtpUsername}
                      onChange={(e) => setSmtpUsername(e.target.value)}
                      placeholder="tutor@gsmarena1.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="Enter email account password"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input
                      id="smtp-server"
                      value={smtpServer}
                      onChange={(e) => setSmtpServer(e.target.value)}
                      placeholder="mail.gsmarena1.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="smtp-port"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="465"
                        className="flex-1"
                      />
                      <select
                        value={smtpSecurity}
                        onChange={(e) => {
                          setSmtpSecurity(e.target.value);
                          // Auto-set port based on security type
                          if (e.target.value === 'ssl') {
                            setSmtpPort('465');
                          } else if (e.target.value === 'tls') {
                            setSmtpPort('587');
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ssl">SSL (465)</option>
                        <option value="tls">TLS (587)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Configuration Info:</h4>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>SSL (Recommended):</strong> Port 465 with SSL encryption</p>
                    <p><strong>TLS (Alternative):</strong> Port 587 with TLS encryption</p>
                    <p><strong>Authentication:</strong> Required for all connections</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Used for sending appointment confirmations, notifications, and system emails
                </p>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => saveApiConfiguration('smtp')}
                    disabled={saving || !smtpUsername.trim() || !smtpPassword.trim() || !smtpServer.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ziina Configuration */}
          <TabsContent value="ziina">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Ziina Payment Gateway Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ziina-api-key">API Key</Label>
                  <Input
                    id="ziina-api-key"
                    type="password"
                    value={ziinaApiKey}
                    onChange={(e) => setZiinaApiKey(e.target.value)}
                    placeholder="Enter Ziina API Key"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used for processing payments through Ziina payment gateway
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => saveApiConfiguration('ziina')}
                    disabled={saving || !ziinaApiKey.trim()}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Security Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Security Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  API keys are sensitive information. They are stored encrypted in the database and masked in the interface. 
                  Only super administrators can view and modify these configurations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminApiConfig;
