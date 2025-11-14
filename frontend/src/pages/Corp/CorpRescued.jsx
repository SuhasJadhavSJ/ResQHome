import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaStethoscope, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const RescuedDetails = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8000/api/corp/rescued/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) {
          setAnimal(data.data);
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Add medical history
  const addMedicalEntry = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/corp/rescued/${id}/medical`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ note }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Medical entry added!");
        setAnimal(data.data);
        setNote("");
      }
    } catch (err) {
      toast.error("Error adding medical entry");
    }
  };

  if (loading)
    return <div className="pt-24 text-center text-gray-600">Loading...</div>;

  if (!animal)
    return (
      <div className="pt-24 text-center text-gray-600">Animal not found</div>
    );

  return (
    <div className="pt-20 px-6 ml-20 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-teal-700 hover:underline"
      >
        ← Back
      </button>

      {/* IMAGE */}
      <img
        src={animal.imageUrl}
        alt={animal.name}
        className="w-full h-80 object-cover rounded-xl shadow-lg"
      />

      {/* BASIC DETAILS */}
      <h1 className="text-4xl font-bold text-teal-900 mt-6">{animal.name}</h1>
      <p className="text-xl text-gray-700 mt-2">{animal.type}</p>

      <p className="text-gray-600 flex items-center gap-2 mt-1">
        <FaMapMarkerAlt className="text-amber-500" />
        {animal.city}
      </p>

      <p className="mt-3 text-gray-700">{animal.description}</p>

      {/* MEDICAL HISTORY */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-teal-800 flex items-center gap-2">
          <FaStethoscope /> Medical History
        </h2>

        {animal.meta?.medicalHistory?.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {animal.meta.medicalHistory.map((entry, idx) => (
              <li
                key={idx}
                className="p-4 bg-white rounded-xl shadow border border-gray-100"
              >
                <p className="text-gray-900 font-medium">{entry.note}</p>
                <p className="text-sm text-gray-500">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-gray-600">No medical entries yet.</p>
        )}

        {/* ADD ENTRY */}
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add medical note..."
            className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={addMedicalEntry}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add
          </button>
        </div>
      </div>

      <button
        className="mt-10 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold"
        onClick={() => navigate(`/corp/list-for-adoption/${animal._id}`)}
      >
        List for Adoption
      </button>
    </div>
  );
};

export default RescuedDetails;
