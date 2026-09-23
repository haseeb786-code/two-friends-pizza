'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  mobile?: boolean;
}

/**
 * Atmospheric floating embers / ingredient dust particles
 * - Reduced count on mobile
 * - Slow, calming drift — never distracting
 * Uses imperative BufferGeometry to avoid R3F v9 bufferAttribute JSX type issues.
 */
export function FloatingParticles({ count = 80, mobile = false }: FloatingParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = mobile ? Math.floor(count * 0.4) : count;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.018;
    pointsRef.current.rotation.x = Math.sin(t * 0.007) * 0.04;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#f59e0b"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
