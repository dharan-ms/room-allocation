import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api, { getApiErrorMessage } from "../api/axios";

const MyBooking = () => {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get("/student/my-booking");
        setBooking(response.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to fetch booking details."));
      }
    };
    fetchBooking();
  }, []);

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>My Booking</h1>
        {error && <p className="warning">{error}</p>}
        {booking && (
          <div className="card booking-overview">
            <p>Student: {booking.studentName}</p>
            <p>Category: {booking.category}</p>
            <p>Room Number: {booking.room.roomNumber}</p>
            <p>Occupied Beds: {booking.room.occupied}</p>
            <p>Total Capacity: {booking.room.capacity}</p>
            <p className={`badge ${booking.room.isFull ? "full" : "available"}`}>
              {booking.room.isFull ? "Full" : "Active Booking"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
