import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPaw,
  FaTrashAlt,
  FaArrowLeft,
} from "react-icons/fa";

const ReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch report by ID
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch(`http://localhost:8000/api/user/report/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success) setReport(data.report);
        else console.error(data.message);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  // ✅ Delete report
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/api/user/delete-report/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Report deleted successfully!");
        navigate("/profile");
      } else alert(data.message || "Failed to delete report");
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-teal-700 font-semibold text-lg animate-pulse">
        Loading report details...
      </div>
    );

  if (!report)
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        Report not found.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pt-20 pb-12 min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center px-6"
    >
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 transition font-semibold"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="text-2xl font-bold text-teal-800">
            Report Details
          </h2>
        </div>

        {/* Image */}
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={report.imageUrl}
            alt={report.type}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
            {report.status?.toUpperCase() || "PENDING"}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-3xl font-bold text-teal-700 mb-2">
              {report.type}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {report.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-500" />
              <span>
                <strong>Location:</strong>{" "}
                {report.address || report.city || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-teal-500" />
              <span>
                <strong>Reported On:</strong>{" "}
                {new Date(report.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {report.status === "rescued" ? (
                <FaCheckCircle className="text-green-500" />
              ) : report.status === "in-progress" ? (
                <FaPaw className="text-blue-500" />
              ) : (
                <FaExclamationCircle className="text-yellow-500" />
              )}
              <span>
                <strong>Status:</strong> {report.status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
            >
              <FaTrashAlt /> Delete Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportDetails;
