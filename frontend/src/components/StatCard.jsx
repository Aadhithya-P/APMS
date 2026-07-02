function StatCard({ title, value }) {
  return (
    <div
      className="bg-white p-4 rounded shadow-sm h-100"
      style={{
        borderRadius: "16px",
        transition: "0.3s",
      }}
    >
      <div className="text-muted mb-2">
        {title}
      </div>

      <h2 className="fw-bold mb-0">
        {value}
      </h2>
    </div>
  );
}

export default StatCard;