import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSiteDataForPages, type BlogPost } from "@/lib/data";
import { renderMarkdown, readingTime, firstParagraph } from "@/lib/markdown";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveGrid from "@/components/InteractiveGrid";
import styles from "./page.module.css";

const SITE = "https://archidesignsolutions.com";

// Rendered on the server for SEO, then cached. Re-reads the blob at most once a
// minute, which matches the CDN's own propagation floor and keeps blob
// operations to roughly one per minute rather than one per visitor.
export const revalidate = 60;

// Prerender the posts that exist at build time. `dynamicParams` defaults to
// true, so a post published later through the admin panel still renders on
// demand without waiting for a redeploy.
export async function generateStaticParams() {
  try {
    const data = await getSiteDataForPages();
    return (data.blogs || [])
      .filter((b) => b.status === "published")
      .map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

async function findPost(slug: string): Promise<BlogPost | null> {
  const data = await getSiteDataForPages();
  const post = (data.blogs || []).find((b) => b.slug === slug && b.status === "published");
  return post || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) return { title: "Post not found | ArchiDesignSolutions" };

  const description = post.seoDescription || post.excerpt || firstParagraph(post.content).slice(0, 160);
  const url = `${SITE}/blog/${post.slug}`;
  const images = post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined;

  return {
    title: post.seoTitle || `${post.title} | ArchiDesignSolutions`,
    description,
    keywords: post.seoKeywords ? post.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      images,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSiteDataForPages();
  const post = (data.blogs || []).find((b) => b.slug === slug && b.status === "published");
  if (!post) notFound();

  const related = (data.blogs || [])
    .filter((b) => b.status === "published" && b.slug !== post.slug)
    .sort((a, b) => {
      // Same category first, then most recent.
      const catA = a.category === post.category ? 0 : 1;
      const catB = b.category === post.category ? 0 : 1;
      if (catA !== catB) return catA - catB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 3);

  const published = new Date(post.createdAt);
  const dateLabel = published.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Article structured data, so the post is eligible for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.image ? [post.image] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: "ArchiDesignSolutions" },
    publisher: {
      "@type": "Organization",
      name: "ArchiDesignSolutions",
      url: SITE,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/blog/${post.slug}` },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        // Serialised from our own data, not user input; escaped for safety.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        <header className={styles.hero}>
          <InteractiveGrid className={styles.heroCanvas} />
          <div className={`container ${styles.heroInner}`}>
            <Link href="/blog" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              All Articles
            </Link>

            <div className={styles.meta}>
              <span className={styles.category}>{post.category}</span>
              <span className={styles.metaDot}>·</span>
              <time dateTime={post.createdAt}>{dateLabel}</time>
              <span className={styles.metaDot}>·</span>
              <span>{readingTime(post.content)} min read</span>
            </div>

            <h1 className={styles.title}>{post.title}</h1>
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
            {post.author && <p className={styles.author}>By {post.author}</p>}
          </div>
        </header>

        {post.image && (
          <div className="container">
            <div className={styles.featured}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1100px) 100vw, 1000px"
              />
            </div>
          </div>
        )}

        <div className="container">
          <div className={styles.body}>{renderMarkdown(post.content, styles)}</div>
        </div>
      </article>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>Planning a project of your own?</h2>
            <p className={styles.ctaText}>
              We have been designing homes, townships and interiors across Madhya Pradesh since 1999.
              Tell us what you are building and we will tell you honestly what it takes.
            </p>
            <Link href="/contact" className={styles.ctaBtn}>Talk to our team</Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={styles.related}>
          <div className="container">
            <h2 className={styles.relatedTitle}>Keep reading</h2>
            <div className={styles.relatedGrid}>
              {related.map((r, i) => (
                <ScrollReveal key={r.id} delay={i * 0.08}>
                  <Link href={`/blog/${r.slug}`} className={styles.relatedCard}>
                    <div className={styles.relatedImage}>
                      {r.image && (
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 900px) 100vw, 320px"
                        />
                      )}
                    </div>
                    <span className={styles.relatedCategory}>{r.category}</span>
                    <h3 className={styles.relatedCardTitle}>{r.title}</h3>
                    <p className={styles.relatedExcerpt}>{r.excerpt}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
