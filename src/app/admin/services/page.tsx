"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface ServiceImage {
  title: string;
  img: string;
}

export default function ServicesPage() {
  const { password } = useAdmin();
  const [homeImages, setHomeImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => {
        setHomeImages(d.homeServiceImages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [password]);

  const handleUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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

    const updated = homeImages.map((s, i) => i === index ? { ...s, img: url } : s);
    setHomeImages(updated);

    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ homeServiceImages: updated }),
    });
    setSaving(false);
    showToast("Saved!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Service Images</h1>
        <p className={styles.pageSubtitle}>Manage images for service cards on the homepage</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {homeImages.map((svc, i) => (
          <div key={i} className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#f0f0f0", cursor: "pointer" }}
              onClick={() => fileRefs.current[i]?.click()}>
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
                ref={(el) => { fileRefs.current[i] = el; }}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleUpload(i, e)}
              />
            </div>
            <div style={{ padding: "12px 16px" }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{svc.title}</p>
              <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Click image to replace</p>
            </div>
          </div>
        ))}
      </div>

      {saving && <div className={styles.toast}>Saving...</div>}
      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
