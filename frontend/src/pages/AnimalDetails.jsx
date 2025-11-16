import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  FaMapMarkerAlt, FaNotesMedical, FaVideo, FaShieldAlt 
} from "react-icons/fa";

const fallbackImg =
  "https://via.placeholder.com/600x400?text=No+Image+Available";

// Pre-defined personality tags
const presetTags = [
  "Friendly",
  "Calm",
  "Playful",
  "Kid-Safe",
  "Vaccinated",
  "Trained",
  "Social",
  "Special-Care"
];

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/corp/adoption/${id}`, {
          headers: { Authorization: localStorage.getItem("token") }
        });
        const data = await res.json();
        setAnimal(data.data);
        setActiveImage(data.data?.images?.[0]);
      } catch (err) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const requestAdoption = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/user/adopt/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") }
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Adoption request submitted!");
        navigate("/profile");
      } else toast.error(data.message || "Failed");
    } catch {
      toast.error("Something went wrong");
    }
    setOpenModal(false);
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;
  if (!animal) return <p className="pt-24 text-center text-red-600">Not Found</p>;

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-6">

      {/* HERO SECTION */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Main Image */}
        <motion.img
          key={activeImage}
          initial={{ opacity: 0.3, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          src={activeImage || fallbackImg}
          className="rounded-3xl shadow-xl w-full h-[420px] object-cover"
        />

        {/* Thumbnail column */}
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
          {animal.images?.map((img, i) => (
            <img
              key={i}
              onClick={() => setActiveImage(img)}
              src={img}
              className={`w-24 h-24 rounded-xl object-cover cursor-pointer border-2
              ${img === activeImage ? "border-teal-600" : "border-transparent"}`}
            />
          ))}
        </div>
      </div>

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-4xl font-extrabold text-teal-800 flex items-center gap-2"
      >
        {animal.name}
      </motion.h1>

      {/* LOCATION */}
      <p className="flex items-center gap-2 text-gray-600 mt-1">
        <FaMapMarkerAlt className="text-amber-500" />
        {animal.address}, {animal.city}
      </p>

      {/* INFO GRID */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {[
          ["Type", animal.type],
          ["Breed", animal.breed || "Unknown"],
          ["Gender", animal.gender],
          ["Age", animal.age],
          ["Weight", animal.weight],
          ["Color", animal.color]
        ].map(([label, val], i) => (
          <div key={i} className="bg-white/60 backdrop-blur-xl rounded-xl p-4 shadow border">
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="font-semibold text-teal-700">{val}</p>
          </div>
        ))}
      </div>

      {/* PERSONALITY */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-teal-800 mb-2">Personality</h2>
        <div className="flex flex-wrap gap-2">
          {presetTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-teal-100 text-teal-700 font-medium border border-teal-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-teal-800">
          About
        </h2>
        <p className="mt-2 text-gray-700 leading-relaxed bg-white/60 p-4 rounded-xl shadow">
          {animal.description || "No description provided."}
        </p>
      </div>

      {/* MEDICAL HISTORY */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-teal-800">
          <FaNotesMedical /> Medical Records
        </h2>

        {animal.medicalHistory?.length ? (
          <ul className="mt-3 space-y-2">
            {animal.medicalHistory.map((m, i) => (
              <li key={i} className="bg-white/60 rounded-xl p-3 shadow text-gray-700">
                <b>{new Date(m.date).toLocaleDateString()}:</b> {m.note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-1">No medical info available.</p>
        )}
      </div>

      {/* VIDEO */}
      {animal.video && (
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-teal-800">
            <FaVideo /> Rescue / Behaviour Video
          </h2>
          <video controls className="w-full h-80 rounded-2xl shadow mt-3">
            <source src={animal.video} />
          </video>
        </div>
      )}

      {/* CTA */}
      <motion.button
        onClick={() => setOpenModal(true)}
        whileTap={{ scale: 0.95 }}
        className="mt-10 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-lg block mx-auto"
      >
        Adopt Now ❤️
      </motion.button>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white p-7 rounded-2xl shadow-xl max-w-md text-center"
            >
              <h2 className="text-xl font-bold text-teal-700">Confirm Adoption?</h2>
              <p className="mt-2 text-gray-600">
                You are requesting to adopt <b>{animal.name}</b>.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-5 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={requestAdoption}
                  className="px-5 py-2 bg-amber-600 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimalDetails;
