"use client";

import { useEffect, useRef } from "react";

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor(window.innerWidth * 0.05), 60);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577223625816-6500cc84d7c5?w=1920&q=80')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/95 via-[#111111]/85 to-[#111111]/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/50 via-transparent to-[#111111]/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,94,32,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.05),transparent_50%)]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
