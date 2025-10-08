import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const ReportAnimalMap = ({ position, setPosition, autocompleteRef }) => {
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
          draggable={true}
          onDragEnd={(e) =>
            setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          }
        />
      )}
      {autocompleteRef && <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} />}
    </GoogleMap>
  );
};

const ReportAnimal = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    city: "",
    photo: null
  });
  const [position, setPosition] = useState(null);
  const [locationMethod, setLocationMethod] = useState(""); // "map" or "address"
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"] // required for Autocomplete
  });

  // Get current location for map option
  useEffect(() => {
    if (locationMethod === "map" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, [locationMethod]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") setFormData({ ...formData, photo: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        setPosition({ lat: lat(), lng: lng() });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position) return alert("Please select a location using the map or address");
    console.log({ ...formData, location: position, address });
    alert("Report submitted successfully!");
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="pt-20 p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-teal-800 mb-8 text-center">Report an Animal</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="type" placeholder="Animal Type" value={formData.type} onChange={handleChange} required className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400" />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400" />
        </div>

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400" />
        <input type="file" name="photo" onChange={handleChange} className="w-full" />

        {!locationMethod && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <button type="button" onClick={() => setLocationMethod("map")} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold">
              Select Location on Map
            </button>
            <button type="button" onClick={() => setLocationMethod("address")} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold">
              Enter Address
            </button>
          </div>
        )}

        {locationMethod === "map" && (
          <div className="mt-4">
            <ReportAnimalMap position={position} setPosition={setPosition} />
            <p className="text-gray-600 mt-2 text-sm">Click or drag the marker to select the animal's location</p>
          </div>
        )}

        {locationMethod === "address" && (
          <div className="mt-4 flex flex-col gap-2">
            <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceSelect}>
              <input
                type="text"
                placeholder="Type address here"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border p-3 rounded-md focus:ring-2 focus:ring-teal-400"
              />
            </Autocomplete>
            {position && (
              <div className="mt-4 h-96">
                <ReportAnimalMap position={position} setPosition={setPosition} />
              </div>
            )}
          </div>
        )}

        {locationMethod && (
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold mt-4 w-full md:w-auto">
            Submit Report
          </button>
        )}
      </form>
    </div>
  );
};

export default ReportAnimal;
