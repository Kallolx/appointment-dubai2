import { useState, useEffect } from 'react';
import { buildApiUrl } from '@/config/api';

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
  site_name: "webbyte",
  logo_url: "/logo.svg",
  tagline: "Your trusted home services partner",
  primary_color: "#3e92ff",
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

export const useWebsiteSettings = () => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(buildApiUrl('/api/website-settings'));
        
        if (!response.ok) {
          throw new Error('Failed to fetch website settings');
        }

        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
      } catch (err) {
        console.error('Error fetching website settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Use default settings on error
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

export type { WebsiteSettings };
