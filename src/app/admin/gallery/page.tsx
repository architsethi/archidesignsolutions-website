"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface GalleryImage {
  src: string;
  label: string;
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
  const fileRef = useRef<HTMLInputElement>(null);
  const disciplineFileRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    const updated = [...images, { src: url, label }];
    await saveGallery(updated);
    setNewLabel("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    await saveGallery(updated);
  };

  const handleLabelChange = (index: number, label: string) => {
    const updated = images.map((img, i) => (i === index ? { ...img, label } : img));
    setImages(updated);
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
            <div className={styles.imageGrid}>
              {images.map((img, i) => (
                <div key={i} className={styles.imageCard}>
                  <Image src={img.src} alt={img.label} fill style={{ objectFit: "cover" }} sizes="200px" />
                  <div className={styles.imageCardOverlay}>
                    <input
                      className={styles.imageCardLabel}
                      value={img.label}
                      onChange={(e) => handleLabelChange(i, e.target.value)}
                      onBlur={() => saveGallery(images)}
                      style={{ background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%" }}
                    />
                    <button className={styles.imageCardDelete} onClick={() => handleDelete(i)} title="Delete">×</button>
                  </div>
                </div>
              ))}
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
