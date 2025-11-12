import React, { useState, useEffect } from "react";
import { FaUserEdit, FaCamera, FaLock, FaKey, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", city: "", email: "", profilePic: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Update profile (name, city, photo)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authorized!");

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("city", user.city);
    if (imageFile) formData.append("profilePic", imageFile);

    try {
      const res = await fetch("http://localhost:8000/api/user/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Profile updated!");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile");
      } else {
        alert(data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("❌ Something went wrong.");
    }
  };

  // ✅ Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Not authorized!");
    if (passwords.newPassword !== passwords.confirmNewPassword)
      return alert("Passwords do not match");

    try {
      const res = await fetch("http://localhost:8000/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });
      const data = await res.json();
      if (data.success) {
        alert("🔑 Password updated successfully!");
        setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setShowPasswordForm(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex justify-center items-start p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-teal-800 flex items-center gap-2">
            <FaUserEdit /> Edit Profile
          </h2>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-500 transition"
          >
            <FaHome /> Back
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src={
              imagePreview ||
              user.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-amber-400 shadow-md"
            whileHover={{ scale: 1.05 }}
          />
          <label
            htmlFor="profilePic"
            className="mt-3 bg-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-amber-600 transition"
          >
            <FaCamera /> Change Picture
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Update Profile */}
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">City</label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border p-3 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Save Changes
          </button>
        </form>

        {/* Password Section */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-teal-800 flex items-center gap-2">
              <FaLock /> Security Settings
            </h3>
            <button
              onClick={() => setShowPasswordForm((prev) => !prev)}
              className="text-sm text-amber-500 hover:underline font-semibold"
            >
              {showPasswordForm ? "Hide Password Section" : "Update Password"}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-5">
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Current Password"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="New Password"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="password"
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })}
                placeholder="Confirm New Password"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
