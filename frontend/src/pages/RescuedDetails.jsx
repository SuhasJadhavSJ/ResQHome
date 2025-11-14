// src/pages/RescuedDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPaw } from "react-icons/fa";

const RescuedDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/rescued/${id}`);
        const data = await res.json();
        if (res.ok && data.success) setItem(data.data);
        else {
          console.error(data.message);
          navigate("/rescued");
        }
      } catch (err) {
        console.error(err);
        navigate("/rescued");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!item) return <div className="pt-24 text-center">Not found</div>;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="w-full h-96 object-cover" />
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-teal-800">{item.name}</h1>
              <p className="text-gray-600">{item.type} • {item.age}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                <FaMapMarkerAlt className="text-amber-500" /> {item.city}
              </p>
            </div>
            <div>
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs">{item.status}</span>
            </div>
          </div>

          <div className="mt-4 text-gray-700">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="leading-relaxed">{item.description || "No description provided."}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-lg">Adopt</button>
            <button onClick={() => navigate(-1)} className="bg-gray-100 px-5 py-3 rounded-lg">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescuedDetails;
