// frontend/pages/Corp/CorpListings.jsx
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/common/Pagination"; // ensure correct import path

const CorpListings = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    return <p className="text-center text-gray-600 text-lg pt-10 animate-pulse">Loading...</p>;

  // Pagination logic
  const totalPages = Math.ceil(animals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnimals = animals.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="ml-[90px] min-h-screen bg-gray-50 py-6 pr-6">
      <div className="max-w-[1650px] w-full">

        <h1 className="text-3xl font-extrabold text-teal-900 tracking-wide mb-7 pl-4">
          Adoption Listings
        </h1>

        {animals.length === 0 ? (
          <p className="text-gray-500 text-lg pl-4">No animals listed yet.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 pl-4">

              {paginatedAnimals.map((animal, index) => (
                <div
                  key={animal._id}
                  className="bg-white shadow-xl border border-gray-200 rounded-xl overflow-hidden transition hover:shadow-2xl hover:-translate-y-1"
                >
                  <img
                    src={animal.images?.[0]}
                    alt={animal.name}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-5 space-y-2">
                    <h2 className="text-xl font-bold text-teal-900">
                      {animal.name}
                    </h2>

                    <p className="text-gray-700 text-sm font-semibold">
                      {animal.type} • {animal.breed || "—"}
                    </p>

                    <p className="text-gray-600 text-sm">
                      {animal.age} yrs • {animal.gender}
                    </p>

                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      📍 {animal.city}
                    </p>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => navigate(`/corp/adoption/${animal._id}`)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                      >
                        <FaEye /> View
                      </button>

                      <button
                        onClick={() => navigate(`/corp/adoption/${animal._id}/edit`)}
                        className="flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-xs"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        onClick={() => deleteListing(animal._id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default CorpListings;
