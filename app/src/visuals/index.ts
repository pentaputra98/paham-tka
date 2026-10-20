/** Registri adegan visual (svg) yang dipakai konten lewat `visual.scene`. */
import type { VisualFactory } from '../engine/scene';
import { createCone } from './cone';

export const VISUALS: Record<string, VisualFactory> = {
  cone: createCone,
};
