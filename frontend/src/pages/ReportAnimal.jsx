import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../Hooks/useGoogleMaps";
import { FaMapMarkerAlt, FaLocationArrow, FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "18px",
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

  // ---------------- Input Handler ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files[0]) {
      setFormData({ ...formData, photo: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ---------------- Autocomplete ----------------
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
      toast.success("Location selected");
    }
  };

  // ---------------- Current Location ----------------
  const useCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        toast.success("Location detected!");
        setShowMap(true);

        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results[0]) setAddress(results[0].formatted_address);
          });
        }
      },
      () => toast.error("Unable to fetch your location")
    );
  };

  useEffect(() => {
    if (isLoaded) useCurrentLocation();
  }, [isLoaded]);

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.city || !formData.description)
      return toast.error("All fields required");

    if (!position) return toast.error("Please select location!");

    if (!formData.photo) return toast.error("Upload an animal picture!");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("Please login first");

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
      } else toast.error(data.message || "Submission failed");
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  if (!isLoaded) return <p className="text-center mt-20">Loading map...</p>;

  return (
    <div className="pt-24 px-4 pb-14 bg-gradient-to-b from-white to-teal-50 min-h-screen">
      
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center text-teal-800 mb-8 drop-shadow-sm"
      >
        Report Animal in Distress 🐾
      </motion.h2>

      <motion.form
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-6 bg-white rounded-2xl shadow-2xl border p-8 backdrop-blur"
      >

        {/* Photo Upload */}
        <div className="flex flex-col items-center">
          {!photoPreview ? (
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-teal-400 rounded-xl w-full h-44 flex items-center justify-center flex-col gap-2 transition">
              <FaUpload className="text-3xl text-teal-700" />
              <p className="text-gray-700 font-medium">Upload Animal Picture</p>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} hidden />
            </label>
          ) : (
            <div className="relative w-full max-w-xs">
              <img src={photoPreview} alt="Preview" className="rounded-xl w-full h-44 object-cover shadow-lg" />
              <button
                type="button"
                onClick={() => {
                  setPhotoPreview(null);
                  setFormData({ ...formData, photo: null });
                  toast.info("Image removed");
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="type"
            placeholder="Animal type (Dog, Cat, etc.)"
            value={formData.type}
            onChange={handleChange}
            className="input-style"
          />
          <input
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="input-style"
          />
        </div>

        <textarea
          name="description"
          placeholder="Describe the animal condition..."
          value={formData.description}
          onChange={handleChange}
          className="input-style h-28"
        />

        {/* Autocomplete */}
        <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceSelect}>
          <input
            placeholder="Search address or location"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-style"
          />
        </Autocomplete>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={useCurrentLocation}
            className="map-btn bg-green-600 hover:bg-green-700"
          >
            <FaLocationArrow /> Detect Location
          </button>

          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="map-btn bg-teal-600 hover:bg-teal-700"
          >
            <FaMapMarkerAlt /> {showMap ? "Hide Map" : "Select on Map"}
          </button>
        </div>

        {/* Map */}
        <AnimatePresence>
          {showMap && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <ReportAnimalMap position={position} setPosition={setPosition} onAddressUpdate={setAddress} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-bold bg-amber-500 hover:bg-amber-600 transition text-lg shadow"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </motion.form>

      {/* Reusable Styles */}
      <style>{`
        .input-style {
          border: 1px solid #d1d5db;
          padding: 12px;
          border-radius: 10px;
          outline: none;
          transition: 0.3s;
          width: 100%;
        }
        .input-style:focus {
          border-color: #0d9488;
          box-shadow: 0 0 0 2px rgba(13,148,136,0.25);
        }
        .map-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 10px;
          color: white;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ReportAnimal;
