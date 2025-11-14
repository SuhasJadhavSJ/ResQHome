import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [rescuedImages, setRescuedImages] = useState([]);

  useEffect(() => {
    const fetchRescued = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/rescued");
        const data = await res.json();

        if (data.success) {
          const imgs = data.data
            .map((r) => r.imageUrl)
            .filter((url) => url !== null && url !== undefined);

          setRescuedImages(imgs);
        }
      } catch (err) {
        console.error("Failed to load rescued animals:", err);
      }
    };

    fetchRescued();
  }, []);

  const fallbackImages = [
    "https://cdn.pixabay.com/photo/2016/02/19/11/53/dog-1209621_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/05/09/21/47/dog-2294701_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/03/26/09/54/cat-690051_1280.jpg",
  ];

  const sliderImages =
    rescuedImages.length > 0 ? rescuedImages : fallbackImages;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };

  return (
    <div className="pt-20 bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center justify-between">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 space-y-6 text-center md:text-left z-10"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-800 leading-tight">
            Give Every Pet a <span className="text-amber-500">Second Home</span>
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            ResQHome connects kind-hearted adopters with rescued animals.
            Adopt, report, or volunteer — every action saves a life.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Link
              to="/adopt"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Adopt a Pet
            </Link>
            <Link
              to="/report"
              className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
            >
              Report an Animal
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Image Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 mt-10 md:mt-0 relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Slider {...sliderSettings}>
              {sliderImages.map((src, index) => (
                <div key={index}>
                  <img
                    src={src}
                    alt={`Rescued ${index + 1}`}
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: <FaPaw />,
              title: "Adopt Easily",
              desc: "Browse verified listings from NGOs and municipal shelters.",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Report with Location",
              desc: "Report injured or stray animals with live GPS location.",
            },
            {
              icon: <FaHeart />,
              title: "Support the Cause",
              desc: "Volunteer or contribute to local shelters making a difference.",
            },
          ].map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2"
            >
              <div className="text-amber-500 text-5xl mb-4 flex justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold text-2xl mb-3 text-teal-800">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-20 text-center px-6"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Together, We Can Change Lives
        </h2>
        <p className="text-lg mb-10 text-gray-200 max-w-2xl mx-auto">
          Every rescue starts with one report. Be the reason a tail wags today.
        </p>
        <Link
          to="/report"
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Report an Animal Now
        </Link>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-amber-500">ResQHome</span> — Built with ❤️ to
        save lives.
      </footer>
    </div>
  );
};

export default Home;
