"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface GalleryImage {
  src: string;
  label: string;
}

export default function GalleryPage() {
  const { password } = useAdmin();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setImages(d.gallery || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  const save = async (updated: GalleryImage[]) => {
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
    await save(updated);
    setNewLabel("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    await save(updated);
  };

  const handleLabelChange = (index: number, label: string) => {
    const updated = images.map((img, i) => (i === index ? { ...img, label } : img));
    setImages(updated);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gallery Management</h1>
        <p className={styles.pageSubtitle}>Homepage hero slider images</p>
      </div>

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
                  onBlur={() => save(images)}
                  style={{ background: "transparent", border: "none", color: "#fff", outline: "none", width: "100%" }}
                />
                <button className={styles.imageCardDelete} onClick={() => handleDelete(i)} title="Delete">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {saving && <div className={styles.toast}>Saving...</div>}
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
