"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadSimple, Trash, ArrowLeft, WarningCircle, CheckCircle,
  FilePdf, FileDoc, FileXls, FileImage, FileText, MusicNotes, File,
} from "@phosphor-icons/react";
import "./LeadFilesAdd.scss";
/* ──────────────────────────────────────────────────────────
   API DEFINITION (top) — edit BASE_URL / endpoints as needed
   ────────────────────────────────────────────────────────── */

// const API_BASE = "http://localhost:8000/api";
const API_BASE = "https://backend.liaisonbank.com/api";

const AUTH_HEADER = () => {
  // Adjust to however your frontend stores the token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const DOCUMENT_TYPES = [
  { value: "invoice",       label: "Invoice" },
  { value: "contract",      label: "Contract" },
  { value: "proposal",      label: "Proposal" },
  { value: "id_proof",      label: "ID Proof" },
  { value: "address_proof", label: "Address Proof" },
  { value: "kyc",           label: "KYC Document" },
  { value: "quotation",     label: "Quotation" },
  { value: "receipt",       label: "Receipt" },
  { value: "other",         label: "Other" },
];

export const RECORDING_TYPES = [
  { value: "call",        label: "Call Recording" },
  { value: "meeting",     label: "Meeting Recording" },
  { value: "voice_note",  label: "Voice Note" },
  { value: "video",       label: "Video Recording" },
  { value: "other",       label: "Other" },
];

const DOCUMENT_EXTS = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "zip", "rar"];
const RECORDING_EXTS = ["mp3", "wav", "m4a", "ogg", "mp4", "mov", "mkv", "webm"];

const extOf = (name = "") => name.split(".").pop()?.toLowerCase() || "";

export const fileKind = (file) => {
  if (!file) return "document";
  if (file.recording_type) return "recording";
  if (file.document_type) return "document";
  const ext = extOf(file.file_name || file.name || "");
  if (RECORDING_EXTS.includes(ext)) return "recording";
  return "document";
};

export const fileTypeLabel = (file) => {
  if (!file) return "";
  const kind = fileKind(file);
  const list = kind === "recording" ? RECORDING_TYPES : DOCUMENT_TYPES;
  const val = kind === "recording" ? file.recording_type : file.document_type;
  return list.find((t) => t.value === val)?.label || "—";
};

export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

export const leadFilesApi = {
  async uploadBatch({
    documents = [],
    recordings = [],
    document_type,
    recording_type,
    title,
    description,
  }) {
    const fd = new FormData();
    documents.forEach((f) => fd.append("documents", f));
    recordings.forEach((f) => fd.append("recordings", f));
    if (document_type) fd.append("document_type", document_type);
    if (recording_type) fd.append("recording_type", recording_type);
    if (title) fd.append("title", title);
    if (description) fd.append("description", description);

    const res = await fetch(`${API_BASE}/lead-files`, {
      method: "POST",
      headers: { ...AUTH_HEADER() },
      body: fd,
    });

    if (!res.ok) {
      let msg = `Upload failed (${res.status})`;
      try {
        const data = await res.json();
        msg = data.detail || data.error || JSON.stringify(data);
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }
    return res.json();
  },
};

/* ──────────────────────────────────────────────────────────
   UI COMPONENTS
   ────────────────────────────────────────────────────────── */

function DocIcon({ ext, size = 20 }) {
  const e = (ext || "").toLowerCase();
  if (e === "pdf") return <FilePdf size={size} weight="duotone" />;
  if (e === "doc" || e === "docx") return <FileDoc size={size} weight="duotone" />;
  if (e === "xls" || e === "xlsx") return <FileXls size={size} weight="duotone" />;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(e))
    return <FileImage size={size} weight="duotone" />;
  if (["txt", "csv"].includes(e)) return <FileText size={size} weight="duotone" />;
  return <File size={size} weight="duotone" />;
}

const keyOf = (f) => `${f.name}:${f.size}:${f.lastModified ?? 0}`;

/* ──────────────────────────────────────────────────────────
   MAIN COMPONENT (Add only)
   ────────────────────────────────────────────────────────── */

export default function LeadFilesAdd({ isDarkMode = false }) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const [docFiles, setDocFiles] = useState([]);
  const [recFiles, setRecFiles] = useState([]);
  const [docType, setDocType] = useState("");
  const [recType, setRecType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [docDrag, setDocDrag] = useState(false);
  const [recDrag, setRecDrag] = useState(false);

  const addDocFiles = (incoming) => {
    setDocFiles((prev) => {
      const seen = new Set(prev.map(keyOf));
      const next = [...prev];
      for (const f of incoming) {
        const k = keyOf(f);
        if (!seen.has(k)) {
          seen.add(k);
          next.push(f);
        }
      }
      return next;
    });
  };

  const addRecFiles = (incoming) => {
    setRecFiles((prev) => {
      const seen = new Set(prev.map(keyOf));
      const next = [...prev];
      for (const f of incoming) {
        const k = keyOf(f);
        if (!seen.has(k)) {
          seen.add(k);
          next.push(f);
        }
      }
      return next;
    });
  };

  const removeDocAt = (i) => setDocFiles((prev) => prev.filter((_, idx) => idx !== i));
  const removeRecAt = (i) => setRecFiles((prev) => prev.filter((_, idx) => idx !== i));

  const onUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (docFiles.length === 0 && recFiles.length === 0) {
      setError("Pick at least one document or one recording.");
      return;
    }

    setSaving(true);
    try {
      const res = await leadFilesApi.uploadBatch({
        documents: docFiles,
        recordings: recFiles,
        document_type: docType || undefined,
        recording_type: recType || undefined,
        title: title || undefined,
        description: description || undefined,
      });
      setSuccess(res);
      setDocFiles([]);
      setRecFiles([]);
      setTitle("");
      setDescription("");
      setDocType("");
      setRecType("");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const totalFiles = docFiles.length + recFiles.length;

  return (
    <div className={`lf-page ${isDarkMode ? "dark" : ""}`}>
      
      {error && (
        <div className="lf-alert error">
          <WarningCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="lf-alert ok">
          <CheckCircle size={18} />
          <div>
            <strong>Upload complete.</strong> {success.created} saved,{" "}
            {success.failed} failed.
            {Array.isArray(success.items) && (
              <ul className="lf-batch-results">
                {success.items.map((it, i) => (
                  <li key={i} className={it.ok ? "ok" : "err"}>
                    {it.ok ? "✓" : "✗"} <code>{it.filename}</code>
                    {it.ok && it.file && (
                      <>
                        {" "}→{" "}
                        <span className={`lf-pill ${fileKind(it.file)}`}>
                          {fileKind(it.file)}
                        </span>{" "}
                        {fileTypeLabel(it.file)}
                      </>
                    )}
                    {!it.ok && <> — {it.error}</>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <form className="lf-form" onSubmit={onUpload}>
        <div className="lf-form-row">
          <label>
            Title (applied to all files)
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              placeholder="optional"
            />
          </label>
          <label>
            Description (applied to all files)
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="optional"
            />
          </label>
        </div>

        <div className="lf-two-col">
          {/* Documents */}
          <section
            className={`lf-upload-block ${docDrag ? "is-drag" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDocDrag(true);
            }}
            onDragLeave={() => setDocDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDocDrag(false);
              addDocFiles(Array.from(e.dataTransfer.files || []));
            }}
          >
            <h3>
              <FileText size={18} /> Documents
            </h3>
            <p className="lf-hint">
              PDF, DOCX, XLSX, images, PPTX, TXT, CSV, ZIP… (drop files here or
              choose — you can add more in rounds)
            </p>
            <label className="lf-file-input">
              <UploadSimple size={18} /> Add document files
              <input
                type="file"
                multiple
                onChange={(e) => {
                  addDocFiles(Array.from(e.target.files || []));
                  e.target.value = "";
                }}
              />
            </label>
            <label>
              Type (optional — inferred if blank)
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="">— infer from filename —</option>
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            {docFiles.length > 0 && (
              <>
                <div className="lf-file-list-header">
                  <span>{docFiles.length} document(s) selected</span>
                  <button
                    type="button"
                    className="lf-link-btn"
                    onClick={() => setDocFiles([])}
                  >
                    Clear all
                  </button>
                </div>
                <ul className="lf-file-list">
                  {docFiles.map((f, i) => (
                    <li key={keyOf(f) + ":" + i}>
                      <DocIcon ext={f.name.split(".").pop() || ""} />
                      <span className="name">{f.name}</span>
                      <span className="size">{formatBytes(f.size)}</span>
                      <button
                        type="button"
                        className="lf-icon-btn danger"
                        onClick={() => removeDocAt(i)}
                        title="Remove"
                      >
                        <Trash size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* Recordings */}
          <section
            className={`lf-upload-block ${recDrag ? "is-drag" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setRecDrag(true);
            }}
            onDragLeave={() => setRecDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setRecDrag(false);
              addRecFiles(Array.from(e.dataTransfer.files || []));
            }}
          >
            <h3>
              <MusicNotes size={18} /> Recordings
            </h3>
            <p className="lf-hint">
              MP3, WAV, M4A, MP4, MOV, MKV… (drop files here or choose — you can
              add more in rounds)
            </p>
            <label className="lf-file-input">
              <UploadSimple size={18} /> Add recording files
              <input
                type="file"
                multiple
                onChange={(e) => {
                  addRecFiles(Array.from(e.target.files || []));
                  e.target.value = "";
                }}
              />
            </label>
            <label>
              Type (optional — inferred if blank)
              <select value={recType} onChange={(e) => setRecType(e.target.value)}>
                <option value="">— infer from filename —</option>
                {RECORDING_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            {recFiles.length > 0 && (
              <>
                <div className="lf-file-list-header">
                  <span>{recFiles.length} recording(s) selected</span>
                  <button
                    type="button"
                    className="lf-link-btn"
                    onClick={() => setRecFiles([])}
                  >
                    Clear all
                  </button>
                </div>
                <ul className="lf-file-list">
                  {recFiles.map((f, i) => (
                    <li key={keyOf(f) + ":" + i}>
                      <MusicNotes size={18} />
                      <span className="name">{f.name}</span>
                      <span className="size">{formatBytes(f.size)}</span>
                      <button
                        type="button"
                        className="lf-icon-btn danger"
                        onClick={() => removeRecAt(i)}
                        title="Remove"
                      >
                        <Trash size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        <div className="lf-form-actions">
          <Link href="/lead-files" className="lf-btn">
            Cancel
          </Link>
          <button
            type="submit"
            className="lf-btn lf-btn-primary"
            disabled={saving || totalFiles === 0}
          >
            {saving ? "Uploading…" : `Upload ${totalFiles || ""} file(s)`}
          </button>
        </div>
      </form>
    </div>
  );
}