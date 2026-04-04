import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const BookingSuccess = () => {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="page">
        <Navbar />
        <div className="container">
          <p className="warning">No booking information found.</p>
          <Link className="btn btn-primary" to="/dashboard">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="card booking-success-card">
          <h1>Booking Confirmed</h1>
          <p>Room Number: {state.roomNumber}</p>
          <p>Category: {state.category}</p>
          <p>Occupied Beds: {state.occupied}</p>
          <p>Total Capacity: {state.capacity}</p>
          <p>Remaining Beds: {state.remainingBeds}</p>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/my-booking">
              View My Booking
            </Link>
            <Link className="btn btn-secondary" to="/dashboard">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
