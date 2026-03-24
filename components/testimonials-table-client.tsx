"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { TestimonialListItem } from "@/lib/repositories/testimonials";

export function TestimonialsTableClient({
  testimonials
}: Readonly<{ testimonials: TestimonialListItem[] }>) {
  const [query, setQuery] = useState("");
  const [consent, setConsent] = useState("All");

  const filteredItems = useMemo(() => {
    return testimonials.filter((item) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        item.patientName.toLowerCase().includes(normalizedQuery) ||
        item.treatment.toLowerCase().includes(normalizedQuery) ||
        item.owner.toLowerCase().includes(normalizedQuery) ||
        item.type.toLowerCase().includes(normalizedQuery);

      const matchesConsent = consent === "All" || item.consent === consent;
      return matchesQuery && matchesConsent;
    });
  }, [testimonials, query, consent]);

  return (
    <>
      <div className="form-grid" style={{ marginBottom: "18px" }}>
        <div className="field">
          <label htmlFor="testimonialSearch">Search testimonials</label>
          <input
            id="testimonialSearch"
            placeholder="Patient, treatment, owner, type"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="testimonialConsent">Filter by consent</label>
          <select
            id="testimonialConsent"
            value={consent}
            onChange={(event) => setConsent(event.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Received</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Type</th>
            <th>Consent</th>
            <th>Approval</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>
                  <Link href={`/testimonials/${item.id}`}>{item.patientName}</Link>
                </strong>
                <div className="muted">{item.treatment}</div>
              </td>
              <td>{item.type}</td>
              <td>
                <span className={`tag${item.consent === "Pending" ? " danger" : ""}`}>
                  {item.consent}
                </span>
              </td>
              <td>
                <span className={`tag${item.approval === "Under Review" ? " warn" : ""}`}>
                  {item.approval}
                </span>
              </td>
              <td>{item.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

