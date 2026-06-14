#!/usr/bin/env bash
# ColorVision – Linux Server Installation Script
# Installiert ColorVision als PWA auf einem Linux-Server mit Nginx
#
# Verwendung:
#   curl -fsSL https://raw.githubusercontent.com/FelixLenz-Code/colorvision/main/install.sh | bash
#   oder: bash install.sh [--port 8080] [--domain example.com]
#
# Voraussetzungen: Ubuntu/Debian, curl, sudo-Rechte

set -euo pipefail

# ─── Farben für Ausgabe ────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERR]${NC}  $*" >&2; }
die()     { error "$*"; exit 1; }

# ─── Standardwerte ────────────────────────────────────────────────────────────
PORT=8080
DOMAIN=""
INSTALL_DIR="/opt/colorvision"
NGINX_CONF="/etc/nginx/sites-available/colorvision"
NODE_REQUIRED="22"
REPO_URL="https://github.com/FelixLenz-Code/colorvision"
FORCE=false

# ─── Argumente parsen ─────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)    PORT="$2";   shift 2 ;;
    --domain)  DOMAIN="$2"; shift 2 ;;
    --dir)     INSTALL_DIR="$2"; shift 2 ;;
    --force)   FORCE=true;  shift ;;
    --help|-h)
      echo "Verwendung: $0 [--port PORT] [--domain DOMAIN] [--dir INSTALLDIR] [--force]"
      echo ""
      echo "  --force   Vollständige Neuinstallation erzwingen (auch wenn bereits installiert)"
      exit 0 ;;
    *)
      warn "Unbekanntes Argument: $1"; shift ;;
  esac
done

# ─── Eingaben validieren ─────────────────────────────────────────────────────
[[ "$PORT" =~ ^[0-9]+$ ]] && [[ "$PORT" -ge 1 ]] && [[ "$PORT" -le 65535 ]] || die "Ungültiger Port: $PORT"
[[ -z "$DOMAIN" || "$DOMAIN" =~ ^[a-zA-Z0-9._-]+$ ]] || die "Ungültige Domain: $DOMAIN"
[[ "$INSTALL_DIR" =~ ^/ ]] || die "INSTALL_DIR muss ein absoluter Pfad sein"

# ─── Root-Prüfung ─────────────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  die "Bitte als root oder mit sudo ausführen."
fi

# ─── OS-Prüfung ───────────────────────────────────────────────────────────────
if ! command -v apt-get &>/dev/null; then
  die "Dieses Skript unterstützt nur Debian/Ubuntu-basierte Systeme."
fi

# ─── Installationsart erkennen ───────────────────────────────────────────────
IS_UPDATE=false
if [[ "$FORCE" == false && -d "$INSTALL_DIR/.git" && -f "$NGINX_CONF" ]]; then
  IS_UPDATE=true
fi

# ─── Banner ───────────────────────────────────────────────────────────────────
echo -e "${BOLD}"
if [[ "$IS_UPDATE" == true ]]; then
  echo "╔══════════════════════════════════════╗"
  echo "║    ColorVision – Server-Update      ║"
  echo "╚══════════════════════════════════════╝"
else
  echo "╔══════════════════════════════════════╗"
  echo "║  ColorVision – Server-Installation  ║"
  echo "╚══════════════════════════════════════╝"
fi
echo -e "${NC}"

info "System: $(lsb_release -d 2>/dev/null | cut -f2 || uname -sr)"

# ════════════════════════════════════════════════════════════════════════════════
# UPDATE-PFAD: Nur Code aktualisieren, Nginx-Konfig bleibt unverändert
# ════════════════════════════════════════════════════════════════════════════════
if [[ "$IS_UPDATE" == true ]]; then

  CURRENT_VERSION=$(node -e "process.stdout.write(require('$INSTALL_DIR/package.json').version)" 2>/dev/null || echo "unbekannt")
  info "Installierte Version: ${CURRENT_VERSION}"

  info "Lade aktuelle Version von GitHub…"
  git -C "$INSTALL_DIR" fetch --quiet origin main
  git -C "$INSTALL_DIR" reset --hard origin/main --quiet
  success "Quellcode aktualisiert."

  NEW_VERSION=$(node -e "process.stdout.write(require('$INSTALL_DIR/package.json').version)" 2>/dev/null || echo "unbekannt")

  info "Installiere npm-Abhängigkeiten…"
  cd "$INSTALL_DIR"
  npm install --legacy-peer-deps --silent

  info "Baue Web-App…"
  npm run build --silent

  info "Bereinige Build-Abhängigkeiten…"
  npm prune --omit=dev --silent

  success "Build abgeschlossen."

  info "Lade Nginx neu…"
  nginx -t -q 2>/dev/null || die "Nginx-Konfiguration fehlerhaft: $NGINX_CONF"
  systemctl reload nginx
  success "Nginx neu geladen."

  echo ""
  echo -e "${BOLD}${GREEN}✓ ColorVision erfolgreich aktualisiert!${NC}"
  echo ""
  echo -e "  ${BOLD}Version:${NC}      ${CURRENT_VERSION} → ${NEW_VERSION}"
  echo -e "  ${BOLD}URL:${NC}          http://$(hostname -I | awk '{print $1}'):${PORT}"
  echo -e "  ${BOLD}Installiert in:${NC} $INSTALL_DIR"
  echo ""
  exit 0
fi

# ════════════════════════════════════════════════════════════════════════════════
# INSTALLATIONS-PFAD: Vollständige Erstinstallation
# ════════════════════════════════════════════════════════════════════════════════

# ─── Abhängigkeiten installieren ─────────────────────────────────────────────
info "Aktualisiere Paketliste…"
apt-get update -qq

PKGS=()

# Node.js prüfen
if ! command -v node &>/dev/null || [[ $(node -e "process.exit(parseInt(process.versions.node)<${NODE_REQUIRED}?1:0)" 2>/dev/null; echo $?) -ne 0 ]]; then
  info "Installiere Node.js ${NODE_REQUIRED}+…"
  curl -fsSL https://deb.nodesource.com/setup_${NODE_REQUIRED}.x | bash - &>/dev/null
  PKGS+=(nodejs)
fi

# Nginx prüfen
if ! command -v nginx &>/dev/null; then
  PKGS+=(nginx)
fi

# Git prüfen
if ! command -v git &>/dev/null; then
  PKGS+=(git)
fi

if [[ ${#PKGS[@]} -gt 0 ]]; then
  info "Installiere: ${PKGS[*]}"
  apt-get install -y -qq "${PKGS[@]}"
fi

success "Abhängigkeiten installiert."

# ─── App herunterladen ────────────────────────────────────────────────────────
info "Lade ColorVision herunter nach $INSTALL_DIR…"
git clone --depth 1 "$REPO_URL" "$INSTALL_DIR" --quiet
success "Quellcode bereit."

# ─── Node-Abhängigkeiten & Build ─────────────────────────────────────────────
info "Installiere npm-Abhängigkeiten…"
cd "$INSTALL_DIR"
npm install --legacy-peer-deps --silent

info "Baue Web-App…"
npm run build --silent

info "Bereinige Build-Abhängigkeiten…"
npm prune --omit=dev --silent

success "Build abgeschlossen."

# ─── Nginx konfigurieren ─────────────────────────────────────────────────────
info "Konfiguriere Nginx…"

if [[ -n "$DOMAIN" ]]; then
  SERVER_NAME="$DOMAIN"
else
  SERVER_NAME="_"
fi

cat > "$NGINX_CONF" << NGINX
server {
    listen ${PORT};
    listen [::]:${PORT};
    server_name ${SERVER_NAME};

    root ${INSTALL_DIR}/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml image/svg+xml;

    # Sicherheits-Header (auf server-Ebene für alle location-Blöcke wiederholt,
    # da Nginx add_header nicht von übergeordneten Blöcken vererbt)
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy no-referrer always;
    add_header Permissions-Policy "clipboard-read=self, clipboard-write=self, microphone=()" always;
    add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data:; script-src 'self'; connect-src 'self'" always;

    # Cache-Kontrolle für Assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable" always;
        add_header X-Frame-Options SAMEORIGIN always;
        add_header X-Content-Type-Options nosniff always;
        add_header Referrer-Policy no-referrer always;
        add_header Permissions-Policy "clipboard-read=self, clipboard-write=self, microphone=()" always;
        add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data:; script-src 'self'; connect-src 'self'" always;
    }

    # Service Worker darf nicht gecacht werden
    location /sw.js {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate" always;
        add_header X-Frame-Options SAMEORIGIN always;
        add_header X-Content-Type-Options nosniff always;
        add_header Referrer-Policy no-referrer always;
        add_header Permissions-Policy "clipboard-read=self, clipboard-write=self, microphone=()" always;
        add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data:; script-src 'self'; connect-src 'self'" always;
    }

    # PWA-Manifest
    location /manifest.webmanifest {
        expires -1;
        default_type application/manifest+json;
        add_header Cache-Control "no-cache" always;
        add_header X-Frame-Options SAMEORIGIN always;
        add_header X-Content-Type-Options nosniff always;
        add_header Referrer-Policy no-referrer always;
        add_header Permissions-Policy "clipboard-read=self, clipboard-write=self, microphone=()" always;
        add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data:; script-src 'self'; connect-src 'self'" always;
    }

    # Alle anderen Pfade → index.html (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

# Aktivieren
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/colorvision 2>/dev/null || true

# Default-Site deaktivieren falls Port 80 nicht benutzt wird
if [[ "$PORT" != "80" ]]; then
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
fi

# Nginx testen und neu laden
nginx -t -q 2>/dev/null || die "Nginx-Konfiguration fehlerhaft. Bitte manuell prüfen: $NGINX_CONF"
systemctl enable nginx --quiet 2>/dev/null || true
systemctl restart nginx

success "Nginx konfiguriert und gestartet."

# ─── Firewall (optional) ─────────────────────────────────────────────────────
if command -v ufw &>/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
  info "Öffne Port $PORT in UFW-Firewall…"
  ufw allow "$PORT/tcp" --comment "ColorVision" &>/dev/null || true
  success "Firewall-Regel hinzugefügt."
fi

# ─── Zusammenfassung ─────────────────────────────────────────────────────────
VERSION=$(node -e "process.stdout.write(require('$INSTALL_DIR/package.json').version)" 2>/dev/null || echo "")

echo ""
echo -e "${BOLD}${GREEN}✓ ColorVision erfolgreich installiert!${NC}"
echo ""
[[ -n "$VERSION" ]] && echo -e "  ${BOLD}Version:${NC}      ${VERSION}"
echo -e "  ${BOLD}URL:${NC}          http://$(hostname -I | awk '{print $1}'):${PORT}"
if [[ -n "$DOMAIN" ]]; then
  echo -e "  ${BOLD}Domain:${NC}       http://${DOMAIN}:${PORT}"
fi
echo -e "  ${BOLD}Installiert in:${NC} $INSTALL_DIR"
echo -e "  ${BOLD}Nginx-Konfig:${NC}  $NGINX_CONF"
echo ""
echo -e "  ${BOLD}Befehle:${NC}"
echo -e "    Aktualisieren:  sudo bash $INSTALL_DIR/install.sh"
echo -e "    Neuinstallation: sudo bash $INSTALL_DIR/install.sh --force"
echo -e "    Nginx-Log:      sudo journalctl -u nginx -f"
echo -e "    Nginx-Restart:  sudo systemctl restart nginx"
echo ""
echo -e "  ${YELLOW}Tipp:${NC} Für HTTPS empfehlen wir Certbot:"
echo -e "    sudo apt install certbot python3-certbot-nginx"
echo -e "    sudo certbot --nginx -d ${DOMAIN:-deine-domain.de}"
echo ""
