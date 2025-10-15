import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleMapsProvider } from "@/contexts/GoogleMapsContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import AppointmentManagement from "./pages/dashboard/AppointmentManagement";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import NotFound from "./pages/NotFound";
import ProfileSettings from "./pages/ProfileSettings";
import ServiceAreas from "./pages/dashboard/ServiceAreas";
import NewUserDashboard from "@/pages/users/NewUserDashboard";
import MyAppointments from "./pages/MyAppointments";
import MyBookings from "./pages/users/pages/MyBookings";
import UserLocations from "./pages/users/pages/UserLocations";
import MyAddresses from "./pages/MyAddresses";
import Support from "./pages/users/pages/Support";
import Profile from "./pages/users/pages/Profile";
import OutstandingPayments from "./pages/users/pages/OutstandingPayments";
import FaqPage from "./pages/websitePages/FaqPage";
import MainLayout from "./pages/websitePages/MainLayout";
import PrivacyPolicy from "./pages/websitePages/PrivacyPolicy";
import ServiceLayout from "./pages/websitePages/ServiceLayout";
import SingleCategory from "./pages/websitePages/SingleCategory";
import Terms from "./pages/websitePages/Terms";
import OrderConfirmation from "./pages/users/pages/OrderConfirmation";
import BookingDetails from "./pages/users/pages/BookingDetails";
import ManageBooking from "./pages/users/pages/ManageBooking";
import CustomerSupport from "./pages/users/pages/CustomerSupport";
import PaymentCancelled from "./pages/websitePages/PaymentCancelled";
import NewAdminDashboard from "./pages/admin/NewAdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminAvailableDates from "./pages/admin/AdminAvailableDates";
import AdminTimeSlots from "./pages/admin/AdminTimeSlots";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminProfile from "./pages/admin/AdminProfile";
import SuperAdminProtectedRoute from "@/components/SuperAdminProtectedRoute";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminApiConfig from "./pages/superadmin/SuperAdminApiConfig";
import SuperAdminUserManagement from "./pages/superadmin/SuperAdminUserManagement";
import SuperAdminProfile from "./pages/superadmin/SuperAdminProfile";
import ServiceCategoriesManagement from "./pages/admin/ServiceCategoriesManagement";
import ServiceItems from "./pages/admin/ServiceItems";
import ServiceItemsCategory from "./pages/admin/ServiceItemsCategory";
import PropertyTypesManagement from "./pages/admin/PropertyTypesManagement";
import RoomTypesManagement from "./pages/admin/RoomTypesManagement";
import ServicePricingManagement from "./pages/admin/ServicePricingManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import OfferCodesManagement from "./pages/admin/OfferCodesManagement";
import ImpersonationBanner from "./components/ImpersonationBanner";
import Careers from "./pages/websitePages/Careers";
import Sitemap from "./pages/websitePages/Sitemap";
import WebsiteSettings from "./pages/superadmin/WebsiteSettings";
import SharedAppointmentView from "./pages/SharedAppointmentView";
import RedirectToPestControl from "./components/RedirectToPestControl";
import Home from "./pages/websitePages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GoogleMapsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <ImpersonationBanner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />

              {/* Public Shared Appointment Route - No authentication required */}
              <Route
                path="/shared-appointment/:token"
                element={<SharedAppointmentView />}
              />

              {/* frontend Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route path="" element={<Home />} />
                <Route
                  path="single-category/:category"
                  element={<SingleCategory />}
                />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="careers" element={<Careers />} />
                <Route path="sitemap" element={<Sitemap />} />
              </Route>

              {/* Order Confirmation - Standalone page with navbar */}
              <Route
                path="/order-confirmation"
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-details/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-booking/:bookingId"
                element={
                  <ProtectedRoute>
                    <ManageBooking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-support"
                element={
                  <ProtectedRoute>
                    <CustomerSupport />
                  </ProtectedRoute>
                }
              />
              <Route path="/payment-cancelled" element={<PaymentCancelled />} />

              <Route
                path="/service/:category"
                element={<ServiceLayout></ServiceLayout>}
              />
              <Route
                path="/service-item/:serviceSlug"
                element={<ServiceLayout></ServiceLayout>}
              />

              {/* Role-based Dashboard Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <NewAdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <AdminProtectedRoute>
                    <AdminAppointments />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/available-dates"
                element={
                  <AdminProtectedRoute>
                    <AdminAvailableDates />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/time-slots"
                element={
                  <AdminProtectedRoute>
                    <AdminTimeSlots />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/managers"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/tickets"
                element={<AppointmentManagement />}
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminProtectedRoute>
                    <AdminReports />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <AdminProtectedRoute>
                    <AdminSupport />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <AdminProtectedRoute>
                    <AdminProfile />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/service-categories"
                element={
                  <AdminProtectedRoute>
                    <ServiceCategoriesManagement />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/service-items"
                element={
                  <AdminProtectedRoute>
                    <ServiceItems />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/service-items-category"
                element={
                  <AdminProtectedRoute>
                    <ServiceItemsCategory />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/property-types"
                element={
                  <AdminProtectedRoute>
                    <PropertyTypesManagement />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/room-types"
                element={
                  <AdminProtectedRoute>
                    <RoomTypesManagement />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/service-pricing"
                element={
                  <AdminProtectedRoute>
                    <ServicePricingManagement />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/content"
                element={
                  <AdminProtectedRoute>
                    <ContentManagement />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/offer-codes"
                element={
                  <AdminProtectedRoute>
                    <OfferCodesManagement />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/administrator/website"
                element={
                  <SuperAdminProtectedRoute>
                    <WebsiteSettings />
                  </SuperAdminProtectedRoute>
                }
              />

              {/* Admin Dashboard - Redirect to role-based */}

              {/* Super Admin Routes */}
              <Route
                path="/administrator"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminDashboard />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="/administrator/apis"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminApiConfig />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="/administrator/users"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminUserManagement />
                  </SuperAdminProtectedRoute>
                }
              />
              <Route
                path="/administrator/profile"
                element={
                  <SuperAdminProtectedRoute>
                    <SuperAdminProfile />
                  </SuperAdminProtectedRoute>
                }
              />

              <Route path="/manager" element={<ManagerDashboard />} />
              <Route
                path="/manager/appointments"
                element={<AppointmentManagement />}
              />
              <Route path="/manager/services" element={<ServiceAreas />} />
              <Route
                path="/manager/tickets"
                element={<AppointmentManagement />}
              />
              <Route path="/manager/reports" element={<Dashboard />} />
              <Route path="/manager/profile" element={<ProfileSettings />} />

              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <NewUserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/locations"
                element={
                  <ProtectedRoute>
                    <UserLocations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/outstanding-payments"
                element={
                  <ProtectedRoute>
                    <OutstandingPayments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/appointments"
                element={
                  <ProtectedRoute>
                    <MyAppointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/addresses"
                element={
                  <ProtectedRoute>
                    <MyAddresses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Admin Route */}
              <Route
                path="/administrator"
                element={
                  <AdminProtectedRoute>
                    <NewAdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </GoogleMapsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
