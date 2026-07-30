/**
 * Shared project types and normalisers.
 *
 * Two things are deliberately independent here:
 *
 *  - `status` is the badge shown to visitors ("Under Construction"). It is set
 *    explicitly, so a project can be under construction while the only images
 *    on hand are concept views.
 *  - `groups` are the named image tabs ("Renders", "Living Room", "Drawings").
 *    A project can carry any number of them, in any order.
 *
 * Older records stored three fixed stages and derived the badge from whichever
 * stage happened to hold images. Both are still read, so nothing breaks if a
 * record has not been migrated.
 */

export type ProjectStatus = "concept" | "construction" | "completed";

export const statusOrder: ProjectStatus[] = ["concept", "construction", "completed"];

export const statusLabels: Record<ProjectStatus, string> = {
  concept: "Concept",
  construction: "Under Construction",
  completed: "Completed",
};

/** A named, ordered set of images within a project. */
export interface ImageGroup {
  id: string;
  label: string;
  images: string[];
}

/** Legacy three-stage shape, superseded by `groups`. */
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
  image: string;
  featured: boolean;
  /** Badge shown to visitors. Independent of which groups hold images. */
  status?: ProjectStatus;
  /** Named image tabs. The current shape. */
  groups?: ImageGroup[];
  /** Legacy. Read only when `groups` is absent. */
  stages?: {
    concept?: ProjectStageData;
    construction?: ProjectStageData;
    completed?: ProjectStageData;
  };
}

/** Suggested group names offered in the admin panel. Free text is also allowed. */
export const groupNameSuggestions = [
  "Concept",
  "Drawings",
  "Renders",
  "Masterplan",
  "Elevations",
  "Floor Plans",
  "Site Progress",
  "Completed",
  "Living Room",
  "Drawing Room",
  "Bedroom",
  "Master Bedroom",
  "Kitchen",
  "Dining",
  "Bathroom",
  "Exterior",
  "Landscape",
];

export function getProjectCategories(p: Project): string[] {
  if (p.categories && p.categories.length > 0) return p.categories;
  return p.category ? [p.category] : [];
}

/**
 * Named image groups for a project, empty ones dropped so the public site never
 * renders a tab with nothing behind it. Falls back to the legacy stages.
 */
export function getProjectGroups(p: Project): ImageGroup[] {
  if (p.groups && p.groups.length > 0) {
    return p.groups.filter((g) => g && g.images && g.images.length > 0);
  }
  return statusOrder
    .filter((s) => (p.stages?.[s]?.images?.length ?? 0) > 0)
    .map((s) => ({ id: s, label: statusLabels[s], images: p.stages![s]!.images }));
}

/**
 * The badge. An explicit `status` always wins; otherwise fall back to the old
 * "highest stage holding images" rule so un-migrated records look unchanged.
 */
export function getProjectStatus(p: Project): ProjectStatus {
  if (p.status && statusOrder.includes(p.status)) return p.status;
  if ((p.stages?.completed?.images?.length ?? 0) > 0) return "completed";
  if ((p.stages?.construction?.images?.length ?? 0) > 0) return "construction";
  return "concept";
}

/** Every image in the project, in group order, for the modal's fallback slider. */
export function getAllProjectImages(p: Project): string[] {
  const images = getProjectGroups(p).flatMap((g) => g.images);
  if (images.length === 0 && p.image) return [p.image];
  return images;
}

/**
 * Groups as the admin editor needs them: empty groups kept, so a group can be
 * created and named before any image is uploaded into it.
 */
export function getEditableGroups(p: Project): ImageGroup[] {
  if (p.groups && p.groups.length > 0) {
    return p.groups.map((g) => ({ ...g, images: [...(g.images || [])] }));
  }
  const derived = statusOrder
    .filter((s) => (p.stages?.[s]?.images?.length ?? 0) > 0)
    .map((s) => ({ id: s, label: statusLabels[s], images: [...p.stages![s]!.images] }));
  return derived.length > 0 ? derived : [{ id: newGroupId(), label: "Images", images: [] }];
}

export function newGroupId(): string {
  return `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Lowercase, hyphenated form of a label — used for tidy blob upload paths. */
export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "images"
  );
}
