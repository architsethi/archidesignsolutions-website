import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Services | ArchiDesignSolutions",
  description: "Eight specialised design disciplines under one roof — from architectural blueprints to finished interiors.",
};

const services = [
  {
    id: "architecture",
    num: "01",
    title: "Architectural Design",
    tagline: "Innovative solutions balancing aesthetics, function, and structural integrity for every building type.",
    description: "Complete architectural consultancy that maximises the value of every project — from first sketch to final handover. Our clients consistently find that the right design decisions made early save them 10× our fee in avoided construction errors, regulatory rejections, and expensive redesigns.",
    deliverables: ["Site feasibility & analysis", "Conceptual & schematic design", "Planning & building permit drawings", "Detailed construction documentation", "3D visualization & client presentations", "Site supervision & contractor coordination"],
  },
  {
    id: "interior",
    num: "02",
    title: "Interior Design",
    tagline: "Curated interiors that reflect your personality — merging comfort with contemporary elegance.",
    description: "We create interior environments that go beyond aesthetics — our designs are carefully planned to maximise function, optimise workflow, and create lasting emotional impact.",
    deliverables: ["Space planning & furniture layouts", "Concept design & moodboards", "Material & finish specifications", "FF&E schedules & procurement", "Lighting design & electrical coordination", "Contractor supervision & installation oversight"],
  },
  {
    id: "masterplanning",
    num: "03",
    title: "Master Planning",
    tagline: "Strategic land-use planning and urban development frameworks for large-scale projects.",
    description: "Master planning is the foundation of every successful large-scale development. We create spatial frameworks that optimise land use, guide infrastructure investment, and support phased delivery.",
    deliverables: ["Land use analysis & zoning strategy", "Site layout & circulation planning", "Open space & community amenity design", "Infrastructure & services coordination", "Phased delivery frameworks", "Regulatory submission packages"],
  },
  {
    id: "greenbuilding",
    num: "04",
    title: "Green Building Design",
    tagline: "Sustainable architecture with energy-efficient systems and eco-friendly, IGBC-aligned materials.",
    description: "We integrate green building principles into every stage of design — not as an afterthought, but as a core strategy. Energy-efficient buildings typically use 40–60% less energy than conventional construction.",
    deliverables: ["Passive cooling & natural ventilation", "Solar orientation & daylighting optimisation", "Sustainable & low-carbon material selection", "Energy modelling & performance simulation", "EDGE, LEED & local green certification", "Rainwater harvesting & grey water systems"],
  },
  {
    id: "approvals",
    num: "05",
    title: "Approvals & Permissions",
    tagline: "Seamless handling of regulatory approvals, building permits, and compliance documentation.",
    description: "Securing planning and building approvals is a complex, time-sensitive process. We prepare complete, compliant application packages that reduce authority queries and accelerate approval timelines.",
    deliverables: ["Building permit applications", "Planning authority submissions", "Development permit applications", "Environmental Impact Assessment coordination", "Compliance support", "Certificate of Occupancy applications"],
  },
  {
    id: "mep",
    num: "06",
    title: "MEP Services",
    tagline: "Mechanical, electrical and plumbing engineering seamlessly integrated with architectural plans.",
    description: "MEP systems account for 30–40% of a building's construction cost. Our MEP engineers ensure these systems are designed optimally from the outset — preventing costly redesigns.",
    deliverables: ["HVAC system design & load calculations", "Electrical power distribution & lighting", "Cold water, hot water & drainage systems", "Fire detection, suppression & evacuation", "Building Management System (BMS) design", "Low-voltage: data, security, AV & access control"],
  },
  {
    id: "landscape",
    num: "07",
    title: "Landscape Design",
    tagline: "Beautiful outdoor environments designed to complement and extend the built structure.",
    description: "A well-designed landscape is as important as the building it surrounds. We create outdoor environments that complement the architecture and maximise usable space.",
    deliverables: ["Landscape concept design & masterplanning", "Planting schemes suited to climate", "Hardscaping: paving, walls, terraces & pergolas", "Outdoor water features & pool surrounds", "Irrigation & drainage system design", "Outdoor lighting design"],
  },
  {
    id: "projectmgmt",
    num: "08",
    title: "Project Management",
    tagline: "End-to-end oversight ensuring timely delivery within budget and quality standards.",
    description: "We provide dedicated, experienced project managers who take full ownership of your programme, budget, and quality standards. From contractor selection through to final handover.",
    deliverables: ["Pre-construction planning & programme development", "Contractor tender & procurement management", "Contract administration & cost control", "Construction phase quality oversight", "Risk identification & mitigation", "Handover, commissioning & defects liability"],
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className={`label-mono ${styles.label}`}>Our Services</span>
          <h1 className={styles.heroTitle}>
            Eight Disciplines.
            <br />
            One Unified Vision.
          </h1>
          <p className={styles.heroDesc}>
            From architectural blueprints to finished interiors — end-to-end
            design solutions across every stage of your project.
          </p>
        </div>
      </section>

      <section className={styles.servicesList}>
        <div className="container">
          {services.map((service, i) => (
            <ScrollReveal key={service.id}>
              <div id={service.id} className={styles.serviceBlock}>
                <div className={styles.serviceHeader}>
                  <span className={styles.serviceNum}>{service.num}</span>
                  <div>
                    <h2 className={styles.serviceTitle}>{service.title}</h2>
                    <p className={styles.serviceTagline}>{service.tagline}</p>
                  </div>
                </div>
                <div className={styles.serviceBody}>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <div className={styles.deliverables}>
                    <span className={`label-mono ${styles.delLabel}`}>What We Deliver</span>
                    <ul className={styles.delList}>
                      {service.deliverables.map((d) => (
                        <li key={d} className={styles.delItem}>
                          <span className={styles.delBullet} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

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
