import { useEffect, useRef } from 'react';

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let columns: number;
    const drops: number[] = [];
    const chars = '0123456789ABCDEF';

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / 20);
      drops.length = 0;
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(11, 14, 17, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(2, 241, 166, 0.04)';
      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-bg -z-10" />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          zIndex: -5,
          backgroundImage:
            'linear-gradient(rgba(2,241,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(2,241,166,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: -5 }} />
    </>
  );
}
