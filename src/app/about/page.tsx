import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";

export const metadata: Metadata = {
  title: "About | ArchiDesignSolutions",
  description:
    "Three decades of architectural excellence. Meet the team behind ArchiDesignSolutions — three generations of architects designing India's future.",
};

const team = [
  {
    name: "Ar. Amit Sethi",
    title: "Founder & Principal Architect",
    quals: "B. Arch · Philosopher · Writer",
    desc: "With over three decades of experience, Ar. Amit Sethi has led the firm from its founding in 1999. His philosophy of simplicity and harmony between the outward and the inward drives every project the firm undertakes.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Ar. Prakriti Sethi",
    title: "Co-Founder & Design Principal",
    quals: "B.Arch (Honours) · Town Planner (ITPI) · Green Building Consultant (IGBC)",
    desc: "A registered Town Planner and IGBC-certified Green Building Consultant, Ar. Prakriti Sethi brings expertise in sustainable design and master planning to every project.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Ar. Archit Sethi",
    title: "Head of Innovation",
    quals: "B. Arch, School of Planning and Architecture, Delhi",
    desc: "The newest generation at ArchiDesignSolutions, Ar. Archit Sethi bridges traditional architecture with AI-powered design workflows, leading the firm's digital transformation.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
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
    url: "https://www.archzig.com",
    desc: "An architectural solutions platform powered by 500+ affiliated freelancers, delivering scalable, AI-integrated design services globally.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    name: "Architerrax",
    url: "https://www.instagram.com/architerrax",
    desc: "An architectural education and community platform focused on skill development, collaboration, and future-ready learning for designers.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className="container">
          <span className={`label-mono ${styles.label}`}>About Us</span>
          <h1 className={styles.heroTitle}>
            Three Generations.
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

      {/* ── Full-width Image Strip ── */}
      <section className={styles.imageStrip}>
        <div className={styles.imageStripInner}>
          <div className={styles.stripImage}>
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"
              alt="Modern residential architecture"
              fill
              style={{ objectFit: "cover" }}
              sizes="33vw"
            />
          </div>
          <div className={styles.stripImage}>
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
              alt="Interior design project"
              fill
              style={{ objectFit: "cover" }}
              sizes="33vw"
            />
          </div>
          <div className={styles.stripImage}>
            <Image
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80"
              alt="Contemporary building facade"
              fill
              style={{ objectFit: "cover" }}
              sizes="33vw"
            />
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className={styles.philosophy}>
        <div className="container">
          <ScrollReveal>
            <div className={styles.philosophyInner}>
              <div className={styles.philosophyLabel}>
                <span className="label-mono">Perception of Design</span>
                <div className={styles.philosophyLine} />
              </div>
              <div className={styles.philosophyContent}>
                <div className={styles.philosophyText}>
                  <p>
                    Spatial Design is human interaction with immediate surroundings;
                    the more smooth and natural it is, the better the design. The
                    contents that make this dialogue smooth on the human side include
                    cultural background, one&apos;s upbringing, values, thought &
                    philosophy.
                  </p>
                  <p>
                    Our design is based on simplicity. We do not believe in creating
                    complexities but we try to establish harmony between the outward
                    and the inward. Our aim is not to create static masses but we
                    love to play the music based on rhythm.
                  </p>
                  <p>
                    Before creating anything, an architect needs to observe most of
                    the things from micro to macro — and this is the simplest key to
                    design.
                  </p>
                </div>
                <div className={styles.philosophyImage}>
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85"
                    alt="Architectural detail showcasing design philosophy"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
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
          <div className={styles.venturesGrid}>
            {ventures.map((v, i) => (
              <ScrollReveal key={v.name} delay={i * 0.15}>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ventureCard}
                >
                  <div className={styles.ventureImage}>
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className={styles.ventureBody}>
                    <h3 className={styles.ventureName}>{v.name}</h3>
                    <p className={styles.ventureDesc}>{v.desc}</p>
                    <span className={styles.ventureLink}>Visit →</span>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
