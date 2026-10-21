/**
 * Generator latihan soal 17 — cat pada rambu (PRD §11.4 baris 17). Pilihan banyak: 2 atau 3 dari 5 benar.
 * Rambu: persegi biru sisi 2R, lingkaran hitam jari-jari R (menyentuh sisi), lingkaran putih sepusat jari-jari r,
 * salib merah dari dua persegi panjang L × w yang seluruhnya di dalam lingkaran putih: (L/2)² + (w/2)² ≤ r².
 * Gambar memberi sisi 2R, r, panjang salib L, dan bagian tepi lengan a di kiri dan kanan (a + w + a = L).
 *  - Mudah: R ∈ {16, 20, 24}, π = 3,14; pilihan "dua cat" seperti soal asli (urutan tetap, jumlah > hitam).
 *  - Sedang: R ∈ {20, 24, 28, 30}; π = 22/7 bila R = 28 dan r = 21, selain itu 3,14; urutan pilihan diacak.
 *  - Menantang: pernyataan perbandingan dua warna dengan kelipatan ("merah lebih dari dua kali biru").
 * Selisih tiap perbandingan ≥ 4 % (tidak ada pilihan "hampir sama"). Hitungan dalam perseratus (bilangan bulat).
 * Jebakan per pilihan salah dipilih dari kesalahan konsep yang MEMBALIK jawabannya (dokumen "Kesalahan umum").
 * Oracle: luas tiap warna dihitung dengan mencacah titik kisi 0,1 cm pada seperempat rambu (simetri), tanpa rumus
 * pembuat, lalu kebenaran tiap pilihan dihitung ulang.
 */
import { H, O, T } from '../engine/dsl';
import type { Row } from '../engine/types';
import { int, mulberry32, pick, type Rng } from '../core/prng';
import { toCode, type Generator, type Instance, type Level, type Option, type Trap } from './types';

type Q = 'H' | 'S' | 'B' | 'M' | 'P';
type Vals = Record<Q, number>;
const NAME: Record<Q, string> = { H: 'hitam', S: 'setengah hitam', B: 'biru', M: 'merah', P: 'putih' };
const PAIRS: Array<[Q, Q]> = [
  ['S', 'B'],
  ['S', 'M'],
  ['S', 'P'],
  ['B', 'P'],
  ['B', 'M'],
  ['M', 'P'],
];
const MARGIN = 0.04;

/** Jebakan; bab mengacu ke pembahasan soal 17 (2 = ukuran, 3 = luas tiap warna, 4 = bandingkan). */
const TRAPS = {
  salib: {
    id: 'salib-tanpa-kurangi-irisan',
    hint: 'Hati-hati, saat dua lengan salib dijumlah, kotak tengah $w\\times w$ terhitung dua kali. Kurangi sekali.',
    chapter: 3,
  },
  putih: {
    id: 'putih-dari-persegi',
    hint: 'Hati-hati, putih hanya ada di dalam lingkaran kecil: putih = lingkaran kecil − merah, bukan persegi − merah.',
    chapter: 3,
  },
  hitam: {
    id: 'hitam-lingkaran-penuh',
    hint: 'Hati-hati, hitam berbentuk cincin: lingkaran besar dikurangi lingkaran kecil, bukan lingkaran besar penuh.',
    chapter: 3,
  },
  biru: {
    id: 'biru-tanpa-kurangi-lingkaran',
    hint: 'Hati-hati, biru = persegi dikurangi lingkaran besar. Luas persegi saja masih memuat warna lain.',
    chapter: 3,
  },
  setengah: {
    id: 'lupa-setengah',
    hint: 'Perhatikan, yang dipakai setengah dari luas hitam, bukan seluruhnya.',
    chapter: 4,
  },
  jumlah: {
    id: 'banding-jumlah',
    hint: 'Perhatikan, jumlahkan kedua luas dulu, lalu bandingkan dengan luas hitam.',
    chapter: 4,
  },
  kali: {
    id: 'banding-kali',
    hint: 'Perhatikan, hitung dulu kelipatan luas yang kedua, baru bandingkan dengan luas yang pertama.',
    chapter: 4,
  },
} satisfies Record<string, Trap>;

// ---------- bilangan dalam perseratus ----------
/** 64056 → "640,56"; 34400 → "344" */
function fmt(v100: number): string {
  const neg = v100 < 0;
  const a = Math.abs(v100);
  const i = Math.floor(a / 100);
  const d = a % 100;
  const s = d === 0 ? String(i) : `${i},${String(d).padStart(2, '0').replace(/0$/, '')}`;
  return neg ? `−${s}` : s;
}
const tx = (v100: number): string => fmt(v100).replace(',', '{,}').replace('−', '-');

interface Geo {
  R: number;
  r: number;
  w: number;
  a: number;
  L: number;
  /** π = 22/7 (hanya R = 28, r = 21) */
  pi7: boolean;
}

/** luas lingkaran × 100 dengan π soal */
const circ = (g: Geo, x: number): number => (g.pi7 ? (2200 * x * x) / 7 : 314 * x * x);

function areas(g: Geo): Vals {
  const H = circ(g, g.R) - circ(g, g.r);
  const B = 100 * (2 * g.R) ** 2 - circ(g, g.R);
  const M = 100 * (2 * g.L * g.w - g.w * g.w);
  return { H, S: H / 2, B, M, P: circ(g, g.r) - M };
}

/** nilai yang salah menurut tiap jebakan (untuk memilih jebakan yang membalik jawaban) */
function trapVals(g: Geo, v: Vals): Array<[Trap, Vals]> {
  const red2 = 100 * 2 * g.L * g.w;
  return [
    [TRAPS.salib, { ...v, M: red2, P: circ(g, g.r) - red2 }],
    [TRAPS.putih, { ...v, P: 100 * (2 * g.R) ** 2 - v.M }],
    [TRAPS.hitam, { ...v, H: circ(g, g.R), S: circ(g, g.R) / 2 }],
    [TRAPS.biru, { ...v, B: 100 * (2 * g.R) ** 2 }],
    [TRAPS.setengah, { ...v, S: v.H }],
  ];
}

type Stmt = { kind: 'pair'; a: Q; b: Q } | { kind: 'cmp'; a: Q; b: Q; k: 1 | 2 | 0.5 };

/** kebenaran pernyataan untuk nilai v; null bila selisihnya kurang dari 4 % */
function judge(s: Stmt, v: Vals, margin = MARGIN): boolean | null {
  const lhs = s.kind === 'pair' ? v[s.a] + v[s.b] : v[s.a];
  const rhs = s.kind === 'pair' ? v.H : s.k * v[s.b];
  if (Math.abs(lhs - rhs) / Math.max(lhs, rhs) < margin) return null;
  return lhs > rhs;
}

function shuffle<T>(rng: Rng, a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
}

const cap = (s: string): string => s[0]!.toUpperCase() + s.slice(1);
const kWord = (k: number): string => (k === 2 ? 'dua kali ' : k === 0.5 ? 'setengah ' : '');
const kTex = (k: number): string => (k === 2 ? '2\\times' : k === 0.5 ? '\\tfrac12\\times' : '');

function stmtText(s: Stmt): string {
  if (s.kind === 'pair') return `${cap(NAME[s.a])} dan ${NAME[s.b]}.`;
  return `Cat ${NAME[s.a]} lebih banyak dari ${kWord(s.k)}cat ${NAME[s.b]}.`;
}

/**
 * Bank parameter (PRD §11.5): semua rambu yang memenuhi kendala §11.4 disusun sekali per tingkat, lalu dipilih
 * merata. Lengan salib dibatasi pada setengah atas rentangnya agar hampir menyentuh tepi lingkaran putih seperti
 * gambar soal asli. Rambu masuk bank hanya bila ada lima pernyataan dengan 2–3 benar dan selisih ≥ 4 %.
 */
const BANK = new Map<Level, Geo[]>();
function bank(level: Level): Geo[] {
  const got = BANK.get(level);
  if (got) return got;
  const out: Geo[] = [];
  for (const R of level === 'mudah' ? [16, 20, 24] : [20, 24, 28, 30])
    for (let r = Math.ceil(0.55 * R); r <= Math.floor(0.8 * R); r++)
      for (let w = Math.ceil(0.2 * r); w <= Math.floor(0.35 * r); w++) {
        const aLo = Math.max(2, Math.ceil(w / 2));
        // sudut lengan tetap di dalam lingkaran putih: (L/2)² + (w/2)² ≤ r², L = 2a + w
        const fits = (a: number): boolean => (2 * a + w) ** 2 / 4 + (w * w) / 4 <= r * r;
        if (!fits(aLo)) continue;
        let aHi = aLo;
        while (fits(aHi + 1)) aHi++;
        // π = 22/7 hanya bila semua luas lingkaran bulat (R dan r kelipatan 7)
        const pis = level !== 'mudah' && R === 28 && r === 21 ? [false, true] : [false];
        for (let a = aHi - Math.floor((aHi - aLo) / 2); a <= aHi; a++)
          for (const pi7 of pis) {
            const g = { R, r, w, a, L: 2 * a + w, pi7 };
            const v = areas(g);
            if (v.P > 0 && feasible(level, v)) out.push(g);
          }
      }
  BANK.set(level, out);
  return out;
}

/** ada lima pernyataan yang memenuhi untuk nilai v (pemeriksaan cepat untuk bank) */
function feasible(level: Level, v: Vals): boolean {
  if (level === 'menantang') {
    const ok = (t: boolean): number =>
      (['H', 'B', 'M', 'P'] as const).flatMap((a) =>
        (['H', 'B', 'M', 'P'] as const).flatMap((b) =>
          a === b ? [] : ([1, 2, 0.5] as const).filter((k) => judge({ kind: 'cmp', a, b, k }, v) === t),
        ),
      ).length;
    return ok(true) >= 3 && ok(false) >= 3;
  }
  return pairSets(level, v).length > 0;
}

/**
 * Kemungkinan lima pasangan (urutan tetap seperti soal asli) yang banyak benarnya 2–3; tingkat Mudah menghindari
 * kombinasi persis soal asli (pilihan 1–5, kunci 1, 2, 5).
 */
function pairSets(level: Level, v: Vals): Stmt[][] {
  const ok = PAIRS.filter(([a, b]) => judge({ kind: 'pair', a, b }, v) !== null).map(
    ([a, b]) => ({ kind: 'pair', a, b }) as Stmt,
  );
  if (ok.length < 5) return [];
  return (ok.length === 6 ? ok.map((_, d) => ok.filter((__, i) => i !== d)) : [ok]).filter((set) => {
    const n = set.filter((x) => judge(x, v)).length;
    if (n < 2 || n > 3) return false;
    const orig = set.every((x, i) => x.kind === 'pair' && x.a === PAIRS[i]![0] && x.b === PAIRS[i]![1]);
    return !(
      level === 'mudah' &&
      orig &&
      set.map((x) => judge(x, v)).join() === 'true,true,false,false,true'
    );
  });
}

/** lima pernyataan dengan 2–3 benar, semua selisih ≥ 4 %; null bila tidak ada */
function choose(rng: Rng, level: Level, v: Vals): Stmt[] | null {
  if (level !== 'menantang') {
    const ok = PAIRS.filter(([a, b]) => judge({ kind: 'pair', a, b }, v) !== null).map(
      ([a, b]) => ({ kind: 'pair', a, b }) as Stmt,
    );
    if (ok.length < 5) return null;
    // lima dari pasangan yang memenuhi (urutan tetap seperti soal asli): pilih acak di antara kemungkinan
    // yang banyak benarnya 2–3; tingkat Mudah menghindari kombinasi persis soal asli (pilihan 1–5, kunci 1, 2, 5)
    const sets = (ok.length === 6 ? ok.map((_, d) => ok.filter((__, i) => i !== d)) : [ok]).filter((set) => {
      const n = set.filter((x) => judge(x, v)).length;
      if (n < 2 || n > 3) return false;
      const orig = set.every((x, i) => x.kind === 'pair' && x.a === PAIRS[i]![0] && x.b === PAIRS[i]![1]);
      return !(
        level === 'mudah' &&
        orig &&
        set.map((x) => judge(x, v)).join() === 'true,true,false,false,true'
      );
    });
    if (!sets.length) return null;
    const set = pick(rng, sets);
    return level === 'mudah' ? set : shuffle(rng, set);
  }
  const cand: Stmt[] = [];
  for (const a of ['H', 'B', 'M', 'P'] as const)
    for (const b of ['H', 'B', 'M', 'P'] as const)
      for (const k of [1, 2, 0.5] as const) if (a !== b) cand.push({ kind: 'cmp', a, b, k });
  const pool = shuffle(
    rng,
    cand.filter((s) => judge(s, v) !== null),
  );
  const out: Stmt[] = [];
  const used = new Set<string>();
  const want = int(rng, 2, 3);
  let t = 0;
  for (const s of pool) {
    if (s.kind !== 'cmp') continue;
    const key = [s.a, s.b].sort().join();
    if (used.has(key)) continue;
    const truth = judge(s, v)!;
    if (truth && t >= want) continue;
    if (!truth && out.length - t >= 5 - want) continue;
    out.push(s);
    used.add(key);
    if (truth) t++;
    if (out.length === 5) break;
  }
  return out.length === 5 && t === want ? out : null;
}

function figure(g: Geo): string {
  const k = 200 / (2 * g.R);
  const x0 = 14;
  const y0 = 8;
  const cx = x0 + 100;
  const cy = y0 + 100;
  const ri = g.r * k;
  const hw = (g.w / 2) * k;
  const hl = (g.L / 2) * k;
  const d = Math.SQRT1_2 * ri;
  const n = (v: number): string => v.toFixed(1);
  return `<figure class="lat-fig"><svg viewBox="0 0 230 238" role="img" aria-label="Rambu persegi biru bersisi ${2 * g.R} cm, lingkaran hitam menyentuh sisi, lingkaran putih berjari-jari ${g.r} cm, salib merah sepanjang ${g.L} cm dengan bagian tepi ${g.a} cm">
<rect class="lr-blue" x="${x0}" y="${y0}" width="200" height="200"/>
<circle class="lr-black" cx="${cx}" cy="${cy}" r="100"/>
<circle class="lr-white" cx="${cx}" cy="${cy}" r="${n(ri)}"/>
<path class="lr-red" d="M${n(cx - hl)} ${n(cy - hw)}H${n(cx + hl)}V${n(cy + hw)}H${n(cx - hl)}Z M${n(cx - hw)} ${n(cy - hl)}H${n(cx + hw)}V${n(cy + hl)}H${n(cx - hw)}Z"/>
<path class="lr-dim" d="M${n(cx)} ${n(cy)}L${n(cx + d)} ${n(cy - d)}"/>
<text class="lr-lbl lr-ink" x="${n(cx + d / 2 + 10)}" y="${n(cy - d / 2 - 8)}">${g.r} cm</text>
<text class="lr-lbl lr-ink" x="${n(cx - (hl + hw) / 2)}" y="${n(cy - hw - 5)}">${g.a} cm</text>
<text class="lr-lbl lr-ink" x="${n(cx + (hl + hw) / 2)}" y="${n(cy - hw - 5)}">${g.a} cm</text>
<path class="lr-dim lr-dim-ink" d="M${n(cx - hl)} ${n(cy + hw + 5)}H${n(cx + hl)}"/>
<text class="lr-lbl lr-ink" x="${n(cx - (hl + hw) / 2)}" y="${n(cy + hw + 15)}">${g.L} cm</text>
<path class="lr-dim lr-dim-ink" d="M${x0} 222H${x0 + 200}"/>
<text class="lr-lbl" x="${cx}" y="234">${2 * g.R} cm</text>
</svg></figure>`;
}

function build(seed: number, level: Level): Instance | null {
  const rng = mulberry32(seed);
  for (let tries = 0; tries < 20; tries++) {
    const g = pick(rng, bank(level));
    const v = areas(g);
    const order = choose(rng, level, v);
    if (!order) continue;
    return assemble(seed, level, g, v, order);
  }
  return null;
}

function assemble(seed: number, level: Level, g: Geo, v: Vals, order: Stmt[]): Instance {
  const traps = trapVals(g, v);
  const lbl = (i: number): string => `(${i + 1})`;
  const piTex = g.pi7 ? '\\tfrac{22}{7}' : '3{,}14';
  const verdict = (ok: boolean): string =>
    ok ? '<b class="k-gold">benar</b>' : '<b class="k-red">salah</b>';
  /** baris perbandingan (LaTeX) dan alasan */
  const compare = (s: Stmt): { tex: string; why: string; ok: boolean } => {
    const ok = judge(s, v)!;
    if (s.kind === 'pair') {
      const sum = v[s.a] + v[s.b];
      const tex = `${tx(v[s.a])}+${tx(v[s.b])}=${tx(sum)}${ok ? '>' : '<'}${tx(v.H)}`;
      return {
        tex,
        ok,
        why: `${cap(NAME[s.a])} + ${NAME[s.b]} $=${tx(v[s.a])}+${tx(v[s.b])}=${tx(sum)}$, ${ok ? 'lebih' : 'kurang'} dari hitam $${tx(v.H)}$.`,
      };
    }
    const rhs = s.k * v[s.b];
    const tex = `${tx(v[s.a])}${ok ? '>' : '<'}${kTex(s.k)}${tx(v[s.b])}${s.k === 1 ? '' : `=${tx(rhs)}`}`;
    return {
      tex,
      ok,
      why: `${cap(NAME[s.a])} $${tx(v[s.a])}$, ${kWord(s.k)}${NAME[s.b]} $${tx(rhs)}$: ${ok ? 'lebih banyak' : 'tidak lebih banyak'}.`,
    };
  };
  const made = order.map((s) => {
    const c = compare(s);
    // jebakan: kesalahan konsep yang membuat pernyataan salah ini tampak benar
    const trap = c.ok
      ? undefined
      : (traps.find(([, wv]) => judge(s, wv, 0) === true)?.[0] ??
        (s.kind === 'pair' ? TRAPS.jumlah : TRAPS.kali));
    return { s, ...c, trap };
  });
  const options: Option[] = made.map((m) => ({
    tex: '',
    html: stmtText(m.s),
    ok: m.ok,
    why: m.why,
    ...(m.trap ? { trap: m.trap } : {}),
  }));
  const keys = made.map((m, i) => (m.ok ? i : -1)).filter((i) => i >= 0);
  const keyText = keys
    .map(lbl)
    .join(keys.length === 3 ? ', ' : ' dan ')
    .replace(/, ([^,]*)$/, ', dan $1');

  // ---- penyelesaian ----
  const area = (id: string, name: string, f: string, val: number, note: string): Row => ({
    id,
    toks: [
      H(`${id}a`, name, 'tx'),
      O(`${id}b`, '='),
      T(`${id}c`, f),
      O(`${id}d`, '='),
      T(`${id}e`, `${tx(val)}\\ \\text{cm}^2`, 'blue'),
    ],
    note,
    box: 'navy',
  });
  const cmpRow = (m: (typeof made)[number], i: number): Row => ({
    id: `u${i + 1}`,
    toks: [T(`u${i + 1}a`, lbl(i), 'sp'), T(`u${i + 1}b`, m.tex)],
    note: `${m.s.kind === 'pair' ? `${NAME[m.s.a]} + ${NAME[m.s.b]}` : stmtText(m.s).replace(/\.$/, '').toLowerCase()} → ${verdict(m.ok)}`,
  });
  const solution: Instance['solution'] = [
    {
      title: 'Ukuran dari gambar',
      rows: [
        {
          id: 'g1',
          toks: [T('g1a', 'R'), O('g1b', '='), T('g1c', `\\tfrac12\\times${2 * g.R}=${g.R}`)],
          note: 'lingkaran hitam menyentuh sisi persegi',
        },
        {
          id: 'g2',
          toks: [T('g2a', 'r'), O('g2b', '='), T('g2c', String(g.r))],
          note: 'jari-jari lingkaran putih',
        },
        {
          id: 'g3',
          toks: [T('g3a', `${g.a}+w+${g.a}=${g.L}`), O('g3b', '\\Rightarrow'), T('g3c', `w=${g.w}`, 'blue')],
          note: 'lebar lengan salib',
          box: 'navy',
        },
      ],
    },
    {
      title: 'Luas hitam dan biru',
      rows: [
        area('h', 'hitam', `${piTex}\\times(${g.R}^2-${g.r}^2)`, v.H, 'lingkaran besar − lingkaran kecil'),
        area('b', 'biru', `${2 * g.R}^2-${piTex}\\times${g.R}^2`, v.B, 'persegi − lingkaran besar'),
      ],
    },
    {
      title: 'Luas merah dan putih',
      rows: [
        area(
          'm',
          'merah',
          `2(${g.L}\\times${g.w})-${g.w}\\times${g.w}`,
          v.M,
          'dua lengan, kotak tengah dikurangi sekali',
        ),
        area('p', 'putih', `${piTex}\\times${g.r}^2-${tx(v.M)}`, v.P, 'lingkaran kecil − merah'),
      ],
    },
    ...(level === 'menantang'
      ? []
      : [
          {
            title: 'Setengah hitam',
            rows: [
              {
                id: 's1',
                toks: [
                  T('s1a', '\\tfrac12\\times'),
                  T('s1b', tx(v.H)),
                  O('s1c', '='),
                  T('s1d', tx(v.S), 'blue'),
                ],
                note: 'dipakai pada pilihan yang memuat setengah hitam',
              },
            ],
          },
        ]),
    { title: 'Bandingkan (1)–(3)', rows: made.slice(0, 3).map(cmpRow) },
    {
      title: 'Bandingkan (4)–(5)',
      rows: [
        ...made.slice(3).map((m, i) => cmpRow(m, i + 3)),
        {
          id: 'ans',
          toks: [H('ansa', 'Jawaban', 'lbl'), H('ansb', `pilihan ${keyText}`, 'tx')],
          box: 'gold',
        },
      ],
    },
  ];

  const ask =
    level === 'menantang'
      ? 'Manakah pernyataan berikut yang benar tentang banyak cat yang digunakan?'
      : 'Cat warna apakah yang lebih banyak digunakan dibanding cat warna hitam? Setiap pilihan menyebut dua cat: jumlah keduanya dibandingkan dengan cat hitam.';
  const paper = `<div class="lat24"><div>
<p>Sebuah rumah makan memasang rambu berbentuk persegi biru bersisi $${2 * g.R}$ cm. Di dalamnya ada lingkaran hitam yang menyentuh keempat sisi persegi, lingkaran putih sepusat berjari-jari $${g.r}$ cm, dan salib merah dari dua persegi panjang yang sama ukurannya.</p>
<p>Panjang salib dari ujung ke ujung $${g.L}$ cm; pada tepi atas lengan mendatar tertulis $${g.a}$ cm di kiri dan kanan lengan tegak. Cat dibeli dalam ukuran yang sama. Gunakan $\\pi=${piTex}$.</p>
<p>${ask}</p>
<p class="lat-multi-note">Pilih semua jawaban yang benar.</p>
</div>${figure(g)}</div>`;

  return {
    no: 17,
    seed,
    level,
    code: toCode(seed, level),
    paper,
    options,
    key: keys[0]!,
    multi: true,
    summary: `\\text{rambu sisi }${2 * g.R}\\text{ cm},\\ r=${g.r}`,
    chapter: 3,
    hints: [
      'Banyak cat sebanding dengan luas. Rambu = tumpukan persegi, lingkaran besar, lingkaran kecil, dan salib: warna terlihat = bangunnya dikurangi bangun di atasnya.',
      `Langkah pertama: $R=${g.R}$, $r=${g.r}$, dan dari $${g.a}+w+${g.a}=${g.L}$ didapat lebar lengan $w=${g.w}$.`,
      'Hitam = lingkaran besar − kecil, biru = persegi − lingkaran besar, merah = dua lengan − kotak tengah, putih = lingkaran kecil − merah. Catat semua, lalu bandingkan.',
    ],
    solution,
    timeAdvice: level === 'mudah' ? 180 : level === 'sedang' ? 240 : 300,
    test(i) {
      const m = made[i]!;
      return { tex: m.tex, ok: m.ok };
    },
    params: { geo: g, stmts: order },
  };
}

// ---------- oracle (jalur berbeda dari pembuat) ----------
/** Luas tiap warna (cm²) dari pencacahan titik kisi 0,1 cm pada seperempat rambu, dikali 4 (simetri). */
function gridAreas(g: Geo): Record<'H' | 'B' | 'M' | 'P', number> {
  const h = 0.1;
  const n = Math.round(g.R / h);
  const c = { H: 0, B: 0, M: 0, P: 0 };
  const hl = g.L / 2;
  const hw = g.w / 2;
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * h;
    for (let j = 0; j < n; j++) {
      const y = (j + 0.5) * h;
      const d2 = x * x + y * y;
      if ((x <= hl && y <= hw) || (y <= hl && x <= hw)) c.M++;
      else if (d2 <= g.r * g.r) c.P++;
      else if (d2 <= g.R * g.R) c.H++;
      else c.B++;
    }
  }
  const k = 4 * h * h;
  return { H: c.H * k, B: c.B * k, M: c.M * k, P: c.P * k };
}

const FALLBACK: Record<Level, number[]> = { mudah: [5, 23], sedang: [7, 31], menantang: [11, 37] };

export const gen17: Generator = {
  no: 17,
  levels: {
    mudah: 'Rambu dengan ukuran baru, pilihan "dua cat" seperti soal aslinya.',
    sedang: 'Ukuran lebih bervariasi, kadang π = 22/7; urutan pilihan diacak.',
    menantang: 'Pernyataan perbandingan dua warna dengan kelipatan, mis. "dua kali biru".',
  },
  make(seed, level) {
    return build(seed, level) ?? build(FALLBACK[level][seed % 2]!, level)!;
  },
  oracle(inst) {
    const g = inst.params.geo as Geo;
    const stmts = inst.params.stmts as Stmt[];
    const a = gridAreas(g);
    // salib harus utuh di dalam lingkaran putih (luas merah dari kisi = 2Lw − w²)
    if ((g.L / 2) ** 2 + (g.w / 2) ** 2 > g.r * g.r) return false;
    const v: Vals = { H: a.H * 100, S: (a.H * 100) / 2, B: a.B * 100, M: a.M * 100, P: a.P * 100 };
    const truth = stmts.map((s) => judge(s, v, 0.02));
    const n = truth.filter((t) => t === true).length;
    return (
      truth.every((t, i) => t === inst.options[i]!.ok) &&
      n >= 2 &&
      n <= 3 &&
      new Set(inst.options.map((o) => o.html)).size === 5
    );
  },
};
