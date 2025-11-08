import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaPaw, FaUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ get current route

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Adopt", path: "/adopt" },
    { name: "My Adoptions", path: "/my-adoptions" },
    { name: "Report Animal", path: "/report" },
    { name: "My Reports", path: "/my-reports" },
  ];

  return (
    <nav className="bg-teal-800 text-white fixed top-0 left-0 w-full shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center font-bold text-2xl gap-2 hover:text-amber-400 transition"
        >
          <FaPaw className="text-amber-400" />
          ResQHome
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 relative">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.name} className="relative">
                <Link
                  to={link.path}
                  className={`font-medium transition duration-200 pb-1 ${
                    isActive
                      ? "text-amber-400 border-b-2 border-amber-400"
                      : "hover:text-amber-300"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile / Login */}
        <div className="hidden md:block relative">
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:text-amber-400 transition"
              >
                <FaUserCircle className="text-3xl" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-teal-800 rounded-lg shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-teal-100 transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-teal-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-teal-800 border-t border-teal-700 flex flex-col items-center py-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition ${
                  isActive
                    ? "text-amber-400 border-b-2 border-amber-400 pb-1"
                    : "text-white hover:text-amber-400"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-white text-lg hover:text-amber-400 transition"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
