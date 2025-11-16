import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination";

const CorpRescued = () => {
  const [rescued, setRescued] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const fetchRescuedAnimals = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/corp/rescued", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) setRescued(data.data);
    } catch (error) {
      console.error("Error fetching rescued animals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRescuedAnimals();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 text-lg pt-10 animate-pulse">
        Loading rescued animals...
      </p>
    );

  // Pagination logic
  const totalPages = Math.ceil(rescued.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = rescued.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="ml-[90px] min-h-screen bg-gray-50 py-6 pr-6">
      <div className="max-w-[1700px] w-full">
        
        <h1 className="text-3xl font-extrabold text-teal-900 tracking-wide mb-7 pl-4">
          Rescued Animals 🐾
        </h1>

        {rescued.length === 0 ? (
          <p className="text-gray-600 text-lg pl-4">No rescued animals found.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 pl-4">
              {paginatedData.map((animal, index) => (
                <motion.div
                  key={animal._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={animal.imageUrl}
                      alt={animal.name}
                      className="w-full h-56 object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-green-200 text-green-700 font-semibold">
                      SAFE
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h2 className="text-xl font-bold text-teal-800">{animal.name}</h2>

                    <p className="text-gray-700 text-sm capitalize">{animal.type}</p>

                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      <FaMapMarkerAlt className="text-amber-500" />
                      {animal.city || "Unknown"}
                    </p>

                    <button
                      onClick={() => navigate(`/corp/rescued/${animal._id}`)}
                      className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg flex justify-center gap-2 items-center text-sm font-medium"
                    >
                      <FaEye /> View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default CorpRescued;
