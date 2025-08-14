import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from './button';
import { MapPin, X } from 'lucide-react';

interface GoogleMapPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  }) => void;
  onClose: () => void;
  apiKey: string;
  inline?: boolean;
}

const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  onLocationSelect,
  onClose,
  apiKey,
  inline = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();
        
        if (mapRef.current) {
          // Default to Dubai coordinates
          const dubaiCoords = { lat: 25.2048, lng: 55.2708 };
          
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: dubaiCoords,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          const geocoderInstance = new google.maps.Geocoder();
          setGeocoder(geocoderInstance);

          // Create a marker
          const markerInstance = new google.maps.Marker({
            position: dubaiCoords,
            map: mapInstance,
            draggable: true,
            title: 'Drag to select location'
          });

          // Set initial location
          reverseGeocode(dubaiCoords, geocoderInstance);

          // Add click listener to map
          mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              const newPosition = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              };
              markerInstance.setPosition(newPosition);
              reverseGeocode(newPosition, geocoderInstance);
            }
          });

          // Add drag listener to marker
          markerInstance.addListener('dragend', () => {
            const position = markerInstance.getPosition();
            if (position) {
              const newPosition = {
                lat: position.lat(),
                lng: position.lng()
              };
              reverseGeocode(newPosition, geocoderInstance);
            }
          });

          // Try to get user's current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                mapInstance.setCenter(userLocation);
                markerInstance.setPosition(userLocation);
                reverseGeocode(userLocation, geocoderInstance);
              },
              (error) => {
                console.log('Geolocation error:', error);
                // Keep default Dubai location
              }
            );
          }

          setMap(mapInstance);
          setMarker(markerInstance);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [apiKey]);

  const reverseGeocode = async (
    position: { lat: number; lng: number },
    geocoderInstance: google.maps.Geocoder
  ) => {
    try {
      const result = await geocoderInstance.geocode({
        location: position
      });

      if (result.results && result.results.length > 0) {
        const addressComponents = result.results[0].address_components;
        const formattedAddress = result.results[0].formatted_address;
        
        // Extract area and city from address components
        let area = '';
        let city = '';
        
        addressComponents.forEach((component) => {
          if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
            area = component.long_name;
          } else if (component.types.includes('locality') || component.types.includes('administrative_area_level_1')) {
            city = component.long_name;
          }
        });

        // Fallback if no specific area found
        if (!area && addressComponents.length > 0) {
          area = addressComponents[0].long_name;
        }

        // Fallback if no city found, use Dubai as default
        if (!city) {
          city = 'Dubai';
        }

        const locationData = {
          lat: position.lat,
          lng: position.lng,
          address: formattedAddress,
          area: area,
          city: city
        };

        setSelectedLocation(locationData);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Set fallback data
      setSelectedLocation({
        lat: position.lat,
        lng: position.lng,
        address: `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}`,
        area: 'Unknown Area',
        city: 'Dubai'
      });
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  // Inline version - just the map and location info
  if (inline) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full rounded-lg" />
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedLocation.area}, {selectedLocation.city}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedLocation.address}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLocation}
                disabled={!selectedLocation}
                className="flex-1"
              >
                Use This Location
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Select Your Location</h3>
            <p className="text-sm text-gray-600">Tap on the map or drag the marker to pin your exact location</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedLocation.area}, {selectedLocation.city}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedLocation.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLocation}
            disabled={!selectedLocation}
            className="flex-1"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapPicker;
