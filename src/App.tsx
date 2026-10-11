import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import StyleGuide from './pages/StyleGuide'
import Home from './pages/Home'
import AuthHub from './pages/AuthHub'
import StallHolderAuth from './pages/StallHolderAuth'
import OrganizerAuth from './pages/OrganizerAuth'
import ForgotPassword from './pages/ForgotPassword'
import Onboarding from './pages/Onboarding'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import VendorDashboard from './pages/vendor/Dashboard'
import VendorProfile from './pages/vendor/Profile'
import VendorEvents from './pages/vendor/Events'
import VendorEventDetails from './pages/vendor/EventDetails'
import VendorStallDetails from './pages/vendor/StallDetails'
import VendorBookings from './pages/vendor/Bookings'
import VendorBudgetFinder from './pages/vendor/BudgetFinder'
import OrganizerDashboard from './pages/organizer/Dashboard'
import OrganizerProfile from './pages/organizer/Profile'
import OrganizerEvents from './pages/organizer/Events'
import OrganizerCreateEvent from './pages/organizer/CreateEvent'
import OrganizerFloorPlanEditor from './pages/organizer/FloorPlanEditor'
import OrganizerBookingRequests from './pages/organizer/BookingRequests'
import OrganizerAnalytics from './pages/organizer/Analytics'
import OrganizerAuditHistory from './pages/organizer/AuditHistory'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg text-text">
          <Routes>
            <Route path="/styleguide" element={<StyleGuide />} />
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <Home />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/auth"
              element={
                <PublicOnlyRoute>
                  <AuthHub />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/auth/stallholder"
              element={
                <PublicOnlyRoute>
                  <StallHolderAuth />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/auth/organizer"
              element={
                <PublicOnlyRoute>
                  <OrganizerAuth />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              }
            />
          
          {/* Mandatory Onboarding for all new users */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute allowIncompleteProfile>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Vendor Protected Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/events"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/events/:eventId"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorEventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/events/:eventId/stalls/:stallId"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorStallDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/events/:eventId/budget-finder"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorBudgetFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/bookings"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/profile"
            element={
              <ProtectedRoute requiredRole="VENDOR">
                <VendorProfile />
              </ProtectedRoute>
            }
          />

          {/* Organizer Protected Routes */}
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/create"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerCreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId/edit"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerCreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:eventId/floor-plan"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerFloorPlanEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/bookings"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerBookingRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/analytics"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/audit-history"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerAuditHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/profile"
            element={
              <ProtectedRoute requiredRole="ORGANIZER">
                <OrganizerProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  </AuthProvider>
)
}

export default App
