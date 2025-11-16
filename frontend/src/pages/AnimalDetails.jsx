import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPaw, FaMapMarkerAlt, FaVenusMars, FaNotesMedical, FaVideo } from "react-icons/fa";
import { motion } from "framer-motion";

const fallbackImg = "https://via.placeholder.com/600x400?text=No+Image+Available";

const AnimalDetails = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/corp/adoption/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAnimal(data.data || null);
        setActiveImage(data.data?.images?.[0] || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  if (loading) return <div className="pt-24 text-center text-xl font-semibold">Loading...</div>;
  if (!animal) return <div className="pt-24 text-center text-xl text-red-600">Animal not found</div>;

  return (
    <div className="pt-24 px-6 max-w-6xl mx-auto mb-10">
      <h1 className="text-4xl font-bold text-teal-800 mb-6">{animal.name} 🐾</h1>

      {/* IMAGE + GALLERY */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Display Image */}
        <div className="flex-1">
          <img
            src={activeImage || fallbackImg}
            alt="animal"
            className="w-full h-96 object-cover rounded-2xl shadow"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="lg:w-40 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
          {animal.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer ${
                activeImage === img ? "border-teal-600" : "border-transparent"
              }`}
              alt="thumbnail"
            />
          ))}
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="mt-8 grid md:grid-cols-2 gap-6 text-lg text-gray-700">
        <p><b className="text-teal-700">Type:</b> {animal.type}</p>
        <p><b className="text-teal-700">Breed:</b> {animal.breed || "Unknown"}</p>
        <p><b className="text-teal-700">Gender:</b> {animal.gender}</p>
        <p><b className="text-teal-700">Age:</b> {animal.age}</p>
        <p><b className="text-teal-700">Weight:</b> {animal.weight}</p>
        <p><b className="text-teal-700">Color:</b> {animal.color}</p>
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-teal-700" />
          <b className="text-teal-700">Location:</b> {animal.address}, {animal.city}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-teal-800 mb-2">About</h2>
        <p className="text-gray-700 leading-relaxed">{animal.description || "No description provided."}</p>
      </div>

      {/* MEDICAL HISTORY */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-teal-800 mb-3 flex gap-2 items-center">
          <FaNotesMedical /> Medical History
        </h2>
        {animal.medicalHistory?.length > 0 ? (
          <ul className="list-disc pl-6 space-y-1">
            {animal.medicalHistory.map((entry, i) => (
              <li key={i}>
                <b>{new Date(entry.date).toLocaleDateString()}:</b> {entry.note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No medical notes available.</p>
        )}
      </div>

      {/* MEDICAL IMAGES */}
      {animal.medicalImages?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-teal-800 mb-3">Medical Documents</h2>
          <div className="flex gap-3 flex-wrap">
            {animal.medicalImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="med report"
                className="h-32 w-32 object-cover rounded-lg shadow cursor-pointer"
              />
            ))}
          </div>
        </div>
      )}

      {/* VIDEO */}
      {animal.video && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-teal-800 mb-3 flex gap-2 items-center">
            <FaVideo /> Video Preview
          </h2>
          <video controls className="w-full h-80 rounded-lg shadow">
            <source src={animal.video} />
          </video>
        </div>
      )}

      {/* ADOPT BUTTON */}
      <div className="mt-10 text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg text-xl"
        >
          Adopt Now ❤️
        </motion.button>
      </div>
    </div>
  );
};

export default AnimalDetails;
