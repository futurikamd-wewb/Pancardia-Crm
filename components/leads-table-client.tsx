"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LeadListItem } from "@/lib/repositories/leads";

export function LeadsTableClient({ leads }: Readonly<{ leads: LeadListItem[] }>) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("All");

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        lead.patientName.toLowerCase().includes(normalizedQuery) ||
        lead.city.toLowerCase().includes(normalizedQuery) ||
        lead.treatmentInterest.toLowerCase().includes(normalizedQuery) ||
        lead.source.toLowerCase().includes(normalizedQuery);

      const matchesStage = stage === "All" || lead.pipelineStage === stage;
      return matchesQuery && matchesStage;
    });
  }, [leads, query, stage]);

  const stageOptions = ["All", ...new Set(leads.map((lead) => lead.pipelineStage))];

  return (
    <>
      <div className="form-grid" style={{ marginBottom: "18px" }}>
        <div className="field">
          <label htmlFor="leadSearch">Search leads</label>
          <input
            id="leadSearch"
            placeholder="Patient, city, treatment, source"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="leadStage">Filter by stage</label>
          <select id="leadStage" value={stage} onChange={(event) => setStage(event.target.value)}>
            {stageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Source</th>
            <th>Assignee</th>
            <th>Stage</th>
            <th>Next Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <strong>
                  <Link href={`/leads/${lead.id}`}>{lead.patientName}</Link>
                </strong>
                <div className="muted">
                  {lead.city} | {lead.treatmentInterest}
                </div>
              </td>
              <td>{lead.source}</td>
              <td>{lead.assignedTo}</td>
              <td>
                <span className="tag">{lead.pipelineStage}</span>
              </td>
              <td>{lead.nextFollowUp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

