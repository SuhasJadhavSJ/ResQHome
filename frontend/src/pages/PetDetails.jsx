import React from "react";
import { useParams, Link } from "react-router-dom";
import { FaPaw, FaFileMedical } from "react-icons/fa";

// Mock pets data (same as Adopt page)
const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    age: "2 years",
    city: "Mumbai",
    image:
      "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg",
    description:
      "Buddy is friendly and energetic. Loves children and long walks.",
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
    description:
      "Mittens is calm and loves cuddles. Perfect for apartment living.",
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
    description:
      "Charlie is playful and loves other dogs. Needs regular exercise.",
    medicalReports: [
      { date: "2025-09-05", report: "Spayed/Neutered, healthy" },
    ],
  },
];

const PetDetails = () => {
  const { id } = useParams();
  const pet = pets.find((p) => p.id === parseInt(id));

  if (!pet) return <div className="pt-20 text-center">Pet not found.</div>;

  return (
    <div className="pt-20 bg-gray-50 min-h-screen px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <img src={pet.image} alt={pet.name} className="w-full h-96 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-teal-800 mb-4">{pet.name}</h1>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Type:</span> {pet.type}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">Age:</span> {pet.age}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-medium">City:</span> {pet.city}
          </p>
          <p className="text-gray-700 mb-4">{pet.description}</p>

          <h2 className="text-xl font-semibold text-teal-800 mb-2 flex items-center gap-2">
            <FaFileMedical /> Medical Reports
          </h2>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            {pet.medicalReports.map((report, idx) => (
              <li key={idx}>
                <span className="font-medium">{report.date}:</span> {report.report}
              </li>
            ))}
          </ul>

          <Link
            to={`/adopt`}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            <FaPaw /> Back to Adopt
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
