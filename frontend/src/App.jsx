// App.jsx
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Adopt from "./pages/Adopt";
import PetDetails from "./pages/PetDetails";
import MyAdoptions from "./pages/MyAdoption";
import ReportAnimal from "./pages/ReportAnimal";
import MyReports from "./pages/MyReport";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CorporationSignup from "./components/CorporationSignup";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import ReportDetails from "./pages/ReportDetails";
import RequireAuth from "./components/RequireAuth";
import Rescued from "./pages/Rescued";
import RescuedDetails from "./pages/RescuedDetails";
import Tips from "./pages/Tips";
import About from "./pages/About";
import AnimalDetails from "./pages/AnimalDetails";

// Corp Pages
import CorpDashboard from "./pages/Corp/CorpDashboard";
import CorpReports from "./pages/Corp/CorpReports";
import CorpReportDetails from "./pages/Corp/CorpReports";
import CorpRescued from "./pages/Corp/CorpRescued";
import CorpListings from "./pages/Corp/CorpListings";
import CorpListingDetails from "./pages/Corp/CorpListingDetails";
import AddAnimalForAdoption from "./pages/Corp/AddAnimalForAdoption";
import AdoptionRequests from "./pages/Corp/AdoptionRequests";
import CorpSettings from "./pages/Corp/CorpSettings";
import { ToastContainer } from "react-toastify";
import CorpRescuedDetails from "./pages/Corp/CorpRescuedDetails";
import CorpListingEdit from "./pages/Corp/CorpListingEdit";

const LayoutWrapper = ({ children }) => {
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setRole(userData?.role || null);
  }, []);

  // Pages that should NOT have top padding (full screen hero)
  const noPaddingRoutes = ["/"];

  const isNoPadding = noPaddingRoutes.includes(location.pathname);

  const layoutClass =
    role === "corporation" ? "ml-5" : isNoPadding ? "" : "pt-20";

  return <div className={layoutClass}>{children}</div>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <LayoutWrapper>
        <ToastContainer position="top-right" autoClose={2500} />

        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/pet/:id" element={<PetDetails />} />
          <Route path="/my-adoptions" element={<MyAdoptions />} />
          <Route path="/report" element={<ReportAnimal />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/corporation-signup" element={<CorporationSignup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/rescued" element={<Rescued />} />
          <Route path="/rescued/:id" element={<RescuedDetails />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/about" element={<About />} />
          <Route path="/adoption/:id" element={<AnimalDetails />} />

          <Route
            path="/report/:id"
            element={
              <RequireAuth>
                <ReportDetails />
              </RequireAuth>
            }
          />

          {/* Corporation Routes */}
          <Route path="/corp/dashboard" element={<CorpDashboard />} />
          <Route path="/corp/reports" element={<CorpReports />} />
          <Route path="/corp/reports/:id" element={<CorpReportDetails />} />
          <Route path="/corp/rescued" element={<CorpRescued />} />
          <Route path="/corp/rescued/:id" element={<CorpRescuedDetails />} />
          <Route path="/corp/adoption/add" element={<AddAnimalForAdoption />} />
          <Route path="/corp/adoptions" element={<CorpListings />} />
          <Route path="/corp/adoption/:id" element={<CorpListingDetails />} />
          <Route path="/corp/adoption/:id/edit" element={<CorpListingEdit />} />
          <Route path="/corp/adoption-requests" element={<AdoptionRequests />} />
          <Route path="/corp/settings" element={<CorpSettings />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default App;
