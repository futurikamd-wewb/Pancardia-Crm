type StatCardProps = {
  label: string;
  value: string;
  trend: string;
};

export function StatCard({ label, value, trend }: Readonly<StatCardProps>) {
  return (
    <section className="card">
      <div className="card-inner">
        <h3>{label}</h3>
        <div className="stat-value">{value}</div>
        <span className="stat-trend">{trend}</span>
      </div>
    </section>
  );
}

