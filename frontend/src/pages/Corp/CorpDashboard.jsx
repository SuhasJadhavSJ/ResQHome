// CorpDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaDog,
  FaHeart,
  FaListUl,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const CorpDashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    rescued: 0,
    adopted: 0,
    adoptionListed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/api/corp/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("DASHBOARD RESPONSE:", data);

        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="pt-24 text-center text-gray-600 text-lg animate-pulse">
        Loading Dashboard...
      </div>
    );

  const cards = [
    {
      title: "Total Reports",
      value: stats.totalReports ?? 0,
      icon: <FaExclamationTriangle />,
      color: "bg-red-500",
      path: "/corp/reports",
    },
    {
      title: "Animals Rescued",
      value: stats.rescued ?? 0,
      icon: <FaDog />,
      color: "bg-green-600",
      path: "/corp/rescued",
    },
    {
      title: "Animals Adopted",
      value: stats.adopted ?? 0,
      icon: <FaHeart />,
      color: "bg-purple-600",
      path: "/corp/adopted",
    },
    {
      title: "Listed for Adoption",
      value: stats.adoptionListed ?? 0,
      icon: <FaListUl />,
      color: "bg-blue-600",
      path: "/corp/adoptions",
    },
  ];

  // ==== BAR CHART DATA ====
  const graphData = {
    labels: [
      "Total Reports",
      "Animals Rescued",
      "Animals Adopted",
      "Listed for Adoption",
    ],
    datasets: [
      {
        label: "Animal Rescue Statistics",
        data: [
          stats.totalReports,
          stats.rescued,
          stats.adopted,
          stats.adoptionListed,
        ],
        backgroundColor: ["#ef4444", "#16a34a", "#9333ea", "#2563eb"],
        borderWidth: 1,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="pt-20 px-6 ml-20">
      <h1 className="text-4xl font-bold text-teal-900 mb-10">
        Corporation Dashboard 🏢
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => (window.location.href = card.path)}
            className={`${card.color} cursor-pointer p-6 rounded-xl shadow-lg text-white hover:shadow-2xl transition transform hover:-translate-y-2`}
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-3xl mt-3 font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar Graph */}
      <div className="mt-16 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-teal-800 mb-4">Statistics Overview</h2>
        <div className="h-80">
          <Bar data={graphData} options={graphOptions} />
        </div>
      </div>
    </div>
  );
};

export default CorpDashboard;
