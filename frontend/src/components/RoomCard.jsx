const RoomCard = ({ room, onBook }) => {
  const percentage = Math.round((room.occupied / room.capacity) * 100);
  const status = room.isFull ? "full" : room.remainingBeds <= 1 ? "almost-full" : "available";

  return (
    <div className="card room-card">
      <div className="card-top">
        <h3>{room.roomNumber}</h3>
        <span className={`badge ${status}`}>{room.isFull ? "Full" : room.remainingBeds <= 1 ? "Almost Full" : "Available"}</span>
      </div>
      <p>Category: {room.category}</p>
      <p>Occupied: {room.occupied} / {room.capacity}</p>
      <p>Remaining Beds: {room.remainingBeds}</p>

      <div className="progress-bar">
        <span style={{ width: `${percentage}%` }} />
      </div>

      <button className="btn btn-primary" onClick={() => onBook(room._id)} disabled={room.isFull}>
        Book This Room
      </button>
    </div>
  );
};

export default RoomCard;
