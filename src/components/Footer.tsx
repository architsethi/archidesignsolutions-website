"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import InteractiveGrid from "./InteractiveGrid";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
}

const defaultContact = {
  address: "301, Prakriti Corporate, 3rd Floor, Y.N. Road, Indore, Madhya Pradesh 452001",
  email: "archidesignsolutions@gmail.com",
  phone: "+91-731-4045559",
};

const defaultSocials: SocialLinks = {
  instagram: "https://www.instagram.com/archidesignsolutions/",
  whatsapp: "https://wa.me/919179797359",
  facebook: "https://facebook.com/archidesignsolutions",
  linkedin: "https://linkedin.com/company/archidesignsolutions",
};

export default function Footer() {
  const [contactInfo, setContactInfo] = useState(defaultContact);
  const [socials, setSocials] = useState<SocialLinks>(defaultSocials);

  useEffect(() => {
    fetch("/api/admin/data", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.contact) {
          setContactInfo({
            address: d.contact.address || defaultContact.address,
            email: d.contact.emails?.[0] || defaultContact.email,
            phone: d.contact.phones?.[0] || defaultContact.phone,
          });
          if (d.contact.socials) {
            setSocials({ ...defaultSocials, ...d.contact.socials });
          }
        }
      })
      .catch(() => {});
  }, []);

  const socialLinks = [
    {
      label: "Instagram",
      href: socials.instagram || "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="5" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: socials.linkedin || "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: socials.whatsapp || "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: socials.facebook || "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <InteractiveGrid className={styles.footerCanvas} opacity={0.015} />

        {/* ── Large brand statement ── */}
        <div className={styles.brandSection}>
          <div className={styles.brandLeft}>
            <Image
              src="/logo.png"
              alt="ArchiDesignSolutions"
              width={56}
              height={56}
            />
            <div className={styles.brandText}>
              <span className={styles.brandName}>ArchiDesignSolutions</span>
              <span className={styles.brandTagline}>
                Designing spaces that stand the test of time
              </span>
            </div>
          </div>
          <Link href="/contact" className={styles.footerCta}>
            Start a Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>


        {/* ── Middle: Nav links as horizontal row + Contact info ── */}
        <div className={styles.middleSection}>
          <nav className={styles.navRow}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.navLink}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className={styles.contactGrid}>
            <div className={styles.contactBlock}>
              <span className={styles.contactLabel}>Office</span>
              <span className={styles.contactValue}>{contactInfo.address}</span>
            </div>
            <div className={styles.contactBlock}>
              <span className={styles.contactLabel}>Email</span>
              <a href={`mailto:${contactInfo.email}`} className={styles.contactValue}>
                {contactInfo.email}
              </a>
            </div>
            <div className={styles.contactBlock}>
              <span className={styles.contactLabel}>Phone</span>
              <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`} className={styles.contactValue}>
                {contactInfo.phone}
              </a>
            </div>
          </div>
        </div>


        {/* ── Bottom: Socials + Legal + Copyright ── */}
        <div className={styles.bottomSection}>
          <div className={styles.socialRow}>
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
                <span className={styles.socialLabel}>{s.label}</span>
              </a>
            ))}
          </div>

          <div className={styles.legalRow}>
            <span className={styles.copyright}>
              © {new Date().getFullYear()} ArchiDesignSolutions
            </span>
            <span className={styles.legalSep}>·</span>
            <span className={styles.affiliations}>COA · IIA · ITPI · IGBC</span>
            <span className={styles.legalSep}>·</span>
            <Link href="/privacy" className={styles.legalLink}>Privacy</Link>
            <span className={styles.legalSep}>·</span>
            <Link href="/terms" className={styles.legalLink}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
