import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Dashboard from "../pages/dashboard/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import Residents from "../pages/residents/Residents";
import Flats from "../pages/flats/Flats";
import Complaints from "../pages/complaints/Complaints";
import Visitors from "../pages/visitors/Visitors";
import Notices from "../pages/notices/Notices";
import Facilities from "../pages/facilities/Facilities";
import EventBookings from "../pages/eventBookings/EventBookings";
import Users from "../pages/users/Users";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:resetToken"
        element={<ResetPassword />}
      />

      <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
      />

      <Route
        path="/residents"
        element={
            <ProtectedRoute>
                <Residents />
            </ProtectedRoute>
        }
      />

      <Route
        path="/flats"
        element={
            <ProtectedRoute>
                <Flats />
            </ProtectedRoute>
        }
      />

      <Route
        path="/complaints"
        element={
            <ProtectedRoute>
                <Complaints />
            </ProtectedRoute>
        }
      />

      <Route
        path="/visitors"
        element={
            <ProtectedRoute>
                <Visitors />
            </ProtectedRoute>
        }
      />

      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <Notices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/facilities"
        element={
          <ProtectedRoute>
            <Facilities />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event-bookings"
        element={
          <ProtectedRoute>
            <EventBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

    
    </Routes>
  );
}

export default AppRoutes;