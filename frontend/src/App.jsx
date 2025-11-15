import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Signup from "./components/Signup";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Adopt from "./pages/Adopt.jsx";
import PetDetails from "./pages/PetDetails.jsx";
import MyAdoptions from "./pages/MyAdoption.jsx";
import ReportAnimal from "./pages/ReportAnimal.jsx";
import MyReports from "./pages/MyReport.jsx";
import CorporationSignup from "./components/CorporationSignup.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ReportDetails from "./pages/ReportDetails.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rescued from "./pages/Rescued.jsx";
import RescuedDetails from "./pages/RescuedDetails.jsx";
import Tips from "./pages/Tips.jsx";
import About from "./pages/About.jsx";

import CorpDashboard from "./pages/Corp/CorpDashboard.jsx";
import CorpReportDetails from "./pages/Corp/CorpReports.jsx";
import CorpReports from "./pages/Corp/CorpReports.jsx";
import CorpRescued from "./pages/Corp/CorpRescued.jsx";
import CorpRescuedDetails from "./pages/Corp/CorpRescuedDetails.jsx";
import CorpCreateListing from "./pages/Corp/CorpCreateListing.jsx";
import CorpListingDetails from "./pages/Corp/CorpListingDetails.jsx";
import CorpListings from "./pages/Corp/CorpListings.jsx";
import AddAnimalForAdoption from "./pages/Corp/AddAnimalForAdoption.jsx";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="pt-20">
          <ToastContainer position="top-right" autoClose={2500} />
          <Routes>
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
            <Route
              path="/report/:id"
              element={
                <RequireAuth>
                  <ReportDetails />
                </RequireAuth>
              }
            />
            {/* Corps Side ROutes */}
            <Route path="/corp/dashboard" element={<CorpDashboard />} />
            <Route path="/corp/reports/:id" element={<CorpReportDetails />} />
            <Route path="/corp/reports" element={<CorpReports />} />
            <Route path="/corp/rescued" element={<CorpRescued />} />
            {/* <Route path="/corp/rescued/:id" element={<CorpRescuedDetails />} /> */}
            <Route
              path="/corp/adoption/add"
              element={<AddAnimalForAdoption />}
            />
            <Route path="/corp/adoptions" element={<CorpListings/>}/> 
            <Route path="/corp/adoption/:id" element={<CorpListingDetails />} /> 
          </Routes>
          
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
