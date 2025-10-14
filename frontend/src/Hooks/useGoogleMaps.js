// src/hooks/useGoogleMaps.js
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"]; // load 'places' once for all components

export const useGoogleMaps = () => {
  return useJsApiLoader({
    id: "google-map-script", // keep one ID everywhere
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};
