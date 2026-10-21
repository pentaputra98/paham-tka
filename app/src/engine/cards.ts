/**
 * Kartu analisis dinamis 3–5 (PRD FR-BAH-7, §9.1 engine/cards; port `CARDS`/`flipCards`).
 * Stempel memuat teks dan ikon (bukan warna saja); label mengikuti soal (BENAR/SALAH, PAS/TIDAK PAS).
 */
import { SND } from '../core/audio';
import { sleep, wallMs } from '../core/clock';
import { esc } from '../core/dom';
import { icon } from '../core/icons';
import { mathHtml, tex } from '../core/math';
import { DUR } from '../core/tokens';
import type { Ctx } from './board';
import type { Card } from './types';

export class Cards {
  readonly el: HTMLElement;
  private readonly items: HTMLElement[] = [];

  constructor(
    private readonly cards: Card[],
    private readonly labels: [string, string],
  ) {
    this.el = document.createElement('div');
    this.el.className = 'p-cards inFree';
    this.el.dataset.n = String(cards.length);
    this.el.setAttribute('role', 'list');
    cards.forEach((d, i) => {
      const c = document.createElement('div');
      c.className = 'card';
      c.setAttribute('role', 'listitem');
      // pilihan berupa rumus saja (mis. matriks) ditata di tengah dan lebih besar; pernyataan teks rata kiri
      const math = /^\$[^$]+\$$/.test(d.statement.trim()) ? ' is-math' : '';
      const kind = d.label.startsWith('(') ? 'Pernyataan' : 'Pilihan';
      c.innerHTML = `<div class="card-in">
        <div class="face front${math}"><div class="c-head"><span class="num">${esc(d.label)}</span><span class="wait">belum diperiksa</span></div><div class="st">${mathHtml(d.statement)}</div></div>
        <div class="face back ${d.ok ? 'ok' : 'no'}${math}" aria-hidden="true">
          <div class="c-head"><span class="bn"><b>${esc(d.label)}</b><span class="bn-t">${kind}</span></span>
            <span class="stamp ${d.ok ? 'ok' : 'no'}">${icon(d.ok ? 'check' : 'x')}${esc(d.ok ? labels[0] : labels[1])}</span></div>
          <div class="bs">${mathHtml(d.statement)}</div>
          <div class="bc">${tex(d.formula)}</div>
          <div class="bw">${mathHtml(d.why)}</div>
        </div></div>`;
      c.dataset.i = String(i);
      this.items.push(c);
      this.el.append(c);
    });
  }

  /**
   * Perkecil isi kartu yang lebih lebar atau lebih tinggi dari ruangnya (min 50 %), tidak pernah memotong rumus.
   * Satu skala --k untuk semua muka depan dan satu untuk semua muka belakang, agar kelima kartu seragam
   * (isi kartu memakai em). Diukur ulang sekali karena teks bisa ditata ulang; tulis–baca–tulis berkelompok.
   */
  fit(): void {
    for (const side of ['.front', '.back']) {
      const faces = [...this.el.querySelectorAll<HTMLElement>(`.face${side}`)];
      faces.forEach((f) => f.style.removeProperty('--k'));
      let k = 1;
      for (let n = 0; n < 2; n++) {
        const need = Math.min(
          ...faces.map((f) =>
            Math.min(
              f.clientHeight && f.scrollHeight ? f.clientHeight / f.scrollHeight : 1,
              f.clientWidth && f.scrollWidth ? f.clientWidth / f.scrollWidth : 1,
            ),
          ),
        );
        if (need >= 0.99) break;
        k = Math.max(0.5, k * need);
        faces.forEach((f) => f.style.setProperty('--k', k.toFixed(3)));
        if (k === 0.5) break;
      }
    }
  }

  /** Idempoten: kartu 0..k-1 terbuka; kartu terakhir yang baru dibuka berbunyi bila maju. */
  flip(k: number, c: Ctx): void {
    const flipMs = Math.round(wallMs(DUR.flip));
    this.el.style.setProperty('--dur-flip-now', `${flipMs}ms`);
    this.items.forEach((el, i) => {
      const want = k >= i + 1;
      const had = el.classList.contains('flip');
      el.classList.toggle('flip', want);
      el.classList.toggle('focus', k === i + 1 || (k === 0 && i === 0));
      el.querySelector('.back')!.setAttribute('aria-hidden', String(!want));
      el.setAttribute(
        'aria-label',
        want
          ? `${this.cards[i]!.label}: ${this.cards[i]!.ok ? this.labels[0] : this.labels[1]}`
          : `${this.cards[i]!.label}: belum diperiksa`,
      );
      el.classList.toggle('no-anim', c.dir < 0);
      if (want && !had && c.dir > 0 && i === k - 1) {
        SND.whoosh(0.7);
        void sleep(650).then((ok) => {
          if (!ok || !c.live()) return;
          SND.stamp();
          if (this.cards[i]!.ok) SND.chime();
          else SND.wrong();
        });
      }
    });
  }
}
