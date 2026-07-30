"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import { saveSection } from "@/lib/adminSave";
import styles from "../admin.module.css";
import {
  type Project,
  type ImageGroup,
  type ProjectStatus,
  getProjectCategories,
  getEditableGroups,
  getProjectStatus,
  groupNameSuggestions,
  newGroupId,
  slugify,
  statusLabels,
  statusOrder,
} from "@/lib/project";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  subtitle: "",
  category: "",
  categories: [],
  location: "",
  year: new Date().getFullYear().toString(),
  description: "",
  image: "",
  featured: false,
  status: "concept",
  groups: [],
};

const defaultCategories = [
  "Architectural Design",
  "Interior Design",
  "Landscape Design",
  "Green Building",
  "Town Planning",
  "MEP Engineering",
  "Architectural Branding",
  "Project Management",
];

export default function ProjectsPage() {
  const { password } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // ── image-group editor state ──
  const [groups, setGroups] = useState<ImageGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string>("");
  const [newGroupLabel, setNewGroupLabel] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const coverRef = useRef<HTMLInputElement>(null);
  const groupImagesRef = useRef<HTMLInputElement>(null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const categories = (() => {
    const projectCats = new Set<string>();
    projects.forEach((p) => getProjectCategories(p).forEach((c) => projectCats.add(c)));
    return [...new Set([...defaultCategories, ...projectCats, ...customCategories])];
  })();

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  /** Returns true only if the server actually accepted the write. */
  const saveAll = async (updated: Project[]): Promise<boolean> => {
    setSaving(true);
    const res = await saveSection(password, { projects: updated });
    setSaving(false);
    if (!res.ok) { showToast(res.message); return false; }
    setProjects(updated);
    showToast("Projects saved! The public site updates within a minute.");
    return true;
  };

  /** Open a project in the editor, normalising legacy stage data into groups. */
  const openEditor = (p: Project, creating: boolean) => {
    const g = getEditableGroups(p);
    setGroups(g);
    setActiveGroupId(g[0]?.id ?? "");
    setEditing(p);
    setIsNew(creating);
    setNewGroupLabel("");
  };

  const handleNew = () => {
    const firstGroup: ImageGroup = { id: newGroupId(), label: "Images", images: [] };
    setGroups([firstGroup]);
    setActiveGroupId(firstGroup.id);
    setEditing({ id: `p${Date.now()}`, ...emptyProject });
    setIsNew(true);
    setNewGroupLabel("");
  };

  const handleSave = async () => {
    if (!editing) return;
    // Persist only the group shape; drop the legacy `stages` key so there is a
    // single source of truth for image organisation.
    const cleaned: Project = {
      ...editing,
      groups: groups.map((g) => ({ ...g, label: g.label.trim() || "Images" })),
      status: editing.status || getProjectStatus(editing),
    };
    delete cleaned.stages;

    const updated = isNew
      ? [...projects, cleaned]
      : projects.map((p) => (p.id === cleaned.id ? cleaned : p));
    // Stay in the editor if the write failed, so the work is not thrown away.
    if (!(await saveAll(updated))) return;
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
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
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      showToast(`Upload error: ${err.error}`);
      throw new Error(err.error);
    }
    const { url } = await res.json();
    return url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      showToast("Uploading cover image...");
      const url = await uploadToFolder(file, `projects/${slugify(editing.title)}`);
      setEditing({ ...editing, image: url });
      showToast("Cover image uploaded!");
    } catch { /* surfaced by uploadToFolder */ }
    if (coverRef.current) coverRef.current.value = "";
  };

  // ── group operations ──

  const updateGroup = (id: string, patch: Partial<ImageGroup>) =>
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const addGroup = () => {
    const label = newGroupLabel.trim();
    if (!label) { showToast("Give the group a name first"); return; }
    if (groups.some((g) => g.label.toLowerCase() === label.toLowerCase())) {
      showToast("A group with that name already exists"); return;
    }
    const g: ImageGroup = { id: newGroupId(), label, images: [] };
    setGroups((prev) => [...prev, g]);
    setActiveGroupId(g.id);
    setNewGroupLabel("");
  };

  const deleteGroup = (id: string) => {
    const g = groups.find((x) => x.id === id);
    if (!g) return;
    if (g.images.length > 0 && !confirm(`Delete the "${g.label}" group and remove its ${g.images.length} image(s) from this project?`)) return;
    const remaining = groups.filter((x) => x.id !== id);
    setGroups(remaining);
    if (activeGroupId === id) setActiveGroupId(remaining[0]?.id ?? "");
  };

  const moveGroup = (id: string, dir: -1 | 1) => {
    setGroups((prev) => {
      const i = prev.findIndex((g) => g.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleGroupImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editing || !activeGroup) return;
    try {
      showToast(`Uploading ${files.length} image(s)...`);
      const urls: string[] = [];
      const folder = `projects/${slugify(editing.title)}/${slugify(activeGroup.label)}`;
      for (let i = 0; i < files.length; i++) urls.push(await uploadToFolder(files[i], folder));
      updateGroup(activeGroup.id, { images: [...activeGroup.images, ...urls] });
      // First image uploaded to a project with no cover becomes the cover.
      if (!editing.image && urls[0]) setEditing({ ...editing, image: urls[0] });
      showToast(`${urls.length} image(s) uploaded!`);
    } catch { /* surfaced by uploadToFolder */ }
    if (groupImagesRef.current) groupImagesRef.current.value = "";
  };

  const removeImage = (index: number) => {
    if (!activeGroup || !editing) return;
    const removed = activeGroup.images[index];
    const remaining = activeGroup.images.filter((_, i) => i !== index);
    updateGroup(activeGroup.id, { images: remaining });
    // Don't leave the cover pointing at an image no longer in the project.
    if (editing.image === removed) {
      const replacement =
        remaining[0] ||
        groups.find((g) => g.id !== activeGroup.id && g.images.length > 0)?.images[0] ||
        "";
      setEditing({ ...editing, image: replacement });
    }
  };

  const moveImageTo = (from: number, to: number) => {
    if (!activeGroup || from === to) return;
    const next = [...activeGroup.images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateGroup(activeGroup.id, { images: next });
  };

  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIndex(i); };
  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIndex !== null) moveImageTo(dragIndex, i);
    setDragIndex(null); setDragOverIndex(null);
  };

  if (loading) return <p>Loading...</p>;

  // ─────────────────────────── Edit / Create form ───────────────────────────
  if (editing) {
    const selectedCats = editing.categories || (editing.category ? [editing.category] : []);

    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{isNew ? "New Project" : "Edit Project"}</h1>
        </div>

        {/* ── Project details ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Project Details</h2>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input className={styles.formInput} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Subtitle (optional)</label>
            <input className={styles.formInput} value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} placeholder="e.g. Twin towers on a landscaped podium" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Categories (select one or more)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {categories.map((c) => {
                const isChecked = selectedCats.includes(c);
                return (
                  <label key={c} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, cursor: "pointer", padding: "4px 10px", borderRadius: 6, border: isChecked ? "1px solid #c8322b" : "1px solid #ddd", background: isChecked ? "rgba(200,50,43,0.05)" : "transparent" }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedCats, c]
                          : selectedCats.filter((x) => x !== c);
                        setEditing({ ...editing, categories: updated, category: updated[0] || "" });
                      }}
                      style={{ accentColor: "#c8322b" }}
                    />
                    {c}
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              className={styles.btnSecondary}
              style={{ padding: "4px 12px", fontSize: 12 }}
              onClick={() => {
                const newCat = prompt("Enter new category name:");
                const trimmed = newCat?.trim();
                if (!trimmed) return;
                setCustomCategories((prev) => [...prev, trimmed]);
                setEditing({ ...editing, categories: [...selectedCats, trimmed], category: selectedCats[0] || trimmed });
              }}
            >
              + Add New Category
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location</label>
              <input className={styles.formInput} value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Year</label>
              <input className={styles.formInput} value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="Leave blank to hide" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status (badge)</label>
              <select
                className={styles.formSelect}
                value={editing.status || getProjectStatus(editing)}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as ProjectStatus })}
              >
                {statusOrder.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#888", marginTop: -8, marginBottom: 16 }}>
            Status is set here directly — it does not depend on which image groups exist. A project can read
            &ldquo;Under Construction&rdquo; while only concept images are uploaded. Leave Year blank to hide the date entirely.
          </p>

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

        {/* ── Cover image ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Cover Image</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
            Shown on the projects grid. Upload one here, or use &ldquo;Set as cover&rdquo; on any group image below.
          </p>
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

        {/* ── Image groups ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Image Groups</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
            Each group becomes a tab visitors can switch between on the project — e.g. Living Room, Drawing Room,
            Bedroom, Drawings, Site Progress. Name them however the project needs. Empty groups are not shown on the site.
          </p>

          {/* Group tabs */}
          <div className={styles.tabs} style={{ flexWrap: "wrap" }}>
            {groups.map((g) => (
              <button
                key={g.id}
                className={`${styles.tab} ${activeGroup?.id === g.id ? styles.tabActive : ""}`}
                onClick={() => setActiveGroupId(g.id)}
              >
                {g.label} <span style={{ opacity: 0.5 }}>({g.images.length})</span>
              </button>
            ))}
          </div>

          {/* Add a group */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "16px 0" }}>
            <input
              className={styles.formInput}
              style={{ maxWidth: 280, margin: 0 }}
              list="group-name-suggestions"
              placeholder="New group name — e.g. Living Room"
              value={newGroupLabel}
              onChange={(e) => setNewGroupLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGroup(); } }}
            />
            <datalist id="group-name-suggestions">
              {groupNameSuggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
            <button type="button" className={styles.btnSecondary} onClick={addGroup}>+ Add Group</button>
          </div>

          {activeGroup && (
            <>
              {/* Rename / reorder / delete the active group */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", padding: "12px 0", borderTop: "1px solid #eee" }}>
                <label className={styles.formLabel} style={{ margin: 0 }}>Group name</label>
                <input
                  className={styles.formInput}
                  style={{ maxWidth: 260, margin: 0 }}
                  list="group-name-suggestions"
                  value={activeGroup.label}
                  onChange={(e) => updateGroup(activeGroup.id, { label: e.target.value })}
                />
                <button type="button" className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => moveGroup(activeGroup.id, -1)} title="Move group left">←</button>
                <button type="button" className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => moveGroup(activeGroup.id, 1)} title="Move group right">→</button>
                <button type="button" className={styles.btnDanger} style={{ padding: "6px 12px" }} onClick={() => deleteGroup(activeGroup.id)}>Delete Group</button>
              </div>

              {/* Images in the active group */}
              {activeGroup.images.length > 0 && (
                <div className={styles.imageGrid} style={{ marginBottom: 16 }}>
                  {activeGroup.images.map((src, i) => {
                    const isCover = editing.image === src;
                    return (
                      <div
                        key={`${src}-${i}`}
                        className={`${styles.imageCardWrapper} ${dragIndex === i ? styles.imageDragging : ""} ${dragOverIndex === i ? styles.imageDragOver : ""}`}
                        draggable
                        onDragStart={() => setDragIndex(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragLeave={() => setDragOverIndex(null)}
                        onDrop={(e) => handleDrop(e, i)}
                        onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                      >
                        <div className={styles.imageCardInner}>
                          <Image src={src} alt={`${activeGroup.label} ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="200px" />
                          <span className={styles.dragHandle} title="Drag to reorder">⠿</span>
                          <span className={styles.orderBadge}>{i + 1}</span>
                          {isCover && (
                            <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(200,50,43,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, zIndex: 3 }}>
                              ★ Cover
                            </span>
                          )}
                          <div className={styles.imageCardOverlay}>
                            <span style={{ flex: 1 }} />
                            <button className={styles.imageCardDelete} onClick={() => removeImage(i)} title="Remove image">×</button>
                          </div>
                        </div>
                        <div className={styles.imageCardBottom}>
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            style={{ padding: "4px 8px", fontSize: 11, width: "100%" }}
                            disabled={isCover}
                            onClick={() => setEditing({ ...editing, image: src })}
                          >
                            {isCover ? "Current cover" : "Set as cover"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={styles.uploadZone} onClick={() => groupImagesRef.current?.click()}>
                <p className={styles.uploadZoneText}>
                  <span className={styles.uploadZoneAccent}>Click to upload</span> images into &ldquo;{activeGroup.label}&rdquo;
                </p>
                <p className={styles.uploadZoneText}>Select multiple files · drag thumbnails to reorder</p>
              </div>
              <input ref={groupImagesRef} type="file" accept="image/*" multiple hidden onChange={handleGroupImageUpload} />
            </>
          )}

          {groups.length === 0 && (
            <p style={{ fontSize: 13, color: "#888" }}>No image groups yet — add one above to start uploading.</p>
          )}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Project"}</button>
          <button className={styles.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </>
    );
  }

  // ─────────────────────────────── List view ───────────────────────────────
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
              <th>Categories</th>
              <th>Status</th>
              <th>Image Groups</th>
              <th>Location</th>
              <th>Year</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const status = getProjectStatus(p);
              const g = getEditableGroups(p).filter((x) => x.images.length > 0);
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ position: "relative", width: 60, height: 40, borderRadius: 4, overflow: "hidden" }}>
                      {p.image && <Image src={p.image} alt="" fill style={{ objectFit: "cover" }} sizes="60px" />}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td>{getProjectCategories(p).join(", ")}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${status === "completed" ? styles.statusPublished : styles.statusDraft}`}>
                      {statusLabels[status]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "#666" }}>
                    {g.length > 0 ? g.map((x) => `${x.label} (${x.images.length})`).join(", ") : "—"}
                  </td>
                  <td>{p.location}</td>
                  <td>{p.year || "—"}</td>
                  <td>{p.featured ? "⭐" : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => openEditor(p, false)}>Edit</button>
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
