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

// Project types and normalisers live in ./project so the admin panel and the
// public site share one definition. Re-exported here for existing importers.
export type {
  Project,
  ProjectStatus,
  ImageGroup,
  ProjectStageData,
} from "./project";
export {
  getProjectGroups,
  getProjectStatus,
  getProjectCategories,
  statusLabels,
} from "./project";

import type { Project } from "./project";

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
      "status": "completed",
      "groups": [
        {
          "id": "renders",
          "label": "Renders",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-01-aerial-view.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-02-tower-detail.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-03-street-elevation.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-04-twin-towers.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-05-central-block.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/render-06-entrance-gate.jpg"
          ]
        },
        {
          "id": "drawings",
          "label": "Drawings",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-01-typical-floor-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-02-podium-parking-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-03-stilt-parking-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-04-5bhk-lower-level-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-05-5bhk-upper-level-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-06-4bhk-unit-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bicholi-hapsi-high-rise/drawing-07-3bhk-unit-plan.jpg"
          ]
        }
      ]
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
      "status": "completed",
      "groups": [
        {
          "id": "renders",
          "label": "Renders",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-01-aerial-view.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-02-entrance-gateway.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-03-central-plaza.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-04-tower-elevation.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-05-entrance-tower.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-06-tower-facade.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/render-07-approach-view.jpg"
          ]
        },
        {
          "id": "drawings",
          "label": "Drawings",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/drawing-01-master-plan.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/drawing-02-front-elevation.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/drawing-03-entrance-gate-elevation.jpg"
          ]
        },
        {
          "id": "site-progress",
          "label": "Site Progress",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/construction-01-tower-facade.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/construction-02-structure.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shalimar-fortleza/construction-03-site-progress.jpg"
          ]
        }
      ]
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
      "status": "construction",
      "groups": [
        {
          "id": "renders",
          "label": "Renders",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-01-garden-city-entrance-dusk.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-02-garden-city-entrance.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-03-boulevard-streetscape.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-04-central-garden.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-05-clubhouse-forecourt.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/leeds-garden-city/render-06-clubhouse-aerial.jpg"
          ]
        }
      ]
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
      "status": "concept",
      "groups": [
        {
          "id": "masterplan",
          "label": "Masterplan",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/palm-springs/drawing-01-masterplan.jpg"
          ]
        },
        {
          "id": "renders",
          "label": "Renders",
          "images": [
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
        }
      ]
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
      "status": "completed",
      "groups": [
        {
          "id": "living-room",
          "label": "Living Room",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-01.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-02.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-03.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/shobha-jain-residence/living-room-04.jpg"
          ]
        }
      ]
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
      "status": "construction",
      "groups": [
        {
          "id": "concept",
          "label": "Concept",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-01-living-room.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-02-living-room.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-03-living-room.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-04-living-room.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/bhatnagar-residence/concept-05-living-room.jpg"
          ]
        }
      ]
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
      "status": "completed",
      "groups": [
        {
          "id": "living-room",
          "label": "Living Room",
          "images": [
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-01.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-02.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-03.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-04.jpg",
            "https://yxn3us72dwnk0m94.public.blob.vercel-storage.com/projects/rathi-residence/living-room-05.jpg"
          ]
        }
      ]
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

/**
 * Resolve the data blob through `list()` rather than constructing its public URL
 * from the token. The constructed URL is served from the CDN edge and was
 * observed returning a stale copy minutes after an overwrite, which would make
 * admin edits look like they had not saved. `list()` costs one blob operation
 * per read but always resolves to fresh content — correctness over cost here.
 */
async function fetchSiteDataJson(token: string): Promise<unknown | null> {
  const { blobs } = await list({ prefix: DATA_KEY, token });
  if (blobs.length === 0) return null;
  const res = await fetch(blobs[0].url, { cache: "no-store" });
  return await res.json();
}

/**
 * Read the stored site data, throwing if the store cannot be reached.
 *
 * Every write path merges its partial update into whatever it reads first. If a
 * failed read quietly returned `defaultSiteData`, the very next save would
 * overwrite the live site — real projects, gallery, team, blogs, testimonials
 * and the contact inbox — with hardcoded placeholder content. So writers must
 * use this and refuse to save when it throws.
 *
 * A `null` result is different from a failure: it means the store is reachable
 * and genuinely empty, so seeding from defaults is safe.
 */
export async function getSiteDataForUpdate(): Promise<SiteData> {
  const token = getToken();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured");

  const raw = await fetchSiteDataJson(token);
  if (raw === null) return defaultSiteData;

  const data = raw as Partial<SiteData> & { contact?: ContactInfo };
  // Merge with defaults so fields newly added in code are available
  return {
    ...defaultSiteData,
    ...data,
    contact: {
      ...defaultSiteData.contact,
      ...(data.contact || {}),
      socials: { ...defaultSiteData.contact.socials, ...(data.contact?.socials || {}) },
    },
  } as SiteData;
}

/**
 * Read for rendering. Falls back to defaults so a blob outage degrades to
 * placeholder content rather than a broken page. Never use this to build a
 * value that will be written back — use `getSiteDataForUpdate` for that.
 */
export async function getSiteData(): Promise<SiteData> {
  try {
    return await getSiteDataForUpdate();
  } catch (err) {
    console.error("getSiteData error:", err);
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  const token = getToken();
  // Overwrite in place: one blob operation instead of list + delete + put.
  // The delete was measured NOT to purge the CDN, so it bought nothing — the
  // edge serves the previous copy for up to max-age either way.
  //
  // cacheControlMaxAge is set to the lowest value Vercel Blob honours: it clamps
  // anything below 60s up to 60s. So an admin save can take up to a minute to
  // appear on the public site. That is a platform floor, not something the code
  // can shorten.
  await put(DATA_KEY, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
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

