"use client";

import { useEffect, useRef } from "react";
import { useThemeMode } from "./theme-provider";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connections: number[];
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useThemeMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let time = 0;

    const isLight = !isDark;
    const hue = isLight ? 200 : 195;
    const sat = isLight ? 50 : 85;
    const lit = isLight ? 55 : 65;
    const alphaMul = isLight ? 0.5 : 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createNodes = () => {
      nodes = [];
      const count = Math.min(Math.floor(window.innerWidth * 0.03), 25);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: isLight ? 1 + Math.random() * 1.5 : 1.5 + Math.random() * 2.5,
          opacity: isLight ? 0.15 + Math.random() * 0.3 : 0.3 + Math.random() * 0.5,
          connections: [],
        });
      }
    };

    function drawNodes(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      // Update and draw connections
      nodes.forEach((node, i) => {
        node.x += node.vx + Math.sin(t * 0.05 + i) * 0.1;
        node.y += node.vy + Math.cos(t * 0.04 + i * 0.7) * 0.1;

        if (node.x < -20) node.x = w + 20;
        if (node.x > w + 20) node.x = -20;
        if (node.y < -20) node.y = h + 20;
        if (node.y > h + 20) node.y = -20;

        // Find nearby nodes for connections
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15 * alphaMul;
            const twinkle = Math.sin(t * 0.3 + i + j) * 0.3 + 0.7;

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(${hue}, ${sat * 0.9}%, ${lit + 5}%, ${alpha * twinkle})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        const tw = Math.sin(t * 0.4 + node.x * 0.01 + node.y * 0.01) * 0.2 + 0.8;

        // Glow
        const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4);
        g.addColorStop(0, `hsla(${hue}, ${sat * 0.9}%, ${lit + 10}%, ${node.opacity * tw * 0.4 * alphaMul})`);
        g.addColorStop(0.3, `hsla(${hue}, ${sat * 0.8}%, ${lit}%, ${node.opacity * tw * 0.1 * alphaMul})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${sat * 0.95}%, ${lit + 15}%, ${node.opacity * tw * alphaMul})`;
        ctx.fill();
      });
    }

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawNodes(ctx, canvas.width, canvas.height, time);

      animId = requestAnimationFrame(animate);
    };

    resize();
    createNodes();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createNodes();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-[#04060a] via-[#080d1a] to-[#04060a]" : "bg-gradient-to-br from-[#e8edf4] via-[#f0f4f8] to-[#e8edf4]"}`} />

      {/* Subtle glow */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "opacity-100" : "opacity-30"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,150,220,0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,200,255,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.03),transparent_50%)]" />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
