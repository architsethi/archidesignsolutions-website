"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";

const services = [
  {
    id: "architecture",
    num: "01",
    title: "Architectural Design",
    tagline: "From concept to construction — innovative solutions for every building type.",
    tags: ["Residential", "Commercial", "Institutional", "Hospitality", "Mixed-Use"],
    description: "Complete architectural consultancy that maximises the value of every project — from first sketch to final handover.",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=85",
    filter: "Architecture",
  },
  {
    id: "interior",
    num: "02",
    title: "Interior Design",
    tagline: "Curated interiors that merge comfort with contemporary elegance.",
    tags: ["Space Planning", "FF&E", "Material Selection", "Lighting Design", "Custom Furniture"],
    description: "We create interior environments that go beyond aesthetics — our designs maximise function, optimise workflow, and create lasting emotional impact.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85",
    filter: "Interior",
  },
  {
    id: "masterplanning",
    num: "03",
    title: "Master Planning",
    tagline: "Strategic land-use planning for large-scale urban frameworks.",
    tags: ["Urban Design", "Zoning Strategy", "Infrastructure", "Phased Delivery", "Community Planning"],
    description: "We create spatial frameworks that optimise land use, guide infrastructure investment, and support phased delivery.",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=900&q=85",
    filter: "Urban Planning",
  },
  {
    id: "greenbuilding",
    num: "04",
    title: "Green Building Design",
    tagline: "Sustainable architecture with IGBC-aligned, energy-efficient systems.",
    tags: ["IGBC Certification", "Passive Cooling", "Solar Design", "Energy Modelling", "Rainwater Harvesting"],
    description: "Energy-efficient buildings typically use 40–60% less energy than conventional construction. We integrate green principles at every stage.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900&q=85",
    filter: "Green Building",
  },
  {
    id: "approvals",
    num: "05",
    title: "Approvals & Permissions",
    tagline: "Seamless regulatory compliance and permit handling.",
    tags: ["Building Permits", "Planning Submissions", "EIA Coordination", "Occupancy Certificates", "Compliance"],
    description: "We prepare complete, compliant application packages that reduce authority queries and accelerate approval timelines.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85",
    filter: "All",
  },
  {
    id: "mep",
    num: "06",
    title: "MEP Services",
    tagline: "Mechanical, electrical & plumbing engineering integrated with architecture.",
    tags: ["HVAC Design", "Electrical Systems", "Fire Safety", "BMS", "Plumbing & Drainage"],
    description: "MEP systems account for 30–40% of a building's construction cost. Our engineers design optimal systems from the outset.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85",
    filter: "All",
  },
  {
    id: "landscape",
    num: "07",
    title: "Landscape Design",
    tagline: "Beautiful outdoor environments that complement the built structure.",
    tags: ["Hardscaping", "Planting Design", "Water Features", "Outdoor Lighting", "Irrigation"],
    description: "We create outdoor environments that complement the architecture and maximise usable space.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&q=85",
    filter: "Landscape",
  },
  {
    id: "projectmgmt",
    num: "08",
    title: "Project Management",
    tagline: "End-to-end oversight — on time, on budget, on quality.",
    tags: ["Procurement", "Contract Admin", "Cost Control", "Quality Assurance", "Risk Management"],
    description: "Dedicated project managers who take full ownership of your programme, budget, and quality standards.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=85",
    filter: "All",
  },
];

export default function ServicesPage() {
  const gridRef = useRef<HTMLDivElement>(null);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      {/* ── Hero with background image ── */}
      <section className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=85"
          alt="Architectural services"
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <span className={`label-mono ${styles.heroLabel}`}>Our Services</span>
          <h1 className={styles.heroTitle}>
            Eight Disciplines.
            <br />
            One Unified Vision.
          </h1>
          <p className={styles.heroDesc}>
            From architectural blueprints to finished interiors — end-to-end
            design solutions across every stage of your project.
          </p>
          <div className={styles.heroActions}>
            <button onClick={scrollToGrid} className="btn btn-accent">
              Explore Services ↓
            </button>
            <Link href="/contact" className="btn btn-primary" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
              Start a Project →
            </Link>
          </div>
          {/* Quick service pills */}
          <div className={styles.heroPills}>
            {services.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={styles.heroPill}>
                <span className={styles.pillNum}>{s.num}</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
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

      {/* ── CTA ── */}
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
