"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../layout";
import { saveSection } from "@/lib/adminSave";
import styles from "../admin.module.css";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  status: "published" | "draft";
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

const emptyPost: Omit<BlogPost, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  category: "Architecture",
  author: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const blogCategories = [
  "Architecture",
  "Project Management",
  "Interior Design",
  "Sustainability",
  "Urban Planning",
  "Technology",
  "Industry News",
];

export default function BlogPage() {
  const { password } = useAdmin();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<"all" | "published" | "draft">("all");
  const [seoOpen, setSeoOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Body image insertion
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageFileRef = useRef<HTMLInputElement>(null);
  const [bodyImageUploading, setBodyImageUploading] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => { setBlogs(d.blogs || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [password]);

  /** Returns true only if the server accepted the write. */
  const saveAll = async (updated: BlogPost[]): Promise<boolean> => {
    setSaving(true);
    const res = await saveSection(password, { blogs: updated });
    setSaving(false);
    if (!res.ok) { showToast(res.message); return false; }
    setBlogs(updated);
    showToast("Blog saved! The public site updates within a minute.");
    return true;
  };

  const handleNew = () => {
    setEditing({ id: `b${Date.now()}`, ...emptyPost });
    setIsNew(true);
    setSeoOpen(false);
  };

  const handleSave = async (status?: "published" | "draft") => {
    if (!editing) return;
    const post = {
      ...editing,
      status: status || editing.status,
      updatedAt: new Date().toISOString(),
      slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      seoTitle: editing.seoTitle || `${editing.title} | ArchiDesignSolutions`,
      seoDescription: editing.seoDescription || editing.excerpt,
    };
    let updated: BlogPost[];
    if (isNew) {
      updated = [...blogs, post];
    } else {
      updated = blogs.map((b) => (b.id === post.id ? post : b));
    }
    // Stay in the editor if the write failed, so the post is not lost.
    if (!(await saveAll(updated))) return;
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await saveAll(blogs.filter((b) => b.id !== id));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "blog");
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });
    const { url } = await res.json();
    setEditing({ ...editing, image: url });
  };

  // ── Body image insertion handler ──
  const handleBodyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setBodyImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "blog");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });
      const { url } = await res.json();

      // Get cursor position from the textarea
      const textarea = contentRef.current;
      const cursorPos = textarea?.selectionStart ?? editing.content.length;

      // Build the markdown image tag
      const altText = file.name.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
      const imageTag = `\n![${altText}](${url})\n`;

      // Insert at cursor position
      const before = editing.content.slice(0, cursorPos);
      const after = editing.content.slice(cursorPos);
      const newContent = before + imageTag + after;

      setEditing({ ...editing, content: newContent });
      showToast("Image inserted!");

      // Reset cursor position after React re-render
      setTimeout(() => {
        if (textarea) {
          const newPos = cursorPos + imageTag.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
          textarea.focus();
        }
      }, 50);
    } catch {
      showToast("Image upload failed");
    }

    setBodyImageUploading(false);
    if (bodyImageFileRef.current) bodyImageFileRef.current.value = "";
  };

  if (loading) return <p>Loading...</p>;

  // Edit / Create form
  if (editing) {
    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{isNew ? "New Blog Post" : "Edit Post"}</h1>
        </div>

        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Title</label>
            <input className={styles.formInput} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Post title" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Slug</label>
            <input className={styles.formInput} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated-from-title" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select className={styles.formSelect} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {/* Include the post's own category even if it is not in the list,
                    otherwise opening the editor silently reassigns it to the
                    first option and saving loses the original. */}
                {(blogCategories.includes(editing.category) || !editing.category
                  ? blogCategories
                  : [editing.category, ...blogCategories]
                ).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Author (optional)</label>
              <input className={styles.formInput} value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} placeholder="Author name (leave blank for no author)" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Excerpt</label>
            <textarea className={styles.formTextarea} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Short description for listing pages" style={{ minHeight: 60 }} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Content</label>
            {/* Toolbar for inserting images */}
            <div className={styles.contentToolbar}>
              <button
                type="button"
                className={styles.btnSecondary}
                style={{ padding: "6px 14px", fontSize: 13 }}
                disabled={bodyImageUploading}
                onClick={() => bodyImageFileRef.current?.click()}
              >
                {bodyImageUploading ? "⏳ Uploading..." : "🖼️ Insert Image"}
              </button>
              <span style={{ fontSize: 12, color: "#999" }}>
                Click to add an image at the cursor position
              </span>
            </div>
            <textarea
              ref={contentRef}
              className={styles.formTextarea}
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              placeholder={"Full blog post content (supports markdown)\n\nUse the Insert Image button above to add images within your content."}
              style={{ minHeight: 250 }}
            />
            <input
              ref={bodyImageFileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleBodyImageUpload}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Featured Image</label>
            {editing.image && (
              <div style={{ position: "relative", width: 300, aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
                <Image src={editing.image} alt="Preview" fill style={{ objectFit: "cover" }} sizes="300px" />
              </div>
            )}
            <div className={styles.uploadZone} onClick={() => fileRef.current?.click()}>
              <p className={styles.uploadZoneText}><span className={styles.uploadZoneAccent}>Click to upload</span> featured image</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </div>
        </div>

        {/* SEO Section */}
        <div className={styles.card}>
          <button
            className={styles.cardTitle}
            onClick={() => setSeoOpen(!seoOpen)}
            style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, width: "100%" }}
          >
            SEO Settings {seoOpen ? "▾" : "▸"}
          </button>
          {seoOpen && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>SEO Title</label>
                <input className={styles.formInput} value={editing.seoTitle} onChange={(e) => setEditing({ ...editing, seoTitle: e.target.value })} placeholder="Title for search engines" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meta Description</label>
                <textarea className={styles.formTextarea} value={editing.seoDescription} onChange={(e) => setEditing({ ...editing, seoDescription: e.target.value })} placeholder="Description for search results" style={{ minHeight: 60 }} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Keywords</label>
                <input className={styles.formInput} value={editing.seoKeywords} onChange={(e) => setEditing({ ...editing, seoKeywords: e.target.value })} placeholder="Comma-separated keywords" />
              </div>
            </>
          )}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnPrimary} onClick={() => handleSave("published")} disabled={saving}>
            {saving ? "Saving..." : "Publish"}
          </button>
          <button className={styles.btnSecondary} onClick={() => handleSave("draft")} disabled={saving}>
            Save as Draft
          </button>
          <button className={styles.btnSecondary} onClick={() => { setEditing(null); setIsNew(false); }}>Cancel</button>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </>
    );
  }

  // Filter by tab
  const filtered = tab === "all" ? blogs : blogs.filter((b) => b.status === tab);

  // List view
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Blog Posts</h1>
        <p className={styles.pageSubtitle}>Manage published and draft blog content</p>
      </div>

      <div className={styles.btnRow} style={{ marginBottom: 20 }}>
        <button className={styles.btnPrimary} onClick={handleNew}>+ New Post</button>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`} onClick={() => setTab("all")}>
          All ({blogs.length})
        </button>
        <button className={`${styles.tab} ${tab === "published" ? styles.tabActive : ""}`} onClick={() => setTab("published")}>
          Published ({blogs.filter((b) => b.status === "published").length})
        </button>
        <button className={`${styles.tab} ${tab === "draft" ? styles.tabActive : ""}`} onClick={() => setTab("draft")}>
          Drafts ({blogs.filter((b) => b.status === "draft").length})
        </button>
      </div>

      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ position: "relative", width: 60, height: 40, borderRadius: 4, overflow: "hidden" }}>
                    {b.image && <Image src={b.image} alt="" fill style={{ objectFit: "cover" }} sizes="60px" />}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{b.title}</td>
                <td>{b.category}</td>
                <td style={{ fontSize: 13 }}>{b.author}</td>
                <td>
                  <span className={`${styles.statusBadge} ${b.status === "published" ? styles.statusPublished : styles.statusDraft}`}>
                    {b.status}
                  </span>
                </td>
                <td style={{ fontSize: 13 }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className={styles.btnSecondary} style={{ padding: "6px 12px" }} onClick={() => { setEditing(b); setIsNew(false); }}>Edit</button>
                    <button className={styles.btnDanger} style={{ padding: "6px 12px" }} onClick={() => handleDelete(b.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#888" }}>No posts found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
