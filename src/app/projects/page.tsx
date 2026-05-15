"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import TypewriterAccent from "@/components/TypewriterAccent";

type ProjectStage = "concept" | "construction" | "completed";

interface ProjectStageData {
  images: string[];
}

interface Project {
  id: string;
  title: string;
  subtitle?: string;
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

function getAllImages(p: Project): string[] {
  const images: string[] = [];
  for (const stage of stageOrder) {
    const stageData = p.stages?.[stage];
    if (stageData?.images) {
      images.push(...stageData.images);
    }
  }
  if (images.length === 0 && p.image) {
    images.push(p.image);
  }
  return images;
}

const categories = [
  "All",
  "Architectural Design",
  "Interior Design",
  "Landscape Design",
  "Green Building",
  "Town Planning",
  "MEP Engineering",
  "Branding & Promotion",
  "Project Management",
];

const fallbackProjects: Project[] = [
  { id: "1", title: "Modern Residential Complex", category: "Architectural Design", location: "Indore", year: "2024", description: "A contemporary residential complex featuring clean lines, open floor plans, and sustainable design principles.", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", featured: true, stages: { concept: { images: [] }, construction: { images: [] }, completed: { images: ["https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80"] } } },
  { id: "2", title: "Luxury Villa Interior", category: "Interior Design", location: "Bhopal", year: "2023", description: "A seamless blend of modern aesthetics and Indian sensibility — warm, beautiful, entirely personal.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", featured: false, stages: { concept: { images: [] }, construction: { images: [] }, completed: { images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"] } } },
  { id: "3", title: "Township Masterplan", category: "Town Planning", location: "Indore", year: "2023", description: "Visionary master planning for a 200-acre township with integrated infrastructure and community spaces.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", featured: false, stages: { concept: { images: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"] }, construction: { images: [] }, completed: { images: [] } } },
];

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStage, setActiveStage] = useState<ProjectStage>("completed");
  const availableStages = getAvailableStages(project);
  const allImages = getAllImages(project);

  useEffect(() => {
    if (availableStages.length > 0) {
      setActiveStage(availableStages[availableStages.length - 1]);
    }
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
  }, [activeStage]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [currentSlide, allImages.length]);

  const stageImages = project.stages?.[activeStage]?.images || [];
  const displayImages = stageImages.length > 0 ? stageImages : allImages;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  const displayStage = getDisplayStage(project);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.modalBody}>
          {/* Left: Image Slider */}
          <div className={styles.modalGallery}>
            <div className={styles.modalSlider}>
              {displayImages.length > 0 && (
                <Image
                  src={displayImages[currentSlide]}
                  alt={`${project.title} — ${currentSlide + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              )}

              {displayImages.length > 1 && (
                <>
                  <button className={`${styles.sliderNav} ${styles.sliderPrev}`} onClick={prevSlide}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button className={`${styles.sliderNav} ${styles.sliderNext}`} onClick={nextSlide}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Slide indicators */}
            {displayImages.length > 1 && (
              <div className={styles.sliderDots}>
                {displayImages.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.sliderDot} ${i === currentSlide ? styles.sliderDotActive : ""}`}
                    onClick={() => setCurrentSlide(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Project Details */}
          <div className={styles.modalDetails}>
            <div className={styles.modalStageBadge} data-stage={displayStage}>
              {stageLabels[displayStage]}
            </div>
            <h2 className={styles.modalTitle}>{project.title}</h2>
            {project.subtitle && (
              <p className={styles.modalSubtitle}>{project.subtitle}</p>
            )}
            <div className={styles.modalMeta}>
              <span className={styles.modalMetaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {project.location}
              </span>
              <span className={styles.modalMetaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {project.year}
              </span>
              <span className={styles.modalMetaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                {project.category}
              </span>
            </div>

            {project.description && (
              <p className={styles.modalDescription}>{project.description}</p>
            )}

            {/* Stage tabs */}
            {availableStages.length > 1 && (
              <div className={styles.modalStages}>
                <span className={styles.modalStagesLabel}>View Stage:</span>
                <div className={styles.modalStageTabs}>
                  {availableStages.map((s) => (
                    <button
                      key={s}
                      className={`${styles.modalStageTab} ${activeStage === s ? styles.modalStageTabActive : ""}`}
                      onClick={() => setActiveStage(s)}
                    >
                      {stageLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.modalImageCount}>
              {displayImages.length > 0 && (
                <span>{currentSlide + 1} / {displayImages.length} images</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");

  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
    if (filterParam) {
      const decoded = decodeURIComponent(filterParam);
      const match = categories.find((c) => c === decoded);
      if (match) setActiveCategory(match);
    }
  }, [filterParam]);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className={`container ${styles.heroInner}`}>
          <span className={`label-mono ${styles.label}`}>Our Work</span>
          <h1 className={styles.heroTitle}>
            Projects That
            <br />
            Define <TypewriterAccent words={["Spaces", "Skylines", "Generations"]} />
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

              return (
                <ScrollReveal key={project.id} delay={i * 0.05}>
                  <div
                    className={styles.projectCard}
                    onClick={() => setSelectedProject(project)}
                  >
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
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
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
