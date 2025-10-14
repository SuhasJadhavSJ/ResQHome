import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaPaw, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in (token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

const handleLogout = async () => {
  try {
    // Call backend logout (optional but clean)
    const token = localStorage.getItem("token");
    await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear local storage and update UI
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
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
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center font-bold text-2xl gap-2 hover:text-amber-400 transition"
        >
          <FaPaw className="text-amber-400" />
          ResQHome
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="hover:text-amber-400 font-medium transition"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Section */}
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
                onClick={toggleDropdown}
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-teal-800 border-t border-teal-700 flex flex-col items-center py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={toggleMenu}
              className="text-white text-lg font-medium hover:text-amber-400 transition"
            >
              {link.name}
            </Link>
          ))}

          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={toggleMenu}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Login
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={toggleMenu}
                className="text-white text-lg hover:text-amber-400 transition"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
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

export default Navbar;
