"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let time = 0;

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
          size: 1.5 + Math.random() * 2.5,
          opacity: 0.3 + Math.random() * 0.5,
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

      // Perspective projection with non-linear depth
      const proj = (u: number, depth: number) => {
        // depth: 0 = far end, 1 = near end
        // Non-linear depth curve — more compression at far end
        const d = 1 - Math.pow(1 - depth, 1.4);
        const y = farY + (nearY - farY) * d;
        const hw = farHalfW + (nearHalfW - farHalfW) * d;
        return { x: vx + u * hw, y };
      };

      const p = Math.sin(t * 0.25) * 0.08 + 0.92;

      // Pitch surface
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
      grd.addColorStop(0, "rgba(0, 35, 55, 0.06)");
      grd.addColorStop(0.5, "rgba(0, 55, 75, 0.12)");
      grd.addColorStop(1, "rgba(0, 40, 60, 0.2)");
      ctx.fillStyle = grd;
      ctx.fill();

      // Glowing outline
      ctx.shadowColor = "rgba(0, 200, 255, 0.15)";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = `hsla(195, 85%, 60%, ${0.35 * p})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();

      const dline = (x1: number, y1: number, x2: number, y2: number, a: number) => {
        ctx.save();
        ctx.shadowColor = `rgba(0, 200, 255, ${0.1 * a})`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.3 * a * p})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(195, 90%, 75%, ${0.12 * a * p})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      };

      // Center line
      const cl = proj(0, 0.5);
      dline(proj(-1, 0.5).x, cl.y, proj(1, 0.5).x, cl.y, 0.9);

      // Center circle (proper perspective ellipse)
      // Real pitch: circle radius ~9.15m, pitch length ~105m, so circle radius is ~0.087 of pitch
      const circleR = 0.085;
      const ccTop = proj(0, 0.5 - circleR);
      const ccBottom = proj(0, 0.5 + circleR);
      const ccLeft = proj(-circleR, 0.5);
      const ccRight = proj(circleR, 0.5);
      const ellipseRx = (ccRight.x - ccLeft.x) / 2;
      const ellipseRy = (ccBottom.y - ccTop.y) / 2;
      ctx.save();
      ctx.shadowColor = `rgba(0, 200, 255, ${0.08 * p})`;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(vx, cl.y, ellipseRx, ellipseRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.3 * p})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.beginPath();
      ctx.arc(vx, cl.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(195, 80%, 60%, ${0.4 * p})`;
      ctx.fill();

      // Penalty area (far half: ~16.5% of pitch length)
      // Real pitch: PA extends 16.5m from goal line, width 40.3m → ratio ~0.157
      const paDepth = 0.15;
      const paWidth = 0.42;
      dline(proj(-paWidth, paDepth).x, proj(0, paDepth).y, proj(paWidth, paDepth).x, proj(0, paDepth).y, 0.7);
      dline(proj(paWidth, paDepth).x, proj(0, paDepth).y, proj(paWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-paWidth, 0).x, proj(0, 0).y, proj(paWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-paWidth, paDepth).x, proj(0, paDepth).y, proj(-paWidth, 0).x, proj(0, 0).y, 0.7);

      // Goal area (far half: ~5.5% of pitch length, width ~18.3m)
      const gaDepth = 0.05;
      const gaWidth = 0.18;
      dline(proj(-gaWidth, gaDepth).x, proj(0, gaDepth).y, proj(gaWidth, gaDepth).x, proj(0, gaDepth).y, 0.7);
      dline(proj(gaWidth, gaDepth).x, proj(0, gaDepth).y, proj(gaWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-gaWidth, 0).x, proj(0, 0).y, proj(gaWidth, 0).x, proj(0, 0).y, 0.7);
      dline(proj(-gaWidth, gaDepth).x, proj(0, gaDepth).y, proj(-gaWidth, 0).x, proj(0, 0).y, 0.7);

      // Penalty arc (far half)
      const arcCx = proj(0, paDepth).x;
      const arcCy = proj(0, paDepth).y;
      const arcR = proj(circleR * 1.1, paDepth).x - arcCx;
      ctx.save();
      ctx.shadowColor = `rgba(0, 200, 255, ${0.06 * p})`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(arcCx, arcCy, arcR, 0.35, Math.PI - 0.35, false);
      ctx.strokeStyle = `hsla(195, 80%, 60%, ${0.25 * p})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();

      // Penalty spot
      ctx.beginPath();
      ctx.arc(arcCx, arcCy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(195, 80%, 60%, ${0.4 * p})`;
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
            const alpha = (1 - dist / maxDist) * 0.15;
            const twinkle = Math.sin(t * 0.3 + i + j) * 0.3 + 0.7;

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(195, 80%, 70%, ${alpha * twinkle})`;
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
        g.addColorStop(0, `hsla(195, 90%, 75%, ${node.opacity * tw * 0.4})`);
        g.addColorStop(0.3, `hsla(195, 80%, 65%, ${node.opacity * tw * 0.1})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(195, 90%, 80%, ${node.opacity * tw})`;
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
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04060a] via-[#080d1a] to-[#04060a]" />

      {/* Subtle cyber-glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,150,220,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,200,255,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.03),transparent_50%)]" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
