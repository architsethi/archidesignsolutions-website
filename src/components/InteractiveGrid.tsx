"use client";

import { useRef, useEffect, useState } from "react";

interface InteractiveGridProps {
  className?: string;
  opacity?: number;
  color?: "dark" | "red";
}

export default function InteractiveGrid({ className, opacity = 0.05, color = "dark" }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef<number>(0);
  const scrollPosRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)").matches || "ontouchstart" in window;
    setIsMobile(mobile);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lineColor = color === "red" ? "200, 50, 43" : "0, 0, 0";
    const dotColor = "200, 50, 43";

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    if (!mobile) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };
      window.addEventListener("mousemove", handleMouseMove);

      const draw = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);

        const spacing = 40;
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const radius = 220;

        for (let x = spacing; x < w; x += spacing) {
          const dist = Math.abs(x - mx);
          const proximity = Math.max(0, 1 - dist / radius);
          const alpha = opacity + proximity * 0.14;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = proximity > 0.3 ? 0.8 : 0.3;
          ctx.stroke();
        }

        for (let y = spacing; y < h; y += spacing) {
          const dist = Math.abs(y - my);
          const proximity = Math.max(0, 1 - dist / radius);
          const alpha = opacity + proximity * 0.14;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = proximity > 0.3 ? 0.8 : 0.3;
          ctx.stroke();
        }

        for (let x = spacing; x < w; x += spacing) {
          for (let y = spacing; y < h; y += spacing) {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              const proximity = 1 - dist / radius;
              ctx.beginPath();
              ctx.arc(x, y, 1.5 + proximity * 2.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${dotColor}, ${proximity * (color === "red" ? 0.7 : 0.5)})`;
              ctx.fill();
            }
          }
        }

        animRef.current = requestAnimationFrame(draw);
      };
      animRef.current = requestAnimationFrame(draw);

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", handleMouseMove);
        cancelAnimationFrame(animRef.current);
      };
    } else {
      const handleScroll = () => {
        scrollPosRef.current = window.scrollY;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });

      const draw = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);

        const spacing = 40;
        const radius = 180;

        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const viewH = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (viewH - sectionTop) / (viewH + h)));

        const mx = progress * w;
        const my = h * 0.5;

        for (let x = spacing; x < w; x += spacing) {
          const dist = Math.abs(x - mx);
          const proximity = Math.max(0, 1 - dist / radius);
          const alpha = opacity + proximity * 0.1;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = proximity > 0.3 ? 0.7 : 0.3;
          ctx.stroke();
        }

        for (let y = spacing; y < h; y += spacing) {
          const dist = Math.abs(y - my);
          const proximity = Math.max(0, 1 - dist / radius);
          const alpha = opacity + proximity * 0.1;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = proximity > 0.3 ? 0.7 : 0.3;
          ctx.stroke();
        }

        for (let x = spacing; x < w; x += spacing) {
          for (let y = spacing; y < h; y += spacing) {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              const proximity = 1 - dist / radius;
              ctx.beginPath();
              ctx.arc(x, y, 1.2 + proximity * 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${dotColor}, ${proximity * (color === "red" ? 0.6 : 0.4)})`;
              ctx.fill();
            }
          }
        }

        animRef.current = requestAnimationFrame(draw);
      };
      animRef.current = requestAnimationFrame(draw);

      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", handleScroll);
        cancelAnimationFrame(animRef.current);
      };
    }
  }, [opacity, color]);

  return <canvas ref={canvasRef} className={className} />;
}
