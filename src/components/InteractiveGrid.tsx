"use client";

import { useRef, useEffect } from "react";

interface InteractiveGridProps {
  className?: string;
}

export default function InteractiveGrid({ className }: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

      const spacing = 60;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const radius = 200;

      /* Vertical lines */
      for (let x = spacing; x < w; x += spacing) {
        const dist = Math.abs(x - mx);
        const proximity = Math.max(0, 1 - dist / radius);
        const alpha = 0.04 + proximity * 0.12;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.lineWidth = proximity > 0.3 ? 0.8 : 0.4;
        ctx.stroke();
      }

      /* Horizontal lines */
      for (let y = spacing; y < h; y += spacing) {
        const dist = Math.abs(y - my);
        const proximity = Math.max(0, 1 - dist / radius);
        const alpha = 0.04 + proximity * 0.12;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.lineWidth = proximity > 0.3 ? 0.8 : 0.4;
        ctx.stroke();
      }

      /* Grid intersections near cursor — red dots */
      for (let x = spacing; x < w; x += spacing) {
        for (let y = spacing; y < h; y += spacing) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius) {
            const proximity = 1 - dist / radius;
            ctx.beginPath();
            ctx.arc(x, y, 1.5 + proximity * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 50, 43, ${proximity * 0.6})`;
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
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
