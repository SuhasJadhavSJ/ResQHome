import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaw,
} from "react-icons/fa";

const LoaderCard = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-md p-5 space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-48 bg-gray-200 rounded"></div>
  </div>
);

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8000/api/user/my-reports",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok && data.success) setReports(data.data || []);
        else console.error(data.message);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-teal-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-teal-800 mb-10 tracking-wide"
        >
          My Animal Reports 🐾
        </motion.h1>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <LoaderCard key={n} />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            You haven’t reported any animals yet.
            <p className="mt-3 text-teal-700">Be the first to save a life ❤️</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-56">
                  <img
  src={report.imageUrl || "https://cdn-icons-png.flaticon.com/512/616/616408.png"}
  alt={report.type}
  className="w-full h-48 object-cover rounded-md"
/>

                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                    {report.status?.toUpperCase() || "PENDING"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-2xl font-semibold text-teal-800 mb-2">
                    {report.type}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-amber-500" />
                      {report.address || report.city}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaClock className="text-teal-500" />
                      {new Date(report.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center gap-2">
                    {report.status === "rescued" && (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    )}
                    {report.status === "pending" && (
                      <FaExclamationCircle className="text-yellow-500 text-lg" />
                    )}
                    {report.status === "in-progress" && (
                      <FaMapMarkerAlt className="text-blue-500 text-lg" />
                    )}
                    <span
                      className={`font-semibold capitalize ${
                        report.status === "rescued"
                          ? "text-green-700"
                          : report.status === "in-progress"
                          ? "text-blue-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {/* Button */}
                  <button className="mt-5 w-full flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                    <FaPaw /> View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
