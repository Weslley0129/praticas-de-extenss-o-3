import "./StatCard.css";

function StatCard({ rotulo, valor }) {
  return (
    <div className="stat-card">
      <span className="stat-card__rotulo">{rotulo}</span>
      <strong className="stat-card__valor">{valor}</strong>
    </div>
  );
}

export default StatCard;
