import React from "react";
import { motion } from "framer-motion";
import {
  FaPaw,
  FaSyringe,
  FaTint,
  FaShower,
  FaBone,
  FaHeartbeat,
  FaDog,
  FaCat,
} from "react-icons/fa";

const tips = [
  {
    title: "Provide Fresh Water",
    desc: "Animals must have clean drinking water at all times. Replace twice daily & keep bowls hygienic.",
    icon: <FaTint />,
  },
  {
    title: "Regular Vet Checkups",
    desc: "Preventive health checks every 6–12 months help detect diseases early.",
    icon: <FaSyringe />,
  },
  {
    title: "Proper Nutrition",
    desc: "Feed balanced food—avoid chocolate, grapes, onions & processed junk.",
    icon: <FaBone />,
  },
  {
    title: "Bathing & Hygiene",
    desc: "Scheduled grooming prevents ticks, shedding, skin infections & discomfort.",
    icon: <FaShower />,
  },
  {
    title: "Exercise & Play",
    desc: "Play improves physical health, confidence & reduces stress or aggression.",
    icon: <FaPaw />,
  },
  {
    title: "Love & Socialization",
    desc: "Emotional care is as essential as food & shelter — affection builds trust.",
    icon: <FaHeartbeat />,
  },
  {
    title: "Safe Environment",
    desc: "Keep away toxins, sharp objects, plastics, polythene & open balconies.",
    icon: <FaCat />,
  },
  {
    title: "Vaccinations",
    desc: "Timely vaccine schedule protects from rabies, parvo, distemper & more.",
    icon: <FaSyringe />,
  },
  {
    title: "Adopt, Don’t Shop",
    desc: "Shelter adoption saves lives. Encourage adopt-don’t-shop mindset.",
    icon: <FaDog />,
  },
];

const Tips = () => {
  return (
    <div className="pt-24 pb-20 bg-[#f9fafb] min-h-screen relative overflow-hidden">

      {/* Floating Paw Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('https://i.ibb.co/N7crGJL/paw-bg.png')] bg-repeat opacity-10 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center text-5xl font-extrabold text-teal-800 drop-shadow-sm"
        >
          Animal Care Guide 🐾
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-center text-gray-700 text-lg max-w-3xl mx-auto"
        >
          Compassion isn’t occasional help — it’s a habit. Start somewhere.
        </motion.p>

        {/* Tips Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
          {tips.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              whileHover={{ rotateX: 6, rotateY: -6, scale: 1.04 }}
              className="p-7 bg-white/70 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 text-center cursor-pointer transition-all"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Icon */}
              <div className="text-4xl text-amber-500 mb-4 animate-bounce-slow">
                {t.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-teal-800 mb-2">
                {t.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">{t.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-14 bg-teal-700 text-white py-6 text-center rounded-2xl shadow-lg px-6"
        >
          <h2 className="text-lg md:text-xl font-bold">
            ⭐ “Until one has loved an animal, a part of one’s soul remains unawakened.”  
          </h2>
        </motion.div>
      </div>

      {/* Animations */}
      <style>
        {`
          .animate-bounce-slow {
            animation: bounceSlow 2s infinite;
          }
          @keyframes bounceSlow {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
};

export default Tips;
