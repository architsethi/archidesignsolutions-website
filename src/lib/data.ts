import { put, list, del } from "@vercel/blob";

const DATA_KEY = "site-data.json";

/* ═══ Default site data (used on first load / seed) ═══ */
export interface GalleryImage {
  src: string;
  label: string;
  link?: string;
}

export interface TeamMember {
  name: string;
  title: string;
  quals: string;
  desc: string;
  image: string;
  linkedin?: string;
  instagram?: string;
}

export interface SocialLinks {
  instagram?: string;
  whatsapp?: string;
  facebook?: string;
  linkedin?: string;
}

export interface ContactInfo {
  phones: string[];
  emails: string[];
  address: string;
  mapEmbedUrl?: string;
  socials?: SocialLinks;
  archzigUrl?: string;
  architerraxUrl?: string;
}

export type ProjectStage = "concept" | "construction" | "completed";

export interface ProjectStageData {
  images: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  categories?: string[];
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

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  project: string;
  image: string; // thumbnail — empty string = show default avatar
}

export interface ServiceImage {
  title: string;
  img: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface SiteData {
  gallery: GalleryImage[];
  team: TeamMember[];
  contact: ContactInfo;
  projects: Project[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  homeServiceImages: ServiceImage[];
  contactSubmissions: ContactSubmission[];
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
    phones: ["+91-9826375507", "+91-9179797359"],
    emails: ["archidesignsolutions@gmail.com"],
    address: "208B, Prakriti Corporate, Y.N. Road, Indore 452001",
    socials: {
      instagram: "https://www.instagram.com/archidesignsolutions/",
      whatsapp: "https://wa.me/919179797359",
      facebook: "https://facebook.com/archidesignsolutions",
      linkedin: "https://linkedin.com/company/archidesignsolutions",
    },
  },
  projects: [
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
    }
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
  testimonials: [
    { id: "t1", quote: "Working with ArchiDesignSolutions transformed our vision. Their attention to detail and commitment to timeless design is unmatched.", author: "Rajesh Malhotra", project: "Private Residence, Indore", image: "" },
    { id: "t2", quote: "From concept to completion, the team delivered beyond all expectations. Our office complex has become a Bhopal landmark.", author: "Priya Sharma", project: "Office Complex, Bhopal", image: "" },
    { id: "t3", quote: "Our home is a seamless blend of modern aesthetics and Indian sensibility — warm, beautiful, entirely ours.", author: "Vikram & Anita Joshi", project: "Luxury Villa, Indore", image: "" },
    { id: "t4", quote: "Their green building expertise helped us achieve LEED certification while keeping costs in check. Exceptional professionals.", author: "Dr. Sunil Kapoor", project: "Green Campus Project", image: "" },
    { id: "t5", quote: "The master planning they delivered for our township project was visionary — infrastructure, community spaces, everything considered.", author: "Aditya Mehta", project: "Township, Bhopal", image: "" },
    { id: "t6", quote: "Incredible interior work. Every room tells a story. The material palette they chose is both luxurious and understated.", author: "Kavita Deshmukh", project: "Boutique Hotel, Ujjain", image: "" },
  ],
  homeServiceImages: [
    { title: "Architectural Design", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/01-architectural-design.jpg" },
    { title: "Interior Design", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/02-interior-design.jpg" },
    { title: "Landscape Design", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/03-landscape-design.jpg" },
    { title: "Green Building", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/04-green-building.jpg" },
    { title: "Town Planning", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/05-town-planning.jpg" },
    { title: "MEP Engineering", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/06-mep-engineering.jpg" },
    { title: "Architectural Branding", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/07-architectural-branding.jpg" },
    { title: "Project Management", img: "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/disciplines/08-project-management.jpg" },
  ],
  contactSubmissions: [],
};

/* ═══ CRUD operations ═══ */

const getToken = () => process.env.BLOB_READ_WRITE_TOKEN || "";

export async function getSiteData(): Promise<SiteData> {
  try {
    const token = getToken();
    if (!token) return defaultSiteData;

    const { blobs } = await list({ prefix: DATA_KEY, token });
    if (blobs.length === 0) {
      // No data stored yet — return defaults but DO NOT auto-save
      // (the first explicit save from admin panel will persist data)
      return defaultSiteData;
    }
    const response = await fetch(blobs[0].url, { cache: "no-store" });
    const data = await response.json();
    // Merge with defaults so new fields added in code are available
    return {
      ...defaultSiteData,
      ...data,
      contact: {
        ...defaultSiteData.contact,
        ...(data.contact || {}),
        socials: { ...defaultSiteData.contact.socials, ...(data.contact?.socials || {}) },
      },
    } as SiteData;
  } catch (err) {
    console.error("getSiteData error:", err);
    // If blob store is unreachable, return defaults without saving
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  const token = getToken();
  // Delete existing blob first
  try {
    const { blobs } = await list({ prefix: DATA_KEY, token });
    for (const blob of blobs) {
      await del(blob.url, { token });
    }
  } catch {
    // ignore
  }
  await put(DATA_KEY, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    token,
  });
}

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  const token = getToken();
  const filename = `${folder}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: "public",
    token,
  });
  return blob.url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const token = getToken();
    await del(url, { token });
  } catch {
    // ignore
  }
}

