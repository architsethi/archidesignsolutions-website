"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "../layout";
import styles from "../admin.module.css";

interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
}

interface ContactInfo {
  phones: string[];
  emails: string[];
  address: string;
  mapEmbedUrl?: string;
  socials?: SocialLinks;
  archzigUrl?: string;
  architerraxUrl?: string;
}

export default function ContactPage() {
  const { password } = useAdmin();
  const [contact, setContact] = useState<ContactInfo>({ phones: [], emails: [], address: "", mapEmbedUrl: "", socials: {}, archzigUrl: "", architerraxUrl: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/data", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => {
        setContact(d.contact || { phones: [], emails: [], address: "", mapEmbedUrl: "", socials: {} });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [password]);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ contact }),
    });
    setSaving(false);
    showToast("Contact info saved!");
  };

  const updatePhone = (index: number, value: string) => {
    const phones = [...contact.phones];
    phones[index] = value;
    setContact({ ...contact, phones });
  };

  const addPhone = () => setContact({ ...contact, phones: [...contact.phones, ""] });
  const removePhone = (i: number) => setContact({ ...contact, phones: contact.phones.filter((_, idx) => idx !== i) });

  const updateEmail = (index: number, value: string) => {
    const emails = [...contact.emails];
    emails[index] = value;
    setContact({ ...contact, emails });
  };

  const addEmail = () => setContact({ ...contact, emails: [...contact.emails, ""] });
  const removeEmail = (i: number) => setContact({ ...contact, emails: contact.emails.filter((_, idx) => idx !== i) });

  const updateSocial = (key: keyof SocialLinks, value: string) => {
    setContact({ ...contact, socials: { ...contact.socials, [key]: value } });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Business Information</h1>
        <p className={styles.pageSubtitle}>Update phone numbers, emails, office address, social links, and venture URLs. Changes reflect on the Contact page, Footer, and About page.</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Phone Numbers</h2>
        {contact.phones.map((phone, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input className={styles.formInput} value={phone} onChange={(e) => updatePhone(i, e.target.value)} style={{ flex: 1 }} />
            <button className={styles.btnDanger} onClick={() => removePhone(i)}>×</button>
          </div>
        ))}
        <button className={styles.btnSecondary} onClick={addPhone}>+ Add Phone</button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Email Addresses</h2>
        {contact.emails.map((email, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input className={styles.formInput} value={email} onChange={(e) => updateEmail(i, e.target.value)} style={{ flex: 1 }} />
            <button className={styles.btnDanger} onClick={() => removeEmail(i)}>×</button>
          </div>
        ))}
        <button className={styles.btnSecondary} onClick={addEmail}>+ Add Email</button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Office Address</h2>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Full Address</label>
          <textarea
            className={styles.formTextarea}
            value={contact.address}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Google Maps Embed URL (optional — for the map card on Contact page)</label>
          <input
            className={styles.formInput}
            value={contact.mapEmbedUrl || ""}
            onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
          <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            Go to Google Maps → Share → Embed a map → Copy the src URL from the iframe code.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Social Media Links</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          These links are used in the Footer and Contact page social buttons.
        </p>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Instagram URL</label>
          <input
            className={styles.formInput}
            value={contact.socials?.instagram || ""}
            onChange={(e) => updateSocial("instagram", e.target.value)}
            placeholder="https://www.instagram.com/archidesignsolutions/"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>WhatsApp URL</label>
          <input
            className={styles.formInput}
            value={contact.socials?.whatsapp || ""}
            onChange={(e) => updateSocial("whatsapp", e.target.value)}
            placeholder="https://wa.me/919179797359"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Facebook URL</label>
          <input
            className={styles.formInput}
            value={contact.socials?.facebook || ""}
            onChange={(e) => updateSocial("facebook", e.target.value)}
            placeholder="https://facebook.com/archidesignsolutions"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>LinkedIn URL</label>
          <input
            className={styles.formInput}
            value={contact.socials?.linkedin || ""}
            onChange={(e) => updateSocial("linkedin", e.target.value)}
            placeholder="https://linkedin.com/company/archidesignsolutions"
          />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Venture Platforms</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
          Links for Archzig and Architerrax cards on the About page. Clicking the card image or &quot;Visit Platform&quot; button redirects to these URLs.
        </p>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Archzig URL</label>
          <input
            className={styles.formInput}
            value={contact.archzigUrl || ""}
            onChange={(e) => setContact({ ...contact, archzigUrl: e.target.value })}
            placeholder="https://www.archzig.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Architerrax URL</label>
          <input
            className={styles.formInput}
            value={contact.architerraxUrl || ""}
            onChange={(e) => setContact({ ...contact, architerraxUrl: e.target.value })}
            placeholder="https://www.architerrax.com"
          />
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnPrimary} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  );
}
