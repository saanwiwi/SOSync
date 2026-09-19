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

    // Smooth tactical water ripples
    const mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    const ripples = [];

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      
      if (Math.random() < 0.2) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 5,
          maxR: 160,
          alpha: 0.35
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Render expanding dark green & cyan ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const p = ripples[i];
        p.r += 0.9;
        p.alpha *= 0.98;

        if (p.alpha <= 0.005) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${p.alpha})`; // Emerald pulse
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Soft deep-blue / emerald radial aura following cursor
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
      gradient.addColorStop(0, 'rgba(6, 78, 59, 0.15)'); // Dark Green
      gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.05)'); // Deep Cyan
      gradient.addColorStop(1, 'rgba(2, 8, 23, 0)'); // Fade to Dark Blue

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#020817]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
      <div className="relative z-10 min-h-screen flex flex-col">{children}</div>
    </div>
  );
}