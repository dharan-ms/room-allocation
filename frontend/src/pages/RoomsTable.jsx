const RoomsTable = ({ rooms }) => {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Category</th>
            <th>Occupied</th>
            <th>Capacity</th>
            <th>Remaining</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNumber}</td>
              <td>{room.category}</td>
              <td>{room.occupied}</td>
              <td>{room.capacity}</td>
              <td>{room.remainingBeds}</td>
              <td>
                <span className={`badge ${room.isFull ? "full" : "available"}`}>{room.isFull ? "Full" : "Available"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomsTable;
