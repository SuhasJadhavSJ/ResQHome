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
        if (data.success) setAnimal(data.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  const addMedicalEntry = async () => {
    if (!note.trim()) return toast.error("Note cannot be empty");

    try {
      const res = await fetch(
        `http://localhost:8000/api/corp/rescued/${id}/medical`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ note }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Medical record added");
        setAnimal(data.data);
        setNote("");
      }
    } catch {
      toast.error("Failed to update medical entry");
    }
  };

  if (loading) return <p className="ml-[90px] pt-10 text-center">Loading...</p>;
  if (!animal) return <p className="ml-[90px] pt-10 text-center">Animal not found</p>;

  return (
    <section className="ml-[90px] min-h-screen bg-gray-50 pb-20 pr-6">
      <button onClick={() => navigate(-1)} className="mt-4 ml-6 text-teal-700 hover:underline">
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mt-3 bg-white rounded-xl shadow-lg overflow-hidden border"
      >
        <img src={animal.imageUrl} className="w-full h-80 object-cover" />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-teal-900">{animal.name}</h1>
          <p className="text-gray-700">{animal.type}</p>
          <p className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-amber-500" /> {animal.city}
          </p>
          <p className="text-gray-700 mt-2">{animal.description}</p>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-2xl font-bold text-teal-800 flex items-center gap-2">
            <FaStethoscope /> Medical History
          </h2>

          {animal.meta?.medicalHistory?.length ? (
            <ul className="mt-4 space-y-3">
              {animal.meta.medicalHistory.map((entry, idx) => (
                <li key={idx} className="p-3 bg-gray-100 rounded-md border">
                  {entry.note}
                  <p className="text-xs text-gray-500">
                    {new Date(entry.date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500 italic">No history yet.</p>
          )}

          <div className="flex gap-2 mt-4">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add medical note..."
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={addMedicalEntry}
              className="bg-teal-600 text-white px-4 rounded-lg flex items-center gap-1"
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold"
          onClick={() => navigate(`/corp/adoption/add?rescuedId=${animal._id}`)}
        >
          Continue to Listing
        </button>
      </div>
    </section>
  );
};

export default RescuedDetails;
