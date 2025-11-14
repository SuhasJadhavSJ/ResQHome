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
    desc: "Animals need clean water at all times. Change the water twice a day and clean the bowl regularly.",
    icon: <FaTint className="text-teal-600 text-4xl" />,
  },
  {
    title: "Regular Vet Checkups",
    desc: "A routine veterinary visit every 6–12 months ensures early diagnosis of health issues.",
    icon: <FaSyringe className="text-teal-600 text-4xl" />,
  },
  {
    title: "Proper Nutrition",
    desc: "Feed balanced and age-appropriate diets. Avoid harmful foods like chocolate, onions, grapes, etc.",
    icon: <FaBone className="text-teal-600 text-4xl" />,
  },
  {
    title: "Bathing & Hygiene",
    desc: "Maintain cleanliness by bathing pets at recommended intervals and grooming their coat frequently.",
    icon: <FaShower className="text-teal-600 text-4xl" />,
  },
  {
    title: "Exercise & Play",
    desc: "Animals need physical and mental stimulation. Playtime reduces stress and aggression.",
    icon: <FaPaw className="text-teal-600 text-4xl" />,
  },
  {
    title: "Love & Socialization",
    desc: "Pets thrive on care, affection, and social interaction. Spend quality time with them daily.",
    icon: <FaHeartbeat className="text-teal-600 text-4xl" />,
  },
  {
    title: "Safe Environment",
    desc: "Ensure living areas are free from sharp objects, toxic plants, and unsafe chemicals.",
    icon: <FaCat className="text-teal-600 text-4xl" />,
  },
  {
    title: "Vaccinations",
    desc: "Keep pets vaccinated on schedule to protect them from life-threatening diseases.",
    icon: <FaSyringe className="text-teal-600 text-4xl" />,
  },
  {
    title: "Adopt, Don’t Shop",
    desc: "Encourage people to adopt animals from shelters instead of buying from breeders.",
    icon: <FaDog className="text-teal-600 text-4xl" />,
  },
];

const Tips = () => {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-teal-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-teal-800 mb-10"
        >
          Animal Care Tips 🐾
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-700 max-w-3xl mx-auto mb-12"
        >
          Keep animals safe, healthy, and happy with these essential care
          recommendations. Small steps make a big difference!
        </motion.p>

        {/* Tips Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex justify-center mb-4">{tip.icon}</div>
              <h3 className="text-xl font-semibold text-teal-800 text-center mb-2">
                {tip.title}
              </h3>
              <p className="text-gray-600 text-center">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tips;
