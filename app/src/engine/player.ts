/**
 * Mesin langkah (PRD §9.1 engine/steps, §9.2; port `go`/`step`/`S` template).
 *  - go() menaikkan run, membatalkan pertanyaan, menutup lembar, lalu flush() papan dan semua gerak;
 *  - konteks c = {run, dir, seq, replay, entered, live};
 *  - setiap langkah idempoten; mundur = keadaan akhir tanpa animasi;
 *  - pertanyaan hanya muncul bila jawabannya belum ditulis, maju, dan jalur "Ikut berpikir";
 *  - putar otomatis: jeda 1,2 s × kecepatan, berhenti pada pertanyaan, konten opsional, dan langkah terakhir.
 */
import { flushSleeps, sleep } from '../core/clock';
import { cancelAll, completeAll } from '../core/motion';
import { completeTweens } from '../core/tween';
import { DUR } from '../core/tokens';
import type { Path } from '../core/store';
import type { Board, Ctx } from './board';
import type { Scene, CapAction } from './scene';
import type { SoalContent, Step } from './types';

export interface PlayerHooks {
  /** perbarui header, titik langkah, tombol (dipanggil setiap perubahan keadaan) */
  chrome: () => void;
  /** pindah antara lobi dan panggung utama */
  stage: (lobby: boolean, dir: 1 | -1) => void;
  /** pop-up SELESAI: first = langkah SELESAI dicapai saat maju (hitung kemajuan); false = dibuka ulang dari tombol */
  done: (first: boolean) => void;
  /** tutup lembar/pop-up apa pun saat pindah langkah */
  closeOverlays: () => void;
  /** posisi terakhir (disimpan lokal) */
  save: (i: number) => void;
  /** tawarkan konten opsional */
  optional: (panelHtml: string, title: string) => void;
}

/** Langkah 0 = lobi (template STEPS.unshift({ch:0})). */
export type PlayStep = Step | { ch: 0; lobby: true };

export class Player {
  readonly steps: PlayStep[];
  i = 0;
  private run = 0;
  private started = false;
  auto = false;
  /** langkah saat ini sudah selesai dijalankan (syarat putar otomatis menjadwalkan langkah berikut) */
  private stepDone = false;
  path: Path;

  constructor(
    readonly content: SoalContent,
    private readonly board: Board,
    private readonly scene: Scene,
    private readonly hooks: PlayerHooks,
    path: Path,
  ) {
    this.steps = [{ ch: 0, lobby: true }, ...content.steps];
    this.path = path;
    board.onPending = () => hooks.chrome();
    board.onReplay = () => this.go(this.i, 1, { replay: true });
  }

  readonly live = (run: number): boolean => run === this.run;

  /** pertanyaan cepat sedang terbuka (satu sumber: papan) */
  get pending(): boolean {
    return this.board.pending;
  }

  stepsOfCh(ch: number): number[] {
    return this.steps.map((s, i) => (s.ch === ch ? i : -1)).filter((i) => i >= 0);
  }

  indexOfCh(ch: number): number {
    return this.steps.findIndex((s) => s.ch === ch);
  }

  get current(): PlayStep {
    return this.steps[this.i]!;
  }

  get isLast(): boolean {
    return this.i >= this.steps.length - 1;
  }

  go(i: number, dir: 1 | -1 = 1, o: { replay?: boolean } = {}): void {
    i = Math.max(0, Math.min(this.steps.length - 1, i));
    const prevI = this.i;
    const st = this.steps[i]!;
    const pst = this.steps[prevI]!;
    const seq = this.started && i === prevI + 1 && dir > 0;
    // jangan percaya animasi lama
    this.board.cancelAsk();
    this.hooks.closeOverlays();
    this.stepDone = false;
    this.run++;
    const run = this.run;
    this.board.flush();
    completeAll();
    completeTweens();
    flushSleeps();
    const toLobby = st.ch === 0;
    const fromLobby = !this.started || pst.ch === 0;
    if (toLobby !== fromLobby || !this.started) this.hooks.stage(toLobby, dir);
    const entered = !this.started || pst.ch !== st.ch;
    this.i = i;
    this.started = true;
    this.board.foot.replaceChildren();
    if (toLobby) {
      this.auto = false;
      this.hooks.chrome();
      return;
    }
    this.hooks.save(i);
    const c: Ctx = { run, dir, seq, replay: !!o.replay, entered, live: () => this.live(run) };
    this.hooks.chrome();
    void this.exec(st as Step, c)
      .then((completed) => {
        if (completed && this.live(run)) {
          this.stepDone = true;
          this.afterStep(run);
        }
      })
      .catch((e: unknown) => console.error(e));
  }

  next(): void {
    if (!this.isLast) this.go(this.i + 1, 1);
    else this.hooks.done(false);
  }

  prev(): void {
    if (this.i > 0) this.go(this.i - 1, -1);
  }

  setAuto(on: boolean): void {
    this.auto = on;
    this.hooks.chrome();
    // jadwalkan hanya bila langkah sudah selesai; bila belum, afterStep dipanggil saat exec selesai
    if (on && this.stepDone && !this.pending && this.current.ch !== 0) this.afterStep(this.run);
  }

  /** Jalankan satu langkah sesuai data. Mengembalikan true bila selesai tanpa disela. */
  private async exec(st: Step, c: Ctx): Promise<boolean> {
    const chTitle = this.content.chapters[st.ch]?.t ?? '';
    const actions: CapAction[] = [];
    if (st.optional) {
      const opt = st.optional;
      actions.push(
        {
          label: opt.yes,
          icon: 'table',
          kind: 'secondary',
          onClick: () => this.hooks.optional(opt.panel, opt.label),
        },
        { label: 'Tidak, lanjut saja', icon: 'arrow-right', kind: 'secondary', onClick: () => this.next() },
      );
    }
    this.scene.setCap(st, chTitle, actions);
    const needPause = await this.scene.setVisual(st.visual, c);
    this.scene.layout();
    if (!c.live()) return false;

    const b = st.board;
    if (b) {
      const list = this.content.lists[b.list] ?? [];
      const pins = (b.pins ?? []).map((id) => this.content.pins[id]!).filter(Boolean);
      this.board.chapter(b.title, pins, c);
      if (needPause && !(await sleep(700))) return false;
      if (!c.live()) return false;
      const a = st.ask;
      const askIdx = a ? list.findIndex((r) => r.id === a.before) : -1;
      if (a && askIdx >= 0 && this.path === 'ikut' && c.dir > 0 && !c.replay && !this.board.has(a.before)) {
        if (!(await this.board.to(list, askIdx, b.from, c))) return false;
        const ok = await this.board.ask(a, c);
        if (!ok || !c.live()) return false;
        if (!(await this.board.to(list, b.upTo, askIdx, { ...c, seq: true }))) return false;
      } else if (!(await this.board.to(list, b.upTo, b.from, c))) return false;
    }

    if (st.visual.kind === 'done' && c.dir > 0) {
      if (!(await sleep(1300)) || !c.live()) return false;
      this.hooks.done(true);
    }
    return c.live();
  }

  private afterStep(run: number): void {
    const st = this.current as Step;
    if (!this.auto || this.pending || st.optional || this.isLast) return;
    void sleep(DUR.autoplayGap).then((ok) => {
      if (ok && this.auto && this.live(run) && !this.pending) this.next();
    });
  }

  /** Bersihkan semua saat halaman ditinggalkan. */
  stop(): void {
    this.run++;
    this.board.cancelAsk();
    cancelAll();
    flushSleeps();
  }
}
