"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show custom cursor on desktop
    const isMobile = window.matchMedia("(max-width: 900px)").matches || "ontouchstart" in window;
    if (isMobile) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='pointer']");
      setIsHovering(!!isInteractive);
    };

    const animate = () => {
      const dx = mousePos.current.x - followerPos.current.x;
      const dy = mousePos.current.y - followerPos.current.y;
      followerPos.current.x += dx * 0.12;
      followerPos.current.y += dy * 0.12;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${followerPos.current.x}px, ${followerPos.current.y}px)`;
      }
      requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    const animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${isHovering ? styles.hovering : ""}`}
      />
      <div
        ref={followerRef}
        className={`${styles.follower} ${isHovering ? styles.hovering : ""}`}
      />
    </>
  );
}
