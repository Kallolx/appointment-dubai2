import React, { createContext, useContext, useEffect, useState } from 'react';
import { getGoogleMapsApiKey } from '@/lib/apiConfig';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: string | null;
  apiKey: string | null;
  loadMaps: () => Promise<boolean>;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | null>(null);

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const loadMaps = async (): Promise<boolean> => {
    try {
      setLoadError(null);
      
      // Check if already loaded
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return true;
      }

      // Get dynamic API key
      const dynamicApiKey = await getGoogleMapsApiKey();
      
      if (!dynamicApiKey) {
        setLoadError('Google Maps API key not configured. Please contact administrator.');
        return false;
      }

      setApiKey(dynamicApiKey);

      // Remove existing script if any
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create new script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${dynamicApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      return new Promise((resolve) => {
        script.onload = () => {
          setIsLoaded(true);
          setLoadError(null);
          resolve(true);
        };
        
        script.onerror = () => {
          setLoadError('Failed to load Google Maps. Please check API key configuration.');
          setIsLoaded(false);
          resolve(false);
        };
        
        document.head.appendChild(script);
      });
      
    } catch (error) {
      const errorMsg = 'Error loading Google Maps: ' + (error instanceof Error ? error.message : 'Unknown error');
      setLoadError(errorMsg);
      console.error(errorMsg);
      return false;
    }
  };

  useEffect(() => {
    loadMaps();
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey, loadMaps }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within GoogleMapsProvider');
  }
  return context;
};

// Hook for components that need Google Maps
export const useGoogleMapsLoader = () => {
  const { isLoaded, loadError, loadMaps } = useGoogleMaps();
  const [loading, setLoading] = useState(!isLoaded);

  useEffect(() => {
    if (!isLoaded && !loadError) {
      setLoading(true);
      loadMaps().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoaded, loadError, loadMaps]);

  return { 
    isLoaded, 
    loading, 
    loadError,
    reload: loadMaps
  };
};
