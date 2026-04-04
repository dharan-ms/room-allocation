import { Link, useNavigate } from "react-router-dom";
import { getStoredUser, logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    navigate(user?.role === "admin" ? "/admin/login" : "/login");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <img src="/logo.jpg" alt="Room Allocation Logo" className="brand-logo" />
        <span>Room Allocation</span>
      </div>
      <div className="nav-links">
        {user?.role === "student" && <Link to="/dashboard">Dashboard</Link>}
        {user?.role === "student" && <Link to="/my-booking">My Booking</Link>}
        {user?.role === "admin" && <Link to="/admin/dashboard">Admin Dashboard</Link>}
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
