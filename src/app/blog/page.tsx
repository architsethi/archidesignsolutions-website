"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";

/* ── Default blog posts (fallback while loading / if API fails) ── */
const defaultPosts = [
  {
    slug: "sustainable-architecture-india",
    title: "The Future of Sustainable Architecture in India",
    excerpt: "How IGBC-aligned design principles are reshaping the Indian construction landscape — and why green building is no longer optional.",
    category: "Green Building",
    date: "April 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&q=80",
  },
  {
    slug: "interior-design-trends-2026",
    title: "Interior Design Trends Defining 2026",
    excerpt: "From biophilic design to warm minimalism — the aesthetic movements that are transforming how Indians experience their homes.",
    category: "Interior Design",
    date: "March 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    slug: "ai-architecture-workflows",
    title: "How AI Is Transforming Architectural Practice",
    excerpt: "Three generations of architects at ArchiDesignSolutions share how AI-powered workflows are changing the way we design — without losing the human touch.",
    category: "Innovation",
    date: "February 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
];

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);

  /* Fetch live blog data from persistent API */
  useEffect(() => {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        if (d.blogs?.length) {
          // Only show published blogs, map to the display format
          const livePosts: BlogPost[] = d.blogs
            .filter((b: { status: string }) => b.status === "published")
            .map((b: { slug: string; title: string; excerpt: string; category: string; createdAt: string; image: string }) => ({
              slug: b.slug,
              title: b.title,
              excerpt: b.excerpt,
              category: b.category,
              date: new Date(b.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
              readTime: `${Math.max(3, Math.ceil((b.excerpt?.length || 100) / 50))} min read`,
              image: b.image,
            }));
          if (livePosts.length) setPosts(livePosts);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className={`container ${styles.heroInner}`}>
          <span className={`label-mono ${styles.label}`}>Blog</span>
          <h1 className={styles.heroTitle}>
            Insights &
            <br />
            <span className={styles.accent}>Perspectives</span>
          </h1>
          <p className={styles.heroDesc}>
            Thought leadership from three decades of architectural practice.
          </p>
        </div>
      </section>

      <section className={styles.posts}>
        <div className="container">
          <div className={styles.postsList}>
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.1}>
                <article className={styles.postCard}>
                  <div className={styles.postImageWrap}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  </div>
                  <div className={styles.postContent}>
                    <div className={styles.postMeta}>
                      <span className={styles.postCategory}>{post.category}</span>
                      <span className={styles.postDate}>{post.date}</span>
                    </div>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <span className={styles.postRead}>{post.readTime} →</span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
