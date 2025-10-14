import { useJsApiLoader } from "@react-google-maps/api";

export const libraries = ["places"]; // Includes Maps and Autocomplete APIs

export const useGoogleMaps = () => {
  return useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
};
