import React, { useState, useEffect } from "react";
import { FaHeart, FaPaw, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fallbackImg = "https://via.placeholder.com/400x300?text=No+Image";

const Adopt = () => {
  const [pets, setPets] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const token = localStorage.getItem("token");

        const [petsRes, adoptionsRes] = await Promise.all([
          fetch("http://localhost:8000/api/corp/adoptions", {
            headers: { Authorization: token }
          }),
          fetch("http://localhost:8000/api/user/my-adoptions", {
            headers: { Authorization: token }
          })
        ]);

        const petsData = await petsRes.json();
        const adoptData = await adoptionsRes.json();

        setPets(petsData.data || []);
        setAdoptions(adoptData.data?.pending || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  const userRequested = (animalId) =>
    adoptions.some((a) => a.animal?._id === animalId);

  const handleAdoptClick = (pet) => {
    if (!userRequested(pet._id)) {
      setSelectedPet(pet);
      setShowModal(true);
    }
  };

  const confirmAdoption = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/user/adopt/${selectedPet._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token }
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Request submitted successfully!");
        setAdoptions((prev) => [...prev, { animal: selectedPet, status: "pending" }]);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Hero Section */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-4xl md:text-5xl font-extrabold text-teal-800 drop-shadow-sm"
        >
          Adopt a Friend, Change a Life 🐾
        </motion.h1>
        <p className="text-center text-gray-600 mt-2">
          Choose from rescued animals waiting for a loving home.
        </p>


        {/* Loading View */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-gray-200 h-80"></div>
            ))}
          </div>
        )}

        {/* No Data */}
        {!loading && pets.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">No pets available.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-12">
            {pets.map((pet, i) => {
              const isRequested = userRequested(pet._id);

              return (
                <motion.div
                  key={pet._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ translateY: -6 }}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group"
                >
                  <img
                    src={pet.images?.[0] || fallbackImg}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    alt={pet.name}
                  />

                  <div className="p-5 space-y-1">
                    <h2 className="text-xl font-bold text-teal-800">{pet.name}</h2>

                    <p className="text-gray-700 text-sm">
                      {pet.type} • {pet.age} yrs
                    </p>

                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="text-amber-500" size={14} /> {pet.city}
                    </p>

                    <div className="flex justify-between items-center pt-3">
                      <Link
                        to={`/adoption/${pet._id}`}
                        className="px-4 py-2 rounded-lg text-white text-sm bg-amber-500 hover:bg-amber-600 transition"
                      >
                        <FaPaw /> View
                      </Link>

                      <button
                        disabled={isRequested}
                        onClick={() => handleAdoptClick(pet)}
                        className={`px-4 py-2 rounded-lg text-white text-sm flex items-center gap-2 shadow
                        ${isRequested ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
                      >
                        <FaHeart size={14} />
                        {isRequested ? "Requested" : "Adopt"}
                      </button>
                    </div>
                  </div>

                  {isRequested && (
                    <span className="absolute top-3 right-3 bg-teal-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                      Pending
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Adoption Confirmation Modal */}
      <AnimatePresence>
        {showModal && selectedPet && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-[90%] text-center"
            >
              <h2 className="text-2xl font-bold text-teal-700">
                Confirm Your Adoption Request?
              </h2>

              <p className="mt-4 text-gray-600">
                You’re adopting <b className="text-teal-700">{selectedPet.name}</b>.  
                Please ensure you can provide proper care, safety, and love.
              </p>

              <div className="flex justify-between mt-8">
                <button
                  className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700"
                  onClick={confirmAdoption}
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
