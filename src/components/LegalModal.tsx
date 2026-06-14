import { X } from 'lucide-react'

interface Props {
  page: 'impressum' | 'datenschutz'
  onClose: () => void
}

export default function LegalModal({ page, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-bold text-base text-foreground">
            {page === 'impressum' ? 'Impressum' : 'Datenschutz'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 prose prose-sm max-w-none text-foreground">
          {page === 'impressum' ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Angaben gemäß § 5 TMG</h3>
                <p>Diese App wird als Open-Source-Projekt betrieben.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Haftungsausschluss</h3>
                <p>Die Farbinformationen werden algorithmisch ermittelt und dienen nur als Orientierung. Für Entscheidungen, bei denen genaue Farbangaben erforderlich sind, sollten professionelle Farbmessinstrumente verwendet werden.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Open Source</h3>
                <p>Der Quellcode dieser Anwendung ist frei verfügbar. Details entnehmen Sie bitte dem GitHub-Repository.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Datenschutz auf einen Blick</h3>
                <p>Diese App speichert <strong className="text-foreground">ausschließlich lokal auf Ihrem Gerät</strong>. Es werden keine Daten an externe Server übertragen.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Bilder</h3>
                <p>Hochgeladene Bilder werden nur lokal im Arbeitsspeicher Ihres Geräts verarbeitet und nicht gespeichert oder übertragen.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Gespeicherte Daten</h3>
                <p>Verlauf und Favoriten werden im lokalen Speicher (localStorage) Ihres Browsers gespeichert. Diese Daten verlassen Ihr Gerät nicht.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Sprachausgabe</h3>
                <p>Die Sprachausgabe nutzt die Web Speech API Ihres Browsers. Auf manchen Geräten kann dies die Verbindung zu einem Online-Dienst des Betriebssystemherstellers erfordern.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Cookies & Tracking</h3>
                <p>Diese App verwendet keine Cookies und kein Tracking.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
