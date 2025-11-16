import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  // Mixed free safe demo images
const demoRescuedImages = [
  // White Dog
  "https://plus.unsplash.com/premium_photo-1666278379770-440439b08656?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  // Cat
  "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QW5pbWFsc3xlbnwwfHwwfHx8MA%3D%3D",

  // Hen
  "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hpY2tlbnN8ZW58MHx8MHx8fDA%3D",

  // White cat
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2F0c3xlbnwwfHwwfHx8MA%3D%3D",

  // Bird
  "https://images.pexels.com/photos/750525/pexels-photo-750525.jpeg",

  // Cow
  "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y293c3xlbnwwfHwwfHx8MA%3D%3D",

  // Brown Dog
  "https://images.pexels.com/photos/257577/pexels-photo-257577.jpeg",

  // Bird
  "https://images.unsplash.com/photo-1555169062-013468b47731?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJpcmR8ZW58MHx8MHx8fDA%3D",

  // Horse
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9yc2V8ZW58MHx8MHx8fDA%3D",

  // Goat
  "https://images.unsplash.com/photo-1550348579-959785e820f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z29hdHN8ZW58MHx8MHx8fDA%3D",

  // Bird Parrot
  "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJpcmR8ZW58MHx8MHx8fDA%3D",

  "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFuaW1hbHxlbnwwfHwwfHx8MA%3D%3D",
];


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 900,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
  };

  return (
    <div className="pt-20 bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col-reverse md:flex-row items-center justify-between">

        {/* Left Section */}
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

        {/* Right Slider Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 mt-10 md:mt-0 relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Slider {...sliderSettings}>
              {demoRescuedImages.map((src, i) => (
                <div key={i}>
                  <img src={src} alt={`rescued-${i}`} className="w-full h-[400px] object-cover" />
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
              desc: "Browse verified listings from NGOs and shelters.",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Report Any Animal",
              desc: "Submit rescue details with real-time GPS location.",
            },
            {
              icon: <FaHeart />,
              title: "Volunteer & Support",
              desc: "Help care and rehabilitate rescued animals.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2"
            >
              <div className="text-amber-500 text-5xl mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-bold text-2xl mb-3 text-teal-800">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
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
        © {new Date().getFullYear()} <span className="text-amber-500">ResQHome</span> — Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
