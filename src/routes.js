import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
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
import VendorProfile from "./components/vendor/Layout/VendorProfile.jsx";

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
          <ProtectedRoute>
            <VendorLayout>
              <ManageProducts />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map-sample"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <BoothPlanView />
            </VendorLayout>
          </ProtectedRoute>
        }
      />

<Route
        path="/vendor-profile"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <VendorProfile />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/listEventEnrolled/:vendorId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <ListEventEnrolled />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-account-manager/:vendorId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <StaffAccountManager />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/selectbooth/:vendorId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <SelectBoothPage />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/:vendorId/dashboardVendor"
        element={
          <ProtectedRoute>
            <DashboardVendor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qrcodecodecode"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <TestQRCODE />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/:hostId/dashboard"
        element={
          <ProtectedRoute>
            <HostLayout>
              <Dashboard />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route path="qrcode" element={<CourseList />} />
      <Route path="qrcodehist" element={<TransactionHistory />} />
      <Route path="testanh" element={<ImageUpload />} />

      <Route
        path="/events/:vendorId/:eventId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <EventPage />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/productsList/:vendorId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <ListProducts />
            </VendorLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/accountList"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminAccountManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/adtransaction"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminTransactionHistory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ManageProductItems"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <ManageProductItems />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/host/:hostId"
        element={
          <ProtectedRoute>
            <HostLayout>
              <Event />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/event-detail/:eventId"
        element={
          <ProtectedRoute>
            <HostLayout>
              <EventDetails />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventsVendor/:vendorId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <EventVendor />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventStaff/:vendorId/:staffId"
        element={
          <ProtectedRoute>
            <StaffLayout>
              <EventStaff />
            </StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventStaff/:vendorId/:staffId/:eventId"
        element={
          <ProtectedRoute>
            <StaffLayout>
              <EventPageStaff />
            </StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <Transaction />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventenrolled/:vendorId/:eventId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <EventEnrolled />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/Shop/:vendorId/:eventId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <Shop />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/StaffShop/:vendorId/:staffId/:eventId"
        element={
          <ProtectedRoute>
            <StaffLayout>
              <StaffShop />
            </StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-payment/:vendorId/:staffId/:eventId"
        element={
          <ProtectedRoute>
            <StaffLayout>
              <StaffPayment />
            </StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-ordered-list/:vendorId/:staffId/:eventId"
        element={
          <ProtectedRoute>
            <StaffLayout>
              <StaffOrderedList />
            </StaffLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-package"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <PackageAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/host-package-info"
        element={
          <ProtectedRoute>
            <HostPackageInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ordered-list/:vendorId/:eventId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <OrderedList />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:vendorId/:eventId"
        element={
          <ProtectedRoute>
            <VendorLayout>
              <Payment />
            </VendorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventpayment/:eventId"
        element={
          <ProtectedRoute>
            <HostLayout>
              <Transaction />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/package-trans"
        element={
          <ProtectedRoute>
            <HostLayout>
              <PackageTransactionHistory />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-product"
        element={
          <ProtectedRoute>
            <HostLayout>
              <ManageProduct />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:eventId/booth-plan"
        element={
          <ProtectedRoute>
            <HostLayout>
              <LocationMap />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:eventId/booth-plan/:mode"
        element={
          <ProtectedRoute>
            <HostLayout>
              <BoothPlan />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:eventId/location-type"
        element={
          <ProtectedRoute>
            <HostLayout>
              <LocationTypePage />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/eventconfig"
        element={
          <ProtectedRoute>
            <HostLayout>
              <EventConfigPage />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/event/:eventId/extensionEvent"
        element={
          <ProtectedRoute>
            <HostLayout>
              <ExtensionEvent />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <HostLayout>
              <AccountManagement />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/:hostId"
        element={
          <ProtectedRoute>
            <HostLayout>
              <Settings />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/packages"
        element={
          <ProtectedRoute>
            <HostLayout>
              <PackagePage />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/view-website"
        element={
          <ProtectedRoute>
            <HostLayout>
              <ViewWebsitePage />
            </HostLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DashboardAdmin />
            </AdminLayout>
          </ProtectedRoute>
        } />
        </Routes>
  );
};

export default AppRoutes;
