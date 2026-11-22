'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Compass, Eye, RotateCw } from 'lucide-react';

interface SolarChakra3DProps {
  className?: string;
  interactive?: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  color: string;
}

export const SolarChakra3D: React.FC<SolarChakra3DProps> = ({
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseEnergy, setPulseEnergy] = useState(0);

  // Animation and physics state stored in refs to avoid React re-render lag
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });
  const rotRef = useRef({ x: 0.35, y: 0, targetX: 0.35, targetY: 0 });
  const timeRef = useRef(0);
  const animFrameRef = useRef<number>();

  // Trigger energy pulse on click
  const triggerPulse = useCallback(() => {
    setPulseEnergy(1.0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', handleResize);

    // Global window mousemove for continuous immersive 3D parallax
    const handleWindowMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rotRef.current.targetX = 0.35 + ny * 0.65;
      rotRef.current.targetY += nx * 0.006;
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    // Initialize 3D Cosmic Stardust Particles
    const PARTICLE_COUNT = 90;
    const particles: Particle3D[] = [];
    const colors = [
      'rgba(251, 191, 36, ', // Amber
      'rgba(245, 158, 11, ', // Gold
      'rgba(254, 240, 138, ', // Light Gold
      'rgba(217, 119, 6, ', // Deep Amber
      'rgba(56, 189, 248, ', // Ancient Vimana Blue
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 60 + Math.random() * 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particles.push({
        x: radius * Math.cos(phi) * Math.sin(theta),
        y: radius * Math.sin(phi),
        z: radius * Math.cos(phi) * Math.cos(theta),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.1, // Slight upward drift
        vz: (Math.random() - 0.5) * 0.25,
        size: 1 + Math.random() * 2.2,
        alpha: Math.random() * 0.8 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3D Point projection helper
    const fov = 480;
    const project = (x: number, y: number, z: number, cx: number, cy: number, rotX: number, rotY: number) => {
      // Rotate around Y axis (Yaw)
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate around X axis (Pitch)
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = fov / (fov + z2 + 350);
      return {
        px: cx + x1 * scale,
        py: cy + y2 * scale,
        scale,
        depth: z2,
      };
    };

    // Render loop
    let lastTime = performance.now();
    let currentPulse = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      timeRef.current += dt;
      const t = timeRef.current;

      // Smooth mouse interpolation
      rotRef.current.targetY += 0.0035; // Continuous celestial rotation
      rotRef.current.x += (rotRef.current.targetX - rotRef.current.x) * 0.06;
      rotRef.current.y += (rotRef.current.targetY - rotRef.current.y) * 0.06;

      const rotX = rotRef.current.x;
      const rotY = rotRef.current.y;

      const cx = width / 2;
      const cy = height / 2;

      // Decay pulse energy
      if (pulseEnergy > 0.01) {
        setPulseEnergy((prev) => Math.max(0, prev - dt * 1.5));
      }
      currentPulse += (pulseEnergy - currentPulse) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw 3D Ambient Sunburst Core in background
      const corePulse = 1 + Math.sin(t * 2.5) * 0.08 + currentPulse * 0.4;
      const coreRadius = 55 * corePulse * (width / 700);

      const radialGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.5);
      radialGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)'); // Bright Solar Core
      radialGrad.addColorStop(0.25, 'rgba(245, 158, 11, 0.65)'); // Golden Corona
      radialGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.25)'); // Amber Heat
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Expanding Sunburst Energy Shockwave
      if (currentPulse > 0.02) {
        ctx.save();
        const shockRadius = (1 - currentPulse) * 260 + 50;
        ctx.strokeStyle = `rgba(251, 191, 36, ${currentPulse * 0.75})`;
        ctx.lineWidth = 2.5 * currentPulse;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, shockRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Define 3D Orbital Rings
      interface RingConfig {
        radius: number;
        tiltX: number;
        tiltZ: number;
        speed: number;
        segments: number;
        color: string;
        dash?: number[];
        hasVimana?: boolean;
        hasNodes?: boolean;
      }

      const rings: RingConfig[] = [
        {
          radius: 110,
          tiltX: 0.1,
          tiltZ: 0.15,
          speed: 0.8,
          segments: 72,
          color: 'rgba(251, 191, 36, 0.75)',
          hasNodes: true,
        },
        {
          radius: 155,
          tiltX: Math.PI / 3.2,
          tiltZ: -0.4,
          speed: -0.6,
          segments: 80,
          color: 'rgba(245, 158, 11, 0.65)',
          dash: [6, 4],
          hasVimana: true,
        },
        {
          radius: 195,
          tiltX: -Math.PI / 3.8,
          tiltZ: 0.5,
          speed: 0.45,
          segments: 90,
          color: 'rgba(56, 189, 248, 0.55)', // Ancient Vimana blue corridor
          hasVimana: true,
        },
        {
          radius: 235,
          tiltX: 0.3,
          tiltZ: -0.2,
          speed: -0.25,
          segments: 100,
          color: 'rgba(217, 119, 6, 0.45)',
          dash: [12, 8, 3, 8],
        },
      ];

      // Draw rings with depth sorting (back half, then core, then front half)
      rings.forEach((ring, ringIdx) => {
        const ringTime = t * ring.speed;
        const pts: { px: number; py: number; depth: number }[] = [];

        for (let i = 0; i <= ring.segments; i++) {
          const theta = (i / ring.segments) * Math.PI * 2;
          // Initial point on inclined ring plane
          let rx = ring.radius * Math.cos(theta);
          let ry = ring.radius * Math.sin(theta);
          let rz = 0;

          // Apply ring tilt
          const cosTX = Math.cos(ring.tiltX);
          const sinTX = Math.sin(ring.tiltX);
          const y1 = ry * cosTX - rz * sinTX;
          const z1 = ry * sinTX + rz * cosTX;

          const cosTZ = Math.cos(ring.tiltZ);
          const sinTZ = Math.sin(ring.tiltZ);
          const x2 = rx * cosTZ - y1 * sinTZ;
          const y2 = rx * sinTZ + y1 * cosTZ;

          const proj = project(x2, y2, z1, cx, cy, rotX, rotY + ringTime * 0.15);
          pts.push({ px: proj.px, py: proj.py, depth: proj.depth });
        }

        // Draw ring segments with depth gradient
        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const avgDepth = (p1.depth + p2.depth) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);

          // Front segments brighter than back segments
          const depthAlpha = avgDepth < 0 ? 0.25 : 0.85;
          ctx.strokeStyle = ring.color.replace(/[\d\.]+\)$/, `${depthAlpha})`);
          ctx.lineWidth = avgDepth < 0 ? 1 : 1.8;

          if (ring.dash) {
            ctx.setLineDash(ring.dash);
          }

          ctx.stroke();
          ctx.restore();
        }

        // Sacred Sanctuary Nodes on Inner Ring
        if (ring.hasNodes) {
          const nodeCount = 12; // 12 Sacred Sanctuaries
          for (let n = 0; n < nodeCount; n++) {
            const theta = (n / nodeCount) * Math.PI * 2;
            let rx = ring.radius * Math.cos(theta);
            let ry = ring.radius * Math.sin(theta);
            let rz = 0;

            const cosTX = Math.cos(ring.tiltX);
            const sinTX = Math.sin(ring.tiltX);
            const y1 = ry * cosTX - rz * sinTX;
            const z1 = ry * sinTX + rz * cosTX;

            const cosTZ = Math.cos(ring.tiltZ);
            const sinTZ = Math.sin(ring.tiltZ);
            const x2 = rx * cosTZ - y1 * sinTZ;
            const y2 = rx * sinTZ + y1 * cosTZ;

            const proj = project(x2, y2, z1, cx, cy, rotX, rotY + ringTime * 0.15);

            ctx.save();
            ctx.fillStyle = proj.depth > 0 ? '#fbbf24' : 'rgba(245, 158, 11, 0.4)';
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = proj.depth > 0 ? 8 : 2;
            ctx.beginPath();
            ctx.arc(proj.px, proj.py, proj.depth > 0 ? 3 : 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Flying Vimana Marker Drone on Outer Ring
        if (ring.hasVimana) {
          const vTheta = ringTime * 1.8;
          let rx = ring.radius * Math.cos(vTheta);
          let ry = ring.radius * Math.sin(vTheta);
          let rz = 0;

          const cosTX = Math.cos(ring.tiltX);
          const sinTX = Math.sin(ring.tiltX);
          const y1 = ry * cosTX - rz * sinTX;
          const z1 = ry * sinTX + rz * cosTX;

          const cosTZ = Math.cos(ring.tiltZ);
          const sinTZ = Math.sin(ring.tiltZ);
          const x2 = rx * cosTZ - y1 * sinTZ;
          const y2 = rx * sinTZ + y1 * cosTZ;

          const proj = project(x2, y2, z1, cx, cy, rotX, rotY + ringTime * 0.15);

          // Draw Glowing Vimana Beacon
          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = ringIdx === 2 ? '#38bdf8' : '#fbbf24';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, proj.depth > 0 ? 4.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Mini outer pulse ring around Vimana
          ctx.strokeStyle = ringIdx === 2 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(251, 191, 36, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, (proj.depth > 0 ? 9 : 5) + Math.sin(t * 8) * 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // 3. Render 3D Cosmic Stardust Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Reset boundaries in sphere
        const distSq = p.x * p.x + p.y * p.y + p.z * p.z;
        if (distSq > 280 * 280 || p.y < -180) {
          const rad = 70 + Math.random() * 80;
          const th = Math.random() * Math.PI * 2;
          p.x = rad * Math.cos(th);
          p.y = 120 + Math.random() * 40;
          p.z = rad * Math.sin(th);
        }

        const proj = project(p.x, p.y, p.z, cx, cy, rotX, rotY);
        const pulse = Math.sin(t * 3 + p.pulseSpeed * 100) * 0.3;
        const alpha = Math.max(0.1, Math.min(1, p.baseAlpha + pulse + (proj.depth > 0 ? 0.3 : 0)));

        ctx.save();
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [pulseEnergy]);

  // Handle Mouse movement for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !interactive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    rotRef.current.targetX = 0.35 + ny * 0.65; // Pitch
    rotRef.current.targetY += nx * 0.02; // Yaw adjustment
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !interactive || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (touch.clientX - rect.left) / rect.width - 0.5;
    const ny = (touch.clientY - rect.top) / rect.height - 0.5;

    rotRef.current.targetX = 0.35 + ny * 0.65;
    rotRef.current.targetY += nx * 0.02;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        rotRef.current.targetX = 0.35; // Return to default majestic angle
      }}
      onClick={triggerPulse}
      className={`relative select-none ${className}`}
      title="Click to pulse solar energy • Move cursor to rotate 3D celestial astrolabe"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Subtle Interactive Mode Floating Tag */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/75 border border-amber-500/30 text-[10px] font-mono text-amber-300/90 backdrop-blur-md shadow-md transition-opacity duration-300 opacity-60 hover:opacity-100">
        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>3D Solar Astrolabe • සූර්ය චක්‍රය</span>
      </div>
    </div>
  );
};
