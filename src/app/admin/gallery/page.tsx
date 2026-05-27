"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface GalleryImage {
  src: string;
  label: string;
  link?: string;
}

interface ServiceImage {
  title: string;
  img: string;
}

type Tab = "gallery" | "disciplines";

export default function GalleryPage() {
  const { password } = useAdmin();
  const [tab, setTab] = useState<Tab>("gallery");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [disciplines, setDisciplines] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newLink, setNewLink] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const disciplineFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Label editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Link editing state
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [editingLink, setEditingLink] = useState("");
  const editLinkInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => {
        setImages(d.gallery || []);
        setDisciplines(d.homeServiceImages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [password]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingIndex]);

  // Focus link input when editing starts
  useEffect(() => {
    if (editingLinkIndex !== null && editLinkInputRef.current) {
      editLinkInputRef.current.focus();
      editLinkInputRef.current.select();
    }
  }, [editingLinkIndex]);

  const saveGallery = async (updated: GalleryImage[]) => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ gallery: updated }),
    });
    setImages(updated);
    setSaving(false);
    showToast("Gallery updated!");
  };

  const saveDisciplines = async (updated: ServiceImage[]) => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ homeServiceImages: updated }),
    });
    setDisciplines(updated);
    setSaving(false);
    showToast("Discipline images updated!");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "gallery");

    setSaving(true);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();
    const label = newLabel || file.name.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
    const newImage: GalleryImage = { src: url, label };
    if (newLink.trim()) newImage.link = newLink.trim();
    const updated = [...images, newImage];
    await saveGallery(updated);
    setNewLabel("");
    setNewLink("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    await saveGallery(updated);
  };

  // ── Label editing handlers ──
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingLabel(images[index].label);
    // Close link editing if open
    setEditingLinkIndex(null);
  };

  const commitEdit = useCallback(async () => {
    if (editingIndex === null) return;
    const trimmed = editingLabel.trim();
    if (trimmed && trimmed !== images[editingIndex].label) {
      const updated = images.map((img, i) =>
        i === editingIndex ? { ...img, label: trimmed } : img
      );
      await saveGallery(updated);
    }
    setEditingIndex(null);
    setEditingLabel("");
  }, [editingIndex, editingLabel, images]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingLabel("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // ── Link editing handlers ──
  const startEditingLink = (index: number) => {
    setEditingLinkIndex(index);
    setEditingLink(images[index].link || "");
    // Close label editing if open
    setEditingIndex(null);
  };

  const commitLinkEdit = useCallback(async () => {
    if (editingLinkIndex === null) return;
    const trimmed = editingLink.trim();
    const currentLink = images[editingLinkIndex].link || "";
    if (trimmed !== currentLink) {
      const updated = images.map((img, i) =>
        i === editingLinkIndex ? { ...img, link: trimmed || undefined } : img
      );
      await saveGallery(updated);
    }
    setEditingLinkIndex(null);
    setEditingLink("");
  }, [editingLinkIndex, editingLink, images]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelLinkEdit = () => {
    setEditingLinkIndex(null);
    setEditingLink("");
  };

  const handleLinkEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitLinkEdit();
    } else if (e.key === "Escape") {
      cancelLinkEdit();
    }
  };

  // ── Drag and drop handlers ──
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...images];
    const [draggedItem] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    setDragIndex(null);
    setDragOverIndex(null);
    await saveGallery(updated);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDisciplineUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "services/home");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();

    const updated = disciplines.map((s, i) => i === index ? { ...s, img: url } : s);
    await saveDisciplines(updated);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gallery Management</h1>
        <p className={styles.pageSubtitle}>Manage hero slider and discipline card images</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button
          className={tab === "gallery" ? styles.btnPrimary : styles.btnSecondary}
          onClick={() => setTab("gallery")}
        >
          Hero Slider
        </button>
        <button
          className={tab === "disciplines" ? styles.btnPrimary : styles.btnSecondary}
          onClick={() => setTab("disciplines")}
        >
          Discipline Images
        </button>
      </div>

      {tab === "gallery" && (
        <>
          {/* Upload Zone */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Add New Image</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Image Label</label>
              <input
                className={styles.formInput}
                placeholder="e.g. Residential High-Rise"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Project Link <span style={{ color: "#999", fontWeight: 400 }}>(optional)</span></label>
              <input
                className={styles.formInput}
                placeholder="e.g. https://archidesignsolutions.com/projects"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
              />
              <span style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                If set, a &quot;View Project&quot; button will appear when the image is expanded
              </span>
            </div>
            <div
              className={styles.uploadZone}
              onClick={() => fileRef.current?.click()}
            >
              <p className={styles.uploadZoneText}>
                <span className={styles.uploadZoneAccent}>Click to upload</span> or drag and drop
              </p>
              <p className={styles.uploadZoneText}>PNG, JPG up to 5MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />
          </div>

          {/* Image Grid */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Current Images ({images.length})</h2>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
              Drag images to reorder · Click ✏️ to edit labels · Click 🔗 to edit project link · Hover for delete
            </p>
            <div className={styles.imageGrid}>
              {images.map((img, i) => {
                const isDragging = dragIndex === i;
                const isDragOver = dragOverIndex === i;

                return (
                  <div
                    key={`${img.src}-${i}`}
                    className={`${styles.imageCardWrapper} ${isDragging ? styles.imageDragging : ""} ${isDragOver ? styles.imageDragOver : ""}`}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Image area */}
                    <div className={styles.imageCardInner}>
                      <Image src={img.src} alt={img.label} fill style={{ objectFit: "cover" }} sizes="200px" />

                      {/* Drag handle */}
                      <span className={styles.dragHandle} title="Drag to reorder">⠿</span>

                      {/* Order badge */}
                      <span className={styles.orderBadge}>{i + 1}</span>

                      {/* Link indicator */}
                      {img.link && (
                        <span style={{
                          position: "absolute", bottom: 8, left: 8,
                          background: "rgba(200,50,43,0.85)", color: "#fff",
                          fontSize: 10, fontWeight: 700, padding: "2px 6px",
                          borderRadius: 4, zIndex: 3,
                        }}>
                          🔗 Linked
                        </span>
                      )}

                      {/* Delete overlay */}
                      <div className={styles.imageCardOverlay}>
                        <span style={{ flex: 1 }} />
                        <button className={styles.imageCardDelete} onClick={() => handleDelete(i)} title="Delete">×</button>
                      </div>
                    </div>

                    {/* Label area below image */}
                    <div className={styles.imageCardBottom}>
                      {editingIndex === i ? (
                        <input
                          ref={editInputRef}
                          className={styles.imageCardLabelInput}
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : editingLinkIndex === i ? (
                        <input
                          ref={editLinkInputRef}
                          className={styles.imageCardLabelInput}
                          value={editingLink}
                          onChange={(e) => setEditingLink(e.target.value)}
                          onBlur={commitLinkEdit}
                          onKeyDown={handleLinkEditKeyDown}
                          placeholder="https://... (leave empty to remove)"
                          style={{ fontSize: 11 }}
                        />
                      ) : (
                        <>
                          <span className={styles.imageCardLabelText} title={img.label}>
                            {img.label}
                          </span>
                          <button
                            className={styles.imageCardEditBtn}
                            onClick={() => startEditing(i)}
                            title="Edit label"
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.imageCardEditBtn}
                            onClick={() => startEditingLink(i)}
                            title={img.link ? `Edit link: ${img.link}` : "Add project link"}
                            style={img.link ? { background: "rgba(200,50,43,0.08)", borderColor: "#c8322b" } : {}}
                          >
                            🔗
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {tab === "disciplines" && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Homepage Discipline Card Images</h2>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
            Click any image to replace it. These appear on the homepage service/discipline cards.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {disciplines.map((svc, i) => (
              <div key={i} className={styles.card} style={{ padding: 0, overflow: "hidden", margin: 0 }}>
                <div
                  style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f0f0f0", cursor: "pointer" }}
                  onClick={() => disciplineFileRefs.current[i]?.click()}
                >
                  {svc.img && (
                    <Image src={svc.img} alt={svc.title} fill style={{ objectFit: "cover" }} sizes="300px" />
                  )}
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Click to replace</span>
                  </div>
                  <input
                    ref={(el) => { disciplineFileRefs.current[i] = el; }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleDisciplineUpload(i, e)}
                  />
                </div>
                <div style={{ padding: "12px 16px" }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{svc.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {saving && <div className={styles.toast}>Saving...</div>}
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
