"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { InquiryStatus } from "../core-inquiries";

const labels: Record<InquiryStatus, string> = {
  RECEIVED: "Baru",
  IN_PROGRESS: "Diproses",
  CONTACTED: "Sudah dihubungi",
  CLOSED: "Selesai",
};

const statusModifiers: Record<InquiryStatus, string> = {
  RECEIVED: "received",
  IN_PROGRESS: "in-progress",
  CONTACTED: "contacted",
  CLOSED: "closed",
};

type Props = {
  currentStatus: InquiryStatus;
  lastChangedAt: string | null;
  lastChangedBy: string | null;
  publicReference: string;
};

export default function InquiryStatusControl({ currentStatus, lastChangedAt, lastChangedBy, publicReference }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    if (pending || status === currentStatus) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/consultations/${encodeURIComponent(publicReference)}/status`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Status belum dapat disimpan.");
      setMessage("Tersimpan");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status belum dapat disimpan.");
    } finally {
      setPending(false);
    }
  }

  return <div className="scs-inquiry-status-control">
    <span className={`scs-inquiry-status ${statusModifiers[currentStatus]}`}>{labels[currentStatus]}</span>
    <select value={status} onChange={(event) => setStatus(event.target.value as InquiryStatus)} aria-label={`Status ${publicReference}`}>
      {Object.entries(labels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
    </select>
    <button type="button" onClick={save} disabled={pending || status === currentStatus}>{pending ? "Menyimpan…" : "Simpan"}</button>
    {lastChangedBy && lastChangedAt && <small>Terakhir oleh {lastChangedBy}<br />{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(lastChangedAt))}</small>}
    {message && <span aria-live="polite">{message}</span>}
  </div>;
}
