import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CorpSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/corp/profile", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Save file and generate preview
    setProfile((prev) => ({ ...prev, profilePic: file }));
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();

    // Append fields properly
    Object.keys(profile).forEach((key) => {
      formData.append(key, profile[key]);
    });

    try {
      const res = await fetch("http://localhost:8000/api/corp/profile", {
        method: "PUT",
        headers: { Authorization: localStorage.getItem("token") },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Server error while updating!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile)
    return <p className="pt-24 text-center text-gray-600">Loading...</p>;

  const finalImageSrc =
    previewImg ||
    (typeof profile.profilePic === "string"
      ? `http://localhost:8000/${profile.profilePic.replace(/\\/g, "/")}`
      : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png");

  return (
    <div className="ml-[90px] min-h-screen bg-gray-50 flex justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl border border-gray-200"
      >
        <h1 className="text-2xl font-extrabold text-teal-800 mb-6 text-center">
          Corporation Profile Settings
        </h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={finalImageSrc}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-amber-500 shadow-lg"
          />

          <label className="mt-3 text-sm text-blue-600 cursor-pointer font-medium hover:underline">
            Change Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <InputField label="Corporation Name" name="name" value={profile.name} onChange={handleChange} />
          <InputField label="Location" name="city" value={profile.city || ""} onChange={handleChange} />
          <InputField label="Website" name="website" value={profile.website || ""} onChange={handleChange} />
          <TextArea label="About / Bio" name="bio" value={profile.bio || ""} onChange={handleChange} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl font-semibold transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </motion.div>
    </div>
  );
};

export default CorpSettings;

/* Reusable Input Components */
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-gray-700 font-medium">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
    />
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-gray-700 font-medium">{label}</label>
    <textarea
      name={name}
      rows="3"
      value={value}
      onChange={onChange}
      className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
    />
  </div>
);
