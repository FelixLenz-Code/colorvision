import { useState, useCallback, useEffect, useRef } from 'react'
import { Eye, Palette, Clock, Heart, Info, Volume2, X } from 'lucide-react'
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
import { speakColor, preloadVoices } from './lib/tts'
import {
  type HistoryEntry, type FavoriteEntry, type FavoriteList,
  loadHistory, saveHistory, addToHistory, clearHistory,
  loadFavorites, saveFavorites,
  loadLists, saveLists,
  importFavoritesFromCsv,
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
  const autoSpeakRef = useRef(false)
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
  const [ttsWarning, setTtsWarning] = useState(false)

  useEffect(() => { preloadVoices() }, [])
  useEffect(() => { autoSpeakRef.current = autoSpeak }, [autoSpeak])
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
  }

  const handleColorPicked = useCallback((color: PickedColor, x: number, y: number) => {
    setPickedColor(color)
    setPickedPoint({ x, y })
    addToHistory(color, imageFileName)
    setHistory(loadHistory())
    setSheetSnap('mid')
    if (autoSpeakRef.current) speakColor(color)
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
            Kein Ton? Vorlesen funktioniert auf Linux am besten in <span className="font-semibold text-primary">Firefox</span>.
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

        <div className="relative shrink-0">
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
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
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
                />
              </div>

              {/* Portrait: bottom snap sheet */}
              <div className="portrait:block landscape:hidden shrink-0">
                <SnapSheet snap={sheetSnap} onSnapChange={setSheetSnap} peekH={72}>
                  {pickedColor ? (
                    <ColorCard
                      color={pickedColor}
                      isFavorite={isPickedColorFavorite}
                      onToggleFavorite={handleTogglePickedFavorite}
                      autoSpeak={autoSpeak}
                      onToggleAutoSpeak={() => setAutoSpeak(v => !v)}
                      customLabel={pickedCustomLabel}
                    />
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
                    <ColorCard
                      color={pickedColor}
                      isFavorite={isPickedColorFavorite}
                      onToggleFavorite={handleTogglePickedFavorite}
                      autoSpeak={autoSpeak}
                      onToggleAutoSpeak={() => setAutoSpeak(v => !v)}
                      customLabel={pickedCustomLabel}
                    />
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
            onOpenDetail={handleOpenDetailFromHistory}
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
