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
import BoothPlanView from "./pages/host/BoothPlanView.jsx";
import SelectBoothPage from "./components/vendor/EventDetail/SelectBooth.jsx";
import StaffAccountManager from "./components/vendor/StaffAccount/ManageStaffAccount.jsx";
import HostPackageInfo from "./pages/host/HostPackageInfo.jsx";
import PackageTransactionHistory from "./pages/host/PackageHistoryTransaction.jsx";
import ListEventEnrolled from "./components/vendor/ListEventEnrolled.jsx";
import OwenrPage from "./components/owner/OwnerPage";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import RegisterHostComponent from "./pages/RegisterHost.jsx";
import DashboardAdmin from "./components/admin/AdminDashboard.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect base URL to login page */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<OwenrPage />} />
      {/* <Route path="/eventss" element={<EventList />} />
      <Route path="/events/:eventId" element={<EventDetail />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register-host" element={<RegisterHostComponent />} />
      {/* <Route path="/reset-password/:accountId" element={<ResetPassword />} /> */}
      <Route
        path="/manage-product/:vendorId"
        element={
          <VendorLayout>
            <ManageProducts />
          </VendorLayout>
        }
      />
      <Route
        path="/map-sample"
        element={
          <VendorLayout>
            <BoothPlanView />
          </VendorLayout>
        }
      />
      <Route
        path="/listEventEnrolled/:vendorId"
        element={
          <VendorLayout>
            <ListEventEnrolled />
          </VendorLayout>
        }
      />
      <Route
        path="/staff-account-manager/:vendorId"
        element={
          <VendorLayout>
            <StaffAccountManager />
          </VendorLayout>
        }
      />

      <Route
        path="/selectbooth/:vendorId"
        element={
          <VendorLayout>
            <SelectBoothPage />
          </VendorLayout>
        }
      />
      <Route path="/:vendorId/dashboardVendor" element={<DashboardVendor />} />
      <Route
        path="/qrcodecodecode"
        element={
          <VendorLayout>
            <TestQRCODE />
          </VendorLayout>
        }
      />
      <Route
        path="/:hostId/dashboard"
        element={
          <HostLayout>
            <Dashboard />
          </HostLayout>
        }
      />
      <Route path="qrcode" element={<CourseList />} />
      <Route path="qrcodehist" element={<TransactionHistory />} />
      <Route path="testanh" element={<ImageUpload />} />

      <Route
        path="/events/:vendorId/:eventId"
        element={
          <VendorLayout>
            <EventPage />
          </VendorLayout>
        }
      />
      <Route
        path="/productsList/:vendorId"
        element={
          <VendorLayout>
            <ListProducts />
          </VendorLayout>
        }
      />

      <Route
        path="/accountList"
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
        path="/eventsVendor/:vendorId"
        element={
          <VendorLayout>
            <EventVendor />
          </VendorLayout>
        }
      />
      <Route
        path="/eventStaff/:vendorId/:staffId"
        element={
          <StaffLayout>
            <EventStaff />
          </StaffLayout>
        }
      />
      <Route
        path="/eventStaff/:vendorId/:staffId/:eventId"
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
        path="/eventenrolled/:vendorId/:eventId"
        element={
          <VendorLayout>
            <EventEnrolled />
          </VendorLayout>
        }
      />
      <Route
        path="/Shop/:vendorId/:eventId"
        element={
          <VendorLayout>
            <Shop />
          </VendorLayout>
        }
      />
      <Route
        path="/StaffShop/:vendorId/:staffId/:eventId"
        element={
          <StaffLayout>
            <StaffShop />
          </StaffLayout>
        }
      />
      <Route
        path="/staff-payment/:vendorId/:staffId/:eventId"
        element={
          <StaffLayout>
            <StaffPayment />
          </StaffLayout>
        }
      />
      <Route
        path="/staff-ordered-list/:vendorId/:staffId/:eventId"
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
            <PackageAdmin />
          </AdminLayout>
        }
      />
      <Route path="/host-package-info" component={HostPackageInfo} />
      <Route
        path="/ordered-list/:vendorId/:eventId"
        element={
          <VendorLayout>
            <OrderedList />
          </VendorLayout>
        }
      />
      <Route
        path="/payment/:vendorId/:eventId"
        element={
          <VendorLayout>
            <Payment />
          </VendorLayout>
        }
      />
      <Route
        path="/eventpayment/:eventId"
        element={
          <HostLayout>
            <Transaction />
          </HostLayout>
        }
      />
      <Route
        path="/package-trans"
        element={
          <HostLayout>
            <PackageTransactionHistory />
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
        path="/settings/:hostId"
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
      <Route
        path="/dashboard-admin"
        element={
          <AdminLayout>
            <DashboardAdmin />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
