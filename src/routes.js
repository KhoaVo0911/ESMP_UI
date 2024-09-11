import React from "react";
import { Routes, Route } from "react-router-dom";
import HostLayout from "./layouts/host/HostLayout";
import Dashboard from "./pages/Dashboard";
import Event from "./components/host/Event/Event";
import EventDetails from "./components/host/EventDetail/EventDetail";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route
        path="/"
        element={
          <HostLayout>
            <Dashboard />
          </HostLayout>
        }
      /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/events"
        element={
          <HostLayout>
            <Event />
          </HostLayout>
        }
      />
      <Route
        path="/event-detail/:id"
        element={
          <HostLayout>
            <EventDetails />
          </HostLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
