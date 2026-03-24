"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const genderOptions = ["Male", "Female", "Other"] as const;
const departmentOptions = [
  "General Medicine",
  "Cardiology",
  "General Surgery",
  "Onco Surgery",
  "Neurology",
  "Neuro Surgery",
  "Plastic Surgery",
  "Medical Gastroenterology",
  "Orthopaedics (Including Joint Replacement)",
  "Orthopedics",
  "Dermatology",
  "ENT",
  "Gynecology",
  "Pediatrics",
  "Oncology",
  "Radiology",
  "ICU",
  "Emergency",
  "Urology",
  "Nephrology",
  "Psychiatry"
] as const;
const visitTypeOptions = ["OPD", "IPD", "Emergency", "Teleconsultation"] as const;
const caseTypeOptions = [
  "Routine Checkup",
  "Emergency Case",
  "Surgery Case",
  "Critical Care",
  "Follow-up Case",
  "Accident / Trauma"
] as const;
const priorityOptions = ["Low", "Moderate", "High", "Urgent"] as const;
const sourceOptions = [
  "Walk-in",
  "Meta Lead Form",
  "Google Ads",
  "Website Form",
  "WhatsApp Campaign",
  "Call Center",
  "Doctor Referral"
] as const;

const initialState = {
  patientName: "",
  age: "",
  gender: "Male",
  phone: "",
  address: "",
  city: "",
  treatmentInterest: "General Medicine",
  doctorName: "",
  patientVisitType: "OPD",
  caseType: "Routine Checkup",
  conditionSeverity: "Low",
  bedWard: "",
  disease: "",
  treatmentPlan: "",
  visitDate: "",
  insurance: "",
  source: "Walk-in",
  assignedTo: "Pooja",
  status: "New",
  pipelineStage: "Inquiry",
  note: ""
};

function Section({
  title,
  children
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="intake-section">
      <div className="intake-head">
        <h4>{title}</h4>
      </div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

export function LeadIntakeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    if (attachment) {
      payload.append("attachment", attachment);
    }

    const response = await fetch("/api/leads", {
      method: "POST",
      body: payload
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Lead save nahi ho paya.");
      setSubmitting(false);
      return;
    }

    setFormData(initialState);
    setAttachment(null);
    router.push("/leads");
    router.refresh();
  }

  return (
    <form className="intake-form" onSubmit={handleSubmit}>
      <Section title="Patient Registration">
        <div className="field">
          <label htmlFor="patientName">Patient Name</label>
          <input
            id="patientName"
            required
            value={formData.patientName}
            onChange={(event) => setFormData((current) => ({ ...current, patientName: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            value={formData.age}
            onChange={(event) => setFormData((current) => ({ ...current, age: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(event) => setFormData((current) => ({ ...current, gender: event.target.value }))}
          >
            {genderOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            required
            value={formData.phone}
            onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
          />
        </div>
        <div className="field full">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            value={formData.address}
            onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            value={formData.city}
            onChange={(event) => setFormData((current) => ({ ...current, city: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="treatmentInterest">Department</label>
          <select
            id="treatmentInterest"
            value={formData.treatmentInterest}
            onChange={(event) =>
              setFormData((current) => ({ ...current, treatmentInterest: event.target.value }))
            }
          >
            {departmentOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="doctorName">Doctor Name</label>
          <input
            id="doctorName"
            value={formData.doctorName}
            onChange={(event) => setFormData((current) => ({ ...current, doctorName: event.target.value }))}
          />
        </div>
      </Section>

      <Section title="Case Setup">
        <div className="field">
          <label htmlFor="patientVisitType">Visit Type</label>
          <select
            id="patientVisitType"
            value={formData.patientVisitType}
            onChange={(event) =>
              setFormData((current) => ({ ...current, patientVisitType: event.target.value }))
            }
          >
            {visitTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="caseType">Case Type</label>
          <select
            id="caseType"
            value={formData.caseType}
            onChange={(event) => setFormData((current) => ({ ...current, caseType: event.target.value }))}
          >
            {caseTypeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="conditionSeverity">Priority</label>
          <select
            id="conditionSeverity"
            value={formData.conditionSeverity}
            onChange={(event) =>
              setFormData((current) => ({ ...current, conditionSeverity: event.target.value }))
            }
          >
            {priorityOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="bedWard">Bed / Ward</label>
          <input
            id="bedWard"
            value={formData.bedWard}
            onChange={(event) => setFormData((current) => ({ ...current, bedWard: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="disease">Disease</label>
          <input
            id="disease"
            value={formData.disease}
            onChange={(event) => setFormData((current) => ({ ...current, disease: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="treatmentPlan">Treatment</label>
          <input
            id="treatmentPlan"
            value={formData.treatmentPlan}
            onChange={(event) =>
              setFormData((current) => ({ ...current, treatmentPlan: event.target.value }))
            }
          />
        </div>
      </Section>

      <Section title="Visit and CRM">
        <div className="field">
          <label htmlFor="visitDate">Date</label>
          <input
            id="visitDate"
            type="date"
            value={formData.visitDate}
            onChange={(event) => setFormData((current) => ({ ...current, visitDate: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="insurance">Insurance</label>
          <input
            id="insurance"
            value={formData.insurance}
            onChange={(event) => setFormData((current) => ({ ...current, insurance: event.target.value }))}
          />
        </div>
        <div className="field">
          <label htmlFor="source">Source</label>
          <select
            id="source"
            value={formData.source}
            onChange={(event) => setFormData((current) => ({ ...current, source: event.target.value }))}
          >
            {sourceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="assignedTo">Assigned Counselor</label>
          <input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(event) =>
              setFormData((current) => ({ ...current, assignedTo: event.target.value }))
            }
            placeholder="Enter counselor name"
          />
        </div>
        <div className="field">
          <label htmlFor="status">Lead Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Follow-up Due</option>
            <option>Appointment Booked</option>
            <option>Visited</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="pipelineStage">Pipeline Stage</label>
          <select
            id="pipelineStage"
            value={formData.pipelineStage}
            onChange={(event) =>
              setFormData((current) => ({ ...current, pipelineStage: event.target.value }))
            }
          >
            <option>Inquiry</option>
            <option>Consultation Booked</option>
            <option>Visited Hospital</option>
            <option>Treatment Started</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="note">Notes</label>
          <textarea
            id="note"
            placeholder="Notes"
            value={formData.note}
            onChange={(event) => setFormData((current) => ({ ...current, note: event.target.value }))}
          />
        </div>
        <div className="field full">
          <label htmlFor="attachment">Choose Files</label>
          <input
            id="attachment"
            type="file"
            onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
          />
        </div>
      </Section>

      {error ? <p className="inline-note">{error}</p> : null}

      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save Patient"}
        </button>
      </div>
    </form>
  );
}
