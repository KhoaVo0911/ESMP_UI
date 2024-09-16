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
import EventEnrolled from "./components/vendor/EventDetail/EnrolledPage";
import Shop from "./components/vendor/Shop/Shop";
import ProductTabs from "./components/vendor/Shop/ProductsTabs";
import OrderedList from "./components/vendor/Shop/OrderedList";
import Payment from "./components/vendor/Shop/Payment";

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
        path="productsList"
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
            <Transaction />
          </VendorLayout>
        }
      />
      <Route
        path="/eventenrolled"
        element={
          <VendorLayout>
            <EventEnrolled />
          </VendorLayout>
        }
      />{" "}
      <Route
        path="/Shop"
        element={
          <VendorLayout>
            <Shop />
          </VendorLayout>
        }
      />
      <Route
        path="/ordered-list"
        element={
          <VendorLayout>
            <OrderedList />
          </VendorLayout>
        }
      />
      <Route
        path="/payment"
        element={
          <VendorLayout>
            <Payment />
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
    </Routes>
  );
};

export default AppRoutes;
