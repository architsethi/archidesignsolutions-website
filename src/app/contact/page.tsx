"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import TypewriterAccent from "@/components/TypewriterAccent";

/* ── Fallback values used while loading ── */
const MAP_URL = "https://maps.app.goo.gl/PUn1kAzeHA76aMq88";
const FALLBACK_MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.9!2d75.8570!3d22.7203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd0d3cb6e7c3%3A0x9b86897c8bee4a08!2sPrakriti%20Corporate!5e0!3m2!1sen!2sin!4v1715000000000";

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
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinHovered, setPinHovered] = useState(false);

  /* ── Live contact data from API ── */
  const [contact, setContact] = useState<ContactInfo>({
    phones: ["+91-731-4045559", "+91-9302101559"],
    emails: ["archidesignsolutions@gmail.com"],
    address: "208B, Prakriti Corporate\nY.N. Road, New Palasia\nIndore — 452001\nMadhya Pradesh, India",
    socials: {
      instagram: "https://www.instagram.com/archidesignsolutions/",
      whatsapp: "https://wa.me/919179797359",
      facebook: "https://facebook.com/archidesignsolutions",
      linkedin: "https://linkedin.com/company/archidesignsolutions",
    },
  });

  useEffect(() => {
    fetch("/api/admin/data", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.contact) {
          setContact({
            phones: d.contact.phones || ["+91-731-4045559", "+91-9302101559"],
            emails: d.contact.emails || ["archidesignsolutions@gmail.com"],
            address: d.contact.address || "208B, Prakriti Corporate\nY.N. Road, New Palasia\nIndore — 452001\nMadhya Pradesh, India",
            mapEmbedUrl: d.contact.mapEmbedUrl || "",
            socials: d.contact.socials || {},
          });
        }
      })
      .catch(() => {});
  }, []);

  /* Derive Google Maps embed URL */
  const mapEmbedUrl = contact.mapEmbedUrl || FALLBACK_MAP_EMBED;

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const projectTypeRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current?.value,
          email: emailRef.current?.value,
          phone: phoneRef.current?.value,
          projectType: projectTypeRef.current?.value,
          message: messageRef.current?.value,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      setSubmitted(true);
    } catch (error) {
      alert("There was an error sending your message. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  /* Format address for display — split on \n or commas */
  const addressLines = contact.address.split(/\n|(?:,\s*)/);

  return (
    <div className={styles.page}>
      {/* ── Hero with floating map card ── */}
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className={`container ${styles.heroInner}`}>
          {/* Left: text */}
          <div className={styles.heroLeft}>
            <span className={`label-mono ${styles.heroLabel}`}>Contact</span>
            <h1 className={styles.heroTitle}>
              Let&apos;s Build
              <br />
              <TypewriterAccent words={["Together", "Something Great", "Your Vision"]} />
            </h1>
            <p className={styles.heroDesc}>
              Tell us about your project and we&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* Right: floating map card */}
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapCard}
            aria-label="Open ArchiDesignSolutions location in Google Maps"
          >
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, pointerEvents: "none" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ArchiDesignSolutions Office Location"
            />
            {/* Pin overlay */}
            <div className={styles.mapPinWrap}>
              <div
                className={styles.mapPin}
                onMouseEnter={() => setPinHovered(true)}
                onMouseLeave={() => setPinHovered(false)}
              >
                <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                  <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill="#c8322b"/>
                  <circle cx="14" cy="14" r="5" fill="white"/>
                </svg>
              </div>
              {/* Tooltip on hover */}
              {pinHovered && (
                <div className={styles.mapTooltip}>
                  ArchiDesignSolutions Head Office
                </div>
              )}
            </div>
            {/* Click overlay label */}
            <div className={styles.mapClickLabel}>
              <span>Open in Maps ↗</span>
            </div>
          </a>
        </div>
      </section>

      <section className={styles.content}>
        <div className="container">
          <div className={styles.grid}>
            {/* Form */}
            <ScrollReveal>
              <div className={styles.formSection}>
                <h2 className={styles.formTitle}>Start a Conversation</h2>
                <p className={styles.formDesc}>
                  Tell us about your project and we&apos;ll get back to you
                  within 24 hours.
                </p>

                {submitted ? (
                  <div className={styles.success}>
                    <span className={styles.successIcon}>✓</span>
                    <h3>Message Sent</h3>
                    <p>We&apos;ll be in touch shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Name</label>
                        <input
                          ref={nameRef}
                          type="text"
                          required
                          className={styles.fieldInput}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Email</label>
                        <input
                          ref={emailRef}
                          type="email"
                          required
                          className={styles.fieldInput}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Phone</label>
                        <input
                          ref={phoneRef}
                          type="tel"
                          className={styles.fieldInput}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Project Type</label>
                        <select ref={projectTypeRef} className={styles.fieldInput} defaultValue="">
                          <option value="" disabled>Select type</option>
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Institutional</option>
                          <option>Interior Design</option>
                          <option>Master Planning</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Message</label>
                      <textarea
                        ref={messageRef}
                        required
                        className={styles.fieldTextarea}
                        rows={5}
                        placeholder="Tell us about your vision..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-solid"
                      style={{ width: "100%", justifyContent: "center" }}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message →"}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Info — now dynamic */}
            <ScrollReveal delay={0.2}>
              <div className={styles.infoColumn}>
                <div className={styles.info}>
                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Visit Us</span>
                    <p className={styles.infoText}>
                      {addressLines.map((line, i) => (
                        <span key={i}>
                          {line.trim()}
                          {i < addressLines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    <a
                      href={MAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.directionsBtn}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                      Get Directions
                    </a>
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Email</span>
                    {contact.emails.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className={styles.infoLink}>
                        {email}
                      </a>
                    ))}
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Phone</span>
                    {contact.phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/[^+\d]/g, "")}`} className={styles.infoLink}>
                        {phone}
                      </a>
                    ))}
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Follow Us</span>
                    <div className={styles.socialButtons}>
                      {contact.socials?.instagram && (
                        <a href={contact.socials.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                          Instagram
                        </a>
                      )}
                      {contact.socials?.linkedin && (
                        <a href={contact.socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
