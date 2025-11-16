import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Pagination from "../../components/common/Pagination";

const CorpReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/corp/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReports(data.data);
    } catch (err) {
      console.error("Report Fetch Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const rescueAnimal = async (id) => {
    const res = await fetch(
      `http://localhost:8000/api/corp/report/${id}/rescue`,
      { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    const data = await res.json();
    if (data.success) {
      alert("Animal moved to rescued list!");
      fetchReports();
    }
  };

  const updateStatus = async (id, newStatus) => {
    const res = await fetch(
      `http://localhost:8000/api/corp/reports/update-status/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const statusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      case "in-progress":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "rescued":
        return `${baseClasses} bg-green-100 text-green-700`;
      default:
        return `${baseClasses} bg-gray-200 text-gray-700`;
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg pt-10 animate-pulse">
        Fetching reports...
      </p>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedReports = reports.slice(start, start + itemsPerPage);

  return (
    <section className="ml-[90px] min-h-screen bg-gray-50 py-6 pr-6">
      <div className="max-w-[1700px] w-full">

        <h1 className="text-3xl font-extrabold text-teal-900 tracking-wide mb-7 pl-4">
          Reported Animals
        </h1>

        {reports.length === 0 ? (
          <p className="text-gray-600 text-lg pl-4">No reports found.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 pl-4">
              {paginatedReports.map((report, index) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow hover:shadow-2xl border border-gray-200 overflow-hidden transition-all group"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={report.imageUrl}
                      alt={report.type}
                      className="w-full h-56 object-cover group-hover:scale-[1.02] transition-all"
                    />
                    <span
                      className={`${statusBadge(
                        report.status
                      )} absolute top-3 left-3`}
                    >
                      {report.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-2">
                    <h2 className="text-xl font-bold text-teal-900">
                      {report.type}
                    </h2>
                    <p className="text-gray-700 text-sm leading-5 line-clamp-2">
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

                    <p className="flex items-center gap-2 text-gray-700 text-sm">
                      <FaUser className="text-purple-600" />
                      <span className="font-semibold text-teal-700">
                        {report.user?.name || "Unknown Reporter"}
                      </span>
                    </p>

                    {/* Action buttons */}
                    {report.status !== "rescued" && (
                      <div className="flex gap-2 flex-wrap mt-4">
                        {report.status !== "in-progress" && (
                          <button
                            onClick={() =>
                              updateStatus(report._id, "in-progress")
                            }
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium"
                          >
                            Mark In-Progress
                          </button>
                        )}
                        <button
                          onClick={() => rescueAnimal(report._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-medium"
                        >
                          Mark Rescued
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default CorpReports;
