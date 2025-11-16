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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRescued();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-4xl md:text-5xl font-extrabold text-teal-800"
        >
          Rescued Animals
        </motion.h1>

        <p className="text-center text-gray-600 mt-1 mb-10">
          These animals have been safely rescued and cared for 🐾
        </p>

        {/* Loading */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-72 bg-gray-200 rounded-xl shadow"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No rescued animals found at the moment.
          </p>
        )}

        {/* Rescued Animal Cards */}
        {!loading && items.length > 0 && (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

            {items.map((it, idx) => (
              <motion.div
                key={it._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden 
                          transition-all group hover:-translate-y-2 border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />

                  {/* Status Badge */}
                  <span
                    className="absolute top-3 left-3 bg-amber-500 shadow text-white text-[11px] 
                               font-semibold px-3 py-1 rounded-full tracking-wide"
                  >
                    {it.status?.toUpperCase() ?? "RESCUED"}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-teal-800">{it.name}</h3>
                  <p className="text-gray-700 text-sm mt-1 capitalize">
                    {it.type} {it.age && `• ${it.age}`}
                  </p>

                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <FaMapMarkerAlt className="text-amber-500" size={13} /> {it.city}
                  </p>

                  {/* Buttons & Time */}
                  <div className="flex items-center justify-between mt-6">
                    <Link
                      to={`/rescued/${it._id}`}
                      className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 
                                 text-white px-4 py-[9px] rounded-lg text-sm font-medium shadow"
                    >
                      <FaPaw size={14} /> View
                    </Link>

                    <span className="text-[11px] font-medium text-gray-500">
                      {new Date(it.rescuedAt).toLocaleDateString()}
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
