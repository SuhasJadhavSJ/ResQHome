import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaMapMarkerAlt, FaDog } from "react-icons/fa";

const CorpReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/corp/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8000/api/corp/reports/update-status/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await res.json();
    if (data.success) {
      alert("Status updated!");
      fetchReports();
    }
  };

  if (loading) {
    return <div className="pt-24 text-center text-gray-600">Loading Reports...</div>;
  }

  return (
    <div className="pt-20 ml-24 px-6">
      <h1 className="text-3xl font-bold text-teal-900 mb-8">Reported Animals 🐾</h1>

      {reports.length === 0 ? (
        <p className="text-gray-600">No reports found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, index) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200"
            >
              {/* Image */}
              <img
                src={report.imageUrl}
                alt={report.type}
                className="w-full h-60 object-cover"
              />

              {/* Content */}
              <div className="p-5 space-y-2">
                <h2 className="text-xl font-semibold text-teal-800">
                  {report.type}
                </h2>

                <p className="text-gray-700 text-sm">
                  {report.description}
                </p>

                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaMapMarkerAlt className="text-amber-500" />  
                  {report.address || report.city}
                </p>

                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaClock className="text-teal-500" />
                  {new Date(report.createdAt).toLocaleString("en-IN")}
                </p>

                {/* Status */}
                <p className="font-semibold mt-2">
                  Status:{" "}
                  <span
                    className={
                      report.status === "pending"
                        ? "text-yellow-600"
                        : report.status === "in-progress"
                        ? "text-blue-600"
                        : "text-green-600"
                    }
                  >
                    {report.status}
                  </span>
                </p>

                {/* Status update buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => updateStatus(report._id, "in-progress")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Mark In-Process
                  </button>

                  <button
                    onClick={() => updateStatus(report._id, "rescued")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Mark Rescued
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorpReports;
