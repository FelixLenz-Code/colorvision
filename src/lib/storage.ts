import type { PickedColor } from './colors'

export interface HistoryEntry extends PickedColor {
  id: string
  timestamp: number
  sourceFile?: string
}

export interface FavoriteEntry extends PickedColor {
  id: string
  savedAt: number
  listId: string
  sourceFile?: string
  customLabel?: string
}

export interface FavoriteList {
  id: string
  name: string
  order: number
}

const HISTORY_KEY = 'colorvision_history'
const FAVORITES_KEY = 'colorvision_favorites'
const LISTS_KEY = 'colorvision_lists'

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
  } catch { return [] }
}

export function saveHistory(history: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 200)))
}

export function addToHistory(color: PickedColor, sourceFile?: string): HistoryEntry {
  const entry: HistoryEntry = { ...color, id: crypto.randomUUID(), timestamp: Date.now(), sourceFile }
  const history = loadHistory()
  history.unshift(entry)
  saveHistory(history)
  return entry
}

export function clearHistory(): void {
  localStorage.setItem(HISTORY_KEY, '[]')
}

export function loadFavorites(): FavoriteEntry[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
  } catch { return [] }
}

export function saveFavorites(favorites: FavoriteEntry[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function loadLists(): FavoriteList[] {
  try {
    const stored = JSON.parse(localStorage.getItem(LISTS_KEY) ?? '[]')
    if (stored.length === 0) {
      const def = [{ id: 'default', name: 'Favoriten', order: 0 }]
      localStorage.setItem(LISTS_KEY, JSON.stringify(def))
      return def
    }
    return stored
  } catch {
    return [{ id: 'default', name: 'Favoriten', order: 0 }]
  }
}

export function saveLists(lists: FavoriteList[]): void {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
}

export function exportFavoritesToCsv(favorites: FavoriteEntry[], lists: FavoriteList[]): string {
  const listMap = Object.fromEntries(lists.map(l => [l.id, l.name]))
  const rows = [['Liste', 'Name (DE)', 'Name (EN)', 'HEX', 'R', 'G', 'B', 'H', 'S', 'L', 'Helligkeit']]
  for (const f of favorites) {
    rows.push([
      listMap[f.listId] ?? f.listId,
      f.nameDe, f.nameEn, f.hex,
      String(f.rgb.r), String(f.rgb.g), String(f.rgb.b),
      String(f.hsl.h), String(f.hsl.s), String(f.hsl.l),
      f.brightnessDe,
    ])
  }
  return rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n')
}

export function importFavoritesFromCsv(csv: string, lists: FavoriteList[]): FavoriteEntry[] {
  const lines = csv.trim().split('\n').slice(1)
  const listMap = Object.fromEntries(lists.map(l => [l.name, l.id]))
  const entries: FavoriteEntry[] = []

  for (const line of lines) {
    const cols = line.split(',').map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'))
    if (cols.length < 11) continue
    const [listName, nameDe, nameEn, hex, r, g, b, h, s, l, brightnessDe] = cols
    entries.push({
      id: crypto.randomUUID(),
      savedAt: Date.now(),
      listId: listMap[listName] ?? 'default',
      hex,
      nameDe, nameEn,
      rgb: { r: +r, g: +g, b: +b },
      hsl: { h: +h, s: +s, l: +l },
      brightness: brightnessDe,
      brightnessDe,
      brightnessDeSpeech: brightnessDe,
      descriptionDe: '',
    })
  }
  return entries
}
