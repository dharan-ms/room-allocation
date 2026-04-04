import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";

const AvailableRooms = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get(`/student/rooms/${encodeURIComponent(decodedCategory)}`);
        setRooms(response.data.rooms || []);
        setMessage(response.data.message || "");
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load rooms."));
      }
    };
    fetchRooms();
  }, [decodedCategory]);

  const handleBookRoom = async (roomId) => {
    try {
      const response = await api.post("/student/book-room", { roomId });
      navigate("/booking-success", { state: response.data.booking });
    } catch (err) {
      setError(getApiErrorMessage(err, "Booking failed."));
    }
  };

  return (
    <div className="page room-search-page">
      <Navbar />
      <div className="container">
        <h1>Available Rooms - {decodedCategory}</h1>
        {error && <p className="error">{error}</p>}
        {message && <p className="warning">{message}</p>}
        {!rooms.length && !error ? (
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            Choose Another Category
          </button>
        ) : (
          <>
            <div className="grid grid-3">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} onBook={handleBookRoom} />
              ))}
            </div>
            <button className="btn btn-secondary mt-2" onClick={() => navigate("/dashboard")}>
              Back to Categories
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;
