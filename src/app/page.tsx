"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
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
/* ═══ Homepage Component ═══ */
export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  /* Track mouse for parallax */
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width - 0.5;
        const cy = (e.clientY - rect.top) / rect.height - 0.5;
        heroRef.current.style.setProperty("--mx", `${cx * 20}px`);
        heroRef.current.style.setProperty("--my", `${cy * 12}px`);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <div className={styles.page}>
      {/* ═══════ HERO ═══════ */}
      <section className={styles.hero} ref={heroRef}>
        <InteractiveGrid className={styles.heroCanvas} />

        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={styles.heroImage}
            style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>

        {/* White gradient overlay */}
        <div className={styles.heroGradient} />

        {/* ── Slide Counter (top-right) ── */}
        <div className={styles.heroCounter}>
          <span className={styles.heroCounterCurrent}>
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <span className={styles.heroCounterDivider} />
          <span className={styles.heroCounterTotal}>
            {String(heroSlides.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Nav Arrows (right side) ── */}
        <div className={styles.heroNav}>
          <button className={styles.heroNavBtn} onClick={prevSlide} aria-label="Previous slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className={styles.heroNavBtn} onClick={nextSlide} aria-label="Next slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* ── Content with mouse parallax ── */}
        <div className={`container ${styles.heroContent}`}>
          {/* Category label */}
          <AnimatePresence mode="wait">
            <motion.div
              className={styles.heroLabel}
              key={`label-${currentSlide}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.heroDot} />
              <span className="label-mono">{heroSlides[currentSlide].label}</span>
            </motion.div>
          </AnimatePresence>

          {/* Title — parallax shifted by mouse */}
          <div className={styles.heroTitleWrap}>
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {heroSlides[currentSlide].title.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Explore link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Link href="/projects" className={styles.heroExplore}>
              <span>Explore Projects</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Bottom category bar ── */}
        <div className={styles.heroIndicators}>
          {heroSlides.map((slide, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === currentSlide ? styles.active : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to ${slide.label}`}
            >
              <span className={styles.indicatorLabel}>{slide.label}</span>
              <span className={styles.indicatorProgress}>
                {i === currentSlide && (
                  <motion.span
                    className={styles.indicatorFill}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
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
