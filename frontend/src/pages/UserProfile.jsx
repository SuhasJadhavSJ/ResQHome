import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPaw, FaTrashAlt, FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch user, reports, adoptions
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const [profileRes, reportRes, adoptionRes] = await Promise.all([
          fetch("http://localhost:8000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/user/my-reports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/user/my-adoptions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [profileData, reportsData, adoptionsData] = await Promise.all([
          profileRes.json(),
          reportRes.json(),
          adoptionRes.json(),
        ]);

        setUser(profileData.user);
        setReports(reportsData.data || []);
        setAdoptions(adoptionsData.data || []);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [navigate]);

  // ✅ Delete report
  const handleDeleteReport = async (id) => {
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
        setReports((prev) => prev.filter((r) => r._id !== id));
      } else alert(data.message || "Failed to delete report");
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  if (loading)
    return (
      <div className="pt-24 text-center text-gray-600 text-lg animate-pulse">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        No user data found.
      </div>
    );

  // ✅ Safe image URL handling
  const profilePic = user.profilePic
    ? user.profilePic.startsWith("http")
      ? user.profilePic
      : `http://localhost:8000/${user.profilePic.replace(/\\/g, "/")}`
    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col items-center">
      {/* ===== Profile Header ===== */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-gray-200 mt-10">
        <div className="flex flex-col md:flex-row items-center md:items-start p-8 gap-6">
          <img
            src={profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-amber-400 object-cover shadow-md"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-center md:justify-start">
              <h2 className="text-2xl font-semibold text-teal-800">
                {user.name}
              </h2>
              <button
                onClick={() => navigate("/edit-profile")}
                className="border border-gray-300 text-gray-800 font-semibold px-4 py-1 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
            <p className="text-gray-600">{user.email}</p>
            <p className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-amber-500" />
              {user.city || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="mt-8 w-full max-w-4xl flex justify-center gap-8 border-t border-gray-300">
        <button
          onClick={() => setActiveTab("reports")}
          className={`cursor-pointer py-3 px-6 font-semibold text-sm tracking-wide border-b-2 transition ${
            activeTab === "reports"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Reported Animals
        </button>
        <button
          onClick={() => setActiveTab("adoptions")}
          className={`cursor-pointer py-3 px-6 font-semibold text-sm tracking-wide border-b-2 transition ${
            activeTab === "adoptions"
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          Adopted Pets
        </button>
      </div>

      {/* ===== Tab Content ===== */}
      <div className="max-w-5xl mx-auto px-6 mt-8 w-full">
        <AnimatePresence mode="wait">
          {activeTab === "reports" ? (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {reports.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full">
                  No reports found.
                </p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report._id}
                    className="relative group rounded-xl overflow-hidden bg-white shadow hover:shadow-xl transition duration-300 cursor-pointer"
                  >
                    <img
                      src={
                        report.imageUrl?.startsWith("http")
                          ? report.imageUrl
                          : `http://localhost:8000/${report.imageUrl?.replace(
                              /\\/g,
                              "/"
                            )}`
                      }
                      alt={report.type}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => navigate(`/report/${report._id}`)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-teal-700">
                        {report.type}
                      </h3>
                      <p className="text-gray-600 text-sm">{report.city}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <FaMapMarkerAlt className="text-amber-500" />{" "}
                        {report.address || "No address"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="adoptions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {adoptions.length === 0 ? (
                <p className="text-center text-gray-600 col-span-full">
                  No adopted pets found.
                </p>
              ) : (
                adoptions.map((adopt) => (
                  <div
                    key={adopt._id}
                    className="relative group rounded-xl overflow-hidden bg-white shadow hover:shadow-xl transition duration-300"
                  >
                    <img
                      src={
                        adopt.animal?.image?.startsWith("http")
                          ? adopt.animal.image
                          : `http://localhost:8000/${adopt.animal?.image?.replace(
                              /\\/g,
                              "/"
                            )}`
                      }
                      alt={adopt.animal?.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <button
                        onClick={() => navigate(`/pet/${adopt.animal?._id}`)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full flex items-center gap-2 transition"
                      >
                        <FaEye /> View
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-teal-700">
                        {adopt.animal?.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {adopt.animal?.type}
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <FaMapMarkerAlt className="text-amber-500" />{" "}
                        {adopt.animal?.city || "No address"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
