"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import TypewriterAccent from "@/components/TypewriterAccent";

const stripImages = [
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", alt: "Modern residential architecture" },
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80", alt: "Interior design project" },
  { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&q=80", alt: "Contemporary building facade" },
  { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&q=80", alt: "Architectural high-rise" },
  { src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&q=80", alt: "Heritage restoration" },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d7d9d4864?w=500&q=80", alt: "Hotel interior" },
  { src: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=500&q=80", alt: "Urban planning" },
];

const team = [
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

const ventures = [
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
                    <h3 className={styles.teamName}>{member.name}</h3>
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
                      className={styles.ventureLink}
                    >
                      Visit Platform →
                    </a>
                  </div>
                  <div className={styles.ventureScreenshot}>
                    <Image
                      src={v.screenshot}
                      alt={`${v.name} platform`}
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
