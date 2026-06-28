"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  glow: boolean;
}

interface FloodBeam {
  cx: number;
  cy: number;
  angle: number;
  spread: number;
  speed: number;
  phase: number;
  hue: number;
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let beams: FloodBeam[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor(window.innerWidth * 0.06), 60);
      for (let i = 0; i < count; i++) {
        const isBlue = Math.random() > 0.4;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: isBlue ? 2.5 + Math.random() * 5 : 1 + Math.random() * 2.5,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: (Math.random() - 0.5) * 0.25,
          opacity: 0.3 + Math.random() * 0.7,
          color: isBlue ? "195, 85%, 72%" : "42, 100%, 65%",
          glow: isBlue,
        });
      }
    };

    const createBeams = () => {
      beams = [];
      [
        { x: 0.12, y: 0.06 },
        { x: 0.5, y: 0.04 },
        { x: 0.88, y: 0.06 },
      ].forEach((pos) => {
        beams.push({
          cx: pos.x,
          cy: pos.y,
          angle: (Math.random() - 0.5) * 0.5,
          spread: 0.07 + Math.random() * 0.05,
          speed: 0.1 + Math.random() * 0.1,
          phase: Math.random() * Math.PI * 2,
          hue: 200 + Math.random() * 30,
        });
      });
    };

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floodlight beams
      beams.forEach((beam) => {
        const cx = beam.cx * canvas.width;
        const cy = beam.cy * canvas.height;
        const pulse = Math.sin(time * beam.speed + beam.phase) * 0.3 + 0.7;

        // Main beam cone
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(beam.angle);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, canvas.width * 0.7);
        grad.addColorStop(0, `hsla(${beam.hue}, 85%, 78%, ${0.15 * pulse})`);
        grad.addColorStop(0.25, `hsla(${beam.hue}, 75%, 65%, ${0.06 * pulse})`);
        grad.addColorStop(0.5, `hsla(${beam.hue + 10}, 60%, 55%, ${0.03 * pulse})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, canvas.width * 0.7, -beam.spread, beam.spread);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Rays
        for (let i = -3; i <= 3; i++) {
          const ra = (i / 3) * beam.spread * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ra) * canvas.width * 0.6, Math.sin(ra) * canvas.width * 0.6);
          ctx.strokeStyle = `hsla(${beam.hue}, 80%, 85%, ${0.015 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();

        // Source glow
        const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
        sg.addColorStop(0, `hsla(${beam.hue}, 100%, 90%, ${0.25 * pulse})`);
        sg.addColorStop(0.4, `hsla(${beam.hue}, 85%, 75%, ${0.08 * pulse})`);
        sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.fill();
      });

      // Fog wisps
      for (let i = 0; i < 6; i++) {
        const fx = ((Math.sin(time * 0.06 + i * 1.7) * 0.5 + 0.5) * canvas.width * 1.2) - canvas.width * 0.1;
        const fy = canvas.height * (0.25 + i * 0.13) + Math.sin(time * 0.04 + i * 2.3) * 50;
        const fs = 150 + Math.sin(time * 0.08 + i * 1.1) * 50;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fs);
        fg.addColorStop(0, `hsla(210, 40%, 75%, ${0.04 + Math.sin(time * 0.015 + i) * 0.015})`);
        fg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, fs, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particles
      particles.forEach((p) => {
        p.x += p.speedX + Math.sin(time * 0.15 + p.x * 0.008) * 0.15;
        p.y += p.speedY + Math.cos(time * 0.12 + p.y * 0.008) * 0.15;

        if (p.x < -15) p.x = canvas.width + 15;
        if (p.x > canvas.width + 15) p.x = -15;
        if (p.y < -15) p.y = canvas.height + 15;
        if (p.y > canvas.height + 15) p.y = -15;

        const tw = Math.sin(time * 0.6 + p.x * 0.03 + p.y * 0.03) * 0.25 + 0.75;

        if (p.glow) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
          g.addColorStop(0, `hsla(${p.color}, ${p.opacity * tw})`);
          g.addColorStop(0.25, `hsla(${p.color}, ${p.opacity * tw * 0.35})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.color}, ${p.opacity * tw})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    };

    resize();
    createParticles();
    createBeams();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
      createBeams();
    });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Stadium image */}
      <div
        ref={imgRef}
        className="absolute inset-0 will-change-transform scale-105"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?w=1920&q=80')",
          }}
        />
      </div>

      {/* Light dark wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/20 via-[#0a0e1a]/10 to-[#0a0e1a]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a]/10 via-transparent to-[#0a0e1a]/10" />

      {/* UCL blue-green glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,220,255,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,230,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,215,0,0.1),transparent_50%)]" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)]" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
