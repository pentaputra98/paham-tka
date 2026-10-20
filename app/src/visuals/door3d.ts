/**
 * Adegan "pintu kaca patri" soal 18 (PRD §9.6). 3D hanya pelengkap:
 *  - dimuat malas (potongan Three.js terpisah, ikut precache);
 *  - padanan 2D (diagram pita) dipakai bila Mode ringan, tanpa WebGL, hemat gerak, atau fps < 30 selama 3 s;
 *  - tombol "Lewati animasi 3D" selalu tersedia.
 */
import { reducedMotion } from '../core/clock';
import { store } from '../core/store';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';
import { toast } from '../shell/toast';
import type { DoorApi, Stage } from './door3d-scene';
import { createRibbon } from './ribbon18';

export const hasWebGL = (): boolean => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
};

export function createDoor3d(): VisualScene & {
  info: () => ReturnType<DoorApi['info']> | null;
  fps: () => number;
} {
  const el = document.createElement('div');
  el.className = 'vis-door';
  const host3d = document.createElement('div');
  host3d.className = 'door3d-host';
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'btn door-skip';
  skip.textContent = 'Lewati animasi 3D';
  const ribbon = createRibbon();
  el.append(host3d, ribbon.el, skip);

  let door: DoorApi | null = null;
  let loading: Promise<DoorApi | null> | null = null;
  let forced2d = false;
  let stage: Stage = 'door';
  const ro = new ResizeObserver(() => door?.resize(host3d.clientWidth, host3d.clientHeight));
  ro.observe(host3d);

  const use2d = (): boolean => forced2d || store.settings.lite || reducedMotion() || !hasWebGL();

  function show2d(on: boolean): void {
    el.classList.toggle('is-2d', on);
    skip.hidden = on;
    if (on) door?.stop();
    else door?.start();
  }

  function load(): Promise<DoorApi | null> {
    loading ??= import('./door3d-scene')
      .then((m) => {
        door = m.createDoor(host3d);
        door.resize(host3d.clientWidth, host3d.clientHeight);
        door.onLowFps = () => {
          forced2d = true;
          show2d(true);
          const t = toast('Animasi 3D terasa berat. Kami beralih ke gambar 2D.', {
            duration: 6000,
            action: {
              label: 'Tetap 3D',
              onClick: () => {
                forced2d = false;
                show2d(false);
              },
            },
          });
          void t;
        };
        return door;
      })
      .catch(() => {
        forced2d = true;
        show2d(true);
        return null;
      });
    return loading;
  }

  skip.addEventListener('click', () => {
    forced2d = true;
    show2d(true);
  });

  return {
    el,
    async apply(state, c: Ctx) {
      stage = (state.stage as Stage) ?? 'door';
      ribbon.set(stage);
      if (use2d()) {
        show2d(true);
        return;
      }
      show2d(false);
      const d = await load();
      if (!d || !c.live()) return;
      d.start();
      await d.setStage(stage, c.dir > 0);
    },
    resize() {
      door?.resize(host3d.clientWidth, host3d.clientHeight);
    },
    sketch: () => ribbon.sketch(),
    info: () => door?.info() ?? null,
    fps: () => door?.fps() ?? 0,
    destroy() {
      ro.disconnect();
      door?.dispose();
      if (door) void import('./door3d-scene').then((m) => m.releaseShared());
      door = null;
      loading = null;
    },
  };
}
