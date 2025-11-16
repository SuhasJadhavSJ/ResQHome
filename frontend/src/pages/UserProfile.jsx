import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaTrashAlt, FaEye } from "react-icons/fa";
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

        // Separate adoption requests
        const pending = adoptionData.data.pending || [];
        const approved = adoptionData.data.approved || [];
        const rejected = adoptionData.data.rejected || [];

        setPendingRequests(pending);
        setAdoptedAnimals(approved);
        setRejectedRequests(rejected);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete report permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/user/delete-report/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;

  const profilePic = user?.profilePic
    ? user.profilePic.startsWith("http")
      ? user.profilePic
      : `http://localhost:8000/${user.profilePic.replace(/\\/g, "/")}`
    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col items-center">

      {/* HEADER */}
      <div className="max-w-4xl bg-white border shadow rounded-xl mt-10 w-full">
        <div className="p-6 flex items-center gap-6">
          <img src={profilePic} className="w-28 h-28 rounded-full border-4 border-amber-400 object-cover" />
          <div>
            <h1 className="text-2xl font-bold text-teal-800">{user?.name}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="flex items-center gap-1 text-gray-600">
              <FaMapMarkerAlt className="text-amber-500" /> {user?.city || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 flex gap-8 border-b">
        {["reports", "requests", "adopted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-5 font-semibold text-sm border-b-2 ${
              activeTab === tab ? "text-teal-700 border-teal-600" : "text-gray-500 border-transparent"
            }`}
          >
            {tab === "reports" ? "Reported Animals" : tab === "requests" ? "Adoption Requests" : "Adopted Animals"}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 w-full">
        <AnimatePresence mode="wait">

          {/*  REPORTS  */}
          {activeTab === "reports" && (
            <motion.div key="rep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {reports.length === 0 ? <p className="text-center col-span-full text-gray-500">No reports.</p> :
                reports.map((report) => (
                  <ProfileCard
                    key={report._id}
                    data={report}
                    image={
                      report.imageUrl?.startsWith("http")
                        ? report.imageUrl
                        : `http://localhost:8000/${report.imageUrl}`
                    }
                    onDelete={() => handleDeleteReport(report._id)}
                    onView={() => navigate(`/report/${report._id}`)}
                    showDelete={true}
                  />
                ))}
            </motion.div>
          )}

          {/*  ADOPTION REQUESTS  */}
          {activeTab === "requests" && (
            <motion.div key="req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-10">

              <Section label="Pending Requests" color="bg-amber-500" list={pendingRequests} navigate={navigate} />
              <Section label="Rejected Requests" color="bg-red-600" list={rejectedRequests} navigate={navigate} />
            </motion.div>
          )}

          {/*  ADOPTED ANIMALS  */}
          {activeTab === "adopted" && (
            <motion.div key="adop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-8">
              <Section label="Adopted Successfully" color="bg-green-600" list={adoptedAnimals} navigate={navigate} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;

/* ---------- REUSABLE COMPONENTS ---------- */

const ProfileCard = ({ data, image, onDelete, onView, showDelete }) => (
  <div className="group relative bg-white shadow rounded-xl overflow-hidden">
    <img src={image} alt="" className="w-full h-60 object-cover group-hover:scale-110 transition" />
    <div className="p-3">
      <h3 className="text-teal-800 font-semibold">{data?.name || data?.type || "Unknown"}</h3>
      <p className="text-gray-500 text-sm">{data?.city}</p>
    </div>
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
      <button onClick={onView} className="px-4 py-2 rounded bg-amber-500 text-white mx-2 flex items-center gap-2">
        <FaEye /> View
      </button>

      {showDelete && (
        <button onClick={onDelete} className="px-4 py-2 rounded bg-red-600 text-white mx-2 flex items-center gap-2">
          <FaTrashAlt /> Delete
        </button>
      )}
    </div>
  </div>
);

const Section = ({ label, list, color, navigate }) => (
  <div>
    <h2 className="text-lg font-semibold mb-2">{label}</h2>
    {list.length === 0 ? (
      <p className="text-gray-500 text-sm">No records found.</p>
    ) : (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((item) => {
          const image = item?.animal?.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image";
          return (
            <div key={item._id} className="relative rounded-xl bg-white shadow overflow-hidden">
              <span className={`absolute top-2 left-2 px-2 py-1 text-white text-xs font-semibold rounded ${color}`}>
                {item.status.toUpperCase()}
              </span>
              <img src={image} alt="" className="w-full h-60 object-cover" />
              <div className="p-3">
                <h4 className="font-semibold text-teal-700">{item?.animal?.name}</h4>
                <p className="text-gray-500 text-xs">{item?.animal?.city}</p>
                <button
                  onClick={() => navigate(`/adoption/${item?.animal?._id}`)}
                  className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded text-xs"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
