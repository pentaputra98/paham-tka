/**
 * Pembungkus localStorage yang tahan gagal (mode privat, penuh, diblokir).
 * Bila tulis gagal, nilai tetap disimpan di memori dan `healthy` menjadi false
 * agar antarmuka dapat memberi pesan jelas (PRD §14.5).
 */
const memory = new Map<string, string>();
let healthy = true;
const listeners = new Set<(ok: boolean) => void>();

function setHealthy(ok: boolean): void {
  if (healthy === ok) return;
  healthy = ok;
  listeners.forEach((f) => f(ok));
}

export const storage = {
  get(key: string): string | null {
    try {
      const v = localStorage.getItem(key);
      return v ?? memory.get(key) ?? null;
    } catch {
      return memory.get(key) ?? null;
    }
  },
  set(key: string, value: string): boolean {
    memory.set(key, value);
    try {
      localStorage.setItem(key, value);
      setHealthy(true);
      return true;
    } catch {
      setHealthy(false);
      return false;
    }
  },
  remove(key: string): void {
    memory.delete(key);
    try {
      localStorage.removeItem(key);
    } catch {
      /* diabaikan: tidak ada yang bisa dilakukan selain memori */
    }
  },
  keys(prefix: string): string[] {
    const out = new Set<string>([...memory.keys()].filter((k) => k.startsWith(prefix)));
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(prefix)) out.add(k);
      }
    } catch {
      /* hanya memori */
    }
    return [...out];
  },
  get healthy(): boolean {
    return healthy;
  },
  onHealth(f: (ok: boolean) => void): () => void {
    listeners.add(f);
    return () => listeners.delete(f);
  },
};
