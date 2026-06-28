"use client";

import { useEffect, useRef } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export function BouncingBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const balls: Ball[] = [];
    const BALL_COUNT = 4;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBalls = () => {
      balls.length = 0;
      for (let i = 0; i < BALL_COUNT; i++) {
        const size = 25 + Math.random() * 35;
        balls.push({
          x: Math.random() * (canvas.width - size * 2) + size,
          y: Math.random() * (canvas.height - size * 2) + size,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          size,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2.5,
        });
      }
    };

    const drawFootball = (x: number, y: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      const r = size;

      // Outer glow
      const gradient = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.2);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.06)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Ball body (white)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw pentagon pattern
      const pentR = r * 0.45;
      const pentagonPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        pentagonPoints.push({
          x: Math.cos(angle) * pentR,
          y: Math.sin(angle) * pentR,
        });
      }

      // Central black pentagon
      ctx.beginPath();
      ctx.moveTo(pentagonPoints[0].x, pentagonPoints[0].y);
      for (let i = 1; i < 5; i++) {
        ctx.lineTo(pentagonPoints[i].x, pentagonPoints[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Lines from pentagon vertices to ball edge
      for (let i = 0; i < 5; i++) {
        const p = pentagonPoints[i];
        const edgeDist = r * 0.95;
        const angle = Math.atan2(p.y, p.x);
        const edgeX = Math.cos(angle) * edgeDist;
        const edgeY = Math.sin(angle) * edgeDist;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(edgeX, edgeY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Small black pentagon at each vertex
        const tipR = r * 0.12;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const a = (j * 2 * Math.PI) / 5 + angle;
          const px = p.x + Math.cos(a) * tipR;
          const py = p.y + Math.sin(a) * tipR;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.fill();
      }

      // Surface highlight
      const highlight = ctx.createRadialGradient(
        -r * 0.3, -r * 0.3, 0,
        -r * 0.3, -r * 0.3, r * 0.6
      );
      highlight.addColorStop(0, "rgba(255, 255, 255, 0.15)");
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Shadow on bottom-right
      const shadow = ctx.createRadialGradient(
        r * 0.2, r * 0.2, 0,
        r * 0.2, r * 0.2, r * 0.8
      );
      shadow.addColorStop(0, "rgba(0, 0, 0, 0)");
      shadow.addColorStop(1, "rgba(0, 0, 0, 0.1)");
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.rotation += ball.rotationSpeed;

        if (ball.x - ball.size < 0 || ball.x + ball.size > canvas.width) {
          ball.vx *= -1;
        }
        if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
          ball.vy *= -1;
        }

        drawFootball(ball.x, ball.y, ball.size, ball.rotation);
      });

      // Draw connection lines between nearby balls
      balls.forEach((ball, i) => {
        for (let j = i + 1; j < balls.length; j++) {
          const b2 = balls[j];
          const dx = b2.x - ball.x;
          const dy = b2.y - ball.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const threshold = ball.size + b2.size + 80;

          if (dist < threshold) {
            const alpha = (1 - dist / threshold) * 0.08;
            ctx.beginPath();
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createBalls();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
