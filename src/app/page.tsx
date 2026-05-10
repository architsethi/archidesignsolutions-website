"use client";

import { useEffect, useState } from "react";
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

/* ═══ Homepage ═══ */
export default function HomePage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  /* Auto-rotate testimonials */
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  /* Double the gallery for seamless infinite loop */
  const marqueeItems = [...galleryImages, ...galleryImages];

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
              <span className={styles.heroTitleLight}>that </span>
              <span className={styles.heroTitleBold}>define </span>
              <span className={styles.heroTitleFade}>gener</span>
              <span className={styles.heroTitleAccent}>ations</span>
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

        {/* ── Infinite Scrolling Gallery ── */}
        <motion.div
          className={styles.marqueeWrap}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.marqueeTrack}>
            {marqueeItems.map((img, i) => (
              <div key={i} className={styles.marqueeCard}>
                <div className={styles.marqueeImageWrap}>
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="360px"
                  />
                </div>
                <span className={styles.marqueeLabel}>{img.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
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
