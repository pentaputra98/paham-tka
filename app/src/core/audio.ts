/**
 * Audio sintetis Web Audio (PRD §8.11, pembahasan.md §12; port dari `SND` template).
 * Tanpa berkas audio. Aktif setelah interaksi pertama; ditangguhkan saat tab tersembunyi.
 * Efek dan musik mengikuti pengaturan (efek bawaan hidup, musik bawaan mati).
 */
import { store } from './store';

interface NoteOpts {
  t?: number;
  dur?: number;
  vol?: number;
  att?: number;
  type?: OscillatorType;
  glide?: number;
  detune?: number;
  lp?: number;
  bus?: GainNode;
  rev?: number;
}

class Synth {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private sfx!: GainNode;
  private bgm!: GainNode;
  private rev!: ConvolverNode;
  private noiseBuf!: AudioBuffer;
  private lastTick = 0;
  private bgmTimer = 0;
  bgmOn = false;

  /** Buat konteks bila belum ada; hanya berhasil setelah gestur pengguna. */
  init(): boolean {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return true;
    }
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;
    const c = (this.ctx = new AC());
    this.master = c.createGain();
    this.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 3;
    this.master.connect(comp);
    comp.connect(c.destination);
    this.sfx = c.createGain();
    this.sfx.gain.value = 0.6;
    this.sfx.connect(this.master);
    this.bgm = c.createGain();
    this.bgm.gain.value = 0;
    this.bgm.connect(this.master);
    this.rev = c.createConvolver();
    this.rev.buffer = this.impulse(3, 2.4);
    const rg = c.createGain();
    rg.gain.value = 0.4;
    this.rev.connect(rg);
    rg.connect(this.master);
    const len = Math.floor(c.sampleRate * 0.6);
    this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }

  suspend(): void {
    void this.ctx?.suspend();
  }

  resume(): void {
    if (this.ctx && (this.bgmOn || store.settings.sfx)) void this.ctx.resume();
  }

  private impulse(sec: number, decay: number): AudioBuffer {
    const c = this.ctx!;
    const len = Math.floor(c.sampleRate * sec);
    const b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }

  private note(f: number, o: NoteOpts = {}): void {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime + (o.t ?? 0);
    const dur = o.dur ?? 0.3;
    const vol = o.vol ?? 0.2;
    const att = o.att ?? 0.006;
    const osc = c.createOscillator();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(f, t);
    if (o.glide) osc.frequency.exponentialRampToValueAtTime(o.glide, t + dur);
    if (o.detune) osc.detune.value = o.detune;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node: AudioNode = osc;
    if (o.lp) {
      const fl = c.createBiquadFilter();
      fl.type = 'lowpass';
      fl.frequency.value = o.lp;
      osc.connect(fl);
      node = fl;
    }
    node.connect(g);
    g.connect(o.bus ?? this.sfx);
    if (o.rev) {
      const s = c.createGain();
      s.gain.value = o.rev;
      g.connect(s);
      s.connect(this.rev);
    }
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private noise(
    o: { t?: number; dur?: number; vol?: number; f0?: number; f1?: number; q?: number } = {},
  ): void {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime + (o.t ?? 0);
    const dur = o.dur ?? 0.3;
    const src = c.createBufferSource();
    src.buffer = this.noiseBuf;
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = o.q ?? 1.2;
    bp.frequency.setValueAtTime(o.f0 ?? 400, t);
    bp.frequency.exponentialRampToValueAtTime(o.f1 ?? 2400, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(o.vol ?? 0.08, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.sfx);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  private ok(): boolean {
    return store.settings.sfx && !!this.ctx && this.init();
  }

  click(): void {
    if (!this.ok()) return;
    this.note(1250, { dur: 0.07, vol: 0.1, glide: 700 });
    this.note(2500, { dur: 0.03, vol: 0.03 });
  }
  tick(): void {
    if (!this.ok()) return;
    const n = performance.now();
    if (n - this.lastTick < 45) return;
    this.lastTick = n;
    this.note(2100, { dur: 0.025, vol: 0.025, type: 'triangle' });
  }
  /** hitung mundur Ekspedisi: bip pendek tiap angka, bip tinggi saat mulai */
  count(last = false): void {
    if (!this.ok()) return;
    this.note(last ? 1760 : 880, { dur: last ? 0.45 : 0.16, vol: 0.13, type: 'triangle', rev: 0.3 });
  }
  chalk(): void {
    if (this.ok()) this.noise({ dur: 0.07, vol: 0.035, f0: 3000, f1: 5200, q: 2 });
  }
  whoosh(v = 1): void {
    if (this.ok()) this.noise({ dur: 0.32, vol: 0.045 * v, f0: 500, f1: 2800, q: 0.9 });
  }
  correct(): void {
    if (!this.ok()) return;
    [1046.5, 1318.5, 1568, 2093].forEach((f, i) => {
      this.note(f, { t: i * 0.075, dur: 1.1, vol: 0.12, rev: 0.5 });
      this.note(f * 2, { t: i * 0.075, dur: 0.5, vol: 0.025, type: 'triangle', rev: 0.4 });
    });
  }
  wrong(): void {
    if (!this.ok()) return;
    [0, 0.16].forEach((t) => this.note(196, { t, dur: 0.14, vol: 0.11, type: 'square', lp: 850 }));
  }
  chime(): void {
    if (!this.ok()) return;
    this.note(1568, { dur: 1.4, vol: 0.09, rev: 0.7 });
    this.note(2349, { t: 0.09, dur: 1.2, vol: 0.06, rev: 0.7 });
  }
  stamp(): void {
    if (!this.ok()) return;
    this.note(150, { dur: 0.2, vol: 0.32, glide: 55 });
    this.noise({ dur: 0.09, vol: 0.12, f0: 1800, f1: 500, q: 0.6 });
  }
  fanfare(): void {
    if (!this.ok()) return;
    [392, 523.25, 659.25, 783.99].forEach((f, i) =>
      this.note(f, { t: i * 0.12, dur: 0.32, vol: 0.1, type: 'sawtooth', lp: 2600, rev: 0.3 }),
    );
    [523.25, 659.25, 783.99, 1046.5].forEach((f) => {
      this.note(f, { t: 0.5, dur: 1.8, vol: 0.075, type: 'sawtooth', lp: 2200, rev: 0.6 });
      this.note(f, { t: 0.5, dur: 1.8, vol: 0.06, type: 'triangle', detune: 7, rev: 0.5 });
    });
    this.note(130.8, { t: 0.5, dur: 1.6, vol: 0.14 });
  }

  private pad(f: number, dur: number, vol: number, type: OscillatorType = 'sine'): void {
    const c = this.ctx!;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1000;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 3);
    g.gain.setValueAtTime(vol, t + dur - 4);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(lp);
    lp.connect(g);
    g.connect(this.bgm);
    const s = c.createGain();
    s.gain.value = 0.5;
    g.connect(s);
    s.connect(this.rev);
    o.start(t);
    o.stop(t + dur + 0.1);
  }

  /** Musik latar: pad Cmaj7–Am7–Fmaj7–G + denting pentatonik, volume rendah. */
  bgmStart(): void {
    if (!this.init() || this.bgmOn) return;
    this.bgmOn = true;
    const c = this.ctx!;
    const n = c.currentTime;
    this.bgm.gain.cancelScheduledValues(n);
    this.bgm.gain.setValueAtTime(this.bgm.gain.value, n);
    this.bgm.gain.linearRampToValueAtTime(0.55, n + 2.5);
    let i = 0;
    const chords = [
      [261.63, 329.63, 392, 493.88],
      [220, 261.63, 329.63, 392],
      [174.61, 220, 261.63, 329.63],
      [196, 246.94, 293.66, 392],
    ];
    const penta = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const step = (): void => {
      if (!this.bgmOn) return;
      const ch = chords[i % 4]!;
      i++;
      ch.forEach((f) => {
        this.pad(f, 9.5, 0.026);
        this.pad(f * 1.003, 9.5, 0.016, 'triangle');
      });
      this.pad(ch[0]! / 2, 9.5, 0.04);
      for (let k = 0; k < 3; k++)
        this.note(penta[Math.floor(Math.random() * penta.length)]!, {
          t: 1 + Math.random() * 6.5,
          dur: 2.2,
          vol: 0.018,
          bus: this.bgm,
          rev: 0.9,
        });
      this.bgmTimer = window.setTimeout(step, 8000);
    };
    step();
  }

  bgmStop(): void {
    this.bgmOn = false;
    clearTimeout(this.bgmTimer);
    if (!this.ctx) return;
    const n = this.ctx.currentTime;
    this.bgm.gain.cancelScheduledValues(n);
    this.bgm.gain.setValueAtTime(this.bgm.gain.value, n);
    this.bgm.gain.linearRampToValueAtTime(0, n + 1.2);
  }
}

export const SND = new Synth();

/** Pasang perilaku global: gestur pertama membuka audio, tab tersembunyi menangguhkan. */
export function setupAudio(): void {
  const unlock = (): void => {
    SND.init();
    if (store.settings.music) SND.bgmStart();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
  document.addEventListener('visibilitychange', () => (document.hidden ? SND.suspend() : SND.resume()));
  store.subscribe('settings', () => {
    if (store.settings.music && !SND.bgmOn) SND.bgmStart();
    else if (!store.settings.music && SND.bgmOn) SND.bgmStop();
  });
}
