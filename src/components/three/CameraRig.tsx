'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  damping?: number;
  interactive?: boolean;
}

/**
 * Cinematic Camera Rig with subtle inertial parallax response
 */
export function CameraRig({ damping = 0.05, interactive = true }: CameraRigProps) {
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!interactive) return;

    // Smoothly interpolate camera slightly with cursor coordinates
    const pointer = state.pointer;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointer.x * 0.4,
      damping
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      2 + pointer.y * 0.3,
      damping
    );
    state.camera.lookAt(target.current);
  });

  return null;
}
