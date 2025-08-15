// src/lib/savedStore.ts
const KEY = 'savedJobIds';
const EVT = 'saved-jobs-changed';

function read(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); }
  catch { return new Set(); }
}
function write(ids: Set<string>) {
  localStorage.setItem(KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function isJobSaved(id: string) {
  return read().has(id);
}
export function toggleJobSaved(id: string) {
  const ids = read();
  if (ids.has(id)) ids.delete(id); else ids.add(id);
  write(ids);
}
export function onSavedChange(cb: () => void) {
  const handler = () => cb();
  window.addEventListener(EVT as any, handler);
  return () => window.removeEventListener(EVT as any, handler);
}
export function getAllSavedIds(): string[] {
  return [...read()];
}
