import { useState, useCallback } from 'react'
import { Eye, Palette, Clock, Heart, Info } from 'lucide-react'
import UploadScreen from './components/UploadScreen'
import ImageCanvas from './components/ImageCanvas'
import ColorCard from './components/ColorCard'
import HistoryTab from './components/HistoryTab'
import FavoritesTab from './components/FavoritesTab'
import LegalModal from './components/LegalModal'
import type { PickedColor } from './lib/colors'
import { speakColor } from './lib/tts'
import {
  type HistoryEntry, type FavoriteEntry, type FavoriteList,
  loadHistory, saveHistory as _saveHistory, addToHistory, clearHistory,
  loadFavorites, saveFavorites,
  loadLists, saveLists,
  importFavoritesFromCsv,
} from './lib/storage'

type Tab = 'picker' | 'history' | 'favorites'
type LegalPage = 'impressum' | 'datenschutz' | null

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
  const [addToFavListOpen, setAddToFavListOpen] = useState(false)
  void _saveHistory

  const handleImageLoaded = (url: string) => {
    setImageUrl(url)
    setPickedColor(null)
    setPickedPoint(null)
  }

  const handleColorPicked = useCallback((color: PickedColor, x: number, y: number) => {
    setPickedColor(color)
    setPickedPoint({ x, y })
    addToHistory(color)
    setHistory(loadHistory())
    if (autoSpeak) speakColor(color)
  }, [autoSpeak])

  const handleNewImage = () => {
    setImageUrl(null)
    setPickedColor(null)
    setPickedPoint(null)
  }

  const isFavorite = useCallback((historyId: string) => {
    const entry = history.find(h => h.id === historyId)
    if (!entry) return false
    return favorites.some(f => f.hex === entry.hex && f.nameDe === entry.nameDe)
  }, [favorites, history])

  const isPickedColorFavorite = pickedColor
    ? favorites.some(f => f.hex === pickedColor.hex && f.nameDe === pickedColor.nameDe)
    : false

  const addFavoriteColor = useCallback((color: PickedColor, listId = lists[0]?.id ?? 'default') => {
    const entry: FavoriteEntry = {
      ...color,
      id: crypto.randomUUID(),
      savedAt: Date.now(),
      listId,
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
      setAddToFavListOpen(true)
    } else {
      addFavoriteColor(pickedColor)
    }
  }

  const handleFavoriteFromHistory = (entry: HistoryEntry) => {
    const alreadyFav = favorites.some(f => f.hex === entry.hex && f.nameDe === entry.nameDe)
    if (alreadyFav) removeFavoriteByHex(entry.hex, entry.nameDe)
    else addFavoriteColor(entry)
  }

  const handleSaveAllHistory = () => {
    for (const entry of history) {
      const alreadyFav = favorites.some(f => f.hex === entry.hex && f.nameDe === entry.nameDe)
      if (!alreadyFav) addFavoriteColor(entry)
    }
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  const handleAddList = (name: string) => {
    const newList: FavoriteList = { id: crypto.randomUUID(), name, order: lists.length }
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

  const handleImportFavorites = (file: File) => {
    file.text().then(csv => {
      const imported = importFavoritesFromCsv(csv, lists)
      const updated = [...favorites, ...imported]
      saveFavorites(updated)
      setFavorites(updated)
    })
  }

  const historyBadge = history.length > 0 ? history.length : null

  const tabs: { id: Tab; label: string; Icon: typeof Palette }[] = [
    { id: 'picker', label: 'Farbpicker', Icon: Palette },
    { id: 'history', label: 'Verlauf', Icon: Clock },
    { id: 'favorites', label: 'Favoriten', Icon: Heart },
  ]

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
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
            <div className="flex flex-col h-full">
              <div className="flex-1 min-h-0">
                <ImageCanvas
                  imageUrl={imageUrl}
                  onColorPicked={handleColorPicked}
                  onNewImage={handleNewImage}
                  pickedPoint={pickedPoint}
                />
              </div>
              <div className="flex justify-center py-1.5 bg-card border-t border-border shrink-0">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-8 h-1 rounded-full bg-border" />)}
                </div>
              </div>
              <div className="shrink-0 overflow-y-auto bg-card" style={{ minHeight: pickedColor ? '180px' : '80px', maxHeight: '45vh' }}>
                {pickedColor ? (
                  <ColorCard
                    color={pickedColor}
                    isFavorite={isPickedColorFavorite}
                    onToggleFavorite={handleTogglePickedFavorite}
                    autoSpeak={autoSpeak}
                    onToggleAutoSpeak={() => setAutoSpeak(v => !v)}
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
            onImport={handleImportFavorites}
          />
        </div>
      </main>

      {/* Add to list modal */}
      {addToFavListOpen && pickedColor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAddToFavListOpen(false)} />
          <div className="relative z-10 w-full sm:max-w-sm bg-card rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-base text-foreground">In Liste speichern</h2>
            </div>
            <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => { addFavoriteColor(pickedColor, list.id); setAddToFavListOpen(false) }}
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

      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
    </div>
  )
}
