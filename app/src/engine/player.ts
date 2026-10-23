/**
 * Mesin langkah (PRD §9.1 engine/steps, §9.2; port `go`/`step`/`S` template).
 *  - go() menaikkan run, membatalkan pertanyaan, menutup lembar, lalu flush() papan dan semua gerak;
 *  - konteks c = {run, dir, seq, replay, entered, live};
 *  - setiap langkah idempoten; mundur = keadaan akhir tanpa animasi;
 *  - pertanyaan hanya muncul bila jawabannya belum ditulis, maju, dan jalur "Ikut berpikir";
 *  - putar otomatis: jeda 1,2 s × kecepatan, berhenti pada pertanyaan, konten opsional, tawaran bagian opsional,
 *    dan langkah terakhir;
 *  - bagian opsional (v1.18): tawaran `branch` → "Ya" masuk, "Tidak"/Lanjut melewati; Kembali dari bagian
 *    sesudahnya ke tawaran bila bagian opsional belum dimasuki;
 *  - Lanjut saat animasi langkah masih berjalan = selesaikan langkah itu dulu (keadaan akhir tanpa animasi);
 *    tekanan berikutnya baru pindah langkah. Ditekan beruntun pun setiap langkah tampil selesai, berurutan.
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
  /** pop-up SELESAI sudah pernah tampil di halaman ini (kemajuan dihitung sekali) */
  private doneSeen = false;
  /** animasi langkah (visual + penulisan papan + pertanyaan) sedang berlangsung */
  private animating = false;
  /** run tempat pop-up SELESAI terakhir dibuka (cegah dibuka dua kali oleh tombol dan jeda akhir) */
  private doneRun = -1;
  /** bagian opsional yang sudah dimasuki siswa di halaman ini (Kembali tidak tersesat ke bagian yang dilewati) */
  private readonly optSeen = new Set<number>();
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
    board.setPinsLabel(content.pinsLabel);
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
    this.animating = true;
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
    if (this.content.chapters[st.ch]?.opt) this.optSeen.add(st.ch);
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
          this.hooks.chrome();
          this.afterStep(run);
        }
      })
      .catch((e: unknown) => console.error(e));
  }

  /** Animasi langkah ini masih berjalan (atau menunggu jawaban pertanyaan cepat). */
  get running(): boolean {
    return this.started && this.current.ch !== 0 && this.animating;
  }

  next(): void {
    // animasi belum selesai: tampilkan dulu keadaan akhir langkah ini, jangan melompat
    if (this.running) return this.settle();
    // tawaran bagian opsional: Lanjut = tidak mau, lewati bagian itu
    if ((this.current as Step).branch) return this.go(this.afterOpt(this.current.ch + 1), 1);
    if (!this.isLast) this.go(this.i + 1, 1);
    else this.showDone();
  }

  /** Indeks langkah pertama sesudah bagian ch. */
  private afterOpt(ch: number): number {
    const ids = this.stepsOfCh(ch);
    return ids.length ? ids[ids.length - 1]! + 1 : this.i + 1;
  }

  /** Selesaikan langkah saat ini seketika (baris lengkap, visual di keadaan akhir). */
  settle(): void {
    this.go(this.i, -1);
  }

  private showDone(): void {
    this.doneRun = this.run;
    this.hooks.done(!this.doneSeen);
    this.doneSeen = true;
  }

  prev(): void {
    if (this.i <= 0) return;
    const ch = this.steps[this.i - 1]!.ch;
    // langkah sebelumnya ada di bagian opsional yang dilewati: kembali ke tawarannya
    if (ch !== this.current.ch && this.content.chapters[ch]?.opt && !this.optSeen.has(ch))
      return this.go(this.indexOfCh(ch) - 1, -1);
    this.go(this.i - 1, -1);
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
    if (st.branch) {
      const opt = st.ch + 1;
      actions.push(
        {
          label: st.branch.yes,
          icon: 'play',
          kind: 'secondary',
          onClick: () => this.go(this.indexOfCh(opt), 1),
        },
        {
          label: 'Tidak, lanjut saja',
          icon: 'arrow-right',
          kind: 'secondary',
          onClick: () => this.go(this.afterOpt(opt), 1),
        },
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
      if (!(await this.board.setCut(b.cut ?? [], c)) || !c.live()) return false;
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
      if (b.save && !(await this.board.save(b.save.map((id) => this.content.pins[id]!).filter(Boolean), c)))
        return false;
    }

    // animasi langkah selesai: Lanjut berikutnya pindah langkah (jeda di bawah ini hanya irama)
    if (c.live()) {
      this.animating = false;
      this.hooks.chrome();
    }
    if (st.visual.kind === 'done' && c.dir > 0) {
      if (!(await sleep(1300)) || !c.live()) return false;
      if (this.doneRun !== c.run) this.showDone();
    }
    return c.live();
  }

  private afterStep(run: number): void {
    const st = this.current as Step;
    if (!this.auto || this.pending || st.optional || st.branch || this.isLast) return;
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
