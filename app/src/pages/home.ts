/**
 * Beranda (FR-HOME-1…5): panggung hero di kiri (animasi string art, bukan soal: revisi pemilik
 * PRD v1.5), katalog 25 soal di kanan.
 */
import { esc, html, pad2 } from '../core/dom';
import { icon, type IconName } from '../core/icons';
import { HERO_CAPTION, heroArt, startHero } from './hero';
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
  const done = ready && !!store.progress.items[String(s.no)]?.done;
  const attrs = `class="qcard${done ? ' is-done' : ''}" data-no="${s.no}" data-status="${s.status}" style="--i:${i}"`;
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
  return `<section class="hero bp crop" aria-labelledby="hero-t">
    <div>
      <p class="eyebrow">TKA Matematika Tingkat Lanjut · 2025</p>
      <h1 class="hero-title" id="hero-t">
        <span class="ln"><span>Yuk <span class="accent">Pahami</span></span></span>
        <span class="ln"><span>Soal TKA 2025,</span></span>
        <span class="ln"><span class="sub">step by step</span></span>
      </h1>
    </div>
    <div class="hero-stage" data-hero-stage>
      ${heroArt()}
      <p class="ha-cap" aria-live="off">${HERO_CAPTION}</p>
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
  const readyCount = SOAL.filter((s) => s.status === 'ready').length;
  const el = html(`<div class="home">
    ${heroHtml()}
    <section class="catalog" aria-labelledby="cat-t">
      <div class="catalog-head">
        <h2 id="cat-t">25 soal TKA 2025</h2>
        <span class="count">${readyCount} dibuka · ${25 - readyCount} segera hadir</span>
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
    // tanpa kolom cari: papan ketik layar sentuh merusak tata letak landscape (revisi pemilik, PRD v1.4)
    const list = SOAL.filter((s) => !f || f.domains.includes(s.domain));
    grid.innerHTML = list.map((s, i) => card(s, i)).join('');
  };
  renderGrid();

  el.querySelector('.filters')!.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter!;
    el.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
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
