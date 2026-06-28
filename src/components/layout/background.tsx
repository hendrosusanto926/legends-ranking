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
    const pitchBase = isLight ? [0, 45, 65] : [0, 35, 55];
    const pitchMid = isLight ? [0, 60, 80] : [0, 55, 75];
    const pitchEnd = isLight ? [0, 50, 70] : [0, 40, 60];
    const alphaMul = isLight ? 0.5 : 1;

    const grow = (r: number[]) => `rgba(${r[0]}, ${r[1]}, ${r[2]}, `;

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

    function drawPitch(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      const vx = w / 2;
      const farY = h * 0.44;
      const nearY = h;
      const farHalfW = w * 0.08;
      const nearHalfW = w * 0.42;

      const proj = (u: number, depth: number) => {
        const d = 1 - Math.pow(1 - depth, 1.4);
        const y = farY + (nearY - farY) * d;
        const hw = farHalfW + (nearHalfW - farHalfW) * d;
        return { x: vx + u * hw, y };
      };

      const p = Math.sin(t * 0.25) * 0.08 + 0.92;

      const lt = proj(-1, 0), rt = proj(1, 0);
      const lb = proj(-1, 1), rb = proj(1, 1);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lt.x, lt.y);
      ctx.lineTo(rt.x, rt.y);
      ctx.lineTo(rb.x, rb.y);
      ctx.lineTo(lb.x, lb.y);
      ctx.closePath();

      const grd = ctx.createLinearGradient(0, farY, 0, nearY);
      grd.addColorStop(0, `${grow(pitchBase)}${0.06 * alphaMul})`);
      grd.addColorStop(0.5, `${grow(pitchMid)}${0.12 * alphaMul})`);
      grd.addColorStop(1, `${grow(pitchEnd)}${0.2 * alphaMul})`);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.shadowColor = `rgba(0, ${isLight ? 120 : 200}, 255, ${0.1 * alphaMul})`;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${0.35 * p * alphaMul})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      const dline = (x1: number, y1: number, x2: number, y2: number, a: number) => {
        ctx.save();
        ctx.shadowColor = `rgba(0, ${isLight ? 120 : 200}, 255, ${0.08 * a * alphaMul})`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, ${sat * 0.9}%, ${lit}%, ${0.3 * a * p * alphaMul})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue}, ${sat * 0.95}%, ${lit + 10}%, ${0.12 * a * p * alphaMul})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      };

      const cl = proj(0, 0.5);
      dline(proj(-1, 0.5).x, cl.y, proj(1, 0.5).x, cl.y, 0.9);

      const circleR = 0.085;
      const ccTop = proj(0, 0.5 - circleR);
      const ccBottom = proj(0, 0.5 + circleR);
      const ccLeft = proj(-circleR, 0.5);
      const ccRight = proj(circleR, 0.5);
      const ellipseRx = (ccRight.x - ccLeft.x) / 2;
      const ellipseRy = (ccBottom.y - ccTop.y) / 2;
      ctx.save();
      ctx.shadowColor = `rgba(0, ${isLight ? 120 : 200}, 255, ${0.06 * alphaMul})`;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(vx, cl.y, ellipseRx, ellipseRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, ${sat * 0.9}%, ${lit}%, ${0.3 * p * alphaMul})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(vx, cl.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${sat * 0.9}%, ${lit}%, ${0.4 * p * alphaMul})`;
      ctx.fill();

      const paDepth = 0.15;
      const paWidth = 0.42;
      dline(proj(-paWidth, paDepth).x, proj(0, paDepth).y, proj(paWidth, paDepth).x, proj(0, paDepth).y, 0.7);
      dline(proj(paWidth, paDepth).x, proj(0, paDepth).y, proj(paWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-paWidth, 0).x, proj(0, 0).y, proj(paWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-paWidth, paDepth).x, proj(0, paDepth).y, proj(-paWidth, 0).x, proj(0, 0).y, 0.7);

      const gaDepth = 0.05;
      const gaWidth = 0.18;
      dline(proj(-gaWidth, gaDepth).x, proj(0, gaDepth).y, proj(gaWidth, gaDepth).x, proj(0, gaDepth).y, 0.7);
      dline(proj(gaWidth, gaDepth).x, proj(0, gaDepth).y, proj(gaWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-gaWidth, 0).x, proj(0, 0).y, proj(gaWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-gaWidth, gaDepth).x, proj(0, gaDepth).y, proj(-gaWidth, 0).x, proj(0, 0).y, 0.7);

      const arcCx = proj(0, paDepth).x;
      const arcCy = proj(0, paDepth).y;
      const arcR = proj(circleR * 1.1, paDepth).x - arcCx;
      ctx.save();
      ctx.shadowColor = `rgba(0, ${isLight ? 120 : 200}, 255, ${0.04 * alphaMul})`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(arcCx, arcCy, arcR, 0.35, Math.PI - 0.35, false);
      ctx.strokeStyle = `hsla(${hue}, ${sat * 0.9}%, ${lit}%, ${0.25 * p * alphaMul})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(arcCx, arcCy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, ${sat * 0.9}%, ${lit}%, ${0.4 * p * alphaMul})`;
      ctx.fill();
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

      drawPitch(ctx, canvas.width, canvas.height, time);
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
