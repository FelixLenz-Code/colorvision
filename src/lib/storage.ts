import type { PickedColor } from './colors'

function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
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
  pinned?: boolean
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

function htmlEsc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function hexContrast(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#1a1a2e' : '#ffffff'
}

export function exportFavoritesToHtml(favorites: FavoriteEntry[], listName: string): string {
  const date = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const cards = favorites.map(f => {
    const tc = hexContrast(f.hex)
    const label = f.customLabel ? `<div class="label">${htmlEsc(f.customLabel)}</div>` : ''
    return `  <div class="card" style="background:${f.hex};color:${tc}">\n    ${label}<div class="name-de">${htmlEsc(f.nameDe)}</div>\n    <div class="name-en">${htmlEsc(f.nameEn)}</div>\n    <div class="hex">${htmlEsc(f.hex)}</div>\n    <div class="rgb">RGB ${f.rgb.r}, ${f.rgb.g}, ${f.rgb.b}</div>\n  </div>`
  }).join('\n')
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ColorVision – ${htmlEsc(listName)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#f4f4f8;color:#1a1a2e;padding:28px}
h1{font-size:1.4rem;margin-bottom:4px}
.meta{font-size:.8rem;color:#888;margin-bottom:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
.card{border-radius:16px;padding:16px;min-height:128px;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;box-shadow:0 2px 10px rgba(0,0,0,.12)}
.label{font-size:.65rem;font-weight:700;opacity:.85;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}
.name-de{font-size:1rem;font-weight:700;line-height:1.2}
.name-en{font-size:.75rem;opacity:.72}
.hex{font-family:monospace;font-size:.8rem;font-weight:600;margin-top:6px}
.rgb{font-family:monospace;font-size:.68rem;opacity:.72}
.print-btn{display:inline-flex;align-items:center;gap:6px;margin-bottom:20px;padding:8px 18px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:.85rem;font-weight:600;cursor:pointer}
@media print{body{background:#fff;padding:12px}.print-btn{display:none}}
</style>
</head>
<body>
<button class="print-btn" onclick="window.print()">Drucken / Als PDF speichern</button>
<h1>ColorVision – ${htmlEsc(listName)}</h1>
<p class="meta">Exportiert am ${date} &middot; ${favorites.length} Farbe${favorites.length !== 1 ? 'n' : ''}</p>
<div class="grid">
${cards}
</div>
</body>
</html>`
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
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) continue

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
