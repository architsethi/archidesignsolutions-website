import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import TypewriterAccent from "@/components/TypewriterAccent";
import { getSiteDataForPages } from "@/lib/data";
import { readingTime } from "@/lib/markdown";

// Server-rendered so search engines and link previews get the real titles and
// excerpts in the HTML. Re-reads at most once a minute, matching the CDN's own
// propagation floor and keeping blob operations off the per-visitor path.
export const revalidate = 60;

export default async function BlogPage() {
  const data = await getSiteDataForPages();

  const posts = (data.blogs || [])
    .filter((b) => b.status === "published")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <InteractiveGrid className={styles.heroCanvas} />
        <div className={`container ${styles.heroInner}`}>
          <span className={`label-mono ${styles.label}`}>Blog</span>
          <h1 className={styles.heroTitle}>
            Design
            <br />
            <TypewriterAccent words={["Perspectives", "Dialogues", "Thinking"]} />
          </h1>
          <p className={styles.heroDesc}>
            Thought leadership from three decades of architectural practice.
          </p>
        </div>
      </section>

      <section className={styles.posts}>
        <div className="container">
          {posts.length === 0 ? (
            <p className={styles.empty}>
              New articles are on the way. In the meantime, have a look at{" "}
              <Link href="/projects">our projects</Link>.
            </p>
          ) : (
            <div className={styles.postsList}>
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 0.1}>
                  <Link href={`/blog/${post.slug}`} className={styles.postCard}>
                    <div className={styles.postImageWrap}>
                      {post.image && (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 320px"
                        />
                      )}
                    </div>
                    <div className={styles.postContent}>
                      <div className={styles.postMeta}>
                        <span className={styles.postCategory}>{post.category}</span>
                        <span className={styles.postDate}>
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p className={styles.postExcerpt}>{post.excerpt}</p>
                      <span className={styles.postRead}>
                        {readingTime(post.content)} min read →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
