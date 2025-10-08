import React, { useState } from "react";
import { FaPaw, FaFileMedical } from "react-icons/fa";
import { Link } from "react-router-dom";

// Mock data for demonstration
const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    age: "2 years",
    city: "Mumbai",
    image:
      "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg",
    medicalReports: [
      { date: "2025-09-01", report: "Vaccinated for rabies, healthy" },
      { date: "2025-09-10", report: "Deworming completed" },
    ],
  },
  {
    id: 2,
    name: "Mittens",
    type: "Cat",
    age: "1 year",
    city: "Pune",
    image:
      "https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg",
    medicalReports: [
      { date: "2025-08-20", report: "Vaccinated for Feline Distemper" },
    ],
  },
  {
    id: 3,
    name: "Charlie",
    type: "Dog",
    age: "3 years",
    city: "Delhi",
    image:
      "https://cdn.pixabay.com/photo/2016/02/19/11/19/dog-1210550_1280.jpg",
    medicalReports: [
      { date: "2025-09-05", report: "Spayed/Neutered, healthy" },
    ],
  },
];

const Adopt = () => {
  const [showReports, setShowReports] = useState({});

  const toggleReports = (id) => {
    setShowReports((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center">
          Pets Available for Adoption
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-teal-800 mb-2">
                  {pet.name}
                </h2>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Type:</span> {pet.type}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Age:</span> {pet.age}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">City:</span> {pet.city}
                </p>

                {/* Toggle medical reports */}
                <button
                  onClick={() => toggleReports(pet.id)}
                  className="flex items-center gap-2 text-teal-800 font-semibold mb-3 hover:text-amber-500 transition"
                >
                  <FaFileMedical /> {showReports[pet.id] ? "Hide" : "View"}{" "}
                  Medical Reports
                </button>
                {showReports[pet.id] && (
                  <ul className="mb-4 text-gray-700 list-disc list-inside">
                    {pet.medicalReports.map((report, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{report.date}:</span>{" "}
                        {report.report}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to={`/pet/${pet.id}`}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  <FaPaw /> View Pet
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Adopt;
