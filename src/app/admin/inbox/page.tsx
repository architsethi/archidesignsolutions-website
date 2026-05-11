"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export default function InboxPage() {
  const { password } = useAdmin();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setSubmissions(d.contactSubmissions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  const markRead = async (id: string) => {
    const updated = submissions.map((s) => s.id === id ? { ...s, read: true } : s);
    setSubmissions(updated);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ contactSubmissions: updated }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ contactSubmissions: updated }),
    });
    showToast("Deleted");
  };

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
    const sub = submissions.find((s) => s.id === id);
    if (sub && !sub.read) markRead(id);
  };

  const filtered = tab === "all" ? submissions : submissions.filter((s) => !s.read);
  const unreadCount = submissions.filter((s) => !s.read).length;

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Contact Inbox</h1>
        <p className={styles.pageSubtitle}>All form submissions from the Contact Us page</p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`} onClick={() => setTab("all")}>
          All ({submissions.length})
        </button>
        <button className={`${styles.tab} ${tab === "unread" ? styles.tabActive : ""}`} onClick={() => setTab("unread")}>
          Unread ({unreadCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.card} style={{ textAlign: "center", padding: 48, color: "#888" }}>
          {tab === "unread" ? "No unread messages" : "No submissions yet"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className={styles.card}
              style={{
                borderLeft: sub.read ? "3px solid transparent" : "3px solid #c8322b",
                cursor: "pointer",
                padding: "16px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={() => handleExpand(sub.id)}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {!sub.read && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8322b", flexShrink: 0 }} />
                    )}
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{sub.name}</span>
                    {sub.projectType && (
                      <span className={`${styles.statusBadge} ${styles.statusDraft}`}>{sub.projectType}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                    <span style={{ fontSize: 13, color: "#888" }}>{sub.email}</span>
                    {sub.phone && <span style={{ fontSize: 13, color: "#888" }}>{sub.phone}</span>}
                    <span style={{ fontSize: 13, color: "#aaa" }}>{new Date(sub.submittedAt).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{expanded === sub.id ? "▲" : "▼"}</span>
                  <button
                    className={styles.btnDanger}
                    style={{ padding: "4px 10px", fontSize: 12 }}
                    onClick={(e) => { e.stopPropagation(); handleDelete(sub.id); }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expanded === sub.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                  <p style={{ fontSize: 14, color: "#333", lineHeight: 1.7, background: "#fafafa", padding: 16, borderRadius: 8, borderLeft: "3px solid #e0e0e0" }}>
                    {sub.message}
                  </p>
                  <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <a href={`mailto:${sub.email}`} className={styles.btnPrimary} style={{ textDecoration: "none", padding: "8px 16px", fontSize: 13 }}>
                      Reply via Email
                    </a>
                    {sub.phone && (
                      <a href={`tel:${sub.phone}`} className={styles.btnSecondary} style={{ textDecoration: "none", padding: "8px 16px", fontSize: 13 }}>
                        Call {sub.phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
