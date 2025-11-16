import React, { useState, useEffect } from "react";
import { FaPaw, FaFileMedical, FaHeart } from "react-icons/fa";
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
        setAdoptions(adoptData.data?.pending || []); // only pending matters here
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
    if (userRequested(pet._id)) return;
    setSelectedPet(pet);
    setShowModal(true);
  };

  const confirmAdoption = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/user/adopt/${selectedPet._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Request submitted. Visit your profile to track progress.");
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
    <div className="pt-20 min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-center text-4xl font-bold text-teal-800">
          Meet Your Future Friend 🐾
        </h1>

        {loading ? (
          <p className="text-center p-6">Loading...</p>
        ) : pets.length === 0 ? (
          <p className="text-center text-gray-500">No pets available.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 mt-10">
            {pets.map((pet, i) => {
              const isRequested = userRequested(pet._id);

              return (
                <motion.div
                  key={pet._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border"
                >
                  <img
                    src={pet.images?.[0] || fallbackImg}
                    className="w-full h-64 object-cover"
                    alt={pet.name}
                  />

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-teal-800">{pet.name}</h2>
                    <p><b>Type:</b> {pet.type}</p>
                    <p><b>Age:</b> {pet.age}</p>
                    <p><b>City:</b> {pet.city}</p>

                    <div className="flex justify-between mt-5">
                      
                      <Link
                        to={`/adoption/${pet._id}`}
                        className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded text-white"
                      >
                        <FaPaw />
                      </Link>

                      <button
                        disabled={isRequested}
                        onClick={() => handleAdoptClick(pet)}
                        className={`px-4 py-2 rounded text-white flex gap-2 items-center ${
                          isRequested
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-600 hover:bg-teal-700"
                        }`}
                      >
                        <FaHeart />
                        {isRequested ? "Requested" : "Adopt"}
                      </button>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && selectedPet && (
          <motion.div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 text-teal-700">
                Confirm adoption request?
              </h2>
              <div className="flex gap-4 justify-center">
                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="bg-amber-600 text-white px-4 py-2 rounded" onClick={confirmAdoption}>Confirm</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Adopt;
