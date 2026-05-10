"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";

const categories = [
  "All",
  "Architecture",
  "Interior",
  "Urban Planning",
  "Green Building",
  "Landscape",
  "Site Pictures",
  "Social Cause",
];

const projects = [
  { id: 1, title: "Modern Residential Complex", category: "Architecture", location: "Indore", year: "2024", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80" },
  { id: 2, title: "Luxury Villa Interior", category: "Interior", location: "Bhopal", year: "2023", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" },
  { id: 3, title: "Township Masterplan", category: "Urban Planning", location: "Indore", year: "2023", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" },
  { id: 4, title: "Corporate Office Design", category: "Architecture", location: "Indore", year: "2024", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
  { id: 5, title: "Heritage Restoration", category: "Architecture", location: "Mhow", year: "2022", image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80" },
  { id: 6, title: "Boutique Hotel Interior", category: "Interior", location: "Indore", year: "2024", image: "https://images.unsplash.com/photo-1590490360182-c33d7d9d4864?w=800&q=80" },
  { id: 7, title: "Community Park Design", category: "Landscape", location: "Indore", year: "2023", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80" },
  { id: 8, title: "School Campus Planning", category: "Social Cause", location: "Indore", year: "2022", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80" },
  { id: 9, title: "Construction Phase Documentation", category: "Site Pictures", location: "Bhopal", year: "2024", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
  { id: 10, title: "Green Office Campus", category: "Green Building", location: "Indore", year: "2024", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: 11, title: "Smart City Sector Plan", category: "Urban Planning", location: "Ujjain", year: "2023", image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80" },
  { id: 12, title: "Eco Resort Villas", category: "Green Building", location: "Pachmarhi", year: "2024", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" },
];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (filterParam && categories.includes(filterParam)) {
      setActiveCategory(filterParam);
    }
  }, [filterParam]);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className={`label-mono ${styles.label}`}>Our Work</span>
          <h1 className={styles.heroTitle}>
            Projects That
            <br />
            Define Spaces
          </h1>
          <p className={styles.heroDesc}>
            A curated selection from over 500 projects delivered across residential,
            commercial, institutional, and urban design.
          </p>
        </div>
      </section>

      <section className={styles.filter}>
        <div className="container">
          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        <div className="container">
          <div className={styles.projectsGrid}>
            {filtered.map((project, i) => (
              <ScrollReveal key={project.id} delay={i * 0.05}>
                <div className={styles.projectCard}>
                  <div className={styles.projectImage}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className={styles.projectOverlay}>
                      <span className={styles.projectCategory}>{project.category}</span>
                    </div>
                  </div>
                  <div className={styles.projectInfo}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <div className={styles.projectMeta}>
                      <span>{project.location}</span>
                      <span className={styles.metaDot}>·</span>
                      <span>{project.year}</span>
                    </div>
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className={styles.page} style={{ paddingTop: 72, minHeight: "100vh" }} />}>
      <ProjectsContent />
    </Suspense>
  );
}
