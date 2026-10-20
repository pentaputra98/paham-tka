/**
 * SPIKE 3D soal 18 (PRD §9.6, M1 tugas 1.6): pintu kaca patri rendah-poligon, prosedural, tanpa berkas model.
 * Tahap: door → ornament → unglass (bongkar kaca) → radius → unroll (pecahan kerangka) → ruler → match.
 * Angka dari docs/pembahasan25.md soal 18: r = 40 cm; lingkaran 251,2 cm; 4 sisi × 56,57 cm; 2 diameter × 80 cm;
 * total ≈ 637,5 cm; logam A 4 m (×2), B 5 m, C 6,5 m. 1 satuan adegan = 10 cm.
 * Modul ini DIMUAT MALAS (potongan terpisah bersama Three.js) dan ikut precache.
 */
import {
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Shape,
  ShapeGeometry,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from 'three';

export type Stage = 'door' | 'ornament' | 'unglass' | 'radius' | 'unroll' | 'ruler' | 'match';

export interface DoorApi {
  canvas: HTMLCanvasElement;
  labels: HTMLElement;
  setStage(stage: Stage, animate: boolean): Promise<void>;
  resize(w: number, h: number): void;
  start(): void;
  stop(): void;
  dispose(): void;
  info(): { geometries: number; textures: number; triangles: number; calls: number };
  fps(): number;
  onLowFps: (() => void) | null;
}

const R = 4; // jari-jari 40 cm
const RING_N = 64;
const SIDE = R * Math.SQRT2; // 56,57 cm
const RING_LEN = 2 * 3.14 * R; // 251,2 cm (π = 3,14 sesuai soal)
const DIAM = 2 * R;
const TOTAL = RING_LEN + 4 * SIDE + 2 * DIAM; // ≈ 63,75 satuan = 637,5 cm

const css = (name: string): Color =>
  new Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || 'white');

interface Params {
  glass: number; // 0 terpasang → 1 terbongkar
  unroll: number; // 0 ornamen → 1 batang per kelompok
  line: number; // 0 per kelompok → 1 berjajar di penggaris
  ruler: number; // 0/1
  metals: number; // 0/1
  door: number; // 1 pintu tampak → 0 hilang
  camX: number;
  /** lebar dunia yang harus terlihat (satuan); jarak kamera dihitung dari rasio layar */
  span: number;
  camZ: number;
  camY: number;
  look: number;
}

const STAGES: Record<Stage, Params> = {
  door: {
    glass: 0,
    unroll: 0,
    line: 0,
    ruler: 0,
    metals: 0,
    door: 1,
    camX: 0,
    span: 16,
    camZ: 34,
    camY: 2,
    look: 0,
  },
  ornament: {
    glass: 0,
    unroll: 0,
    line: 0,
    ruler: 0,
    metals: 0,
    door: 1,
    camX: 0,
    span: 10,
    camZ: 15,
    camY: 0.5,
    look: 0,
  },
  unglass: {
    glass: 1,
    unroll: 0,
    line: 0,
    ruler: 0,
    metals: 0,
    door: 1,
    camX: 0,
    span: 10,
    camZ: 15,
    camY: 0.5,
    look: 0,
  },
  radius: {
    glass: 1,
    unroll: 0,
    line: 0,
    ruler: 0,
    metals: 0,
    door: 1,
    camX: 0,
    span: 9,
    camZ: 13,
    camY: 0.5,
    look: 0,
  },
  unroll: {
    glass: 1,
    unroll: 1,
    line: 0,
    ruler: 0,
    metals: 0,
    door: 0,
    camX: 0,
    span: 30,
    camZ: 30,
    camY: 3,
    look: 3,
  },
  ruler: {
    glass: 1,
    unroll: 1,
    line: 1,
    ruler: 1,
    metals: 0,
    door: 0,
    camX: -5,
    span: 74,
    camZ: 62,
    camY: 1,
    look: 0,
  },
  match: {
    glass: 1,
    unroll: 1,
    line: 1,
    ruler: 1,
    metals: 1,
    door: 0,
    camX: 0,
    span: 88,
    camZ: 92,
    camY: -3,
    look: -3,
  },
};

/**
 * Satu WebGLRenderer dipakai ulang (pola C3.attach/detach di template). Alasan: Three.js r186 memakai
 * DataTexture LUT tingkat-modul untuk MeshStandardMaterial; setiap renderer baru mendaftarkan listener
 * dispose pada tekstur bersama itu sehingga renderer lama (dan kanvasnya) tidak pernah dilepas.
 * Lihat docs/spike-3d-soal18.md.
 */
let shared: { renderer: WebGLRenderer; canvas: HTMLCanvasElement } | null = null;
function sharedRenderer(): { renderer: WebGLRenderer; canvas: HTMLCanvasElement } {
  if (!shared) {
    const canvas = document.createElement('canvas');
    canvas.className = 'door3d-canvas';
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    shared = { renderer, canvas };
  }
  return shared;
}

export function createDoor(host: HTMLElement): DoorApi {
  const { renderer, canvas } = sharedRenderer();
  const off = new AbortController();
  const labels = document.createElement('div');
  labels.className = 'l3wrap';
  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 0.1, 400);
  scene.add(new HemisphereLight(css('--bp-ink-100'), css('--bp-900'), 1.1));
  const sun = new DirectionalLight(css('--paper-0'), 1.4);
  sun.position.set(12, 20, 24);
  scene.add(sun);

  const disposables: Array<BufferGeometry | Material> = [];
  const mat = (
    color: Color,
    extra: Partial<ConstructorParameters<typeof MeshStandardMaterial>[0]> = {},
  ): MeshStandardMaterial => {
    const m = new MeshStandardMaterial({
      color,
      roughness: 0.55,
      metalness: 0.25,
      flatShading: true,
      ...extra,
    });
    disposables.push(m);
    return m;
  };
  const box = (w: number, h: number, d: number): BoxGeometry => {
    const g = new BoxGeometry(w, h, d);
    disposables.push(g);
    return g;
  };

  const root = new Group();
  scene.add(root);

  // ---------- pintu (rangka aluminium + kaca berkisi) ----------
  const door = new Group();
  root.add(door);
  const alu = mat(css('--metal-400'), { metalness: 0.6, roughness: 0.4, transparent: true });
  const W = 11;
  const H = 22;
  for (const [w, h, x, y] of [
    [W, 0.7, 0, H / 2],
    [W, 0.7, 0, -H / 2],
    [0.7, H, -W / 2, 0],
    [0.7, H, W / 2, 0],
    [W, 0.35, 0, 5.2],
    [W, 0.35, 0, -5.2],
  ] as const) {
    const m = new Mesh(box(w, h, 0.6), alu);
    m.position.set(x, y, 0);
    door.add(m);
  }
  const pane = mat(css('--blue-50'), { transparent: true, opacity: 0.18, metalness: 0, roughness: 0.1 });
  for (const y of [8.1, -8.1]) {
    const p = new Mesh(box(W - 0.8, 5.4, 0.08), pane);
    p.position.set(0, y, -0.05);
    door.add(p);
    for (const x of [-2.6, 0, 2.6]) {
      const v = new Mesh(box(0.12, 5.4, 0.2), alu);
      v.position.set(x, y, 0);
      door.add(v);
    }
  }

  // ---------- ornamen: kaca (4 merah, 2 hijau, 2 kuning) ----------
  const ornament = new Group();
  root.add(ornament);
  const glassGroup = new Group();
  ornament.add(glassGroup);
  const glassMats = {
    red: mat(css('--red-600'), { transparent: true, opacity: 0.9, metalness: 0 }),
    green: mat(css('--glass-green'), { transparent: true, opacity: 0.9, metalness: 0 }),
    yellow: mat(css('--glass-yellow'), { transparent: true, opacity: 0.9, metalness: 0 }),
  };
  const V = [new Vector3(0, R, 0), new Vector3(R, 0, 0), new Vector3(0, -R, 0), new Vector3(-R, 0, 0)];
  const pieces: Array<{ m: Mesh; dir: Vector3 }> = [];
  const addPiece = (shape: Shape, material: MeshStandardMaterial, cx: number, cy: number): void => {
    const g = new ShapeGeometry(shape, 12);
    disposables.push(g);
    const m = new Mesh(g, material);
    m.position.z = -0.02;
    glassGroup.add(m);
    pieces.push({ m, dir: new Vector3(cx, cy, 0).normalize() });
  };
  for (let i = 0; i < 4; i++) {
    // segmen merah: busur antara dua titik sudut persegi dan tali busurnya
    const a = V[i]!;
    const b = V[(i + 1) % 4]!;
    const s = new Shape();
    const a0 = Math.atan2(a.y, a.x);
    s.moveTo(a.x, a.y);
    s.absarc(0, 0, R, a0, a0 - Math.PI / 2, true);
    s.lineTo(a.x, a.y);
    const mid = a0 - Math.PI / 4;
    addPiece(s, glassMats.red, Math.cos(mid), Math.sin(mid));
    // segitiga siku-siku dalam persegi (hijau/kuning bergantian seperti gambar)
    const t = new Shape();
    t.moveTo(0, 0);
    t.lineTo(a.x, a.y);
    t.lineTo(b.x, b.y);
    t.lineTo(0, 0);
    addPiece(t, i % 2 === 0 ? glassMats.yellow : glassMats.green, (a.x + b.x) / 3, (a.y + b.y) / 3);
  }

  // ---------- kerangka logam: lingkaran (instanced), 4 sisi, 2 diameter ----------
  const frameBlue = mat(css('--blue-300'), { emissive: css('--blue-600'), emissiveIntensity: 0.25 });
  const frameWhite = mat(css('--paper-0'), { emissive: css('--paper-2'), emissiveIntensity: 0.15 });
  const frameSky = mat(css('--bp-ink-300'), { emissive: css('--blue-600'), emissiveIntensity: 0.1 });
  const segLen = RING_LEN / RING_N;
  const ring = new InstancedMesh(box(segLen * 1.02, 0.2, 0.28), frameBlue, RING_N);
  ornament.add(ring);
  const GAP = 0.35;
  const sides = Array.from({ length: 4 }, () => new Mesh(box(SIDE, 0.2, 0.28), frameWhite));
  const diams = Array.from({ length: 2 }, () => new Mesh(box(DIAM, 0.2, 0.28), frameSky));
  sides.forEach((m) => ornament.add(m));
  diams.forEach((m) => ornament.add(m));

  // ---------- penggaris 0–7 m dan logam A, B, C ----------
  const ruler = new Group();
  scene.add(ruler);
  const rulerMat = mat(css('--paper-1'), { metalness: 0, roughness: 0.9, transparent: true });
  const rulerBar = new Mesh(box(70, 0.9, 0.2), rulerMat);
  rulerBar.position.set(0, 0, 0);
  ruler.add(rulerBar);
  const tickMat = mat(css('--ink-900'), { metalness: 0 });
  for (let m = 0; m <= 7; m++) {
    const tk = new Mesh(box(0.12, 0.9, 0.25), tickMat);
    tk.position.set(-35 + m * 10, 0.1, 0.05);
    ruler.add(tk);
  }
  const metals = new Group();
  scene.add(metals);
  const metalMat = mat(css('--metal-400'), { metalness: 0.7, roughness: 0.35 });
  const okMat = mat(css('--gold-400'), { metalness: 0.4, roughness: 0.4 });
  const overMat = mat(css('--red-400'), { metalness: 0.2 });
  const lackMat = mat(css('--red-300'), { metalness: 0.1, transparent: true, opacity: 0.55 });
  const left0 = -40;
  const addRod = (len: number, y: number, m: MeshStandardMaterial, x0 = left0): Mesh => {
    const rod = new Mesh(box(len, 0.5, 0.5), m);
    rod.position.set(x0 + len / 2, y, 0);
    metals.add(rod);
    return rod;
  };
  // 2 logam A = 8 m: cukup, sisa 1,63 m (> 1 m) → merah
  addRod(TOTAL, -3, metalMat);
  addRod(80 - TOTAL, -3, overMat, left0 + TOTAL);
  // 1 logam B = 5 m: kurang
  addRod(50, -5, metalMat);
  addRod(TOTAL - 50, -5, lackMat, left0 + 50);
  // 1 logam C = 6,5 m: cukup, sisa 0,13 m → emas (pas)
  addRod(TOTAL, -7, okMat);
  addRod(65 - TOTAL, -7, overMat, left0 + TOTAL);

  // ---------- label HTML terproyeksi ----------
  type LabelKey = 'merah' | 'r' | 'ring' | 'sides' | 'diam' | 'total' | 'A' | 'B' | 'C';
  const L: Record<LabelKey, { el: HTMLElement; pos: Vector3; show: (p: Params) => number }> = {} as never;
  const mkLabel = (
    k: LabelKey,
    html: string,
    cls: string,
    pos: Vector3,
    show: (p: Params) => number,
  ): void => {
    const el = document.createElement('div');
    el.className = `l3 ${cls}`;
    el.innerHTML = html;
    labels.append(el);
    L[k] = { el, pos, show };
  };
  mkLabel(
    'merah',
    'Luas 1 kaca merah = <b data-src="l3-merah">456</b> cm²',
    'red',
    new Vector3(3.3, 3.3, 0.4),
    (p) => (p.glass < 0.3 && p.camZ < 20 ? 1 : 0),
  );
  mkLabel('r', '<i>r</i> = <b data-src="l3-r">40</b> cm', 'blue', new Vector3(2, -0.6, 0.4), (p) =>
    p.glass > 0.9 && p.unroll < 0.1 && p.camZ < 14 ? 1 : 0,
  );
  mkLabel('ring', 'lingkaran <b data-src="l3-ring">251,2</b> cm', 'blue', new Vector3(0, 7.2, 0), (p) =>
    p.unroll > 0.9 && p.line < 0.1 ? 1 : 0,
  );
  mkLabel('sides', '4 sisi × <b data-src="l3-side">56,57</b> cm', 'white', new Vector3(0, 4.9, 0), (p) =>
    p.unroll > 0.9 && p.line < 0.1 ? 1 : 0,
  );
  mkLabel('diam', '2 diameter × <b data-src="l3-diam">80</b> cm', 'sky', new Vector3(0, 2.6, 0), (p) =>
    p.unroll > 0.9 && p.line < 0.1 ? 1 : 0,
  );
  mkLabel(
    'total',
    'total ≈ <b data-src="l3-total">637,5</b> cm',
    'big',
    new Vector3(left0 + TOTAL, 3.4, 0),
    (p) => (p.line > 0.9 && p.metals < 0.1 ? 1 : 0),
  );
  mkLabel('A', '2 logam A = 8 m · sisa 1,63 m · <b>Tidak Pas</b>', 'red', new Vector3(left0, -2.1, 0), (p) =>
    p.metals > 0.9 ? 1 : 0,
  );
  mkLabel('B', '1 logam B = 5 m · kurang · <b>Tidak Pas</b>', 'red', new Vector3(left0, -4.1, 0), (p) =>
    p.metals > 0.9 ? 1 : 0,
  );
  mkLabel('C', '1 logam C = 6,5 m · sisa 0,13 m · <b>Pas</b>', 'gold', new Vector3(left0, -6.1, 0), (p) =>
    p.metals > 0.9 ? 1 : 0,
  );

  // ---------- keadaan dan morph ----------
  const cur: Params = { ...STAGES.door };
  const tmpM = new Matrix4();
  const tmpQ = new Quaternion();
  const tmpV = new Vector3();
  const one = new Vector3(1, 1, 1);
  const Z = new Vector3(0, 0, 1);
  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
  const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // baris tujuan saat terurai (unroll) dan saat berjajar di penggaris (line)
  const rowY = { ring: 6.2, sides: 3.9, diam: 1.6 };
  const lineY = 1.2;

  function applyParams(): void {
    const u = ease(cur.unroll);
    const v = ease(cur.line);
    // lingkaran → batang 251,2 cm
    for (let i = 0; i < RING_N; i++) {
      const phi = Math.PI - ((i + 0.5) / RING_N) * Math.PI * 2;
      const cx = R * Math.cos(phi);
      const cy = R * Math.sin(phi);
      const rx = -RING_LEN / 2 + (i + 0.5) * segLen;
      const lx = left0 + (i + 0.5) * segLen;
      const x = lerp(lerp(cx, rx, u), lx, v);
      const y = lerp(lerp(cy, rowY.ring, u), lineY, v);
      const ang = lerp(phi - Math.PI / 2, 0, u);
      tmpQ.setFromAxisAngle(Z, ang);
      tmpM.compose(tmpV.set(x, y, 0.05), tmpQ, one);
      ring.setMatrixAt(i, tmpM);
    }
    ring.instanceMatrix.needsUpdate = true;
    // 4 sisi persegi → 4 batang 56,57 cm
    sides.forEach((m, i) => {
      const a = V[i]!;
      const b = V[(i + 1) % 4]!;
      const cx = (a.x + b.x) / 2;
      const cy = (a.y + b.y) / 2;
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const rx = -2 * (SIDE + GAP) + (i + 0.5) * (SIDE + GAP);
      const lx = left0 + RING_LEN + (i + 0.5) * SIDE;
      m.position.set(lerp(lerp(cx, rx, u), lx, v), lerp(lerp(cy, rowY.sides, u), lineY, v), 0.06);
      m.rotation.z = lerp(ang, Math.round(ang / Math.PI) * Math.PI, u);
    });
    // 2 diameter → 2 batang 80 cm
    diams.forEach((m, i) => {
      const ang = i === 0 ? 0 : Math.PI / 2;
      const rx = -(DIAM + GAP) + (i + 0.5) * (DIAM + GAP);
      const lx = left0 + RING_LEN + 4 * SIDE + (i + 0.5) * DIAM;
      m.position.set(lerp(lerp(0, rx, u), lx, v), lerp(lerp(0, rowY.diam, u), lineY, v), 0.07);
      m.rotation.z = lerp(ang, 0, u);
    });
    // kaca terbongkar: menjauh dan memudar
    const g = ease(cur.glass);
    pieces.forEach(({ m, dir }, i) => {
      m.position.set(dir.x * g * 7, dir.y * g * 7, -0.02 + g * (2 + (i % 3)));
      m.rotation.z = g * (i % 2 ? 0.6 : -0.6);
      (m.material as MeshStandardMaterial).opacity = 0.9 * (1 - g);
      m.visible = g < 0.99;
    });
    alu.opacity = cur.door;
    door.visible = cur.door > 0.02;
    ruler.visible = cur.ruler > 0.02;
    ruler.position.set(-5, lineY - 1.4, 0);
    rulerMat.opacity = cur.ruler;
    metals.visible = cur.metals > 0.02;
    metals.scale.setScalar(Math.max(0.001, cur.metals));
    // jarak minimum agar lebar span muat pada rasio layar saat ini (fov vertikal 36°)
    const fitZ = cur.span / 2 / (Math.tan((camera.fov * Math.PI) / 360) * Math.max(0.3, camera.aspect)) + 2;
    camera.position.set(cur.camX, cur.camY, Math.max(cur.camZ, fitZ));
    camera.lookAt(cur.camX, cur.look, 0);
  }

  let w = 1;
  let h = 1;
  function projectLabels(): void {
    for (const k of Object.keys(L) as LabelKey[]) {
      const lb = L[k];
      const on = lb.show(cur);
      lb.el.style.opacity = String(on);
      if (!on) continue;
      tmpV.copy(lb.pos).project(camera);
      const x = (tmpV.x * 0.5 + 0.5) * w;
      const y = (-tmpV.y * 0.5 + 0.5) * h;
      const anchor = k === 'A' || k === 'B' || k === 'C' ? '0%' : '-50%';
      lb.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(${anchor}, -50%)`;
    }
  }

  // seret untuk memutar pintu (hanya tahap pintu/ornamen)
  let dragX: number | null = null;
  let spin = 0;
  canvas.addEventListener(
    'pointerdown',
    (e) => {
      dragX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    },
    { signal: off.signal },
  );
  canvas.addEventListener(
    'pointermove',
    (e) => {
      if (dragX === null || cur.unroll > 0.05) return;
      spin += (e.clientX - dragX) * 0.01;
      spin = Math.max(-1, Math.min(1, spin));
      dragX = e.clientX;
    },
    { signal: off.signal },
  );
  canvas.addEventListener('pointerup', () => (dragX = null), { signal: off.signal });

  // ---------- loop + pengukur fps ----------
  let raf = 0;
  let running = false;
  let last = performance.now();
  let acc = 0;
  let frames = 0;
  let fpsNow = 60;
  let lowFor = 0;
  let tw: { from: Params; to: Params; t: number; dur: number; res: () => void } | null = null;
  const api: DoorApi = {
    canvas,
    labels,
    onLowFps: null,
    fps: () => fpsNow,
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      const loop = (now: number): void => {
        if (!running) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        acc += dt;
        frames++;
        if (acc >= 1) {
          fpsNow = frames / acc;
          lowFor = fpsNow < 30 ? lowFor + acc : 0;
          if (lowFor >= 3 && api.onLowFps) {
            api.onLowFps();
            lowFor = -1e9;
          }
          acc = 0;
          frames = 0;
        }
        if (tw) {
          tw.t = Math.min(1, tw.t + (dt * 1000) / tw.dur);
          const k = ease(tw.t);
          for (const key of Object.keys(cur) as Array<keyof Params>)
            cur[key] = lerp(tw.from[key], tw.to[key], k);
          if (tw.t >= 1) {
            const done = tw.res;
            tw = null;
            done();
          }
        }
        root.rotation.y = lerp(
          root.rotation.y,
          cur.unroll > 0.05 ? 0 : spin + Math.sin(now / 2600) * 0.12 * cur.door,
          0.08,
        );
        applyParams();
        renderer.render(scene, camera);
        projectLabels();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    setStage(stage, animate) {
      const to = STAGES[stage];
      if (!animate) {
        tw?.res();
        tw = null;
        Object.assign(cur, to);
        applyParams();
        renderer.render(scene, camera);
        projectLabels();
        return Promise.resolve();
      }
      tw?.res();
      return new Promise((res) => {
        tw = { from: { ...cur }, to, t: 0, dur: 1600, res };
      });
    },
    resize(nw, nh) {
      w = Math.max(1, nw);
      h = Math.max(1, nh);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    dispose() {
      api.stop();
      disposables.forEach((d) => d.dispose());
      ring.dispose();
      off.abort();
      // renderer bersama tidak dibuang; hanya isi adegan dan daftar render
      renderer.renderLists.dispose();
      canvas.remove();
      labels.remove();
    },
    info() {
      const i = renderer.info;
      return {
        geometries: i.memory.geometries,
        textures: i.memory.textures,
        triangles: i.render.triangles,
        calls: i.render.calls,
      };
    },
  };
  host.append(canvas, labels);
  applyParams();
  return api;
}
