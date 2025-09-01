import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "./button";
import { MapPin, X, Search, Plus, Minus } from "lucide-react";

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
  inline = false,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places", "geometry"],
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
            zoomControl: false, // We'll add custom zoom controls
            scaleControl: false,
            scrollwheel: true,
            gestureHandling: "greedy", // Enable single-finger panning
            disableDefaultUI: true, // Disable all default UI
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          const geocoderInstance = new google.maps.Geocoder();
          setGeocoder(geocoderInstance);

                     // Create a fixed center marker (not draggable)
           const markerInstance = new google.maps.Marker({
             position: dubaiCoords,
             map: mapInstance,
             draggable: false, // Pin stays fixed at center
             title: "Center pin - location selection point",
             icon: {
               url: "/icons/pin.svg",
               scaledSize: new google.maps.Size(60, 60),
               anchor: new google.maps.Point(30, 60), // Anchor at bottom center of the pin
             },
           });

          // Initialize SearchBox
          if (searchInputRef.current) {
            const searchBoxInstance = new google.maps.places.SearchBox(
              searchInputRef.current
            );
            setSearchBox(searchBoxInstance);

                         // Listen for search results
             searchBoxInstance.addListener("places_changed", () => {
               const places = searchBoxInstance.getPlaces();
               if (places && places.length > 0) {
                 const place = places[0];
                 if (place.geometry && place.geometry.location) {
                   const newPosition = {
                     lat: place.geometry.location.lat(),
                     lng: place.geometry.location.lng(),
                   };
                   // Move map to the searched location
                   mapInstance.setCenter(newPosition);
                   mapInstance.setZoom(16);
                   // Marker will automatically move to center via center_changed listener
                 }
               }
             });
          }

          // Set initial location
          reverseGeocode(dubaiCoords, geocoderInstance);

                     // Add map center change listener to update location when map moves
           mapInstance.addListener("center_changed", () => {
             const center = mapInstance.getCenter();
             if (center) {
               const newPosition = {
                 lat: center.lat(),
                 lng: center.lng(),
               };
               // Update marker position to stay at center
               markerInstance.setPosition(newPosition);
               // Get location info for the new center
               reverseGeocode(newPosition, geocoderInstance);
             }
           });

           // Add map idle listener to get location when map stops moving
           mapInstance.addListener("idle", () => {
             const center = mapInstance.getCenter();
             if (center) {
               const newPosition = {
                 lat: center.lat(),
                 lng: center.lng(),
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
                   lng: position.coords.longitude,
                 };
                 // Move map to user's location
                 mapInstance.setCenter(userLocation);
                 // Marker will automatically move to center via center_changed listener
               },
               (error) => {
                 console.log("Geolocation error:", error);
                 // Keep default Dubai location
               }
             );
           }

          setMap(mapInstance);
          setMarker(markerInstance);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
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
        location: position,
      });

      if (result.results && result.results.length > 0) {
        const addressComponents = result.results[0].address_components;
        const formattedAddress = result.results[0].formatted_address;

        // Extract area and city from address components
        let area = "";
        let city = "";

        addressComponents.forEach((component) => {
          if (
            component.types.includes("sublocality") ||
            component.types.includes("neighborhood")
          ) {
            area = component.long_name;
          } else if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_1")
          ) {
            city = component.long_name;
          }
        });

        // Fallback if no specific area found
        if (!area && addressComponents.length > 0) {
          area = addressComponents[0].long_name;
        }

        // Fallback if no city found, use Dubai as default
        if (!city) {
          city = "Dubai";
        }

        const locationData = {
          lat: position.lat,
          lng: position.lng,
          address: formattedAddress,
          area: area,
          city: city,
        };

        setSelectedLocation(locationData);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      // Set fallback data
      setSelectedLocation({
        lat: position.lat,
        lng: position.lng,
        address: `Lat: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(
          4
        )}`,
        area: "Unknown Area",
        city: "Dubai",
      });
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom((map.getZoom() || 12) + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom((map.getZoom() || 12) - 1);
    }
  };

     const handleMyLocation = () => {
     if (navigator.geolocation && map) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           const userLocation = {
             lat: position.coords.latitude,
             lng: position.coords.longitude,
           };
           map.setCenter(userLocation);
           map.setZoom(16);
           // Marker will automatically move to center via center_changed listener
         },
         (error) => {
           alert(
             "Unable to get your location. Please check your browser permissions."
           );
         }
       );
     }
   };

  const toggleMapType = () => {
    if (map) {
      const currentMapType = map.getMapTypeId();
      if (currentMapType === google.maps.MapTypeId.ROADMAP) {
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      } else {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchBox && searchQuery.trim()) {
      searchBox.setBounds(map?.getBounds());
    }
  };

  return (
    <>
      {inline ? (
        // Inline version - clean map with search and controls
        <div className="relative w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="absolute top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a location..."
                  className="w-full pl-10 pr-12 py-2 md:py-2 bg-white border border-[#01788e] rounded-sm shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  title="Clear search"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Map Controls */}
          <div className="absolute top-16 right-2 z-10 space-y-1 md:top-20 md:right-4 md:space-y-2">
            {/* My Location Button */}
            <button
              onClick={handleMyLocation}
              className="w-8 h-8  bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="My Location"
            >
              <img
                src="/icons/gps.svg"
                alt="GPS"
                className="w-4 h-4"
              />
            </button>

            {/* Map Type Toggle Button */}
            <button
              onClick={toggleMapType}
              className="w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="Toggle Map Type"
            >
              <img
                src="/icons/sat.svg"
                alt="Satellite"
                className="w-4 h-4"
              />
            </button>

            {/* Zoom Controls */}
            <div className="bg-white border border-gray-300 shadow-md overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8  border-b border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                title="Zoom In"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 hover:bg-gray-50 transition-colors flex items-center justify-center"
                title="Zoom Out"
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ pointerEvents: isLoading ? "none" : "auto" }}
          />

          {/* Location Card with Confirm Button - appears when location is selected */}
          {selectedLocation && (
            <div className="absolute bottom-2 left-2 right-2 z-10 md:bottom-4 md:left-4 md:right-4">
              <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 border border-gray-200">
                {/* Location Information */}
                <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base md:text-lg">
                      {selectedLocation.area}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      {selectedLocation.city}
                    </p>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmLocation}
                  className="w-full py-2.5 md:py-3 px-4 md:px-6 bg-primary text-white font-bold rounded-sm uppercase tracking-wide hover:bg-orange-600 transition-colors text-sm md:text-base"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Modal version - full interface
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                             <div>
                 <h3 className="text-lg font-semibold text-gray-900">
                   Select Your Location
                 </h3>
                 <p className="text-sm text-gray-600">
                   Move the map to center the pin on your desired location
                 </p>
               </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar for Modal */}
            <div className="px-4 py-3 border-b">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a location..."
                    className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      if (searchInputRef.current) {
                        searchInputRef.current.focus();
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </form>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}

              {/* Map Controls for Modal */}
              <div className="absolute top-4 right-4 z-10 space-y-2">
                <button
                  onClick={handleMyLocation}
                  className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="My Location"
                >
                  <img src="/icons/gps.svg" alt="GPS" className="w-5 h-5" />
                </button>

                {/* Map Type Toggle Button */}
                <button
                  onClick={toggleMapType}
                  className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Toggle Map Type"
                >
                  <img
                    src="/icons/sat.svg"
                    alt="Satellite"
                    className="w-5 h-5"
                  />
                </button>

                <div className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 border-b border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    title="Zoom In"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 hover:bg-gray-50 transition-colors flex items-center justify-center"
                    title="Zoom Out"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div
                ref={mapRef}
                className="w-full h-full"
                style={{ pointerEvents: isLoading ? "none" : "auto" }}
              />
            </div>

            {/* Selected Location Info */}
            {selectedLocation && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {selectedLocation.area}, {selectedLocation.city}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedLocation.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-primary text-primary-foreground"
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
      )}
    </>
  );
};

export default GoogleMapPicker;
