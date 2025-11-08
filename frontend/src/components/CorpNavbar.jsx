import React, { useState } from "react";
import { FaBars, FaTimes, FaPaw, FaUserTie } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CorpNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.clear();
    navigate("/login");
  };

  const corpLinks = [
    { name: "Dashboard", path: "/corp/dashboard" },
    { name: "All Reports", path: "/corp/reports" },
    { name: "Rescue Progress", path: "/corp/rescue-progress" },
    { name: "Adopted Animals", path: "/corp/adopted" },
  ];

  return (
    <nav className="bg-indigo-900 text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/corp/dashboard"
          className="flex items-center font-bold text-2xl gap-2 hover:text-yellow-400 transition"
        >
          <FaPaw className="text-yellow-400" />
          ResQCorp
        </Link>

        <ul className="hidden md:flex gap-8">
          {corpLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name} className="relative">
                <Link
                  to={link.path}
                  className={`font-medium transition pb-1 ${
                    isActive
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "hover:text-yellow-300"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:text-yellow-400 transition"
          >
            <FaUserTie className="text-3xl" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-indigo-900 rounded-lg shadow-lg z-50">
              <Link
                to="/corp/profile"
                className="block px-4 py-2 hover:bg-indigo-100 transition"
                onClick={() => setShowDropdown(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-indigo-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-indigo-900 border-t border-indigo-800 flex flex-col items-center py-4 space-y-3">
          {corpLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition ${
                  isActive
                    ? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
                    : "text-white hover:text-yellow-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default CorpNavbar;
