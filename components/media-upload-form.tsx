"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MediaUploadForm({ testimonialId }: Readonly<{ testimonialId: string }>) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    department: "",
    treatmentTag: "",
    approvalStatus: "Pending",
    consentAttached: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!selectedFile) {
      setError("Actual file select karna required hai.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append("file", selectedFile);
    payload.append("department", formData.department);
    payload.append("treatmentTag", formData.treatmentTag);
    payload.append("approvalStatus", formData.approvalStatus);
    payload.append("consentAttached", formData.consentAttached ? "yes" : "no");

    const response = await fetch(`/api/testimonials/${testimonialId}/media`, {
      method: "POST",
      body: payload
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Media save nahi hua.");
      setSubmitting(false);
      return;
    }

    setSelectedFile(null);
    setFormData({
      department: "",
      treatmentTag: "",
      approvalStatus: "Pending",
      consentAttached: false
    });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="file">Upload file</label>
          <input
            id="file"
            required
            type="file"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <div className="field">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            value={formData.department}
            onChange={(event) =>
              setFormData((current) => ({ ...current, department: event.target.value }))
            }
          />
        </div>

        <div className="field">
          <label htmlFor="treatmentTag">Treatment tag</label>
          <input
            id="treatmentTag"
            value={formData.treatmentTag}
            onChange={(event) =>
              setFormData((current) => ({ ...current, treatmentTag: event.target.value }))
            }
          />
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

        <div className="field">
          <label htmlFor="consentAttached">Consent attached</label>
          <select
            id="consentAttached"
            value={formData.consentAttached ? "yes" : "no"}
            onChange={(event) =>
              setFormData((current) => ({
                ...current,
                consentAttached: event.target.value === "yes"
              }))
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      {error ? <p className="inline-note">{error}</p> : null}

      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Attach Media"}
        </button>
      </div>

      <p className="inline-note">
        Selected file: {selectedFile ? selectedFile.name : "No file selected"}
      </p>
    </form>
  );
}
