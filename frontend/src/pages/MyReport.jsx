import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "8px",
  overflow: "hidden"
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // Fetch user's reports from backend
  useEffect(() => {
    // Replace with your actual API call
    fetch("/api/my-reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="pt-20 p-6 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-teal-800 mb-8 text-center">My Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-600 text-center">You have not reported any animals yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">{report.type}</h3>
              <p className="text-gray-600 mb-2"><strong>City:</strong> {report.city}</p>
              <p className="text-gray-600 mb-4">{report.description}</p>

              {report.photo && (
                <img src={report.photo} alt={report.type} className="w-full h-48 object-cover rounded-md mb-4" />
              )}

              {report.location && (
                <div className="mb-4 h-48">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={report.location}
                    zoom={15}
                    options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                  >
                    <Marker position={report.location} />
                  </GoogleMap>
                </div>
              )}

              <p className="text-gray-500 text-sm">Reported on: {new Date(report.createdAt).toLocaleString()}</p>
              <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
