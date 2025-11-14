import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CorpRescued = () => {
  const [rescued, setRescued] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch rescued animals
  const fetchRescuedAnimals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/corp/rescued", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setRescued(data.data);
      } else {
        console.error("Failed to fetch rescued animals");
      }
    } catch (err) {
      console.error("Error fetching rescued animals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescuedAnimals();
  }, []);

  if (loading)
    return <div className="pt-24 text-center text-gray-600">Loading...</div>;

  return (
    <div className="pt-20 px-6 ml-20">
      <h1 className="text-4xl font-bold text-teal-900 mb-10">
        Rescued Animals 🐾
      </h1>

      {rescued.length === 0 ? (
        <p className="text-gray-600">No rescued animals available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rescued.map((animal, index) => (
            <motion.div
              key={animal._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-xl shadow hover:shadow-xl border border-gray-100"
            >
              <img
                src={animal.imageUrl}
                alt={animal.name}
                className="w-full h-56 object-cover rounded-lg"
              />

              <h3 className="text-xl font-semibold text-teal-800 mt-3">
                {animal.name}
              </h3>

              <p className="text-gray-600 text-sm">{animal.type}</p>

              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <FaMapMarkerAlt className="text-amber-500" /> {animal.city}
              </p>

              <button
                onClick={() => navigate(`/corp/rescued/${animal._id}`)}
                className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg flex justify-center gap-2 items-center"
              >
                <FaEye /> View Details
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorpRescued;
