import { PBRMaterialConfig } from '@/types/three';

/**
 * Physically Based Rendering (PBR) Material Presets
 * Designed for realistic, appetizing food and metal rendering.
 * High tactile fidelity: avoid plastic-like, cartoonish gloss.
 */
export const PBR_PRESETS = {
  // Wood-fired artisan crust: dry, organic, porous micro-roughness
  crust: {
    roughness: 0.88,
    metalness: 0.02,
    clearcoat: 0.05,
    clearcoatRoughness: 0.9,
  } satisfies PBRMaterialConfig,

  // Glossy rich tomato sauce: high sheen, subtle depth
  sauce: {
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
  } satisfies PBRMaterialConfig,

  // Melted mozzarella cheese: soft specular highlight, semi-gloss
  meltedCheese: {
    roughness: 0.38,
    metalness: 0.02,
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
  } satisfies PBRMaterialConfig,

  // Sizzled pepperoni: glistening oils, specular reflection
  pepperoni: {
    roughness: 0.32,
    metalness: 0.08,
    clearcoat: 0.75,
    clearcoatRoughness: 0.2,
  } satisfies PBRMaterialConfig,

  // Fresh herb/basil: satin botanical leaf sheen
  freshBasil: {
    roughness: 0.55,
    metalness: 0.0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.6,
  } satisfies PBRMaterialConfig,

  // Cast iron & oven stone: heavy dark matte industrial surface
  castIron: {
    roughness: 0.75,
    metalness: 0.85,
  } satisfies PBRMaterialConfig,
} as const;
