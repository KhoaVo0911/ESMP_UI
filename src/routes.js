import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import OrderedList from "./components/vendor/Shop/OrderedList";
import Payment from "./components/vendor/Shop/Payment";
import AccountManagement from "./pages/host/Account";
import Settings from "./pages/host/Settings";
import PackagePage from "./pages/host/Package";
import ManageProduct from "./pages/host/ManageProduct";
import LoginPage from "./shared/Login";
import EventList from "./components/vendor/Test/abc";
import EventDetail from "./components/vendor/Test/zxc";
import ViewWebsitePage from "./pages/host/ViewWebsitePage";
import BoothPlan from "./pages/host/BoothPlan";
// import Transaction from "./components/vendor/Transaction/Transaction";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect base URL to login page */}
      <Route path="/" element={<Navigate to="/login" />} />
      {/* <Route path="/eventss" element={<EventList />} />
      <Route path="/events/:eventId" element={<EventDetail />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/DashboardVendor" element={<DashboardVendor />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/events/:eventId"
        element={
          <VendorLayout>
            <EventPage />
          </VendorLayout>
        }
      />
      <Route
        path="/productsList"
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
      />
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
      />
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
      <Route
        path="/manage-product"
        element={
          <HostLayout>
            <ManageProduct />
          </HostLayout>
        }
      />
      <Route
        path="/event/booth-plan"
        element={
          <HostLayout>
            <BoothPlan />
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
      <Route
        path="/packages"
        element={
          <HostLayout>
            <PackagePage />
          </HostLayout>
        }
      />
      <Route
        path="/view-website"
        element={
          <HostLayout>
            <ViewWebsitePage />
          </HostLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
