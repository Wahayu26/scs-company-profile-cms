/** Never report success on a failed logout while a server session is still active. */
export async function requestCMSLogout(apiURL, request = fetch) {
  const res = await request(`${apiURL}/logout`, { method: 'POST', credentials: 'include', cache: 'no-store' });
  if (res.ok) return;
  // An expired session is already signed out; other failures need an explicit retry.
  if (res.status === 400 || res.status === 401) {
    const me = await request(`${apiURL}/me`, { credentials: 'include', cache: 'no-store' });
    if (me.ok && (await me.json()).user === null) return;
  }
  throw new Error('Belum berhasil keluar. Sesi belum dapat dikonfirmasi berakhir. Coba lagi.');
}
