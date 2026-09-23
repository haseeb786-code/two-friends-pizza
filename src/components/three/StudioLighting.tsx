'use client';

import React from 'react';
import { StudioLightingProps } from '@/types/three';

/**
 * Cinematic 3-Point Food Studio Lighting Rig
 * 
 * 1. Warm Key Light: 45° angle wood-fired oven glow (#f59e0b)
 * 2. Cool Fill Light: Low-intensity ambient bounce to prevent pitch-black shadows (#38bdf8)
 * 3. High-Angle Rim/Kicker: Sharp specular backlight to highlight crust edges and glossy toppings (#ffffff)
 */
export function StudioLighting({
  intensity = 1.0,
  warmth = 'oven',
  shadows = true,
}: StudioLightingProps) {
  const keyColor = warmth === 'oven' ? '#f59e0b' : warmth === 'golden' ? '#fbbf24' : '#ffffff';

  return (
    <>
      {/* Subtle ambient foundation */}
      <ambientLight intensity={0.25 * intensity} color="#0f172a" />

      {/* Main warm key light with soft shadow mapping */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.8 * intensity}
        color={keyColor}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-bias={-0.0001}
      />

      {/* Cool subtle fill light from opposite quadrant */}
      <directionalLight
        position={[-5, 3, -3]}
        intensity={0.45 * intensity}
        color="#94a3b8"
      />

      {/* Sharp rim / kicker light from behind to accentuate silhouette */}
      <spotLight
        position={[0, 8, -6]}
        angle={0.5}
        penumbra={0.8}
        intensity={2.2 * intensity}
        color="#fffbeb"
      />

      {/* Soft warm floor bounce */}
      <pointLight position={[0, -2, 2]} intensity={0.3 * intensity} color="#d97706" />
    </>
  );
}
