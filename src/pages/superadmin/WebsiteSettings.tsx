import React, { useState, useEffect, useRef } from "react";
import { buildApiUrl } from "@/config/api";
import SuperAdminLayout from "@/pages/superadmin/SuperAdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, RotateCcw, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface WebsiteSettings {
  id?: number;
  site_name: string;
  logo_url: string;
  tagline: string;
  primary_color: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  google_url: string;
  whatsapp_url: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
}

const defaultSettings: WebsiteSettings = {
  site_name: "JL Services",
  logo_url: "/jl-logo.svg",
  tagline: "Your trusted home services partner",
  primary_color: "#FFD03E",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  linkedin_url: "",
  google_url: "",
  whatsapp_url: "",
  contact_address: "1403, Fortune Executive Tower, Cluster T, JLT, Dubai, UAE.",
  contact_phone: "+971 4 506 1500",
  contact_email: "support@servicemarket.com",
};

const WebsiteSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast({
            title: "Error",
            description: "Authentication required",
            variant: "destructive",
          });
          return;
        }

  const response = await fetch(buildApiUrl('/api/admin/website-settings'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load settings');
        }

        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Error",
          description: "Failed to load website settings",
          variant: "destructive",
        });
      }
    };

    loadSettings();
  }, [toast]);

  const handleInputChange = <K extends keyof WebsiteSettings>(
    field: K,
    value: WebsiteSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER_MODE;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing');
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) formData.append('folder', folder);

    const response = await fetch(url, { 
      method: 'POST', 
      body: formData 
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed: ${text}`);
    }

    const json = await response.json();
    return json.secure_url || json.url;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setUploadError(null);

    try {
      let finalSettings = { ...settings };

      // If a local file was selected, upload it first
      if (selectedFile) {
        try {
          setUploading(true);
          const uploadedUrl = await uploadToCloudinary(selectedFile);
          finalSettings.logo_url = uploadedUrl;
        } catch (err: any) {
          console.error('Cloudinary upload error', err);
          setUploadError(err?.message || 'Upload failed');
          setUploading(false);
          setIsLoading(false);
          return;
        } finally {
          setUploading(false);
        }
      }

      // Save settings to database
      const token = localStorage.getItem('token');
      const response = await fetch(buildApiUrl('/api/admin/website-settings'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalSettings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save settings');
      }

      setSettings(finalSettings);
      setSelectedFile(null);
      setUploadError(null);
      
      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      setSettings(defaultSettings);
      setSelectedFile(null);
      setUploadError(null);
      toast({
        title: "Reset",
        description: "Settings reset to default values.",
      });
    }
  };

  return (
    <SuperAdminLayout title="Website Settings" subtitle="Customize basic website appearance and social media links">
      <div className="space-y-6">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>
              Customize your website appearance, basic information, and social media links. 
              Changes are saved to the database.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Website Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName">Website Name</Label>
              <Input
                id="siteName"
                value={settings.site_name}
                onChange={(e) => handleInputChange("site_name", e.target.value)}
                placeholder="Enter website name"
              />
            </div>

            {/* Logo Uploader */}
            <div className="space-y-2">
              <Label htmlFor="logo">Website Logo</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Uploader column */}
                <div className="flex flex-col items-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      setSelectedFile(f || null);
                      if (f) {
                        const preview = URL.createObjectURL(f);
                        setSettings((prev) => ({ ...prev, logo_url: preview }));
                      }
                    }}
                  />

                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => fileInputRef.current?.click()}>
                      Choose Image
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null);
                        setSettings((prev) => ({ ...prev, logo_url: defaultSettings.logo_url }));
                      }}
                    >
                      Reset
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">Recommended: SVG or PNG. Max 2MB.</p>
                  {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                  {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
                </div>

                {/* Preview column */}
                <div className="flex items-center justify-center p-4 border rounded-md bg-muted">
                  <img
                    src={settings.logo_url}
                    alt="Logo Preview"
                    className="max-h-20 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/jl-logo.svg";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline">Website Tagline</Label>
              <Input
                id="tagline"
                value={settings.tagline}
                onChange={(e) => handleInputChange("tagline", e.target.value)}
                placeholder="Enter website tagline"
              />
            </div>

            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) =>
                    handleInputChange("primary_color", e.target.value)
                  }
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  id="primaryColor"
                  value={settings.primary_color}
                  onChange={(e) =>
                    handleInputChange("primary_color", e.target.value)
                  }
                  placeholder="#FFD03E"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Choose the primary color for buttons and accents
              </p>
            </div>
            
            <Separator />

            {/* Social Media URLs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Media Links</h3>
              <p className="text-sm text-muted-foreground">
                Add your social media URLs. These will be displayed in the website footer.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facebook */}
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input
                    id="facebook"
                    value={settings.facebook_url}
                    onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input
                    id="instagram"
                    value={settings.instagram_url}
                    onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input
                    id="twitter"
                    value={settings.twitter_url}
                    onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={settings.linkedin_url}
                    onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/company/yourpage"
                  />
                </div>

                {/* Google */}
                <div className="space-y-2">
                  <Label htmlFor="google">Google Business URL</Label>
                  <Input
                    id="google"
                    value={settings.google_url}
                    onChange={(e) => handleInputChange("google_url", e.target.value)}
                    placeholder="https://maps.google.com/your-business"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp URL</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp_url}
                    onChange={(e) => handleInputChange("whatsapp_url", e.target.value)}
                    placeholder="https://wa.me/1234567890"
                  />
                </div>
              </div>
            </div>
            
            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                Manage your business contact details displayed in the website footer.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contactAddress">Business Address</Label>
                  <Textarea
                    id="contactAddress"
                    value={settings.contact_address}
                    onChange={(e) => handleInputChange("contact_address", e.target.value)}
                    placeholder="Enter your business address"
                    rows={2}
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={settings.contact_phone}
                    onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                    placeholder="+971 4 506 1500"
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                    placeholder="support@yourcompany.com"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>

            <div className="flex items-center gap-4">
              <Button onClick={handleSave} disabled={isLoading || uploading}>
                {isLoading || uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {uploading ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </SuperAdminLayout>
  );
};

export default WebsiteSettingsPage;
