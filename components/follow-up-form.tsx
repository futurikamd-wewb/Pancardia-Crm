"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FollowUpForm({ leadId }: Readonly<{ leadId: string }>) {
  const router = useRouter();
  const [noteText, setNoteText] = useState("");
  const [callOutcome, setCallOutcome] = useState("Interested");
  const [nextFollowUp, setNextFollowUp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/leads/${leadId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        noteText,
        callOutcome,
        nextFollowUp
      })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Follow-up save nahi hua.");
      setSubmitting(false);
      return;
    }

    setNoteText("");
    setCallOutcome("Interested");
    setNextFollowUp("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor="noteText">Call note</label>
          <textarea
            id="noteText"
            required
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="Patient se kya baat hui, next step kya hai, concern kya hai..."
          />
        </div>

        <div className="field">
          <label htmlFor="callOutcome">Call outcome</label>
          <select
            id="callOutcome"
            value={callOutcome}
            onChange={(event) => setCallOutcome(event.target.value)}
          >
            <option>Interested</option>
            <option>No Answer</option>
            <option>Call Back Later</option>
            <option>Appointment Confirmed</option>
            <option>Not Interested</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="nextFollowUp">Next follow-up</label>
          <input
            id="nextFollowUp"
            type="datetime-local"
            value={nextFollowUp}
            onChange={(event) => setNextFollowUp(event.target.value)}
          />
        </div>
      </div>

      {error ? <p className="inline-note">{error}</p> : null}

      <div className="form-actions">
        <button className="pill-button" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Add Follow-up"}
        </button>
      </div>
    </form>
  );
}

