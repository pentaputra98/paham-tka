/**
 * Adegan "pintu kaca patri" soal 18 (PRD §9.6). 3D hanya pelengkap:
 *  - dimuat malas (potongan Three.js terpisah, ikut precache);
 *  - padanan 2D (diagram pita) dipakai bila Mode ringan, tanpa WebGL, hemat gerak, atau fps < 30 selama 3 s;
 *  - tombol "Lewati animasi 3D" selalu tersedia.
 */
import { sizeObserver } from '../core/dom';
import { reducedMotion } from '../core/clock';
import { store } from '../core/store';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';
import { toast } from '../shell/toast';
import type { DoorApi, Stage } from './door3d-scene';
import { createRibbon } from './ribbon18';

let webgl: boolean | undefined;
/** Diperiksa sekali; konteks uji langsung dilepas agar tidak menghabiskan jatah konteks WebGL. */
export const hasWebGL = (): boolean => {
  if (webgl === undefined) {
    try {
      const gl =
        document.createElement('canvas').getContext('webgl2') ??
        document.createElement('canvas').getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      webgl = !!gl;
    } catch {
      webgl = false;
    }
  }
  return webgl;
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
  let dead = false;
  const ro = sizeObserver(() => door?.resize(host3d.clientWidth, host3d.clientHeight));
  ro.observe(host3d);

  const use2d = (): boolean => forced2d || store.settings.lite || reducedMotion() || !hasWebGL();

  function show2d(on: boolean): void {
    el.classList.toggle('is-2d', on);
    skip.hidden = on;
    if (on) door?.stop();
    else door?.start();
  }

  function force2d(on: boolean): void {
    forced2d = on;
    show2d(on);
  }

  function load(): Promise<DoorApi | null> {
    loading ??= import('./door3d-scene')
      .then(async (m) => {
        const d = m.createDoor(host3d);
        d.resize(host3d.clientWidth, host3d.clientHeight);
        d.onLowFps = () => {
          force2d(true);
          toast('Animasi 3D terasa berat. Kami beralih ke gambar 2D.', {
            duration: 6000,
            action: { label: 'Tetap 3D', onClick: () => force2d(false) },
          });
        };
        await d.compile();
        // adegan ditinggalkan selama memuat/kompilasi: buang, jangan pasang
        if (dead) {
          d.dispose();
          return null;
        }
        door = d;
        return d;
      })
      .catch(() => {
        force2d(true);
        return null;
      });
    return loading;
  }

  skip.addEventListener('click', () => force2d(true));

  return {
    el,
    async apply(state, c: Ctx) {
      const stage = (state.stage as Stage | undefined) ?? 'door';
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
    sketch: () => ribbon.sketch(),
    info: () => door?.info() ?? null,
    fps: () => door?.fps() ?? 0,
    destroy() {
      dead = true;
      ro.disconnect();
      door?.dispose();
      door = null;
      loading = null;
    },
  };
}
