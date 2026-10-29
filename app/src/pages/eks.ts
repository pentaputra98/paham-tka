/**
 * Ekspedisi TKA (revisi pemilik v1.26–v1.27): permainan kelas untuk menguatkan titik lemah, bukan materi baru.
 * - #/ekspedisi: pilih peran — Kelompok (tablet), Game Master (guru, berkata sandi), Coba cara bermain, Riwayat.
 * - Kelompok: kode gabung (dari guru, satu per satu) → konfirmasi kelompok → nama anggota → swafoto (opsional)
 *   → urutan giliran → tunggu kode mulai dari layar guru → peta jalur pos (berurutan) → soal: serah giliran,
 *   hitung mundur 5 detik, fase Mandiri lalu Diskusi, jebakan + soal kembaran → kode bukti → layar selesai.
 * - Game Master: siapkan waktu, kelompok, pos → kode gabung tersembunyi (dibuka satu per satu) → Mulai (kode
 *   mulai tampil) → kode bukti → peringkat → waktu habis → podium, konfeti, statistik → riwayat.
 * Tanpa server: tablet dan laptop terhubung lewat kode (src/eks/codes.ts). Bahasa permainan hanya di mode ini.
 */
import { SND } from '../core/audio';
import { reducedMotion } from '../core/clock';
import { esc, html, pad2 } from '../core/dom';
import { icon, type IconName } from '../core/icons';
import { mathHtml, renderMath } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE_OUT, SLIDE_PX } from '../core/tokens';
import { gameItem, POS, type GItem } from '../eks/bank';
import {
  checkGmPassword,
  checkStart,
  emblem,
  joinCode,
  makeGameCode,
  parseJoin,
  posList,
  posMaskOf,
  proofCode,
  readProof,
  startCode,
  teamName,
  POS_IDS,
  type PosId,
} from '../eks/codes';
import { confetti, countdown, flash, openCamera, type Camera } from '../eks/fx';
import {
  answerer,
  gmStore,
  HELP_PER_POS,
  HINTS,
  history,
  newTeam,
  nextTurn,
  PTS,
  ranking,
  T_KEDUA,
  T_MANDIRI,
  T_PACU,
  T_SOAL,
  takeReporter,
  teamStore,
  timeLeft,
  type GmState,
  type PosResult,
  type TeamState,
} from '../eks/state';
import type { PageView } from '../shell/app';
import { mountKeyboard, type Keyboard } from '../shell/keyboard';
import { closeSheet, isSheetOpen, openSheet } from '../shell/sheet';
import { toast } from '../shell/toast';

const LETTERS = 'ABCDE';
const mmss = (ms: number): string => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
};
const DEMO_GAME = 'DEMO';
/** latihan: waktu dipersingkat agar semua fase sempat dialami */
const DEMO_T = { mandiri: 12_000, soal: 45_000, kedua: 25_000 };
/** tombol mulai baru aktif setelah jeda ini (cegah tekan terburu-buru) */
const GATE_MS = 5000;
const LOW_SOAL = 15_000;
const LOW_PACU = 30_000;

/** pos yang memakai alur dua fase (bukan Pacu Waktu) */
type SoalPos = Exclude<PosId, 6> | 0;

const emblemHtml = (team: number, photo?: string, cls = ''): string =>
  photo
    ? `<span class="eks-emb eks-emb--photo ${cls}" style="--tc: var(--team-${team})"><img src="${photo}" alt="Foto kelompok ${team}"></span>`
    : `<span class="eks-emb ${cls}" style="--tc: var(--team-${team})" aria-hidden="true">${icon(emblem(team).icon as IconName)}</span>`;

const fmtDate = (ts: number): string =>
  new Date(ts).toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

export function eksPage(): PageView {
  const el = html('<div class="eks"></div>');
  const cleanups: Array<() => void> = [];
  const clear = (): void => {
    while (cleanups.length) cleanups.pop()!();
  };
  const view: PageView = {
    el,
    title: 'Ekspedisi TKA',
    header: { back: { label: 'Beranda', href: '#/' } },
    footer: false,
    destroy: clear,
  };

  /** pengatur waktu layar berikutnya: dipasang sebelum show(), dibersihkan saat layar itu diganti */
  let pending: Array<() => void> = [];

  function show(node: HTMLElement): void {
    clear();
    cleanups.push(...pending);
    pending = [];
    if (isSheetOpen()) closeSheet();
    if (reducedMotion()) node.classList.add('is-calm');
    el.replaceChildren(node);
    renderMath(node);
    if (el.isConnected)
      play(
        node,
        [
          { opacity: 0, transform: `translateX(${SLIDE_PX}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.enter, easing: EASE_OUT, ui: true },
      );
  }

  /** setInterval milik layar yang akan ditampilkan (panggil sebelum show) */
  function every(ms: number, f: () => void): void {
    const id = window.setInterval(f, ms);
    pending.push(() => window.clearInterval(id));
  }

  /** papan ketik aplikasi: TIDAK terbuka sendiri; muncul saat kolom diketuk */
  function keyboard(
    fields: Array<{ input: HTMLInputElement; label: string; caps?: boolean }>,
    onDone: () => void,
  ): Keyboard {
    const kb = mountKeyboard(el, fields, onDone);
    cleanups.push(() => kb.destroy());
    return kb;
  }

  // ===========================================================================================
  // Peran
  // ===========================================================================================
  function roleView(): void {
    const saved = teamStore.load();
    const gm = gmStore.load();
    const hist = history.team();
    const playing = !!saved && !saved.demo && !saved.finished;
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <section class="eks-hero bp crop" aria-labelledby="eks-t">
        <p class="eyebrow">Permainan kelas · menguatkan titik lemah</p>
        <h1 class="eks-title" id="eks-t">${icon('route')}Ekspedisi TKA</h1>
        <p class="eks-lede">Setiap kelompok menempuh jalur pos jebakan TKA dengan satu tablet. Penjawab bergiliran duduk di meja depan; teman setim baru boleh membantu di fase Diskusi. Selesaikan pos, bawa kode bukti ke Game Master, dan naikkan peringkat kelompokmu.</p>
      </section>
      <div class="eks-roles">
        ${
          playing
            ? `<button type="button" class="eks-role eks-role--main" data-role="resume">${emblemHtml(saved.team, saved.photo)}<b>Lanjutkan ekspedisi</b><span>${teamName(saved.team)} · ${saved.members.length} anggota</span></button>`
            : ''
        }
        <button type="button" class="eks-role${playing ? '' : ' eks-role--main'}" data-role="team">${icon('users')}<b>Masuk sebagai kelompok</b><span>Pakai kode gabung dari guru</span></button>
        <button type="button" class="eks-role" data-role="demo">${icon('play')}<b>Coba cara bermain</b><span>Latihan 2 soal, semua fase dicoba, tidak dinilai</span></button>
        <button type="button" class="eks-role eks-role--gm" data-role="gm">${icon('key-round')}<b>Game Master (guru)</b><span>${gm && !gm.revealed ? 'Permainan sedang berjalan' : 'Perlu kata sandi'}</span></button>
        ${hist.length ? `<button type="button" class="eks-role" data-role="hist">${icon('history')}<b>Riwayat ekspedisi</b><span>${hist.length} permainan di tablet ini</span></button>` : ''}
      </div>
    </div></div>`);
    node.addEventListener('click', (e) => {
      const r = (e.target as Element).closest<HTMLElement>('[data-role]')?.dataset.role;
      if (!r) return;
      SND.click();
      if (r === 'resume') mapView();
      else if (r === 'hist') historyView();
      else if (r === 'team') {
        if (playing)
          openSheet({
            title: 'Ganti kelompok?',
            body: `<p>Tablet ini masih menyimpan ekspedisi <b>${teamName(saved.team)}</b>. Masuk dengan kode baru akan menghapusnya dari tablet ini. Pos yang sudah dilaporkan tetap tercatat di papan Game Master.</p>`,
            actions: [
              { label: 'Lanjutkan ekspedisi', kind: 'primary', onClick: () => setTimeout(mapView, 0) },
              {
                label: 'Masuk dengan kode baru',
                onClick: () => {
                  teamStore.clear();
                  setTimeout(joinView, 0);
                },
              },
            ],
            closeLabel: null,
          });
        else joinView();
      } else if (r === 'demo') membersView(DEMO_GAME, 1, true);
      else if (gmStore.unlocked()) gmEntry();
      else gmLockView();
    });
    show(node);
  }

  // ===========================================================================================
  // Kelompok: gabung, konfirmasi, anggota, swafoto, urutan, gerbang mulai
  // ===========================================================================================
  function joinView(): void {
    const node = html(`<div class="eks-center"><section class="eks-card" aria-labelledby="j-t">
      <h2 class="eks-h2" id="j-t">${icon('users')}Masuk sebagai kelompok</h2>
      <p class="eks-note">Minta <b>kode gabung</b> kelompokmu kepada guru. Guru menampilkannya satu per satu di layar depan; perwakilan kelompok mengetiknya di sini.</p>
      <label class="tes-field"><span class="tes-lbl">Kode gabung</span>
        <input class="tes-input eks-code-in num" data-code maxlength="8" autocomplete="off" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        <button type="button" class="btn btn--primary" data-go>${icon('arrow-right')}<span>Masuk</span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-code]')!;
    const err = node.querySelector<HTMLElement>('[data-err]')!;
    const submit = (): void => {
      const j = parseJoin(input.value);
      if (!j) {
        err.textContent = 'Kode tidak dikenali. Periksa lagi hurufnya bersama guru.';
        SND.wrong();
        return;
      }
      confirmView(j.game, j.team);
    };
    node.querySelector('[data-go]')!.addEventListener('click', submit);
    node.querySelector('[data-back]')!.addEventListener('click', roleView);
    show(node);
    keyboard([{ input, label: 'Kode gabung', caps: true }], submit);
  }

  /** salah ketik kode kelompok lain? tampilkan kelompoknya besar-besar dulu */
  function confirmView(game: string, team: number): void {
    const node = html(`<div class="eks-center"><section class="eks-card eks-confirm" aria-labelledby="c-t">
      ${emblemHtml(team, undefined, 'eks-emb--xl')}
      <p class="eks-note">Kode ini milik</p>
      <h2 class="eks-confirm-n" id="c-t" style="--tc: var(--team-${team})">${teamName(team)}</h2>
      <p>Benar ini kelompok kalian? Cocokkan dengan nama kelompok di layar guru.</p>
      <div class="tes-actions"><button type="button" class="btn" data-no>${icon('arrow-left')}<span>Bukan, ketik ulang</span></button>
        <button type="button" class="btn btn--primary btn--lg" data-yes>${icon('check')}<span>Ya, benar</span></button></div>
    </section></div>`);
    node.querySelector('[data-no]')!.addEventListener('click', joinView);
    node.querySelector('[data-yes]')!.addEventListener('click', () => membersView(game, team, false));
    show(node);
  }

  function membersView(game: string, team: number, demo: boolean): void {
    const names: string[] = [];
    const node = html(`<div class="eks-center"><section class="eks-card eks-card--wide" aria-labelledby="m-t">
      <h2 class="eks-h2" id="m-t">${demo ? `${icon('play')}Coba cara bermain` : `${emblemHtml(team)}${teamName(team)}`}: nama anggota</h2>
      <p class="eks-note">Ketuk kolom, ketik satu nama, lalu tekan <b>Selesai</b>. Ulangi untuk anggota berikutnya (2–8 orang). Aplikasi mengacak urutan giliran dari nama-nama ini.</p>
      <div class="eks-add"><label class="tes-field"><span class="tes-lbl">Nama anggota</span>
        <input class="tes-input" data-name maxlength="20" autocomplete="off" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
        <button type="button" class="btn" data-add>${icon('plus')}<span>Tambah</span></button></div>
      <ol class="eks-names" data-list></ol>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        <button type="button" class="btn btn--primary" data-go>${icon('arrow-right')}<span>Lanjut</span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-name]')!;
    const list = node.querySelector<HTMLElement>('[data-list]')!;
    const err = node.querySelector<HTMLElement>('[data-err]')!;
    const render = (): void => {
      list.innerHTML = names
        .map(
          (n, i) =>
            `<li><span class="eks-num num">${i + 1}</span><span class="eks-nm">${esc(n)}</span><button type="button" class="icon-btn" data-del="${i}" aria-label="Hapus ${esc(n)}">${icon('x')}</button></li>`,
        )
        .join('');
    };
    const add = (): boolean => {
      const v = input.value.trim().replace(/\s+/g, ' ');
      if (!v) return false;
      if (names.length >= 8) {
        err.textContent = 'Paling banyak 8 anggota.';
        return false;
      }
      if (names.some((n) => n.toLowerCase() === v.toLowerCase())) {
        err.textContent = 'Nama itu sudah ada. Tambahkan inisial, misalnya "Budi S".';
        return false;
      }
      err.textContent = '';
      names.push(v);
      input.value = '';
      render();
      return true;
    };
    node.querySelector('[data-add]')!.addEventListener('click', () => {
      if (!add()) kb.open(0);
    });
    list.addEventListener('click', (e) => {
      const d = (e.target as Element).closest<HTMLElement>('[data-del]');
      if (!d) return;
      names.splice(Number(d.dataset.del), 1);
      render();
    });
    node.querySelector('[data-go]')!.addEventListener('click', () => {
      add();
      kb.close();
      if (names.length < 2) {
        err.textContent = 'Isi paling sedikit 2 nama anggota.';
        return;
      }
      const t = newTeam(game, team, [...names], demo);
      teamStore.save(t);
      if (demo) orderView(t);
      else selfieView(t);
    });
    node.querySelector('[data-back]')!.addEventListener('click', roleView);
    show(node);
    // "Selesai" menambahkan satu nama lalu papan ketik tertutup (tidak berputar terus)
    const kb = keyboard([{ input, label: 'Nama anggota' }], () => void add());
  }

  /** Swafoto kelompok: layar memutih sebagai lampu, foto hanya disimpan di tablet ini. */
  function selfieView(t: TeamState): void {
    const node = html(`<div class="eks-selfie">
      <div class="eks-selfie-c">
        <h2 class="eks-h2">${icon('camera')}Swafoto ${esc(teamName(t.team))}</h2>
        <p class="eks-note">Berkumpul di depan tablet. Layar dibuat terang agar wajah kalian jelas. Foto hanya tersimpan di tablet ini dan menjadi ikon kelompok kalian.</p>
        <div class="eks-lens" style="--tc: var(--team-${t.team})"><video data-video playsinline muted></video><img data-shot alt="Swafoto kelompok" hidden><span class="eks-lens-cd num" data-cd hidden></span></div>
        <p class="tes-err" role="alert" data-err></p>
        <div class="tes-actions" data-act-live><button type="button" class="btn" data-skip>${icon('arrow-right')}<span>Lewati</span></button>
          <button type="button" class="btn btn--primary btn--lg" data-snap disabled>${icon('camera')}<span>Ambil foto</span></button></div>
        <div class="tes-actions" data-act-done hidden><button type="button" class="btn" data-again>${icon('rotate-ccw')}<span>Ulangi</span></button>
          <button type="button" class="btn btn--primary btn--lg" data-use>${icon('check')}<span>Pakai foto ini</span></button></div>
      </div>
    </div>`);
    const q = <T extends HTMLElement>(s: string): T => node.querySelector<T>(s)!;
    const video = q<HTMLVideoElement>('[data-video]');
    const img = q<HTMLImageElement>('[data-shot]');
    let cam: Camera | null = null;
    let shot = '';
    cleanups.push(() => cam?.stop());
    const live = (on: boolean): void => {
      video.hidden = !on;
      img.hidden = on;
      q('[data-act-live]').hidden = !on;
      q('[data-act-done]').hidden = on;
    };
    const next = (): void => {
      cam?.stop();
      if (shot) {
        t.photo = shot;
        teamStore.save(t);
      }
      orderView(t);
    };
    q('[data-skip]').addEventListener('click', next);
    q('[data-use]').addEventListener('click', next);
    q('[data-again]').addEventListener('click', () => {
      shot = '';
      live(true);
    });
    q('[data-snap]').addEventListener('click', () => {
      if (!cam) return;
      const cd = q<HTMLElement>('[data-cd]');
      const btn = q<HTMLButtonElement>('[data-snap]');
      btn.disabled = true;
      let k = 3;
      cd.hidden = false;
      const tick = (): void => {
        if (!node.isConnected) return;
        if (k === 0) {
          cd.hidden = true;
          flash(node);
          shot = cam!.shot();
          img.src = shot;
          live(false);
          btn.disabled = false;
          return;
        }
        cd.textContent = String(k);
        play(
          cd,
          [
            { opacity: 0, transform: 'scale(1.5)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: DUR.base,
            ui: true,
          },
        );
        k--;
        window.setTimeout(tick, 800);
      };
      tick();
    });
    show(node);
    void openCamera(video).then((c) => {
      if (!node.isConnected) {
        c?.stop();
        return;
      }
      cam = c;
      if (c) q<HTMLButtonElement>('[data-snap]').disabled = false;
      else
        q('[data-err]').textContent =
          'Kamera tidak bisa dibuka (izin ditolak atau tidak ada kamera). Tekan Lewati; kelompok kalian memakai lambang.';
    });
  }

  function orderView(t: TeamState): void {
    const T = t.demo
      ? { m: DEMO_T.mandiri, s: DEMO_T.soal, k: DEMO_T.kedua }
      : { m: T_MANDIRI, s: T_SOAL, k: T_KEDUA };
    const node = html(`<div class="eks-center"><section class="eks-card eks-card--wide" aria-labelledby="o-t">
      <h2 class="eks-h2" id="o-t">${emblemHtml(t.team, t.photo)}Urutan giliran</h2>
      <ol class="eks-order">${t.order.map((i, k) => `<li style="--i:${k}"><span class="eks-num num">${k + 1}</span>${esc(t.members[i]!)}</li>`).join('')}</ol>
      <ul class="eks-rules">
        <li>${icon('armchair')}<span><b>Penjawab duduk di meja depan</b> sendirian dan memegang tablet. Anggota lain menunggu di belakang.</span></li>
        <li>${icon('user')}<span><b>Fase Mandiri ${T.m / 1000} detik</b>: hanya penjawab yang berpikir. Benar = <b>${PTS.mandiri}</b> poin.</span></li>
        <li>${icon('users')}<span><b>Fase Diskusi</b>: otomatis setelah ${T.m / 1000} detik, semua boleh ke meja. Penjawab tetap yang menekan dan menjelaskan. Benar = <b>${PTS.diskusi}</b> poin. <b>Panggil tim lebih awal</b> hanya ${HELP_PER_POS}× per pos.</span></li>
        <li>${icon('rotate-ccw')}<span><b>Salah?</b> Jebakannya ditunjukkan, lalu ada soal kembaran ${T.k / 1000} detik. Benar = <b>${PTS.kedua}</b> poin.</span></li>
        <li>${icon('lightbulb')}<span><b>${HINTS} petunjuk</b> untuk seluruh permainan. Soal yang memakai petunjuk paling banyak ${PTS.diskusi} poin.</span></li>
        <li>${icon('hourglass')}<span>Setiap soal paling lama ${T.s >= 60000 ? `${T.s / 60000} menit` : `${T.s / 1000} detik`}. Pos dikerjakan <b>berurutan</b> mengikuti jalur peta.</span></li>
      </ul>
      <div class="tes-actions"><button type="button" class="btn btn--primary btn--lg" data-go>${icon('arrow-right')}<span>${t.demo ? 'Mulai latihan' : 'Lanjut'}</span></button></div>
    </section></div>`);
    node.querySelector('[data-go]')!.addEventListener('click', () => (t.demo ? soalView(t, 0) : gateView(t)));
    show(node);
  }

  /** Gerbang: kelompok baru bisa mulai dengan kode mulai yang tampil di layar guru setelah guru menekan Mulai. */
  function gateView(t: TeamState): void {
    const node =
      html(`<div class="eks-center eks-gate-bg"><section class="eks-card eks-gate" role="dialog" aria-labelledby="w-t">
      ${emblemHtml(t.team, t.photo, 'eks-emb--xl')}
      <h2 class="eks-h2" id="w-t">${icon('hourglass')}Tunggu aba-aba guru</h2>
      <ol class="eks-gate-steps">
        <li>Semua anggota ${esc(teamName(t.team))} berkumpul di meja kelompok.</li>
        <li>Dengarkan instruksi guru. Saat guru menekan <b>Mulai</b>, <b>kode mulai</b> 3 huruf tampil di layar depan.</li>
        <li>Ketik kode mulai itu, lalu tekan <b>Mulai ekspedisi</b>.</li>
      </ol>
      <label class="tes-field"><span class="tes-lbl">Kode mulai</span>
        <input class="tes-input eks-code-in num" data-start maxlength="3" autocomplete="off" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn btn--primary btn--lg" data-go disabled>${icon('flag-triangle-right')}<span data-go-t></span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-start]')!;
    const go = node.querySelector<HTMLButtonElement>('[data-go]')!;
    const t0 = Date.now();
    const sync = (): void => {
      const wait = GATE_MS - (Date.now() - t0);
      go.disabled = wait > 0;
      node.querySelector('[data-go-t]')!.textContent =
        wait > 0 ? `Siap dalam ${Math.ceil(wait / 1000)} detik` : 'Mulai ekspedisi';
    };
    const submit = (): void => {
      if (go.disabled) return;
      if (!checkStart(t.game, input.value)) {
        node.querySelector('[data-err]')!.textContent =
          'Kode mulai belum cocok. Tunggu guru menekan Mulai, lalu lihat layar depan.';
        SND.wrong();
        return;
      }
      t.started = true;
      t.startAt = Date.now();
      teamStore.save(t);
      SND.chime();
      mapView();
    };
    go.addEventListener('click', submit);
    every(250, sync);
    show(node);
    sync();
    keyboard([{ input, label: 'Kode mulai', caps: true }], submit);
  }

  // ===========================================================================================
  // Kelompok: peta jalur pos (berurutan)
  // ===========================================================================================
  const total = (t: TeamState): number => Object.values(t.results).reduce((s, r) => s + (r?.score ?? 0), 0);
  const hintDots = (left: number): string =>
    `<span class="eks-tokens" aria-label="${left} dari ${HINTS} petunjuk tersedia">${Array.from(
      { length: HINTS },
      (_, i) => `<span class="eks-token${i < left ? ' is-on' : ''}">${icon('lightbulb')}</span>`,
    ).join('')}</span>`;

  function mapView(): void {
    const t = teamStore.load();
    if (!t) return roleView();
    if (t.finished) return finishView(t);
    if (!t.started) return gateView(t);
    const active = posList(posMaskOf(t.game));
    const nextPos = active.find((p) => !t.results[p]);
    if (!nextPos) return finishView(t);
    const r0 = t.cur?.pos;
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <header class="eks-map-h">
        <div class="eks-map-id">${emblemHtml(t.team, t.photo, 'eks-emb--lg')}<div><p class="eyebrow">Ekspedisi TKA</p><h1 class="eks-h1">${esc(teamName(t.team))}</h1></div></div>
        <dl class="eks-stats">
          <div><dt>Skor</dt><dd class="num">${total(t)}</dd></div>
          <div><dt>Petunjuk tersedia</dt><dd>${hintDots(t.hints)}<small>${t.hints} dari ${HINTS}</small></dd></div>
          <div><dt>Waktu berjalan</dt><dd class="num" data-elapsed></dd></div>
          <div><dt>Penjawab berikutnya</dt><dd>${esc(answerer(t))}</dd></div>
        </dl>
      </header>
      <section class="eks-trail bp" aria-label="Jalur pos">
        <svg class="eks-path" aria-hidden="true"></svg>
        <ol class="eks-pins">${active
          .map((p, k) => {
            const r = t.results[p];
            const cur = p === nextPos;
            return `<li class="eks-pin${r ? ' is-done' : ''}${cur ? ' is-cur' : ''}${!r && !cur ? ' is-locked' : ''}" style="--k:${k}" data-pin="${p}">
              <span class="eks-pin-dot">${r ? icon('check') : cur ? icon('map-pin') : icon('lock')}</span>
              <span class="eks-pin-n num">Pos ${pad2(p)}</span>
              <b>${POS[p].name}</b>
              <span class="eks-pin-s">${r ? `${r.score} poin` : cur ? (r0 === p ? 'Lanjutkan' : 'Berikutnya') : 'Terkunci'}</span>
            </li>`;
          })
          .join('')}</ol>
      </section>
      <section class="eks-next" aria-labelledby="nx-t">
        <div><p class="eyebrow">Pos ${pad2(nextPos)} · ${active.indexOf(nextPos) + 1} dari ${active.length}</p>
          <h2 class="eks-h2" id="nx-t">${POS[nextPos].name}</h2>
          <p>${POS[nextPos].goal} · ${POS[nextPos].n} soal${nextPos === 6 ? ' · 5 menit untuk semuanya' : ''}${nextPos === 7 ? ' · tanpa petunjuk' : ''}</p></div>
        <button type="button" class="btn btn--primary btn--lg" data-go>${icon('play')}<span>${r0 === nextPos ? 'Lanjutkan pos' : 'Mulai pos'}</span></button>
      </section>
      <div class="eks-done-list">${active
        .filter((p) => t.results[p])
        .map(
          (p) =>
            `<button type="button" class="eks-chip" data-code="${p}">${icon('circle-check')}${POS[p].name} · kode <b class="num">${t.results[p]!.code}</b></button>`,
        )
        .join('')}</div>
      <div class="eks-foot">
        <button type="button" class="eks-end-btn" data-end>${icon('flag')}<span><b>Selesai ekspedisi</b><small>Tekan saat guru mengumumkan waktu habis</small></span></button>
        <button type="button" class="link-btn" data-leave>Keluar dari ekspedisi di tablet ini</button>
      </div>
    </div></div>`);
    const drawPath = (): void => {
      const svg = node.querySelector<SVGSVGElement>('.eks-path')!;
      const box = svg.getBoundingClientRect();
      const pts = [...node.querySelectorAll<HTMLElement>('.eks-pin-dot')].map((d) => {
        const r = d.getBoundingClientRect();
        return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top] as const;
      });
      if (pts.length < 2 || !box.width) return;
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const seg = (a: readonly [number, number], b: readonly [number, number]): string => {
        const mx = (a[0] + b[0]) / 2;
        return `M${a[0]},${a[1]} C${mx},${a[1]} ${mx},${b[1]} ${b[0]},${b[1]}`;
      };
      const done = active.filter((p) => t.results[p]).length;
      svg.innerHTML = pts
        .slice(1)
        .map((b, k) => `<path d="${seg(pts[k]!, b)}" class="${k < done ? 'is-done' : ''}"/>`)
        .join('');
    };
    const ro = new ResizeObserver(() => drawPath());
    cleanups.push(() => ro.disconnect());
    every(1000, () => {
      const e = node.querySelector('[data-elapsed]');
      if (e) e.textContent = mmss(Date.now() - (t.startAt ?? Date.now()));
    });
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      if (tg.closest('[data-go]')) {
        SND.click();
        if (nextPos === 6) pacuView(t);
        else soalView(t, nextPos);
        return;
      }
      const c = tg.closest<HTMLElement>('[data-code]');
      if (c) {
        const p = Number(c.dataset.code) as PosId;
        return reportView(t, p, t.results[p]!, false);
      }
      const pin = tg.closest<HTMLElement>('[data-pin]');
      if (pin?.classList.contains('is-locked'))
        toast('Pos dikerjakan berurutan mengikuti jalur. Selesaikan pos berikutnya dulu.');
      if (tg.closest('[data-end]'))
        openSheet({
          title: 'Selesaikan ekspedisi?',
          body: '<p>Tekan ini saat guru mengumumkan waktu habis. Pos yang belum selesai tidak bisa dikerjakan lagi. Kode bukti pos terakhir yang belum dilaporkan masih bisa dibawa ke Game Master.</p>',
          actions: [
            { label: 'Lanjut bermain', kind: 'secondary' },
            {
              label: 'Selesai ekspedisi',
              kind: 'danger',
              icon: 'flag',
              onClick: () => {
                t.finished = true;
                t.cur = null;
                teamStore.save(t);
                setTimeout(() => finishView(t), 0);
              },
            },
          ],
          closeLabel: null,
        });
      if (tg.closest('[data-leave]'))
        openSheet({
          title: 'Keluar dari ekspedisi?',
          body: '<p>Data kelompok di tablet ini akan dihapus. Pos yang sudah dilaporkan tetap tercatat di papan Game Master.</p>',
          actions: [
            { label: 'Batal', kind: 'secondary' },
            {
              label: 'Keluar',
              kind: 'danger',
              onClick: () => {
                teamStore.clear();
                setTimeout(roleView, 0);
              },
            },
          ],
          closeLabel: null,
        });
    });
    show(node);
    node.querySelector('[data-elapsed]')!.textContent = mmss(Date.now() - (t.startAt ?? Date.now()));
    ro.observe(node.querySelector('.eks-trail')!);
    requestAnimationFrame(drawPath);
  }

  // ===========================================================================================
  // Kelompok: soal dua fase
  // ===========================================================================================
  function stageHtml(head: string, t: TeamState): HTMLElement {
    return html(`<div class="eks-play">
      <div class="eks-bar">
        <span class="eks-who">${icon('armchair')}<span data-who></span></span>
        <span class="eks-phase" data-phase></span>
        <span class="eks-clock num" data-clock></span>
        <span class="eks-bar-sp"></span>
        <button type="button" class="btn eks-hint-btn" data-hint>${icon('lightbulb')}<span class="eks-hint-l">Petunjuk tersedia</span><span class="eks-hint-v" data-hints></span></button>
        <button type="button" class="btn btn--primary" data-help>${icon('users')}<span data-help-t></span></button>
      </div>
      <p class="eks-coach" data-coach hidden></p>
      <section class="tes-stage eks-stage" aria-label="Soal">
        <article class="soal tes-paper eks-paper">
          <header class="soal-h"><span>${head}</span><span data-step></span></header>
          <div class="soal-b" data-paper></div>
          <div class="eks-hintbox" data-hintbox hidden></div>
        </article>
        <div class="tes-ans">
          <p class="tes-k">Pilih satu jawaban</p>
          <div class="tes-opts" data-opts></div>
        </div>
      </section>
      <div class="eks-veil" data-veil hidden></div>
      <span class="eks-team-tag" aria-hidden="true">${emblemHtml(t.team, t.photo)}</span>
    </div>`);
  }

  function renderOptions(box: HTMLElement, it: GItem, struck: Set<number>): void {
    const textual = it.options.some((o) => o.replace(/\$[^$]*\$/g, '').trim().length > 0);
    box.className = `tes-opts${textual ? ' is-col' : ''}`;
    box.setAttribute('role', 'radiogroup');
    box.innerHTML = it.options
      .map(
        (o, i) =>
          `<button type="button" role="radio" class="tes-opt${struck.has(i) ? ' is-struck' : ''}" data-opt="${i}" aria-checked="false" ${struck.has(i) ? 'disabled' : ''}><span class="ol">${LETTERS[i]}</span><span class="tes-opt-m">${mathHtml(o)}</span></button>`,
      )
      .join('');
  }

  /** Alur pos biasa (pos 0–5 dan 7). */
  function soalView(t: TeamState, pos: SoalPos): void {
    const demo = t.demo;
    const TM = demo ? DEMO_T.mandiri : T_MANDIRI;
    const TS = demo ? DEMO_T.soal : T_SOAL;
    const TK = demo ? DEMO_T.kedua : T_KEDUA;
    const n = POS[pos].n;
    // lanjutkan pos yang sedang dikerjakan (tablet dimuat ulang atau sempat ditinggal)
    const prev = t.cur && t.cur.pos === pos ? t.cur : null;
    const results: number[] = prev ? [...prev.pts] : [];
    let wrong = prev?.wrong ?? 0;
    let helped = prev?.helped ?? 0;
    let firstAll = prev?.firstAll ?? true;
    let helpUsed = prev?.help ?? 0;
    let open = false;
    const node = stageHtml(`${POS[pos].name}`, t);
    const q = <T extends HTMLElement>(s: string): T => node.querySelector<T>(s)!;
    const paperB = q<HTMLElement>('[data-paper]');
    const opts = q<HTMLElement>('[data-opts]');
    const veil = q<HTMLElement>('[data-veil]');
    const hintBox = q<HTMLElement>('[data-hintbox]');
    const coach = q<HTMLElement>('[data-coach]');
    if (pos === 7) q<HTMLElement>('[data-hint]').hidden = true;

    let i = prev?.i ?? 0;
    let it: GItem;
    let phase: 'siap' | 'hitung' | 'mandiri' | 'diskusi' | 'kedua' | 'hasil' = 'siap';
    let t0 = 0;
    let usedHint = false;
    let struck = new Set<number>();

    /** latihan: penjelasan singkat untuk setiap fase */
    const say = (text: string): void => {
      if (!demo) return;
      coach.hidden = !text;
      coach.innerHTML = text ? `${icon('sparkles')}<span>${text}</span>` : '';
    };

    const persist = (): void => {
      t.cur = { pos, i, pts: results, wrong, helped, firstAll, open, help: helpUsed };
      teamStore.save(t);
    };

    const syncBar = (): void => {
      q('[data-who]').textContent = answerer(t);
      q('[data-hints]').innerHTML = `${hintDots(t.hints)}<span class="num">${t.hints}/${HINTS}</span>`;
      q('[data-step]').textContent = `Soal ${i + 1} dari ${n}`;
      const ph = q<HTMLElement>('[data-phase]');
      ph.dataset.p = phase;
      // soal tersembunyi sampai hitung mundur selesai (waktu baru berjalan saat itu)
      node.dataset.ph = phase;
      ph.innerHTML =
        phase === 'mandiri'
          ? `${icon('user')}Fase Mandiri · tim menunggu di belakang`
          : phase === 'diskusi'
            ? `${icon('users')}Fase Diskusi · tim boleh ke meja`
            : phase === 'kedua'
              ? `${icon('rotate-ccw')}Kesempatan kedua · boleh diskusi`
              : '';
      const help = q<HTMLButtonElement>('[data-help]');
      help.hidden = phase !== 'mandiri';
      help.disabled = helpUsed >= HELP_PER_POS;
      q('[data-help-t]').textContent =
        helpUsed >= HELP_PER_POS
          ? 'Panggil tim: sudah dipakai di pos ini'
          : `Panggil tim lebih awal (${HELP_PER_POS - helpUsed}× di pos ini)`;
      q<HTMLButtonElement>('[data-hint]').disabled =
        t.hints <= 0 || usedHint || !(phase === 'mandiri' || phase === 'diskusi');
    };

    const load = (attempt: number): void => {
      it = gameItem(t.seed, pos, i, attempt);
      paperB.innerHTML = it.paper;
      renderMath(paperB);
      struck = new Set();
      hintBox.hidden = true;
      renderOptions(opts, it, struck);
    };

    /** layar serah giliran: soal tersembunyi; boleh kembali ke peta tanpa kehilangan apa pun */
    const handover = (): void => {
      phase = 'siap';
      usedHint = false;
      load(0);
      syncBar();
      const who = answerer(t);
      veil.hidden = false;
      veil.innerHTML = `<div class="eks-veil-c">
        <p class="eyebrow">${POS[pos].name} · soal ${i + 1} dari ${n}</p>
        <p class="eks-veil-k">Giliran menjawab</p>
        <p class="eks-veil-who">${esc(who)}</p>
        <p class="eks-veil-t">${esc(who)} duduk di meja depan. Anggota lain menunggu di belakang sampai fase Diskusi.</p>
        <div class="tes-actions">${pos === 0 ? '' : `<button type="button" class="btn" data-tomap>${icon('map')}<span>Kembali ke peta</span></button>`}
          <button type="button" class="btn btn--primary btn--lg" data-ready>${icon('play')}<span>${esc(who)} siap</span></button></div>
      </div>`;
      say(
        i === 0
          ? 'Latihan: layar ini muncul sebelum setiap soal. Soal masih tersembunyi; tekan tombol siap saat penjawab sudah duduk.'
          : 'Giliran berpindah ke anggota berikutnya. Di permainan sungguhan, penjawab baru maju ke meja depan.',
      );
      play(
        veil.firstElementChild as HTMLElement,
        [
          { opacity: 0, transform: 'scale(.96)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.base, easing: EASE_OUT, ui: true },
      );
    };

    const begin = async (): Promise<void> => {
      open = true;
      persist();
      veil.hidden = true;
      phase = 'hitung';
      syncBar();
      say('Hitung mundur 5 detik, lalu soal tampil dan waktu berjalan.');
      await countdown(node);
      if (!node.isConnected) return;
      phase = 'mandiri';
      t0 = Date.now();
      syncBar();
      say(
        i === 0
          ? `Fase Mandiri: hanya penjawab yang berpikir (di latihan ${TM / 1000} detik). Coba tekan <b>Panggil tim lebih awal</b>, atau tunggu sampai fase Diskusi mulai sendiri.`
          : 'Coba pilih jawaban yang <b>salah</b> untuk melihat cara kerja jebakan dan kesempatan kedua.',
      );
    };

    const toDiskusi = (early: boolean): void => {
      if (phase !== 'mandiri') return;
      if (early) {
        if (helpUsed >= HELP_PER_POS) return;
        helpUsed++;
      }
      phase = 'diskusi';
      persist();
      SND.chime();
      syncBar();
      toast('Fase Diskusi: panggil tim ke meja. Penjawab tetap yang menekan jawaban.');
      say('Fase Diskusi: warna layar berubah, tim boleh membantu. Jawaban benar sekarang bernilai 6 poin.');
    };

    const feedback = (html_: string, next: () => void, label = 'Lanjut'): void => {
      veil.hidden = false;
      veil.innerHTML = `<div class="eks-veil-c eks-fb">${html_}<button type="button" class="btn btn--primary btn--lg" data-cont>${icon('arrow-right')}<span>${label}</span></button></div>`;
      renderMath(veil);
      veil.querySelector('[data-cont]')!.addEventListener('click', next, { once: true });
    };

    const finishSoal = (pts: number): void => {
      results.push(pts);
      nextTurn(t);
      i++;
      open = false;
      persist();
      if (i < n) handover();
      else finishPos();
    };

    const finishPos = (): void => {
      t.cur = null;
      teamStore.save(t);
      say('');
      if (pos === 0) {
        const score = results.reduce((s, x) => s + x, 0);
        feedback(
          `<p class="eks-fb-k">Latihan selesai · ${score} poin</p>
          <ul class="eks-recap">
            <li>${icon('user')}<span><b>Mandiri</b> 10 poin · <b>Diskusi</b> 6 poin · <b>Kesempatan kedua</b> 3 poin.</span></li>
            <li>${icon('users')}<span><b>Panggil tim lebih awal</b> hanya sekali per pos; Diskusi tetap mulai sendiri setelah waktu Mandiri habis.</span></li>
            <li>${icon('lightbulb')}<span><b>Petunjuk</b> 3 untuk seluruh permainan: ingatkan rumus atau buang dua pilihan.</span></li>
            <li>${icon('route')}<span>Pos dikerjakan berurutan. Pos selesai memberi <b>kode bukti</b> 5 huruf; juru lapor membawanya ke Game Master.</span></li>
          </ul>`,
          () => {
            teamStore.clear();
            roleView();
          },
          'Selesai latihan',
        );
        return;
      }
      const score = results.reduce((s, x) => s + x, 0) + (firstAll ? PTS.bonus : 0);
      const reporter = takeReporter(t);
      const r: PosResult = {
        score,
        wrong,
        helped,
        code: proofCode(t.game, t.team, { pos, score, wrong, helped }),
        reporter,
      };
      t.results[pos] = r;
      teamStore.save(t);
      SND.correct();
      reportView(t, pos, r, true, firstAll);
    };

    const answer = (k: number): void => {
      if (phase !== 'mandiri' && phase !== 'diskusi' && phase !== 'kedua') return;
      const ok = k === it.ok;
      opts.querySelectorAll<HTMLElement>('.tes-opt').forEach((b, j) => {
        b.setAttribute('aria-checked', String(j === k));
        b.classList.toggle('is-key', j === it.ok && (ok || phase === 'kedua'));
        b.classList.toggle('is-bad', j === k && !ok);
      });
      const was = phase;
      phase = 'hasil';
      syncBar();
      say('');
      if (was === 'kedua') {
        if (ok) {
          SND.correct();
          feedback(
            `<p class="eks-fb-k is-ok">${icon('circle-check')}Benar di kesempatan kedua</p><p class="eks-fb-big num">+${PTS.kedua}</p>`,
            () => finishSoal(PTS.kedua),
          );
        } else {
          SND.wrong();
          feedback(
            `<p class="eks-fb-k is-no">${icon('circle-x')}Belum tepat</p><p class="eks-fb-t">${mathHtml(it.traps[k] ?? '')}</p><p class="eks-fb-ex"><b>Kunci:</b> ${mathHtml(it.options[it.ok]!)}. ${mathHtml(it.explain)}</p>`,
            () => finishSoal(0),
          );
        }
        return;
      }
      if (ok) {
        const pts = was === 'mandiri' && !usedHint ? PTS.mandiri : PTS.diskusi;
        if (pts !== PTS.mandiri) helped++;
        SND.correct();
        feedback(
          `<p class="eks-fb-k is-ok">${icon('circle-check')}Benar${was === 'mandiri' && !usedHint ? ', mandiri' : ''}</p><p class="eks-fb-big num">+${pts}</p>${demo && i === 1 ? '<p class="eks-note">Di permainan sungguhan, jawaban salah memunculkan nama jebakan lalu soal kembaran.</p>' : ''}`,
          () => finishSoal(pts),
        );
        return;
      }
      // salah: tunjukkan jebakan, lalu soal kembaran
      wrong++;
      firstAll = false;
      if (was === 'diskusi' || usedHint) helped++;
      const trap = it.traps[k] ?? '';
      t.traps.push(trap);
      persist();
      SND.wrong();
      feedback(
        `<p class="eks-fb-k is-no">${icon('circle-x')}Kena jebakan</p><p class="eks-fb-t">${mathHtml(trap)}</p><p class="eks-fb-ex">Kesempatan kedua: soal kembaran dengan angka lain, ${TK / 1000} detik, boleh berdiskusi.</p>`,
        () => {
          veil.hidden = true;
          load(1);
          phase = 'kedua';
          t0 = Date.now();
          syncBar();
          say('Kesempatan kedua: soal kembaran dengan angka lain. Tim boleh berdiskusi; benar = 3 poin.');
        },
        'Kesempatan kedua',
      );
    };

    const timeUp = (): void => {
      const was = phase;
      phase = 'hasil';
      firstAll = false;
      if (was !== 'kedua') {
        wrong++;
        if (was === 'diskusi' || usedHint) helped++;
      }
      opts
        .querySelectorAll<HTMLElement>('.tes-opt')
        .forEach((b, j) => b.classList.toggle('is-key', j === it.ok));
      SND.wrong();
      syncBar();
      say('');
      feedback(
        `<p class="eks-fb-k is-no">${icon('hourglass')}Waktu soal habis</p><p class="eks-fb-ex"><b>Kunci:</b> ${mathHtml(it.options[it.ok]!)}. ${mathHtml(it.explain)}</p><p class="eks-note">Ingat di TKA: soal yang terlalu lama dilewati dulu, lalu kembali di putaran kedua.</p>`,
        () => finishSoal(0),
      );
    };

    every(200, () => {
      const clock = q<HTMLElement>('[data-clock]');
      let left = Infinity;
      if (phase === 'mandiri' || phase === 'diskusi') {
        const el_ = Date.now() - t0;
        if (phase === 'mandiri' && el_ >= TM) toDiskusi(false);
        left = TS - el_;
        clock.textContent = phase === 'mandiri' ? mmss(TM - el_) : mmss(left);
        if (left <= 0) timeUp();
      } else if (phase === 'kedua') {
        left = TK - (Date.now() - t0);
        clock.textContent = mmss(left);
        if (left <= 0) timeUp();
      } else clock.textContent = '';
      // sisa waktu sedikit: jam bergetar merah, layar memerah samar
      node.classList.toggle('is-low', left <= LOW_SOAL && left > 0);
    });

    const useHint = (kind: 'rumus' | 'buang'): void => {
      if (t.hints <= 0 || usedHint) return;
      t.hints--;
      usedHint = true;
      teamStore.save(t);
      if (kind === 'rumus') {
        hintBox.hidden = false;
        hintBox.innerHTML = `<p class="tes-k">${icon('lightbulb')}Petunjuk</p><p>${mathHtml(it.hint)}</p>`;
        renderMath(hintBox);
      } else {
        const wrongs = it.options.map((_, j) => j).filter((j) => j !== it.ok);
        for (let s = wrongs.length - 1; s > 0; s--) {
          const j = Math.floor(Math.random() * (s + 1));
          [wrongs[s], wrongs[j]] = [wrongs[j]!, wrongs[s]!];
        }
        struck = new Set(wrongs.slice(0, 2));
        renderOptions(opts, it, struck);
      }
      syncBar();
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      if (tg.closest('[data-ready]')) return void begin();
      if (tg.closest('[data-tomap]')) {
        // soal belum dibuka: tidak ada yang hilang
        open = false;
        persist();
        return mapView();
      }
      const o = tg.closest<HTMLElement>('[data-opt]');
      if (o) return answer(Number(o.dataset.opt));
      if (tg.closest('[data-help]')) return toDiskusi(true);
      if (tg.closest('[data-hint]'))
        openSheet({
          title: 'Pakai petunjuk?',
          body: `<p>Petunjuk tersedia: <b>${t.hints} dari ${HINTS}</b> untuk seluruh permainan. Petunjuk berlaku untuk soal ini saja; soal yang memakai petunjuk paling banyak <b>${PTS.diskusi} poin</b>.</p>`,
          actions: [
            { label: 'Ingatkan rumus', kind: 'primary', icon: 'lightbulb', onClick: () => useHint('rumus') },
            { label: 'Buang dua pilihan', icon: 'x', onClick: () => useHint('buang') },
          ],
          closeLabel: 'Batal',
        });
    });

    show(node);
    if (prev?.open) {
      // soal yang sudah dibuka lalu ditinggal: hangus, supaya tidak bisa diulang dengan jawaban yang sudah diketahui
      results.push(0);
      firstAll = false;
      wrong++;
      nextTurn(t);
      i++;
      open = false;
      persist();
      toast('Soal yang ditinggalkan di tengah jalan dihitung hangus.');
    } else persist();
    if (i < n) handover();
    else finishPos();
  }

  // ===========================================================================================
  // Kelompok: Pacu Waktu (6 soal, 5 menit, urutan bebas, jangan dikosongkan)
  // ===========================================================================================
  function pacuView(t: TeamState): void {
    const n = POS[6].n;
    const items = Array.from({ length: n }, (_, k) => gameItem(t.seed, 6, k));
    const prev = t.cur && t.cur.pos === 6 && t.cur.st ? t.cur : null;
    const state: Array<'belum' | 'benar' | 'salah'> = prev
      ? [...prev.st!]
      : Array.from({ length: n }, () => 'belum');
    const who: string[] = Array.from({ length: n }, () => '');
    let tEnd = prev?.end ?? 0;
    let cur = -1;
    let done = false;
    const persist = (): void => {
      t.cur = {
        pos: 6,
        i: 0,
        pts: [],
        wrong: 0,
        helped: 0,
        firstAll: true,
        open: tEnd > 0,
        end: tEnd || undefined,
        st: state,
      };
      teamStore.save(t);
    };
    const node = html(`<div class="eks-play" data-ph="pacu">
      <div class="eks-bar">
        <span class="eks-who">${icon('armchair')}<span data-next></span></span>
        <span class="eks-phase" data-p="pacu">${icon('timer')}Pacu Waktu · semua boleh berdiskusi, penjawab bergilir menekan</span>
        <span class="eks-bar-sp"></span>
        <span class="eks-clock eks-clock--big num" data-clock>${mmss(T_PACU)}</span>
      </div>
      <p class="eks-alarm" data-alarm hidden>${icon('circle-alert')}<b>Jangan dikosongkan!</b> Di TKA soal kosong pasti 0. Pilih jawaban terbaik untuk soal yang tersisa.</p>
      <div class="eks-pacu" data-grid></div>
      <section class="tes-stage eks-stage" data-stage hidden>
        <article class="soal tes-paper eks-paper"><header class="soal-h"><span data-head></span><span data-who></span></header><div class="soal-b" data-paper></div></article>
        <div class="tes-ans"><p class="tes-k">Pilih satu jawaban</p><div class="tes-opts" data-opts></div>
          <div class="tes-ans-f"><button type="button" class="btn" data-skip>${icon('arrow-right')}<span>Lewati dulu</span></button></div></div>
      </section>
      <div class="eks-veil" data-veil hidden></div>
    </div>`);
    const q = <T extends HTMLElement>(s: string): T => node.querySelector<T>(s)!;
    const grid = q<HTMLElement>('[data-grid]');
    const stage = q<HTMLElement>('[data-stage]');
    const veil = q<HTMLElement>('[data-veil]');

    const renderGrid = (): void => {
      q('[data-next]').textContent = answerer(t);
      grid.hidden = false;
      stage.hidden = true;
      const kind = (tpl: string): string =>
        tpl.startsWith('l')
          ? 'Lingkaran'
          : tpl.startsWith('g')
            ? 'Gelombang'
            : tpl.startsWith('t')
              ? 'Transformasi'
              : 'Jebakan';
      grid.innerHTML = items
        .map(
          (it, k) =>
            `<button type="button" class="eks-tile is-${state[k]}" data-k="${k}" ${state[k] !== 'belum' ? 'disabled' : ''}>
              <span class="eks-num num">${k + 1}</span><span class="eks-tile-t">${kind(it.tpl)}</span>
              <span class="eks-tile-s">${state[k] === 'belum' ? 'Belum' : state[k] === 'benar' ? `${icon('circle-check')}Benar` : `${icon('circle-x')}Salah`}${who[k] ? ` · ${esc(who[k]!)}` : ''}</span></button>`,
        )
        .join('');
    };

    const openSoal = (k: number): void => {
      cur = k;
      const it = items[k]!;
      who[k] = answerer(t);
      q('[data-next]').textContent = who[k]!;
      grid.hidden = true;
      stage.hidden = false;
      q('[data-head]').textContent = `Pacu Waktu · soal ${k + 1}`;
      q('[data-who]').textContent = `Penjawab: ${who[k]}`;
      const pb = q<HTMLElement>('[data-paper]');
      pb.innerHTML = it.paper;
      renderMath(pb);
      renderOptions(q('[data-opts]'), it, new Set());
    };

    const finish = (): void => {
      if (done) return;
      done = true;
      const ok = state.filter((s) => s === 'benar').length;
      const wrong = Math.min(3, state.filter((s) => s !== 'benar').length);
      const score = ok * PTS.pacu + (ok === n ? PTS.bonus : 0);
      const reporter = takeReporter(t);
      const r: PosResult = {
        score,
        wrong,
        helped: 0,
        code: proofCode(t.game, t.team, { pos: 6, score, wrong, helped: 0 }),
        reporter,
      };
      t.cur = null;
      t.results[6] = r;
      teamStore.save(t);
      reportView(t, 6, r, true, ok === n);
    };

    const intro = (): void => {
      veil.hidden = false;
      veil.innerHTML = `<div class="eks-veil-c">
        <p class="eyebrow">Pos 06 · Pacu Waktu</p>
        <p class="eks-veil-who">5 menit, 6 soal</p>
        <ul class="eks-recap">
          <li>${icon('users')}<span>Semua anggota boleh ke meja dan berdiskusi. Penjawab bergilir menekan jawaban.</span></li>
          <li>${icon('arrow-right')}<span>Urutan bebas. Soal yang sulit: <b>Lewati dulu</b>, kembali nanti.</span></li>
          <li>${icon('circle-alert')}<span>Jangan ada yang kosong: di TKA soal kosong pasti 0.</span></li>
        </ul>
        <div class="tes-actions"><button type="button" class="btn" data-tomap>${icon('map')}<span>Kembali ke peta</span></button>
          <button type="button" class="btn btn--primary btn--lg" data-go>${icon('play')}<span>Kami siap</span></button></div>
      </div>`;
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      if (tg.closest('[data-tomap]')) return mapView();
      if (tg.closest('[data-go]')) {
        veil.hidden = true;
        void countdown(node).then(() => {
          if (!node.isConnected) return;
          tEnd = Date.now() + T_PACU;
          persist();
          renderGrid();
        });
        return;
      }
      const tile = tg.closest<HTMLElement>('[data-k]');
      if (tile && !done && tEnd) return openSoal(Number(tile.dataset.k));
      if (tg.closest('[data-skip]')) {
        // giliran tetap maju: penjawab berikutnya memegang soal lain
        nextTurn(t);
        persist();
        who[cur] = '';
        return renderGrid();
      }
      const o = tg.closest<HTMLElement>('[data-opt]');
      if (o && cur >= 0 && !done) {
        const it = items[cur]!;
        const ok = Number(o.dataset.opt) === it.ok;
        state[cur] = ok ? 'benar' : 'salah';
        if (!ok) t.traps.push(it.traps[Number(o.dataset.opt)] ?? '');
        nextTurn(t);
        persist();
        if (ok) SND.correct();
        else SND.wrong();
        toast(ok ? 'Benar.' : 'Belum tepat. Lanjut ke soal lain.');
        if (state.every((s) => s !== 'belum')) return finish();
        renderGrid();
      }
    });

    every(200, () => {
      if (!tEnd) return;
      const left = tEnd - Date.now();
      q('[data-clock]').textContent = mmss(left);
      node.classList.toggle('is-low', left <= LOW_PACU && left > 0);
      q<HTMLElement>('[data-alarm]').hidden = left > LOW_PACU || done;
      if (left <= 0) finish();
    });
    show(node);
    if (tEnd) renderGrid();
    else {
      grid.hidden = true;
      intro();
    }
  }

  // ===========================================================================================
  // Kelompok: kode bukti, selesai, riwayat
  // ===========================================================================================
  function reportView(t: TeamState, pos: PosId, r: PosResult, fresh: boolean, perfect = false): void {
    const node = html(`<div class="eks-center"><section class="eks-card eks-report" aria-labelledby="r-t">
      ${emblemHtml(t.team, t.photo, 'eks-emb--lg')}
      <p class="eyebrow">${POS[pos].name}${fresh ? ' selesai' : ''}</p>
      <h2 class="eks-h2" id="r-t">${r.score} poin${perfect ? ` · <span class="eks-bonus">bonus +${PTS.bonus} semua benar</span>` : ''}</h2>
      <p class="eks-note">Kode bukti</p>
      <p class="eks-code num" aria-label="Kode bukti ${r.code.split('').join(' ')}">${r.code}</p>
      <p class="eks-rep">${icon('footprints')}<span><b>${esc(r.reporter)}</b>, bawa kode ini ke Game Master dan ketik di laptop guru.</span></p>
      <div class="tes-actions"><button type="button" class="btn btn--primary btn--lg" data-map>${icon('map')}<span>Kembali ke peta</span></button></div>
    </section></div>`);
    node.querySelector('[data-map]')!.addEventListener('click', mapView);
    show(node);
    if (fresh)
      play(
        node.querySelector('.eks-code')!,
        [
          { opacity: 0, transform: 'scale(.8)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, easing: EASE_OUT, ui: true },
      );
  }

  function finishView(t: TeamState): void {
    if (!t.finished) {
      t.finished = true;
      t.cur = null;
      teamStore.save(t);
    }
    const active = posList(posMaskOf(t.game));
    const count = new Map<string, number>();
    for (const tr of t.traps) count.set(tr, (count.get(tr) ?? 0) + 1);
    const top = [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    history.addTeam({
      id: `${t.game}-${t.team}`,
      at: Date.now(),
      team: t.team,
      members: t.members,
      photo: t.photo,
      score: total(t),
      pos: active.filter((p) => t.results[p]).map((p) => ({ pos: p, score: t.results[p]!.score })),
      traps: top.map(([tr]) => tr),
    });
    const node = html(`<div class="eks-scroll eks-finish-bg"><div class="eks-col">
      <section class="eks-finish" aria-labelledby="f-t">
        ${emblemHtml(t.team, t.photo, 'eks-emb--xl')}
        <p class="eyebrow">Ekspedisi selesai</p>
        <h1 class="eks-finish-t" id="f-t">${esc(teamName(t.team))}</h1>
        <p class="eks-finish-s num">${total(t)} poin</p>
        <p class="eks-note">${active.filter((p) => t.results[p]).length} dari ${active.length} pos selesai · ${t.members.map(esc).join(', ')}</p>
      </section>
      <section class="eks-card eks-card--wide">
        <h2 class="eks-h2">${icon('circle-alert')}Jebakan yang perlu kalian ingat untuk hari Senin</h2>
        ${
          top.length
            ? `<ol class="eks-traps">${top.map(([tr]) => `<li>${mathHtml(tr)}</li>`).join('')}</ol>`
            : '<p>Tidak ada jebakan yang mengenai kelompok kalian. Pertahankan ketelitian ini hari Senin.</p>'
        }
        <p class="eks-note">Kode bukti pos kalian (bawa ke Game Master bila belum dilaporkan): ${
          active
            .filter((p) => t.results[p])
            .map((p) => `<b class="num">${t.results[p]!.code}</b> (${POS[p].name})`)
            .join(', ') || '—'
        }</p>
      </section>
      <div class="tes-actions"><button type="button" class="btn" data-hist>${icon('history')}<span>Riwayat ekspedisi</span></button>
        <button type="button" class="btn btn--primary btn--lg" data-home>${icon('log-out')}<span>Tutup ekspedisi</span></button></div>
    </div></div>`);
    node.querySelector('[data-hist]')!.addEventListener('click', historyView);
    node.querySelector('[data-home]')!.addEventListener('click', () => {
      teamStore.clear();
      roleView();
    });
    show(node);
    SND.fanfare();
    cleanups.push(confetti(node));
  }

  function historyView(): void {
    const list = history.team();
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <h1 class="eks-h1">${icon('history')}Riwayat ekspedisi di tablet ini</h1>
      ${
        list.length
          ? `<ul class="eks-hist">${list
              .map(
                (h) => `<li>${emblemHtml(h.team, h.photo, 'eks-emb--lg')}
                <div><b>${esc(teamName(h.team))}</b><span>${fmtDate(h.at)} · ${h.pos.length} pos · ${h.members.map(esc).join(', ')}</span></div>
                <span class="eks-hist-s num">${h.score}</span>
                <button type="button" class="icon-btn" data-del="${esc(h.id)}" aria-label="Hapus riwayat ini">${icon('trash-2')}</button></li>`,
              )
              .join('')}</ul>`
          : '<p class="eks-note">Belum ada riwayat.</p>'
      }
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        ${list.length ? `<button type="button" class="btn btn--danger" data-clear>${icon('trash-2')}<span>Hapus semua riwayat</span></button>` : ''}</div>
    </div></div>`);
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const d = tg.closest<HTMLElement>('[data-del]');
      if (d) {
        history.removeTeam(d.dataset.del!);
        return historyView();
      }
      if (tg.closest('[data-back]')) return roleView();
      if (tg.closest('[data-clear]'))
        openSheet({
          title: 'Hapus semua riwayat?',
          body: '<p>Riwayat dan foto kelompok di tablet ini dihapus.</p>',
          actions: [
            {
              label: 'Hapus semua',
              kind: 'danger',
              icon: 'trash-2',
              onClick: () => {
                history.clearTeam();
                setTimeout(historyView, 0);
              },
            },
          ],
          closeLabel: 'Batal',
        });
    });
    show(node);
  }

  // ===========================================================================================
  // Game Master
  // ===========================================================================================
  function gmLockView(): void {
    const node = html(`<div class="eks-center"><section class="eks-card" aria-labelledby="g-t">
      <h2 class="eks-h2" id="g-t">${icon('key-round')}Game Master</h2>
      <p class="eks-note">Masukkan kata sandi guru untuk membuat dan memandu permainan.</p>
      <label class="tes-field"><span class="tes-lbl">Kata sandi</span>
        <input class="tes-input" type="password" data-pw maxlength="40" autocomplete="off" spellcheck="false" placeholder="Ketik kata sandi"></label>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        <button type="button" class="btn btn--primary" data-go>${icon('key-round')}<span>Masuk</span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-pw]')!;
    const submit = async (): Promise<void> => {
      if (await checkGmPassword(input.value)) {
        gmStore.unlock();
        gmEntry();
      } else {
        node.querySelector('[data-err]')!.textContent = 'Kata sandi salah.';
        SND.wrong();
      }
    };
    node.querySelector('[data-go]')!.addEventListener('click', () => void submit());
    node.querySelector('[data-back]')!.addEventListener('click', roleView);
    show(node);
    // Game Master memakai papan ketik laptop: Enter untuk masuk
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') void submit();
    });
    input.focus();
  }

  function gmEntry(): void {
    const g = gmStore.load();
    if (g && !g.revealed) gmBoard();
    else gmSetup();
  }

  function gmSetup(): void {
    let minutes = 60;
    let teams = 5;
    let mask = 0x7f;
    const est = (): number => posList(mask).reduce((s, p) => s + (p === 6 ? 6 : 7), 0) + 3;
    const ghist = history.gm();
    const node = html(`<div class="eks-scroll eks-gm-bg"><div class="eks-col">
      <header class="eks-gm-h"><p class="eyebrow">Ekspedisi TKA · Game Master</p><h1 class="eks-h1">${icon('key-round')}Siapkan permainan</h1></header>
      <div class="eks-setup">
        <section class="eks-frame" aria-labelledby="s-w">
          <h2 class="eks-frame-h" id="s-w">${icon('timer')}Waktu permainan</h2>
          <div class="eks-stepper"><button type="button" class="icon-btn" data-min="-5" aria-label="Kurangi 5 menit">${icon('minus')}</button><b class="num" data-mins></b><button type="button" class="icon-btn" data-min="5" aria-label="Tambah 5 menit">${icon('plus')}</button></div>
          <div class="seg" role="radiogroup" aria-label="Pilihan cepat">${[5, 10, 30, 45, 60].map((m) => `<button type="button" role="radio" data-quick="${m}">${m} menit</button>`).join('')}</div>
          <p class="eks-note">Bisa ditambah, dikurangi, atau dijeda saat bermain.</p>
        </section>
        <section class="eks-frame" aria-labelledby="s-k">
          <h2 class="eks-frame-h" id="s-k">${icon('users')}Jumlah kelompok</h2>
          <div class="seg" role="radiogroup" aria-labelledby="s-k">${[2, 3, 4, 5, 6].map((k) => `<button type="button" role="radio" data-teams="${k}">${k}</button>`).join('')}</div>
          <div class="eks-emb-row" data-embs></div>
        </section>
        <section class="eks-frame eks-frame--wide" aria-labelledby="s-p">
          <h2 class="eks-frame-h" id="s-p">${icon('route')}Pos yang dimainkan <span class="eks-frame-sub">berurutan sesuai nomor</span></h2>
          <div class="eks-poslist">${POS_IDS.map(
            (p) =>
              `<button type="button" class="eks-posopt" role="switch" data-mpos="${p}"><span class="eks-pin-dot num">${pad2(p)}</span><span class="eks-posopt-t"><b>${POS[p].name}</b><small>${POS[p].goal} · ${POS[p].n} soal</small></span><span class="sw" aria-hidden="true"></span></button>`,
          ).join('')}</div>
          <p class="eks-est" data-est></p>
        </section>
      </div>
      <div class="tes-actions"><button type="button" class="btn" data-lock>${icon('lock')}<span>Kunci Game Master</span></button>
        <button type="button" class="btn btn--primary btn--lg" data-make>${icon('map')}<span>Buat permainan</span></button></div>
      ${
        ghist.length
          ? `<section class="eks-frame eks-frame--wide" aria-labelledby="s-h"><h2 class="eks-frame-h" id="s-h">${icon('history')}Riwayat permainan</h2>
          <ul class="eks-hist">${ghist
            .map(
              (h) => `<li><span class="eks-hist-d">${fmtDate(h.at)} · ${h.minutes} menit</span>
              <div class="eks-hist-r">${h.rank
                .slice(0, 3)
                .map(
                  (r, k) =>
                    `<span>${k + 1}. ${emblemHtml(r.no)}${esc(r.name)} <b class="num">${r.score}</b></span>`,
                )
                .join('')}</div>
              <button type="button" class="icon-btn" data-gdel="${esc(h.id)}" aria-label="Hapus riwayat ini">${icon('trash-2')}</button></li>`,
            )
            .join('')}</ul>
          <div class="tes-actions"><button type="button" class="btn btn--danger" data-gclear>${icon('trash-2')}<span>Hapus semua riwayat</span></button></div></section>`
          : ''
      }
    </div></div>`);
    const sync = (): void => {
      node.querySelector('[data-mins]')!.textContent = `${minutes} menit`;
      node
        .querySelectorAll<HTMLElement>('[data-quick]')
        .forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.quick) === minutes)));
      node
        .querySelectorAll<HTMLElement>('[data-teams]')
        .forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.teams) === teams)));
      node
        .querySelectorAll<HTMLElement>('[data-mpos]')
        .forEach((b) =>
          b.setAttribute('aria-checked', String(!!(mask & (1 << (Number(b.dataset.mpos) - 1))))),
        );
      node.querySelector('[data-embs]')!.innerHTML = Array.from(
        { length: teams },
        (_, k) => `<span class="eks-emb-i">${emblemHtml(k + 1)}<small>${esc(teamName(k + 1))}</small></span>`,
      ).join('');
      const e = est();
      const estEl = node.querySelector<HTMLElement>('[data-est]')!;
      estEl.classList.toggle('is-warn', e > minutes);
      estEl.innerHTML = `${icon('hourglass')}<span>Perkiraan waktu ${posList(mask).length} pos: <b>±${e} menit</b>${e > minutes ? ' — lebih lama dari waktu permainan; kelompok mungkin tidak menyelesaikan semua pos.' : '.'}</span>`;
    };
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const mn = tg.closest<HTMLElement>('[data-min]');
      if (mn) minutes = Math.min(120, Math.max(5, minutes + Number(mn.dataset.min)));
      const qk = tg.closest<HTMLElement>('[data-quick]');
      if (qk) minutes = Number(qk.dataset.quick);
      const tm = tg.closest<HTMLElement>('[data-teams]');
      if (tm) teams = Number(tm.dataset.teams);
      const mp = tg.closest<HTMLElement>('[data-mpos]');
      if (mp) {
        const bit = 1 << (Number(mp.dataset.mpos) - 1);
        if (mask & bit && posList(mask).length === 1) toast('Paling sedikit satu pos.');
        else mask ^= bit;
      }
      const gd = tg.closest<HTMLElement>('[data-gdel]');
      if (gd) {
        history.removeGm(gd.dataset.gdel!);
        return gmSetup();
      }
      if (tg.closest('[data-gclear]')) {
        openSheet({
          title: 'Hapus semua riwayat permainan?',
          body: '<p>Riwayat peringkat di laptop ini dihapus.</p>',
          actions: [
            {
              label: 'Hapus semua',
              kind: 'danger',
              onClick: () => {
                history.clearGm();
                setTimeout(gmSetup, 0);
              },
            },
          ],
          closeLabel: 'Batal',
        });
        return;
      }
      if (tg.closest('[data-lock]')) {
        gmStore.lock();
        return roleView();
      }
      if (tg.closest('[data-make]')) {
        const rnd = new Uint32Array(1);
        crypto.getRandomValues(rnd);
        const g: GmState = {
          game: makeGameCode(mask, rnd[0]!),
          mask,
          teams: Array.from({ length: teams }, (_, k) => ({ no: k + 1, name: teamName(k + 1) })),
          duration: minutes * 60000,
          deadline: null,
          left: minutes * 60000,
          started: false,
          ended: false,
          revealed: false,
          reports: [],
        };
        gmStore.save(g);
        return gmBoard();
      }
      sync();
    });
    show(node);
    sync();
  }

  function gmBoard(): void {
    const g = gmStore.load();
    if (!g) return gmSetup();
    const active = posList(g.mask);
    let shown = 0;
    const node = html(`<div class="eks-board eks-gm-bg">
      <div class="eks-b-side">
        <section class="eks-frame eks-clockbox" aria-labelledby="b-c">
          <h2 class="eks-frame-h" id="b-c">${icon('timer')}Waktu permainan <span class="eks-frame-sub" data-gm-state></span></h2>
          <div class="eks-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="eks-ring-bg" cx="60" cy="60" r="54"/><circle class="eks-ring-fg" data-ring cx="60" cy="60" r="54" pathLength="100"/></svg>
            <p class="eks-b-clock num" data-clock></p></div>
          <div class="eks-b-ctl">
            <button type="button" class="btn" data-adj="-300000">−5</button>
            <button type="button" class="btn" data-adj="-60000">−1</button>
            <button type="button" class="btn btn--primary" data-run></button>
            <button type="button" class="btn" data-adj="60000">+1</button>
            <button type="button" class="btn" data-adj="300000">+5</button>
          </div>
        </section>
        <section class="eks-frame" aria-labelledby="b-s">
          <h2 class="eks-frame-h" id="b-s">${icon('flag-triangle-right')}Kode mulai</h2>
          <p class="eks-startcode num" data-startcode></p>
          <p class="eks-note" data-start-note></p>
        </section>
        <section class="eks-frame" aria-labelledby="b-e">
          <h2 class="eks-frame-h" id="b-e">${icon('footprints')}Kode bukti dari juru lapor</h2>
          <div class="eks-b-entry">
            <input class="tes-input eks-code-in num" data-proof maxlength="6" autocomplete="off" spellcheck="false" placeholder="5 huruf" aria-label="Kode bukti">
            <button type="button" class="btn btn--primary" data-record>${icon('check')}<span>Catat</span></button>
          </div>
          <p class="eks-b-msg" role="status" data-msg></p>
        </section>
        <div class="eks-b-more">
          <button type="button" class="btn" data-codes>${icon('users')}<span>Kode gabung</span></button>
          <button type="button" class="btn" data-end>${icon('flag')}<span>Akhiri</span></button>
        </div>
      </div>
      <section class="eks-frame eks-b-main" aria-labelledby="rk-t">
        <h2 class="eks-frame-h" id="rk-t">${icon('trophy')}Peringkat <span class="eks-frame-sub">${active.length} pos · ${g.teams.length} kelompok</span></h2>
        <ol class="eks-rank" data-rank></ol>
      </section>
      <div class="eks-codes" data-codesbox hidden></div>
    </div>`);
    const q = <T extends Element>(s: string): T => node.querySelector<T>(s)!;
    const input = q<HTMLInputElement>('[data-proof]');
    const rankEl = q<HTMLElement>('[data-rank]');
    const codesBox = q<HTMLElement>('[data-codesbox]');
    let endAt = g.ended ? Date.now() : 0;

    const save = (): void => gmStore.save(g);

    const renderRank = (): void => {
      const before = new Map<string, number>();
      rankEl
        .querySelectorAll<HTMLElement>('[data-team]')
        .forEach((li) => before.set(li.dataset.team!, li.getBoundingClientRect().top));
      rankEl.innerHTML = ranking(g)
        .map(
          (
            r,
            k,
          ) => `<li data-team="${r.no}" class="eks-row${k < 3 && r.score > 0 ? ` is-top${k + 1}` : ''}" style="--tc: var(--team-${r.no})">
            <span class="eks-rk num">${k + 1}</span>
            ${emblemHtml(r.no, undefined, 'eks-emb--lg')}
            <span class="eks-rk-n">${esc(r.name)}<span class="eks-prog" aria-label="${r.done.length} dari ${active.length} pos">${active
              .map(
                (p) =>
                  `<span class="eks-seg${r.done.includes(p) ? ' is-on' : ''}" title="${POS[p].name}"></span>`,
              )
              .join('')}</span><small>${r.done.length}/${active.length} pos</small></span>
            <span class="eks-rk-s num">${r.score}</span></li>`,
        )
        .join('');
      // FLIP: baris yang naik/turun bergeser halus
      rankEl.querySelectorAll<HTMLElement>('[data-team]').forEach((li) => {
        const b = before.get(li.dataset.team!);
        if (b === undefined) return;
        const d = b - li.getBoundingClientRect().top;
        if (d)
          play(li, [{ transform: `translateY(${d}px)` }, { transform: 'none' }], {
            duration: DUR.slow,
            easing: EASE_OUT,
            ui: true,
          });
      });
    };

    const renderClock = (): void => {
      const left = timeLeft(g);
      q('[data-clock]').textContent = mmss(left);
      node.classList.toggle('is-low', g.started && !g.ended && left <= 60_000);
      q('[data-clock]').classList.toggle('is-warn', g.started && left <= 5 * 60000);
      q('[data-ring]').setAttribute(
        'stroke-dashoffset',
        String(100 - Math.min(100, (left / Math.max(1, g.duration)) * 100)),
      );
      q('[data-gm-state]').textContent = !g.started
        ? 'belum dimulai'
        : g.ended
          ? 'waktu habis'
          : g.deadline === null
            ? 'dijeda'
            : 'berjalan';
      q('[data-startcode]').textContent = g.started ? startCode(g.game) : '• • •';
      q('[data-start-note]').textContent = g.started
        ? 'Kelompok mengetik kode ini di tablet untuk mulai.'
        : 'Tampil setelah Anda menekan Mulai. Kelompok tidak bisa mulai sebelum itu.';
      q('[data-run]').innerHTML = !g.started
        ? `${icon('play')}<span>Mulai</span>`
        : g.ended
          ? `${icon('trophy')}<span>Umumkan hasil</span>`
          : g.deadline === null
            ? `${icon('play')}<span>Lanjut</span>`
            : `${icon('pause')}<span>Jeda</span>`;
    };

    const msg = (text: string, ok: boolean): void => {
      const m = q<HTMLElement>('[data-msg]');
      m.textContent = text;
      m.className = `eks-b-msg ${ok ? 'is-ok' : 'is-no'}`;
    };

    const record = (): void => {
      const got = readProof(
        g.game,
        g.teams.map((t) => t.no),
        input.value,
      );
      if (!got) {
        SND.wrong();
        return msg('Kode tidak dikenali. Periksa lagi hurufnya.', false);
      }
      if (!active.includes(got.proof.pos)) return msg('Pos itu tidak dimainkan di permainan ini.', false);
      if (g.reports.some((r) => r.team === got.team && r.pos === got.proof.pos))
        return msg(`Kode pos ${POS[got.proof.pos].name} untuk Kelompok ${got.team} sudah dicatat.`, false);
      if (g.ended && endAt && Date.now() - endAt > 60_000) return msg('Waktu permainan sudah habis.', false);
      g.reports.push({ team: got.team, ...got.proof, at: Date.now() });
      save();
      input.value = '';
      SND.correct();
      msg(`${teamName(got.team)} · ${POS[got.proof.pos].name} · +${got.proof.score} poin`, true);
      renderRank();
      const li = rankEl.querySelector<HTMLElement>(`[data-team="${got.team}"]`);
      if (li)
        play(li, [{ transform: 'scale(1.03)' }, { transform: 'none' }], {
          duration: DUR.slow,
          easing: EASE_OUT,
          ui: true,
        });
    };

    /** kode gabung tersembunyi; dibuka satu per satu supaya perwakilan kelompok maju bergantian */
    const renderCodes = (): void => {
      codesBox.innerHTML = `<div class="eks-codes-c" role="dialog" aria-labelledby="cg-t">
        <h2 class="eks-frame-h" id="cg-t">${icon('users')}Kode gabung kelompok</h2>
        <p class="eks-note">Buka satu kode, perwakilan kelompok itu mengetiknya di tablet, lalu tutup dan lanjut ke kelompok berikutnya.</p>
        <ul class="eks-joins">${g.teams
          .map(
            (
              t,
            ) => `<li class="${shown === t.no ? 'is-open' : ''}" style="--tc: var(--team-${t.no})">${emblemHtml(t.no, undefined, 'eks-emb--lg')}<span>${esc(t.name)}</span>
              <b class="num">${shown === t.no ? joinCode(g.game, t.no) : '••••-••'}</b>
              <button type="button" class="btn${shown === t.no ? '' : ' btn--primary'}" data-show="${t.no}">${icon(shown === t.no ? 'eye-off' : 'eye')}<span>${shown === t.no ? 'Tutup' : 'Tampilkan'}</span></button></li>`,
          )
          .join('')}</ul>
        <div class="tes-actions"><button type="button" class="btn btn--primary" data-codes-x>${icon('check')}<span>Selesai</span></button></div>
      </div>`;
    };
    const openCodes = (): void => {
      shown = 0;
      renderCodes();
      codesBox.hidden = false;
    };

    const timeUpShow = (): void => {
      const ov = html(
        `<div class="eks-timeup" role="alert"><div class="eks-timeup-c"><p class="eks-timeup-t">Waktu habis!</p><p class="eks-timeup-s">Semua kelompok: tekan <b>Selesai ekspedisi</b> di tablet. Juru lapor masih boleh membawa kode bukti selama 1 menit.</p></div></div>`,
      );
      node.append(ov);
      play(
        ov.firstElementChild!,
        [
          { opacity: 0, transform: 'scale(.6)' },
          { opacity: 1, transform: 'scale(1.06)', offset: 0.6 },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, easing: EASE_OUT, ui: true },
      );
      ov.addEventListener('click', () => ov.remove());
      window.setTimeout(() => ov.remove(), 9000);
    };

    const reveal = (): void => {
      g.revealed = true;
      save();
      history.addGm({
        id: g.game,
        at: Date.now(),
        minutes: Math.round(g.duration / 60000),
        rank: ranking(g).map((r) => ({ no: r.no, name: r.name, score: r.score, done: r.done.length })),
      });
      gmReveal(g);
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const adj = tg.closest<HTMLElement>('[data-adj]');
      if (adj) {
        const d = Number(adj.dataset.adj);
        if (g.deadline !== null) g.deadline = Math.max(Date.now(), g.deadline + d);
        else g.left = Math.max(0, g.left + d);
        g.duration = Math.max(g.duration + d, 60_000);
        if (g.ended && timeLeft(g) > 0) g.ended = false;
        save();
        renderClock();
        return;
      }
      if (tg.closest('[data-run]')) {
        if (!g.started) {
          g.started = true;
          g.deadline = Date.now() + g.left;
          SND.chime();
        } else if (g.ended) return reveal();
        else if (g.deadline === null) g.deadline = Date.now() + g.left;
        else {
          g.left = timeLeft(g);
          g.deadline = null;
        }
        save();
        renderClock();
        return;
      }
      const sh = tg.closest<HTMLElement>('[data-show]');
      if (sh) {
        const no = Number(sh.dataset.show);
        shown = shown === no ? 0 : no;
        return renderCodes();
      }
      if (tg.closest('[data-codes-x]')) {
        shown = 0;
        codesBox.hidden = true;
        return;
      }
      if (tg.closest('[data-record]')) return record();
      if (tg.closest('[data-codes]')) return openCodes();
      if (tg.closest('[data-end]'))
        openSheet({
          title: 'Akhiri permainan sekarang?',
          body: '<p>Waktu langsung habis. Kode yang dibawa dalam 1 menit berikutnya masih bisa dicatat, lalu umumkan hasil.</p>',
          actions: [
            {
              label: 'Akhiri',
              kind: 'danger',
              onClick: () => {
                g.started = true;
                g.left = 0;
                g.deadline = Date.now();
                save();
              },
            },
          ],
          closeLabel: 'Batal',
        });
    });

    every(250, () => {
      if (g.started && !g.ended && g.deadline !== null && timeLeft(g) <= 0) {
        g.ended = true;
        endAt = Date.now();
        save();
        SND.fanfare();
        timeUpShow();
      }
      renderClock();
    });

    show(node);
    renderRank();
    renderClock();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') record();
    });
    if (!g.started) openCodes();
  }

  function gmReveal(g: GmState): void {
    const rk = ranking(g);
    const active = posList(g.mask);
    const hard = active
      .map((p) => {
        const rs = g.reports.filter((r) => r.pos === p);
        return { p, rate: rs.length ? rs.reduce((s, r) => s + r.wrong, 0) / rs.length : 0, n: rs.length };
      })
      .filter((x) => x.n > 0 && x.rate > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);
    const per = (no: number): { wrong: number; helped: number; n: number } => {
      const rs = g.reports.filter((r) => r.team === no);
      return {
        wrong: rs.reduce((s, r) => s + r.wrong, 0),
        helped: rs.reduce((s, r) => s + r.helped, 0),
        n: rs.length,
      };
    };
    const played = rk.filter((r) => r.done.length > 0);
    const best = (
      f: (x: { wrong: number; helped: number; n: number }) => number,
    ): (typeof rk)[number] | null =>
      played.length ? [...played].sort((a, b) => f(per(a.no)) - f(per(b.no)) || b.score - a.score)[0]! : null;
    const teliti = best((x) => x.wrong / Math.max(1, x.n));
    const mandiri = best((x) => x.helped / Math.max(1, x.n));
    const totalPts = rk.reduce((s, r) => s + r.score, 0);
    const podium = [rk[1], rk[0], rk[2]];
    const node = html(`<div class="eks-scroll eks-reveal-bg"><div class="eks-col">
      <header class="eks-reveal-h"><p class="eyebrow">Ekspedisi TKA · hasil akhir</p><h1 class="eks-reveal-t">${icon('trophy')}Juara ekspedisi</h1></header>
      <div class="eks-podium">${podium
        .map((r, k) => {
          if (!r) return '<div class="eks-pod eks-pod--empty"></div>';
          const place = k === 1 ? 1 : k === 0 ? 2 : 3;
          return `<div class="eks-pod eks-pod--${place}" style="--tc: var(--team-${r.no})" data-d="${place === 1 ? 2 : place === 2 ? 1 : 0}">
            ${place === 1 ? `<span class="eks-crown">${icon('crown')}</span>` : ''}
            ${emblemHtml(r.no, undefined, 'eks-emb--xl')}
            <b class="eks-pod-n">${esc(r.name)}</b>
            <span class="eks-pod-s num">${r.score}</span>
            <div class="eks-pod-b"><span class="num">${place}</span></div>
          </div>`;
        })
        .join('')}</div>
      <dl class="eks-tiles" aria-label="Statistik">
        <div class="eks-tile2"><dt>Poin seluruh kelas</dt><dd class="num">${totalPts}</dd></div>
        <div class="eks-tile2"><dt>Pos dilaporkan</dt><dd class="num">${g.reports.length}</dd></div>
        <div class="eks-tile2"><dt>Paling teliti</dt><dd>${teliti ? `${emblemHtml(teliti.no)}${esc(teliti.name)}` : '—'}</dd><small>salah paling sedikit per pos</small></div>
        <div class="eks-tile2"><dt>Paling mandiri</dt><dd>${mandiri ? `${emblemHtml(mandiri.no)}${esc(mandiri.name)}` : '—'}</dd><small>paling jarang dibantu per pos</small></div>
      </dl>
      ${
        rk.length > 3
          ? `<ol class="eks-final">${rk
              .slice(3)
              .map(
                (r, k) =>
                  `<li style="--tc: var(--team-${r.no})"><span class="eks-rk num">${k + 4}</span>${emblemHtml(r.no)}<span class="eks-rk-n">${esc(r.name)}</span><span class="eks-rk-s num">${r.score}</span></li>`,
              )
              .join('')}</ol>`
          : ''
      }
      ${
        hard.length
          ? `<section class="eks-frame eks-frame--wide"><h2 class="eks-frame-h">${icon('circle-alert')}Pos yang paling banyak menjebak kelas</h2><ul class="eks-hard">${hard
              .map((h) => `<li><b>${POS[h.p].name}</b> · ${POS[h.p].goal}</li>`)
              .join('')}</ul><p class="eks-note">Bahas pos ini bersama sebelum pulang.</p></section>`
          : ''
      }
      <div class="tes-actions"><button type="button" class="btn" data-board>${icon('arrow-left')}<span>Kembali ke papan</span></button>
        <button type="button" class="btn btn--primary" data-new>${icon('plus')}<span>Permainan baru</span></button></div>
    </div></div>`);
    node.querySelector('[data-board]')!.addEventListener('click', () => {
      g.revealed = false;
      gmStore.save(g);
      gmBoard();
    });
    node.querySelector('[data-new]')!.addEventListener('click', () =>
      openSheet({
        title: 'Buat permainan baru?',
        body: '<p>Papan permainan ini ditutup. Peringkatnya sudah tersimpan di riwayat permainan.</p>',
        actions: [
          {
            label: 'Permainan baru',
            kind: 'primary',
            onClick: () => {
              gmStore.clear();
              setTimeout(gmSetup, 0);
            },
          },
        ],
        closeLabel: 'Batal',
      }),
    );
    show(node);
    // podium naik bergantian: ketiga, kedua, lalu juara + konfeti
    node.querySelectorAll<HTMLElement>('.eks-pod[data-d]').forEach((pod) => {
      const d = Number(pod.dataset.d);
      play(
        pod,
        [
          { opacity: 0, transform: `translateY(${SLIDE_PX * 3}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, delay: d * 900, easing: EASE_OUT, fill: 'backwards', ui: true },
      );
    });
    window.setTimeout(
      () => {
        if (!node.isConnected) return;
        SND.fanfare();
        cleanups.push(confetti(node));
      },
      reducedMotion() ? 0 : 1900,
    );
  }

  // halaman pertama: kelompok yang sedang bermain langsung ke peta
  const saved = teamStore.load();
  if (saved && !saved.demo && !saved.finished) mapView();
  else roleView();
  return view;
}
