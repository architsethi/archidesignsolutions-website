"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

type ProjectStage = "concept" | "construction" | "completed";

interface ProjectStageData {
  images: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  featured: boolean;
  stages: {
    concept?: ProjectStageData;
    construction?: ProjectStageData;
    completed?: ProjectStageData;
  };
}

const emptyProject: Omit<Project, "id"> = {
  title: "",
  category: "Residential",
  location: "",
  year: new Date().getFullYear().toString(),
  description: "",
  image: "",
  featured: false,
  stages: {
    concept: { images: [] },
    construction: { images: [] },
    completed: { images: [] },
  },
};

const categories = ["Residential", "Commercial", "Heritage", "Institutional", "Interior", "Urban Planning", "Landscape"];
const stageKeys: ProjectStage[] = ["concept", "construction", "completed"];
const stageLabels: Record<ProjectStage, string> = {
  concept: "Concept",
  construction: "Under Construction",
  completed: "Completed",
};

function getDisplayStage(p: Project): ProjectStage {
  if (p.stages.completed && p.stages.completed.images.length > 0) return "completed";
  if (p.stages.construction && p.stages.construction.images.length > 0) return "construction";
  return "concept";
}

export default function ProjectsPage() {
  const { password } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [activeStageTab, setActiveStageTab] = useState<ProjectStage>("concept");
  const coverRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => {
        // Ensure stages exist for older data
        const projects = (d.projects || []).map((p: Project) => ({
          ...p,
          stages: p.stages || { concept: { images: [] }, construction: { images: [] }, completed: { images: [] } },
        }));
        setProjects(projects);
        setLoading(false);
      })
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
    setActiveStageTab("concept");
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

  const uploadToFolder = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();
    return url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = await uploadToFolder(file, "projects");
    setEditing({ ...editing, image: url });
  };

  const handleStageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editing) return;

    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadToFolder(files[i], `projects/${activeStageTab}`);
      urls.push(url);
    }

    const stageData = editing.stages[activeStageTab] || { images: [] };
    const updated = {
      ...editing,
      stages: {
        ...editing.stages,
        [activeStageTab]: { images: [...stageData.images, ...urls] },
      },
    };
    setEditing(updated);
    if (stageRef.current) stageRef.current.value = "";
  };

  const removeStageImage = (stage: ProjectStage, index: number) => {
    if (!editing) return;
    const stageData = editing.stages[stage] || { images: [] };
    const updated = {
      ...editing,
      stages: {
        ...editing.stages,
        [stage]: { images: stageData.images.filter((_: string, i: number) => i !== index) },
      },
    };
    setEditing(updated);
  };

  if (loading) return <p>Loading...</p>;

  // Edit / Create form
  if (editing) {
    const currentStageImages = editing.stages[activeStageTab]?.images || [];

    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{isNew ? "New Project" : "Edit Project"}</h1>
        </div>

        {/* Basic Info */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Project Details</h2>
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
            <label className={styles.formLabel}>Description (optional)</label>
            <textarea className={styles.formTextarea} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Brief project description..." />
          </div>
          <div className={styles.formGroup}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              <span className={styles.formLabel} style={{ margin: 0 }}>Featured Project</span>
            </label>
          </div>
        </div>

        {/* Cover Image */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Cover Image</h2>
          {editing.image && (
            <div style={{ position: "relative", width: 300, aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
              <Image src={editing.image} alt="Cover" fill style={{ objectFit: "cover" }} sizes="300px" />
            </div>
          )}
          <div className={styles.uploadZone} onClick={() => coverRef.current?.click()}>
            <p className={styles.uploadZoneText}><span className={styles.uploadZoneAccent}>Click to upload</span> cover image</p>
          </div>
          <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
        </div>

        {/* Stage-based Images */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Project Stage Images</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
            Upload images for each stage. The project card will show the highest stage that has images.
          </p>

          <div className={styles.tabs}>
            {stageKeys.map((s) => {
              const count = editing.stages[s]?.images?.length || 0;
              return (
                <button
                  key={s}
                  className={`${styles.tab} ${activeStageTab === s ? styles.tabActive : ""}`}
                  onClick={() => setActiveStageTab(s)}
                >
                  {stageLabels[s]} {count > 0 && <span style={{ opacity: 0.5 }}>({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Images for active stage */}
          {currentStageImages.length > 0 && (
            <div className={styles.imageGrid} style={{ marginBottom: 16 }}>
              {currentStageImages.map((src: string, i: number) => (
                <div key={i} className={styles.imageCard}>
                  <Image src={src} alt={`${stageLabels[activeStageTab]} ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="200px" />
                  <div className={styles.imageCardOverlay}>
                    <span className={styles.imageCardLabel}>Image {i + 1}</span>
                    <button className={styles.imageCardDelete} onClick={() => removeStageImage(activeStageTab, i)} title="Remove">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.uploadZone} onClick={() => stageRef.current?.click()}>
            <p className={styles.uploadZoneText}>
              <span className={styles.uploadZoneAccent}>Click to upload</span> {stageLabels[activeStageTab]} images
            </p>
            <p className={styles.uploadZoneText}>You can select multiple files</p>
          </div>
          <input ref={stageRef} type="file" accept="image/*" multiple hidden onChange={handleStageImageUpload} />
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Project"}</button>
          <button className={styles.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
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
              <th>Stage</th>
              <th>Location</th>
              <th>Year</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const stage = getDisplayStage(p);
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ position: "relative", width: 60, height: 40, borderRadius: 4, overflow: "hidden" }}>
                      {p.image && <Image src={p.image} alt="" fill style={{ objectFit: "cover" }} sizes="60px" />}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td>{p.category}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${stage === "completed" ? styles.statusPublished : styles.statusDraft}`}>
                      {stageLabels[stage]}
                    </span>
                  </td>
                  <td>{p.location}</td>
                  <td>{p.year}</td>
                  <td>{p.featured ? "⭐" : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => { setEditing(p); setIsNew(false); setActiveStageTab("concept"); }}>Edit</button>
                      <button className={styles.btnDanger} style={{ padding: "6px 12px" }} onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
