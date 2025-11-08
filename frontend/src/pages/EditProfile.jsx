import React, { useState, useEffect } from "react";
import { FaUserEdit, FaCamera, FaLock, FaKey, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    city: "",
    email: "",
  });
  const [image, setImage] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    // Here you’ll call the backend PUT /update-profile endpoint
    alert("✅ Profile updated successfully!");
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert("❌ New passwords do not match!");
      return;
    }
    // Backend API call for password update here
    alert("🔑 Password updated successfully!");
  };

  const handleForgotPassword = () => {
    // Redirect or open email reset flow
    alert("📧 Password reset link sent to your registered email!");
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
            <FaHome /> Back to Profile
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <motion.img
            src={
              image ||
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

        {/* Edit Profile Form */}
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleUserChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                City
              </label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleUserChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
                placeholder="Enter your city"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email (read-only)
            </label>
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

        {/* Change Password Section */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h3 className="text-2xl font-semibold text-teal-800 mb-4 flex items-center gap-2">
            <FaLock /> Change Password
          </h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="password"
              name="confirmNewPassword"
              value={passwords.confirmNewPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
            />
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-teal-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
