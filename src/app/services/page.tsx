"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import { motion, AnimatePresence } from "framer-motion";

const defaultServices = [
  {
    id: "architecture",
    num: "01",
    title: "Architectural Design",
    heroTitle: "Defining Skylines,\nShaping Communities",
    tagline: "From concept to construction — innovative solutions for every building type.",
    tags: ["Residential", "Commercial", "Institutional", "Hospitality", "Mixed-Use"],
    description: "Complete architectural consultancy that maximises the value of every project — from first sketch to final handover.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85",
    filter: "Architecture",
  },
  {
    id: "interior",
    num: "02",
    title: "Interior Design",
    heroTitle: "Spaces That\nTell Stories",
    tagline: "Curated interiors that merge comfort with contemporary elegance.",
    tags: ["Space Planning", "FF&E", "Material Selection", "Lighting Design", "Custom Furniture"],
    description: "We create interior environments that go beyond aesthetics — our designs maximise function, optimise workflow, and create lasting emotional impact.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=85",
    filter: "Interior",
  },
  {
    id: "masterplanning",
    num: "03",
    title: "Master Planning",
    heroTitle: "Visionary Frameworks\nFor Tomorrow",
    tagline: "Strategic land-use planning and urban development frameworks for large-scale projects.",
    tags: ["Urban Design", "Zoning Strategy", "Infrastructure", "Phased Delivery", "Community Planning"],
    description: "We create spatial frameworks that optimise land use, guide infrastructure investment, and support phased delivery.",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1920&q=85",
    filter: "Urban Planning",
  },
  {
    id: "greenbuilding",
    num: "04",
    title: "Green Building Design",
    heroTitle: "Sustainable Design\nIn Harmony",
    tagline: "Sustainable architecture with IGBC-aligned, energy-efficient systems.",
    tags: ["IGBC Certification", "Passive Cooling", "Solar Design", "Energy Modelling", "Rainwater Harvesting"],
    description: "Energy-efficient buildings typically use 40–60% less energy than conventional construction. We integrate green principles at every stage.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=85",
    filter: "Green Building",
  },
  {
    id: "approvals",
    num: "05",
    title: "Approvals & Permits",
    heroTitle: "Navigating Regulations\nWith Precision",
    tagline: "Seamless regulatory compliance and permit handling.",
    tags: ["Building Permits", "Planning Submissions", "EIA Coordination", "Occupancy Certificates", "Compliance"],
    description: "We prepare complete, compliant application packages that reduce authority queries and accelerate approval timelines.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=85",
    filter: "All",
  },
  {
    id: "mep",
    num: "06",
    title: "MEP Services",
    heroTitle: "Engineering Systems\nThat Perform",
    tagline: "Mechanical, electrical & plumbing engineering integrated with architecture.",
    tags: ["HVAC Design", "Electrical Systems", "Fire Safety", "BMS", "Plumbing & Drainage"],
    description: "MEP systems account for 30–40% of a building's construction cost. Our engineers design optimal systems from the outset.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=85",
    filter: "All",
  },
  {
    id: "landscape",
    num: "07",
    title: "Landscape Design",
    heroTitle: "Nature Woven\nInto Architecture",
    tagline: "Beautiful outdoor environments that complement the built structure.",
    tags: ["Hardscaping", "Planting Design", "Water Features", "Outdoor Lighting", "Irrigation"],
    description: "We create outdoor environments that complement the architecture and maximise usable space.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=85",
    filter: "Landscape",
  },
  {
    id: "projectmgmt",
    num: "08",
    title: "Project Management",
    heroTitle: "Delivering Excellence\nOn Every Front",
    tagline: "End-to-end oversight — on time, on budget, on quality.",
    tags: ["Procurement", "Contract Admin", "Cost Control", "Quality Assurance", "Risk Management"],
    description: "Dedicated project managers who take full ownership of your programme, budget, and quality standards.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=85",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&q=85",
    filter: "All",
  },
];

export default function ServicesPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [services, setServices] = useState(defaultServices);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Auto-rotate */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [services.length]);

  /* Fetch live service images from API */
  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        if (d.servicesPageImages?.length) {
          setServices(prev =>
            prev.map((svc, i) => ({
              ...svc,
              // Update image and heroImage to use the dynamic image from API.
              // Also fallback to the title from the API if provided.
              image: d.servicesPageImages[i]?.img || svc.image,
              heroImage: d.servicesPageImages[i]?.img || svc.heroImage,
              title: d.servicesPageImages[i]?.title || svc.title,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      {/* ═══ HERO — full viewport with slider gallery ═══ */}
      <section className={styles.hero}>
        {/* Interactive grid overlay */}
        <InteractiveGrid className={styles.heroCanvas} />

        {/* Background Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            className={styles.heroImage}
            style={{ backgroundImage: `url(${services[activeSlide].heroImage})` }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>

        {/* White gradient overlay */}
        <div className={styles.heroGradient} />

        {/* Content */}
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            className={styles.heroLabel}
            key={`label-${activeSlide}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={styles.heroDot} />
            <span className="label-mono">{services[activeSlide].title}</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${activeSlide}`}
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {services[activeSlide].heroTitle.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            className={styles.heroSubtitle}
            key={`sub-${activeSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {services[activeSlide].tagline}
          </motion.p>

          <motion.div
            className={styles.heroCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <button onClick={scrollToGrid} className="btn btn-solid">
              Explore All Services ↓
            </button>
            <Link href="/contact" className="btn btn-primary">
              Start a Project →
            </Link>
          </motion.div>
        </div>

        {/* Service Tabs — full-width bottom bar */}
        <div className={styles.heroIndicators}>
          {services.map((service, i) => (
            <button
              key={service.id}
              className={`${styles.indicator} ${i === activeSlide ? styles.indicatorActive : ""}`}
              onClick={() => goToSlide(i)}
            >
              <span className={styles.indicatorNum}>{service.num}</span>
              <span className={styles.indicatorLabel}>{service.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ═══ Services Detail Grid ═══ */}
      <section className={styles.servicesSection} ref={gridRef}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.sectionHeader}>
              <span className={`label-mono ${styles.label}`}>What We Do</span>
              <h2 className={styles.sectionTitle}>Full-Spectrum Design Services</h2>
            </div>
          </ScrollReveal>

          <div className={styles.servicesGrid}>
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.05}>
                <Link
                  href={`/projects?filter=${encodeURIComponent(service.filter)}`}
                  id={service.id}
                  className={styles.serviceCard}
                >
                  <div className={styles.cardImage}>
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className={styles.cardImageOverlay}>
                      <span className={styles.cardNum}>{service.num}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <p className={styles.cardTagline}>{service.tagline}</p>
                    <div className={styles.cardTags}>
                      {service.tags.map((tag) => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <span className={styles.cardLink}>View Projects →</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className={styles.cta}>
        <div className="container" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <h2 className={styles.ctaTitle}>Need Expert Guidance?</h2>
            <p className={styles.ctaDesc}>
              Let&apos;s discuss which services best fit your project.
            </p>
            <Link href="/contact" className="btn btn-accent">
              Get In Touch →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
