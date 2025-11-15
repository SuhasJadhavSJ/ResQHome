import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";

const CorpListingDetails = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const navigate = useNavigate();
  console.log("CorpListingDetails mounted");
  const fetchAnimal = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/corp/adoption/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setAnimal(data.data);
      } else {
        toast.error("Animal not found");
      }
    } catch (err) {
      toast.error("Server error fetching details");
    }
  };

  useEffect(() => {
    fetchAnimal();
  }, []);

  const deleteListing = async () => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:8000/api/corp/adoption/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Listing deleted");
        navigate("/corp/adoptions");
      } else {
        toast.error("Could not delete listing");
      }
    } catch {
      toast.error("Server error deleting listing");
    }
  };

  if (!animal)
    return (
      <div className="pt-24 ml-24 text-gray-600 text-lg">Loading...</div>
    );

  return (
    <div className="pt-20 ml-24 px-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/corp/adoptions")}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/corp/adoption/${id}/edit`)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
          >
            <FaEdit /> Edit
          </button>

          <button
            onClick={deleteListing}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-teal-900">{animal.name}</h1>
      <p className="text-gray-600 text-lg">{animal.type} • {animal.breed}</p>
      <p className="text-gray-600">{animal.city}, {animal.address}</p>

      {/* Image gallery */}
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-teal-800">Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {animal.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            className="rounded-lg shadow object-cover h-48 w-full"
            alt=""
          />
        ))}
      </div>

      {/* Video */}
      {animal.video && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-teal-800">
            Video
          </h2>
          <video
            src={animal.video}
            controls
            className="w-full rounded-xl shadow-lg"
          />
        </>
      )}

      {/* Medical History Notes */}
      <h2 className="text-2xl font-semibold mt-10 mb-3 text-teal-800">
        Medical History
      </h2>
      <ul className="space-y-3">
        {animal.medicalHistory?.map((entry, idx) => (
          <li
            key={idx}
            className="p-4 bg-gray-100 border rounded-lg shadow-sm"
          >
            <p className="text-gray-700">{entry.note}</p>
            <p className="text-xs text-gray-500">
              {new Date(entry.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Medical Images */}
      {animal.medicalImages?.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-10 mb-3 text-teal-800">
            Medical Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {animal.medicalImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                className="rounded-lg shadow object-cover h-48 w-full"
                alt=""
              />
            ))}
          </div>
        </>
      )}

      {/* Description */}
      <h2 className="text-2xl font-semibold mt-10 mb-3 text-teal-800">
        Description
      </h2>
      <p className="text-gray-700 leading-relaxed">{animal.description}</p>
    </div>
  );
};

export default CorpListingDetails;
