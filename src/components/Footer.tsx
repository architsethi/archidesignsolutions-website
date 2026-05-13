"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import InteractiveGrid from "./InteractiveGrid";

const mainLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Architectural Design", href: "/services#architecture" },
  { label: "Interior Design", href: "/services#interior" },
  { label: "Master Planning", href: "/services#masterplanning" },
  { label: "Green Building", href: "/services#greenbuilding" },
  { label: "Landscape Design", href: "/services#landscape" },
  { label: "MEP Services", href: "/services#mep" },
  { label: "Project Management", href: "/services#projectmgmt" },
];

const legalLinks = [
  { label: "Careers", href: "/careers" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/archidesignsolutions/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/archidesignsolutions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919179797359",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/archidesignsolutions",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

/* ── Default contact info ── */
const defaultContact = {
  address: "208B, Prakriti Corporate, Y.N. Road, Indore — 452001",
  email: "solutions.archit@gmail.com",
  phone: "+91 91797 97359",
};

export default function Footer() {
  const [contactInfo, setContactInfo] = useState(defaultContact);

  /* Fetch live contact data from persistent API */
  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        if (d.contact) {
          setContactInfo({
            address: d.contact.address || defaultContact.address,
            email: d.contact.emails?.[0] || defaultContact.email,
            phone: d.contact.phones?.[0] || defaultContact.phone,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className={styles.footer}>
      {/* Top CTA Band */}
      <div className={styles.ctaBand}>
        <div className={`container ${styles.ctaInner}`}>
          <h2 className={styles.ctaHeadline}>Designing Spaces That Inspire</h2>
          <Link href="/contact" className="btn btn-accent">
            Start Your Project →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className={`container ${styles.main}`}>
        <InteractiveGrid className={styles.footerCanvas} opacity={0.015} />

        {/* ── Top tier: Brand identity + Contact info ── */}
        <div className={styles.topTier}>
          <div className={styles.brandLogo}>
            <Image
              src="/logo.png"
              alt="ArchiDesignSolutions"
              width={48}
              height={48}
            />
            <div>
              <div className={styles.brandName}>
                Architectural and Interior Design Solutions
              </div>
              <div className={styles.brandEst}>Est. 1999 · Indore, India</div>
            </div>
          </div>

          <div className={styles.contactRow}>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Office</span>
              <span>{contactInfo.address}</span>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Email</span>
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Phone</span>
              <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`}>{contactInfo.phone}</a>
            </div>
          </div>
        </div>

        <div className={styles.midDivider} />

        {/* ── Bottom tier: Link columns + Socials ── */}
        <div className={styles.bottomTier}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navigate</h4>
            <ul className={styles.colList}>
              {mainLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.colLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.colList}>
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.colLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Legal</h4>
            <ul className={styles.colList}>
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.colLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.socialCol}>
            <h4 className={styles.colTitle}>Follow Us</h4>
            <div className={styles.social}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Architectural & Interior Design
            Solutions. All rights reserved.
          </p>
          <p className={styles.affiliations}>
            COA · IIA · ITPI · IGBC Registered
          </p>
        </div>
      </div>
    </footer>
  );
}
