"use client";

import { useState, useEffect } from "react";

interface TypewriterAccentProps {
  words: string[];
  className?: string;
}

export default function TypewriterAccent({ words, className }: TypewriterAccentProps) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = words[wordIdx];

  useEffect(() => {
    if (!isDeleting && charCount === currentWord.length) {
      const pause = setTimeout(() => setIsDeleting(true), 3000);
      return () => clearTimeout(pause);
    }

    if (isDeleting && charCount === 0) {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
      return;
    }

    const speed = isDeleting ? 30 : 50;
    const timer = setTimeout(() => {
      setCharCount((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charCount, isDeleting, currentWord.length, words.length]);

  return (
    <span className={className} style={{ color: "var(--accent-red)", fontStyle: "italic" }}>
      {currentWord.slice(0, charCount)}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "0.85em",
          background: "var(--accent-red)",
          marginLeft: "3px",
          verticalAlign: "middle",
          animation: "cursorBlink 0.6s step-end infinite",
        }}
      />
    </span>
  );
}
