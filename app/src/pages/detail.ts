/**
 * Detail soal (FR-DET-1…3). Kerangka M0: ringkasan soal dan tombol aksi.
 * Kertas soal dan tombol Bahas aktif setelah modul konten soal tersedia (M1 pilot, M2 sisanya).
 */
import { esc, html, pad2 } from '../core/dom';
import { icon } from '../core/icons';
import { store } from '../core/store';
import { DOMAIN_LABEL, RESPONSE_LABEL, getSoal } from '../content';
import type { Route } from '../router/router';
import type { PageView } from '../shell/app';

export function detailPage(route: Route): PageView {
  const s = getSoal(route.no!)!;
  store.markOpened(s.no);
  const el = html(`<div class="detail">
    <article class="paper" aria-labelledby="paper-t">
      <header class="paper-h"><span>Soal ${pad2(s.no)}</span><span>${esc(DOMAIN_LABEL[s.domain])}</span></header>
      <h1 class="paper-title" id="paper-t">${esc(s.title)}</h1>
      <p class="muted">Kertas soal dan pembahasan nomor ini sedang disusun dan akan tampil di sini.</p>
      <p class="paper-src">Sumber: naskah asli TKA Matematika Tingkat Lanjut 2025.</p>
    </article>
    <aside class="detail-side panel" aria-label="Ringkasan soal">
      <h2>Ringkasan</h2>
      <p><span class="muted">Materi</span><br><b>${esc(DOMAIN_LABEL[s.domain])}</b></p>
      <p><span class="muted">Jenis respons</span><br><b>${esc(RESPONSE_LABEL[s.response])}</b></p>
      <div class="detail-actions">
        <button type="button" class="btn btn--primary btn--lg btn--block" aria-disabled="true">${icon('play')}<span>Bahas</span></button>
        <button type="button" class="btn btn--block" aria-disabled="true">${icon('pen-line')}<span>Coba latihan serupa</span></button>
        <button type="button" class="btn btn--block" aria-disabled="true">${icon('file-text')}<span>Catatan lengkap</span></button>
      </div>
    </aside>
  </div>`);
  return {
    el,
    title: `Soal ${s.no}`,
    header: { back: { label: 'Beranda', href: '#/' }, block: { k: 'SOAL', n: pad2(s.no), t: s.title } },
    footer: false,
  };
}
