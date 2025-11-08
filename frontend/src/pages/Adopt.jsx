import React, { useState, useEffect } from "react";
import { FaPaw, FaFileMedical, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md animate-pulse overflow-hidden">
    <div className="h-64 bg-gray-200"></div>
    <div className="p-6 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReports, setShowReports] = useState({});
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch pets from backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/animals");
        const data = await res.json();
        setPets(data.animals || []);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const toggleReports = (id) => {
    setShowReports((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const confirmAdoption = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/user/adopt/${selectedPet._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      if (data.success) {
        alert(`🎉 You adopted ${selectedPet.name} successfully!`);
      } else {
        alert(data.message || "Failed to adopt pet");
      }
    } catch (error) {
      console.error("Adoption error:", error);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="pt-20 bg-gradient-to-br from-teal-50 to-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-teal-800 mb-6 text-center"
        >
          Meet Your Future Friend 🐾
        </motion.h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover loving companions waiting for their forever homes.  
          Click on a pet to learn more, view medical details, and start their next chapter.
        </p>

        {loading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No pets available for adoption.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet, index) => (
              <motion.div
                key={pet._id || pet.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative group">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow-lg">
                    {pet.name}
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="font-medium text-teal-700">Type:</span> {pet.type}
                    </p>
                    <p>
                      <span className="font-medium text-teal-700">Age:</span> {pet.age}
                    </p>
                    <p>
                      <span className="font-medium text-teal-700">City:</span> {pet.city}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => toggleReports(pet.id)}
                      className="flex items-center gap-2 text-teal-700 font-semibold hover:text-amber-600 transition"
                    >
                      <FaFileMedical />
                      {showReports[pet.id] ? "Hide Reports" : "View Medical Reports"}
                    </button>

                    <AnimatePresence>
                      {showReports[pet.id] && pet.medicalReports && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 text-gray-600 list-disc list-inside space-y-1"
                        >
                          {pet.medicalReports.map((report, i) => (
                            <li key={i}>
                              <span className="font-medium">{report.date}:</span> {report.report}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <Link
                      to={`/pet/${pet.id}`}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
                    >
                      <FaPaw /> View Pet
                    </Link>
                    <motion.button
                      onClick={() => handleAdoptClick(pet)}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition-transform"
                    >
                      <FaHeart className="text-red-300 animate-pulse" /> Adopt
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Adoption Confirmation Modal */}
      <AnimatePresence>
        {showModal && selectedPet && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <img
                src={selectedPet.image}
                alt={selectedPet.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-amber-400"
              />
              <h3 className="text-2xl font-semibold text-teal-800 mb-2">
                Adopt {selectedPet.name}?
              </h3>
              <p className="text-gray-600 mb-6">
                Once confirmed, this animal will be marked as adopted under your name.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAdoption}
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold"
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

export default Adopt;
