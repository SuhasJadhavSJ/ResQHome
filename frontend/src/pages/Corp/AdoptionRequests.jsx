import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPaw, FaUser, FaCheck, FaTimes, FaClock } from "react-icons/fa";

const statusColors = {
  pending: "bg-yellow-500",
  in_process: "bg-blue-500",
  rejected: "bg-red-600",
  adopted: "bg-green-600",
};

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all adoption requests
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/corp/adoption-requests/requests", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      if (data.success) setRequests(data.data);
    } catch (err) {
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update status
  const updateStatus = async (id, status) => {
    const confirmAction = window.confirm(`Confirm status update to "${status}"?`);
    if (!confirmAction) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/corp/adoption-requests/requests/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Status updated!");
        fetchRequests(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-500 text-xl animate-pulse">
        Loading adoption requests...
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-teal-700 text-center mb-10">
        Adoption Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No adoption requests found.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req, i) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
            >
              <img
                src={req.animal?.images?.[0] || "https://via.placeholder.com/400x300"}
                alt={req.animal?.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 space-y-3">
                <span
                  className={`text-white px-3 py-1 rounded-full text-xs ${statusColors[req.status]}`}
                >
                  {req.status.toUpperCase()}
                </span>

                <h2 className="text-xl font-bold text-teal-700 flex items-center gap-2">
                  <FaPaw /> {req.animal?.name || "Unknown"}
                </h2>

                <div className="text-gray-700 text-sm space-y-1">
                  <p><b>Type:</b> {req.animal?.type}</p>
                  <p><b>City:</b> {req.animal?.city}</p>
                </div>

                <hr />

                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FaUser /> Applicant
                </h3>
                <p className="text-gray-600 text-sm">
                  <b>Name:</b> {req.user?.name}
                </p>
                <p className="text-gray-600 text-sm">
                  <b>Email:</b> {req.user?.email}
                </p>
                <p className="text-gray-600 text-sm">
                  <b>City:</b> {req.user?.city || "Not provided"}
                </p>

                {/* ACTIONS */}
                {req.status !== "adopted" && req.status !== "rejected" && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {req.status === "pending" && (
                      <button
                        onClick={() => updateStatus(req._id, "in_process")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                      >
                        Move to Process
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(req._id, "adopted")}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm flex items-center gap-2"
                    >
                      <FaCheck /> Approve & Adopt
                    </button>
                    <button
                      onClick={() => updateStatus(req._id, "rejected")}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm flex items-center gap-2"
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
    </div>
  );
};

export default AdoptionRequests;
