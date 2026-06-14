import { Heart, Volume2, Trash2, Save } from 'lucide-react'
import type { HistoryEntry } from '../lib/storage'
import { speakColor } from '../lib/tts'

interface Props {
  history: HistoryEntry[]
  onSaveAll: () => void
  onClearAll: () => void
  onFavorite: (entry: HistoryEntry) => void
  isFavorite: (id: string) => boolean
  onRemove: (id: string) => void
  onOpenDetail: (entry: HistoryEntry) => void
}

export default function HistoryTab({ history, onSaveAll, onClearAll, onFavorite, isFavorite, onRemove, onOpenDetail }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
          <h2 className="font-semibold text-foreground">Verlauf</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
            <p className="font-medium text-foreground mb-1">Noch keine Farben</p>
            <p className="text-muted-foreground text-sm">Tippe auf eine Farbe im Bild, um sie hier zu speichern</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted-foreground"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
          <h2 className="font-semibold text-foreground">Verlauf</h2>
          <span className="text-xs bg-primary text-primary-foreground font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSaveAll}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <Save className="w-3.5 h-3.5" />
            Alle speichern
          </button>
          <div className="w-px h-4 bg-border" />
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Alle löschen
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {history.map(entry => {
          const fav = isFavorite(entry.id)
          const time = new Date(entry.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          return (
            <div
              key={entry.id}
              onClick={() => onOpenDetail(entry)}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 active:bg-muted/60 transition-colors border-b border-border/50 cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl shrink-0 shadow-sm"
                style={{ backgroundColor: entry.hex }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-foreground text-sm">{entry.nameDe}</span>
                  <span className="text-xs text-muted-foreground">{entry.nameEn}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-xs text-muted-foreground">{entry.hex}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); onFavorite(entry) }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  title={fav ? 'Favorit' : 'Zu Favoriten'}
                >
                  <Heart className="w-4 h-4" fill={fav ? '#ff4d6d' : 'none'} stroke={fav ? '#ff4d6d' : 'currentColor'} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); speakColor(entry) }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
                  title="Vorlesen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onRemove(entry.id) }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 transition-colors text-muted-foreground"
                  title="Eintrag löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
