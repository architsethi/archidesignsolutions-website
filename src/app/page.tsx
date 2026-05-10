"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

/* ═══ Hero Slide Data ═══ */
const heroSlides = [
  {
    label: "Residential High-Rise",
    title: "Defining Skylines,\nShaping Communities",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85",
  },
  {
    label: "Residence Design",
    title: "Crafting Homes\nThat Inspire",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85",
  },
  {
    label: "Office Spaces",
    title: "Where Ideas\nMeet Enterprise",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85",
  },
  {
    label: "Town Planning",
    title: "Visionary Frameworks\nFor Tomorrow",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1920&q=85",
  },
  {
    label: "Urban Design",
    title: "Cities Built\nFor People",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=85",
  },
  {
    label: "Interior Design",
    title: "Spaces That\nTell Stories",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85",
  },
  {
    label: "Landscape Design",
    title: "Nature Woven\nInto Architecture",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=85",
  },
];

/* ═══ Services Data ═══ */
const services = [
  {
    num: "01",
    title: "Architectural Design",
    desc: "Innovative solutions balancing aesthetics, function, and structural integrity for every building type.",
    href: "/services#architecture",
  },
  {
    num: "02",
    title: "Interior Design",
    desc: "Curated interiors that reflect your personality — merging comfort with contemporary elegance.",
    href: "/services#interior",
  },
  {
    num: "03",
    title: "Master Planning",
    desc: "Strategic land-use planning and urban development frameworks for large-scale projects.",
    href: "/services#masterplanning",
  },
  {
    num: "04",
    title: "Green Building",
    desc: "Sustainable architecture with energy-efficient systems and eco-friendly, IGBC-aligned materials.",
    href: "/services#greenbuilding",
  },
  {
    num: "05",
    title: "Approvals & Permissions",
    desc: "Seamless handling of regulatory approvals, building permits, and compliance documentation.",
    href: "/services#approvals",
  },
  {
    num: "06",
    title: "MEP Services",
    desc: "Mechanical, electrical and plumbing engineering seamlessly integrated with architectural plans.",
    href: "/services#mep",
  },
  {
    num: "07",
    title: "Landscape Design",
    desc: "Beautiful outdoor environments designed to complement and extend the built structure.",
    href: "/services#landscape",
  },
  {
    num: "08",
    title: "Project Management",
    desc: "End-to-end oversight ensuring timely delivery within budget and quality standards.",
    href: "/services#projectmgmt",
  },
];

/* ═══ Stats Data ═══ */
const stats = [
  { value: "25+", label: "Years of Excellence" },
  { value: "500+", label: "Projects Delivered" },
  { value: "8", label: "Design Disciplines" },
  { value: "3", label: "Generations of Architects" },
];

/* ═══ Testimonials ═══ */
const testimonials = [
  {
    quote: "Working with ArchiDesignSolutions transformed our vision. Their attention to detail and commitment to timeless design is unmatched in the industry.",
    author: "Residential Client",
    project: "Private Residence, Indore",
  },
  {
    quote: "From concept to completion, the team delivered beyond all expectations. Our office complex has become a Bhopal landmark — we couldn't be prouder.",
    author: "Corporate Client",
    project: "Office Complex, Bhopal",
  },
  {
    quote: "The design team understood our lifestyle perfectly. Our home is a seamless blend of modern aesthetics and Indian sensibility — warm, beautiful, entirely ours.",
    author: "Homeowner",
    project: "Luxury Villa, Indore",
  },
  {
    quote: "Their green building expertise helped us achieve LEED certification while keeping costs in check. Exceptional professionals who deliver on every promise.",
    author: "Institutional Client",
    project: "Green Campus Project",
  },
];

/* ═══ Interactive Grid Background ═══ */
function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const spacing = 60;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const radius = 200;

      /* Vertical lines */
      for (let x = spacing; x < w; x += spacing) {
        const dist = Math.abs(x - mx);
        const proximity = Math.max(0, 1 - dist / radius);
        const alpha = 0.04 + proximity * 0.12;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.lineWidth = proximity > 0.3 ? 0.8 : 0.4;
        ctx.stroke();
      }

      /* Horizontal lines */
      for (let y = spacing; y < h; y += spacing) {
        const dist = Math.abs(y - my);
        const proximity = Math.max(0, 1 - dist / radius);
        const alpha = 0.04 + proximity * 0.12;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.lineWidth = proximity > 0.3 ? 0.8 : 0.4;
        ctx.stroke();
      }

      /* Grid intersections near cursor — red dots */
      for (let x = spacing; x < w; x += spacing) {
        for (let y = spacing; y < h; y += spacing) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius) {
            const proximity = 1 - dist / radius;
            ctx.beginPath();
            ctx.arc(x, y, 1.5 + proximity * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 50, 43, ${proximity * 0.6})`;
            ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.heroCanvas} />;
}

/* ═══ Homepage Component ═══ */
export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  /* Auto-rotate hero slides */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* Auto-rotate testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <div className={styles.page}>
      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <HeroGrid />

        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={styles.heroImage}
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>

        {/* White gradient overlay — solid left, fades right */}
        <div className={styles.heroGradient} />

        <div className={`container ${styles.heroContent}`}>
          {/* Label */}
          <motion.div
            className={styles.heroLabel}
            key={`label-${currentSlide}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={styles.heroDot} />
            <span className="label-mono">{heroSlides[currentSlide].label}</span>
          </motion.div>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentSlide}`}
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {heroSlides[currentSlide].title.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          {/* Subtitle */}
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Award-winning architecture, interior design & urban planning
            <br />
            crafted for India and beyond.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className={styles.heroCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link href="/contact" className="btn btn-solid">
              Start Your Project
            </Link>
            <Link href="/projects" className="btn btn-primary">
              View Our Work →
            </Link>
          </motion.div>
        </div>

        {/* Slide Indicators — full width */}
        <div className={styles.heroIndicators}>
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === currentSlide ? styles.active : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to ${slide.label}`}
            >
              <span className={styles.indicatorBar} />
              <span className={styles.indicatorLabel}>{slide.label}</span>
            </button>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span className="label-mono">Scroll</span>
        </div>
      </section>

      {/* ═══════ SERVICES ═══════ */}
      <section className={styles.services}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`label-mono ${styles.sectionLabel}`}>
                Our Expertise
              </span>
              <h2 className={styles.sectionTitle}>
                Eight Specialised Disciplines
              </h2>
              <p className={styles.sectionDesc}>
                End-to-end design solutions across every stage of your project —
                all under one roof.
              </p>
            </div>
          </ScrollReveal>

          <div className={styles.servicesGrid}>
            {services.map((service, i) => (
              <ScrollReveal key={service.num} delay={i * 0.06}>
                <Link href={service.href} className={styles.serviceCard}>
                  <span className={styles.serviceNum}>{service.num}</span>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.desc}</p>
                  <span className={styles.serviceArrow}>→</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PHILOSOPHY ═══════ */}
      <section className={styles.philosophy}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.philosophyContent}>
              <span className={`label-mono ${styles.sectionLabel}`}>
                Our Philosophy
              </span>
              <blockquote className={styles.philosophyQuote}>
                &ldquo;Our design based on simplicity. We do not believe in
                creating complexities but we try to establish harmony between the
                outward and the inward. Before creating anything, an architect
                needs to observe most of the things from micro to macro — and
                this is the simplest key to design.&rdquo;
              </blockquote>
              <p className={styles.philosophyAuthor}>
                — Ar. Amit Sethi, Founder
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className={styles.testimonials}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`label-mono ${styles.sectionLabel}`}>
                Client Voices
              </span>
              <h2 className={styles.sectionTitle}>
                Three Decades of Trust
              </h2>
            </div>
          </ScrollReveal>

          <div className={styles.testimonialSlider}>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className={styles.testimonialQuote}>
                  &ldquo;{testimonials[testimonialIdx].quote}&rdquo;
                </p>
                <div className={styles.testimonialMeta}>
                  <span className={styles.testimonialAuthor}>
                    {testimonials[testimonialIdx].author}
                  </span>
                  <span className={styles.testimonialProject}>
                    {testimonials[testimonialIdx].project}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className={styles.testimonialDots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.tDot} ${i === testimonialIdx ? styles.tDotActive : ""}`}
                  onClick={() => setTestimonialIdx(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className={styles.finalCta}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.finalCtaContent}>
              <h2 className={styles.finalCtaTitle}>
                Ready to Build Something
                <br />
                <span className={styles.finalCtaAccent}>Extraordinary?</span>
              </h2>
              <p className={styles.finalCtaDesc}>
                Let&apos;s discuss your vision. Our team of experts is ready to
                transform your ideas into timeless spaces.
              </p>
              <div className={styles.finalCtaButtons}>
                <Link href="/contact" className="btn btn-accent">
                  Get In Touch →
                </Link>
                <Link href="/projects" className="btn btn-primary">
                  See Our Portfolio
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
