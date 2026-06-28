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

    function drawSilhouette(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      const s = Math.min(w, h) * 0.002;
      const cx = w * 0.5;
      const cy = h * 0.5;

      const pulse = Math.sin(t * 0.3) * 0.12 + 0.88;

      ctx.save();
      ctx.shadowColor = `hsla(${hue}, ${sat}%, ${lit + 10}%, ${0.2 * alphaMul * pulse})`;
      ctx.shadowBlur = 40;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const col = (a: number) => `hsla(${hue}, ${sat * 0.6}%, ${lit + 12}%, ${a * alphaMul * pulse})`;
      const colS = (a: number) => `hsla(${hue}, ${sat}%, ${lit + 5}%, ${a * alphaMul * pulse})`;

      // --- Head ---
      ctx.beginPath();
      ctx.arc(cx, cy - 52 * s, 11 * s, 0, Math.PI * 2);
      ctx.fillStyle = col(0.15);
      ctx.fill();
      ctx.strokeStyle = colS(0.45);
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Body silhouette (filled outline) ---
      ctx.beginPath();
      // Neck right
      ctx.moveTo(cx + 5 * s, cy - 41 * s);
      // Right shoulder
      ctx.quadraticCurveTo(cx + 12 * s, cy - 38 * s, cx + 14 * s, cy - 36 * s);
      // Right arm outer (raised up in celebration)
      ctx.quadraticCurveTo(cx + 16 * s, cy - 44 * s, cx + 12 * s, cy - 50 * s);
      // Right hand
      ctx.lineTo(cx + 14 * s, cy - 52 * s);
      // Right arm inner
      ctx.lineTo(cx + 8 * s, cy - 46 * s);
      ctx.lineTo(cx + 8 * s, cy - 42 * s);
      // Right side of torso down
      ctx.quadraticCurveTo(cx + 10 * s, cy - 30 * s, cx + 8 * s, cy - 16 * s);
      ctx.quadraticCurveTo(cx + 7 * s, cy - 8 * s, cx + 6 * s, cy - 2 * s);
      // Right hip
      ctx.lineTo(cx + 6 * s, cy);
      // Right leg outer
      ctx.lineTo(cx + 5 * s, cy + 12 * s);
      ctx.quadraticCurveTo(cx + 4 * s, cy + 28 * s, cx + 3 * s, cy + 38 * s);
      // Right foot bottom
      ctx.lineTo(cx + 7 * s, cy + 38 * s);
      ctx.lineTo(cx + 3 * s, cy + 42 * s);
      // Right foot back
      ctx.lineTo(cx + 1 * s, cy + 40 * s);
      // Right leg inner
      ctx.quadraticCurveTo(cx + 2 * s, cy + 28 * s, cx + 2 * s, cy + 12 * s);
      // Between legs
      ctx.quadraticCurveTo(cx, cy + 4 * s, cx - 1 * s, cy + 2 * s);
      // Left leg inner
      ctx.quadraticCurveTo(cx - 2 * s, cy + 14 * s, cx - 3 * s, cy + 28 * s);
      ctx.quadraticCurveTo(cx - 4 * s, cy + 36 * s, cx - 5 * s, cy + 40 * s);
      // Left foot
      ctx.lineTo(cx - 9 * s, cy + 38 * s);
      ctx.lineTo(cx - 5 * s, cy + 36 * s);
      // Left leg outer
      ctx.quadraticCurveTo(cx - 2 * s, cy + 26 * s, cx - 2 * s, cy + 14 * s);
      ctx.quadraticCurveTo(cx - 3 * s, cy + 8 * s, cx - 4 * s, cy - 2 * s);
      // Left hip
      ctx.lineTo(cx - 5 * s, cy);
      // Left side of torso up
      ctx.quadraticCurveTo(cx - 7 * s, cy - 8 * s, cx - 7 * s, cy - 16 * s);
      ctx.quadraticCurveTo(cx - 9 * s, cy - 28 * s, cx - 8 * s, cy - 34 * s);
      // Left shoulder
      ctx.quadraticCurveTo(cx - 10 * s, cy - 36 * s, cx - 13 * s, cy - 36 * s);
      // Left arm outer (raised up in celebration)
      ctx.quadraticCurveTo(cx - 16 * s, cy - 44 * s, cx - 12 * s, cy - 50 * s);
      // Left hand
      ctx.lineTo(cx - 14 * s, cy - 52 * s);
      // Left arm inner
      ctx.lineTo(cx - 8 * s, cy - 46 * s);
      ctx.lineTo(cx - 7 * s, cy - 42 * s);
      // Neck left
      ctx.quadraticCurveTo(cx - 3 * s, cy - 42 * s, cx - 5 * s, cy - 42 * s);
      ctx.closePath();

      ctx.fillStyle = col(0.12);
      ctx.fill();
      ctx.strokeStyle = colS(0.4);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // --- Subtle inner glow for depth ---
      ctx.shadowBlur = 0;
      ctx.beginPath();
      // Torso center highlight
      ctx.moveTo(cx - 4 * s, cy - 28 * s);
      ctx.quadraticCurveTo(cx, cy - 20 * s, cx + 4 * s, cy - 28 * s);
      ctx.strokeStyle = colS(0.12);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // --- Jersey number suggestion (just a subtle mark) ---
      ctx.fillStyle = colS(0.08);
      ctx.font = `${10 * s}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("10", cx, cy - 6 * s);

      ctx.restore();
    }

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

      drawSilhouette(ctx, canvas.width, canvas.height, time);
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
