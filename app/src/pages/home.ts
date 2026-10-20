/**
 * Beranda (FR-HOME-1…5): panggung hero "angka terbang" di kiri, katalog 25 soal di kanan.
 * M0: hero menampilkan keadaan akhir statis; siklus terbang dipasang pada M1 (1.7).
 */
import { esc, html, pad2 } from '../core/dom';
import { icon, type IconName } from '../core/icons';
import { tex } from '../core/math';
import { startHero } from './hero';
import { progressSummary, store } from '../core/store';
import {
  DOMAIN_LABEL,
  FILTERS,
  RELEASE_1,
  RESPONSE_LABEL,
  SOAL,
  type Response,
  type SoalMeta,
} from '../content';
import type { PageView } from '../shell/app';
import { showSoonSheet } from '../shell/app';

const RESP_ICON: Record<Response, IconName> = {
  single: 'circle-dot',
  multi: 'list-checks',
  truefalse: 'table',
};

/** Status siswa per soal (PRD §7.4) dengan teks, tidak hanya warna. */
function statusPill(no: number): string {
  const it = store.progress.items[String(no)];
  if (!it || (!it.done && !it.watched)) return '';
  const last3 = it.practice.slice(-3);
  const mastered =
    last3.length >= 2 &&
    last3.filter((p) => p.correct && p.hints === 0).length >= 2 &&
    !!last3.at(-1)?.correct;
  const review = it.marks.length > 0 || (last3.length > 0 && !last3.at(-1)!.correct);
  if (mastered) return `<span class="pill pill--mastered">${icon('circle-check')}Sudah paham</span>`;
  if (review) return `<span class="pill pill--review">${icon('flag')}Perlu diulang</span>`;
  if (it.done) return `<span class="pill pill--done">${icon('check')}Sudah dibahas</span>`;
  return '';
}

function card(s: SoalMeta, i: number): string {
  const ready = s.status === 'ready';
  const meta = ready
    ? `<span class="qcard-resp">${icon(RESP_ICON[s.response])}${esc(s.response === 'truefalse' && s.labels ? s.labels.join(' / ') : RESPONSE_LABEL[s.response])}</span>${statusPill(s.no)}`
    : `<span class="soon-tag">${icon('lock')}Segera hadir</span>`;
  const attrs = `class="qcard" data-no="${s.no}" data-status="${s.status}" style="--i:${i}"`;
  const inner = `<span class="qcard-top"><span class="qcard-no"><span class="sr-only">Soal </span>${pad2(s.no)}</span></span>
      <span class="qcard-domain">${esc(DOMAIN_LABEL[s.domain])}</span>
      <span class="qcard-title">${esc(s.title)}</span>
      <span class="qcard-meta">${meta}</span>`;
  return ready
    ? `<a ${attrs} href="#/soal/${s.no}">${inner}</a>`
    : `<button type="button" ${attrs} title="Sedang disiapkan">${inner}</button>`;
}

function heroHtml(): string {
  const sum = progressSummary(RELEASE_1.length);
  const last = store.progress.lastOpened;
  const cta = last
    ? `<a class="btn btn--primary btn--lg" href="#/soal/${last}">${icon('play')}<span>Lanjutkan soal ${last}</span></a>`
    : `<a class="btn btn--primary btn--lg" href="#/soal/1">${icon('play')}<span>Mulai dari soal 1</span></a>`;
  // keadaan akhir tanda khas: angka dari soal 25 sudah "mendarat" di papan (docs/pembahasan25.md, e3)
  return `<section class="hero bp crop" aria-labelledby="hero-t">
    <div>
      <p class="eyebrow">TKA Matematika Tingkat Lanjut · 2025</p>
      <h1 class="hero-title" id="hero-t">
        <span class="ln"><span>Dari bingung</span></span>
        <span class="ln"><span>jadi <span class="accent">paham</span>,</span></span>
        <span class="ln"><span class="sub">langkah demi langkah</span></span>
      </h1>
    </div>
    <div class="fly-stage" aria-hidden="true" data-hero-stage>
      <div class="fly-paper">
        <span class="fly-label">Soal 25</span>
        ${tex('\\lim_{\\htmlData{h=x3}{x\\to 3}}\\dfrac{1-\\cos(\\htmlData{h=pem}{6x-18})}{\\left(x-\\frac{9}{x}\\right)\\sin(6x-18)}')}
      </div>
      <div class="fly-board">
        <span class="fly-label">Papan tulis</span>
        <div class="bl past">${tex('\\lim_{u\\to0}\\dfrac{\\tan 3u}{u}=3')}</div>
        <div class="bl past">${tex('\\lim_{x\\to3}\\dfrac{x}{x+3}=\\dfrac12')}</div>
        <div class="bl"><span class="box-gold">${tex('3\\cdot\\dfrac12=\\dfrac32')}</span><span class="note">jawaban E</span></div>
      </div>
    </div>
    <div class="hero-foot">
      ${cta}
      <div class="hero-stats">
        <span><b class="num">${sum.done}/${sum.ready}</b>dibahas</span>
        <span><b class="num">${sum.practiceOk}/${sum.practiceTotal}</b>latihan benar</span>
        <span><b class="num">${sum.minutes}</b>menit belajar</span>
      </div>
    </div>
  </section>`;
}

export function homePage(): PageView {
  let filter = 'semua';
  let query = '';
  const readyCount = SOAL.filter((s) => s.status === 'ready').length;
  const el = html(`<div class="home">
    ${heroHtml()}
    <section class="catalog" aria-labelledby="cat-t">
      <div class="catalog-head">
        <h2 id="cat-t">25 soal TKA 2025</h2>
        <span class="count">${readyCount} dibuka · ${25 - readyCount} segera hadir</span>
        <label class="search"><span class="sr-only">Cari judul atau nomor soal</span>${icon('search')}
          <input type="search" inputmode="search" autocomplete="off" placeholder="Cari judul atau nomor" data-search /></label>
      </div>
      <div class="filters" role="group" aria-label="Saring menurut ranah materi">
        <button type="button" class="chip" data-filter="semua" aria-pressed="true">Semua</button>
        ${FILTERS.map((f) => `<button type="button" class="chip" data-filter="${f.id}" aria-pressed="false">${esc(f.label)}</button>`).join('')}
      </div>
      <div class="grid" data-grid></div>
    </section>
  </div>`);

  const grid = el.querySelector<HTMLElement>('[data-grid]')!;

  const renderGrid = (): void => {
    const f = FILTERS.find((x) => x.id === filter);
    const q = query.trim().toLowerCase();
    const list = SOAL.filter(
      (s) =>
        (!f || f.domains.includes(s.domain)) &&
        (!q || s.title.toLowerCase().includes(q) || String(s.no) === q.replace(/^0+/, '')),
    );
    grid.innerHTML = list.length
      ? list.map((s, i) => card(s, i)).join('')
      : `<p class="grid-empty">Tidak ada soal yang cocok. Coba kata lain atau pilih <b>Semua</b>.</p>`;
  };
  renderGrid();

  el.querySelector('.filters')!.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter!;
    el.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderGrid();
  });
  el.querySelector<HTMLInputElement>('[data-search]')!.addEventListener('input', (e) => {
    query = (e.target as HTMLInputElement).value;
    renderGrid();
  });
  grid.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('.qcard[data-status="soon"]');
    if (b) showSoonSheet(Number(b.dataset.no));
  });

  let stopHero: () => void = () => undefined;
  requestAnimationFrame(() => {
    const stage = el.querySelector<HTMLElement>('[data-hero-stage]');
    if (stage?.isConnected) stopHero = startHero(stage);
  });

  return { el, title: '', header: { progress: true }, footer: true, destroy: () => stopHero() };
}
