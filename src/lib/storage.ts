import type { PickedColor } from './colors'

function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return uuid()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

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
  const entry: HistoryEntry = { ...color, id: uuid(), timestamp: Date.now(), sourceFile }
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

/** Parses a single CSV line respecting RFC 4180 quoted fields. */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"') {
      let field = ''
      i++
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { field += '"'; i += 2 }
        else if (line[i] === '"') { i++; break }
        else { field += line[i++] }
      }
      fields.push(field)
      if (line[i] === ',') i++
    } else {
      const end = line.indexOf(',', i)
      if (end === -1) { fields.push(line.slice(i)); break }
      fields.push(line.slice(i, end))
      i = end + 1
    }
  }
  return fields
}

const CSV_HEADER = ['Liste', 'Eigener Name', 'Name (DE)', 'Name (EN)', 'HEX', 'R', 'G', 'B', 'H', 'S', 'L', 'Helligkeit', 'Quelldatei']

export function exportFavoritesToCsv(favorites: FavoriteEntry[], lists: FavoriteList[]): string {
  const listMap = Object.fromEntries(lists.map(l => [l.id, l.name]))
  const q = (v: string) => `"${v.replace(/"/g, '""')}"`
  const rows = [CSV_HEADER.map(q).join(',')]
  for (const f of favorites) {
    rows.push([
      listMap[f.listId] ?? f.listId,
      f.customLabel ?? '',
      f.nameDe,
      f.nameEn,
      f.hex,
      String(f.rgb.r), String(f.rgb.g), String(f.rgb.b),
      String(f.hsl.h), String(f.hsl.s), String(f.hsl.l),
      f.brightnessDe,
      f.sourceFile ?? '',
    ].map(q).join(','))
  }
  return rows.join('\n')
}

export function importFavoritesFromCsv(csv: string, lists: FavoriteList[]): FavoriteEntry[] {
  const rawLines = csv.trim().split(/\r?\n/)
  if (rawLines.length < 2) return []

  const listMap = Object.fromEntries(lists.map(l => [l.name, l.id]))
  const entries: FavoriteEntry[] = []

  const header = parseCsvLine(rawLines[0])
  const col = (name: string) => header.indexOf(name)

  const iListe = col('Liste')
  const iEigenerName = col('Eigener Name')
  const iNameDe = col('Name (DE)')
  const iNameEn = col('Name (EN)')
  const iHex = col('HEX')
  const iR = col('R'), iG = col('G'), iB = col('B')
  const iH = col('H'), iS = col('S'), iL = col('L')
  const iHelligkeit = col('Helligkeit')
  const iQuelldatei = col('Quelldatei')

  if (iHex === -1 || iR === -1) return []

  for (const line of rawLines.slice(1)) {
    if (!line.trim()) continue
    const c = parseCsvLine(line)
    const hex = c[iHex] ?? ''
    if (!hex) continue

    const r = parseInt(c[iR] ?? '0', 10)
    const g = parseInt(c[iG] ?? '0', 10)
    const b = parseInt(c[iB] ?? '0', 10)
    const h = parseFloat(c[iH] ?? '0')
    const s = parseFloat(c[iS] ?? '0')
    const l = parseFloat(c[iL] ?? '0')
    if (isNaN(r) || isNaN(g) || isNaN(b)) continue

    const nameDe = (iNameDe >= 0 && c[iNameDe]) ? c[iNameDe] : ''
    const nameEn = (iNameEn >= 0 && c[iNameEn]) ? c[iNameEn] : ''
    const brightnessDe = (iHelligkeit >= 0 && c[iHelligkeit]) ? c[iHelligkeit] : ''
    const listName = iListe >= 0 ? (c[iListe] ?? '') : ''
    const customLabel = iEigenerName >= 0 ? (c[iEigenerName] || undefined) : undefined
    const sourceFile = iQuelldatei >= 0 ? (c[iQuelldatei] || undefined) : undefined

    entries.push({
      hex,
      rgb: { r, g, b },
      hsl: { h, s, l },
      nameDe,
      nameEn,
      brightness: brightnessDe,
      brightnessDe,
      brightnessDeSpeech: brightnessDe,
      descriptionDe: '',
      id: uuid(),
      savedAt: Date.now(),
      listId: listMap[listName] ?? lists[0]?.id ?? 'default',
      customLabel,
      sourceFile,
    })
  }
  return entries
}
