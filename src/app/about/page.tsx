"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";

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
    logo: "https://upload.wikimedia.org/wikipedia/en/5/5a/Council_of_Architecture_Logo.jpg",
  },
  {
    abbr: "IIA",
    name: "Indian Institute of Architects",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/30/Indian_Institute_of_Architects_logo.jpg",
  },
  {
    abbr: "ITPI",
    name: "Institute of Town Planners India",
    logo: "https://www.itpi.org.in/images/main-logo.png",
  },
  {
    abbr: "IGBC",
    name: "Indian Green Building Council",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/70/Indian_Green_Building_Council_Logo.png",
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const drawPhilosophy = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const shapes: { x: number; y: number; size: number; speed: number; angle: number; opacity: number }[] = [];
    const count = activePillar === "function" ? 10 : activePillar === "harmony" ? 16 : 24;

    for (let i = 0; i < count; i++) {
      // Weight shapes to right side (60-100% of width)
      shapes.push({
        x: W * 0.4 + Math.random() * W * 0.6,
        y: Math.random() * H,
        size: activePillar === "function" ? 25 + Math.random() * 40 : activePillar === "harmony" ? 15 + Math.random() * 30 : 8 + Math.random() * 20,
        speed: 0.2 + Math.random() * 0.6,
        angle: Math.random() * Math.PI * 2,
        opacity: 0.04 + Math.random() * 0.06,
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      time += 0.008;

      shapes.forEach((s) => {
        const offsetX = Math.sin(time * s.speed + s.angle) * 20;
        const offsetY = Math.cos(time * s.speed * 0.7 + s.angle) * 15;
        const px = s.x + offsetX;
        const py = s.y + offsetY;

        ctx.save();
        ctx.translate(px, py);
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = "rgba(200, 50, 43, 0.3)";
        ctx.lineWidth = 1;

        if (activePillar === "function") {
          // Blueprint grid — precise intersecting lines
          ctx.beginPath();
          ctx.moveTo(-s.size, 0); ctx.lineTo(s.size, 0);
          ctx.moveTo(0, -s.size); ctx.lineTo(0, s.size);
          ctx.stroke();
        } else if (activePillar === "harmony") {
          // Balanced squares rotated
          ctx.rotate(time * s.speed * 0.3);
          ctx.beginPath();
          ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
          ctx.stroke();
        } else {
          // Lifestyle — organic flowing curves
          ctx.rotate(time * s.speed * 0.2);
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 1.5);
          ctx.stroke();
        }
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    cancelAnimationFrame(animRef.current);
    animate();
  }, [activePillar]);

  useEffect(() => {
    drawPhilosophy();
    return () => cancelAnimationFrame(animRef.current);
  }, [drawPhilosophy]);

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className={`container ${styles.heroInner}`}>
          <span className={`label-mono ${styles.label}`}>About Us</span>
          <h1 className={styles.heroTitle}>
            Three Decades. Two Generations.
            <br />
            One <span className={styles.accent}>Vision.</span>
          </h1>
          <p className={styles.heroDesc}>
            Since 1999, ArchiDesignSolutions has been rendering comprehensive
            architectural services — from residential and institutional
            projects to corporate interiors and luxury hospitality.
          </p>
        </div>
      </section>

      {/* ── Scrolling Image Strip ── */}
      <section className={styles.imageStrip}>
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
      </section>

      {/* ── Philosophy ── */}
      <section className={styles.philosophy}>
        <canvas ref={canvasRef} className={styles.philosophyCanvas} />
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
                      style={{ objectFit: "cover" }}
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
