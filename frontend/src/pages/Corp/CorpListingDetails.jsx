import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const CorpListingDetails = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();

  const fetchAnimal = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/corp/adoption/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAnimal(data.data);
      else toast.error("Animal not found");
    } catch {
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
      } else toast.error("Could not delete listing");
    } catch {
      toast.error("Server error deleting listing");
    }
  };

  if (!animal)
    return <p className="pt-24 ml-[90px] text-center">Loading...</p>;

  return (
    <section className="ml-[90px] bg-gray-50 min-h-screen p-6">
      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm bg-white shadow px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 grid lg:grid-cols-2 gap-10">
        {/* LEFT: Image Section */}
        <div>
          {/* Main Display */}
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden shadow">
            <img
              src={animal.images[currentImg]}
              alt="animal"
              className="h-full w-full object-cover"
            />

            {/* Slider Controls */}
            {animal.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100"
                  onClick={() =>
                    setCurrentImg(
                      currentImg === 0
                        ? animal.images.length - 1
                        : currentImg - 1
                    )
                  }
                >
                  <FaChevronLeft />
                </button>

                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-100"
                  onClick={() =>
                    setCurrentImg(
                      currentImg === animal.images.length - 1
                        ? 0
                        : currentImg + 1
                    )
                  }
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Row */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {animal.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setCurrentImg(idx)}
                className={`h-20 w-20 object-cover rounded-md shadow cursor-pointer border-2 ${
                  currentImg === idx ? "border-teal-600" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{animal.name}</h1>
          <p className="text-gray-700 text-lg">
            {animal.type} • {animal.breed}
          </p>
          <p className="text-gray-600">{animal.city}, {animal.address}</p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => navigate(`/corp/adoption/${id}/edit`)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              <FaEdit /> Edit
            </button>

            <button
              onClick={deleteListing}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
              <FaTrash /> Delete
            </button>
          </div>

          {/* Highlights Style */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-800">Quick Info</h3>
            <ul className="mt-2 space-y-2 text-gray-700">
              <li><b>Gender:</b> {animal.gender}</li>
              <li><b>Age:</b> {animal.age} yrs</li>
              <li><b>Weight:</b> {animal.weight} kg</li>
              <li><b>Color:</b> {animal.color}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
        <p className="text-gray-700 leading-7">{animal.description}</p>
      </div>

      {/* MEDICAL HISTORY */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical History</h2>
        {animal.medicalHistory?.length ? (
          <ul className="space-y-3">
            {animal.medicalHistory.map((entry, idx) => (
              <li key={idx} className="border rounded-lg bg-gray-50 p-3 shadow-sm">
                <p className="text-gray-800">{entry.note}</p>
                <p className="text-xs text-gray-500">
                  {new Date(entry.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No medical notes available.</p>
        )}
      </div>

      {/* MEDICAL IMAGES */}
      {animal.medicalImages?.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {animal.medicalImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="medical"
                className="rounded-lg shadow object-cover h-48 w-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* VIDEO */}
      {animal.video && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Video</h2>
          <video src={animal.video} controls className="w-full rounded-lg shadow-lg" />
        </div>
      )}
    </section>
  );
};

export default CorpListingDetails;
