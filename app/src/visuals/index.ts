/** Registri adegan visual (svg) yang dipakai konten lewat `visual.scene`. */
import type { VisualFactory } from '../engine/scene';
import { createCone } from './cone';
import { createDoor3d } from './door3d';

export const VISUALS: Record<string, VisualFactory> = {
  cone: createCone,
  door3d: createDoor3d,
};
