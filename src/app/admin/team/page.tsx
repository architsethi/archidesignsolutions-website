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
}

export default function TeamPage() {
  const { password } = useAdmin();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ team: updated }),
    });
    setTeam(updated);
    showToast("Team updated!");
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "team");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();
    const updated = team.map((m, i) => (i === index ? { ...m, image: url } : m));
    await save(updated);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Team Management</h1>
        <p className={styles.pageSubtitle}>Update architect profile pictures and details</p>
      </div>

      <div className={styles.teamGrid}>
        {team.map((member, i) => (
          <div key={member.name} className={styles.teamCard}>
            <div
              className={styles.teamImageWrap}
              onClick={() => fileRefs.current[i]?.click()}
            >
              <Image src={member.image} alt={member.name} fill style={{ objectFit: "cover" }} sizes="300px" />
              <div className={styles.teamImageOverlay}>Click to change</div>
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
            </div>
          </div>
        ))}
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
