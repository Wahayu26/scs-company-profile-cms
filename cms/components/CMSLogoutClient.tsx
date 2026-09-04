"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { requestCMSLogout } from "./logout-request.mjs";

export default function CMSLogoutClient({ apiURL, loginURL }: { apiURL: string; loginURL: string }) {
  const started = useRef(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const signOut = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      await requestCMSLogout(apiURL);
      // Full navigation discards the previous authenticated Next router/provider cache.
      window.location.replace(loginURL);
    } catch {
      setError("Belum berhasil keluar. Periksa koneksi lalu coba lagi; sesi belum dikonfirmasi berakhir.");
      setBusy(false);
    }
  }, [apiURL, loginURL]);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void signOut();
  }, [signOut]);
  return <section aria-labelledby="logout-title" style={{ maxWidth: 440, margin: "80px auto", padding: 24 }}>
    <h1 id="logout-title">Keluar dari CMS</h1>
    <p role={error ? "alert" : "status"}>{error || "Mengakhiri sesi Anda dengan aman…"}</p>
    {error && <button type="button" disabled={busy} onClick={() => void signOut()}>Coba keluar lagi</button>}
  </section>;
}
