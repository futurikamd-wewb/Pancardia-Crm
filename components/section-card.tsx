export function SectionCard({
  title,
  subtitle,
  children
}: Readonly<{ title: string; subtitle?: string; children: React.ReactNode }>) {
  return (
    <section className="card">
      <div className="card-inner">
        <h3>{title}</h3>
        {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </section>
  );
}

