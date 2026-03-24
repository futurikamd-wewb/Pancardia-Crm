"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TestimonialDetailItem } from "@/lib/repositories/testimonials";

export function TestimonialEditForm({ testimonial }: Readonly<{ testimonial: TestimonialDetailItem }>) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: testimonial.type,
    requestStatus: testimonial.requestStatus,
    consent: testimonial.consent,
    approval: testimonial.approval,
    publicationStatus: testimonial.publicationStatus,
    owner: testimonial.owner,
    notes: testimonial.notes
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/testimonials/${testimonial.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Testimonial update nahi hua.");
      setSubmitting(false);
      return;
    }

    router.push(`/testimonials/${testimonial.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" value={formData.type} onChange={(e) => setFormData((c) => ({ ...c, type: e.target.value }))}>
            <option>Video</option>
            <option>Text</option>
            <option>Image</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="requestStatus">Request status</label>
          <select id="requestStatus" value={formData.requestStatus} onChange={(e) => setFormData((c) => ({ ...c, requestStatus: e.target.value }))}>
            <option>Pending Request</option>
            <option>Requested</option>
            <option>Received</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="consent">Consent</label>
          <select id="consent" value={formData.consent} onChange={(e) => setFormData((c) => ({ ...c, consent: e.target.value }))}>
            <option>Pending</option>
            <option>Received</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="approval">Approval</label>
          <select id="approval" value={formData.approval} onChange={(e) => setFormData((c) => ({ ...c, approval: e.target.value }))}>
            <option>Pending</option>
            <option>Under Review</option>
            <option>Approved</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="publicationStatus">Publication</label>
          <select id="publicationStatus" value={formData.publicationStatus} onChange={(e) => setFormData((c) => ({ ...c, publicationStatus: e.target.value }))}>
            <option>Draft</option>
            <option>Ready</option>
            <option>Published</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="owner">Owner</label>
          <input id="owner" value={formData.owner} onChange={(e) => setFormData((c) => ({ ...c, owner: e.target.value }))} />
        </div>
        <div className="field full">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={formData.notes} onChange={(e) => setFormData((c) => ({ ...c, notes: e.target.value }))} />
        </div>
      </div>
      {error ? <p className="inline-note">{error}</p> : null}
      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save Testimonial"}
        </button>
      </div>
    </form>
  );
}
