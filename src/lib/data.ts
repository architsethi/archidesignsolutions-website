import { put, list, del } from "@vercel/blob";

const DATA_KEY = "site-data.json";

/* ═══ Default site data (used on first load / seed) ═══ */
export interface GalleryImage {
  src: string;
  label: string;
}

export interface TeamMember {
  name: string;
  title: string;
  quals: string;
  desc: string;
  image: string;
}

export interface ContactInfo {
  phones: string[];
  emails: string[];
  address: string;
  mapUrl: string;
}

export type ProjectStage = "concept" | "construction" | "completed";

export interface ProjectStageData {
  images: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string; // cover/thumbnail image
  featured: boolean;
  stages: {
    concept?: ProjectStageData;
    construction?: ProjectStageData;
    completed?: ProjectStageData;
  };
}

/** Returns the highest stage that has images */
export function getProjectDisplayStage(project: Project): ProjectStage {
  if (project.stages.completed && project.stages.completed.images.length > 0) return "completed";
  if (project.stages.construction && project.stages.construction.images.length > 0) return "construction";
  if (project.stages.concept && project.stages.concept.images.length > 0) return "concept";
  return "concept";
}

export const stageLabels: Record<ProjectStage, string> = {
  concept: "Concept",
  construction: "Under Construction",
  completed: "Completed",
};

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  status: "published" | "draft";
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteData {
  gallery: GalleryImage[];
  team: TeamMember[];
  contact: ContactInfo;
  projects: Project[];
  blogs: BlogPost[];
}

export const defaultSiteData: SiteData = {
  gallery: [
    { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", label: "Residential High-Rise" },
    { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", label: "Residence Design" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", label: "Office Spaces" },
    { src: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=80", label: "Town Planning" },
    { src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80", label: "Urban Design" },
    { src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", label: "Interior Design" },
    { src: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80", label: "Landscape Design" },
    { src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80", label: "MEP Engineering" },
  ],
  team: [
    {
      name: "Ar. Amit Sethi",
      title: "Founder & Principal Architect",
      quals: "B. Arch · Philosopher · Writer",
      desc: "With over three decades of experience, Ar. Amit Sethi has led the firm from its founding in 1999. His philosophy of simplicity and harmony between the outward and the inward drives every project the firm undertakes.",
      image: "/images/team/amit-sethi.png",
    },
    {
      name: "Ar. Prakriti Sethi",
      title: "Co-Founder & Design Principal",
      quals: "B.Arch (Honours) · Town Planner (ITPI) · Green Building Consultant (IGBC)",
      desc: "A registered Town Planner and IGBC-certified Green Building Consultant, Ar. Prakriti Sethi brings expertise in sustainable design and master planning to every project.",
      image: "/images/team/prakriti-sethi.png",
    },
    {
      name: "Ar. Archit Sethi",
      title: "Head of Innovation",
      quals: "B. Arch, School of Planning and Architecture, Delhi",
      desc: "The newest generation at ArchiDesignSolutions, Ar. Archit Sethi bridges traditional architecture with AI-powered design workflows, leading the firm's digital transformation.",
      image: "/images/team/archit-sethi.png",
    },
  ],
  contact: {
    phones: ["+91-731-4045559", "+91-9302101559"],
    emails: ["archidesignsolutions@gmail.com"],
    address: "301, Prakriti Corporate, 3rd Floor, Y.N. Road, Indore, Madhya Pradesh 452001",
    mapUrl: "https://www.google.com/maps/place/Prakriti+Corporate/@22.7195,75.8582,17z",
  },
  projects: [
    {
      id: "p1",
      title: "Emerald Heights Residences",
      category: "Residential",
      location: "Indore, MP",
      year: "2023",
      description: "A luxury residential complex featuring modern architecture with sustainable design principles.",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      featured: true,
      stages: {
        concept: { images: [] },
        construction: { images: [] },
        completed: { images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"] },
      },
    },
    {
      id: "p2",
      title: "Sapphire Corporate Tower",
      category: "Commercial",
      location: "Indore, MP",
      year: "2022",
      description: "A state-of-the-art office complex designed for modern workspaces with energy-efficient systems.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      featured: true,
      stages: {
        concept: { images: [] },
        construction: { images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"] },
        completed: { images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"] },
      },
    },
    {
      id: "p3",
      title: "Heritage Villa Restoration",
      category: "Heritage",
      location: "Indore, MP",
      year: "2021",
      description: "Meticulous restoration of a colonial-era villa, preserving heritage while adding modern amenities.",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
      featured: false,
      stages: {
        concept: { images: ["https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80"] },
        construction: { images: [] },
        completed: { images: [] },
      },
    },
  ],
  blogs: [
    {
      id: "b1",
      title: "The Future of Sustainable Architecture in India",
      slug: "future-sustainable-architecture-india",
      excerpt: "Exploring how green building practices are reshaping India's architectural landscape.",
      content: "India's architectural landscape is undergoing a profound transformation...",
      image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
      category: "Sustainability",
      author: "Ar. Prakriti Sethi",
      status: "published",
      seoTitle: "The Future of Sustainable Architecture in India | ArchiDesignSolutions",
      seoDescription: "Exploring how green building practices are reshaping India's architectural landscape.",
      seoKeywords: "sustainable architecture, green building, India, IGBC",
      createdAt: "2025-10-15T10:00:00Z",
      updatedAt: "2025-10-15T10:00:00Z",
    },
    {
      id: "b2",
      title: "AI in Architecture: Revolution or Evolution?",
      slug: "ai-architecture-revolution-evolution",
      excerpt: "How artificial intelligence is changing the way architects design and deliver projects.",
      content: "The integration of AI into architectural workflows is no longer a distant dream...",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
      category: "Technology",
      author: "Ar. Archit Sethi",
      status: "published",
      seoTitle: "AI in Architecture: Revolution or Evolution? | ArchiDesignSolutions",
      seoDescription: "How artificial intelligence is changing the way architects design and deliver projects.",
      seoKeywords: "AI architecture, artificial intelligence, design technology",
      createdAt: "2025-11-20T10:00:00Z",
      updatedAt: "2025-11-20T10:00:00Z",
    },
  ],
};

/* ═══ CRUD operations ═══ */

export async function getSiteData(): Promise<SiteData> {
  try {
    const { blobs } = await list({ prefix: DATA_KEY });
    if (blobs.length === 0) {
      // Seed with default data
      await saveSiteData(defaultSiteData);
      return defaultSiteData;
    }
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    const data = await response.json();
    return data as SiteData;
  } catch {
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  // Delete existing blob first
  try {
    const { blobs } = await list({ prefix: DATA_KEY });
    for (const blob of blobs) {
      await del(blob.url);
    }
  } catch {
    // ignore
  }
  await put(DATA_KEY, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: "public",
  });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // ignore
  }
}
