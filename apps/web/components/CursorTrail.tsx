'use client';

import { useState, useEffect } from 'react';

// Define an interface for our coordinate points
interface Point {
  x: number;
  y: number;
}

export default function CursorTrail() {
  // We only need the state for the trail points
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get the correct page position, including scroll offset
      const currentPos = { x: e.clientX, y: e.clientY + window.scrollY };
      setPoints((prevPoints) => [...prevPoints, currentPos]);
    };

    // This animation logic controls the length of the trail
    const animationFrame = requestAnimationFrame(function animate() {
      setPoints((prevPoints) => {
        const newPoints = [...prevPoints];
        if (newPoints.length > 10) {
          newPoints.shift();
        }
        return newPoints;
      });
      requestAnimationFrame(animate);
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // The component now only renders the trail dots
  return (
    <>
      {points.map((point, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full z-50 pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate3d(${point.x - 4}px, ${point.y - 4}px, 0)`,
            opacity: (index + 1) / points.length,
          }}
        />
      ))}
    </>
  );
}