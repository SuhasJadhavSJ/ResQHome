// src/pages/Rescued.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPaw } from "react-icons/fa";

const Rescued = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRescued = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/rescued?page=1&limit=18");
        const data = await res.json();
        if (res.ok && data.success) setItems(data.data || []);
        else console.error(data.message || "Failed to fetch");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRescued();
  }, []);

  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-teal-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center text-teal-800 mb-8">
          Rescued Animals
        </h1>

        {loading ? (
          <p className="text-center text-teal-700">Loading rescued animals…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-600">No rescued animals found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <motion.div
                key={it._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {it.status?.toUpperCase() || "AVAILABLE"}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-teal-800">{it.name}</h3>
                  <p className="text-sm text-gray-600">{it.type} • {it.age}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="text-amber-500" /> {it.city}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to={`/rescued/${it._id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                      <FaPaw /> View
                    </Link>

                    <span className="text-sm text-gray-500">
                      Rescued {new Date(it.rescuedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rescued;
