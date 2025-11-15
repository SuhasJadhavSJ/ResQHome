// CorpNavbar.jsx
import React from "react";
import {
  FaHome,
  FaExclamationTriangle,
  FaDog,
  FaPlusCircle,
  FaListUl,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaPaw,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const CorpNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboarddd", icon: <FaHome />, path: "/corp/dashboard" },
    { name: "Reported Animals", icon: <FaExclamationTriangle />, path: "/corp/reports" },
    { name: "Rescued Animals", icon: <FaDog />, path: "/corp/rescued" },
    // NEW: create listing (upload rescued animal details + images)
    { name: "List for Adoption", icon: <FaPlusCircle />, path: "/corp/adoption/add" },
    // NEW: view/manage adoption listings
    { name: "Adoption Listings", icon: <FaListUl />, path: "/corp/adoptions" },
    { name: "Adoption Requests", icon: <FaUsers />, path: "/corp/adoption-requests" },
    { name: "Settings", icon: <FaCog />, path: "/corp/settings" },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-full w-20 bg-[#0A3D62] flex flex-col items-center py-6 shadow-xl z-50"
      aria-label="Corporation sidebar"
    >
      {/* Logo / Brand */}
      <button
        onClick={() => navigate("/corp/dashboard")}
        aria-label="Go to dashboard"
        className="mb-10 text-3xl text-amber-400 cursor-pointer focus:outline-none"
      >
        <FaPaw />
      </button>

      {/* Menu */}
      <nav className="flex-1 w-full flex flex-col items-center gap-8" role="navigation">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.name} className="relative group flex flex-col items-center w-full">
              <button
                onClick={() => navigate(item.path)}
                aria-label={item.name}
                className={`flex items-center justify-center mx-auto rounded-lg p-3 text-2xl w-12 h-12 transition-all
                  ${isActive ? "bg-[#145A86] text-white" : "text-gray-200 hover:text-amber-400"}
                `}
                title={item.name}
              >
                {item.icon}
              </button>

              {/* Tooltip displayed below icon on hover */}
              <span
                className="absolute top-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150
                  text-xs bg-black text-white px-2 py-1 rounded shadow-lg whitespace-nowrap"
                aria-hidden="true"
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto mb-6 w-full flex flex-col items-center">
        <div className="relative group flex flex-col items-center">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="text-2xl text-red-400 hover:text-red-500 p-3 rounded-lg"
          >
            <FaSignOutAlt />
          </button>
          <span
            className="absolute top-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150
              text-xs bg-black text-white px-2 py-1 rounded shadow-lg"
            aria-hidden="true"
          >
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
};

export default CorpNavbar;
