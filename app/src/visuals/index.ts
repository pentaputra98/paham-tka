/** Registri adegan visual (svg) yang dipakai konten lewat `visual.scene`. */
import type { VisualFactory } from '../engine/scene';
import { createCone } from './cone';
import { createCubic5 } from './cubic5';
import { createDoor3d } from './door3d';
import { createMat1 } from './mat1';
import { createBars } from './bars17';
import { createSign } from './sign17';
import { createTan16 } from './tan16';
import { createTrap13 } from './trap13';

export const VISUALS: Record<string, VisualFactory> = {
  bars: createBars,
  cone: createCone,
  cubic5: createCubic5,
  door3d: createDoor3d,
  mat1: createMat1,
  sign: createSign,
  tan16: createTan16,
  trap13: createTrap13,
};
