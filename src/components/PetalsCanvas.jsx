import React, { useEffect, useRef } from 'react';
import { getTheme } from '../config/themes';

export default function PetalsCanvas({ themeId = 'flores-amarillas' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return () => window.removeEventListener('resize', handleResize);
    }

    const mouse = { x: width / 2, y: -100, isMoving: false, radius: 100 };
    let mouseTimeout;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isMoving = true;
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.isMoving = false;
      }, 150);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.isMoving = true;
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
          mouse.isMoving = false;
        }, 150);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const currentTheme = getTheme(themeId);
    const colors = currentTheme.palette.particleColors;
    const particleType = currentTheme.palette.particleType;

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.size = Math.random() * 8 + 8; // 8 to 16px
        this.speedX = (Math.random() - 0.5) * 1.2 + 0.2;
        this.speedY = Math.random() * 1.4 + 0.7;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.04;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationDistance = Math.random() * 35 + 15;
        this.oscillationBaseX = this.x;
        this.oscillationTimer = Math.random() * 100;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.45 + 0.45;
        this.aspectRatio = Math.random() * 0.5 + 0.35;
        this.shapeVariant = Math.floor(Math.random() * 2); // for hearts/petals or confetti
      }

      update() {
        this.oscillationTimer += this.oscillationSpeed;
        this.y += this.speedY;
        this.angle += this.angularSpeed;
        this.x = this.oscillationBaseX + Math.sin(this.oscillationTimer) * this.oscillationDistance;
        this.oscillationBaseX += this.speedX;

        // Interaction with mouse/touch
        if (mouse.isMoving) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 5;
            this.y += (dy / distance) * force * 5;
          }
        }

        // Reset when falling out of viewport
        if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if (particleType === 'confetti') {
          // Festive confetti ribbons and rectangles
          const w = this.size;
          const h = this.size * 0.5;
          if (this.shapeVariant === 0) {
            ctx.fillRect(-w / 2, -h / 2, w, h);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (particleType === 'sparkles') {
          // 4-point golden star sparkle
          const r = this.size * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = '#FFFFFF';
          ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
          ctx.fill();
        } else if (particleType === 'hearts') {
          // Floating sweet hearts or rose petals
          if (this.shapeVariant === 0) {
            const s = this.size * 0.6;
            ctx.beginPath();
            ctx.moveTo(0, s * 0.3);
            ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.2, s * 0.6, 0, s * 1.3);
            ctx.bezierCurveTo(s * 1.2, s * 0.6, s, -s * 0.6, 0, s * 0.3);
            ctx.fill();
          } else {
            // Rose petal
            const rx = this.size;
            const ry = this.size * this.aspectRatio;
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Default: Sunflower / Daisy petals
          const rx = this.size;
          const ry = this.size * this.aspectRatio;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1;
          ctx.moveTo(-rx * 0.5, 0);
          ctx.lineTo(rx * 0.5, 0);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    const particleCount = width < 768 ? 24 : 45;
    const particles = Array.from({ length: particleCount }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    />
  );
}
