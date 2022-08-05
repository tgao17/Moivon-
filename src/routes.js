import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AllEvent from "./pages/all-event";
import EventDetail from "./pages/event-detail";
import Home from "./pages/home";
import UploadEvent from "./pages/upload-event";

function NavigationRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-events" element={<AllEvent />} />
        <Route path="/event-detail/:eventId" element={<EventDetail />} />
        <Route path="/upload-event" element={<UploadEvent />} />
      </Routes>
      <Footer />
    </>
  );
}

export default NavigationRoutes;
