# ColorVision – Farberkennung

Eine Web-App und Desktop-Anwendung zur Farberkennung in Bildern – entwickelt für Menschen mit Farbenfehlsichtigkeit.

## Features

- **Farberkennung per Tipp** – Lade ein Bild und tippe auf eine Stelle, um die Farbe zu identifizieren
- **200+ Farbnamen** – Auf Deutsch und Englisch, mit Helligkeitsstufen
- **Text-to-Speech** – Farbnamen automatisch vorlesen lassen (Deutsch)
- **Auto-Vorlesen** – Jede erkannte Farbe wird sofort vorgelesen
- **Verlauf** – Alle erkannten Farben mit Zeitstempel
- **Favoriten** – Farben in benutzerdefinierten Listen speichern
- **CSV-Import/Export** – Favoriten sichern und übertragen
- **Zoom & Pan** – Mausrad-Zoom und Pinch-to-Zoom auf Touchgeräten
- **PWA** – Installierbar, offline-fähig

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

MIT
