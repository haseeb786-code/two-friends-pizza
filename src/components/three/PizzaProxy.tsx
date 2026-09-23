'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Torus, TorusKnot, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { PBR_PRESETS } from './MaterialPresets';

/**
 * ARCHITECTURAL PIZZA STAND-IN
 * ─────────────────────────────
 * This is a geometric proxy representing the pizza's shape and volume
 * using Three.js primitives. It demonstrates:
 *   - Correct 3D dimensional presence and scale
 *   - Realistic PBR material layering (crust, sauce, cheese toppers)
 *   - Cinematic lighting response (rim, key, fill)
 *   - Smooth controlled rotation and camera parallax
 *
 * ⚠️  ASSET REQUIRED FROM CLIENT:
 *   A professional `.glb` / `.gltf` 3D pizza model with:
 *   - Baked or PBR textures (albedo, roughness, normal, ambient occlusion)
 *   - ~50k-150k polygon budget for real-time web use
 *   - Modelled toppings as separate meshes (mozzarella, pepperoni, basil)
 *   - UV-mapped and game-ready
 *
 *   Suggested sources: Sketchfab Pro, CGTrader, custom Blender model,
 *   or a food 3D specialist. Place the file at:
 *   /public/models/pizza.glb
 *
 *   When available, replace this component with <PizzaGLTF /> which
 *   uses @react-three/drei `useGLTF()` to load and render it.
 * ─────────────────────────────
 */

interface PizzaProxyProps {
  mobile?: boolean;
}

export function PizzaProxy({ mobile = false }: PizzaProxyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cheeseRef1 = useRef<THREE.Mesh>(null);
  const cheeseRef2 = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const scale = mobile ? 0.72 : 1.0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Primary gentle auto-rotation — unhurried, authoritative
    groupRef.current.rotation.y += 0.0022;

    // Subtle parallax tilt responding to cursor position (damped)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -0.32 + pointer.y * 0.06,
      0.04
    );

    // Slow breathe float — food-presentation quality
    groupRef.current.position.y = Math.sin(t * 0.45) * 0.06;

    // Cheese toppers independently wobble — suggests elasticity/heat
    if (cheeseRef1.current) {
      cheeseRef1.current.rotation.y = t * 0.5;
      cheeseRef1.current.position.y = 0.12 + Math.sin(t * 1.2 + 1.2) * 0.018;
    }
    if (cheeseRef2.current) {
      cheeseRef2.current.rotation.y = -t * 0.3;
      cheeseRef2.current.position.y = 0.1 + Math.sin(t * 0.9 + 2.4) * 0.014;
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={[0, 0, 0]}>

      {/* ── CRUST — outer torus ring ── */}
      <Torus args={[1.45, 0.22, 32, 100]}>
        <meshStandardMaterial
          color="#8b4513"
          roughness={PBR_PRESETS.crust.roughness}
          metalness={PBR_PRESETS.crust.metalness}
          envMapIntensity={0.4}
        />
      </Torus>

      {/* ── SAUCE BASE — flat wide disc ── */}
      <Cylinder args={[1.22, 1.22, 0.04, 64]}>
        <meshStandardMaterial
          color="#c0392b"
          roughness={PBR_PRESETS.sauce.roughness}
          metalness={PBR_PRESETS.sauce.metalness}
          envMapIntensity={0.9}
        />
      </Cylinder>

      {/* ── CHEESE LAYER — slightly raised disc ── */}
      <Cylinder args={[1.15, 1.15, 0.055, 64]} position={[0, 0.04, 0]}>
        <meshStandardMaterial
          color="#f5d76e"
          roughness={PBR_PRESETS.meltedCheese.roughness}
          metalness={PBR_PRESETS.meltedCheese.metalness}
          envMapIntensity={1.2}
        />
      </Cylinder>

      {/* ── PEPPERONI SLICES — 6 discs arranged in ring ── */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 0.65;
        return (
          <Cylinder
            key={i}
            args={[0.175, 0.175, 0.04, 32]}
            position={[Math.cos(rad) * r, 0.09, Math.sin(rad) * r]}
          >
            <meshStandardMaterial
              color="#8b1a1a"
              roughness={PBR_PRESETS.pepperoni.roughness}
              metalness={PBR_PRESETS.pepperoni.metalness}
              envMapIntensity={1.0}
            />
          </Cylinder>
        );
      })}

      {/* ── CHEESE PULL TOPPERS — small gleaming spheres ── */}
      <Sphere ref={cheeseRef1} args={[0.13, 20, 20]} position={[0.4, 0.12, 0.3]}>
        <meshStandardMaterial
          color="#fde68a"
          roughness={0.18}
          metalness={0.0}
          envMapIntensity={1.6}
        />
      </Sphere>
      <Sphere ref={cheeseRef2} args={[0.1, 20, 20]} position={[-0.5, 0.10, -0.2]}>
        <meshStandardMaterial
          color="#fde68a"
          roughness={0.22}
          metalness={0.0}
          envMapIntensity={1.4}
        />
      </Sphere>

      {/* ── DECORATIVE GEOMETRIC ACCENT — inner center knot ── */}
      <TorusKnot args={[0.06, 0.02, 64, 8]} position={[0, 0.14, 0]}>
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.25}
          metalness={0.6}
          envMapIntensity={1.2}
        />
      </TorusKnot>

    </group>
  );
}
