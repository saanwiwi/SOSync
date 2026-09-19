import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly move the core dot via transform for zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Smooth spring physics loop for the trailing ring
    const render = () => {
      trailX += (mouseX - trailX) * 0.2;
      trailY += (mouseY - trailY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Hover detection for interactive buttons/links
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
        ringRef.current?.classList.add('scale-125', 'bg-yellow-400/20');
      } else {
        ringRef.current?.classList.remove('scale-125', 'bg-yellow-400/20');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Small instant cursor dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-50 h-3 w-3 rounded-full bg-yellow-400 will-change-transform"
      />

      {/* Smooth spring trailer ring */}
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-50 h-8 w-8 rounded-full border border-yellow-400/80 transition-transform duration-75 will-change-transform"
      />
    </>
  );
}