import React, { useEffect, useRef } from 'react';

const cursorBallStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0,
  width: 12, height: 12,
  borderRadius: '50%',
  background: 'radial-gradient(circle at 35% 35%, rgba(201,169,110,0.9), rgba(201,169,110,0.3))',
  border: '1px solid rgba(201,169,110,0.6)',
  pointerEvents: 'none',
  zIndex: 9999,
  mixBlendMode: 'screen',
  boxShadow: '0 0 16px rgba(201,169,110,0.5)',
  willChange: 'transform',
};

export default function CursorBall() {
  const ballRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const animate = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.12;
      current.current.y += (pos.current.y - current.current.y) * 0.12;
      if (ballRef.current) {
        ballRef.current.style.transform = `translate(${current.current.x - 6}px, ${current.current.y - 6}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ballRef} style={cursorBallStyle} />;
}
