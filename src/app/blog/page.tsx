import type { Metadata } from "next";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Blog | ArchiDesignSolutions",
  description: "Insights, thought leadership, and project stories from ArchiDesignSolutions.",
};

const posts = [
  {
    slug: "sustainable-architecture-india",
    title: "The Future of Sustainable Architecture in India",
    excerpt: "How IGBC-aligned design principles are reshaping the Indian construction landscape — and why green building is no longer optional.",
    category: "Green Building",
    date: "April 2026",
    readTime: "6 min read",
  },
  {
    slug: "interior-design-trends-2026",
    title: "Interior Design Trends Defining 2026",
    excerpt: "From biophilic design to warm minimalism — the aesthetic movements that are transforming how Indians experience their homes.",
    category: "Interior Design",
    date: "March 2026",
    readTime: "5 min read",
  },
  {
    slug: "ai-architecture-workflows",
    title: "How AI Is Transforming Architectural Practice",
    excerpt: "Three generations of architects at ArchiDesignSolutions share how AI-powered workflows are changing the way we design — without losing the human touch.",
    category: "Innovation",
    date: "February 2026",
    readTime: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className={`label-mono ${styles.label}`}>Blog</span>
          <h1 className={styles.heroTitle}>
            Insights &
            <br />
            Perspectives
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
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <span className={styles.postDate}>{post.date}</span>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <span className={styles.postRead}>{post.readTime} →</span>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
