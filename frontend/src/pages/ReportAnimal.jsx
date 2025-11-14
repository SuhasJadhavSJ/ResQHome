import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../Hooks/useGoogleMaps";
import {
  FaMapMarkerAlt,
  FaLocationArrow,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

// ===================== Map Component =====================
const ReportAnimalMap = ({ position, setPosition, onAddressUpdate }) => {
  useEffect(() => {
    if (position && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results[0]) {
          onAddressUpdate(results[0].formatted_address);
        }
      });
    }
  }, [position]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position || { lat: 20, lng: 77 }}
      zoom={position ? 15 : 5}
      onClick={(e) =>
        setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      }
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {position && (
        <Marker
          position={position}
          draggable
          onDragEnd={(e) =>
            setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          }
        />
      )}
    </GoogleMap>
  );
};

// ===================== Main Component =====================
const ReportAnimal = () => {
  const { isLoaded } = useGoogleMaps();
  const autocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    type: "",
    description: "",
    city: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files[0]) {
      setFormData({ ...formData, photo: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
      toast.info("Preview updated!");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Autocomplete Select
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPosition(coords);
      setAddress(place.formatted_address || place.name);
      setShowMap(true);
      toast.success("Location selected!");
    }
  };

  // Current Location
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(coords);
        toast.info("Location detected!");

        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        }

        setShowMap(true);
      },
      () => toast.error("Unable to fetch your location")
    );
  };

  useEffect(() => {
    if (isLoaded) useCurrentLocation();
  }, [isLoaded]);

  // Submit Report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.city || !formData.description) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!position) {
      toast.error("Select or detect the location!");
      return;
    }

    if (!formData.photo) {
      toast.error("Please upload an image!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required!");
      return;
    }

    setLoading(true);

    const form = new FormData();
    form.append("type", formData.type);
    form.append("description", formData.description);
    form.append("city", formData.city);
    form.append("address", address);
    form.append("location", JSON.stringify(position));
    form.append("photo", formData.photo);

    try {
      const res = await fetch("http://localhost:8000/api/user/report", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Report submitted successfully!");

        setFormData({ type: "", description: "", city: "", photo: null });
        setPhotoPreview(null);
        setAddress("");
        setPosition(null);
        setShowMap(false);
      } else {
        toast.error(data.message || "Error submitting report");
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="pt-20 p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-teal-800 mb-8 text-center">
        Report an Animal in Need 🐶
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="type"
            placeholder="Animal Type (Dog, Cat, etc.)"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Describe the animal’s condition..."
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400"
          required
        />

        {/* Photo Upload */}
        <div className="relative">
          <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          {photoPreview && (
            <div className="mt-3 relative w-40">
              <img
                src={photoPreview}
                alt="Preview"
                className="rounded-lg shadow-md w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setFormData({ ...formData, photo: null });
                  toast.info("Image removed");
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Search or type address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400"
          />
        </Autocomplete>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          <button
            type="button"
            onClick={useCurrentLocation}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white"
          >
            <FaLocationArrow /> Use Current Location
          </button>

          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-teal-600 hover:bg-teal-700 text-white"
          >
            <FaMapMarkerAlt /> {showMap ? "Hide Map" : "Select from Map"}
          </button>
        </div>

        {/* Map */}
        {showMap && (
          <div className="mt-6">
            <ReportAnimalMap
              position={position}
              setPosition={setPosition}
              onAddressUpdate={setAddress}
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold mt-6 w-full md:w-auto"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportAnimal;
