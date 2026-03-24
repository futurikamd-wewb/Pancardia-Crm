"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LeadDetailItem } from "@/lib/repositories/leads";

export function LeadEditForm({ lead }: Readonly<{ lead: LeadDetailItem }>) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: lead.patientName,
    phone: lead.phone,
    city: lead.city,
    treatmentInterest: lead.treatmentInterest,
    source: lead.source,
    assignedTo: lead.assignedTo,
    status: lead.status,
    pipelineStage: lead.pipelineStage,
    nextFollowUp: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/leads/${lead.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Lead update nahi hua.");
      setSubmitting(false);
      return;
    }

    router.push(`/leads/${lead.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="patientName">Patient name</label>
          <input id="patientName" value={formData.patientName} onChange={(e) => setFormData((c) => ({ ...c, patientName: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" value={formData.phone} onChange={(e) => setFormData((c) => ({ ...c, phone: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" value={formData.city} onChange={(e) => setFormData((c) => ({ ...c, city: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="treatmentInterest">Treatment</label>
          <input id="treatmentInterest" value={formData.treatmentInterest} onChange={(e) => setFormData((c) => ({ ...c, treatmentInterest: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="source">Source</label>
          <input id="source" value={formData.source} onChange={(e) => setFormData((c) => ({ ...c, source: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="assignedTo">Assigned to</label>
          <input id="assignedTo" value={formData.assignedTo} onChange={(e) => setFormData((c) => ({ ...c, assignedTo: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={formData.status} onChange={(e) => setFormData((c) => ({ ...c, status: e.target.value }))}>
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-up Due</option>
            <option>Appointment Booked</option>
            <option>Visited</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="pipelineStage">Pipeline stage</label>
          <select id="pipelineStage" value={formData.pipelineStage} onChange={(e) => setFormData((c) => ({ ...c, pipelineStage: e.target.value }))}>
            <option>Inquiry</option>
            <option>Consultation Booked</option>
            <option>Visited Hospital</option>
            <option>Treatment Started</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="nextFollowUp">Next follow-up</label>
          <input id="nextFollowUp" placeholder={lead.nextFollowUp} value={formData.nextFollowUp} onChange={(e) => setFormData((c) => ({ ...c, nextFollowUp: e.target.value }))} />
        </div>
      </div>
      {error ? <p className="inline-note">{error}</p> : null}
      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save Lead"}
        </button>
      </div>
    </form>
  );
}
