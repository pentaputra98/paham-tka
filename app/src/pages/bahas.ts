/**
 * Halaman pembahasan beranimasi (PRD §7.3, §8.3, §9): lobi → pahami soal → langkah → catatan →
 * analisis → SELESAI. Merakit Board + Scene + Player dan kontrol: Kembali/Lanjut, titik langkah,
 * putar otomatis, kecepatan, tandai belum paham, menu bagian, musik/suara, pintasan keyboard.
 */
import { SND } from '../core/audio';
import { esc, html, pad2 } from '../core/dom';
import { toggleFullscreen, enterFullscreenLandscape } from '../core/fullscreen';
import { icon } from '../core/icons';
import { renderMath } from '../core/math';
import { play } from '../core/motion';
import { store, type Path, type Speed } from '../core/store';
import { DUR, EASE_OUT, SLIDE_PX } from '../core/tokens';
import { getSoal, RELEASE_1 } from '../content';
import { loadContent } from '../content/soal/registry';
import { Board, mathText } from '../engine/board';
import { buildNotes } from '../engine/notes';
import { Player, type PlayStep } from '../engine/player';
import { Scene, type VisualFactory } from '../engine/scene';
import type { SoalContent, Step } from '../engine/types';
import type { Route } from '../router/router';
import { navigate, type PageView } from '../shell/app';
import { onOrientation } from '../shell/rotate';
import { closeSheet, isSheetOpen, openSheet } from '../shell/sheet';
import { toast } from '../shell/toast';
import { VISUALS } from '../visuals';

const KEYS: Array<[string, string]> = [
  ['← →', 'langkah sebelumnya / berikutnya'],
  ['Spasi', 'putar otomatis atau jeda'],
  ['R', 'ulangi langkah ini'],
  ['F', 'layar penuh'],
  ['M', 'musik latar'],
  ['Esc', 'tutup lembar'],
  ['?', 'daftar pintasan'],
];

const SPEEDS: Array<[Speed, string]> = [
  [0.75, '0,75×'],
  [1, '1×'],
  [1.5, '1,5×'],
];

function nextReady(no: number): number | null {
  const i = RELEASE_1.indexOf(no);
  return i >= 0 && i < RELEASE_1.length - 1 ? RELEASE_1[i + 1]! : null;
}

export function bahasPage(route: Route): PageView {
  const no = route.no!;
  const meta = getSoal(no)!;
  const el = html(`<div class="bahas"><div class="b-loading" role="status">Memuat pembahasan…</div></div>`);
  const cleanups: Array<() => void> = [];
  let player: Player | null = null;
  let scene: Scene | null = null;
  const t0 = performance.now();

  const header = {
    back: { label: 'Soal', href: `#/soal/${no}` },
    block: { k: 'BAGIAN', n: '00/00', t: 'Lobi' },
    extra: `<button type="button" class="icon-btn" data-act="menu" aria-label="Daftar bagian" title="Daftar bagian">${icon('list')}</button>
      <button type="button" class="icon-btn" data-act="music" aria-pressed="${store.settings.music}" aria-label="Musik latar" title="Musik latar (M)">${icon('music')}</button>
      <button type="button" class="icon-btn" data-act="sfx" aria-pressed="${store.settings.sfx}" aria-label="Efek suara" title="Efek suara">${icon(store.settings.sfx ? 'volume-2' : 'volume-x')}</button>`,
  };

  void loadContent(no).then((content) => {
    if (!content || !el.isConnected) {
      if (!content) navigate(`#/soal/${no}`, { replace: true });
      return;
    }
    mount(content);
  });

  function mount(content: SoalContent): void {
    const board = new Board();
    board.setReplayIcon(icon('rotate-ccw'));
    const factories: Record<string, VisualFactory> = VISUALS;
    scene = new Scene(content, board, factories);
    const sketches: Record<string, () => string> = {};
    for (const name of Object.keys(factories)) sketches[name] = () => scene!.visual(name)?.sketch?.() ?? '';
    scene.notes.innerHTML = `<div class="notes-bar"><p class="t">Catatan lengkap<small>Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.</small></p>
      <button type="button" class="btn btn--primary" data-print>${icon('printer')}<span>Cetak / simpan PDF</span></button></div>
      <div class="notes-host">${buildNotes(content, sketches)}</div>`;

    const last = store.item(no).lastStep;
    const lobby = html(`<section class="b-stage b-lobby" aria-labelledby="lobby-t">
      <div class="lobby-text">
        <p class="eyebrow">${esc(content.lobby.eyebrow)}</p>
        <h1 class="lobby-title" id="lobby-t">
          <span class="ln"><span>${content.lobby.titleLines[0]}</span></span>
          <span class="ln"><span>${content.lobby.titleLines[1]}</span></span>
          <span class="ln"><span class="sub">${content.lobby.titleLines[2]}</span></span>
        </h1>
        <p class="lede">${mathText(content.lobby.lede)}</p>
        <dl class="facts">${content.lobby.facts.map((f) => `<div><dt>${esc(f.dt)}</dt><dd>${esc(f.dd)}</dd></div>`).join('')}</dl>
        <div class="lobby-path" role="radiogroup" aria-label="Jalur pembahasan">
          <span class="lp-k">Jalur</span>
          <div class="seg">
            <button type="button" role="radio" data-path="ikut" aria-checked="false">Ikut berpikir</button>
            <button type="button" role="radio" data-path="amati" aria-checked="false">Amati</button>
          </div>
          <span class="lp-hint" data-path-hint></span>
        </div>
        <div class="lobby-actions">
          ${
            last && last.b > 0
              ? `<button type="button" class="btn btn--primary btn--lg" data-resume>${icon('play')}<span>Lanjutkan dari bagian ${last.b}</span></button>
                 <button type="button" class="btn btn--lg" data-start>${icon('rotate-ccw')}<span>Mulai dari awal</span></button>`
              : `<button type="button" class="btn btn--primary btn--lg" data-start>${icon('play')}<span>Mulai</span></button>`
          }
        </div>
      </div>
      <div class="lobby-art bp crop" aria-hidden="true"><span class="figcap"><b>GBR. 00</b> ${esc(meta.title)}</span>
        <div class="lobby-paper">${content.paper.html}</div></div>
    </section>`);
    renderMath(lobby.querySelector('.lobby-paper')!);
    // kertas di lobi tidak boleh menjadi sumber terbang (sumber hanya di panggung)
    lobby.querySelectorAll('[data-src]').forEach((e) => e.removeAttribute('data-src'));

    const main = html('<section class="b-stage b-main" aria-label="Pembahasan"></section>');
    main.append(scene.root);
    const nav = html(`<nav class="bnav" aria-label="Navigasi langkah">
      <button type="button" class="btn" data-prev>${icon('arrow-left')}<span class="btn-label">Kembali</span></button>
      <button type="button" class="icon-btn" data-auto aria-pressed="false" aria-label="Putar otomatis" title="Putar otomatis (Spasi)">${icon('play')}</button>
      <div class="seg bnav-speed" role="radiogroup" aria-label="Kecepatan animasi">
        ${SPEEDS.map(([v, t]) => `<button type="button" role="radio" data-speed="${v}" aria-checked="${store.settings.speed === v}">${t}</button>`).join('')}
      </div>
      <div class="navmid"><p class="navlabel" aria-live="polite"></p><div class="subdots"></div></div>
      <button type="button" class="icon-btn" data-mark aria-pressed="false" aria-label="Tandai: belum paham" title="Tandai: belum paham">${icon('flag')}</button>
      <button type="button" class="btn btn--primary" data-next><span data-next-t>Lanjut</span>${icon('arrow-right')}</button>
    </nav>`);
    el.replaceChildren(lobby, main, nav);

    const queryPath = route.query.m === 'amati' || route.query.m === 'ikut' ? (route.query.m as Path) : null;
    const p = new Player(content, board, scene, hooks(), queryPath ?? store.settings.defaultMode);
    player = p;

    const syncPath = (): void => {
      lobby
        .querySelectorAll<HTMLElement>('[data-path]')
        .forEach((b) => b.setAttribute('aria-checked', String(b.dataset.path === p.path)));
      lobby.querySelector('[data-path-hint]')!.textContent =
        p.path === 'ikut'
          ? 'Pertanyaan cepat muncul di papan tulis.'
          : 'Tanpa pertanyaan; baris jawaban ditulis otomatis.';
    };
    syncPath();

    // ---------- interaksi ----------
    lobby.addEventListener('click', (e) => {
      const t = e.target as Element;
      const pb = t.closest<HTMLElement>('[data-path]');
      if (pb) {
        p.path = pb.dataset.path as Path;
        store.updateSettings({ defaultMode: p.path });
        syncPath();
        return;
      }
      const startAt = (i: number): void => {
        SND.init();
        SND.click();
        if (matchMedia('(pointer: coarse)').matches) void enterFullscreenLandscape();
        p.go(i, 1);
      };
      if (t.closest('[data-start]')) startAt(1);
      if (t.closest('[data-resume]') && last) {
        const ids = p.stepsOfCh(last.b);
        startAt(ids[Math.min(last.l, ids.length - 1)] ?? 1);
      }
    });
    nav.addEventListener('click', (e) => {
      const t = e.target as Element;
      if (t.closest('[data-prev]')) {
        SND.click();
        p.prev();
      } else if (t.closest('[data-next]')) {
        SND.init();
        SND.click();
        p.next();
      } else if (t.closest('[data-auto]')) {
        SND.click();
        p.setAuto(!p.auto);
      } else if (t.closest('[data-mark]')) {
        const on = store.toggleMark(no, p.current.ch);
        toast(
          on
            ? 'Bagian ini ditandai belum paham. Lihat lagi di halaman Kemajuan.'
            : 'Tanda belum paham dihapus.',
        );
        chrome();
      } else {
        const sp = t.closest<HTMLElement>('[data-speed]');
        if (sp) {
          store.updateSettings({ speed: Number(sp.dataset.speed) as Speed });
          nav
            .querySelectorAll('[data-speed]')
            .forEach((b) => b.setAttribute('aria-checked', String(b === sp)));
          return;
        }
        const dot = t.closest<HTMLElement>('[data-dot]');
        if (dot) {
          const i = Number(dot.dataset.dot);
          SND.click();
          p.go(i, i >= p.i ? 1 : -1);
        }
      }
    });
    scene.root.addEventListener('pointerdown', () => {
      if (p.auto) p.setAuto(false);
    });
    scene.notes.querySelector('[data-print]')!.addEventListener('click', () => printNotes(scene!.notes));

    const top = document.querySelector<HTMLElement>('.top');
    const onTop = (e: Event): void => {
      const t = (e.target as Element).closest<HTMLElement>('[data-act]');
      if (!t) return;
      if (t.dataset.act === 'menu') openMenu();
      else if (t.dataset.act === 'music') {
        SND.init();
        store.updateSettings({ music: !store.settings.music });
      } else if (t.dataset.act === 'sfx') {
        store.updateSettings({ sfx: !store.settings.sfx });
        if (store.settings.sfx) {
          SND.init();
          SND.click();
        }
      }
    };
    top?.addEventListener('click', onTop);
    // tombol musik/suara selalu mengikuti pengaturan, termasuk saat diubah lewat pintasan M
    const syncTop = (): void => {
      const mu = top?.querySelector<HTMLElement>('[data-act="music"]');
      const sf = top?.querySelector<HTMLElement>('[data-act="sfx"]');
      mu?.setAttribute('aria-pressed', String(store.settings.music));
      if (sf) {
        sf.setAttribute('aria-pressed', String(store.settings.sfx));
        sf.innerHTML = icon(store.settings.sfx ? 'volume-2' : 'volume-x');
      }
    };
    cleanups.push(store.subscribe('settings', syncTop));
    cleanups.push(() => top?.removeEventListener('click', onTop));

    const onKey = (e: KeyboardEvent): void => {
      const tg = e.target as HTMLElement | null;
      if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.isContentEditable)) return;
      if (isSheetOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        SND.init();
        p.next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        p.prev();
      } else if (e.key === ' ' && !(tg && tg.closest('button, a'))) {
        e.preventDefault();
        if (p.current.ch !== 0) p.setAuto(!p.auto);
      } else if (e.key === 'r' || e.key === 'R') {
        if (p.current.ch !== 0) p.go(p.i, 1, { replay: true });
      } else if (e.key === 'f' || e.key === 'F') void toggleFullscreen();
      else if (e.key === 'm' || e.key === 'M') {
        SND.init();
        store.updateSettings({ music: !store.settings.music });
      } else if (e.key === '?') openKeys();
    };
    document.addEventListener('keydown', onKey);
    cleanups.push(() => document.removeEventListener('keydown', onKey));
    cleanups.push(onOrientation((portrait) => portrait && p.setAuto(false)));

    // mulai: lobi, atau langsung ke ?b=&l= (tautan dalam, PRD §7.1)
    // #/soal/n/catatan → langsung ke bagian Catatan lengkap
    const b = route.name === 'catatan' ? notesCh(content) : Number(route.query.b);
    if (b > 0) {
      const ids = p.stepsOfCh(b);
      const l = Math.max(0, Number(route.query.l ?? 0));
      p.go(ids[Math.min(l, ids.length - 1)] ?? 0, 1);
    } else p.go(0, 1);

    function chrome(): void {
      const st = p.current;
      const N = content.chapters.length - 1;
      const tb = document.querySelector('.tblock');
      if (tb) {
        tb.querySelector('.tb-n')!.textContent = `${pad2(st.ch)}/${pad2(N)}`;
        tb.querySelector('.tb-t')!.textContent = content.chapters[st.ch]?.t ?? '';
      }
      el.classList.toggle('is-lobby', st.ch === 0);
      const ids = p.stepsOfCh(st.ch);
      const pos = ids.indexOf(p.i);
      nav.querySelector('.navlabel')!.textContent = st.ch
        ? `Bagian ${st.ch} · langkah ${pos + 1} dari ${ids.length}`
        : '';
      const dots = nav.querySelector('.subdots')!;
      dots.innerHTML = ids
        .map(
          (id, j) =>
            `<button type="button" data-dot="${id}" class="${j < pos ? 'done' : j === pos ? 'cur' : ''}" aria-label="Langkah ${j + 1}"${j === pos ? ' aria-current="step"' : ''}></button>`,
        )
        .join('');
      const lastOfCh = pos === ids.length - 1;
      nav.querySelector('[data-next-t]')!.textContent = p.pending
        ? 'Lewati soal'
        : p.isLast
          ? 'Selesai'
          : lastOfCh
            ? 'Bagian berikutnya'
            : 'Lanjut';
      nav.querySelector('[data-next]')!.classList.toggle('is-skip', p.pending);
      (nav.querySelector('[data-prev]') as HTMLButtonElement).disabled = p.i === 0;
      const auto = nav.querySelector<HTMLElement>('[data-auto]')!;
      auto.setAttribute('aria-pressed', String(p.auto));
      auto.innerHTML = icon(p.auto ? 'pause' : 'play');
      auto.setAttribute('aria-label', p.auto ? 'Jeda putar otomatis' : 'Putar otomatis');
      const marked = store.item(no).marks.includes(st.ch);
      nav.querySelector('[data-mark]')!.setAttribute('aria-pressed', String(marked));
    }

    function hooks(): ConstructorParameters<typeof Player>[3] {
      return {
        chrome,
        stage(toLobby, dir) {
          const show = toLobby ? lobby : main;
          const hide = toLobby ? main : lobby;
          hide.classList.remove('on');
          show.classList.add('on');
          play(
            show,
            [
              { opacity: 0, transform: `translateX(${dir * SLIDE_PX}px)` },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: DUR.enter,
              easing: EASE_OUT,
              ui: true,
            },
          );
          if (!toLobby) requestAnimationFrame(() => scene!.layout());
        },
        done(first) {
          if (first) store.markDone(no);
          openDone(content, p);
        },
        closeOverlays() {
          if (isSheetOpen()) closeSheet();
        },
        save(i) {
          const st = p.steps[i] as PlayStep;
          const ids = p.stepsOfCh(st.ch);
          store.setLastStep(no, st.ch, ids.indexOf(i));
        },
        optional(panel, title) {
          openSheet({
            title,
            body: `<div class="opt-panel">${mathText(panel)}</div>`,
            closeLabel: 'Paham, lanjut',
          });
        },
      };
    }

    function openMenu(): void {
      const list = content.chapters
        .map(
          (c, i) =>
            `<button type="button" class="mitem${i === p.current.ch ? ' cur' : ''}" data-ch="${i}"><span class="mn">${pad2(i)}</span><span><span class="mt">${esc(c.t)}</span><span class="ms">${esc(c.d)}</span></span>${store.item(no).marks.includes(i) ? icon('flag', 'mflag') : ''}</button>`,
        )
        .join('');
      const { root } = openSheet({
        title: 'Daftar bagian',
        body: `<div class="menu-list">${list}</div>`,
        closeLabel: null,
      });
      root.querySelector('.sheet-card')?.classList.add('sheet--menu');
      root.querySelectorAll<HTMLElement>('[data-ch]').forEach((b) =>
        b.addEventListener('click', () => {
          const t = p.indexOfCh(Number(b.dataset.ch));
          closeSheet();
          p.go(t, t >= p.i ? 1 : -1);
        }),
      );
    }
  }

  function openKeys(): void {
    openSheet({
      title: 'Pintasan keyboard',
      body: `<dl class="keys">${KEYS.map(([k, d]) => `<div><dt><kbd>${k}</kbd></dt><dd>${d}</dd></div>`).join('')}</dl>`,
    });
  }

  function openDone(content: SoalContent, p: Player): void {
    SND.fanfare();
    const nx = nextReady(no);
    const { root } = openSheet({
      title: 'SELESAI',
      body: `<div class="done-body"><span class="seal" aria-hidden="true">${esc(content.done.seal)}</span>
        <p>Kamu sudah menuntaskan pembahasan ini dari awal sampai akhir.</p>
        <p class="done-msg">${mathText(content.done.message)}</p>
        <p class="muted small">Latihan serupa dibuka pada tahap berikutnya (mesin latihan).</p></div>`,
      actions: [
        { label: 'Coba latihan serupa', kind: 'gold', icon: 'pen-line', onClick: () => false },
        {
          label: 'Lihat catatan lengkap',
          icon: 'file-text',
          onClick: () => p.go(p.indexOfCh(notesCh(content)), -1),
        },
        { label: 'Ulang pembahasan', icon: 'rotate-ccw', onClick: () => p.go(1, 1) },
        ...(nx
          ? [
              {
                label: 'Soal berikutnya',
                icon: 'arrow-right' as const,
                onClick: () => navigate(`#/soal/${nx}`),
              },
            ]
          : []),
      ],
      closeLabel: null,
    });
    const card = root.querySelector('.sheet-card');
    card?.classList.add('sheet--done');
    const gold = card?.querySelector<HTMLButtonElement>('.btn--gold');
    gold?.setAttribute('aria-disabled', 'true');
    gold?.setAttribute('title', 'Tersedia setelah mesin latihan selesai');
  }

  return {
    el,
    title: `Bahas soal ${no}`,
    header,
    footer: false,
    destroy() {
      store.addTime(performance.now() - t0);
      player?.stop();
      scene?.destroy();
      cleanups.forEach((f) => f());
    },
  };
}

/** Nomor bagian "Catatan lengkap" (langkah bervisual notes). */
function notesCh(c: SoalContent): number {
  return (c.steps.find((s: Step) => s.visual.kind === 'notes') ?? { ch: 0 }).ch;
}

/** Cetak hanya lembar catatan (FR-CAT-2). */
function printNotes(notes: HTMLElement): void {
  const rootEl = document.createElement('div');
  rootEl.className = 'print-root';
  rootEl.innerHTML = notes.querySelector('.notes-host')?.innerHTML ?? '';
  document.body.append(rootEl);
  const clean = (): void => {
    rootEl.remove();
    window.removeEventListener('afterprint', clean);
  };
  window.addEventListener('afterprint', clean);
  window.print();
  setTimeout(clean, 60000);
}
