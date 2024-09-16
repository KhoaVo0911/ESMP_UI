import React from "react";
import { Routes, Route } from "react-router-dom";
import HostLayout from "./layouts/host/HostLayout";
import Dashboard from "./pages/host/Dashboard";
import Event from "./pages/host/Event/Event";
import EventDetails from "./pages/host/EventDetail/EventDetail";
import Transaction from "./pages/host/Transaction";
import DashboardVendor from "./components/vendor/Dashboard";
import ListProducts from "./components/vendor/Products/ListProducts";
import VendorLayout from "./components/vendor/Layout/VendorLayout";
import ManageProductItems from "./components/vendor/MostOderProduct/ManageProductItems";
import EventPage from "./components/vendor/EventDetail/EventPage";
import EventVendor from "./components/vendor/Event/EventVendor";
import TransactionTable from "./components/vendor/Transaction/Transaction";
import AccountManagement from "./pages/host/Account";
import Settings from "./pages/host/Settings";
// import Transaction from "./components/vendor/Transaction/Transaction";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/DashboardVendor" element={<DashboardVendor />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/eventpage"
        element={
          <VendorLayout>
            <EventPage />
          </VendorLayout>
        }
      />
      <Route
        path="listproducts"
        element={
          <VendorLayout>
            <ListProducts />
          </VendorLayout>
        }
      />
      <Route
        path="/ManageProductItems"
        element={
          <VendorLayout>
            <ManageProductItems />
          </VendorLayout>
        }
      />
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
      <Route
        path="/eventsVendor"
        element={
          <VendorLayout>
            <EventVendor />
          </VendorLayout>
        }
      />{" "}
      <Route
        path="/transaction"
        element={
          <VendorLayout>
            <TransactionTable />
          </VendorLayout>
        }
      />
      <Route
        path="/event/transactions"
        element={
          <HostLayout>
            <Transaction />
          </HostLayout>
        }
      />
      <Route
        path="/accounts"
        element={
          <HostLayout>
            <AccountManagement />
          </HostLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <HostLayout>
            <Settings />
          </HostLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
