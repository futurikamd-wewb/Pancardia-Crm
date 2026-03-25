"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LeadDetailActionsProps = {
  leadId: string;
};

export function LeadDetailActions({ leadId }: Readonly<LeadDetailActionsProps>) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/leads/${leadId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Patient Lead Form",
          url
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      window.alert("Link copied.");
    } catch {
      window.alert("Share failed.");
    }
  }

  function handleDownload() {
    window.print();
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this lead?");
    if (!confirmed) {
      return;
    }

    setBusy(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Delete failed");
      }

      router.push("/leads");
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="ghost-button" onClick={handleDownload} type="button">
        Download
      </button>
      <button className="ghost-button" onClick={handleShare} type="button">
        Share
      </button>
      <button className="ghost-button" disabled={busy} onClick={handleDelete} type="button">
        {busy ? "Deleting..." : "Delete"}
      </button>
    </>
  );
}
