"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadOption = {
  id: string;
  label: string;
};

export function TestimonialRequestForm({ leads }: Readonly<{ leads: LeadOption[] }>) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    leadId: leads[0]?.id ?? "",
    testimonialType: "Video",
    requestStatus: "Requested",
    consentStatus: "Pending",
    approvalStatus: "Pending",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/testimonials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Request save nahi hua.");
      setSubmitting(false);
      return;
    }

    router.push("/testimonials");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="leadId">Patient lead</label>
          <select
            id="leadId"
            required
            value={formData.leadId}
            onChange={(event) => setFormData((current) => ({ ...current, leadId: event.target.value }))}
          >
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="testimonialType">Testimonial type</label>
          <select
            id="testimonialType"
            value={formData.testimonialType}
            onChange={(event) =>
              setFormData((current) => ({ ...current, testimonialType: event.target.value }))
            }
          >
            <option>Video</option>
            <option>Text</option>
            <option>Image</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="requestStatus">Request status</label>
          <select
            id="requestStatus"
            value={formData.requestStatus}
            onChange={(event) =>
              setFormData((current) => ({ ...current, requestStatus: event.target.value }))
            }
          >
            <option>Requested</option>
            <option>Pending Request</option>
            <option>Received</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="consentStatus">Consent status</label>
          <select
            id="consentStatus"
            value={formData.consentStatus}
            onChange={(event) =>
              setFormData((current) => ({ ...current, consentStatus: event.target.value }))
            }
          >
            <option>Pending</option>
            <option>Received</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="approvalStatus">Approval status</label>
          <select
            id="approvalStatus"
            value={formData.approvalStatus}
            onChange={(event) =>
              setFormData((current) => ({ ...current, approvalStatus: event.target.value }))
            }
          >
            <option>Pending</option>
            <option>Under Review</option>
            <option>Approved</option>
          </select>
        </div>

        <div className="field full">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Consent ka plan, patient comfort, doctor approval ya content instructions..."
          />
        </div>
      </div>

      {error ? <p className="inline-note">{error}</p> : null}

      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Create Request"}
        </button>
      </div>
    </form>
  );
}

