import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import api, { getApiErrorMessage } from "../api/axios";
import RoomsTable from "./RoomsTable";
import StudentsTable from "./StudentsTable";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const fetchDashboard = async () => {
    try {
      const [summaryRes, roomsRes, studentsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/rooms", { params: { category, status } }),
        api.get("/admin/students", { params: { search } })
      ]);

      setSummary(summaryRes.data);
      setRooms(roomsRes.data.rooms);
      setStudents(studentsRes.data.students);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load admin dashboard."));
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [category, status]);

  const handleResetDemoData = async () => {
    const confirmReset = window.confirm(
      "This will remove all students and reset all room occupancies. Do you want to continue?"
    );
    if (!confirmReset) return;

    try {
      setResetLoading(true);
      setError("");
      setResetMessage("");
      const response = await api.post("/admin/reset-demo-data");
      setResetMessage(response.data.message);
      await fetchDashboard();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to reset demo data."));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1>Admin Dashboard</h1>
        {error && <p className="error">{error}</p>}
        {resetMessage && <p className="warning">{resetMessage}</p>}
        <div className="btn-row">
          <button className="btn btn-secondary" onClick={handleResetDemoData} disabled={resetLoading}>
            {resetLoading ? "Resetting..." : "Reset Demo Data"}
          </button>
        </div>

        {summary && (
          <div className="grid grid-5">
            <SummaryCard title="Total Rooms" value={summary.totalRooms} />
            <SummaryCard title="Total Categories" value={summary.totalCategories} />
            <SummaryCard title="Allocated Students" value={summary.totalAllocatedStudents} variant="success" />
            <SummaryCard title="Available Rooms" value={summary.availableRooms} variant="warning" />
            <SummaryCard title="Full Rooms" value={summary.fullRooms} variant="danger" />
          </div>
        )}

        <div className="card filters">
          <h3>Filter Rooms</h3>
          <div className="filter-row">
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All Categories</option>
              <option value="Non AC 6 Sharing">Non AC 6 Sharing</option>
              <option value="AC 6 Sharing">AC 6 Sharing</option>
              <option value="Non AC 4 Sharing">Non AC 4 Sharing</option>
              <option value="AC 4 Sharing">AC 4 Sharing</option>
              <option value="AC 3 Sharing">AC 3 Sharing</option>
            </select>

            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
            </select>
            <button className="btn btn-secondary" onClick={fetchDashboard}>
              Apply Filters
            </button>
          </div>
        </div>

        <h2>All Rooms</h2>
        <RoomsTable rooms={rooms} />

        <div className="card filters mt-2">
          <h3>Search Students</h3>
          <div className="filter-row">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="btn btn-secondary" onClick={fetchDashboard}>
              Search
            </button>
          </div>
        </div>

        <h2>All Students</h2>
        <StudentsTable students={students} />

        <h2>Full Rooms Only</h2>
        <RoomsTable rooms={rooms.filter((room) => room.isFull)} />
      </div>
    </div>
  );
};

export default AdminDashboard;
