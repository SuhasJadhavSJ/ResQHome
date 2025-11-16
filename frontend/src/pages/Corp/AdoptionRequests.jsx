// frontend/pages/Corp/AdoptionRequests.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPaw,
  FaUser,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  in_process: "bg-blue-100 text-blue-700 border border-blue-300",
  rejected: "bg-red-100 text-red-700 border border-red-300",
  adopted: "bg-green-100 text-green-700 border border-green-300",
};

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/corp/adoption-requests/requests",
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Confirm update to ${status}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/corp/adoption-requests/requests/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (data.success) {
        fetchRequests();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg ml-[90px] pt-10 animate-pulse">
        Loading adoption requests...
      </p>
    );

  return (
    <section className="ml-[90px] min-h-screen bg-gray-50 py-6 pr-6">
      <h1 className="text-3xl font-bold text-teal-900 mb-8 ml-4">
        Adoption Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-gray-600 ml-4 text-lg">No adoption requests yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 ml-4">
          {requests.map((req, index) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition"
            >
              <img
                src={
                  req.animal?.images?.[0] ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={req.animal?.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5 space-y-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyles[req.status]}`}
                >
                  {req.status.replace("_", " ").toUpperCase()}
                </span>

                <h2 className="text-xl font-bold text-teal-900 flex items-center gap-2">
                  <FaPaw /> {req.animal?.name || "Unknown"}
                </h2>

                <p className="text-gray-700 text-sm">
                  <b>Type:</b> {req.animal?.type} • <b>City:</b>{" "}
                  {req.animal?.city}
                </p>

                <hr className="my-2" />

                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaUser /> Applicant Details
                </h3>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <b>Name:</b> {req.user?.name}
                  </p>
                  <p>
                    <b>Email:</b> {req.user?.email}
                  </p>
                  <p>
                    <b>City:</b> {req.user?.city || "Not provided"}
                  </p>
                </div>

                {req.status !== "adopted" && req.status !== "rejected" && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {req.status === "pending" && (
                      <button
                        onClick={() => updateStatus(req._id, "in_process")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg"
                      >
                        Move To Process
                      </button>
                    )}

                    <button
                      onClick={() => updateStatus(req._id, "adopted")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg flex items-center gap-2"
                    >
                      <FaCheck /> Approve
                    </button>

                    <button
                      onClick={() => updateStatus(req._id, "rejected")}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg flex items-center gap-2"
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdoptionRequests;
