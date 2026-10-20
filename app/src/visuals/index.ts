/** Registri adegan visual (svg) yang dipakai konten lewat `visual.scene`. */
import type { VisualFactory } from '../engine/scene';
import { createCone } from './cone';
import { createCubic5 } from './cubic5';
import { createDoor3d } from './door3d';
import { createMat1 } from './mat1';
import { createSign } from './sign17';

export const VISUALS: Record<string, VisualFactory> = {
  cone: createCone,
  cubic5: createCubic5,
  door3d: createDoor3d,
  mat1: createMat1,
  sign: createSign,
};
