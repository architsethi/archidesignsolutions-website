"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  project: string;
  image: string;
}

export default function TestimonialsPage() {
  const { password } = useAdmin();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setTestimonials(d.testimonials || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  const saveAll = async (updated: Testimonial[]) => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ testimonials: updated }),
    });
    setTestimonials(updated);
    setSaving(false);
    showToast("Testimonials saved!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "testimonials");
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();
    setEditing({ ...editing, image: url });
  };

  const handleSave = async () => {
    if (!editing) return;
    const updated = testimonials.map((t) => (t.id === editing.id ? editing : t));
    await saveAll(updated);
    setEditing(null);
  };

  const handleNew = () => {
    const newT: Testimonial = {
      id: `t${Date.now()}`,
      quote: "",
      author: "",
      project: "",
      image: "",
    };
    setEditing(newT);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await saveAll(testimonials.filter((t) => t.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  if (editing) {
    const isNew = !testimonials.find((t) => t.id === editing.id);
    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{isNew ? "New Testimonial" : "Edit Testimonial"}</h1>
        </div>
        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Testimonial Quote</label>
            <textarea
              className={styles.formTextarea}
              value={editing.quote}
              onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
              placeholder="What did the client say?"
              style={{ minHeight: 100 }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Client Name</label>
              <input className={styles.formInput} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} placeholder="Full name" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Project</label>
              <input className={styles.formInput} value={editing.project} onChange={(e) => setEditing({ ...editing, project: e.target.value })} placeholder="Project, Location" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Photo (optional)</label>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Leave empty to show default avatar icon.</p>
            {editing.image && (
              <div style={{ position: "relative", width: 80, height: 80, borderRadius: "50%", overflow: "hidden", marginBottom: 8, border: "2px solid #e0e0e0" }}>
                <Image src={editing.image} alt="Avatar" fill style={{ objectFit: "cover" }} sizes="80px" />
              </div>
            )}
            <div className={styles.uploadZone} onClick={() => fileRef.current?.click()} style={{ padding: "16px 24px" }}>
              <p className={styles.uploadZoneText}><span className={styles.uploadZoneAccent}>Upload</span> a profile photo</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
            {editing.image && (
              <button className={styles.btnSecondary} style={{ marginTop: 8, padding: "6px 12px", fontSize: 12 }}
                onClick={() => setEditing({ ...editing, image: "" })}>
                Remove photo (use default avatar)
              </button>
            )}
          </div>
          <div className={styles.btnRow}>
            <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Testimonial"}
            </button>
            <button className={styles.btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {toast && <div className={styles.toast}>{toast}</div>}
      </>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Testimonials</h1>
        <p className={styles.pageSubtitle}>Manage client reviews displayed on the homepage</p>
      </div>
      <div className={styles.btnRow} style={{ marginBottom: 20 }}>
        <button className={styles.btnPrimary} onClick={handleNew}>+ Add Testimonial</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {testimonials.map((t) => (
          <div key={t.id} className={styles.card} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            {/* Avatar */}
            <div style={{ width: 52, height: 52, borderRadius: "50%", overflow: "hidden", background: "#f0f0f0", flexShrink: 0, border: "2px solid #e0e0e0", position: "relative" }}>
              {t.image ? (
                <Image src={t.image} alt={t.author} fill style={{ objectFit: "cover" }} sizes="52px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 2 }}>{t.author}</p>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{t.project}</p>
              <p style={{ fontSize: 14, color: "#555", fontStyle: "italic", lineHeight: 1.5 }}>&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => setEditing(t)}>Edit</button>
              <button className={styles.btnDanger} style={{ padding: "6px 12px" }} onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
