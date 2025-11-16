import React from "react";
import { motion } from "framer-motion";
import {
  FaPaw,
  FaUsers,
  FaHandHoldingHeart,
  FaShieldAlt,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="relative pt-24 pb-20 min-h-screen bg-white overflow-hidden">

      {/* Floating Paw Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('https://i.ibb.co/N7crGJL/paw-bg.png')] bg-contain bg-repeat pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-extrabold text-teal-800 drop-shadow-sm">
            About ResQHome 🐾
          </h1>

          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            A compassion-driven platform connecting rescuers, corporations, and loving
            adopters — ensuring <span className="font-semibold">no animal suffers unseen.</span>
          </p>
        </motion.div>

        {/* Wavy Divider */}
        <div className="mt-10">
          <svg className="w-full" viewBox="0 0 1440 80" fill="none">
            <path fill="#F0FDFA" d="M0,0 C480,120 960,-40 1440,60 L1440,0 L0,0 Z"></path>
          </svg>
        </div>

        {/* MISSION */}
        <section className="bg-teal-50/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-teal-100 mt-4 grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            src="https://img.freepik.com/premium-vector/dog-cat-helping-hand-animal-rescue-logo-design_675567-1145.jpg"
            alt="mission"
            className="rounded-2xl shadow-xl w-full object-cover"
          />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-teal-800 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              We exist to eliminate animal abandonment, suffering and homelessness by enabling:
            </p>

            <ul className="mt-4 space-y-3 text-gray-700 font-medium">
              {[
                "Instant distress reporting & geo-based rescue",
                "Verified, transparent adoption journey",
                "Corporation-assisted medical & shelter support",
                "Community-powered love, care & awareness",
              ].map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaPaw className="text-amber-500 mt-1" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* VISION */}
        <section className="mt-24 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-gray-100"
          >
            <h2 className="text-3xl font-bold text-teal-800 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              A future where <span className="font-semibold text-teal-900">every injured,
              abandoned or helpless animal finds safety</span> through<strong> technology-driven
              rescue</strong>, compassionate humans, and responsible adoption — globally.
            </p>
          </motion.div>

          {/* Updated Image */}
          <motion.img
  initial={{ opacity: 0, scale: 0.92 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7 }}
  src="https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1200&auto=format&fit=crop"
  alt="vision-img"
  className="rounded-2xl shadow-xl w-full h-full object-cover"
/>

        </section>

        {/* CORE VALUES */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-teal-800 mb-8">Our Core Values</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Compassion", desc: "Every soul deserves care.", icon: <FaHandHoldingHeart /> },
              { title: "Community", desc: "United for voiceless lives.", icon: <FaUsers /> },
              { title: "Trust", desc: "Verified care & operations.", icon: <FaShieldAlt /> },
              { title: "Action", desc: "Immediate help & rescue.", icon: <FaPaw /> },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.08 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl cursor-pointer"
              >
                <div className="text-4xl text-amber-500 mb-3 flex justify-center">{item.icon}</div>
                <h3 className="font-bold text-teal-800 text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINAL MESSAGE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-24 bg-teal-700 text-white py-8 px-6 rounded-2xl shadow-xl text-center"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            “True humanity begins when compassion becomes instinct — not charity.” ❤️
          </h2>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
