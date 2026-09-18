import React, { useEffect, useRef } from 'react';

export default function WaterBackground({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ultra-smooth slow-motion physics (low lerp factor)
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    const ripples = [];

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      
      // Gentle, slow-motion blue water drops
      if (Math.random() < 0.25) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 5,
          maxR: 180,
          alpha: 0.4
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Slow-motion lerp (0.03 makes it lag lazily and smoothly like deep water)
      mouse.x += (mouse.tx - mouse.x) * 0.03;
      mouse.y += (mouse.ty - mouse.y) * 0.03;

      ctx.clearRect(0, 0, width, height);

      // Render expanding slow-motion blue water ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i];
        p.r += 0.8; // Very slow expansion
        p.alpha *= 0.98; // Very slow fade

        if (p.alpha <= 0.005) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(59, 130, 246, ${p.alpha})`; // Vivid Blue
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Large, soft, dreamy blue water aura following the cursor in slow motion
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.12)'); // Deep Blue Core
      gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.04)'); // Sky Blue Fade
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-earth-radar">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
      <div className="relative z-10 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}