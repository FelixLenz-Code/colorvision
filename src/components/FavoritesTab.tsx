import { useState, useRef } from 'react'
import { Plus, Upload, Trash2, Edit2, Check, X, Volume2, Heart } from 'lucide-react'
import type { FavoriteEntry, FavoriteList } from '../lib/storage'
import { exportFavoritesToCsv } from '../lib/storage'
import { speakColor } from '../lib/tts'

interface ElectronAPI {
  saveFile: (filename: string, content: string) => Promise<boolean>
  openFile: () => Promise<string | null>
}

declare global {
  interface Window { electronAPI?: ElectronAPI }
}

interface Props {
  favorites: FavoriteEntry[]
  lists: FavoriteList[]
  onAddList: (name: string) => void
  onRenameList: (id: string, name: string) => void
  onDeleteList: (id: string) => void
  onRemoveFavorite: (id: string) => void
  onReorderLists: (lists: FavoriteList[]) => void
  onImport: (file: File, targetListId: string) => void
  onImportCsv: (csv: string, targetListId: string) => void
  onOpenDetail: (entry: FavoriteEntry) => void
}

export default function FavoritesTab({ favorites, lists, onAddList, onRenameList, onDeleteList, onRemoveFavorite, onReorderLists, onImport, onImportCsv, onOpenDetail }: Props) {
  const [activeListId, setActiveListId] = useState<string>(lists[0]?.id ?? 'default')
  const [creatingList, setCreatingList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [listMenuId, setListMenuId] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null)
  const [dragListId, setDragListId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
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

  const handleExport = async () => {
    const csv = exportFavoritesToCsv(favorites, lists)
    if (window.electronAPI) {
      await window.electronAPI.saveFile('colorvision-favoriten.csv', csv)
      return
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'colorvision-favoriten.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = async () => {
    if (window.electronAPI) {
      const csv = await window.electronAPI.openFile()
      if (csv) onImportCsv(csv, activeList?.id ?? lists[0]?.id ?? 'default')
      return
    }
    importRef.current?.click()
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onImport(file, activeList?.id ?? lists[0]?.id ?? 'default')
    e.target.value = ''
  }

  const handleDrop = (targetId: string) => {
    if (!dragListId || dragListId === targetId) return
    const fromIdx = lists.findIndex(l => l.id === dragListId)
    const toIdx = lists.findIndex(l => l.id === targetId)
    const reordered = [...lists]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    onReorderLists(reordered)
    setDragListId(null)
    setDragOverId(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <h2 className="font-semibold text-foreground">Favoriten</h2>
          {favorites.length > 0 && (
            <span className="text-xs bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
              {favorites.length > 99 ? '99+' : favorites.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleImportClick}
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

      {/* List tabs — drag to reorder */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30 shrink-0 overflow-x-auto">
        {lists.map(list => (
          <div
            key={list.id}
            draggable
            onDragStart={() => setDragListId(list.id)}
            onDragEnd={() => { setDragListId(null); setDragOverId(null) }}
            onDragOver={e => { e.preventDefault(); if (list.id !== dragListId) setDragOverId(list.id) }}
            onDrop={() => handleDrop(list.id)}
            className={`relative shrink-0 transition-opacity ${dragListId === list.id ? 'opacity-40' : ''} ${dragOverId === list.id && dragListId !== list.id ? 'ring-2 ring-primary ring-inset rounded-lg' : ''}`}
          >
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
              onClick={e => {
                e.stopPropagation()
                if (listMenuId === list.id) {
                  setListMenuId(null); setMenuPos(null)
                } else {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setMenuPos({ top: rect.bottom + 4, left: rect.left - 80 })
                  setListMenuId(list.id)
                }
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-muted-foreground/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-muted-foreground"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
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
            <div
              key={entry.id}
              onClick={() => onOpenDetail(entry)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 active:bg-muted/60 transition-colors border-b border-border/50 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl shrink-0 shadow-sm" style={{ backgroundColor: entry.hex }} />
              <div className="flex-1 min-w-0">
                {entry.customLabel && (
                  <p className="text-xs font-semibold text-primary mb-0.5 truncate">{entry.customLabel}</p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground text-sm">{entry.nameDe}</span>
                  <span className="text-xs text-muted-foreground">{entry.nameEn}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{entry.hex}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); speakColor(entry) }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onRemoveFavorite(entry.id) }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown menu rendered at fixed position to escape overflow clipping */}
      {listMenuId && menuPos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setListMenuId(null); setMenuPos(null) }} />
          <div
            className="fixed z-50 bg-card border border-border rounded-xl shadow-lg min-w-[130px] overflow-hidden"
            style={{ top: menuPos.top, left: Math.max(8, menuPos.left) }}
          >
            <button
              onClick={() => { setRenamingId(listMenuId); setRenameValue(lists.find(l => l.id === listMenuId)?.name ?? ''); setListMenuId(null); setMenuPos(null) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Umbenennen
            </button>
            {lists.length > 1 && (
              <button
                onClick={() => {
                  onDeleteList(listMenuId)
                  setActiveListId(lists.find(l => l.id !== listMenuId)?.id ?? 'default')
                  setListMenuId(null)
                  setMenuPos(null)
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Löschen
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
