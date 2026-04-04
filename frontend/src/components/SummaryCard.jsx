const SummaryCard = ({ title, value, variant = "default" }) => {
  return (
    <div className={`summary-card ${variant}`}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
};

export default SummaryCard;
