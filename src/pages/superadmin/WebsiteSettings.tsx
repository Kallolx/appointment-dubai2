import React, { useState, useEffect, useRef } from "react";
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
import { Save, RotateCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface WebsiteSettings {
  siteName: string;
  logoPath: string;
  tagline: string;
  primaryColor: string;
  footerText: string;
}

const defaultSettings: WebsiteSettings = {
  siteName: "JL Services",
  logoPath: "/jl-logo.svg",
  tagline: "Your trusted home services partner",
  primaryColor: "#FFD03E",
  footerText: "© 2024 JL Services. All rights reserved.",
};

const availableLogos = [
  { path: "/jl-logo.svg", name: "Appointment Pro" },
  { path: "/jl-insurance-logo.svg", name: "Appointment Pro Logo" },
  {
    path: "/favicon/android-chrome-192x192.png",
    name: "Appointment Pro small icon",
  },
  { path: "/favicon/apple-touch-icon.png", name: "Appointment Pro large icon" },
];

const WebsiteSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("websiteSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Error parsing saved settings:", error);
      }
    }
  }, []);

  const handleInputChange = <K extends keyof WebsiteSettings>(
    field: K,
    value: WebsiteSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveMessage("");

    try {
      // If a local file was selected, upload to Cloudinary first and replace logoPath
      if (selectedFile) {
        try {
          setUploading(true);
          const uploadedUrl = await (async (file: File) => {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            const folder = import.meta.env.VITE_CLOUDINARY_FOLDER_MODE;

            if (!cloudName || !uploadPreset) {
              throw new Error('Cloudinary config missing');
            }

            const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
            const fd = new FormData();
            fd.append('file', file);
            fd.append('upload_preset', uploadPreset);
            if (folder) fd.append('folder', folder);

            const res = await fetch(url, { method: 'POST', body: fd });
            if (!res.ok) {
              const text = await res.text();
              throw new Error(`Upload failed: ${text}`);
            }
            const json = await res.json();
            return json.secure_url || json.url;
          })(selectedFile);

          setSettings((prev) => ({ ...prev, logoPath: uploadedUrl }));
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

      localStorage.setItem("websiteSettings", JSON.stringify(settings));
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
      // clear selected file after successful save
      setSelectedFile(null);
      setUploadError(null);
    } catch (error) {
      setSaveMessage("Error saving settings. Please try again.");
      console.error("Save error:", error);
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
      localStorage.removeItem("websiteSettings");
      setSaveMessage("Settings reset to default values.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <SuperAdminLayout title="Website Settings" subtitle="Customize basic website appearance">
      <div className="space-y-6">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
            <CardDescription>
              Customize your website appearance and basic information. Changes
              are saved locally.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Website Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName">Website Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
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
                        setSettings((prev) => ({ ...prev, logoPath: preview }));
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
                        setSettings(defaultSettings);
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
                    src={settings.logoPath}
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
                  value={settings.primaryColor}
                  onChange={(e) =>
                    handleInputChange("primaryColor", e.target.value)
                  }
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  id="primaryColor"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    handleInputChange("primaryColor", e.target.value)
                  }
                  placeholder="#FFD03E"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Choose the primary color for buttons and accents
              </p>
            </div>
            <Separator />
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
              {saveMessage && (
                <span
                  className={`text-sm ${
                    saveMessage.includes("Error")
                      ? "text-destructive"
                      : "text-green-600"
                  }`}
                >
                  {saveMessage}
                </span>
              )}
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
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
