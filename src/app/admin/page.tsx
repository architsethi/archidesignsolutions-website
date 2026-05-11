"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "./layout";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const { password } = useAdmin();
  const [data, setData] = useState<{ gallery: unknown[]; team: unknown[]; projects: unknown[]; blogs: unknown[] } | null>(null);

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [password]);

  const published = (data?.blogs as { status: string }[])?.filter((b) => b.status === "published").length ?? 0;
  const drafts = (data?.blogs as { status: string }[])?.filter((b) => b.status === "draft").length ?? 0;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Welcome to ArchiDesignSolutions Admin</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data?.gallery?.length ?? "—"}</div>
          <div className={styles.statLabel}>Gallery Images</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data?.team?.length ?? "—"}</div>
          <div className={styles.statLabel}>Team Members</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data?.projects?.length ?? "—"}</div>
          <div className={styles.statLabel}>Projects</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{published}</div>
          <div className={styles.statLabel}>Published Posts</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{drafts}</div>
          <div className={styles.statLabel}>Draft Posts</div>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Quick Actions</h2>
        <div className={styles.btnRow}>
          <a href="/admin/blog?new=1" className={styles.btnPrimary}>+ New Blog Post</a>
          <a href="/admin/projects?new=1" className={styles.btnSecondary}>+ New Project</a>
          <a href="/admin/gallery" className={styles.btnSecondary}>Manage Gallery</a>
        </div>
      </div>
    </>
  );
}
