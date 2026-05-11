"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  featured: boolean;
}

const emptyProject: Omit<Project, "id"> = {
  title: "",
  category: "Residential",
  location: "",
  year: new Date().getFullYear().toString(),
  description: "",
  image: "",
  featured: false,
};

const categories = ["Residential", "Commercial", "Heritage", "Institutional", "Interior", "Urban Planning", "Landscape"];

export default function ProjectsPage() {
  const { password } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  const saveAll = async (updated: Project[]) => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ projects: updated }),
    });
    setProjects(updated);
    setSaving(false);
    showToast("Projects saved!");
  };

  const handleNew = () => {
    setEditing({ id: `p${Date.now()}`, ...emptyProject });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    let updated: Project[];
    if (isNew) {
      updated = [...projects, editing];
    } else {
      updated = projects.map((p) => (p.id === editing.id ? editing : p));
    }
    await saveAll(updated);
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await saveAll(projects.filter((p) => p.id !== id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "projects");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();
    setEditing({ ...editing, image: url });
  };

  if (loading) return <p>Loading...</p>;

  // Edit / Create form
  if (editing) {
    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{isNew ? "New Project" : "Edit Project"}</h1>
        </div>
        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input className={styles.formInput} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select className={styles.formSelect} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location</label>
              <input className={styles.formInput} value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Year</label>
              <input className={styles.formInput} value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea className={styles.formTextarea} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Project Image</label>
            {editing.image && (
              <div style={{ position: "relative", width: 300, aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                <Image src={editing.image} alt="Preview" fill style={{ objectFit: "cover" }} sizes="300px" />
              </div>
            )}
            <div className={styles.uploadZone} onClick={() => fileRef.current?.click()}>
              <p className={styles.uploadZoneText}><span className={styles.uploadZoneAccent}>Click to upload</span> project image</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </div>
          <div className={styles.formGroup}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <span className={styles.formLabel} style={{ margin: 0 }}>Featured Project</span>
            </label>
          </div>
          <div className={styles.btnRow}>
            <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Project"}</button>
            <button className={styles.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</button>
          </div>
        </div>
      </>
    );
  }

  // List view
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Projects</h1>
        <p className={styles.pageSubtitle}>Manage your portfolio projects</p>
      </div>
      <div className={styles.btnRow} style={{ marginBottom: 20 }}>
        <button className={styles.btnPrimary} onClick={handleNew}>+ New Project</button>
      </div>

      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Year</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ position: "relative", width: 60, height: 40, borderRadius: 4, overflow: "hidden" }}>
                    {p.image && <Image src={p.image} alt="" fill style={{ objectFit: "cover" }} sizes="60px" />}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{p.title}</td>
                <td>{p.category}</td>
                <td>{p.location}</td>
                <td>{p.year}</td>
                <td>{p.featured ? "⭐" : "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => { setEditing(p); setIsNew(false); }}>Edit</button>
                    <button className={styles.btnDanger} style={{ padding: "6px 12px" }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
