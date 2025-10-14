import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useGoogleMaps } from "../utils/googleMapsLoader";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "8px",
  overflow: "hidden",
};

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    // Fetch reports (replace with actual backend endpoint)
    fetch("/api/my-reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  if (!isLoaded) return <p className="text-center text-gray-500 mt-20">Loading map...</p>;

  return (
    <div className="pt-20 p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-teal-800 mb-8 text-center">
        My Reports
      </h2>

      {reports.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          You haven’t reported any animals yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col">
                <h3 className="text-2xl font-semibold text-teal-700 mb-2">
                  {report.type}
                </h3>
                <p className="text-gray-600 mb-2">
                  <strong>City:</strong> {report.city}
                </p>
                <p className="text-gray-600 mb-4">{report.description}</p>

                {report.photo && (
                  <img
                    src={report.photo}
                    alt={report.type}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}

                {report.location && (
                  <div className="h-48 mb-4">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={report.location}
                      zoom={15}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      <Marker position={report.location} />
                    </GoogleMap>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-sm">
                    Reported on:{" "}
                    {new Date(report.createdAt).toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded ${
                      report.status === "rescued"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status === "rescued"
                      ? "Rescued"
                      : "Pending Rescue"}
                  </span>
                </div>

                <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
