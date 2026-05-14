import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";

const cards = [
  {
    href: "/",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80",
    label: "Go back home",
  },
  {
    href: "/projects",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    label: "Have a look at our projects",
  },
  {
    href: "/contact",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    label: "Get in touch with us",
  },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>
          Page not <span className={styles.accent}>found</span>
        </h1>
        <p className={styles.desc}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Here&apos;s where you can go instead:
        </p>

        <div className={styles.cards}>
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={card.image}
                  alt={card.label}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
              <div className={styles.cardLabel}>
                <span>{card.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
