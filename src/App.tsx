import { useState, useCallback, useEffect, useRef } from 'react'
import { Eye, Palette, Clock, Heart, Info, Volume2, X, Sun, Moon, ChevronLeft, ChevronDown, Plus, Check } from 'lucide-react'
import UploadScreen from './components/UploadScreen'
import ImageCanvas from './components/ImageCanvas'
import ColorCard from './components/ColorCard'
import HistoryTab from './components/HistoryTab'
import FavoritesTab from './components/FavoritesTab'
import LegalModal from './components/LegalModal'
import SnapSheet from './components/SnapSheet'
import SideSheet from './components/SideSheet'
import ColorDetailSheet, { type ColorDetail } from './components/ColorDetailSheet'
import type { PickedColor } from './lib/colors'
import { preloadVoices } from './lib/tts'
import {
  type HistoryEntry, type FavoriteEntry, type FavoriteList,
  loadHistory, saveHistory, addToHistory, clearHistory,
  loadFavorites, saveFavorites,
  loadLists, saveLists,
  importFavoritesFromCsv,
  exportFavoritesToCsv, exportFavoritesToHtml, exportFavoritesToPng,
} from './lib/storage'

function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

type Tab = 'picker' | 'history' | 'favorites'
type LegalPage = 'impressum' | 'datenschutz' | null
type SnapPos = 'peek' | 'mid' | 'full'

export default function App() {
  const [tab, setTab] = useState<Tab>('picker')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pickedColor, setPickedColor] = useState<PickedColor | null>(null)
  const [pickedPoint, setPickedPoint] = useState<{ x: number; y: number } | null>(null)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [favorites, setFavorites] = useState<FavoriteEntry[]>(() => loadFavorites())
  const [lists, setLists] = useState<FavoriteList[]>(() => loadLists())
  const [legalPage, setLegalPage] = useState<LegalPage>(null)
  const [legalMenuOpen, setLegalMenuOpen] = useState(false)
  const [pendingFavEntry, setPendingFavEntry] = useState<{ color: PickedColor; sourceFile?: string } | null>(null)
  const [sheetSnap, setSheetSnap] = useState<SnapPos>('peek')
  const [sideSnap, setSideSnap] = useState<'narrow' | 'mid' | 'wide'>('mid')
  const [detail, setDetail] = useState<{ color: ColorDetail; sourceId: string; source: 'history' | 'favorites' } | null>(null)
  const [imageFileName, setImageFileName] = useState<string | undefined>(undefined)
  const [dominantColors, setDominantColors] = useState<PickedColor[]>([])
  const [dominantExportOpen, setDominantExportOpen] = useState(false)
  const [pendingDominantAdd, setPendingDominantAdd] = useState(false)
  const [dominantNewListName, setDominantNewListName] = useState('')
  const [dominantCreatingList, setDominantCreatingList] = useState(false)
  const [ttsWarning, setTtsWarning] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => { preloadVoices() }, [])
  useEffect(() => {
    const handler = () => setTtsWarning(true)
    window.addEventListener('tts-silent-fail', handler)
    return () => window.removeEventListener('tts-silent-fail', handler)
  }, [])

  const handleImageLoaded = (url: string, fileName?: string) => {
    setImageUrl(url)
    setPickedColor(null)
    setPickedPoint(null)
    setSheetSnap('peek')
    setImageFileName(fileName)
    setDominantColors([])
  }

  const handlePickDominantColor = useCallback((color: PickedColor) => {
    setPickedColor(color)
    addToHistory(color, imageFileName)
    setHistory(loadHistory())
    setSheetSnap('mid')
    setPickedPoint(null)
  }, [imageFileName])

  const handleAddDominantToFavorites = useCallback((listId?: string) => {
    const targetId = listId ?? lists[0]?.id ?? 'default'
    const seen = new Set<string>(favorites.map(f => `${f.hex}|${f.nameDe}`))
    const newEntries: FavoriteEntry[] = []
    for (const color of dominantColors) {
      const key = `${color.hex}|${color.nameDe}`
      if (seen.has(key)) continue
      seen.add(key)
      newEntries.push({ ...color, id: uuid(), savedAt: Date.now(), listId: targetId })
    }
    if (newEntries.length === 0) return
    const updated = [...favorites, ...newEntries]
    saveFavorites(updated)
    setFavorites(updated)
  }, [dominantColors, favorites, lists])

  const handleExportDominant = (format: 'csv' | 'html' | 'png') => {
    setDominantExportOpen(false)
    const dummyList = [{ id: 'default', name: 'Dominante Farben', order: 0 }]
    const entries: FavoriteEntry[] = dominantColors.map((c, i) => ({
      ...c, id: `d${i}`, savedAt: Date.now(), listId: 'default',
    }))
    const meta = {
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      sourceFile: imageFileName,
    }
    if (format === 'csv') {
      const csv = exportFavoritesToCsv(entries, dummyList)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'colorvision-dominante-farben.csv'
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    } else if (format === 'html') {
      const html = exportFavoritesToHtml(entries, 'Dominante Farben', meta)
      if (window.electronAPI?.printToPdf) {
        window.electronAPI.printToPdf(html, 'colorvision-dominante-farben.pdf')
      } else {
        const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      }
    } else {
      const dataUrl = exportFavoritesToPng(entries, 'Dominante Farben', meta)
      const a = document.createElement('a'); a.href = dataUrl; a.download = 'colorvision-dominante-farben.png'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
    }
  }

  const handleColorPicked = useCallback((color: PickedColor, x: number, y: number) => {
    setPickedColor(color)
    setPickedPoint({ x, y })
    addToHistory(color, imageFileName)
    setHistory(loadHistory())
    setSheetSnap('mid')
  }, [imageFileName])

  const handleNewImage = () => {
    setImageUrl(null)
    setPickedColor(null)
    setPickedPoint(null)
    setSheetSnap('peek')
  }

  const isFavorite = useCallback((historyId: string) => {
    const entry = history.find(h => h.id === historyId)
    if (!entry) return false
    return favorites.some(f => f.hex === entry.hex && f.nameDe === entry.nameDe)
  }, [favorites, history])

  const matchingFavorite = pickedColor
    ? favorites.find(f => f.hex === pickedColor.hex && f.nameDe === pickedColor.nameDe)
    : undefined

  const isPickedColorFavorite = !!matchingFavorite
  const pickedCustomLabel = matchingFavorite?.customLabel

  const addFavoriteColor = useCallback((color: PickedColor, listId = lists[0]?.id ?? 'default', sourceFile?: string) => {
    if (favorites.some(f => f.hex === color.hex && f.nameDe === color.nameDe)) return
    const entry: FavoriteEntry = {
      ...color,
      id: uuid(),
      savedAt: Date.now(),
      listId,
      sourceFile: (color as FavoriteEntry).sourceFile ?? sourceFile,
    }
    const updated = [...favorites, entry]
    saveFavorites(updated)
    setFavorites(updated)
  }, [favorites, lists])

  const removeFavoriteByHex = (hex: string, nameDe: string) => {
    const updated = favorites.filter(f => !(f.hex === hex && f.nameDe === nameDe))
    saveFavorites(updated)
    setFavorites(updated)
  }

  const handleTogglePickedFavorite = () => {
    if (!pickedColor) return
    if (isPickedColorFavorite) {
      removeFavoriteByHex(pickedColor.hex, pickedColor.nameDe)
    } else if (lists.length > 1) {
      setPendingFavEntry({ color: pickedColor, sourceFile: imageFileName })
    } else {
      addFavoriteColor(pickedColor, undefined, imageFileName)
    }
  }

  const handleFavoriteFromHistory = (entry: HistoryEntry) => {
    if (isFavorite(entry.id)) {
      removeFavoriteByHex(entry.hex, entry.nameDe)
    } else if (lists.length > 1) {
      setPendingFavEntry({ color: entry, sourceFile: entry.sourceFile })
    } else {
      addFavoriteColor(entry, undefined, entry.sourceFile)
    }
  }

  const handleSaveAllHistory = () => {
    const seen = new Set<string>(favorites.map(f => `${f.hex}|${f.nameDe}`))
    const newEntries: FavoriteEntry[] = []
    for (const entry of history) {
      const key = `${entry.hex}|${entry.nameDe}`
      if (seen.has(key)) continue
      seen.add(key)
      newEntries.push({
        ...entry,
        id: uuid(),
        savedAt: Date.now(),
        listId: lists[0]?.id ?? 'default',
      })
    }
    if (newEntries.length === 0) return
    const updated = [...favorites, ...newEntries]
    saveFavorites(updated)
    setFavorites(updated)
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  const handleAddList = (name: string) => {
    const newList: FavoriteList = { id: uuid(), name, order: lists.length }
    const updated = [...lists, newList]
    saveLists(updated)
    setLists(updated)
  }

  const handleRenameList = (id: string, name: string) => {
    const updated = lists.map(l => l.id === id ? { ...l, name } : l)
    saveLists(updated)
    setLists(updated)
  }

  const handleDeleteList = (id: string) => {
    const updatedLists = lists.filter(l => l.id !== id)
    saveLists(updatedLists)
    setLists(updatedLists)
    const updatedFavs = favorites.filter(f => f.listId !== id)
    saveFavorites(updatedFavs)
    setFavorites(updatedFavs)
  }

  const handleRemoveFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id)
    saveFavorites(updated)
    setFavorites(updated)
  }

  const handleReorderLists = (reordered: FavoriteList[]) => {
    saveLists(reordered)
    setLists(reordered)
  }

  const applyImportedCsv = (csv: string, targetListId: string) => {
    const imported = importFavoritesFromCsv(csv, lists).map(e => ({ ...e, listId: targetListId }))
    if (imported.length === 0) return
    const updated = [...favorites, ...imported]
    saveFavorites(updated)
    setFavorites(updated)
    setTab('favorites')
  }

  const handleImportFavorites = (file: File, targetListId: string) => {
    file.text().then(csv => applyImportedCsv(csv, targetListId))
      .catch(err => console.error('Import fehlgeschlagen:', err))
  }

  const handleImportFavoritesCsv = (csv: string, targetListId: string) => {
    applyImportedCsv(csv, targetListId)
  }

  const handleRemoveHistoryEntry = (id: string) => {
    const updated = history.filter(h => h.id !== id)
    saveHistory(updated)
    setHistory(updated)
  }

  const handlePinHistoryEntry = (id: string) => {
    const updated = history.map(h => h.id === id ? { ...h, pinned: !h.pinned } : h)
    saveHistory(updated)
    setHistory(updated)
  }

  const handleOpenDetailFromHistory = (entry: HistoryEntry) => {
    setDetail({ color: entry, sourceId: entry.id, source: 'history' })
  }

  const handleOpenDetailFromFavorites = (entry: FavoriteEntry) => {
    setDetail({ color: { ...entry, timestamp: entry.savedAt, customLabel: entry.customLabel }, sourceId: entry.id, source: 'favorites' })
  }

  const detailIsFavorite = detail
    ? favorites.some(f => f.hex === detail.color.hex && f.nameDe === detail.color.nameDe)
    : false

  const handleDetailToggleFavorite = () => {
    if (!detail) return
    if (detailIsFavorite) removeFavoriteByHex(detail.color.hex, detail.color.nameDe)
    else addFavoriteColor(detail.color)
  }

  const handleDetailDelete = () => {
    if (!detail) return
    if (detail.source === 'history') handleRemoveHistoryEntry(detail.sourceId)
    else handleRemoveFavorite(detail.sourceId)
    setDetail(null)
  }

  const handleSaveCustomLabel = (label: string) => {
    if (!detail || detail.source !== 'favorites') return
    const updated = favorites.map(f => f.id === detail.sourceId ? { ...f, customLabel: label || undefined } : f)
    saveFavorites(updated)
    setFavorites(updated)
    setDetail(prev => prev ? { ...prev, color: { ...prev.color, customLabel: label || undefined } } : null)
  }

  // Close detail if the entry no longer exists (e.g. cleared history)
  useEffect(() => {
    if (!detail) return
    if (detail.source === 'history' && !history.find(h => h.id === detail.sourceId)) setDetail(null)
    if (detail.source === 'favorites' && !favorites.find(f => f.id === detail.sourceId)) setDetail(null)
  }, [history, favorites])

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const tabOrder: Tab[] = ['picker', 'history', 'favorites']

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.3) return
    const idx = tabOrder.indexOf(tab)
    if (dx < 0 && idx < tabOrder.length - 1) setTab(tabOrder[idx + 1])
    if (dx > 0 && idx > 0) setTab(tabOrder[idx - 1])
  }

  const historyBadge = history.length > 0 ? history.length : null
  const favoritesBadge = favorites.length > 0 ? favorites.length : null

  const tabs: { id: Tab; label: string; Icon: typeof Palette }[] = [
    { id: 'picker', label: 'Farbpicker', Icon: Palette },
    { id: 'history', label: 'Verlauf', Icon: Clock },
    { id: 'favorites', label: 'Favoriten', Icon: Heart },
  ]

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {ttsWarning && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-card border-b border-border shrink-0">
          <Volume2 className="w-4 h-4 text-primary shrink-0" aria-hidden />
          <p className="flex-1 text-sm text-foreground">
            Kein Ton? Vorlesen funktioniert am besten in <span className="font-semibold text-primary">Firefox</span>.
          </p>
          <button
            onClick={() => setTtsWarning(false)}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Schließen"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      )}
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
            <Eye className="w-4 h-4 text-white" aria-hidden />
          </div>
          <div className="hidden xs:block">
            <h1 className="font-bold text-foreground text-base leading-none">ColorVision</h1>
            <p className="text-muted-foreground text-[10px] leading-none mt-0.5">Farberkennung</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 px-2 py-2 sm:px-3 sm:py-1.5 text-xs ${
                tab === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid={`tab-${id}`}
              title={label}
            >
              <Icon className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
              {id === 'history' && historyBadge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                  {historyBadge > 9 ? '9+' : historyBadge}
                </span>
              )}
              {id === 'favorites' && favoritesBadge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-rose-500 text-white rounded-full">
                  {favoritesBadge > 9 ? '9+' : favoritesBadge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setDark(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            title={dark ? 'Helles Design' : 'Dunkles Design'}
            aria-label={dark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
          >
            {dark ? <Sun className="w-4 h-4 text-muted-foreground" aria-hidden /> : <Moon className="w-4 h-4 text-muted-foreground" aria-hidden />}
          </button>

          <div className="relative">
          <button
            onClick={() => setLegalMenuOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            title="Rechtliches"
            aria-label="Rechtliches"
          >
            <Info className="w-4 h-4 text-muted-foreground" aria-hidden />
          </button>
          {legalMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setLegalMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-40">
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors" onClick={() => { setLegalPage('impressum'); setLegalMenuOpen(false) }}>Impressum</button>
                <div className="h-px bg-border mx-3" />
                <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors" onClick={() => { setLegalPage('datenschutz'); setLegalMenuOpen(false) }}>Datenschutz</button>
              </div>
            </>
          )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className="flex-1 overflow-hidden"
        onTouchStart={tab !== 'picker' || !imageUrl ? handleTouchStart : undefined}
        onTouchEnd={tab !== 'picker' || !imageUrl ? handleTouchEnd : undefined}
      >
        {/* Picker tab */}
        <div className="flex flex-col h-full" style={{ display: tab === 'picker' ? 'flex' : 'none' }}>
          {!imageUrl ? (
            <UploadScreen onImageLoaded={handleImageLoaded} />
          ) : (
            <div className="flex flex-col landscape:flex-row h-full">
              <div className="flex-1 min-h-0 min-w-0">
                <ImageCanvas
                  imageUrl={imageUrl}
                  onColorPicked={handleColorPicked}
                  onNewImage={handleNewImage}
                  pickedPoint={pickedPoint}
                  onDominantColors={setDominantColors}
                />
              </div>

              {/* Portrait: bottom snap sheet */}
              <div className="portrait:block landscape:hidden shrink-0">
                <SnapSheet snap={sheetSnap} onSnapChange={setSheetSnap} peekH={72}>
                  {pickedColor ? (
                    <div className="flex flex-col h-full">
                      {dominantColors.length > 0 && (
                        <button
                          onClick={() => { setPickedColor(null); setPickedPoint(null) }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/50 shrink-0"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Farbpalette
                        </button>
                      )}
                      <div className="flex-1 min-h-0">
                        <ColorCard
                          color={pickedColor}
                          isFavorite={isPickedColorFavorite}
                          onToggleFavorite={handleTogglePickedFavorite}
                          autoSpeak={autoSpeak}
                          onToggleAutoSpeak={() => setAutoSpeak(v => !v)}
                          customLabel={pickedCustomLabel}
                        />
                      </div>
                    </div>
                  ) : dominantColors.length > 0 ? (
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Dominante Farben</p>
                      <div className="flex gap-2">
                        {dominantColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => handlePickDominantColor(color)}
                            className="flex-1 flex flex-col items-center gap-1 group"
                            title={color.nameDe}
                          >
                            <div className="w-full h-11 rounded-xl shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform" style={{ backgroundColor: color.hex }} />
                            <span className="text-[9px] text-muted-foreground leading-tight line-clamp-1 text-center">{color.nameDe}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => setPendingDominantAdd(true)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 transition-colors text-xs font-semibold"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          In Favoriten
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setDominantExportOpen(v => !v)}
                            className="flex items-center gap-1 py-2 px-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-xs text-muted-foreground font-medium"
                            title="Exportieren"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 3v12"/><path d="m17 8-5 5-5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {dominantExportOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setDominantExportOpen(false)} />
                              <div className="absolute bottom-full right-0 mb-1.5 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                                <button onClick={() => handleExportDominant('csv')} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">Als CSV</button>
                                <div className="h-px bg-border mx-3" />
                                <button onClick={() => handleExportDominant('html')} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">Als PDF drucken</button>
                                <div className="h-px bg-border mx-3" />
                                <button onClick={() => handleExportDominant('png')} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">Als PNG-Bild</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6 text-center">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>
                        </div>
                        <p className="text-sm text-muted-foreground">Tippe auf eine Stelle im Bild, um die Farbe zu analysieren</p>
                      </div>
                    </div>
                  )}
                </SnapSheet>
              </div>

              {/* Landscape: right side sheet */}
              <div className="portrait:hidden landscape:contents">
                <SideSheet snap={sideSnap} onSnapChange={setSideSnap}>
                  {pickedColor ? (
                    <div className="flex flex-col h-full">
                      {dominantColors.length > 0 && (
                        <button
                          onClick={() => { setPickedColor(null); setPickedPoint(null) }}
                          className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-b border-border/50 shrink-0"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Farbpalette
                        </button>
                      )}
                      <div className="flex-1 min-h-0">
                        <ColorCard
                          color={pickedColor}
                          isFavorite={isPickedColorFavorite}
                          onToggleFavorite={handleTogglePickedFavorite}
                          autoSpeak={autoSpeak}
                          onToggleAutoSpeak={() => setAutoSpeak(v => !v)}
                          customLabel={pickedCustomLabel}
                        />
                      </div>
                    </div>
                  ) : dominantColors.length > 0 ? (
                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Dominante Farben</p>
                      <div className="grid grid-cols-5 gap-2">
                        {dominantColors.map((color, i) => (
                          <button
                            key={i}
                            onClick={() => handlePickDominantColor(color)}
                            className="flex flex-col items-center gap-1.5 group"
                            title={color.nameDe}
                          >
                            <div className="w-full aspect-square rounded-xl shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform" style={{ backgroundColor: color.hex }} />
                            <span className="text-[9px] text-muted-foreground leading-tight line-clamp-1 text-center w-full">{color.nameDe}</span>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => setPendingDominantAdd(true)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 transition-colors text-xs font-semibold"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          In Favoriten
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setDominantExportOpen(v => !v)}
                            className="flex items-center gap-1 py-2 px-2.5 rounded-xl border border-border hover:bg-muted transition-colors text-xs text-muted-foreground font-medium"
                            title="Exportieren"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 3v12"/><path d="m17 8-5 5-5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {dominantExportOpen && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setDominantExportOpen(false)} />
                              <div className="absolute bottom-full right-0 mb-1.5 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                                <button onClick={() => handleExportDominant('csv')} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">Als CSV</button>
                                <div className="h-px bg-border mx-3" />
                                <button onClick={() => handleExportDominant('html')} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">Als PDF drucken</button>
                                <div className="h-px bg-border mx-3" />
                                <button onClick={() => handleExportDominant('png')} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left">Als PNG-Bild</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-6 text-center h-full">
                      <div>
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-muted-foreground"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>
                        </div>
                        <p className="text-sm text-muted-foreground">Tippe auf eine Stelle im Bild, um die Farbe zu analysieren</p>
                      </div>
                    </div>
                  )}
                </SideSheet>
              </div>
            </div>
          )}
        </div>

        {/* History tab */}
        <div className="h-full" style={{ display: tab === 'history' ? 'block' : 'none' }}>
          <HistoryTab
            history={history}
            onSaveAll={handleSaveAllHistory}
            onClearAll={handleClearHistory}
            onFavorite={handleFavoriteFromHistory}
            isFavorite={isFavorite}
            onRemove={handleRemoveHistoryEntry}
            onOpenDetail={handleOpenDetailFromHistory}
            onPinEntry={handlePinHistoryEntry}
          />
        </div>

        {/* Favorites tab */}
        <div className="h-full" style={{ display: tab === 'favorites' ? 'block' : 'none' }}>
          <FavoritesTab
            favorites={favorites}
            lists={lists}
            onAddList={handleAddList}
            onRenameList={handleRenameList}
            onDeleteList={handleDeleteList}
            onRemoveFavorite={handleRemoveFavorite}
            onReorderLists={handleReorderLists}
            onImport={handleImportFavorites}
            onImportCsv={handleImportFavoritesCsv}
            onOpenDetail={handleOpenDetailFromFavorites}
          />
        </div>
      </main>

      {/* Add to list modal */}
      {pendingFavEntry && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPendingFavEntry(null)} />
          <div className="relative z-10 w-full sm:max-w-sm bg-card rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-base text-foreground">In Liste speichern</h2>
            </div>
            <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => {
                    addFavoriteColor(pendingFavEntry.color, list.id, pendingFavEntry.sourceFile)
                    setPendingFavEntry(null)
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/60 transition-colors text-left"
                >
                  <span className="font-medium text-sm text-foreground">{list.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {favorites.filter(f => f.listId === list.id).length} Farben
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add dominant colors to list modal */}
      {pendingDominantAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setPendingDominantAdd(false); setDominantCreatingList(false); setDominantNewListName('') }} />
          <div className="relative z-10 w-full sm:max-w-sm bg-card rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-base text-foreground">In Liste speichern</h2>
              <span className="text-sm text-muted-foreground">{dominantColors.length} Farben</span>
            </div>
            <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => { handleAddDominantToFavorites(list.id); setPendingDominantAdd(false); setDominantCreatingList(false); setDominantNewListName('') }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/60 transition-colors text-left"
                >
                  <span className="font-medium text-sm text-foreground">{list.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {favorites.filter(f => f.listId === list.id).length} Farben
                  </span>
                </button>
              ))}
            </div>
            <div className="px-3 pb-3 border-t border-border pt-2">
              {dominantCreatingList ? (
                <div className="flex items-center gap-2 px-1 py-1">
                  <input
                    autoFocus
                    value={dominantNewListName}
                    onChange={e => setDominantNewListName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && dominantNewListName.trim()) {
                        const newList = { id: uuid(), name: dominantNewListName.trim(), order: lists.length }
                        const updatedLists = [...lists, newList]
                        saveLists(updatedLists)
                        setLists(updatedLists)
                        handleAddDominantToFavorites(newList.id)
                        setPendingDominantAdd(false)
                        setDominantCreatingList(false)
                        setDominantNewListName('')
                      }
                      if (e.key === 'Escape') { setDominantCreatingList(false); setDominantNewListName('') }
                    }}
                    placeholder="Listenname …"
                    className="flex-1 bg-muted/60 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    disabled={!dominantNewListName.trim()}
                    onClick={() => {
                      if (!dominantNewListName.trim()) return
                      const newList = { id: uuid(), name: dominantNewListName.trim(), order: lists.length }
                      const updatedLists = [...lists, newList]
                      saveLists(updatedLists)
                      setLists(updatedLists)
                      handleAddDominantToFavorites(newList.id)
                      setPendingDominantAdd(false)
                      setDominantCreatingList(false)
                      setDominantNewListName('')
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setDominantCreatingList(false); setDominantNewListName('') }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted shrink-0"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDominantCreatingList(true)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left text-primary text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Neue Liste erstellen
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Color detail sheet */}
      {detail && (
        <ColorDetailSheet
          color={detail.color}
          isFavorite={detailIsFavorite}
          onToggleFavorite={handleDetailToggleFavorite}
          onDelete={handleDetailDelete}
          onClose={() => setDetail(null)}
          onSaveCustomLabel={detail.source === 'favorites' ? handleSaveCustomLabel : undefined}
        />
      )}

      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
    </div>
  )
}
