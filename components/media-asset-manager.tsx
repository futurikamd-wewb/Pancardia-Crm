"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MediaAsset = {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  department: string;
  treatmentTag: string;
  approvalStatus: string;
  consentAttached: boolean;
};

type MediaAssetManagerProps = {
  assets: MediaAsset[];
};

type DraftState = Record<
  string,
  {
    department: string;
    treatmentTag: string;
    approvalStatus: string;
    consentAttached: boolean;
  }
>;

function isImage(fileType: string, fileUrl: string) {
  return fileType.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileUrl);
}

function isVideo(fileType: string, fileUrl: string) {
  return fileType.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(fileUrl);
}

export function MediaAssetManager({ assets }: Readonly<MediaAssetManagerProps>) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(assets[0]?.id ?? null);
  const [message, setMessage] = useState("");

  const [drafts, setDrafts] = useState<DraftState>(() =>
    Object.fromEntries(
      assets.map((asset) => [
        asset.id,
        {
          department: asset.department === "-" ? "" : asset.department,
          treatmentTag: asset.treatmentTag === "-" ? "" : asset.treatmentTag,
          approvalStatus: asset.approvalStatus,
          consentAttached: asset.consentAttached
        }
      ])
    )
  );

  const previewAsset = useMemo(
    () => assets.find((asset) => asset.id === previewId) ?? assets[0] ?? null,
    [assets, previewId]
  );

  async function handleDelete(assetId: string) {
    if (!window.confirm("Delete this media file?")) {
      return;
    }

    setBusyId(assetId);
    setMessage("");

    try {
      const response = await fetch(`/api/media/${assetId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Delete failed");
      }

      setMessage("Media deleted.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSave(assetId: string) {
    const draft = drafts[assetId];
    if (!draft) {
      return;
    }

    setBusyId(assetId);
    setMessage("");

    try {
      const response = await fetch(`/api/media/${assetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(draft)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Update failed");
      }

      setEditingId(null);
      setMessage("Media updated.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleShare(asset: MediaAsset) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: asset.fileName,
          text: asset.fileName,
          url: asset.fileUrl
        });
        setMessage("Share opened.");
        return;
      }

      await navigator.clipboard.writeText(asset.fileUrl);
      setMessage("Link copied.");
    } catch {
      setMessage("Share failed.");
    }
  }

  if (!assets.length) {
    return <p className="inline-note">No media uploaded yet.</p>;
  }

  return (
    <div className="section-stack">
      {previewAsset ? (
        <div className="meta-card">
          <strong>Preview</strong>
          <div className="muted" style={{ marginTop: 8, marginBottom: 12 }}>
            {previewAsset.fileName}
          </div>

          {isImage(previewAsset.fileType, previewAsset.fileUrl) ? (
            <img
              alt={previewAsset.fileName}
              src={previewAsset.fileUrl}
              style={{ width: "100%", maxHeight: 360, objectFit: "contain", borderRadius: 16 }}
            />
          ) : isVideo(previewAsset.fileType, previewAsset.fileUrl) ? (
            <video
              controls
              src={previewAsset.fileUrl}
              style={{ width: "100%", maxHeight: 360, borderRadius: 16 }}
            />
          ) : (
            <div className="list-item">
              <div>
                <strong>No inline preview</strong>
                <div className="muted">Use Open file or Share.</div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {message ? <p className="inline-note">{message}</p> : null}

      <div className="list">
        {assets.map((asset) => {
          const isEditing = editingId === asset.id;
          const draft = drafts[asset.id];

          return (
            <div className="list-item" key={asset.id} style={{ alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <strong>{asset.fileName}</strong>
                <div className="muted">
                  {asset.fileType} | {asset.department} | {asset.treatmentTag}
                </div>
                <div className="muted" style={{ marginTop: 8 }}>
                  <a href={asset.fileUrl} rel="noreferrer" target="_blank">
                    Open file
                  </a>
                </div>

                {isEditing && draft ? (
                  <div className="meta-grid" style={{ marginTop: 16 }}>
                    <label className="field">
                      <span className="field-label">Department</span>
                      <input
                        value={draft.department}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...current[asset.id],
                              department: event.target.value
                            }
                          }))
                        }
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Treatment Tag</span>
                      <input
                        value={draft.treatmentTag}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...current[asset.id],
                              treatmentTag: event.target.value
                            }
                          }))
                        }
                      />
                    </label>

                    <label className="field">
                      <span className="field-label">Approval</span>
                      <select
                        value={draft.approvalStatus}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...current[asset.id],
                              approvalStatus: event.target.value
                            }
                          }))
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </label>

                    <label className="field">
                      <span className="field-label">Consent Attached</span>
                      <input
                        checked={draft.consentAttached}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [asset.id]: {
                              ...current[asset.id],
                              consentAttached: event.target.checked
                            }
                          }))
                        }
                        type="checkbox"
                      />
                    </label>
                  </div>
                ) : null}
              </div>

              <div style={{ minWidth: 220 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button className="ghost-button" onClick={() => setPreviewId(asset.id)} type="button">
                    Preview
                  </button>

                  <button className="ghost-button" onClick={() => handleShare(asset)} type="button">
                    Share
                  </button>

                  {isEditing ? (
                    <>
                      <button
                        className="pill-button"
                        disabled={busyId === asset.id}
                        onClick={() => handleSave(asset.id)}
                        type="button"
                      >
                        {busyId === asset.id ? "Saving..." : "Save"}
                      </button>

                      <button className="ghost-button" onClick={() => setEditingId(null)} type="button">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="ghost-button" onClick={() => setEditingId(asset.id)} type="button">
                      Edit
                    </button>
                  )}

                  <button
                    className="ghost-button"
                    disabled={busyId === asset.id}
                    onClick={() => handleDelete(asset.id)}
                    type="button"
                  >
                    {busyId === asset.id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div style={{ marginTop: 12, textAlign: "right" }}>
                  <span className={`tag${asset.consentAttached ? "" : " danger"}`}>
                    {asset.consentAttached ? "Consent Attached" : "Consent Missing"}
                  </span>{" "}
                  <span className={`tag${asset.approvalStatus === "Approved" ? "" : " warn"}`}>
                    {asset.approvalStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
