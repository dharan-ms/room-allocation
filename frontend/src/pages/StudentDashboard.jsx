import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, categoryRes] = await Promise.all([api.get("/student/me"), api.get("/student/categories")]);
        setStudent(studentRes.data);
        setCategories(categoryRes.data.categories);

        if (categoryRes.data.noHostelRoomsAvailable) {
          setNotice("No hostel rooms available.");
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load dashboard."));
      }
    };
    fetchData();
  }, []);

  const handleSelectCategory = (category) => {
    navigate(`/rooms/${encodeURIComponent(category)}`);
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>Welcome, {student?.name || "Student"}</h1>
        {error && <p className="error">{error}</p>}
        {notice && <p className="warning">{notice}</p>}

        {student?.allocatedRoom ? (
          <div className="card booking-overview">
            <h2>Your Allocated Room</h2>
            <p>Room Number: {student.allocatedRoom.roomNumber}</p>
            <p>Category: {student.selectedCategory}</p>
            <p>Capacity: {student.allocatedRoom.capacity}</p>
            <p>Occupied Beds: {student.allocatedRoom.occupied}</p>
            <button className="btn btn-primary" onClick={() => navigate("/my-booking")}>
              View Full Booking
            </button>
          </div>
        ) : (
          <>
            <h2>Select a Category</h2>
            <div className="grid grid-3">
              {categories.map((item) => (
                <CategoryCard key={item.category} categoryData={item} onSelect={handleSelectCategory} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
