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
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adopt" element={<Adopt />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/my-adoptions" element={<MyAdoptions/>}/>
            <Route path="/report" element={<ReportAnimal/>}/>
            <Route path="/my-reports" element={<MyReports/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
