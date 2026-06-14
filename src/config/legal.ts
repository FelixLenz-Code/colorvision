export interface LegalSection {
  heading: string
  content: string
}

export const IMPRESSUM: LegalSection[] = [
  {
    heading: 'Angaben zum Herausgeber',
    content:
      'ColorVision ist eine kostenfreie Open-Source-Anwendung zur Unterstützung von Menschen mit Farbenfehlsichtigkeit. ' +
      'Der Quellcode ist unter einer Open-Source-Lizenz frei verfügbar. ' +
      'Details entnehmen Sie bitte dem GitHub-Repository: github.com/FelixLenz-Code/colorvision',
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
    heading: 'Urheberrecht',
    content:
      'Der Quellcode dieser Anwendung ist unter einer Open-Source-Lizenz veröffentlicht. ' +
      'Die verwendete Farb-Datenbank basiert auf dem HSL-Farbraum und wurde vom Entwickler erstellt. ' +
      'Die Nutzung der Anwendung ist kostenlos und ohne Registrierung möglich.',
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
    heading: 'Ihre Rechte',
    content:
      'Da keine personenbezogenen Daten erhoben oder verarbeitet werden, entfallen Rechte wie Auskunft, Berichtigung ' +
      'oder Löschung im datenschutzrechtlichen Sinne. Alle von Ihnen lokal gespeicherten App-Daten (Verlauf, Favoriten) ' +
      'können Sie jederzeit selbst über die App-Oberfläche löschen.',
  },
]
