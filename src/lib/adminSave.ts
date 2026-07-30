/**
 * The single place the admin panels write through.
 *
 * Every panel previously fired the PUT and ignored the response, then reported
 * success unconditionally — so an expired session, a 503 when the data store
 * could not be read, or a dropped connection still showed "Saved!", closed the
 * editor and lost the edit. Worse in the inbox, where local state was updated
 * optimistically, making a failed delete look like it had worked.
 *
 * Callers must branch on `ok` and only treat the change as committed when true.
 */
export type SaveResult = { ok: true } | { ok: false; message: string };

export async function saveSection(
  password: string,
  patch: Record<string, unknown>
): Promise<SaveResult> {
  try {
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(patch),
    });
    if (res.ok) return { ok: true };
    if (res.status === 401) {
      return { ok: false, message: "Not saved — your session expired. Log in again." };
    }
    if (res.status === 503) {
      return { ok: false, message: "Not saved — storage was unreachable. Nothing was changed; try again in a moment." };
    }
    return { ok: false, message: `Not saved — the server returned ${res.status}.` };
  } catch {
    return { ok: false, message: "Not saved — could not reach the server. Check your connection." };
  }
}
