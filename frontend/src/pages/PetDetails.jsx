import React from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import { FaPaw, FaFileMedical, FaCity, FaUserAlt } from "react-icons/fa";

const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    age: "2 years",
    city: "Mumbai",
    images: [
      "https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/03/26/09/54/dog-690176_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/02/19/11/19/dog-1210550_1280.jpg",
    ],
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
    images: [
      "https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/11/16/22/14/cat-1045782_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/08/01/00/35/cat-2561067_1280.jpg",
    ],
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
    images: [
      "https://cdn.pixabay.com/photo/2016/02/19/11/19/dog-1210550_1280.jpg",
      "https://cdn.pixabay.com/photo/2016/11/18/15/32/dog-1839808_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/03/26/09/54/dog-690176_1280.jpg",
    ],
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    fade: true,
  };

  return (
    <div className="pt-24 pb-10 bg-gradient-to-b from-teal-50 to-white min-h-screen px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* Left Section – Image Slider */}
        <div className="bg-gray-100 p-4 flex items-center justify-center">
          <div className="w-full">
            <Slider {...sliderSettings}>
              {pet.images.map((img, idx) => (
                <div key={idx} className="flex justify-center">
                  <img
                    src={img}
                    alt={`${pet.name}-${idx}`}
                    className="rounded-xl h-[450px] w-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Right Section – Details */}
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-teal-800 mb-3">{pet.name}</h1>
          <p className="text-gray-700 text-lg mb-4">{pet.description}</p>

          <div className="space-y-2 mb-5">
            <p className="text-gray-700 flex items-center gap-2">
              <FaUserAlt className="text-amber-500" />
              <span className="font-semibold">Type:</span> {pet.type}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <FaPaw className="text-amber-500" />
              <span className="font-semibold">Age:</span> {pet.age}
            </p>
            <p className="text-gray-700 flex items-center gap-2">
              <FaCity className="text-amber-500" />
              <span className="font-semibold">City:</span> {pet.city}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-teal-800 mb-2 flex items-center gap-2">
              <FaFileMedical className="text-amber-500" /> Medical Reports
            </h2>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              {pet.medicalReports.map((report, idx) => (
                <li key={idx} className="hover:text-teal-700 transition">
                  <span className="font-medium">{report.date}:</span> {report.report}
                </li>
              ))}
            </ul>
          </div>

          <Link
            to="/adopt"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FaPaw /> Back to Adopt
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
