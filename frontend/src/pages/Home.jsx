import React from "react";
import { Link } from "react-router-dom";
import { FaPaw, FaHeart, FaMapMarkerAlt } from "react-icons/fa";

const Home = () => {
  return (
    <div className="pt-20 bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-800 leading-tight">
            Give Every Pet a Second Home
          </h1>
          <p className="text-lg text-gray-700">
            ResQHome connects kind-hearted adopters with rescued animals.
            Whether you want to adopt or report a stray in need — we make it simple,
            local, and compassionate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/adopt"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Adopt a Pet
            </Link>
            <Link
              to="/report"
              className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-semibold transition"
            >
              Report an Animal
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn.pixabay.com/photo/2017/02/20/18/03/dog-2083492_1280.png"
            alt="Rescue Animals"
            className="w-80 md:w-96 rounded-xl drop-shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <FaPaw className="text-amber-500 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2 text-teal-800">Adopt Easily</h3>
            <p className="text-gray-600">
              Browse verified listings from NGOs and municipal shelters in your city.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <FaMapMarkerAlt className="text-amber-500 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2 text-teal-800">
              Report with Live Location
            </h3>
            <p className="text-gray-600">
              Spot an injured or stray animal? Report it with real-time location so local
              rescuers can help fast.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
            <FaHeart className="text-amber-500 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2 text-teal-800">
              Support the Cause
            </h3>
            <p className="text-gray-600">
              Volunteer or contribute to local shelters making a difference every day.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-teal-800 text-white py-16 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Together, We Can Change Lives
        </h2>
        <p className="text-lg mb-8 text-gray-200">
          Every rescue starts with one report. Be the reason a tail wags today.
        </p>
        <Link
          to="/report"
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Report an Animal Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
        © {new Date().getFullYear()} ResQHome — Built with ❤️ to save lives.
      </footer>
    </div>
  );
};

export default Home;
