# ⚡ Voltage – das Energy-Drink-Planspiel

Voltage ist ein Planspiel für den WAH-Unterricht im Zyklus 3. Jede Gruppe führt eine eigene Energy-Drink-Firma. Pro Quartal entscheiden die Gruppen über Produktion, Preis, Werbung, Personal, Umwelt und Investitionen. Danach simuliert die App den Markt: Alle Firmen konkurrieren um dieselbe Kundschaft, und jede Gruppe erhält einen Quartalsbericht mit Erklärungen.

Der Aufbau lehnt sich an die Lernumgebung «Wirtschaft entdecken» an: **Einstieg – Planspiel in fünf Levels – Transfer**. Bewertet wird die Firma in den drei Dimensionen der Nachhaltigkeit: Wirtschaft, Umwelt und Gesellschaft. Voltage ist ein eigenständiges Projekt und kein Produkt von Wirtschaftsbildung Schweiz.

- **Eine Datei, keine Installation:** `index.html` läuft im Browser, auch offline.
- **Zwei Spielmodi:** alles auf einem Gerät (ohne Einrichtung) oder jede Gruppe auf ihrem eigenen Tablet (Online-Modus mit Firebase).
- **Als App installierbar** (iPad: Teilen → «Zum Home-Bildschirm»).

---

## Sofort ausprobieren

1. `index.html` im Browser öffnen (Doppelklick genügt).
2. **«▶ Demo ausprobieren»** antippen. Die Demo legt ein Spiel mit drei Beispielgruppen und zwei Computer-Firmen an und spielt zwei Quartale vor.
3. Im Kontrollraum eine Gruppe mit **«👁️ Als Gruppe öffnen»** ansehen: Entscheidungen, Planungshilfe, Quartalsbericht.

Demo-PINs: Lehrperson `demo`, Gruppen `2468`. Die Demo bleibt auf dem Gerät und lässt sich jederzeit löschen.

---

## Ablauf im Unterricht

| Phase | Was passiert | Zeitbedarf |
|---|---|---|
| 🧭 **1 · Einstieg** | Gruppen gründen ihre Firma (Name, Logo, Farbe, PIN) und lösen den Start-Check (6 Fragen zu Umsatz, Kosten, Gewinn, Nachhaltigkeit). Die Lehrperson erklärt das Nachhaltigkeitsdreieck (Tab «Spielregeln» am Beamer). | 1 Lektion |
| 🎮 **2 · Planspiel** | Fünf Levels, je 1–3 Quartale. Jedes Level bringt neue Entscheidungen. Nach jedem Level beantworten die Gruppen Reflexionsfragen. | pro Quartal 15–25 Min. |
| 🎓 **3 · Transfer** | Schlussbilanz, Siegerehrung (auch pro Bereich) und Transferfragen: Was bedeutet das für meinen eigenen Einkauf? | 1 Lektion |

**Ein Quartal läuft so ab:**

1. Die Lehrperson schaltet im Cockpit das Quartal frei, wählt das Level (Vorschlag ist gesetzt) und bis zu zwei Marktereignisse (z.B. Hitzewelle, TikTok-Trend, Zuckersteuer). Die Ereignisse erscheinen im News-Ticker.
2. Die Gruppen entscheiden. Die **Planungshilfe** rechnet live mit: Kosten pro Dose, Gesamtkosten, Gewinnschwelle, Warnungen. Abgeben lässt sich beliebig oft bis zur Auswertung.
3. Die Lehrperson sieht die Abgaben live und klickt **«Quartal auswerten»**. Gruppen ohne Abgabe arbeiten mit ihren letzten Entscheidungen weiter (Autopilot).
4. Jede Gruppe liest ihren **Quartalsbericht**: Erfolgsrechnung, «Warum lief es so?», Attraktivität im Marktvergleich, Marktübersicht, Nachhaltigkeit vorher/nachher.
5. Besprechung im Plenum mit dem Tab «Ergebnisse» am Beamer. Wurde zu früh ausgewertet, lässt sich die Auswertung zurücknehmen.

### Die fünf Levels

| Level | Thema | Neue Entscheidungen |
|---|---|---|
| 1 | 🏭 Produktion & Preis | Produktionsmenge, Verkaufspreis |
| 2 | 📣 Marketing | Social Media, Plakate & Kino, Sponsoring |
| 3 | 👷 Mitarbeitende | Einstellen/Entlassen, Lohnniveau, Weiterbildung |
| 4 | 🌱 Umwelt | Bio & Fairtrade, Recycling-Alu, zuckerreduzierte Rezeptur |
| 5 | 🏦 Unternehmensführung | Abfüllanlage, Solaranlage, Kredit, Lernende, Engagement |

Mit zwei Quartalen pro Level (Standard) passt der Jahreslauf: Level 3 fällt in den Sommer (mehr Personal nötig), Level 5 wieder in Frühling und Sommer (Investitionen in Kapazität lohnen sich).

### Wertung

- **💰 Wirtschaft:** Eigenkapital (Kasse + Lager + Anlagen − Kredit) im Vergleich zum Startkapital.
- **🌱 Umwelt:** Zutaten, Recycling, Solarstrom – und möglichst wenig verramschte Überproduktion.
- **🤝 Gesellschaft:** Zufriedenheit im Team, faire Zutaten, gesündere Rezeptur, Lehrstellen, Engagement, keine Entlassungen.
- **Gesamtpunkte** = Durchschnitt der drei Bereiche, wobei der **schwächste Bereich doppelt zählt**. Wer einen Bereich vernachlässigt, verliert also viele Punkte. Alternativ lässt sich im Kontrollraum «Nur Wirtschaft» wählen.

Die Zahlen sind aufeinander abgestimmt: Eine ausgewogene Firma gewinnt vor reiner Gewinnmaximierung, Dumpingpreisen, Wucherpreisen, Überproduktion und teurer Nachhaltigkeit ohne Rechnen. Das prüfen die Tests (siehe unten).

---

## Zwei Spielmodi

### 📱 Ein Gerät (ohne Einrichtung)

Alles läuft im Browser der Lehrperson, die Daten bleiben auf diesem Gerät. Die Gruppen geben ihre Entscheidungen auf einem **Entscheidungsblatt** ab (Kontrollraum → Eingaben → «Entscheidungsblatt drucken»). Die Lehrperson erfasst sie über **«Als Gruppe öffnen»**. Alternativ melden sich die Gruppen der Reihe nach am selben Gerät an. Berichte und Rangliste zeigt die Lehrperson am Beamer.

### 🌐 Online (jede Gruppe auf ihrem eigenen Tablet)

Die Daten liegen in einer kostenlosen **Firebase Realtime Database**. Die Lehrperson leitet im Kontrollraum, die Gruppen spielen auf ihren Geräten, alles gleicht sich alle paar Sekunden ab. Fällt das WLAN kurz aus, speichert das Tablet die Abgabe und liefert sie automatisch nach.

#### Online-Modus einrichten (einmalig, etwa 15 Minuten)

1. **Firebase-Projekt anlegen:** <https://console.firebase.google.com> → «Projekt hinzufügen». Google Analytics abwählen.
2. **Realtime Database erstellen:** Menü «Build» → «Realtime Database» → «Datenbank erstellen». Standort **europe-west1 (Belgien)**, damit die Daten in der EU bleiben. **Im gesperrten Modus starten**, nicht im Testmodus.
3. **Regeln einspielen:** Tab «Regeln» → den ganzen Inhalt von [`firebase/regeln.json`](firebase/regeln.json) einfügen → «Veröffentlichen».
4. **Adresse kopieren:** oben in der Realtime Database, z.B. `https://voltage-7a-default-rtdb.europe-west1.firebasedatabase.app`.
5. **In Voltage eintragen:** Lehrperson → «🌐 Online-Modus» → Adresse einfügen → «Testen und speichern». Erscheint «Verbindung klappt», ist alles bereit.
   *Alternative:* Die Adresse in `index.html` bei `KONFIG.firebaseUrl` eintragen. Dann kennen alle Geräte die Datenbank, und für die Klasse genügt der Spielcode.
6. **Spiel erstellen:** «Neues Spiel» → «🌐 Online». Der Kontrollraum zeigt den **Spielcode**, einen **QR-Code** und den **Link für die Klasse**. Mit «📺 Für den Beamer» erscheinen Code und QR-Code gross. Die Gruppen scannen ihn mit der Kamera des Tablets und landen direkt beim Gründen ihrer Firma.

#### App im Internet bereitstellen (GitHub Pages)

1. Im Repository: **Settings → Pages → «Deploy from a branch»**, Branch `main`, Ordner `/ (root)`.
2. Nach ein bis zwei Minuten ist Voltage erreichbar unter `https://kingofwar1918.github.io/VOLTAGE/`.
3. Diesen Link oder den Klassen-Link aus dem Kontrollraum an die Klasse weitergeben.

Hinweis: Mit einem kostenlosen GitHub-Konto muss das Repository für Pages öffentlich sein. Dann ist alles darin für alle lesbar. Darum gehören keine Namenslisten und keine Noten ins Repository.

#### Checkliste vor dem ersten Einsatz

- [ ] Regeln aus `firebase/regeln.json` veröffentlicht (nicht nur eingetippt)
- [ ] «Verbindung klappt» im Online-Modus von Voltage
- [ ] Probespiel mit zwei Geräten durchgespielt
- [ ] Eigener Lehrpersonen-PIN gewählt (nicht `1234`)
- [ ] Entscheidungsblätter als Rückfallplan ausgedruckt, falls das Netz ausfällt
- [ ] Nach der Einheit: Resultate und Reflexion exportieren, Sicherung herunterladen, Spiel löschen

---

## Datenschutz

- Die Gruppen erfinden **Firmennamen**. Echte Namen braucht es nirgends, und es werden keine Noten gespeichert.
- **Ein-Geräte-Modus:** Alle Daten bleiben im Browser des Geräts.
- **Online-Modus:** Die Daten liegen in eurer eigenen Firebase-Datenbank (Standort EU). Die Regeln verhindern, dass jemand die Liste aller Spiele oder die Lehrpersonen-PINs abrufen kann. Wer aber Spielcode und Datenbank-Adresse kennt, kann die Daten dieses Spiels technisch lesen und verändern, denn es gibt keine Anmeldung mit Konto. Die PINs schützen nur die Bedienoberfläche. Für ein Lernspiel ohne Noten reicht das. Bei Unsicherheit mit der Schulleitung klären.
- **Die Datenbank ist kein Archiv:** Nach der Einheit exportieren (CSV, Sicherung) und das Spiel im Kontrollraum löschen.

---

## Anpassen

Alle Inhalte stehen im Block `DATEN` am Anfang des Skripts in `index.html`: Texte, Levels, Reflexions- und Transferfragen, Start-Check, Marktereignisse, Lexikon, Computer-Konkurrenz und alle Zahlen (Preise, Kosten, Löhne, Kapazität, Startkapital). Die Logik darunter liest nur diesen Block.

Wer an den Zahlen (`DATEN.regeln`) dreht, sollte danach die Tests laufen lassen oder ein Spiel durchspielen. Die Werte sind aufeinander abgestimmt.

---

## Was gegenüber der ersten Version verbessert wurde

Die erste Fassung («Voltage – Energy-Drink-Tycoon») lief nur in der Claude-Vorschau:

- **Speichern ging ausserhalb der Vorschau nicht:** Sie nutzte `window.storage`, das es nur in Claude-Artefakten gibt. Als eigene Datei scheiterte darum jedes Speichern, und das Spiel meldete sich sofort wieder ab. Jetzt speichert die App im Browser oder in Firebase.
- **Externe Abhängigkeiten** (Chart.js, Google Fonts) funktionierten im Schulnetz und offline nicht. Die Diagramme sind jetzt eingebaut.
- **Marktmodell:** Erhöhten alle Firmen gemeinsam den Preis, sank die Gesamtnachfrage nicht. Jetzt kaufen bei zu hohen Preisen weniger Leute Energy Drinks.
- **Firmen, die während eines offenen Quartals gegründet wurden,** fehlten bei der Auswertung.
- **Beim automatischen Aktualisieren** flackerten Diagramme, und Eingaben konnten verloren gehen.
- Neu dazugekommen sind: fünf Levels mit Einstieg und Transfer, Nachhaltigkeitsdreieck und Wertung in drei Dimensionen, Reflexionsfragen, Start-Check, Lager und Jahreszeiten, Planungshilfe mit Gewinnschwelle, Computer-Konkurrenz, Autopilot, Auswertung zurücknehmen, Erfassen für Gruppen ohne Gerät, Druck, Export, Sicherung und Wiederherstellung, helles und dunkles Farbschema sowie Bedienung auf dem Tablet.

---

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | die ganze App (Inhalt, Spielmodell, Oberfläche) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation als App und Offline-Start |
| `firebase/regeln.json` | Sicherheitsregeln für den Online-Modus |
| `firebase/erwartungen.json` | Erwartungen für die Regelprüfung |
| `tests/` | automatische Tests |

## Tests (für die Weiterentwicklung)

```bash
npm test                                            # Spielmodell; Browsertests, wenn Playwright installiert ist
FIREBASE_EMULATOR_JAR=/pfad/firebase-database-emulator.jar npm test   # zusätzlich Regeln und Online-Modus
```

- `spielmodell.test.mjs` prüft das Marktmodell: Kassenrechnung, Grenzen, unsinnige Eingaben, Ereignisse, Autopilot und Spielbalance.
- `e2e-lokal.test.mjs` spielt ein ganzes Spiel im Browser durch: Gründung, Start-Check, fünf Levels, Zurücknehmen, Reflexion, Transfer, Export und Neuladen.
- `e2e-befunde.test.mjs` sichert behobene Fehler ab: Entwürfe gegenüber neueren Abgaben, manipulierte Resultate, Sicherung in ein anderes Spiel, Sitzungen pro Tab, Kündigungen in der Planungshilfe, fremde Datenbank-Links, Ereignisse, offene Abschnitte und Reflexionsentwürfe.
- `regeln.test.mjs` und `e2e-online.test.mjs` laufen gegen den offiziellen Firebase-Emulator mit den echten Regeln. Getestet werden drei Geräte, ein Netzausfall mit Nachliefern, eine verspätete Abgabe, ein zweites Gerät der Lehrperson und das Löschen.
- `qr.test.mjs` liest die QR-Codes der App mit einem unabhängigen Leser (`npm install --no-save jsqr`).
