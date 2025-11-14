import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";
import CorpNavbar from "./CorpNavbar";
import CorpSidebar from "./CorporationComponents/CorpSidebar";

const Navbar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setRole(userData?.role || null);

    // Watch for storage updates (login/logout)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setRole(updatedUser?.role || null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (role === "corporation") return <CorpNavbar />;
  return <UserNavbar />;
};

export default Navbar;
