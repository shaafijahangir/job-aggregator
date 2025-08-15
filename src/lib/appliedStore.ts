// src/lib/appliedStore.ts
export type AppStatus = 'applied' | 'interview' | 'offer' | 'rejected';
export interface ApplicationMeta {
  status: AppStatus;
  dateApplied: string;       // ISO
  sourceUrl?: string;
  notes?: string;
}

const KEY = 'appliedJobsMeta';
const EVT = 'applied-jobs-changed';

function read(): Record<string, ApplicationMeta> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function write(v: Record<string, ApplicationMeta>) {
  localStorage.setItem(KEY, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getApplication(id: string) { return read()[id]; }
export function isApplied(id: string) { return Boolean(getApplication(id)); }

export function markApplied(id: string, meta: Partial<ApplicationMeta> = {}) {
  const all = read();
  all[id] = {
    status: meta.status ?? 'applied',
    dateApplied: meta.dateApplied ?? new Date().toISOString(),
    sourceUrl: meta.sourceUrl,
    notes: meta.notes ?? ''
  };
  write(all);
}
export function unapply(id: string) {
  const all = read();
  if (all[id]) { delete all[id]; write(all); }
}

export function onAppliedChange(cb: () => void) {
  const h = () => cb();
  window.addEventListener(EVT as any, h);
  return () => window.removeEventListener(EVT as any, h);
}
