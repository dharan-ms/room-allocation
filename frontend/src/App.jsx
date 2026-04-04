import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import CategorySelection from "./pages/CategorySelection";
import AvailableRooms from "./pages/AvailableRooms";
import BookingSuccess from "./pages/BookingSuccess";
import MyBooking from "./pages/MyBooking";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute role="student">
            <CategorySelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms/:category"
        element={
          <ProtectedRoute role="student">
            <AvailableRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-success"
        element={
          <ProtectedRoute role="student">
            <BookingSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-booking"
        element={
          <ProtectedRoute role="student">
            <MyBooking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
