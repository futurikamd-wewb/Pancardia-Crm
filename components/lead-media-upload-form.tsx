"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadMediaUploadFormProps = {
  leadId: string;
};

export function LeadMediaUploadForm({ leadId }: Readonly<LeadMediaUploadFormProps>) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState("");
  const [treatmentTag, setTreatmentTag] = useState("");
  const [doctorTag, setDoctorTag] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [consentAttached, setConsentAttached] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setMessage("Choose a file first.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("department", department);
      formData.append("treatmentTag", treatmentTag);
      formData.append("doctorTag", doctorTag);
      formData.append("approvalStatus", approvalStatus);
      formData.append("consentAttached", String(consentAttached));

      const response = await fetch(`/api/leads/${leadId}/media`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Upload failed");
      }

      setMessage("Media uploaded.");
      setFile(null);
      setDepartment("");
      setTreatmentTag("");
      setDoctorTag("");
      setApprovalStatus("Pending");
      setConsentAttached(false);
      event.currentTarget.reset();
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="crm-form" onSubmit={handleSubmit}>
      <div className="form-grid two-column">
        <label className="field field-full">
          <span className="field-label">Choose File</span>
          <input
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>

        <label className="field">
          <span className="field-label">Department</span>
          <input
            onChange={(event) => setDepartment(event.target.value)}
            placeholder="Cardiology"
            value={department}
          />
        </label>

        <label className="field">
          <span className="field-label">Treatment Tag</span>
          <input
            onChange={(event) => setTreatmentTag(event.target.value)}
            placeholder="Angioplasty"
            value={treatmentTag}
          />
        </label>

        <label className="field">
          <span className="field-label">Doctor Tag</span>
          <input
            onChange={(event) => setDoctorTag(event.target.value)}
            placeholder="Dr. Sharma"
            value={doctorTag}
          />
        </label>

        <label className="field">
          <span className="field-label">Approval</span>
          <select
            onChange={(event) => setApprovalStatus(event.target.value)}
            value={approvalStatus}
          >
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Consent Attached</span>
          <input
            checked={consentAttached}
            onChange={(event) => setConsentAttached(event.target.checked)}
            type="checkbox"
          />
        </label>
      </div>

      {message ? <p className="inline-note">{message}</p> : null}

      <div className="hero-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Uploading..." : "Upload Media"}
        </button>
      </div>
    </form>
  );
}
