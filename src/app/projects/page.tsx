"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";

type ProjectStage = "concept" | "construction" | "completed";

interface ProjectStageData {
  images: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  featured: boolean;
  stages: {
    concept?: ProjectStageData;
    construction?: ProjectStageData;
    completed?: ProjectStageData;
  };
}

const stageLabels: Record<ProjectStage, string> = {
  concept: "Concept",
  construction: "Under Construction",
  completed: "Completed",
};

const stageOrder: ProjectStage[] = ["concept", "construction", "completed"];

function getDisplayStage(p: Project): ProjectStage {
  if (p.stages?.completed && p.stages.completed.images.length > 0) return "completed";
  if (p.stages?.construction && p.stages.construction.images.length > 0) return "construction";
  return "concept";
}

function getAvailableStages(p: Project): ProjectStage[] {
  return stageOrder.filter(
    (s) => p.stages?.[s] && p.stages[s]!.images.length > 0
  );
}

const categories = [
  "All",
  "Residential",
  "Commercial",
  "Heritage",
  "Institutional",
  "Interior",
  "Urban Planning",
  "Landscape",
];

// Fallback projects if API unavailable
const fallbackProjects: Project[] = [
  { id: "1", title: "Modern Residential Complex", category: "Residential", location: "Indore", year: "2024", description: "", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", featured: true, stages: { concept: { images: [] }, construction: { images: [] }, completed: { images: ["https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80"] } } },
  { id: "2", title: "Luxury Villa Interior", category: "Interior", location: "Bhopal", year: "2023", description: "", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", featured: false, stages: { concept: { images: [] }, construction: { images: [] }, completed: { images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"] } } },
  { id: "3", title: "Township Masterplan", category: "Urban Planning", location: "Indore", year: "2023", description: "", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", featured: false, stages: { concept: { images: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"] }, construction: { images: [] }, completed: { images: [] } } },
];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeStageTab, setActiveStageTab] = useState<ProjectStage>("concept");

  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects && d.projects.length > 0) {
          setProjects(d.projects.map((p: Project) => ({
            ...p,
            stages: p.stages || { concept: { images: [] }, construction: { images: [] }, completed: { images: [] } },
          })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (filterParam && categories.includes(filterParam)) {
      setActiveCategory(filterParam);
    }
  }, [filterParam]);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const handleExpand = (project: Project) => {
    if (expandedId === project.id) {
      setExpandedId(null);
    } else {
      setExpandedId(project.id);
      // Set active stage to highest available
      const available = getAvailableStages(project);
      if (available.length > 0) {
        setActiveStageTab(available[available.length - 1]);
      }
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className={`container ${styles.heroInner}`}>
          <span className={`label-mono ${styles.label}`}>Our Work</span>
          <h1 className={styles.heroTitle}>
            Projects That
            <br />
            Define <span className={styles.accent}>Spaces</span>
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
            {filtered.map((project, i) => {
              const displayStage = getDisplayStage(project);
              const isExpanded = expandedId === project.id;
              const availableStages = getAvailableStages(project);
              const stageImages = project.stages?.[activeStageTab]?.images || [];

              return (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <div className={`${styles.projectCard} ${isExpanded ? styles.projectCardExpanded : ""}`}>
                    <div className={styles.projectImage} onClick={() => handleExpand(project)}>
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
                      {/* Stage badge */}
                      <div className={styles.projectStageBadge} data-stage={displayStage}>
                        {stageLabels[displayStage]}
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

                    {/* Expanded detail view */}
                    {isExpanded && (
                      <div className={styles.projectExpanded}>
                        {project.description && (
                          <p className={styles.projectDescription}>{project.description}</p>
                        )}

                        {availableStages.length > 0 && (
                          <>
                            <div className={styles.stageTabs}>
                              {availableStages.map((s) => (
                                <button
                                  key={s}
                                  className={`${styles.stageTab} ${activeStageTab === s ? styles.stageTabActive : ""}`}
                                  onClick={() => setActiveStageTab(s)}
                                >
                                  {stageLabels[s]}
                                </button>
                              ))}
                            </div>

                            {stageImages.length > 0 && (
                              <div className={styles.stageGallery}>
                                {stageImages.map((src, idx) => (
                                  <div key={idx} className={styles.stageImageWrap}>
                                    <Image
                                      src={src}
                                      alt={`${project.title} — ${stageLabels[activeStageTab]} ${idx + 1}`}
                                      fill
                                      style={{ objectFit: "cover" }}
                                      sizes="(max-width: 768px) 100vw, 300px"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
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
