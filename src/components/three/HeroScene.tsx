'use client';

import { Environment } from '@react-three/drei';
import { StudioLighting } from './StudioLighting';
import { PizzaProxy } from './PizzaProxy';
import { FloatingParticles } from './FloatingParticles';
import { CameraRig } from './CameraRig';

interface HeroSceneProps {
  mobile?: boolean;
}

/**
 * Complete Hero 3D Scene — composited from reusable architecture modules.
 * 
 * Hierarchy:
 *  CameraRig (inertial parallax)
 *  └── StudioLighting (3-point food studio rig)
 *  └── Environment (HDRI ambient for IBL reflections)
 *  └── PizzaProxy (geometric pizza with PBR materials)
 *  └── FloatingParticles (atmospheric ember drift)
 */
export function HeroScene({ mobile = false }: HeroSceneProps) {
  return (
    <>
      <CameraRig damping={0.032} interactive={!mobile} />
      <StudioLighting intensity={1.15} warmth="oven" shadows={!mobile} />

      {/* Image-Based Lighting for accurate IBL reflections on PBR surfaces */}
      <Environment preset="night" background={false} blur={0.6} />

      <PizzaProxy mobile={mobile} />

      {!mobile && <FloatingParticles count={90} mobile={false} />}
      {mobile && <FloatingParticles count={30} mobile={true} />}
    </>
  );
}
