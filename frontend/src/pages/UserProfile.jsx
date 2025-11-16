import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTrashAlt, FaEye, FaAward } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [adoptedAnimals, setAdoptedAnimals] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const [uRes, rRes, aRes] = await Promise.all([
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

        const userData = await uRes.json();
        const reportsData = await rRes.json();
        const adoptionData = await aRes.json();

        setUser(userData.user);
        setReports(reportsData.data || []);

        setPendingRequests(adoptionData.data.pending || []);
        setAdoptedAnimals(adoptionData.data.approved || []);
        setRejectedRequests(adoptionData.data.rejected || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const deleteReport = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/user/delete-report/${confirmDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => prev.filter((r) => r._id !== confirmDelete));
      setConfirmDelete(null);
    } catch {}
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;

  const profilePic = user?.profilePic
    ? user.profilePic.startsWith("http")
      ? user.profilePic
      : `http://localhost:8000/${user.profilePic.replace(/\\/g, "/")}`
    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  return (
    <div className="pt-24 min-h-screen bg-white">

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-3xl shadow-xl flex gap-6 items-center"
      >
        <img src={profilePic} className="w-24 h-24 rounded-full border-4 border-amber-300 object-cover" />
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="opacity-85">{user?.email}</p>
          <p className="flex gap-1 items-center text-amber-200">
            <FaMapMarkerAlt /> {user?.city}
          </p>
        </div>
      </motion.div>

      {/* Achievements */}
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-3 gap-4">
        {[
          { label: "Reports", count: reports.length },
          { label: "Requests", count: pendingRequests.length },
          { label: "Adopted", count: adoptedAnimals.length },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.07 }}
            className="bg-white text-center p-4 rounded-xl shadow border border-gray-100"
          >
            <h3 className="text-xl font-bold text-teal-700">{stat.count}</h3>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto flex mt-10 bg-gray-100 p-2 rounded-full">
        {["reports", "requests", "adopted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-full font-semibold transition ${
              activeTab === tab
                ? "bg-teal-600 text-white shadow"
                : "text-gray-600"
            }`}
          >
            {tab === "reports" ? "Reported" : tab === "requests" ? "Requested" : "Adopted"}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto mt-10 px-4">

        <AnimatePresence mode="wait">
          {activeTab === "reports" && (
            <TabGrid key="r">
              {reports.map((r) => (
                <Card
                  key={r._id}
                  title={r.type}
                  city={r.city}
                  image={r.imageUrl}
                  status="📌 Reported"
                  onView={() => navigate(`/report/${r._id}`)}
                  onDelete={() => setConfirmDelete(r._id)}
                />
              ))}
            </TabGrid>
          )}

          {activeTab === "requests" && (
            <TabGrid key="re">
              {[...pendingRequests, ...rejectedRequests].map((item) => (
                <Card
                  key={item._id}
                  title={item.animal?.name}
                  city={item.animal?.city}
                  image={item.animal?.images?.[0]}
                  status={`${item.status === "pending" ? "⏳ Pending" : "❌ Rejected"}`}
                  onView={() => navigate(`/adoption/${item.animal?._id}`)}
                />
              ))}
            </TabGrid>
          )}

          {activeTab === "adopted" && (
            <TabGrid key="ad">
              {adoptedAnimals.map((item) => (
                <Card
                  key={item._id}
                  title={item.animal?.name}
                  city={item.animal?.city}
                  image={item.animal?.images?.[0]}
                  status="🎉 Adopted"
                  badgeColor="bg-green-600"
                  onView={() => navigate(`/adoption/${item.animal?._id}`)}
                />
              ))}
            </TabGrid>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-end pb-10"
          >
            <motion.div
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              className="bg-white w-full max-w-md rounded-t-3xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-red-600 mb-2">Delete Report?</h3>
              <p className="text-gray-600 mb-5">This action is irreversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2 rounded bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteReport}
                  className="flex-1 py-2 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;


/* ---- Sub Components ---- */

const TabGrid = ({ children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
    {children.length ? children : <p className="col-span-full text-center text-gray-500">No records found.</p>}
  </motion.div>
);

const Card = ({ title, city, image, status, onView, onDelete, badgeColor }) => (
  <motion.div whileHover={{ scale: 1.04 }} className="bg-white rounded-2xl shadow-lg relative overflow-hidden border">
    <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-black/60 backdrop-blur text-white`}>
      {status}
    </span>

    <img src={image || "https://via.placeholder.com/300"} className="w-full h-56 object-cover" />

    <div className="p-4 space-y-1">
      <h3 className="font-bold text-teal-800">{title}</h3>
      <p className="text-gray-500 text-sm">{city}</p>

      <div className="flex justify-between pt-3">
        <button onClick={onView} className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded">
          <FaEye /> View
        </button>
        {onDelete && (
          <button onClick={onDelete} className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
            <FaTrashAlt /> Delete
          </button>
        )}
      </div>
    </div>
  </motion.div>
);
