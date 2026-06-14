import { X } from 'lucide-react'
import { IMPRESSUM, DATENSCHUTZ } from '../config/legal'

interface Props {
  page: 'impressum' | 'datenschutz'
  onClose: () => void
}

export default function LegalModal({ page, onClose }: Props) {
  const sections = page === 'impressum' ? IMPRESSUM : DATENSCHUTZ
  const title = page === 'impressum' ? 'Impressum' : 'Datenschutz'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-card rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-bold text-base text-foreground">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            {sections.map(section => (
              <div key={section.heading}>
                <h3 className="font-semibold text-foreground text-sm mb-1">{section.heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
