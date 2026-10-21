/**
 * Detail soal (FR-DET-1…3, FR-DET-5): kertas soal asli (hanya dibaca), ringkasan, aksi.
 * Bila modul konten soal belum ada, kertas menampilkan "sedang disusun" dan aksi nonaktif.
 */
import { esc, html, pad2 } from '../core/dom';
import { icon } from '../core/icons';
import { renderMath } from '../core/math';
import { store } from '../core/store';
import { DOMAIN_LABEL, OPEN, RESPONSE_LABEL, getSoal } from '../content';
import { hasContent, loadContent, prefetchContent } from '../content/soal/registry';
import { hasPractice } from '../practice/registry';
import type { Route } from '../router/router';
import type { PageView } from '../shell/app';

function neighbour(no: number, d: -1 | 1): number | null {
  const i = OPEN.indexOf(no) + d;
  return i >= 0 && i < OPEN.length ? OPEN[i]! : null;
}

export function detailPage(route: Route): PageView {
  const s = getSoal(route.no!)!;
  store.markOpened(s.no);
  const ready = hasContent(s.no);
  const it = store.item(s.no);
  const status = it.done
    ? `${icon('check')}Sudah dibahas`
    : it.lastStep
      ? `${icon('circle-dot')}Sedang dibahas`
      : '';
  const prev = neighbour(s.no, -1);
  const next = neighbour(s.no, 1);
  const el = html(`<div class="detail">
    <article class="paper" aria-labelledby="paper-t">
      <header class="paper-h"><span>Soal ${pad2(s.no)}</span><span>${esc(DOMAIN_LABEL[s.domain])}</span></header>
      <h1 class="paper-title" id="paper-t">${esc(s.title)}</h1>
      <div class="paper-body soal-b" data-paper>${ready ? '<p class="muted">Memuat kertas soal…</p>' : '<p class="muted">Kertas soal dan pembahasan nomor ini sedang disusun dan akan tampil di sini.</p>'}</div>
      <p class="paper-src">Sumber: naskah asli TKA Matematika Tingkat Lanjut 2025.</p>
    </article>
    <aside class="detail-side panel" aria-label="Ringkasan soal">
      <h2>Ringkasan</h2>
      <p><span class="muted">Materi</span><br><b>${esc(DOMAIN_LABEL[s.domain])}</b></p>
      <p><span class="muted">Jenis respons</span><br><b>${esc(s.response === 'truefalse' && s.labels ? `Tabel ${s.labels.join(' / ')}` : RESPONSE_LABEL[s.response])}</b></p>
      ${status ? `<p><span class="pill pill--done">${status}</span></p>` : ''}
      <div class="detail-actions">
        ${
          ready
            ? `<a class="btn btn--primary btn--lg btn--block" href="#/soal/${s.no}/bahas">${icon('play')}<span>Bahas</span></a>`
            : `<button type="button" class="btn btn--primary btn--lg btn--block" aria-disabled="true">${icon('play')}<span>Bahas</span></button>`
        }
        ${
          ready && hasPractice(s.no)
            ? `<a class="btn btn--block" href="#/soal/${s.no}/latihan">${icon('pen-line')}<span>Coba latihan serupa</span></a>`
            : `<button type="button" class="btn btn--block" aria-disabled="true" title="Segera hadir">${icon('pen-line')}<span>Coba latihan serupa</span></button>`
        }
        ${
          ready
            ? `<a class="btn btn--block" href="#/soal/${s.no}/catatan">${icon('file-text')}<span>Catatan lengkap</span></a>`
            : `<button type="button" class="btn btn--block" aria-disabled="true">${icon('file-text')}<span>Catatan lengkap</span></button>`
        }
      </div>
      <div class="detail-nav">
        ${prev ? `<a class="btn" href="#/soal/${prev}">${icon('arrow-left')}<span>Soal ${prev}</span></a>` : '<span></span>'}
        ${next ? `<a class="btn" href="#/soal/${next}"><span>Soal ${next}</span>${icon('arrow-right')}</a>` : ''}
      </div>
    </aside>
  </div>`);

  if (ready) {
    prefetchContent(s.no);
    void loadContent(s.no).then((c) => {
      const host = el.querySelector<HTMLElement>('[data-paper]');
      if (!c || !host) return;
      host.innerHTML = c.paper.html;
      renderMath(host);
      // kertas detail hanya dibaca: tanpa sumber terbang dan tanpa stabilo
      host.querySelectorAll('[data-src]').forEach((e) => e.removeAttribute('data-src'));
    });
  }

  return {
    el,
    title: `Soal ${s.no}`,
    header: { back: { label: 'Beranda', href: '#/' }, block: { k: 'SOAL', n: pad2(s.no), t: s.title } },
    footer: false,
  };
}
