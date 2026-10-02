import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import sMarkImg from '../assets/srijan-s-mark.png';

/**
 * SRIJAN Hero Section
 * Fully interactive cyber-canvas experience powered by GSAP.
 * Features:
 * - Constellation particle canvas interacting with cursor proximity
 * - Radial cursor spotlight & blueprint grid
 * - 3D orbiting engineering nodes around the title
 * - Srijan metallic golden S logo with masked shine sweep & 3D tilt
 * - Letter hop physics and random digital glitch effect
 * - Scramble text decode for "Where Ideas Take Shape"
 * - Live animated countdown to 20–21 Dec 2026
 * - Magnetic buttons & interactive click shockwave rings
 * - Infinite continuous ticker & scroll-down peek indicator
 */
export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const spotRef = useRef(null);
  const titleWrapRef = useRef(null);
  const orbitRef = useRef(null);
  const logoRef = useRef(null);
  const shineRef = useRef(null);
  const tagRef = useRef(null);
  const cntRef = useRef(null);
  const tickerRef = useRef(null);
  const cdRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to events section
  const scrollToEvents = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('events-section') || document.getElementById('events');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    let pts = [];
    const mouse = { x: -999, y: -999 };

    // Apply shine mask from S logo image
    if (shineRef.current) {
      shineRef.current.style.webkitMaskImage = `url(${sMarkImg})`;
      shineRef.current.style.maskImage = `url(${sMarkImg})`;
    }

    // Set ticker text
    if (tickerRef.current) {
      tickerRef.current.innerHTML = (
        'CODE<span>✦</span>DESIGN<span>✦</span>BUILD<span>✦</span>CREATE<span>✦</span>COMPETE<span>✦</span>INNOVATE<span>✦</span>'
      ).repeat(6);
    }

    // GSAP Context for safe cleanup
    const gsapCtx = gsap.context(() => {
      // 1. Constellation Canvas Sizing
      const sizeCanvas = () => {
        W = canvas.width = hero.clientWidth;
        H = canvas.height = hero.clientHeight;
        pts = Array.from({ length: Math.min(75, Math.floor(W / 16)) }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
        }));
      };
      sizeCanvas();
      window.addEventListener('resize', sizeCanvas);

      // Canvas Mouse Interaction
      const handleCanvasMouseMove = (e) => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      };
      hero.addEventListener('mousemove', handleCanvasMouseMove);

      // Ticker Render Loop for Canvas
      const tickerCallback = () => {
        ctx.clearRect(0, 0, W, H);

        for (const p of pts) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;

          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);

          if (d < 160) {
            p.x += dx * 0.012;
            p.y += dy * 0.012;
          }

          ctx.fillStyle = '#22e5ffaa';
          ctx.fillRect(p.x, p.y, 2, 2);
        }

        // Connect nearby points with cyan lines
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < 110) {
              ctx.strokeStyle = `rgba(34,229,255,${0.22 * (1 - d / 110)})`;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }

        // Amber mouse interaction web
        if (mouse.x > 0) {
          for (const p of pts) {
            const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
            if (d < 150) {
              ctx.strokeStyle = `rgba(255,180,0,${0.35 * (1 - d / 150)})`;
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          }
        }
      };
      gsap.ticker.add(tickerCallback);

      // 2. 3D Orbiting Event Nodes
      const orbitContainer = orbitRef.current;
      const icons = ['</>', '✎', '⚙', '⚡', '◈', '✦'];
      orbitContainer.innerHTML = '';
      const nodes = icons.map((t) => {
        const n = document.createElement('div');
        n.className = 'node';
        n.textContent = t;
        orbitContainer.appendChild(n);
        return n;
      });

      const o = { a: 0 };
      const placeOrbit = () => {
        if (!titleWrapRef.current) return;
        const w = titleWrapRef.current.clientWidth;
        const h = titleWrapRef.current.clientHeight;

        nodes.forEach((n, i) => {
          const a = o.a + (i * Math.PI * 2) / nodes.length;
          const s = Math.sin(a);
          gsap.set(n, {
            x: Math.cos(a) * (w * 0.62),
            y: s * (h * 0.62),
            scale: 0.75 + 0.25 * s,
            opacity: 0.45 + 0.55 * ((s + 1) / 2),
            zIndex: s > 0 ? 3 : 0,
          });
        });
      };

      gsap.to(o, {
        a: Math.PI * 2,
        duration: 18,
        ease: 'none',
        repeat: -1,
        onUpdate: placeOrbit,
      });
      placeOrbit();

      // 3. Scramble Text Decoder
      const scramble = (el, txt, dur = 1.4) => {
        if (!el) return;
        const ch = '!<>-_/[]{}=+*^?#01';
        const q = { p: 0 };
        gsap.to(q, {
          p: 1,
          duration: dur,
          ease: 'none',
          onUpdate() {
            const k = Math.floor(q.p * txt.length);
            el.textContent =
              txt.slice(0, k) +
              [...txt.slice(k)]
                .map((c) => (c === ' ' || c === '"' ? c : ch[(Math.random() * ch.length) | 0]))
                .join('');
          },
          onComplete() {
            el.textContent = txt;
          },
        });
      };

      // 4. Entrance Timeline
      gsap.set('#shine', { backgroundPosition: '-150% 0' });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.badge-pill', { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
        .from('#logo', { scale: 0, rotation: -180, opacity: 0, duration: 1.1, ease: 'back.out(1.7)' }, '-=0.2')
        .from('.l', { yPercent: 120, opacity: 0, rotationX: -80, filter: 'blur(14px)', duration: 0.9, stagger: 0.09, transformOrigin: '50% 100%' }, '-=0.8')
        .from('.node', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.5')
        .from('.sub u', { scaleX: 0, duration: 0.7 }, '-=0.4')
        .from('.sub', { opacity: 0, letterSpacing: '0.8em', duration: 0.9 }, '<')
        .add(() => scramble(tagRef.current, '"Where Ideas Take Shape"'), '-=0.5')
        .from('.desc', { opacity: 0, y: 20, duration: 0.7 }, '-=0.2')
        .from('.chip', { opacity: 0, y: 20, scale: 0.9, stagger: 0.1, duration: 0.5 }, '-=0.4')
        .from('.cta .btn', { opacity: 0, y: 20, stagger: 0.12, duration: 0.5 }, '-=0.2')
        .from('.ticker', { yPercent: 100, duration: 0.6 }, '-=0.4');

      // Count-up animation for "6 Technical Events"
      const c = { v: 0 };
      gsap.to(c, {
        v: 6,
        duration: 1.6,
        delay: 2.8,
        ease: 'power1.out',
        onUpdate: () => {
          if (cntRef.current) cntRef.current.textContent = Math.round(c.v);
        },
      });

      // 5. Idle Loops
      tl.add(() => {
        gsap.to('#logo', { y: -8, rotation: 2, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('#logo', {
          filter: 'drop-shadow(0 0 40px #ffb400cc) drop-shadow(0 0 70px #22e5ffaa)',
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to('#shine', { backgroundPosition: '150% 0', duration: 1.4, repeat: -1, repeatDelay: 3, ease: 'power1.inOut' });
        gsap.to('#tk', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
        gsap.to('.cta .btn-primary-glow', { boxShadow: '0 0 44px #22e5ffcc', duration: 1.2, repeat: -1, yoyo: true });
        gsap.to('.peek', { opacity: 0.5, duration: 1, repeat: -1, yoyo: true });

        // Random digital glitch on title letters
        const letters = gsap.utils.toArray('.l');
        if (letters.length) {
          gsap.delayedCall(3, function glitch() {
            const l = gsap.utils.random(letters);
            gsap
              .timeline()
              .to(l, { x: () => gsap.utils.random(-8, 8), skewX: 20, color: '#ffb400', duration: 0.06, repeat: 5, yoyo: true })
              .set(l, { clearProps: 'x,skewX,color' });
            gsap.delayedCall(gsap.utils.random(3, 6), glitch);
          });
        }
      });

      // 6. Interactive Spotlight, Grid Parallax & 3D Logo Tilt
      const sx = gsap.quickTo(spotRef.current, 'x', { duration: 0.5 });
      const sy = gsap.quickTo(spotRef.current, 'y', { duration: 0.5 });
      const tx = gsap.quickTo(titleWrapRef.current, 'x', { duration: 0.8 });
      const ty = gsap.quickTo(titleWrapRef.current, 'y', { duration: 0.8 });

      const handleHeroMouseMove = (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;

        sx(e.clientX - r.left);
        sy(e.clientY - r.top);
        tx(x * 20);
        ty(y * 12);

        gsap.to('.grid-bg', { x: -x * 30, y: -y * 30, duration: 1.2 });
        gsap.to('#logo img', { rotationY: x * 40, rotationX: -y * 40, transformPerspective: 500, duration: 0.6 });
      };
      hero.addEventListener('mousemove', handleHeroMouseMove);

      // 7. Magnetic Button Physics
      const magButtons = hero.querySelectorAll('.mag');
      magButtons.forEach((b) => {
        const handleMagMove = (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - r.left - r.width / 2) * 0.3,
            y: (e.clientY - r.top - r.height / 2) * 0.4,
            duration: 0.3,
          });
        };
        const handleMagLeave = () => {
          gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        };

        b.addEventListener('mousemove', handleMagMove);
        b.addEventListener('mouseleave', handleMagLeave);
      });

      // 8. Click Shockwave Rings
      const handleHeroClick = (e) => {
        const r = hero.getBoundingClientRect();
        const d = document.createElement('div');
        d.className = 'ring';
        hero.appendChild(d);
        gsap.fromTo(
          d,
          {
            left: e.clientX - r.left,
            top: e.clientY - r.top,
            xPercent: -50,
            yPercent: -50,
            width: 10,
            height: 10,
            opacity: 0.9,
          },
          {
            width: 420,
            height: 420,
            opacity: 0,
            duration: 1.1,
            ease: 'power2.out',
            onComplete: () => d.remove(),
          }
        );
      };
      hero.addEventListener('click', handleHeroClick);

      // Letter hover bounce
      hero.querySelectorAll('.l').forEach((l) => {
        l.addEventListener('mouseenter', () => {
          gsap.fromTo(l, { y: 0 }, { y: -16, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
        });
      });

      // Logo 360 Spin on Hover
      const logoEl = document.getElementById('logo');
      if (logoEl) {
        logoEl.addEventListener('mouseenter', () => {
          gsap.fromTo('#logo img', { rotation: 0 }, { rotation: 360, duration: 0.9, ease: 'power3.inOut' });
        });
      }

      // 9. Live Countdown Tick: Target 20 Dec 2026, 00:00 IST
      const targetTime = new Date('2026-12-20T00:00:00+05:30').getTime();
      const numberSpans = hero.querySelectorAll('#cd .n');
      const last = [];

      const tick = () => {
        const diff = Math.max(0, targetTime - Date.now());
        const values = [
          Math.floor(diff / 864e5),
          Math.floor(diff / 36e5) % 24,
          Math.floor(diff / 6e4) % 60,
          Math.floor(diff / 1e3) % 60,
        ];

        values.forEach((x, i) => {
          const s = String(x).padStart(2, '0');
          if (last[i] === s) return;
          last[i] = s;
          const el = numberSpans[i]?.firstChild;
          if (el) {
            if (last.length > 4 || el.dataset?.i) {
              gsap.fromTo(el, { yPercent: -70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
            }
            if (el.dataset) el.dataset.i = '1';
            el.textContent = s;
          }
        });

        if (diff === 0) {
          const cdl = hero.querySelector('.cdl');
          if (cdl) cdl.textContent = 'SRIJAN IS LIVE ✦';
        }
      };

      tick();
      const countInterval = setInterval(tick, 1000);

      gsap.from('.cdl, .cd .b, .cd .c', {
        opacity: 0,
        y: 20,
        scale: 0.9,
        stagger: 0.08,
        duration: 0.5,
        delay: 3.2,
        ease: 'back.out(1.6)',
      });

      gsap.to('.cd .b', {
        boxShadow: '0 0 28px #22e5ff66',
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        delay: 4.2,
      });

      return () => {
        clearInterval(countInterval);
        window.removeEventListener('resize', sizeCanvas);
        hero.removeEventListener('mousemove', handleCanvasMouseMove);
        hero.removeEventListener('mousemove', handleHeroMouseMove);
        hero.removeEventListener('click', handleHeroClick);
        gsap.ticker.remove(tickerCallback);
      };
    }, hero);

    return () => gsapCtx.revert();
  }, []);

  return (
    <div className="relative w-full bg-[#030a14] text-[#e8f1f8] font-sans overflow-x-hidden selection:bg-[#22e5ff]/25 selection:text-[#22e5ff]">
      {/* SCOPED STYLES FROM DESIGN */}
      <style>{`
        .hero-stage {
          --bg: #030a14;
          --cy: #22e5ff;
          --am: #ffb400;
          --tx: #e8f1f8;
          --mu: #93a4b8;
        }
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          padding: 85px 20px 0;
          background: radial-gradient(60% 50% at 50% 40%, #0a2e42 0%, transparent 70%), #030a14;
        }
        #net {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .spot {
          position: absolute;
          left: 0;
          top: 0;
          width: 520px;
          height: 520px;
          margin: -260px 0 0 -260px;
          border-radius: 50%;
          background: radial-gradient(#22e5ff26, transparent 65%);
          pointer-events: none;
        }
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(#22e5ff10 1px, transparent 1px), linear-gradient(90deg, #22e5ff10 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(70% 70% at 50% 40%, #000, transparent);
        }
        .stage {
          position: relative;
          z-index: 3;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-bottom: 50px;
        }
        .badge-pill {
          font: 700 12px 'JetBrains Mono', monospace;
          border: 1px solid #22e5ff44;
          border-radius: 99px;
          padding: 7px 18px;
          background: #0a1d2c;
          letter-spacing: 0.05em;
        }
        .badge-pill b {
          color: var(--am);
        }
        .badge-pill i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cy);
          margin-right: 8px;
          box-shadow: 0 0 8px var(--cy);
        }
        .titlewrap {
          position: relative;
          margin-top: 2.2vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .title {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          font: 800 min(15vw, 16vh) / 1 'JetBrains Mono', monospace;
          letter-spacing: 0.02em;
        }
        .l {
          display: inline-block;
          background: linear-gradient(#fff 30%, var(--cy));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 20px #22e5ff66);
          cursor: pointer;
          user-select: none;
        }
        .s {
          position: relative;
          height: 0.84em;
          margin-right: 0.05em;
          filter: drop-shadow(0 0 22px #ffb40099) drop-shadow(0 0 40px #22e5ff66);
          cursor: pointer;
        }
        .s img {
          height: 100%;
          display: block;
        }
        .s .shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 35%, #fff 50%, transparent 65%) -150% 0 / 250% 100% no-repeat;
          -webkit-mask-size: contain;
          mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }
        .orbit {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .node {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 36px;
          height: 36px;
          margin: -18px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          font-size: 16px;
          background: #0a1d2cdd;
          border: 1px solid #22e5ff66;
          box-shadow: 0 0 16px #22e5ff55;
          color: #22e5ff;
        }
        .sub {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 1vh;
          font: 700 11px 'JetBrains Mono', monospace;
          letter-spacing: 0.3em;
          color: var(--cy);
        }
        .sub u {
          display: block;
          height: 1px;
          width: 56px;
          background: var(--cy);
          opacity: 0.6;
        }
        .tag {
          margin-top: 2.2vh;
          font: 800 clamp(22px, 3.2vw, 32px) 'Inter', sans-serif;
          color: var(--am);
          text-align: center;
          min-height: 1.3em;
        }
        .desc {
          max-width: 580px;
          margin-top: 1vh;
          text-align: center;
          color: var(--mu);
          line-height: 1.6;
          font-size: 14.5px;
        }
        .desc b {
          color: #fff;
        }
        .desc em {
          color: var(--cy);
          font-style: normal;
          font-weight: 600;
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-top: 2vh;
        }
        .chip {
          font: 500 12.5px 'JetBrains Mono', monospace;
          border: 1px solid #22e5ff33;
          background: #0a1a28;
          padding: 8px 14px;
          border-radius: 10px;
          color: #e8f1f8;
        }
        .cta {
          display: flex;
          gap: 14px;
          margin-top: 2.4vh;
          flex-wrap: wrap;
          justify-content: center;
        }
        .btn-primary-glow {
          font: 700 14px 'JetBrains Mono', monospace;
          border: 0;
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          background: var(--cy);
          color: #00131c;
          box-shadow: 0 0 24px #22e5ff66;
          letter-spacing: 0.05em;
          transition: transform 0.2s;
        }
        .btn-ghost-glow {
          font: 700 14px 'JetBrains Mono', monospace;
          border: 1px solid #22e5ff44;
          border-radius: 12px;
          padding: 12px 24px;
          cursor: pointer;
          background: #0b1a2a;
          color: var(--tx);
          letter-spacing: 0.05em;
          box-shadow: none;
          transition: border-color 0.2s;
        }
        .btn-ghost-glow:hover {
          border-color: #22e5ff;
          color: #22e5ff;
        }
        .ticker {
          position: absolute;
          z-index: 4;
          left: 0;
          right: 0;
          bottom: 0;
          height: 38px;
          overflow: hidden;
          border-top: 1px solid #22e5ff22;
          background: #030a14cc;
          display: flex;
          align-items: center;
          backdrop-blur: 4px;
        }
        .ticker div {
          white-space: nowrap;
          font: 700 12px 'JetBrains Mono', monospace;
          letter-spacing: 0.35em;
          color: #22e5ffaa;
          padding-left: 2em;
        }
        .ticker span {
          color: var(--am);
          margin: 0 1.2em;
        }
        .peek {
          height: 9vh;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font: 600 12px 'JetBrains Mono', monospace;
          color: var(--mu);
          letter-spacing: 0.2em;
          background: linear-gradient(#0a1d2c, #030a14);
          cursor: pointer;
          border-bottom: 1px solid #22e5ff15;
          user-select: none;
        }
        .peek:hover {
          color: #22e5ff;
        }
        .ring {
          position: absolute;
          border: 1.5px solid var(--cy);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
        }
        .cd {
          display: flex;
          gap: 10px;
          margin-top: 2vh;
          align-items: center;
        }
        .cd .b {
          min-width: 62px;
          text-align: center;
          padding: 8px 6px 6px;
          border-radius: 12px;
          border: 1px solid #22e5ff44;
          background: linear-gradient(#0d2538, #07131f);
          box-shadow: 0 0 18px #22e5ff22, inset 0 1px #22e5ff22;
        }
        .cd .n {
          display: block;
          overflow: hidden;
          font: 800 clamp(22px, 3.4vh, 30px) / 1.1 'JetBrains Mono', monospace;
          color: #fff;
          text-shadow: 0 0 12px #22e5ffaa;
        }
        .cd .n i {
          display: block;
          font-style: normal;
        }
        .cd small {
          font: 600 9px 'JetBrains Mono', monospace;
          letter-spacing: 0.2em;
          color: var(--am);
        }
        .cd .c {
          color: var(--cy);
          font: 800 22px 'JetBrains Mono', monospace;
          opacity: 0.6;
        }
        .cdl {
          margin-top: 1.8vh;
          font: 700 10px 'JetBrains Mono', monospace;
          letter-spacing: 0.3em;
          color: var(--mu);
        }
        @media (max-width: 700px) {
          .node {
            display: none !important;
          }
          .cd .b {
            min-width: 52px;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="hero hero-stage" id="hero" ref={heroRef}>
        {/* Canvas & Ambient Spotlight */}
        <canvas id="net" ref={canvasRef} />
        <div className="grid-bg" />
        <div className="spot" id="spot" ref={spotRef} />

        {/* Center Stage Presentation */}
        <div className="stage">
          {/* Badge */}
          <div className="badge-pill">
            <i />
            ETAS Presents · <b>1st Edition</b>
          </div>

          {/* Srijan Titlewrap with Orbiting Nodes */}
          <div className="titlewrap" id="tw" ref={titleWrapRef}>
            <div className="orbit" id="orbit" ref={orbitRef} />
            <h1 className="title" id="title" aria-label="SRIJAN">
              {/* S Logo with Masked Shine */}
              <span className="s" id="logo" ref={logoRef}>
                <img src={sMarkImg} alt="S Logo" />
                <span className="shine" id="shine" ref={shineRef} />
              </span>
              <span className="l">R</span>
              <span className="l">I</span>
              <span className="l">J</span>
              <span className="l">A</span>
              <span className="l">N</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="sub">
            <u />
            SANSKRIT FOR "CREATION"
            <u />
          </div>

          {/* Tagline */}
          <div className="tag" id="tag" ref={tagRef}>
            "Where Ideas Take Shape"
          </div>

          {/* Description */}
          <p className="desc">
            A multi-disciplinary technical fest bringing together coders, designers, and builders through 6 hands-on
            competitions. Organized by <b>Electronics &amp; Telecommunication Academic Society</b> at{' '}
            <em>Government College of Engineering, Amravati (GCOEA)</em>.
          </p>

          {/* Event Chips */}
          <div className="chips">
            <span className="chip">📅 20–21 Dec 2026</span>
            <span className="chip">📍 GCOEA Campus, Amravati</span>
            <span className="chip" style={{ color: 'var(--cy)' }}>
              <span id="cnt" ref={cntRef}>
                6
              </span>{' '}
              Technical Events
            </span>
          </div>

          {/* Countdown to Event */}
          <div className="cdl">COUNTDOWN TO SRIJAN · 20–21 DEC 2026</div>
          <div className="cd" id="cd" ref={cdRef}>
            <div className="b">
              <span className="n">
                <i>00</i>
              </span>
              <small>DAYS</small>
            </div>
            <span className="c">:</span>
            <div className="b">
              <span className="n">
                <i>00</i>
              </span>
              <small>HRS</small>
            </div>
            <span className="c">:</span>
            <div className="b">
              <span className="n">
                <i>00</i>
              </span>
              <small>MIN</small>
            </div>
            <span className="c">:</span>
            <div className="b">
              <span className="n">
                <i>00</i>
              </span>
              <small>SEC</small>
            </div>
          </div>

          {/* Magnetic CTAs */}
          <div className="cta">
            <button
              type="button"
              onClick={scrollToEvents}
              className="btn btn-primary-glow mag"
            >
              Explore Events →
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="btn btn-ghost-glow mag"
            >
              Register Now ✦
            </button>
          </div>
        </div>

        {/* Continuous Ticker */}
        <div className="ticker">
          <div id="tk" ref={tickerRef} />
        </div>
      </section>

      {/* Peek Indicator below Hero */}
      <div
        className="peek"
        onClick={scrollToEvents}
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore events"
      >
        ↓ SCROLL TO EXPLORE EVENTS
      </div>
    </div>
  );
}
