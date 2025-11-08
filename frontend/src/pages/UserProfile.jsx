import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch user data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch profile");

        // ✅ Store in state and update local storage
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        No user data found.
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-gray-200 mt-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start p-8 gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-amber-400 object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 justify-center md:justify-start">
              <h2 className="text-2xl font-semibold text-teal-800">
                {user.name}
              </h2>

              {/* Edit Profile Button */}
              <button
                onClick={() => navigate("/edit-profile")}
                className="border border-gray-300 text-gray-800 font-semibold px-4 py-1 rounded-md hover:bg-gray-100 transition"
              >
                Edit Profile
              </button>
            </div>

            <div className="text-gray-600 space-y-1">
              <p className="text-sm">{user.email}</p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FaMapMarkerAlt className="text-amber-500" />
                {user.city || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Stats Section */}
        <div className="flex justify-around py-6 text-center">
          <div>
            <p className="font-bold text-teal-800 text-lg">12</p>
            <p className="text-gray-500 text-sm">Reports</p>
          </div>
          <div>
            <p className="font-bold text-teal-800 text-lg">4</p>
            <p className="text-gray-500 text-sm">Adoptions</p>
          </div>
          <div>
            <p className="font-bold text-teal-800 text-lg">8</p>
            <p className="text-gray-500 text-sm">Rescued</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Gallery Section */}
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-teal-700 mb-3">
            Recent Activity
          </h3>
          <p className="text-gray-500 text-sm">
            Coming soon — your reports and adoptions will appear here!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
