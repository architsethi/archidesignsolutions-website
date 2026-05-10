"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import { motion, AnimatePresence } from "framer-motion";

/* ═══ Marquee Gallery Images ═══ */
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    label: "Residential High-Rise",
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    label: "Residence Design",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    label: "Office Spaces",
  },
  {
    src: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80",
    label: "Town Planning",
  },
  {
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
    label: "Urban Design",
  },
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    label: "Interior Design",
  },
  {
    src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    label: "Landscape Design",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    label: "MEP Engineering",
  },
];

/* ═══ Rotating Taglines (styled segments) ═══ */
type Segment = { text: string; style: 'light' | 'bold' | 'fade' | 'accent' };
const taglines: Segment[][] = [
  [
    { text: "that ", style: "light" },
    { text: "define ", style: "bold" },
    { text: "gener", style: "fade" },
    { text: "ations", style: "accent" },
  ],
  [
    { text: "that ", style: "light" },
    { text: "inspire ", style: "bold" },
    { text: "commun", style: "fade" },
    { text: "ities", style: "accent" },
  ],
  [
    { text: "that ", style: "light" },
    { text: "stand the ", style: "bold" },
    { text: "test of ", style: "fade" },
    { text: "time", style: "accent" },
  ],
];

/* ═══ Services Data ═══ */
const services = [
  {
    num: "01",
    title: "Architectural Design",
    desc: "Innovative solutions balancing aesthetics, function, and structural integrity for every building type.",
    href: "/services#architecture",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80",
  },
  {
    num: "02",
    title: "Interior Design",
    desc: "Curated interiors that reflect your personality — merging comfort with contemporary elegance.",
    href: "/services#interior",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
  },
  {
    num: "03",
    title: "Master Planning",
    desc: "Strategic land-use planning and urban development frameworks for large-scale projects.",
    href: "/services#masterplanning",
    img: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=600&q=80",
  },
  {
    num: "04",
    title: "Green Building",
    desc: "Sustainable architecture with energy-efficient systems and eco-friendly, IGBC-aligned materials.",
    href: "/services#greenbuilding",
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=600&q=80",
  },
  {
    num: "05",
    title: "Approvals & Permissions",
    desc: "Seamless handling of regulatory approvals, building permits, and compliance documentation.",
    href: "/services#approvals",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
  },
  {
    num: "06",
    title: "MEP Services",
    desc: "Mechanical, electrical and plumbing engineering seamlessly integrated with architectural plans.",
    href: "/services#mep",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80",
  },
  {
    num: "07",
    title: "Landscape Design",
    desc: "Beautiful outdoor environments designed to complement and extend the built structure.",
    href: "/services#landscape",
    img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
  },
  {
    num: "08",
    title: "Project Management",
    desc: "End-to-end oversight ensuring timely delivery within budget and quality standards.",
    href: "/services#projectmgmt",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
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
    quote: "Working with ArchiDesignSolutions transformed our vision. Their attention to detail and commitment to timeless design is unmatched.",
    author: "Rajesh Malhotra",
    project: "Private Residence, Indore",
  },
  {
    quote: "From concept to completion, the team delivered beyond all expectations. Our office complex has become a Bhopal landmark.",
    author: "Priya Sharma",
    project: "Office Complex, Bhopal",
  },
  {
    quote: "Our home is a seamless blend of modern aesthetics and Indian sensibility — warm, beautiful, entirely ours.",
    author: "Vikram & Anita Joshi",
    project: "Luxury Villa, Indore",
  },
  {
    quote: "Their green building expertise helped us achieve LEED certification while keeping costs in check. Exceptional professionals.",
    author: "Dr. Sunil Kapoor",
    project: "Green Campus Project",
  },
  {
    quote: "The master planning they delivered for our township project was visionary — infrastructure, community spaces, everything considered.",
    author: "Aditya Mehta",
    project: "Township, Bhopal",
  },
  {
    quote: "Incredible interior work. Every room tells a story. The material palette they chose is both luxurious and understated.",
    author: "Kavita Deshmukh",
    project: "Boutique Hotel, Ujjain",
  },
];

/* ═══ Homepage ═══ */
export default function HomePage() {
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);

  /* ── Typewriter state ── */
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentSegments = taglines[phraseIdx];
  const fullLength = currentSegments.reduce((sum, s) => sum + s.text.length, 0);

  useEffect(() => {
    if (!isDeleting && charCount === fullLength) {
      /* Full text shown — pause 4s then start deleting */
      const pause = setTimeout(() => setIsDeleting(true), 4000);
      return () => clearTimeout(pause);
    }

    if (isDeleting && charCount === 0) {
      /* Fully deleted — move to next phrase, start typing */
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % taglines.length);
      return;
    }

    /* Type or delete one character */
    const speed = isDeleting ? 20 : 35;
    const timer = setTimeout(() => {
      setCharCount((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charCount, isDeleting, phraseIdx, fullLength]);

  /* Render styled segments up to charCount */
  const renderTypedText = () => {
    let remaining = charCount;
    return currentSegments.map((seg, i) => {
      if (remaining <= 0) return null;
      const visible = seg.text.slice(0, remaining);
      remaining -= seg.text.length;
      const styleClass =
        seg.style === 'light' ? styles.heroTitleLight :
        seg.style === 'bold' ? styles.heroTitleBold :
        seg.style === 'fade' ? styles.heroTitleFade :
        styles.heroTitleAccent;
      return <span key={i} className={styleClass}>{visible}</span>;
    });
  };

  /* Double arrays for seamless infinite loops */
  const testimonialItems = [...testimonials, ...testimonials];

  /* ── Fan-stack carousel state ── */
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const n = galleryImages.length;

  const goToSlide = useCallback((i: number) => {
    setCarouselIdx(((i % n) + n) % n);
  }, [n]);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % n);
    }, 3000);
  }, [n]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  /* Drag / swipe handlers */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
    stopAutoplay();
  }, [stopAutoplay]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.clientX - dragStartX.current;
    if (dx > 50) goToSlide(carouselIdx - 1);
    else if (dx < -50) goToSlide(carouselIdx + 1);
    startAutoplay();
  }, [carouselIdx, goToSlide, startAutoplay]);

  /* Calculate card styles */
  const getCardStyle = useCallback((i: number) => {
    let d = i - carouselIdx;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    const absDist = Math.abs(d);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (absDist > 2) {
      return {
        opacity: 0,
        transform: `translateX(${d > 0 ? 800 : -800}px) scale(0.5) rotateY(${d > 0 ? -45 : 45}deg)`,
        zIndex: 0,
        pointerEvents: 'none' as const,
      };
    }

    const offsetX = d * (isMobile ? 140 : 280);
    const scale = 1 - absDist * 0.12;
    const rotateY = d * -12;
    const opacity = 1 - absDist * 0.25;

    return {
      opacity,
      transform: `translateX(${offsetX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex: 10 - absDist,
      pointerEvents: 'auto' as const,
    };
  }, [carouselIdx, n]);

  return (
    <div className={styles.page}>
      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />

        {/* ── Catchphrase Typography ── */}
        <div className={styles.heroHeadline}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className={styles.heroTitle}>
              <span className={styles.heroTitleLight}>we </span>
              <span className={styles.heroTitleItalic}>design </span>
              <span className={styles.heroTitleBold}>spaces</span>
              <br />
              <span className={styles.heroTypedLine}>
                {renderTypedText()}
                <span className={styles.heroCursor} />
              </span>
            </h1>
          </motion.div>

          <motion.div
            className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p>
              25 years of award-winning architecture, interior design
              <br />
              & urban planning — crafted for India and beyond.
            </p>
            <Link href="/contact" className={styles.heroCta}>
              Start Your Project
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Fan-Stack Image Carousel ── */}
        <motion.div
          className={styles.fanStack}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          ref={carouselRef}
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={styles.fanCard}
              style={getCardStyle(i)}
              onClick={() => { goToSlide(i); startAutoplay(); }}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                style={{ objectFit: "cover" }}
                sizes="320px"
                draggable={false}
              />
            </div>
          ))}
          {/* Label for active image */}
          <span className={styles.fanLabel}>
            {galleryImages[carouselIdx].label}
          </span>
        </motion.div>
      </section>

      {/* ═══════ LIGHTBOX ═══════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className={styles.lightboxInner}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.src}
                alt={lightbox.label}
                width={1200}
                height={750}
                style={{ objectFit: "cover", width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)' }}
              />
              <span className={styles.lightboxLabel}>{lightbox.label}</span>
            </motion.div>
            <button
              className={styles.lightboxClose}
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ STATS ═══════ */}
      <section className={styles.statsSection}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className="container">
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Built on <span className={styles.accent}>Experience</span>
              </h2>
            </div>
          </ScrollReveal>
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

      {/* ═══════ SERVICES ═══════ */}
      <section className={styles.services}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`label-mono ${styles.sectionLabel}`}>
                Our Expertise
              </span>
              <h2 className={styles.sectionTitle}>
                Eight <span className={styles.accent}>Specialised</span> Disciplines
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
                  <div className={styles.serviceImageWrap}>
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="300px"
                    />
                  </div>
                  <div className={styles.serviceBody}>
                    <span className={styles.serviceNum}>{service.num}</span>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.serviceDesc}>{service.desc}</p>
                    <span className={styles.serviceArrow}>→</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PHILOSOPHY ═══════ */}
      <section className={styles.philosophy}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.philosophyLayout}>
              {/* Founder portrait */}
              <div className={styles.founderPortrait}>
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80"
                  alt="Ar. Amit Sethi, Founder"
                  width={400}
                  height={500}
                  style={{ objectFit: "cover", width: '100%', height: '100%' }}
                />
              </div>

              {/* Quote content */}
              <div className={styles.philosophyContent}>
                <span className={`label-mono ${styles.sectionLabel}`}>
                  Our Philosophy
                </span>
                <h2 className={styles.sectionTitle}>
                  Simplicity is the <span className={styles.accent}>Key</span>
                </h2>
                <blockquote className={styles.philosophyQuote}>
                  &ldquo;We do not believe in creating complexities but we try to
                  establish harmony between the outward and the inward. Before
                  creating anything, an architect needs to observe most of the
                  things from micro to macro — and this is the simplest key to
                  design.&rdquo;
                </blockquote>
                <p className={styles.philosophyAuthor}>
                  — Ar. Amit Sethi, Founder
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS — infinite scrolling cards ═══════ */}
      <section className={styles.testimonials}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`label-mono ${styles.sectionLabel}`}>
                Client Voices
              </span>
              <h2 className={styles.sectionTitle}>
                Three Decades of <span className={styles.accent}>Trust</span>
              </h2>
            </div>
          </ScrollReveal>
        </div>

        {/* Marquee of testimonial cards */}
        <div className={styles.testimonialMarquee}>
          <div className={styles.testimonialTrack}>
            {testimonialItems.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <p className={styles.testimonialQuote}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className={styles.testimonialMeta}>
                  <span className={styles.testimonialAuthor}>{t.author}</span>
                  <span className={styles.testimonialProject}>{t.project}</span>
                </div>
              </div>
            ))}
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
                <span className={styles.accent}>Extraordinary?</span>
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
