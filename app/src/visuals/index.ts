/** Registri adegan visual (svg) yang dipakai konten lewat `visual.scene`. */
import type { VisualFactory } from '../engine/scene';
import { createCone } from './cone';
import { createCubic5 } from './cubic5';
import { createDoor3d } from './door3d';
import { createDrink3 } from './drink3';
import { createMat1 } from './mat1';
import { createMul2 } from './mul2';
import { createOrn } from './orn18';
import { createPakan2 } from './pakan2';
import { createBars } from './bars17';
import { createCirc } from './circ15';
import { createSign } from './sign17';
import { createTide11 } from './tide11';
import { createSing16 } from './sing16';
import { createTrap13 } from './trap13';

export const VISUALS: Record<string, VisualFactory> = {
  bars: createBars,
  circ15: createCirc,
  cone: createCone,
  cubic5: createCubic5,
  door3d: createDoor3d,
  drink3: createDrink3,
  mat1: createMat1,
  mul2: createMul2,
  orn18: createOrn,
  pakan2: createPakan2,
  sign: createSign,
  tide11: createTide11,
  sing16: createSing16,
  trap13: createTrap13,
};
