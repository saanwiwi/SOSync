import React, { useEffect, useRef } from 'react';

export default function Earth3DHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for 3D tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouse.targetX = x * 0.0008;
      mouse.targetY = y * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate latitude/longitude grid points for a 3D Wireframe Globe
    let rotationX = 0;
    let rotationY = 0;

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      rotationX += 0.005 + mouse.y;
      rotationY += 0.008 + mouse.x;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      // Draw concentric radar rings behind globe
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.1)';
      ctx.lineWidth = 1;
      for (let r = radius * 0.5; r <= radius * 1.4; r += radius * 0.3) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw 3D Wireframe Latitude & Longitude Arcs (Earth Grid)
      const steps = 24;
      const latSteps = 12;

      // Longitude lines
      for (let i = 0; i < steps; i++) {
        const angle = (i / steps) * Math.PI * 2 + rotationY;
        ctx.beginPath();
        for (let j = 0; j <= latSteps; j++) {
          const lat = (j / latSteps) * Math.PI - Math.PI / 2;
          const x = radius * Math.cos(lat) * Math.cos(angle);
          const y = radius * Math.sin(lat);
          const z = radius * Math.cos(lat) * Math.sin(angle);

          // Apply rotation X
          const rotY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
          
          const projX = centerX + x;
          const projY = centerY + rotY;

          if (j === 0) ctx.moveTo(projX, projY);
          else ctx.lineTo(projX, projY);
        }
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Latitude lines
      for (let j = 1; j < latSteps; j++) {
        const lat = (j / latSteps) * Math.PI - Math.PI / 2;
        const ringRadius = radius * Math.cos(lat);
        const ringY = radius * Math.sin(lat);

        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2 + rotationY;
          const x = ringRadius * Math.cos(angle);
          const z = ringRadius * Math.sin(angle);

          const rotY = ringY * Math.cos(rotationX) - z * Math.sin(rotationX);

          const projX = centerX + x;
          const projY = centerY + rotY;

          if (i === 0) ctx.moveTo(projX, projY);
          else ctx.lineTo(projX, projY);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)'; // Crystal blue latitude accents
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Outer atmosphere glow ring
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.15);
      gradient.addColorStop(0, 'rgba(52, 211, 153, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
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
    <div className="w-full h-[400px] lg:h-[500px] relative flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}