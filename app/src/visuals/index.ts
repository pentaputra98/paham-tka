/** Registri adegan visual (svg) yang dipakai konten lewat `visual.scene`. */
import type { VisualFactory } from '../engine/scene';
import { createCone } from './cone';
import { createCubic5 } from './cubic5';
import { createDoor3d } from './door3d';
import { createDrink3 } from './drink3';
import { createDrum7 } from './drum7';
import { createHk6 } from './hk6';
import { createHotel4 } from './hotel4';
import { createMat1 } from './mat1';
import { createOrn } from './orn18';
import { createPakan2 } from './pakan2';
import { createBars } from './bars17';
import { createCirc } from './circ15';
import { createSaham8 } from './saham8';
import { createSign } from './sign17';
import { createSubst5 } from './subst5';
import { createTide11 } from './tide11';
import { createTrans2 } from './trans2';
import { createSing16 } from './sing16';
import { createTrap13 } from './trap13';

export const VISUALS: Record<string, VisualFactory> = {
  bars: createBars,
  circ15: createCirc,
  cone: createCone,
  cubic5: createCubic5,
  door3d: createDoor3d,
  drink3: createDrink3,
  drum7: createDrum7,
  hk6: createHk6,
  hotel4: createHotel4,
  mat1: createMat1,
  orn18: createOrn,
  pakan2: createPakan2,
  saham8: createSaham8,
  sign: createSign,
  subst5: createSubst5,
  tide11: createTide11,
  trans2: createTrans2,
  sing16: createSing16,
  trap13: createTrap13,
};
