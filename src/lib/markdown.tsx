/**
 * A small Markdown renderer for blog post bodies.
 *
 * Deliberately dependency-free and deliberately NOT HTML-based: it returns
 * React elements rather than a string fed to dangerouslySetInnerHTML, so post
 * content cannot inject markup or script into the page. Anything it does not
 * recognise is rendered as plain text.
 *
 * Supported: headings (## / ###/ ####), paragraphs, unordered and ordered
 * lists, blockquotes, horizontal rules, fenced code blocks, tables, block
 * images, and inline bold / italic / links / code.
 */
import type { ReactNode } from "react";
import Image from "next/image";

/* ── Inline formatting ───────────────────────────────────────────────────── */

// Ordered by precedence: code first so its contents are not further parsed.
const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${i++}`;

    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      const split = token.indexOf("](");
      const label = token.slice(1, split);
      const href = token.slice(split + 2, -1);
      const external = /^https?:\/\//i.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ── Block parsing ───────────────────────────────────────────────────────── */

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const ORDERED = /^\d+\.\s+(.*)$/;
const UNORDERED = /^[-*]\s+(.*)$/;

type Styles = Record<string, string>;

export function renderMarkdown(source: string, styles: Styles = {}): ReactNode[] {
  const lines = (source || "").replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const nextKey = () => `b${key++}`;

  const cls = (name: string) => styles[name] || undefined;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank
    if (!trimmed) { i++; continue; }

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) body.push(lines[i++]);
      i++; // closing fence
      out.push(
        <pre key={nextKey()} className={cls("code")}>
          <code>{body.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      out.push(<hr key={nextKey()} className={cls("hr")} />);
      i++;
      continue;
    }

    // Block image
    const img = trimmed.match(IMAGE_LINE);
    if (img) {
      out.push(
        <figure key={nextKey()} className={cls("figure")}>
          <Image
            src={img[2]}
            alt={img[1]}
            width={1200}
            height={800}
            className={cls("figureImage")}
            sizes="(max-width: 900px) 100vw, 800px"
          />
          {img[1] && <figcaption className={cls("caption")}>{img[1]}</figcaption>}
        </figure>
      );
      i++;
      continue;
    }

    // Heading
    const h = trimmed.match(HEADING);
    if (h) {
      const level = Math.min(h[1].length, 6);
      const content = renderInline(h[2], nextKey());
      // Post bodies start below the page's <h1>, so a leading # becomes an h2.
      const Tag = (`h${Math.max(2, level)}`) as "h2" | "h3" | "h4" | "h5" | "h6";
      out.push(<Tag key={nextKey()} className={cls(`heading${Math.max(2, level)}`)}>{content}</Tag>);
      i++;
      continue;
    }

    // Blockquote (consecutive "> " lines)
    if (trimmed.startsWith(">")) {
      const body: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        body.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        <blockquote key={nextKey()} className={cls("quote")}>
          {renderInline(body.join(" "), nextKey())}
        </blockquote>
      );
      continue;
    }

    // Table: a header row followed by a |---|---| separator
    if (trimmed.startsWith("|") && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const cells = (row: string) =>
        row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const header = cells(lines[i]);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        <div key={nextKey()} className={cls("tableWrap")}>
          <table className={cls("table")}>
            <thead>
              <tr>{header.map((c, n) => <th key={n}>{renderInline(c, `th${n}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, rn) => (
                <tr key={rn}>{r.map((c, n) => <td key={n}>{renderInline(c, `td${rn}-${n}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Ordered list
    if (ORDERED.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && ORDERED.test(lines[i].trim())) {
        items.push(lines[i].trim().match(ORDERED)![1]);
        i++;
      }
      out.push(
        <ol key={nextKey()} className={cls("list")}>
          {items.map((t, n) => <li key={n}>{renderInline(t, `ol${n}`)}</li>)}
        </ol>
      );
      continue;
    }

    // Unordered list
    if (UNORDERED.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && UNORDERED.test(lines[i].trim())) {
        items.push(lines[i].trim().match(UNORDERED)![1]);
        i++;
      }
      out.push(
        <ul key={nextKey()} className={cls("list")}>
          {items.map((t, n) => <li key={n}>{renderInline(t, `ul${n}`)}</li>)}
        </ul>
      );
      continue;
    }

    // Paragraph: consecutive plain lines
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      !HEADING.test(lines[i].trim()) &&
      !ORDERED.test(lines[i].trim()) &&
      !UNORDERED.test(lines[i].trim()) &&
      !IMAGE_LINE.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length) {
      out.push(<p key={nextKey()} className={cls("paragraph")}>{renderInline(para.join(" "), nextKey())}</p>);
    } else {
      i++; // safety: never loop without consuming
    }
  }

  return out;
}

/** Rough reading time, used in post meta. ~200 words per minute. */
export function readingTime(source: string): number {
  const words = (source || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** First paragraph of a post body, for a fallback excerpt. */
export function firstParagraph(source: string): string {
  const line = (source || "")
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith(">") && !l.startsWith("!") && !l.startsWith("|") && !l.startsWith("```"));
  return line || "";
}
