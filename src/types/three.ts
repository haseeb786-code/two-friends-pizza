import { ReactNode } from 'react';

export type WebGLSupportStatus = 'checking' | 'supported' | 'unsupported';

export interface Dynamic3DCanvasProps {
  children?: ReactNode;
  fallback?: ReactNode;
  className?: string;
  cameraFov?: number;
  cameraPosition?: [number, number, number];
  shadows?: boolean;
  priority?: boolean;
}

export interface StudioLightingProps {
  intensity?: number;
  warmth?: 'oven' | 'neutral' | 'golden';
  shadows?: boolean;
}

export interface PBRMaterialConfig {
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  ior?: number;
}
