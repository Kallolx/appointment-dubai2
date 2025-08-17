import axios from 'axios';

import { buildApiUrl } from "@/config/api";
// Cache for API configurations
let apiCache: { [key: string]: string } = {};
let cacheTimestamp: { [key: string]: number } = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get dynamic API key from backend
export const getApiKey = async (service: string): Promise<string | null> => {
  try {
    // Check cache first
    const now = Date.now();
    if (apiCache[service] && cacheTimestamp[service] && (now - cacheTimestamp[service] < CACHE_DURATION)) {
      return apiCache[service];
    }

    const response = await axios.get(`http://localhost:3001/api/config/${service}`);
    
    if (response.data && response.data.api_key) {
      // Update cache
      apiCache[service] = response.data.api_key;
      cacheTimestamp[service] = now;
      
      return response.data.api_key;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${service} API key:`, error);
    return null;
  }
};

// Get Google Maps API key specifically
export const getGoogleMapsApiKey = async (): Promise<string | null> => {
  return await getApiKey('google_maps');
};

// Clear API cache (useful when API keys are updated)
export const clearApiCache = () => {
  apiCache = {};
  cacheTimestamp = {};
};

// Check if Google Maps is loaded and load it dynamically if needed
export const loadGoogleMaps = async (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      resolve(true);
      return;
    }

    try {
      const apiKey = await getGoogleMapsApiKey();
      
      if (!apiKey) {
        console.error('Google Maps API key not available');
        resolve(false);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        resolve(false);
      };
      
      // Add to document head
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      resolve(false);
    }
  });
};

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: any;
  }
}
