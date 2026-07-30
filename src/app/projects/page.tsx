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
  categories?: string[];
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

function getProjectCategories(p: Project): string[] {
  if (p.categories && p.categories.length > 0) return p.categories;
  return p.category ? [p.category] : [];
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

const defaultCategories = [
  "Architectural Design",
  "Interior Design",
  "Landscape Design",
  "Green Building",
  "Town Planning",
  "MEP Engineering",
  "Architectural Branding",
  "Project Management",
];

const fallbackProjects: Project[] = [
  {
    "id": "bicholi-hapsi-high-rise",
    "title": "High-Rise Residential Complex",
    "subtitle": "Twin towers on a landscaped podium",
    "category": "Architectural Design",
    "categories": [
      "Architectural Design"
    ],
    "location": "Bicholi Hapsi, Indore",
    "year": "2018",
    "description": "A twin-tower residential development planned around a raised podium that lifts landscaped gardens and a swimming pool clear of the vehicular level. The scheme pairs 4BHK apartments of 2,198 sq ft with 5BHK duplexes of 4,170 sq ft, each opening to deep balconies on multiple sides. Parking is resolved across stilt and podium levels — the podium deck alone accommodating 42 cars — freeing the ground plane for landscape and approach.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-03-street-elevation.jpg",
    "featured": true,
    "stages": {
      "concept": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-01-typical-floor-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-02-podium-parking-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-03-stilt-parking-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-04-5bhk-lower-level-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-05-5bhk-upper-level-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-06-4bhk-unit-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-07-3bhk-unit-plan.jpg"
        ]
      },
      "construction": {
        "images": []
      },
      "completed": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-01-aerial-view.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-02-tower-detail.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-03-street-elevation.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-04-twin-towers.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-05-central-block.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-06-entrance-gate.jpg"
        ]
      }
    }
  },
  {
    "id": "shalimar-fortleza",
    "title": "Shalimar Fortleza",
    "subtitle": "High-rise luxury residences for Mirchandani Group",
    "category": "Architectural Design",
    "categories": [
      "Architectural Design"
    ],
    "location": "Hoshangabad Road, Bhopal",
    "year": "",
    "description": "Architectural design for Mirchandani Group's Shalimar Fortleza, a high-rise luxury residential development on a four-acre site in Bhopal. Tall residential blocks are arranged around a central landscaped plaza and clubhouse, approached through a formal gated entrance, with a classical vocabulary of colonnades, cornices and pitched-roof pavilions. Our scope ran from master plan and tower elevations through to the entrance gateway, carried from concept drawings into site execution.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-01-aerial-view.jpg",
    "featured": true,
    "stages": {
      "concept": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/drawing-01-master-plan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/drawing-02-front-elevation.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/drawing-03-entrance-gate-elevation.jpg"
        ]
      },
      "construction": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/construction-01-tower-facade.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/construction-02-structure.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/construction-03-site-progress.jpg"
        ]
      },
      "completed": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-01-aerial-view.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-02-entrance-gateway.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-03-central-plaza.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-04-tower-elevation.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-05-entrance-tower.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-06-tower-facade.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-07-approach-view.jpg"
        ]
      }
    }
  },
  {
    "id": "leeds-garden-city-platinum-park",
    "title": "LEEDS Garden City, Platinum & Park",
    "subtitle": "Township landscape and entry design",
    "category": "Town Planning",
    "categories": [
      "Town Planning",
      "Landscape Design"
    ],
    "location": "Indore",
    "year": "2024",
    "description": "Landscape and entry design across three Leeds Developers townships in Indore — Garden City, Platinum and Park. The work covers gateway structures and boundary treatments, boulevard streetscapes with shaded seating decks, and the central garden and clubhouse forecourt, using layered palm planting, uplighting and hard-landscape terracing to give each development a distinct arrival identity. Our firm is credited as project consultants on the architectural drawing sets.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-01-garden-city-entrance-dusk.jpg",
    "featured": true,
    "stages": {
      "concept": {
        "images": []
      },
      "construction": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-01-garden-city-entrance-dusk.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-02-garden-city-entrance.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-03-boulevard-streetscape.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-04-central-garden.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-05-clubhouse-forecourt.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-06-clubhouse-aerial.jpg"
        ]
      },
      "completed": {
        "images": []
      }
    }
  },
  {
    "id": "palm-springs-bhopal",
    "title": "Palm Springs",
    "subtitle": "Luxury holiday homes and farms",
    "category": "Architectural Design",
    "categories": [
      "Architectural Design",
      "Landscape Design",
      "Town Planning"
    ],
    "location": "Bhopal",
    "year": "2023",
    "description": "A plotted holiday-home and farm development set along a seasonal water stream outside Bhopal. The masterplan organises 42 plots, from 314 to 976 sq m, around a three-metre cycle track and pedestrian loop, with a restaurant, landscaped pockets and services planned into the first phase and further land held for a second. Individual A-frame villas sit lightly on the terrain, their steep roofs and exposed timber structure framing views out to the water and planting.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-05-cluster-aerial.jpg",
    "featured": true,
    "stages": {
      "concept": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/drawing-01-masterplan.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-01-waterfront-cycle-track.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-02-cycle-track-aerial.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-03-villa-garden-aerial.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-04-pool-deck.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-05-cluster-aerial.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-06-villa-frontage.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-07-villa-elevation.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-08-street-view.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/render-09-waterside-aerial.jpg"
        ]
      },
      "construction": {
        "images": []
      },
      "completed": {
        "images": []
      }
    }
  },
  {
    "id": "shobha-jain-residence",
    "title": "Shobha Jain Residence",
    "subtitle": "Living room interior",
    "category": "Interior Design",
    "categories": [
      "Interior Design"
    ],
    "location": "Indore",
    "year": "2024",
    "description": "A living room interior for a private residence, organised around a fluted timber feature wall and a layered ceiling that carries concealed lighting across the plan. Panelled walls, a muted grey upholstery palette and a mirrored dining edge extend the sense of space while keeping the room warm and unmistakably residential.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-01.jpg",
    "featured": false,
    "stages": {
      "concept": {
        "images": []
      },
      "construction": {
        "images": []
      },
      "completed": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-01.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-02.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-03.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-04.jpg"
        ]
      }
    }
  },
  {
    "id": "bhatnagar-residence",
    "title": "Mr. Bhatnagar's Residence",
    "subtitle": "Living room interior",
    "category": "Interior Design",
    "categories": [
      "Interior Design"
    ],
    "location": "Indore",
    "year": "",
    "description": "Concept design for the living room of a private residence in Indore. The scheme works with generous ceiling height and full-height glazing, using a sculptural linear light, fluted screens and a soft neutral palette of plaster, oak and stone to hold the volume together. Currently under construction — completed photography to follow.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-01-living-room.jpg",
    "featured": false,
    "stages": {
      "concept": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-01-living-room.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-02-living-room.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-03-living-room.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-04-living-room.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-05-living-room.jpg"
        ]
      },
      "construction": {
        "images": []
      },
      "completed": {
        "images": []
      }
    }
  },
  {
    "id": "rathi-residence",
    "title": "Mr. Rathi's Residence",
    "subtitle": "Living room interior, Emaar Indore Greens",
    "category": "Interior Design",
    "categories": [
      "Interior Design"
    ],
    "location": "Emaar Indore Greens, Indore",
    "year": "",
    "description": "A living room interior within a residence at Emaar Indore Greens. Double-height ceilings are articulated with exposed timber beams, set against a teal panelled accent wall in glass and metal that screens the stair beyond. A bespoke mandir, brass detailing and a restrained grey seating palette balance the scale of the volume against the intimacy the family wanted.",
    "image": "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-01.jpg",
    "featured": false,
    "stages": {
      "concept": {
        "images": []
      },
      "construction": {
        "images": []
      },
      "completed": {
        "images": [
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-01.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-02.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-03.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-04.jpg",
          "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-05.jpg"
        ]
      }
    }
  }
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
              {project.year && (
                <span className={styles.modalMetaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {project.year}
                </span>
              )}
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

  const categories = (() => {
    const projectCats = new Set<string>();
    projects.forEach((p) => getProjectCategories(p).forEach((c) => projectCats.add(c)));
    const ordered = defaultCategories.filter((c) => projectCats.has(c));
    const extra = [...projectCats].filter((c) => !defaultCategories.includes(c));
    return ["All", ...ordered, ...extra];
  })();

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
  }, [filterParam, categories]);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => getProjectCategories(p).includes(activeCategory));

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
          <div className={styles.filterDropdown}>
            <select
              className={styles.filterDropdownSelect}
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
                        {project.year && (
                          <>
                            <span className={styles.metaDot}>·</span>
                            <span>{project.year}</span>
                          </>
                        )}
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
