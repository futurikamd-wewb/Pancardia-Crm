"use client";

import { useMemo, useState } from "react";
import { FollowUpForm } from "@/components/follow-up-form";
import { MediaAssetManager } from "@/components/media-asset-manager";
import { SectionCard } from "@/components/section-card";
import type { LeadDetailItem } from "@/lib/repositories/leads";

type LeadRecordTabsProps = {
  lead: LeadDetailItem;
};

type TabKey = "details" | "followups" | "media";

export function LeadRecordTabs({ lead }: Readonly<LeadRecordTabsProps>) {
  const [activeTab, setActiveTab] = useState<TabKey>("details");

  const groupedMedia = useMemo(
    () => ({
      image: lead.media.filter((item) => item.category === "image"),
      video: lead.media.filter((item) => item.category === "video"),
      document: lead.media.filter((item) => item.category === "document"),
      consent: lead.media.filter((item) => item.category === "consent")
    }),
    [lead.media]
  );

  return (
    <div className="section-stack">
      <div className="hero-actions">
        <button
          className={activeTab === "details" ? "pill-button" : "ghost-button"}
          onClick={() => setActiveTab("details")}
          type="button"
        >
          Details
        </button>
        <button
          className={activeTab === "followups" ? "pill-button" : "ghost-button"}
          onClick={() => setActiveTab("followups")}
          type="button"
        >
          Follow-ups
        </button>
        <button
          className={activeTab === "media" ? "pill-button" : "ghost-button"}
          onClick={() => setActiveTab("media")}
          type="button"
        >
          Media
        </button>
      </div>

      {activeTab === "details" ? (
        <SectionCard title="Patient Information" subtitle="Main patient and lead details">
          <div className="meta-grid">
            <div className="meta-card">
              <strong>Patient Name</strong>
              <div className="muted">{lead.patientName}</div>
            </div>
            <div className="meta-card">
              <strong>Phone</strong>
              <div className="muted">{lead.phone}</div>
            </div>
            <div className="meta-card">
              <strong>City</strong>
              <div className="muted">{lead.city}</div>
            </div>
            <div className="meta-card">
              <strong>Department / Treatment</strong>
              <div className="muted">{lead.treatmentInterest}</div>
            </div>
            <div className="meta-card">
              <strong>Source</strong>
              <div className="muted">{lead.source}</div>
            </div>
            <div className="meta-card">
              <strong>Assigned Counselor</strong>
              <div className="muted">{lead.assignedTo}</div>
            </div>
            <div className="meta-card">
              <strong>Status</strong>
              <div className="tag">{lead.status}</div>
            </div>
            <div className="meta-card">
              <strong>Pipeline Stage</strong>
              <div className="tag">{lead.pipelineStage}</div>
            </div>
            <div className="meta-card">
              <strong>Next Follow-up</strong>
              <div className="muted">{lead.nextFollowUp}</div>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "followups" ? (
        <>
          <SectionCard title="Follow-up Timeline" subtitle="All counseling notes in one place">
            <div className="list">
              {lead.notes.length ? (
                lead.notes.map((note) => (
                  <div className="list-item" key={note.id}>
                    <div>
                      <strong>{note.noteText}</strong>
                      <div className="muted">
                        {note.createdAt} | {note.nextFollowUp}
                      </div>
                    </div>
                    <span className="tag">{note.callOutcome}</span>
                  </div>
                ))
              ) : (
                <div className="list-item">
                  <div>
                    <strong>No follow-ups yet</strong>
                    <div className="muted">Add the first follow-up note below.</div>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Add Follow-up" subtitle="Update the patient form after every call">
            <FollowUpForm leadId={lead.id} />
          </SectionCard>
        </>
      ) : null}

      {activeTab === "media" ? (
        <div className="section-stack">
          <SectionCard title="Patient Media" subtitle="All patient files grouped by category">
            {lead.media.length ? (
              <div className="section-stack">
                {groupedMedia.image.length ? (
                  <SectionCard title="Images" subtitle="Photos and scans">
                    <MediaAssetManager assets={groupedMedia.image} />
                  </SectionCard>
                ) : null}

                {groupedMedia.video.length ? (
                  <SectionCard title="Videos" subtitle="Video testimonials and recordings">
                    <MediaAssetManager assets={groupedMedia.video} />
                  </SectionCard>
                ) : null}

                {groupedMedia.document.length ? (
                  <SectionCard title="Documents" subtitle="Reports and other files">
                    <MediaAssetManager assets={groupedMedia.document} />
                  </SectionCard>
                ) : null}

                {groupedMedia.consent.length ? (
                  <SectionCard title="Consent Files" subtitle="Consent-related media and proofs">
                    <MediaAssetManager assets={groupedMedia.consent} />
                  </SectionCard>
                ) : null}
              </div>
            ) : (
              <div className="list-item">
                <div>
                  <strong>No media for this patient yet</strong>
                  <div className="muted">Upload media from the testimonial/media workflow first.</div>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      ) : null}
    </div>
  );
}
