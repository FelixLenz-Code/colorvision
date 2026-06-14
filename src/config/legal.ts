export interface LegalSection {
  heading: string
  content: string
  link?: { text: string; href: string }
}

export const IMPRESSUM: LegalSection[] = [
  {
    heading: 'Angaben zum Herausgeber',
    content:
      'ColorVision ist eine kostenfreie Anwendung zur Unterstützung von Menschen mit Farbenfehlsichtigkeit. ' +
      'Der Quellcode ist öffentlich auf GitHub verfügbar:',
    link: { text: 'github.com/FelixLenz-Code/colorvision', href: 'https://github.com/FelixLenz-Code/colorvision' },
  },
  {
    heading: 'Haftungsausschluss',
    content:
      'Die Farbinformationen werden algorithmisch auf Basis von HSL-Farbwerten berechnet und dienen ausschließlich ' +
      'als Orientierungshilfe. Für Entscheidungen, bei denen exakte Farbangaben erforderlich sind (z. B. im Druck, ' +
      'in der Industrie oder Medizin), müssen professionelle Farbmessgeräte eingesetzt werden. ' +
      'Eine Haftung für Schäden, die aus der Nutzung dieser Farbinformationen entstehen, wird ausgeschlossen.',
  },
  {
    heading: 'Urheberrecht & Lizenz',
    content:
      'ColorVision ist lizenziert unter der Creative Commons Lizenz CC BY-NC 4.0 ' +
      '(Namensnennung – Nicht kommerziell). ' +
      'Nutzung ist erlaubt, solange sie nicht kommerziellen Zwecken dient und der Urheber genannt wird.',
    link: { text: 'creativecommons.org/licenses/by-nc/4.0', href: 'https://creativecommons.org/licenses/by-nc/4.0/deed.de' },
  },
  {
    heading: 'Hinweis für selbst gehostete Instanzen',
    content:
      'Wer diese Software auf einem eigenen Server betreibt, ist für den Betrieb der eigenen Website selbst verantwortlich – ' +
      'einschließlich eines eigenen Impressums, einer eigenen Datenschutzerklärung sowie der Einhaltung ' +
      'aller geltenden gesetzlichen Anforderungen. Diese Texte beziehen sich ausschließlich auf das ' +
      'Original-Projekt unter github.com/FelixLenz-Code/colorvision.',
  },
  {
    heading: 'Technische Hinweise',
    content:
      'Diese Anwendung läuft vollständig lokal auf Ihrem Gerät. Es findet keine Kommunikation mit externen Servern statt ' +
      '(ausgenommen sind Google Fonts, die bei der Web-Version für die Schriftart geladen werden, sowie die ' +
      'Sprachausgabe-Funktion Ihres Betriebssystems). ' +
      'Es werden keinerlei personenbezogene Daten erhoben, gespeichert oder weitergegeben.',
  },
]

export const DATENSCHUTZ: LegalSection[] = [
  {
    heading: 'Grundsatz: Lokale Verarbeitung',
    content:
      'ColorVision verarbeitet alle Daten ausschließlich lokal auf Ihrem Gerät. ' +
      'Es werden keine personenbezogenen Daten an externe Server übertragen, ' +
      'kein Nutzungsverhalten erfasst und keine Analysedienste eingebunden.',
  },
  {
    heading: 'Verarbeitete Bilddaten',
    content:
      'Bilder, die Sie in die Anwendung laden, werden ausschließlich im Arbeitsspeicher Ihres Geräts verarbeitet ' +
      'und nicht dauerhaft gespeichert oder an Dritte übertragen. ' +
      'Nach dem Schließen der Anwendung werden alle temporären Bilddaten gelöscht.',
  },
  {
    heading: 'Lokal gespeicherte Daten',
    content:
      'Verlauf und Favoriten werden im lokalen Speicher (localStorage) Ihres Geräts gespeichert. ' +
      'Diese Daten verbleiben ausschließlich auf Ihrem Gerät und können jederzeit über die App-Oberfläche gelöscht werden. ' +
      'Ein Löschen des Browser-Caches bzw. der App-Daten entfernt alle gespeicherten Einträge.',
  },
  {
    heading: 'Sprachausgabe',
    content:
      'Die Sprachausgabe (Text-to-Speech) nutzt die Web Speech API oder die systemeigene Sprachsynthese Ihres Betriebssystems. ' +
      'Auf manchen Geräten und Betriebssystemen kann die Sprachausgabe eine Verbindung zum Sprachsynthesedienst ' +
      'des Herstellers herstellen. Dies liegt im Verantwortungsbereich des jeweiligen Betriebssystem-Anbieters.',
  },
  {
    heading: 'Schriftarten (Web-Version)',
    content:
      'Die Web-Version dieser Anwendung lädt Schriftarten von Google Fonts. ' +
      'Dabei wird Ihre IP-Adresse an Google übermittelt. ' +
      'Informationen zur Datenverarbeitung durch Google finden Sie unter: policies.google.com/privacy',
  },
  {
    heading: 'Cookies und Tracking',
    content:
      'Diese Anwendung verwendet keine Cookies, kein Tracking, keine Analyse-Tools und keine Werbung. ' +
      'Es werden keine Nutzungsprofile erstellt.',
  },
  {
    heading: 'Hinweis für selbst gehostete Instanzen',
    content:
      'Wer diese Software auf einem eigenen Server betreibt, ist für den Betrieb der eigenen Website selbst verantwortlich – ' +
      'einschließlich eines eigenen Impressums, einer eigenen Datenschutzerklärung sowie der Einhaltung ' +
      'aller geltenden gesetzlichen Anforderungen. Diese Datenschutzerklärung bezieht sich ausschließlich auf das ' +
      'Original-Projekt unter github.com/FelixLenz-Code/colorvision.',
  },
  {
    heading: 'Hinweis zur KI-Unterstützung',
    content:
      'Diese Software wurde vollständig mithilfe von Claude (einem KI-Assistenten von Anthropic) entwickelt. ' +
      'Der Autor hat die Anforderungen definiert, Entscheidungen getroffen und das Ergebnis geprüft – ' +
      'der Code selbst wurde durch den Dialog mit der KI generiert. ' +
      'Die Software wird so bereitgestellt, wie sie ist (as-is), ohne jegliche Garantie auf Korrektheit, ' +
      'Vollständigkeit oder Eignung für einen bestimmten Zweck. Der Autor übernimmt keinerlei Haftung für ' +
      'Schäden, Datenverluste oder sonstige Probleme, die durch die Verwendung dieser Software entstehen. ' +
      'Die Nutzung erfolgt auf eigene Verantwortung.',
  },
  {
    heading: 'Ihre Rechte',
    content:
      'Da keine personenbezogenen Daten erhoben oder verarbeitet werden, entfallen Rechte wie Auskunft, Berichtigung ' +
      'oder Löschung im datenschutzrechtlichen Sinne. Alle von Ihnen lokal gespeicherten App-Daten (Verlauf, Favoriten) ' +
      'können Sie jederzeit selbst über die App-Oberfläche löschen.',
  },
]
