import React from 'react';

const orbStyle: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '50%',
  animation: 'float linear infinite',
  willChange: 'transform',
};

export default function FloatingOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{ ...orbStyle, width: 500, height: 500, top: '-120px', left: '-100px', background: 'radial-gradient(circle, rgba(124,158,245,0.18) 0%, transparent 70%)', animationDuration: '18s' }} />
      <div style={{ ...orbStyle, width: 400, height: 400, bottom: '-80px', right: '-80px', background: 'radial-gradient(circle, rgba(167,139,250,0.16) 0%, transparent 70%)', animationDuration: '22s', animationDirection: 'reverse' }} />
      <div style={{ ...orbStyle, width: 300, height: 300, top: '40%', right: '15%', background: 'radial-gradient(circle, rgba(110,231,183,0.12) 0%, transparent 70%)', animationDuration: '26s' }} />
    </div>
  );
}
