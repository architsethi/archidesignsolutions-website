"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface TeamMember {
  name: string;
  title: string;
  quals: string;
  desc: string;
  image: string;
  linkedin?: string;
  instagram?: string;
}

export default function TeamPage() {
  const { password } = useAdmin();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ index: number; member: TeamMember } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const editFileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setTeam(d.team || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  const save = async (updated: TeamMember[]) => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ team: updated }),
    });
    setTeam(updated);
    setSaving(false);
    showToast("Team updated!");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "team");
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      showToast(`Upload error: ${err.error}`);
      throw new Error(err.error);
    }
    const { url } = await res.json();
    return url;
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast("Uploading image...");
      const url = await uploadImage(file);
      const updated = team.map((m, i) => (i === index ? { ...m, image: url } : m));
      await save(updated);
    } catch {
      // error shown by uploadImage
    }
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      showToast("Uploading image...");
      const url = await uploadImage(file);
      setEditing({ ...editing, member: { ...editing.member, image: url } });
      showToast("Image uploaded!");
    } catch {
      // error shown by uploadImage
    }
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    const updated = team.map((m, i) => (i === editing.index ? editing.member : m));
    await save(updated);
    setEditing(null);
  };

  if (loading) return <p>Loading...</p>;

  if (editing) {
    const { member } = editing;
    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Team Member</h1>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Profile Photo</h2>
          {member.image && (
            <div style={{ position: "relative", width: 200, height: 200, borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
              <Image src={member.image} alt={member.name} fill style={{ objectFit: "cover" }} sizes="200px" />
            </div>
          )}
          <div className={styles.uploadZone} onClick={() => editFileRef.current?.click()}>
            <p className={styles.uploadZoneText}><span className={styles.uploadZoneAccent}>Click to upload</span> new photo</p>
          </div>
          <input ref={editFileRef} type="file" accept="image/*" hidden onChange={handleEditImageUpload} />
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Details</h2>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Name</label>
            <input className={styles.formInput} value={member.name} onChange={(e) => setEditing({ ...editing, member: { ...member, name: e.target.value } })} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title / Role</label>
            <input className={styles.formInput} value={member.title} onChange={(e) => setEditing({ ...editing, member: { ...member, title: e.target.value } })} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Qualifications</label>
            <input className={styles.formInput} value={member.quals} onChange={(e) => setEditing({ ...editing, member: { ...member, quals: e.target.value } })} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea className={styles.formTextarea} rows={4} value={member.desc} onChange={(e) => setEditing({ ...editing, member: { ...member, desc: e.target.value } })} />
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Social Links (optional)</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
            Only members with a link will show the icon on their card on the website.
          </p>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>LinkedIn URL</label>
            <input className={styles.formInput} value={member.linkedin || ""} onChange={(e) => setEditing({ ...editing, member: { ...member, linkedin: e.target.value } })} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Instagram URL</label>
            <input className={styles.formInput} value={member.instagram || ""} onChange={(e) => setEditing({ ...editing, member: { ...member, instagram: e.target.value } })} placeholder="https://instagram.com/..." />
          </div>
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnPrimary} onClick={handleSaveEdit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          <button className={styles.btnSecondary} onClick={() => setEditing(null)}>Cancel</button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Team Management</h1>
        <p className={styles.pageSubtitle}>Update architect profiles, photos, descriptions, and social links</p>
      </div>

      <div className={styles.teamGrid}>
        {team.map((member, i) => (
          <div key={member.name} className={styles.teamCard}>
            <div
              className={styles.teamImageWrap}
              onClick={() => fileRefs.current[i]?.click()}
            >
              <Image src={member.image} alt={member.name} fill style={{ objectFit: "cover" }} sizes="300px" />
              <div className={styles.teamImageOverlay}>Click to change photo</div>
              <input
                ref={(el) => { fileRefs.current[i] = el; }}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(i, e)}
              />
            </div>
            <div className={styles.teamCardBody}>
              <div className={styles.teamCardName}>{member.name}</div>
              <div className={styles.teamCardTitle}>{member.title}</div>
              {member.desc && <p style={{ fontSize: 12, color: "#666", margin: "6px 0 0", lineHeight: 1.4 }}>{member.desc.slice(0, 80)}...</p>}
              <button
                className={styles.btnSecondary}
                style={{ marginTop: 10, padding: "6px 12px", fontSize: 12 }}
                onClick={() => setEditing({ index: i, member })}
              >
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
