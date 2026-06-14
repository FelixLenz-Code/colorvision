import { useState, useRef } from 'react'
import { Plus, Upload, Trash2, Edit2, Check, X, Volume2, Heart } from 'lucide-react'
import type { FavoriteEntry, FavoriteList } from '../lib/storage'
import { exportFavoritesToCsv } from '../lib/storage'
import { speakColor } from '../lib/tts'

interface Props {
  favorites: FavoriteEntry[]
  lists: FavoriteList[]
  onAddList: (name: string) => void
  onRenameList: (id: string, name: string) => void
  onDeleteList: (id: string) => void
  onRemoveFavorite: (id: string) => void
  onImport: (file: File) => void
}

export default function FavoritesTab({ favorites, lists, onAddList, onRenameList, onDeleteList, onRemoveFavorite, onImport }: Props) {
  const [activeListId, setActiveListId] = useState<string>(lists[0]?.id ?? 'default')
  const [creatingList, setCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [listMenuId, setListMenuId] = useState<string | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const activeList = lists.find(l => l.id === activeListId) ?? lists[0]
  const activeFavorites = favorites.filter(f => f.listId === (activeList?.id ?? 'default'))

  const handleCreateList = () => {
    const name = newListName.trim()
    if (!name) return
    onAddList(name)
    setNewListName('')
    setCreatingList(false)
  }

  const handleExport = () => {
    const csv = exportFavoritesToCsv(favorites, lists)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'colorvision-favoriten.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onImport(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <h2 className="font-semibold text-foreground">Favoriten</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => importRef.current?.click()}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1.5 rounded-lg hover:bg-muted/60"
            title="Favoriten importieren (.csv)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Importieren</span>
          </button>
          {favorites.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium px-2 py-1.5 rounded-lg hover:bg-muted/60"
              title="Favoriten exportieren (.csv)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 3v12"/><path d="m17 8-5 5-5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>
              <span className="hidden sm:inline">Exportieren</span>
            </button>
          )}
        </div>
      </div>

      <input
        ref={importRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* List tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
        {lists.map(list => (
          <div key={list.id} className="relative shrink-0">
            <button
              onClick={() => setActiveListId(list.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all pr-7 ${
                activeListId === list.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {renamingId === list.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { onRenameList(list.id, renameValue); setRenamingId(null) }
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                  onClick={e => e.stopPropagation()}
                  className="bg-transparent outline-none w-20 text-sm"
                />
              ) : list.name}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setListMenuId(listMenuId === list.id ? null : list.id) }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted-foreground/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-muted-foreground"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
            {listMenuId === list.id && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[120px] overflow-hidden">
                <button
                  onClick={() => { setRenamingId(list.id); setRenameValue(list.name); setListMenuId(null) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Umbenennen
                </button>
                {lists.length > 1 && (
                  <button
                    onClick={() => { onDeleteList(list.id); setListMenuId(null); setActiveListId(lists.find(l => l.id !== list.id)?.id ?? 'default') }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Löschen
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {creatingList ? (
          <div className="flex items-center gap-1 shrink-0">
            <input
              autoFocus
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreateList(); if (e.key === 'Escape') { setCreatingList(false); setNewListName('') } }}
              placeholder="Listenname …"
              className="bg-background/60 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/40 w-28"
            />
            <button onClick={handleCreateList} disabled={!newListName.trim()} className="p-1 rounded-lg bg-primary text-primary-foreground disabled:opacity-40">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { setCreatingList(false); setNewListName('') }} className="p-1 rounded-lg hover:bg-muted">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreatingList(true)}
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors"
            title="Neue Liste erstellen"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Favorites list */}
      {activeFavorites.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-rose-300" />
            </div>
            <p className="font-medium text-foreground mb-1">Noch keine Favoriten</p>
            <p className="text-muted-foreground text-sm">
              Tippe im Farbpicker auf das Herz-Symbol, um eine Farbe in „{activeList?.name}" zu speichern
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {activeFavorites.map(entry => (
            <div key={entry.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors border-b border-border/50">
              <div className="w-10 h-10 rounded-xl shrink-0 shadow-sm" style={{ backgroundColor: entry.hex }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground text-sm">{entry.nameDe}</span>
                  <span className="text-xs text-muted-foreground">{entry.nameEn}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{entry.hex}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => speakColor(entry)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                </button>
                <button onClick={() => onRemoveFavorite(entry.id)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Close list menu on outside click */}
      {listMenuId && (
        <div className="fixed inset-0 z-10" onClick={() => setListMenuId(null)} />
      )}
    </div>
  )
}
