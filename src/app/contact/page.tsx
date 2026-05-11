"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <span className={`label-mono ${styles.heroLabel}`}>Contact</span>
          <h1 className={styles.heroTitle}>
            Let&apos;s Build
            <br />
            <span className={styles.accent}>Together</span>
          </h1>
          <p className={styles.heroDesc}>
            Tell us about your project and we&apos;ll get back to you within 24 hours.
          </p>
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
                          type="text"
                          required
                          className={styles.fieldInput}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Email</label>
                        <input
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
                          type="tel"
                          className={styles.fieldInput}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Project Type</label>
                        <select className={styles.fieldInput} defaultValue="">
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
                        required
                        className={styles.fieldTextarea}
                        rows={5}
                        placeholder="Tell us about your vision..."
                      />
                    </div>
                    <button type="submit" className="btn btn-solid" style={{ width: "100%", justifyContent: "center" }}>
                      Send Message →
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Contact Info + Map */}
            <ScrollReveal delay={0.2}>
              <div className={styles.infoColumn}>
                {/* Office image */}
                <div className={styles.officeImage}>
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85"
                    alt="ArchiDesignSolutions workspace"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                <div className={styles.info}>
                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Visit Us</span>
                    <p className={styles.infoText}>
                      208B, Prakriti Corporate<br />
                      Y.N. Road, New Palasia<br />
                      Indore — 452001<br />
                      Madhya Pradesh, India
                    </p>
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Email</span>
                    <a href="mailto:solutions.archit@gmail.com" className={styles.infoLink}>
                      solutions.archit@gmail.com
                    </a>
                    <a href="mailto:solutions.prakriti@gmail.com" className={styles.infoLink}>
                      solutions.prakriti@gmail.com
                    </a>
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Phone</span>
                    <a href="tel:+919179797359" className={styles.infoLink}>
                      +91 91797 97359
                    </a>
                    <a href="tel:+919826290327" className={styles.infoLink}>
                      +91 9826290327
                    </a>
                  </div>

                  <div className={styles.infoBlock}>
                    <span className={`label-mono ${styles.infoLabel}`}>Follow</span>
                    <a href="https://www.instagram.com/archidesignsolutions/" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                      Instagram →
                    </a>
                    <a href="https://wa.me/919179797359" target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                      WhatsApp →
                    </a>
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
