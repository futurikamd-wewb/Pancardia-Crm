import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/lib/repositories/dashboard";

export default async function HomePage() {
  const { stats, freshLeads, followUps, queue } = await getDashboardData();

  return (
    <DashboardShell activePath="/">
      <section className="page-banner">
        <span className="eyebrow">Pancardia Multisuperspecility Hospital</span>
        <h2>Central patient acquisition and counseling dashboard</h2>
        <p>
          Is workspace ka purpose hai digital inquiries ko clean patient records me convert karna,
          counselor follow-ups track karna, aur testimonial workflow ko controlled rakhna.
        </p>
      </section>

      <section className="hero">
        <div>
          <span className="eyebrow">Command Center</span>
          <h2>Pancardia ke leads ko clean patient pipeline me manage karo.</h2>
          <p>
            Marketing, reception, counselor aur content team ke liye yeh ek shared operational CRM
            dashboard hai.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="pill-button" href="/leads">
            Open Leads Board
          </Link>
          <Link className="ghost-button" href="/testimonials">
            Review Testimonials
          </Link>
        </div>
      </section>

      <section className="grid stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid content-grid">
        <SectionCard
          title="Recent Patient Leads"
          subtitle="Latest inquiries jin par counseling team ko immediately action lena chahiye."
        >
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Treatment</th>
                <th>Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {freshLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong>{lead.patientName}</strong>
                    <div className="muted">{lead.phone}</div>
                  </td>
                  <td>{lead.treatmentInterest}</td>
                  <td>{lead.source}</td>
                  <td>
                    <span className="tag">{lead.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        <div className="section-stack">
          <SectionCard title="Today Follow-ups" subtitle="Callback discipline aur patient response time improve karo.">
            <div className="list">
              {followUps.map((item) => (
                <div className="list-item" key={item.id}>
                  <div>
                    <strong>{item.patientName}</strong>
                    <div className="muted">
                      {item.time} | {item.owner}
                    </div>
                  </div>
                  <span className={`tag${item.priority === "High" ? " warn" : ""}`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Testimonial Queue"
            subtitle="Approved patient stories aur pending consent cases ko yahan monitor karo."
          >
            <div className="list">
              {queue.map((item) => (
                <div className="list-item" key={item.id}>
                  <div>
                    <strong>{item.patientName}</strong>
                    <div className="muted">
                      {item.type} | {item.doctor}
                    </div>
                  </div>
                  <span
                    className={`tag${
                      item.status === "Consent Pending"
                        ? " danger"
                        : item.status === "Under Review"
                          ? " warn"
                          : ""
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>
    </DashboardShell>
  );
}
