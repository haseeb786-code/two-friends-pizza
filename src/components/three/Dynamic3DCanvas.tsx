'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useWebGLSupport } from '@/lib/three/webgl-detect';
import { Dynamic3DCanvasProps } from '@/types/three';

/**
 * Standard Graceful Fallback UI for devices without full WebGL support
 */
function DefaultFallback() {
  return (
    <div
      role="img"
      aria-label="3D visual preview"
      className="w-full h-full min-h-[300px] flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 rounded-2xl border border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0,transparent_70%)]" />
      <div className="relative text-center p-6 space-y-2">
        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
          Artisanal Food Presentation
        </span>
        <p className="text-xs text-neutral-500">
          Interactive preview running in static visual mode.
        </p>
      </div>
    </div>
  );
}

/**
 * Robust, Selective Dynamic 3D Canvas
 * 
 * - Checks WebGL context compatibility before mounting canvas
 * - Renders graceful visual fallback on unsupported devices
 * - Configures ACESFilmicToneMapping for cinema-grade color accuracy
 * - Clamps pixel ratio to avoid GPU throttling on high-DPI mobile devices
 */
export function Dynamic3DCanvas({
  children,
  fallback,
  className = 'w-full h-full min-h-[380px]',
  cameraFov = 45,
  cameraPosition = [0, 2, 5],
  shadows = true,
}: Dynamic3DCanvasProps) {
  const webGLStatus = useWebGLSupport();

  if (webGLStatus === 'unsupported') {
    return <div className={className}>{fallback || <DefaultFallback />}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={fallback || <DefaultFallback />}>
        <Canvas
          shadows={shadows}
          camera={{ position: cameraPosition, fov: cameraFov }}
          dpr={[1, 2]} // Performance clamp
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          className="w-full h-full"
        >
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
