/**
 * Kartu analisis dinamis 3–5 (PRD FR-BAH-7, §9.1 engine/cards; port `CARDS`/`flipCards`).
 * Stempel memuat teks dan ikon (bukan warna saja); label mengikuti soal (BENAR/SALAH, PAS/TIDAK PAS).
 */
import { SND } from '../core/audio';
import { dur, sleep, speed } from '../core/clock';
import { esc } from '../core/dom';
import { icon } from '../core/icons';
import { mathHtml, tex } from '../core/math';
import { DUR } from '../core/tokens';
import type { Ctx } from './board';
import type { Card } from './types';

const mt = mathHtml;

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
      c.innerHTML = `<div class="card-in">
        <div class="face front"><div class="num">${esc(d.label)}</div><div class="st">${mt(d.statement)}</div><div class="wait">belum diperiksa</div></div>
        <div class="face back ${d.ok ? 'ok' : 'no'}" aria-hidden="true">
          <div class="stamp ${d.ok ? 'ok' : 'no'}">${icon(d.ok ? 'check' : 'x')}${esc(d.ok ? labels[0] : labels[1])}</div>
          <div class="bn">${d.label.startsWith('(') ? 'Pernyataan' : 'Pilihan'} ${esc(d.label)}</div>
          <div class="bs">${mt(d.statement)}</div>
          <div class="bc">${tex(d.formula)}</div>
          <div class="bw">${mt(d.why)}</div>
        </div></div>`;
      c.dataset.i = String(i);
      this.items.push(c);
      this.el.append(c);
    });
  }

  /** Idempoten: kartu 0..k-1 terbuka; kartu terakhir yang baru dibuka berbunyi bila maju. */
  flip(k: number, c: Ctx): void {
    const flipMs = Math.round(dur(DUR.flip) / speed());
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
      if (!c.dir || c.dir < 0) el.classList.add('no-anim');
      else el.classList.remove('no-anim');
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
