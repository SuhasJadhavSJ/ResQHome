import React from "react";
import { motion } from "framer-motion";
import { FaPaw, FaUsers, FaHandHoldingHeart, FaShieldAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-teal-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-teal-800 mb-6"
        >
          About ResQHome 🐾
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          ResQHome is a community-first initiative built to rescue, protect, and
          provide safe homes for stray and abandoned animals.  
          Our mission is simple — *connect caring humans with animals who need
          them the most*, while empowering local corporations and rescuers with the right tools.
        </motion.p>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mt-16">
          
          {/* Image / Illustration */}
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src="https://img.freepik.com/premium-vector/dog-cat-helping-hand-animal-rescue-logo-design_675567-1145.jpg"
            alt="Rescue Animals"
            className="w-full rounded-2xl shadow-lg object-cover"
          />

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-teal-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every year, thousands of animals suffer due to neglect,
              accidents, illness, or homelessness. We aim to change this
              through:
            </p>

            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3 items-start">
                <FaPaw className="text-amber-500 mt-1" />
                Quick and easy reporting of animals in distress.
              </li>
              <li className="flex gap-3 items-start">
                <FaHandHoldingHeart className="text-amber-500 mt-1" />
                Verified adoption processes for safe and loving homes.
              </li>
              <li className="flex gap-3 items-start">
                <FaShieldAlt className="text-amber-500 mt-1" />
                Ensuring animal safety with collaborating corporations.
              </li>
              <li className="flex gap-3 items-start">
                <FaUsers className="text-amber-500 mt-1" />
                Building a strong community of rescuers and caregivers.
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Vision Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-teal-800 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where no animal is left unattended or unloved.
              A world where technology bridges the gap between helpless animals
              and the humans willing to help.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src="https://img.freepik.com/premium-vector/cat-dog-logo-icon-adoption-pet-shop-veterinary_616222-4426.jpg"
            alt="Vision"
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* Values Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center text-teal-800 mb-10">
            What We Stand For
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Compassion",
                desc: "Every life matters. We treat every animal with love and empathy.",
                icon: <FaHandHoldingHeart className="text-4xl text-teal-700" />,
              },
              {
                title: "Community",
                desc: "We unite rescuers, corporations, and caregivers under one mission.",
                icon: <FaUsers className="text-4xl text-teal-700" />,
              },
              {
                title: "Trust",
                desc: "Verified adoptions and rescue operations ensure safety.",
                icon: <FaShieldAlt className="text-4xl text-teal-700" />,
              },
              {
                title: "Action",
                desc: "Fast reporting & quick response to save lives in critical moments.",
                icon: <FaPaw className="text-4xl text-teal-700" />,
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 text-center hover:shadow-xl transition"
              >
                <div className="flex justify-center mb-3">{val.icon}</div>
                <h3 className="text-xl font-semibold text-teal-700 mb-2">
                  {val.title}
                </h3>
                <p className="text-gray-600 text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
