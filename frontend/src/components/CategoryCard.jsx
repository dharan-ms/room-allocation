const CategoryCard = ({ categoryData, onSelect }) => {
  const { category, roomCount, roomType, totalBeds, availableBeds, status } = categoryData;
  const statusClass = status.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="card category-card">
      <div className="card-top">
        <h3>{category}</h3>
        <span className={`badge ${statusClass}`}>{status}</span>
      </div>
      <p>Rooms: {roomCount}</p>
      <p>Room Type: {roomType}</p>
      <p>Total Beds: {totalBeds}</p>
      <p>Available Beds: {availableBeds}</p>
      <button className="btn btn-primary" onClick={() => onSelect(category)} disabled={availableBeds === 0}>
        View Available Rooms
      </button>
    </div>
  );
};

export default CategoryCard;
