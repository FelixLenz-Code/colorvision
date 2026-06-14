# ColorVision – Farberkennung

Eine Web-App und Desktop-Anwendung zur Farberkennung in Bildern – entwickelt für Menschen mit Farbenfehlsichtigkeit.

## Features

- **Farberkennung per Tipp** – Bild laden, auf eine Stelle tippen, Farbe identifizieren
- **200+ Farbnamen** – Deutsch und Englisch, mit Helligkeitsbeschreibung und Farbbeschreibung
- **Text-to-Speech** – Farbnamen automatisch vorlesen lassen (Deutsch)
- **Auto-Vorlesen** – Jede erkannte Farbe wird sofort vorgelesen
- **Verlauf** – Alle erkannten Farben mit Zeitstempel; einzeln oder alle auf einmal in Favoriten speichern
- **Favoriten** – Farben in mehreren benutzerdefinierten Listen organisieren
- **Herz-Toggle im Verlauf** – Farben direkt aus dem Verlauf favorisieren und entfavorisieren
- **CSV-Import/Export** – Favoritenlisten sichern und auf andere Geräte übertragen
- **Zoom & Pan** – Mausrad-Zoom und Pinch-to-Zoom auf Touchgeräten
- **Touch-optimiert** – Funktioniert auf iPad und Android-Tablets (inkl. Debounce gegen Doppelpicks)
- **PWA** – Installierbar, offline-fähig
- **Impressum & Datenschutz** – Vollständige rechtliche Informationen integriert

## Installation

### Als Desktop-App (empfohlen)

Lade die passende Datei von der [Releases-Seite](https://github.com/FelixLenz-Code/colorvision/releases) herunter:

| Plattform | Datei |
|-----------|-------|
| 🐧 Linux | `ColorVision-*.AppImage` |
| 🪟 Windows | `ColorVision-*-Setup.exe` |
| 🍎 macOS | `ColorVision-*.dmg` |

**Linux:**
```bash
chmod +x ColorVision-*.AppImage
./ColorVision-*.AppImage
```

### Als PWA selbst hosten (Linux-Server)

Einzeilige Installation auf einem Ubuntu/Debian-Server:

```bash
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/FelixLenz-Code/colorvision/main/install.sh)"
```

Optionale Parameter:
```bash
sudo bash install.sh --port 8080 --domain meine-domain.de
```

### Entwicklungsumgebung

```bash
git clone https://github.com/FelixLenz-Code/colorvision.git
cd colorvision
npm install
npm run dev
```

Für Tests im lokalen Netzwerk (z. B. Tablet):
```bash
npx vite --host 0.0.0.0
```

**Electron (Desktop-Entwicklung):**
```bash
npm run electron:dev
```

**Build:**
```bash
npm run build          # Nur Web (PWA)
npm run electron:build # Web + Desktop-Binaries
```

## Tech-Stack

- **React 18** + TypeScript + Vite
- **Tailwind CSS** für das Styling
- **Lucide React** für Icons
- **Electron 28** für Desktop-Apps
- **vite-plugin-pwa** für PWA/Service-Worker
- **Web Speech API** für Text-to-Speech

## Lizenz

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.de) – Namensnennung, nicht-kommerziell
