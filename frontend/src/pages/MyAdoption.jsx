import React, { useEffect, useState } from "react";
import { FaPaw, FaFileMedical, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyAdoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please log in to view your adoptions");

        const res = await fetch("http://localhost:8000/api/user/my-adoptions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setAdoptions(data.adoptions || []); // ✅ Aligns with backend
        } else {
          setAdoptions([]);
        }
      } catch (err) {
        console.error("Error fetching adoptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-teal-700 font-semibold text-lg">
        Loading your adoptions...
      </div>
    );

  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-teal-50 to-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-teal-800 mb-4 tracking-wide"
        >
          My Adopted Pets
        </motion.h1>

        <p className="text-center text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          A heartfelt thank you for giving these animals a second chance ❤️  
          Here are your adorable companions who now call your home, *their home*.
        </p>

        {adoptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-lg mt-10"
          >
            You haven’t adopted any pets yet.
            <div className="mt-6">
              <Link
                to="/adopt"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
              >
                Browse Pets for Adoption
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {adoptions.map((adoption, index) => {
              const pet = adoption.animal;
              return (
                <motion.div
                  key={adoption._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={pet?.image || "/placeholder.jpg"}
                      alt={pet?.name || "Pet"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                      Adopted
                    </div>
                    <h2 className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow-lg">
                      {pet?.name}
                    </h2>
                  </div>

                  {/* Info Section */}
                  <div className="p-6 space-y-2">
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaMapMarkerAlt className="text-amber-500" /> {pet?.city}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-teal-700">Type:</span> {pet?.type}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium text-teal-700">Age:</span> {pet?.age || "N/A"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt className="text-teal-500" /> Adopted on{" "}
                      <span className="font-medium text-gray-800">
                        {new Date(adoption.adoptedDate).toLocaleDateString()}
                      </span>
                    </p>

                    {/* Medical Reports */}
                    {pet?.medicalReports?.length > 0 && (
                      <div className="bg-teal-50 rounded-lg p-3 mt-4 shadow-inner">
                        <h3 className="flex items-center gap-2 font-semibold text-teal-700 mb-2 text-sm">
                          <FaFileMedical /> Medical Summary
                        </h3>
                        <ul className="text-gray-700 text-sm list-disc list-inside space-y-1">
                          {pet.medicalReports.map((report, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{report.date}:</span>{" "}
                              {report.report}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-5">
                      <Link
                        to={`/pet/${pet?._id}`}
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
                      >
                        <FaPaw /> View Pet
                      </Link>
                      <motion.span
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-3xl text-amber-500 cursor-pointer"
                      >
                        ❤️
                      </motion.span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdoptions;
