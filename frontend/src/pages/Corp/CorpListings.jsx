import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CorpListings = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/corp/adoptions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setAnimals(data.data);
      } else {
        toast.error("Could not fetch listings.");
      }
    } catch (err) {
      toast.error("Server error fetching listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8000/api/corp/adoption/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Listing deleted.");
        fetchListings();
      } else {
        toast.error("Delete failed.");
      }
    } catch (err) {
      toast.error("Server error while deleting.");
    }
  };

  if (loading)
    return <div className="pt-24 text-center text-gray-600">Loading...</div>;

  return (
    <div className="pt-20 ml-24 px-6">
      <h1 className="text-3xl font-bold text-teal-900 mb-8">Adoption Listings</h1>

      {animals.length === 0 ? (
        <p className="text-gray-500">No animals listed for adoption yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {animals.map((animal) => (
            <div
              key={animal._id}
              className="bg-white shadow-lg border rounded-xl overflow-hidden"
            >
              <img
                src={animal.images?.[0]}
                alt={animal.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5 space-y-2">
                <h2 className="text-xl font-semibold text-teal-800">
                  {animal.name}
                </h2>

                <p className="text-gray-600">
                  {animal.type} • {animal.breed}
                </p>
                <p className="text-gray-600">
                  {animal.age} yrs • {animal.gender}
                </p>

                <p className="text-sm text-gray-500">{animal.city}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/corp/adoption/${animal._id}`)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <FaEye /> View
                  </button>

                  <button
                    onClick={() => navigate(`/corp/adoption/${animal._id}/edit`)}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
                  >
                    <FaEdit /> Edit
                  </button>

                  <button
                    onClick={() => deleteListing(animal._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorpListings;
