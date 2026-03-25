"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadEditFormProps = {
  lead: {
    id: string;
    patientName: string;
    phone: string;
    city: string;
    treatmentInterest: string;
    source: string;
    assignedTo: string;
    status: string;
    pipelineStage: string;
    nextFollowUp: string;
  };
};

export function LeadEditForm({ lead }: Readonly<LeadEditFormProps>) {
  const router = useRouter();

  const [patientName, setPatientName] = useState(lead.patientName);
  const [phone, setPhone] = useState(lead.phone);
  const [city, setCity] = useState(lead.city === "-" ? "" : lead.city);
  const [treatmentInterest, setTreatmentInterest] = useState(
    lead.treatmentInterest === "-" ? "" : lead.treatmentInterest
  );
  const [status, setStatus] = useState(lead.status);
  const [pipelineStage, setPipelineStage] = useState(lead.pipelineStage);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientName,
          phone,
          city,
          treatmentInterest,
          status,
          pipelineStage
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Update failed");
      }

      setMessage("Lead updated.");
      router.push(`/leads/${lead.id}`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="crm-form" onSubmit={handleSubmit}>
      <div className="form-grid two-column">
        <label className="field">
          <span className="field-label">Patient Name</span>
          <input value={patientName} onChange={(event) => setPatientName(event.target.value)} />
        </label>

        <label className="field">
          <span className="field-label">Phone</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>

        <label className="field">
          <span className="field-label">City</span>
          <input value={city} onChange={(event) => setCity(event.target.value)} />
        </label>

        <label className="field">
          <span className="field-label">Department / Treatment</span>
          <input
            value={treatmentInterest}
            onChange={(event) => setTreatmentInterest(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up Scheduled">Follow-up Scheduled</option>
            <option value="Qualified">Qualified</option>
            <option value="Closed">Closed</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Pipeline Stage</span>
          <select value={pipelineStage} onChange={(event) => setPipelineStage(event.target.value)}>
            <option value="Inquiry">Inquiry</option>
            <option value="Consultation Booked">Consultation Booked</option>
            <option value="Visited Hospital">Visited Hospital</option>
            <option value="Treatment Started">Treatment Started</option>
            <option value="Closed">Closed</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Source</span>
          <input disabled value={lead.source} />
        </label>

        <label className="field">
          <span className="field-label">Assigned Counselor</span>
          <input disabled value={lead.assignedTo} />
        </label>

        <label className="field field-full">
          <span className="field-label">Next Follow-up</span>
          <input disabled value={lead.nextFollowUp} />
        </label>
      </div>

      {message ? <p className="inline-note">{message}</p> : null}

      <div className="hero-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
