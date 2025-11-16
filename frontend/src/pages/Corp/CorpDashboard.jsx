// CorpDashboard.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDog, FaHeart, FaListUl } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CorpDashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    rescued: 0,
    adoptionListed: 0,
    pendingRequests: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/api/corp/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        console.log("🔥 Dashboard Response:", result);

        if (result.success) {
          const d = result.data;

          setStats({
            totalReports: d.totalReports ?? 0,
            rescued: d.rescued ?? 0,
            adoptionListed: d.adoptionListed ?? 0,
            pendingRequests: d.pendingRequests ?? 0,
          });

          // Build dynamic chart data
          setChartData([
            { label: "Rescued", value: d.rescued ?? 0 },
            { label: "Listed", value: d.adoptionListed ?? 0 },
            { label: "Requests", value: d.pendingRequests ?? 0 }
          ]);
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
      <div className="text-center text-gray-600 text-lg animate-pulse mt-10">
        Loading Dashboard...
      </div>
    );

  const cards = [
    {
      title: "Animals Rescued",
      value: stats.rescued,
      icon: <FaDog />,
      color: "bg-green-600",
      path: "/corp/rescued",
    },
    {
      title: "Listed for Adoption",
      value: stats.adoptionListed,
      icon: <FaListUl />,
      color: "bg-blue-600",
      path: "/corp/adoptions",
    },
    {
      title: "Pending Adoption Requests",
      value: stats.pendingRequests,
      icon: <FaHeart />,
      color: "bg-purple-600",
      path: "/corp/adoption-requests",
    },
  ];

  const graphDataConfig = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: "Count",
        data: chartData.map((item) => item.value),
        backgroundColor: ["#16a34a", "#2563eb", "#9333ea"],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="px-6 ml-20">
      <h1 className="text-3xl font-extrabold text-teal-900 mb-6 tracking-wide mt-4">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => (window.location.href = card.path)}
            className={`${card.color} cursor-pointer p-6 rounded-xl shadow-lg text-white hover:shadow-2xl transition transform hover:-translate-y-1`}
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-3xl mt-2 font-bold">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Bar Chart */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-teal-800 mb-4">
          Performance Graph
        </h2>
        <div className="h-80">
          <Bar data={graphDataConfig} options={graphOptions} />
        </div>
      </div>
    </div>
  );
};

export default CorpDashboard;
