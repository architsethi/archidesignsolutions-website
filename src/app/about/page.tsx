"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import TypewriterAccent from "@/components/TypewriterAccent";

/* Combined set: the home-page hero gallery + the real-project discipline images.
   Ordered to alternate exterior / interior / aerial so no two similar subjects sit
   adjacent as the strip scrolls. The Bicholi Hapsi high-rise appears in both source
   sets (same render) — kept once, from the discipline set. */
const stripImages = [
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779632750197-Row-Housing-Bhopal_ArchiDesignSolutions.png", alt: "Row housing, Bhopal" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/02-interior-design.jpg", alt: "Residential interior, Emaar Continental" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779632714569-Oracle-Complex-Indore-mIxed-Use-Architecture_archidesignsolutions.png", alt: "Commercial complex, Oracle One, Indore" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/03-landscape-design.jpg", alt: "Landscape design, LEEDS Garden City" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779641733517-ChatGPT-Image-May-24%2C-2026%2C-10_24_22-PM.png", alt: "Commercial interior, Dr. Suryawanshi's Clinic, Indore" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/01-architectural-design.jpg", alt: "Residential high-rise, Bicholi Hapsi, Indore" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779641651979-Palm-Springs_ArchiDesgnSolutions.png", alt: "Holiday homes, Palm Springs, Bhopal" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779642416357-Residential-Interior-Design_Surat_archiDesignSolutions.png", alt: "Residential interior design, Surat, Gujarat" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779642707800-Shalimar-Fortleza-.png", alt: "Residential high-rise, Shalimar Fortleza, Bhopal" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/05-town-planning.jpg", alt: "Holiday homes masterplan, Palm Springs, Bhopal" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/07-architectural-branding.jpg", alt: "Architectural branding, Palm Springs brochure" },
  { src: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/gallery/1779642195913-Urban-Design_Palm-Springs-Indore.png", alt: "Urban design, Palm Springs, Bhopal" },
];

interface TeamMember {
  name: string;
  title: string;
  quals: string;
  desc: string;
  image: string;
  linkedin?: string;
  instagram?: string;
}

const fallbackTeam: TeamMember[] = [
  {
    name: "Ar. Amit Sethi",
    title: "Founder & Principal Architect",
    quals: "B. Arch · Philosopher · Writer",
    desc: "With over three decades of experience, Ar. Amit Sethi has led the firm from its founding in 1999. His philosophy of simplicity and harmony between the outward and the inward drives every project the firm undertakes.",
    image: "/images/team/amit-sethi.png",
  },
  {
    name: "Ar. Prakriti Sethi",
    title: "Co-Founder & Design Principal",
    quals: "B.Arch (Honours) · Town Planner (ITPI) · Green Building Consultant (IGBC)",
    desc: "A registered Town Planner and IGBC-certified Green Building Consultant, Ar. Prakriti Sethi brings expertise in sustainable design and master planning to every project.",
    image: "/images/team/prakriti-sethi.png",
  },
  {
    name: "Ar. Archit Sethi",
    title: "Head of Innovation",
    quals: "B. Arch, School of Planning and Architecture, Delhi",
    desc: "The newest generation at ArchiDesignSolutions, Ar. Archit Sethi bridges traditional architecture with AI-powered design workflows, leading the firm's digital transformation.",
    image: "/images/team/archit-sethi.png",
  },
];

const affiliations = [
  {
    abbr: "COA",
    name: "Council of Architecture, New Delhi",
    logo: "/images/logos/coa.jpg",
  },
  {
    abbr: "IIA",
    name: "Indian Institute of Architects",
    logo: "/images/logos/iia.jpg",
  },
  {
    abbr: "ITPI",
    name: "Institute of Town Planners India",
    logo: "/images/logos/itpi.jpg",
  },
  {
    abbr: "IGBC",
    name: "Indian Green Building Council",
    logo: "/images/logos/igbc.jpg",
  },
  {
    abbr: "TNCP",
    name: "Town & Country Planning, Indore",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Emblem_of_Madhya_Pradesh.svg",
  },
];

const defaultVentures = [
  {
    name: "Archzig",
    brandLetter: "AZ",
    url: "https://www.archzig.com",
    tagline: "Design the Future with Archzig",
    followers: "140K+",
    tags: ["500+ Freelancers", "AI-Integrated", "Global Delivery", "Scalable Services"],
    screenshot: "/images/archzig-screenshot.png",
  },
  {
    name: "Architerrax",
    brandLetter: "ATX",
    url: "https://www.instagram.com/architerrax",
    tagline: "The world's leading architecture community",
    followers: "50K+",
    tags: ["Education Platform", "Skill Development", "Community Driven", "Future-Ready"],
    screenshot: "/images/architerrax-screenshot.png",
  },
];

export default function AboutPage() {
const pillars = [
    { id: "function", num: "01", title: "Function First", desc: "Every design begins with solving a real problem — creating spaces that work before they impress." },
    { id: "harmony", num: "02", title: "Harmony", desc: "Balancing aesthetics with purpose, so beauty and utility become inseparable." },
    { id: "lifestyle", num: "03", title: "Lifestyle Design", desc: "Spaces that adapt to the user — not the other way around. Design that elevates how you live." },
  ];

  const [activePillar, setActivePillar] = useState("function");
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeam);
  const [ventures, setVentures] = useState(defaultVentures);

  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        if (d.team && d.team.length > 0) setTeam(d.team);
        if (d.contact) {
          if (d.contact.archzigUrl) {
            setVentures((prev) => prev.map((v) => v.name === "Archzig" ? { ...v, url: d.contact.archzigUrl } : v));
          }
          if (d.contact.architerraxUrl) {
            setVentures((prev) => prev.map((v) => v.name === "Architerrax" ? { ...v, url: d.contact.architerraxUrl } : v));
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Hero + Image Strip + Philosophy (shared grid background) ── */}
      <section className={styles.heroBlock}>
        <InteractiveGrid className={styles.heroCanvas} />

        {/* Hero */}
        <div className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <span className={`label-mono ${styles.label}`}>About Us</span>
            <h1 className={styles.heroTitle}>
              Three Decades. Two Generations.
              <br />
              One <TypewriterAccent words={["Vision.", "Legacy.", "Standard."]} />
            </h1>
            <p className={styles.heroDesc}>
              Since 1999, ArchiDesignSolutions has been rendering comprehensive
              architectural services — from residential and institutional
              projects to corporate interiors and luxury hospitality.
            </p>
          </div>
        </div>

        {/* Scrolling Image Strip */}
        <div className={styles.imageStrip}>
          <div className={styles.imageStripTrack}>
            {[...stripImages, ...stripImages].map((img, i) => (
              <div key={i} className={styles.stripImage}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="240px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy / Perception of Design */}
        <div className={styles.philosophy}>
        <div className={`container ${styles.philosophyGrid}`}>
          <div className={styles.philosophyLeft}>
            <span className={`label-mono ${styles.label}`}>Perception of Design</span>
            <blockquote className={styles.philosophyQuote}>
              &ldquo;We don&apos;t design spaces for people to adjust to — we
              design spaces that adjust to the way people live.&rdquo;
            </blockquote>
            <div className={styles.pillarTabs}>
              {pillars.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.pillarTab} ${activePillar === p.id ? styles.pillarTabActive : ""}`}
                  onClick={() => setActivePillar(p.id)}
                >
                  <span className={styles.pillarNum}>{p.num}</span>
                  <span className={styles.pillarTitle}>{p.title}</span>
                </button>
              ))}
            </div>
            <p className={styles.pillarDesc}>
              {pillars.find((p) => p.id === activePillar)?.desc}
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.team}>
        <div className="container">
          <ScrollReveal>
            <span className={`label-mono ${styles.label}`}>Our Team</span>
            <h2 className={styles.sectionTitle}>
              Led by Experience, Powered by <span className={styles.accent}>Innovation</span>
            </h2>
          </ScrollReveal>

          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.1}>
                <div className={styles.teamCard}>
                  <div className={styles.teamImageWrap}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <div className={styles.teamInfo}>
                    <div className={styles.teamNameRow}>
                      <h3 className={styles.teamName}>{member.name}</h3>
                      {(member.linkedin || member.instagram) && (
                        <div className={styles.teamSocials}>
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={styles.teamSocialLink} aria-label={`${member.name} LinkedIn`}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                              </svg>
                            </a>
                          )}
                          {member.instagram && (
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className={styles.teamSocialLink} aria-label={`${member.name} Instagram`}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="5" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <p className={styles.teamTitle}>{member.title}</p>
                    <p className={styles.teamQuals}>{member.quals}</p>
                    <p className={styles.teamDesc}>{member.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Affiliations ── */}
      <section className={styles.affiliations}>
        <div className="container">
          <ScrollReveal>
            <span className={`label-mono ${styles.label}`}>
              Professional Affiliations
            </span>
            <div className={styles.affiliationsGrid}>
              {affiliations.map((a) => (
                <div key={a.abbr} className={styles.affiliationCard}>
                  <div className={styles.affiliationLogoWrap}>
                    <Image
                      src={a.logo}
                      alt={`${a.abbr} Logo`}
                      fill
                      unoptimized
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <span className={styles.affiliationAbbr}>{a.abbr}</span>
                  <span className={styles.affiliationName}>{a.name}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Ventures ── */}
      <section className={styles.ventures}>
        <div className="container">
          <ScrollReveal>
            <span className={`label-mono ${styles.label}`}>Our Ventures</span>
            <h2 className={styles.sectionTitle}>
              Extending Our <span className={styles.accent}>Reach</span>
            </h2>
          </ScrollReveal>

          <div className={styles.venturesList}>
            {ventures.map((v, i) => (
              <ScrollReveal key={v.name} delay={i * 0.2}>
                <div className={styles.ventureCard}>
                  <InteractiveGrid className={styles.ventureGrid} opacity={0.06} color="red" />
                  <div className={styles.ventureBrandLetter}>{v.brandLetter}</div>
                  <div className={styles.ventureContent}>
                    <h3 className={styles.ventureName}>{v.name}</h3>
                    <p className={styles.ventureTagline}>{v.tagline}</p>
                    <div className={styles.ventureFollowers}>
                      <span className={styles.ventureFollowerValue}>{v.followers}</span>
                      <span className={styles.ventureFollowerLabel}>followers</span>
                    </div>
                    <div className={styles.ventureTags}>
                      {v.tags.map((tag) => (
                        <span key={tag} className={styles.ventureTag}>{tag}</span>
                      ))}
                    </div>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.ventureBtn}
                    >
                      Visit Platform
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ventureScreenshot}
                  >
                    <Image
                      src={v.screenshot}
                      alt={`${v.name} platform`}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
