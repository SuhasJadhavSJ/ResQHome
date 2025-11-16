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
    { name: "Dashboard", icon: <FaHome />, path: "/corp/dashboard" },
    { name: "Reported Animals", icon: <FaExclamationTriangle />, path: "/corp/reports" },
    { name: "Rescued Animals", icon: <FaDog />, path: "/corp/rescued" },
    { name: "List for Adoption", icon: <FaPlusCircle />, path: "/corp/adoption/add" },
    { name: "Adoption Listings", icon: <FaListUl />, path: "/corp/adoptions" },
    { name: "Adoption Requests", icon: <FaUsers />, path: "/corp/adoption-requests" },
    { name: "Settings", icon: <FaCog />, path: "/corp/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-24 bg-[#0A3D62] text-white shadow-xl z-50 flex flex-col items-center py-5">
      
      {/* Logo */}
      <button
        onClick={() => navigate("/corp/dashboard")}
        className="text-4xl text-amber-400 mb-5 hover:scale-110 transition-transform"
      >
        <FaPaw />
      </button>

      {/* Scrollable menu so logout is always visible */}
      <nav className="flex-1 w-full overflow-y-auto custom-scrollbar flex flex-col gap-3 px-1">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 w-full py-2 rounded-md transition-all
                ${isActive ? "bg-[#145A86] text-white" : "text-gray-300 hover:text-amber-400"}
              `}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-medium text-center leading-tight px-1">
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mb-2 flex flex-col items-center text-red-400 hover:text-red-500 transition-all"
      >
        <FaSignOutAlt className="text-2xl" />
        <span className="text-[11px] font-medium mt-1">Logout</span>
      </button>
    </aside>
  );
};

export default CorpNavbar;
