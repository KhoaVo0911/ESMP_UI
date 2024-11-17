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
import LoginPage from "./shared/LoginPage.jsx";

import ViewWebsitePage from "./pages/host/ViewWebsitePage";
import BoothPlan from "./pages/host/BoothPlan";
import EventStaff from "./components/staff/Event/StaffEvent";
import StaffLayout from "./components/staff/Layout/StaffLayout";
import EventPageStaff from "./components/staff/EventDetail/EventPageStaff";

import LandingPage from "./pages/host/LandingPage/LandingPage";
import CourseList from "./pages/host/QR/QRCode.jsx";
import TransactionHistory from "./pages/host/QR/TransHistory";
import AdminLayout from "./components/admin/Layout/AdminLayout.jsx";
import AdminAccountManagement from "./components/admin/AccountManagement.jsx";
import AdminTransactionHistory from "./components/admin/TransHistory.jsx";
import ManageProducts from "./components/vendor/MostOderProduct/ManageProductItems.jsx";
import ImageUpload from "./shared/firebase/imageUpload.jsx";
import LocationMap from "./pages/host/LocationMap.jsx";
import LocationTypePage from "./components/extensionEvent/LocationTypePage.jsx";
import TestQRCODE from "./components/vendor/Shop/textInputQRcode.jsx";
import EventConfigPage from "./pages/host/EventConfigPage.jsx";
import StaffShop from "./components/staff/Event/Shop/Shop.jsx";
import StaffPayment from "./components/staff/Event/Shop/Payment.jsx";
import StaffOrderedList from "./components/staff/Event/Shop/OrderedList.jsx";
import PackageAdmin from "./components/admin/PackageAdmin.jsx";
import ExtensionEvent from "./pages/host/ExtensionEvent.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect base URL to login page */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<LandingPage />} />
      {/* <Route path="/eventss" element={<EventList />} />
      <Route path="/events/:eventId" element={<EventDetail />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/productSample"
        element={
          <VendorLayout>
            <ManageProducts />
          </VendorLayout>
        }
      />
      <Route path="/DashboardVendor" element={<DashboardVendor />} />
      <Route
        path="/qrcodecodecode"
        element={
          <VendorLayout>
            <TestQRCODE />
          </VendorLayout>
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="qrcode" element={<CourseList />} />
      <Route path="qrcodehist" element={<TransactionHistory />} />
      <Route path="testanh" element={<ImageUpload />} />

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
        path="/admin"
        element={
          <AdminLayout>
            <AdminAccountManagement />
          </AdminLayout>
        }
      />
      <Route
        path="/adtransaction"
        element={
          <AdminLayout>
            <AdminTransactionHistory />
          </AdminLayout>
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
        path="/events/host/:hostId"
        element={
          <HostLayout>
            <Event />
          </HostLayout>
        }
      />
      <Route
        path="/event-detail/:eventId"
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
        path="/eventStaff"
        element={
          <StaffLayout>
            <EventStaff />
          </StaffLayout>
        }
      />
      <Route
        path="/eventStaff/:eventId"
        element={
          <StaffLayout>
            <EventPageStaff />
          </StaffLayout>
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
        path="/StaffShop"
        element={
          <StaffLayout>
            <StaffShop />
          </StaffLayout>
        }
      />
       <Route
        path="/staff-payment"
        element={
          <StaffLayout>
            <StaffPayment/>
          </StaffLayout>
        }
      />
        <Route
        path="/staff-ordered-list"
        element={
          <StaffLayout>
            <StaffOrderedList />
          </StaffLayout>
        }
      />
         <Route
        path="/admin-package"
        element={
          <AdminLayout>
            <PackageAdmin/>
          </AdminLayout>
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
        path="/event/:eventId/booth-plan"
        element={
          <HostLayout>
            <LocationMap />
          </HostLayout>
        }
      />
      <Route
        path="/event/:eventId/booth-plan/:mode"
        element={
          <HostLayout>
            <BoothPlan />
          </HostLayout>
        }
      />
      <Route
        path="/event/:eventId/location-type"
        element={
          <HostLayout>
            <LocationTypePage />
          </HostLayout>
        }
      />
      <Route
        path="/eventconfig"
        element={
          <HostLayout>
            <EventConfigPage />
          </HostLayout>
        }
      />
      <Route
        path="/event/:eventId/extensionEvent"
        element={
          <HostLayout>
            <ExtensionEvent />
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
