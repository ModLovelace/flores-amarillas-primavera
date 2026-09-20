import React, { useEffect, useRef } from 'react';

export default function PetalsCanvas() {
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

    // Petal colors: warm buttery yellows, sunflower golden yellow, soft amber
    const colors = [
      '#FDE047', // bright yellow
      '#FACC15', // warm yellow
      '#FEF08A', // soft pastel butter
      '#EAB308', // sunflower gold
      '#FFFBEB', // warm daisy petal
      '#FBBF24'  // amber gold
    ];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.size = Math.random() * 10 + 9; // 9 to 19px
        this.speedX = (Math.random() - 0.5) * 1.2 + 0.3; // gentle breeze to the right
        this.speedY = Math.random() * 1.5 + 0.8;
        this.angle = Math.random() * Math.PI * 2;
        this.angularSpeed = (Math.random() - 0.5) * 0.03;
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationDistance = Math.random() * 40 + 20;
        this.oscillationBaseX = this.x;
        this.oscillationTimer = Math.random() * 100;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.45 + 0.45; // 0.45 - 0.9
        this.aspectRatio = Math.random() * 0.5 + 0.35; // elongated petal shape
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

        // Draw curved organic petal
        ctx.beginPath();
        const rx = this.size;
        const ry = this.size * this.aspectRatio;
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Delicate inner vein highlight
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.moveTo(-rx * 0.5, 0);
        ctx.lineTo(rx * 0.5, 0);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Number of floating petals adapted to screen width
    const petalCount = width < 768 ? 24 : 45;
    const petals = Array.from({ length: petalCount }, () => new Petal());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      aria-hidden="true"
    />
  );
}
