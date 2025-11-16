import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaShieldAlt, FaHeart, FaAward } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const heroImages = [
  "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800",
  "https://images.unsplash.com/photo-1555169062-013468b47731?w=800",
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800",
];

const stats = [
  { label: "Animals Rescued", value: "4,982+" },
  { label: "Successful Adoptions", value: "2,746+" },
  { label: "Active Volunteers", value: "1,120+" },
];

const Home = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2800,
    fade: true,
    arrows: false,
  };

  return (
    <div className="pt-20 bg-white text-gray-800 overflow-hidden">

      {/* HERO */}
      <section className="relative">
        <Slider {...sliderSettings} className="max-h-[78vh] overflow-hidden">
          {heroImages.map((img, i) => (
            <div key={i}>
              <img
                src={img}
                alt="hero"
                className="w-full h-[78vh] object-cover brightness-[0.55]"
              />
            </div>
          ))}
        </Slider>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Rescue. Heal. <span className="text-amber-400">Rehome.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-200 max-w-xl mt-3 text-lg font-medium"
          >
            Every life matters. Be the reason an animal gets a second chance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex gap-3 mt-5"
          >
            <Link
              to="/adopt"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
            >
              Adopt
            </Link>
            <Link
              to="/report"
              className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-6 py-2.5 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
            >
              Report Case
            </Link>
          </motion.div>
        </div>
      </section>

      {/* LIVE STATS */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3 px-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="p-5 rounded-xl shadow bg-white"
            >
              <h3 className="text-3xl font-extrabold text-teal-700">{s.value}</h3>
              <p className="text-gray-600 font-medium mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-6">
          Why ResQHome?
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: <FaPaw />, title: "Verified Listings", desc: "Animals listed only by trusted NGOs." },
            { icon: <FaShieldAlt />, title: "Safe Adoption", desc: "Proper screening ensures safety." },
            { icon: <FaHeart />, title: "Medical Care", desc: "Treatment & recovery support." },
            { icon: <FaAward />, title: "High Success Rate", desc: "Thousands placed in loving homes." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="bg-white shadow p-6 text-center rounded-xl hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div className="text-amber-500 text-4xl mb-3 flex justify-center">{f.icon}</div>
              <h3 className="font-bold text-lg text-teal-800 mb-1">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-14 text-center px-6">
        <h2 className="text-3xl font-bold mb-3">Help Us Rewrite Their Story</h2>
        <p className="max-w-2xl mx-auto text-gray-200 text-md mb-6">
          Adoption, reporting, volunteering, donating — every act matters.
        </p>
        <Link
          to="/adopt"
          className="bg-amber-500 hover:bg-amber-600 px-8 py-3 text-white text-lg font-semibold rounded-lg shadow-lg transition hover:scale-105"
        >
          Browse Animals
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-4 text-center text-sm">
        © {new Date().getFullYear()} <span className="text-amber-500 font-medium">ResQHome</span> — For those without a voice 🖤
      </footer>
    </div>
  );
};

export default Home;
