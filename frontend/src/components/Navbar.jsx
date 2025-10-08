import React, { useState } from "react";
import { FaBars, FaTimes, FaPaw } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

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

        {/* Profile Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/login"
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Login
          </Link>
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
          <Link
            to="/login"
            onClick={toggleMenu}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;