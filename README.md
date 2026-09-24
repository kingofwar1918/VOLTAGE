# ⚡ Voltage – das Energy-Drink-Planspiel

Voltage ist ein Planspiel für den WAH-Unterricht im Zyklus 3. Jede Gruppe führt eine eigene Energy-Drink-Firma. Pro Quartal entscheiden die Gruppen über Produktion, Preis, Werbung, Personal, Umwelt und Investitionen. Danach simuliert die App den Markt: Alle Firmen konkurrieren um dieselbe Kundschaft, und jede Gruppe erhält einen Quartalsbericht mit Erklärungen.

Der Aufbau lehnt sich an die Lernumgebung «Wirtschaft entdecken» an: **Einstieg – Planspiel in fünf Levels – Transfer**. Bewertet wird die Firma in den drei Dimensionen der Nachhaltigkeit: Wirtschaft, Umwelt und Gesellschaft. Voltage ist ein eigenständiges Projekt und kein Produkt von Wirtschaftsbildung Schweiz.

- **Eine Datei, keine Installation:** `index.html` läuft im Browser, auch offline.
- **Zwei Spielmodi:** alles auf einem Gerät (ohne Einrichtung) oder jede Gruppe auf ihrem eigenen Tablet (Online-Modus mit Firebase).
- **Als App installierbar** (iPad: Teilen → «Zum Home-Bildschirm»).

> **Stand 24. September 2026:** Die App ist fertig und automatisch getestet (30 Tests: Spielmodell, ganze Spiele im Browser, Online-Modus gegen den Firebase-Emulator). Damit die Klasse spielen kann, fehlen noch einige **einmalige Schritte ausserhalb des Codes**: die App im Internet bereitstellen und – für den Online-Modus – eine eigene Datenbank anlegen. Sie stehen unten unter **[Noch offene Schritte](#noch-offene-schritte)**, Klick für Klick und zum Abhaken.

---

## Sofort ausprobieren

1. Voltage öffnen: den GitHub-Pages-Link (sobald Schritt 2 erledigt ist) oder am Computer die Dateien herunterladen (auf GitHub: **Code → Download ZIP**), entpacken und `index.html` doppelklicken.
2. **«▶ Demo ausprobieren»** antippen. Die Demo legt ein Spiel mit drei Beispielgruppen und zwei Computer-Firmen an und spielt zwei Quartale vor.
3. Im Kontrollraum eine Gruppe mit **«👁️ Als Gruppe öffnen»** ansehen: Entscheidungen, Planungshilfe, Quartalsbericht.

Demo-PINs: Lehrperson `demo`, Gruppen `2468`. Die Demo bleibt auf dem Gerät und lässt sich jederzeit löschen.

---

## Zwei Spielmodi

| | 📱 Ein Gerät | 🌐 Online |
|---|---|---|
| Wer tippt die Entscheidungen ein? | die Lehrperson (von Entscheidungsblättern) oder die Gruppen nacheinander am selben Gerät | jede Gruppe auf ihrem eigenen Tablet |
| Wo liegen die Daten? | nur im Browser dieses Geräts | in eurer eigenen Firebase-Datenbank (Standort EU) |
| Einrichtung | keine (für iPads: Schritte 1–2) | einmalig etwa 30–45 Minuten (Schritte 1–5) |
| Braucht es Internet? | nein | ja – kurze Unterbrüche überbrückt die App |

**📱 Ein Gerät:** Alles läuft im Browser der Lehrperson. Die Gruppen füllen pro Quartal ein **Entscheidungsblatt** aus (Cockpit → «🖨️ Entscheidungsblatt» oder Tab «📝 Eingaben» → «🖨️ Entscheidungsblatt drucken»). Die Lehrperson erfasst die Blätter mit **«✏️ Erfassen»** bzw. **«👁️ Als Gruppe öffnen»**. Alternativ melden sich die Gruppen der Reihe nach am selben Gerät an (Startseite → «Gruppe»). Berichte und Rangliste zeigt die Lehrperson am Beamer.

**🌐 Online:** Die Lehrperson leitet im Kontrollraum, die Gruppen spielen auf ihren Tablets, alles gleicht sich alle paar Sekunden ab. Fällt das WLAN kurz aus, speichert das Tablet die Abgabe und liefert sie automatisch nach.

---

## Noch offene Schritte

Diese Schritte lassen sich nicht im Code erledigen – sie brauchen das GitHub-Konto, dem das Repository gehört, bzw. ein Google-Konto. Die meisten sind **einmalig**; das Firebase-Projekt dient danach allen weiteren Klassen.

| Nr. | Schritt | 📱 Ein Gerät | 🌐 Online | Dauer |
|---|---|---|---|---|
| 1 | [Zweig `main` anlegen](#schritt-1--zweig-main-anlegen) | empfohlen | nötig | 2 Min. |
| 2 | [GitHub Pages einschalten](#schritt-2--github-pages-einschalten) | empfohlen¹ | nötig | 5 Min. |
| 3 | [Firebase-Datenbank anlegen](#schritt-3--firebase-datenbank-anlegen) | – | nötig | 15 Min. |
| 4 | [Datenbank-Adresse in Voltage eintragen](#schritt-4--datenbank-adresse-in-voltage-eintragen) | – | nötig | 5 Min. |
| 5 | [Regeln prüfen](#schritt-5--regeln-prüfen) | – | nötig | 2 Min. |
| 6 | [Datenschutz klären](#schritt-6--datenschutz-klären) | – | nötig | – |
| 7 | [Probelauf im Schulzimmer](#schritt-7--probelauf-im-schulzimmer) | empfohlen | nötig | 20 Min. |
| 8 | [Unterricht vorbereiten](#schritt-8--unterricht-vorbereiten) | nötig | nötig | 30 Min. |
| 9 | [Nach der Einheit: sichern und löschen](#schritt-9--nach-der-einheit-sichern-und-löschen) | nötig | nötig | 10 Min. |

¹ Am Computer läuft der Ein-Geräte-Modus auch per Doppelklick auf `index.html`. Auf dem iPad lässt sich die Datei nicht direkt öffnen – dort braucht es den GitHub-Pages-Link.

Die Oberfläche von GitHub ist englisch; die Beschriftungen sind darum unten englisch zitiert. Die Firebase-Konsole erscheint in der Sprache des Google-Kontos; in Klammern steht jeweils die englische Bezeichnung.

### Schritt 1 · Zweig `main` anlegen

**Warum:** Im Repository gibt es bisher nur den Arbeitszweig `claude/voltage-wirtschaftsspiel-app-3sh099`, und er ist zurzeit auch der Standardzweig. Übersichtlicher ist ein fester Hauptzweig `main`: Dort liegt immer die Version, die die Klasse sieht.

1. <https://github.com/kingofwar1918/VOLTAGE> öffnen und mit dem eigenen GitHub-Konto anmelden.
2. Links über der Dateiliste auf die **Zweig-Auswahl** klicken. Sie zeigt `claude/voltage-wirtschaftsspiel-app-3sh099`.
3. Ins Suchfeld `main` tippen und **«Create branch main from claude/voltage-wirtschaftsspiel-app-3sh099»** anklicken.
4. Oben im Repository **Settings** → links **General** → Abschnitt **«Default branch»** → Symbol mit den zwei Pfeilen (⇄) → `main` wählen → **«Update»** → **«I understand, update the default branch»**.

**Kontrolle:** Die Startseite des Repositorys zeigt jetzt `main` an.

> **Abkürzung:** Wer diesen Schritt überspringt, wählt in Schritt 2 direkt den Zweig `claude/voltage-wirtschaftsspiel-app-3sh099`. Das funktioniert genauso, ist aber weniger übersichtlich.
>
> **Später, bei neuen Versionen:** Änderungen entstehen auf einem eigenen Zweig und kommen über einen Pull Request nach `main`: **Pull requests → New pull request** → oben `base: main` und `compare: <neuer Zweig>` wählen → **Create pull request** → **Merge pull request**. GitHub Pages veröffentlicht die neue Version danach von selbst.

### Schritt 2 · GitHub Pages einschalten

Damit ist Voltage unter einer festen Internetadresse erreichbar – für die Tablets, für den QR-Code und für die Installation als App.

1. Im Repository **Settings** → links unter «Code and automation» **Pages**.
2. Unter **«Build and deployment»** bei **Source** die Option **«Deploy from a branch»** wählen.
3. Bei **Branch** `main` wählen, daneben den Ordner **`/ (root)`** → **«Save»**.
4. Ein bis zwei Minuten warten und die Seite neu laden. Oben erscheint **«Your site is live at …»** mit der Adresse, voraussichtlich <https://kingofwar1918.github.io/VOLTAGE/>. Den Fortschritt zeigt der Tab **Actions** («pages build and deployment»).
5. **Visit site** anklicken und prüfen: Die Startseite von Voltage erscheint, und **«▶ Demo ausprobieren»** funktioniert.
6. Die Adresse als Lesezeichen speichern – auf dem Gerät der Lehrperson und auf den Tablets.

**Gut zu wissen:**

- **Das Repository ist öffentlich.** Das ist nötig, damit Pages mit einem kostenlosen GitHub-Konto funktioniert. Alles darin kann jede Person lesen. Darum gehören keine Namenslisten, Noten oder Exporte aus dem Unterricht ins Repository.
- **Änderungen** auf `main` sind nach wenigen Minuten online. Die Tablets laden die neue Version beim nächsten Öffnen: Voltage lädt zuerst aus dem Netz und nutzt die gespeicherte Kopie nur ohne Verbindung.
- Die leere Datei `.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert veröffentlicht.

### Online-Modus einrichten (Schritte 3–5)

Nur nötig, wenn jede Gruppe auf ihrem eigenen Tablet spielt. Voraussetzung ist ein **Google-Konto** – am besten ein eigenes für die Schule, nicht das private.

#### Schritt 3 · Firebase-Datenbank anlegen

**3a · Projekt erstellen**

1. <https://console.firebase.google.com> öffnen und mit dem Google-Konto anmelden.
2. **«Projekt erstellen»** anklicken (je nach Version auch «Projekt hinzufügen» oder «Mit einem Firebase-Projekt beginnen»; englisch *Create a project*).
3. Einen Namen eingeben, z.B. `voltage-schule`, den Bedingungen zustimmen → **«Weiter»**.
4. Zusatzangebote wie **Google Analytics** oder KI-Hilfe **ausschalten**. Voltage braucht sie nicht, und sie erzeugen nur zusätzliche Datenflüsse.
5. **«Projekt erstellen»** → warten → **«Weiter»**.

**3b · Realtime Database erstellen**

1. Links im Menü **«Realtime Database»** öffnen. Sie steht unter «Build» bzw. «Entwickeln»; falls nicht sichtbar, über «Alle Produkte».
2. **«Datenbank erstellen»** (*Create Database*).
3. Standort **«Belgien (europe-west1)»** wählen. So bleiben die Daten in der EU. ⚠️ Der Standort lässt sich später nicht mehr ändern.
4. Bei den Sicherheitsregeln **«Im gesperrten Modus starten»** (*Start in locked mode*) wählen – **nicht** den Testmodus. Der Testmodus öffnet die ganze Datenbank für alle.
5. **«Aktivieren»** (*Enable*).

**3c · Regeln einspielen**

1. In der Realtime Database den Tab **«Regeln»** (*Rules*) öffnen.
2. Den ganzen vorhandenen Text löschen.
3. Den ganzen Inhalt der Datei [`firebase/regeln.json`](firebase/regeln.json) einfügen. Am einfachsten auf GitHub: Datei öffnen → oben rechts über dem Inhalt **«Copy raw file»** (Symbol mit zwei Rechtecken).
4. **«Veröffentlichen»** (*Publish*) anklicken. Erst dann gelten die Regeln – nur eintippen genügt nicht.

Die Regeln bewirken: Ein Spiel lässt sich nur mit seinem Spielcode lesen und schreiben. Die Liste aller Spiele und die Lehrpersonen-PINs sind gesperrt, und Daten an anderen Stellen der Datenbank werden abgelehnt.

**3d · Adresse kopieren**

Im Tab **«Daten»** (*Data*) steht oben die Adresse der Datenbank, zum Beispiel:

```text
https://voltage-schule-default-rtdb.europe-west1.firebasedatabase.app
```

Diese Adresse kopieren; sie wird in Schritt 4 gebraucht.

**Kosten:** Der kostenlose **Spark-Tarif** genügt; er braucht keine Kreditkarte. Voltage fragt im Online-Modus alle vier Sekunden kleine Datenmengen ab – eine Klasse bleibt damit weit unter den Grenzen des Gratistarifs. Ein Wechsel auf den kostenpflichtigen Blaze-Tarif ist nicht nötig.

#### Schritt 4 · Datenbank-Adresse in Voltage eintragen

Es gibt zwei Wege. **Variante B** ist bequemer, wenn Voltage regelmässig eingesetzt wird.

**Variante A – in der App, ohne Code**

1. Voltage über den GitHub-Pages-Link öffnen → **«Lehrperson»** → **«🌐 Online-Modus»**.
2. Die Adresse ins Feld **«Adresse der Datenbank»** einfügen → **«Testen und speichern»**.
3. Erscheint **«✅ Verbindung klappt. Der Online-Modus ist eingerichtet.»**, ist alles bereit.

Die Adresse ist dann **nur auf diesem Gerät** gespeichert. Die Gruppen erhalten sie automatisch über den **QR-Code bzw. den Klassen-Link** im Kontrollraum. Wichtig: Tippen die Gruppen nur den Spielcode ein, findet ihr Tablet das Spiel nicht – sie brauchen den QR-Code oder den Link. Ein zweites Gerät der Lehrperson braucht die Adresse ebenfalls (dieselben Schritte).

**Variante B – fest in `index.html` (empfohlen)**

1. Auf GitHub im Zweig `main` die Datei `index.html` öffnen → Stift-Symbol **«Edit this file»**.
2. Mit Ctrl+F (Mac: Cmd+F) nach `firebaseUrl` suchen. Die Zeile steht weit oben im Skript, im Block `KONFIG`.
3. Die Adresse zwischen die beiden Anführungszeichen setzen. Sonst nichts verändern; Anführungszeichen und Komma bleiben:

   ```js
   const KONFIG = {
     firebaseUrl: "https://voltage-schule-default-rtdb.europe-west1.firebasedatabase.app",
   ```

4. **«Commit changes…»** → **«Commit directly to the main branch»** → **«Commit changes»**.
5. Nach einigen Minuten kennen alle Geräte die Datenbank, und für die Klasse genügt der Spielcode.

**Kontrolle:** Voltage neu laden → «Lehrperson» → «🌐 Online-Modus» zeigt **«✅ Die Datenbank ist fest in der App eingetragen»**. Unter «＋ Neues Spiel erstellen» ist die Option **«🌐 Online»** wählbar.

Die Adresse ist damit öffentlich im Repository sichtbar. Das ist in Ordnung: Geschützt wird über die Regeln – Spiele lassen sich nur mit ihrem Spielcode öffnen und nicht auflisten.

#### Schritt 5 · Regeln prüfen

Zwei Minuten, die sich lohnen. Die Meldung «✅ Verbindung klappt» aus Schritt 4 zeigt, dass die Voltage-Regeln aktiv sind. Diese Probe zeigt, dass alles andere gesperrt bleibt:

1. Ein **privates Browserfenster** öffnen (Chrome: Ctrl+Shift+N, Safari am Mac: Cmd+Shift+N).
2. Die Adresse der Datenbank mit `/.json` am Ende aufrufen, zum Beispiel:
   `https://voltage-schule-default-rtdb.europe-west1.firebasedatabase.app/.json`
3. Erwartet wird: `"error" : "Permission denied"`.
4. Dasselbe mit `/voltage/spiele.json` und mit `/voltage/lehrer.json` am Ende – ebenfalls «Permission denied».

Erscheinen stattdessen Daten oder `null`, sind die Regeln nicht aktiv. Dann Schritt 3c wiederholen und «Veröffentlichen» nicht vergessen.

### Schritt 6 · Datenschutz klären

**Was Voltage speichert:**

- Firmennamen, Logo und Farbe sowie eine Prüfsumme des Gruppen-PINs
- die Entscheidungen und Resultate jedes Quartals
- die Antworten auf die Reflexions- und Transferfragen (freier Text)
- eine Prüfsumme des Lehrpersonen-PINs

Namen von Personen, Noten und Benutzerkonten braucht es nirgends.

**Vor dem ersten Einsatz im Online-Modus:**

- [ ] Mit der Schulleitung bzw. der ICT-Verantwortlichen klären, ob ein Google-Dienst (Firebase, Standort EU) für ein Lernspiel ohne Personendaten eingesetzt werden darf.
- [ ] Die Klasse anweisen: erfundene Firmennamen, keine echten Namen – auch nicht in den Reflexionsantworten.
- [ ] Kommt der Online-Modus nicht in Frage: Der Ein-Geräte-Modus speichert nichts ausserhalb des Geräts.

Mehr dazu im Abschnitt [Datenschutz](#datenschutz).

### Schritt 7 · Probelauf im Schulzimmer

Am besten im Schul-WLAN und mit einem Tablet der Klasse. Schulnetze filtern manchmal Adressen – der Probelauf zeigt das rechtzeitig.

1. **Lehrperson:** Voltage öffnen → «Lehrperson» → **«＋ Neues Spiel erstellen»**. Name «Probelauf», eigenen PIN wählen, **«🌐 Online»**, Quartale pro Level «1», Computer-Konkurrenz «1 Marke» → **«Spiel erstellen ⚡»**.
2. Der Kontrollraum zeigt **Spielcode, QR-Code und Klassen-Link**.
3. **Tablet:** den QR-Code mit der Kamera scannen. Voltage öffnet direkt das Spiel «Probelauf». Unter **«🚀 Neue Firma gründen»** Markenname, Logo, Dosenfarbe und Gruppen-PIN wählen → **«Firma gründen 🚀»**.
4. **Lehrperson:** Die Firma erscheint nach wenigen Sekunden → **«Quartal 1 freischalten 🔓»**.
5. **Tablet:** Tab «📝 Entscheiden» → **«Entscheidungen abgeben 🚀»**.
6. **Lehrperson:** Das Cockpit zeigt «Abgaben: 1 von 1» → **«📊 Quartal 1 auswerten»**.
7. **Tablet:** Tab «📊 Bericht» zeigt den Quartalsbericht.
8. **Netzausfall testen (freiwillig):** «Quartal 2 freischalten 🔓», auf dem Tablet das WLAN ausschalten und abgeben. Meldung: «📶 Keine Verbindung – eure Abgabe ist gespeichert und wird automatisch übertragen.» WLAN wieder einschalten → «✅ Abgabe für Quartal 2 nachgeliefert».
9. **Aufräumen:** «⚙️ Verwaltung» → **«Spiel endgültig löschen»**.

Klappt etwas nicht, hilft der Abschnitt [Fehlerbehebung](#fehlerbehebung).

### Schritt 8 · Unterricht vorbereiten

**Einstellungen beim Erstellen des Spiels**

| Einstellung | Empfehlung | später änderbar? |
|---|---|---|
| Wo spielen die Gruppen? | 🌐 Online, wenn jede Gruppe ein Tablet hat, sonst 📱 Ein Gerät | nein |
| Startkapital pro Firma | 150'000 Fr. (Standard) | nein |
| Quartale pro Level | 2 (Standard, 10 Quartale); 1 für eine kurze Einheit | ja, als Vorschlag in «⚙️ Verwaltung» |
| Computer-Konkurrenz | 2 Marken bei bis zu vier Gruppen, 0–1 bei vielen Gruppen | nein |
| Jahreszeiten | ja | ja |
| Rangliste für Gruppen | Top 3 und eigener Rang | ja |
| Wertung | Nachhaltig: Wirtschaft, Umwelt, Gesellschaft | ja |

**Zeitbedarf** (Richtwerte, inklusive Einstieg und Transfer)

| Variante | Quartale | Lektionen à 45 Min. |
|---|---|---|
| kurz – 1 Quartal pro Level | 5 | etwa 5 |
| Standard – 2 Quartale pro Level | 10 | etwa 7 |
| lang – 3 Quartale pro Level | 15 | etwa 10 |

Die ersten Quartale brauchen 20–25 Minuten, spätere noch 10–15 Minuten. Wird die Zeit knapp, beim Freischalten des nächsten Quartals einfach das nächste Level wählen – das Level lässt sich pro Quartal frei einstellen.

**Material und Raum**

- **Beamer:** Im Kontrollraum zeigt «📺 Für den Beamer» Spielcode und QR-Code gross. Für die Einführung eignet sich der Tab «❓ Spielregeln», für die Besprechung «📊 Ergebnisse» und «🏆 Rangliste».
- **Gruppen:** 3–4 Personen, ein Tablet pro Gruppe. Tipp: Rollen verteilen – nach und nach bekommt jede ihren eigenen Entscheidungsbereich: Marketing (Level 2), Personal (Level 3), Umwelt (Level 4), Finanzen (Level 1 und 5).
- **Rückfallplan:** Entscheidungsblätter ausdrucken (Tab «📝 Eingaben» → «🖨️ Entscheidungsblatt drucken») und nach jeder Lektion eine Sicherung herunterladen (siehe [Fehlerbehebung](#fehlerbehebung): «Das Netz fällt ganz aus»).
- **Lehrpersonen-PIN notieren.** Er lässt sich in der App nicht zurücksetzen. Gruppen-PINs dagegen setzt die Lehrperson jederzeit neu.

**Tablets**

- Aktueller Safari (iPad) oder Chrome bzw. Edge.
- Voltage als Lesezeichen speichern oder als App installieren:
  - **iPad:** Voltage in Safari öffnen → Teilen-Symbol → **«Zum Home-Bildschirm»**.
  - **Android:** Chrome → Menü ⋮ → **«App installieren»** bzw. «Zum Startbildschirm hinzufügen».

  Die installierte App startet ohne Adressleiste und auch offline. Auf dem iPad speichert sie getrennt von Safari: Wer wechselt, meldet sich einmal mit dem Gruppen-PIN neu an.
- Jede Gruppe möglichst immer am selben Tablet. Beim Neuladen bleibt die Gruppe angemeldet; ein neuer Tab bietet «Weiter →» an.

### Schritt 9 · Nach der Einheit: sichern und löschen

Im Kontrollraum unter **«⚙️ Verwaltung»**:

1. **«⬇️ Resultate (CSV)»** – alle Quartale aller Firmen; öffnet sich in Excel.
2. **«⬇️ Reflexion (CSV)»** – alle Antworten auf die Reflexions- und Transferfragen.
3. **«🖨️ Klassenbericht»** – Übersicht zum Drucken oder zum Speichern als PDF.
4. **«⬇️ Sicherung (JSON)»** – das ganze Spiel; lässt sich später wieder einspielen.
5. **«Spiel endgültig löschen»**.

Die Dateien im eigenen Schulordner ablegen, nicht im öffentlichen Repository.

Freiwillig: In der Firebase-Konsole unter «Daten» → `voltage` → `lehrer` die Einträge alter Spiele löschen. Sie enthalten nur eine Prüfsumme des Lehrpersonen-PINs und bleiben nach dem Löschen eines Spiels stehen. Das Firebase-Projekt selbst bleibt für die nächste Klasse bestehen.

---

## Checkliste zum Abhaken

**Einmalig**

- [ ] Zweig `main` angelegt und als Standard gesetzt (Schritt 1)
- [ ] GitHub Pages eingeschaltet, Link getestet und als Lesezeichen gespeichert (Schritt 2)
- [ ] Firebase-Projekt mit Realtime Database, Standort europe-west1, gesperrter Modus (Schritt 3)
- [ ] Regeln aus `firebase/regeln.json` **veröffentlicht**, nicht nur eingetippt (Schritt 3c)
- [ ] Datenbank-Adresse eingetragen, Meldung «Verbindung klappt» (Schritt 4)
- [ ] Probe im privaten Fenster ergibt «Permission denied» (Schritt 5)
- [ ] Einsatz mit der Schulleitung geklärt (Schritt 6)

**Vor jeder Einheit**

- [ ] Probelauf im Schulnetz mit einem Tablet der Klasse (Schritt 7)
- [ ] Eigener Lehrpersonen-PIN gewählt (kein naheliegender wie `1234`) und notiert
- [ ] Entscheidungsblätter als Rückfallplan gedruckt
- [ ] Beamer: Kontrollraum mit QR-Code bereit

**Während der Einheit**

- [ ] Nach jeder Lektion «⬇️ Sicherung (JSON)» herunterladen

**Nach der Einheit**

- [ ] Resultate und Reflexion exportiert, Sicherung heruntergeladen (Schritt 9)
- [ ] Spiel gelöscht

---

## Fehlerbehebung

**«Kein Spiel mit diesem Code gefunden» (auf dem Tablet)**

- Code vertippt? Er hat 6 Zeichen und enthält weder I und O noch 0 und 1.
- Das Tablet kennt die Datenbank nicht (Variante A in Schritt 4): QR-Code scannen oder den Klassen-Link öffnen, statt den Code einzutippen – oder Variante B einrichten.
- Läuft das Spiel im Ein-Geräte-Modus, gibt es das Spiel nur auf dem Gerät der Lehrperson.

**«Keine Verbindung zur Online-Datenbank» oder Balken «⚠️ Keine Verbindung – versuche erneut …»**

- WLAN prüfen. Abgaben gehen nicht verloren: Das Tablet speichert sie und liefert sie automatisch nach.
- Klappt es im ganzen Schulnetz nicht, filtert es vielleicht die Adresse `firebasedatabase.app`. Die ICT-Verantwortlichen fragen, ob sie freigegeben werden kann.

**«❌ Zugriff verweigert …» beim Einrichten**

- Die Regeln sind nicht veröffentlicht oder nicht vollständig eingefügt → Schritt 3c. Der oberste Pfad in den Regeln muss `voltage` heissen.

**«❌ Datenbank nicht gefunden – stimmt die Adresse?»**

- Die Adresse ist unvollständig. Sie beginnt mit `https://` und endet auf `firebasedatabase.app` (ältere Projekte: `firebaseio.com`).

**Beim neuen Spiel ist «🌐 Online» grau («Zuerst den Online-Modus einrichten.»)**

- Auf diesem Gerät ist keine Datenbank-Adresse gespeichert → Schritt 4.

**Eine Gruppe hat ihren PIN vergessen**

- «⚙️ Verwaltung» → «👥 Firmen verwalten» → bei der Firma «🔑 PIN» → neuen PIN festlegen und der Gruppe mitteilen.

**Tablet neu geladen, Browser geschlossen, anderes Tablet**

- Neu geladen: Die Gruppe bleibt angemeldet.
- Neuer Tab auf demselben Tablet: Bei «Zuletzt auf diesem Gerät» auf «Weiter →» tippen.
- Anderes Tablet: Klassen-Link öffnen → die eigene Firma unter «Wieder anmelden» antippen → Gruppen-PIN.

**Eine Gruppe hat nicht rechtzeitig abgegeben**

- Vor der Auswertung erfasst die Lehrperson die Entscheidungen mit «✏️ Erfassen» (Tab «📝 Eingaben») oder «👁️ Als Gruppe öffnen».
- Ohne Abgabe übernimmt der Autopilot: Die Firma wiederholt ihre letzten Entscheidungen.
- Kommt eine Offline-Abgabe erst nach der Auswertung an, zählt sie nicht mehr. Die Gruppe sieht dann «⏰ Eure Abgabe für Quartal … kam zu spät – der Autopilot hat übernommen.»

**Zu früh ausgewertet oder das Spiel zu früh beendet**

- Im Cockpit «↩️ Auswertung zurücknehmen» – das Quartal ist wieder offen.
- Nach «🏁 Spiel beenden → Transfer»: «▶ Spiel fortsetzen».

**Das Netz fällt ganz aus**

- Kurze Unterbrüche überbrückt die App selbst.
- Bei einem längeren Ausfall: Entscheidungsblätter verteilen und das Spiel im Ein-Geräte-Modus weiterführen. Dafür braucht es eine vorher heruntergeladene Sicherung: neues Spiel mit «📱 Ein Gerät» erstellen → «⚙️ Verwaltung» → «⬆️ Sicherung einspielen» → die Blätter mit «✏️ Erfassen» eingeben. Ist das Netz zurück, im Ein-Geräte-Spiel eine neue Sicherung herunterladen und sie im Online-Spiel einspielen. Die Gruppen-PINs gelten weiter.

**Im Ein-Geräte-Modus sind die Daten weg**

- Voltage speichert im Browser. In einem anderen Browser oder einem privaten Fenster sind die Daten nicht sichtbar, und «Browserdaten löschen» entfernt sie. Darum regelmässig «⬇️ Sicherung (JSON)» herunterladen.

**GitHub Pages zeigt «404»**

- Ein bis zwei Minuten warten und den Tab **Actions** prüfen.
- Unter Settings → Pages kontrollieren: Zweig `main`, Ordner `/ (root)`.
- Die Adresse endet auf `/VOLTAGE/`, in Grossbuchstaben wie der Name des Repositorys.

**Ein Tablet zeigt nach einem Update noch die alte Version**

- Seite neu laden. Eine installierte App ganz schliessen und neu öffnen. GitHub braucht nach einer Änderung einige Minuten.

**Lehrpersonen-PIN vergessen**

In der App lässt er sich nicht zurücksetzen; die Daten der Gruppen bleiben erhalten. Mit etwas Technik lässt sich ein zusätzlicher PIN hinterlegen:

<details>
<summary>Notfall: neuen Lehrpersonen-PIN hinterlegen (am Computer)</summary>

1. Voltage am Computer im Browser öffnen, die Entwicklertools öffnen (F12, am Mac Cmd+Option+I) und den Tab **«Konsole»** (*Console*) wählen. Chrome verlangt beim ersten Einfügen, dass man `allow pasting` eintippt – oder man tippt die Befehle von Hand.
2. Eingeben und Enter drücken – dabei `K7Q2XM` durch den eigenen Spielcode (Grossbuchstaben) und `neuer-pin` durch den neuen PIN ersetzen:

   ```js
   pinHash("K7Q2XM", "neuer-pin")
   ```

   Es erscheint ein Code aus 16 Zeichen, hier `8b2f2c08ce73ce4e`.
3. Diesen Code hinterlegen:
   - **Online-Modus:** Firebase-Konsole → Realtime Database → «Daten» → `voltage` → `lehrer` → Spielcode → «+» → als Schlüssel den 16-stelligen Code, als Wert `true` → «Hinzufügen». Die Firebase-Konsole darf das, die App nicht – so kann niemand über die App einen zweiten PIN setzen.
   - **Ein-Geräte-Modus:** auf dem Gerät, auf dem das Spiel liegt, in derselben Konsole eingeben:

     ```js
     LokalDB.schreib("lehrer/K7Q2XM/" + pinHash("K7Q2XM", "neuer-pin"), true)
     ```

4. In Voltage mit dem neuen PIN anmelden.

</details>

---

## Ablauf im Unterricht

| Phase | Was passiert | Zeitbedarf |
|---|---|---|
| 🧭 **1 · Einstieg** | Gruppen gründen ihre Firma (Name, Logo, Farbe, PIN) und lösen den Start-Check (6 Fragen zu Umsatz, Kosten, Gewinn, Nachhaltigkeit). Die Lehrperson erklärt das Nachhaltigkeitsdreieck (Tab «❓ Spielregeln» am Beamer). | 1 Lektion |
| 🎮 **2 · Planspiel** | Fünf Levels, je 1–3 Quartale. Jedes Level bringt neue Entscheidungen. Nach jedem Level beantworten die Gruppen Reflexionsfragen. | pro Quartal 15–25 Min. |
| 🎓 **3 · Transfer** | Schlussbilanz, Siegerehrung (auch pro Bereich) und Transferfragen: Was bedeutet das für meinen eigenen Einkauf? | 1 Lektion |

**Ein Quartal läuft so ab:**

1. Die Lehrperson schaltet im Cockpit das Quartal frei, wählt das Level (ein Vorschlag ist gesetzt) und bis zu zwei Marktereignisse (z.B. Hitzewelle, TikTok-Trend, Zuckersteuer). Die Ereignisse erscheinen im News-Ticker.
2. Die Gruppen entscheiden. Die **Planungshilfe** rechnet live mit: Kosten pro Dose, Gesamtkosten, Gewinnschwelle, Warnungen. Abgeben lässt sich beliebig oft bis zur Auswertung.
3. Die Lehrperson sieht die Abgaben live und klickt **«📊 Quartal … auswerten»**. Gruppen ohne Abgabe arbeiten mit ihren letzten Entscheidungen weiter (Autopilot).
4. Jede Gruppe liest ihren **Quartalsbericht**: Erfolgsrechnung, «Warum lief es so?», Attraktivität im Marktvergleich, Marktübersicht, Nachhaltigkeit vorher/nachher.
5. Besprechung im Plenum mit dem Tab «📊 Ergebnisse» am Beamer. Wurde zu früh ausgewertet, lässt sich die Auswertung zurücknehmen.

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

## Datenschutz

- Die Gruppen erfinden **Firmennamen**. Echte Namen braucht es nirgends, und es werden keine Noten gespeichert.
- **Ein-Geräte-Modus:** Alle Daten bleiben im Browser des Geräts.
- **Online-Modus:** Die Daten liegen in eurer eigenen Firebase-Datenbank (Standort EU). Die Regeln verhindern, dass jemand die Liste aller Spiele oder die Lehrpersonen-PINs abrufen kann. Wer aber Spielcode und Datenbank-Adresse kennt, kann die Daten dieses Spiels technisch lesen und verändern, denn es gibt keine Anmeldung mit Konto. Die PINs schützen nur die Bedienoberfläche. Für ein Lernspiel ohne Noten reicht das. Bei Unsicherheit mit der Schulleitung klären.
- **Die Datenbank ist kein Archiv:** Nach der Einheit exportieren (CSV, Sicherung) und das Spiel im Kontrollraum löschen.

---

## Anpassen

Alle Inhalte stehen im Block `DATEN` am Anfang des Skripts in `index.html`: Texte, Levels, Reflexions- und Transferfragen, Start-Check, Marktereignisse, Lexikon, Computer-Konkurrenz und alle Zahlen (Preise, Kosten, Löhne, Kapazität, Startkapital). Die Logik darunter liest nur diesen Block.

Technische Einstellungen stehen direkt davor im Block `KONFIG`:

| Wert | Bedeutung |
|---|---|
| `firebaseUrl` | Adresse der Datenbank (siehe Schritt 4, Variante B) |
| `projekt` | oberster Pfad in der Datenbank; muss zu den Regeln passen (`voltage`) |
| `taktMs`, `taktLokalMs` | wie oft die App abgleicht (Millisekunden) |

Wer an den Zahlen (`DATEN.regeln`) dreht, sollte danach die Tests laufen lassen oder ein Spiel durchspielen. Die Werte sind aufeinander abgestimmt.

---

## Was gegenüber der ersten Version verbessert wurde

Die erste Fassung («Voltage – Energy-Drink-Tycoon») lief nur in der Claude-Vorschau:

- **Speichern ging ausserhalb der Vorschau nicht:** Sie nutzte `window.storage`, das es nur in Claude-Artefakten gibt. Als eigene Datei scheiterte darum jedes Speichern, und das Spiel meldete sich sofort wieder ab. Jetzt speichert die App im Browser oder in Firebase.
- **Externe Abhängigkeiten** (Chart.js, Google Fonts) funktionierten im Schulnetz und offline nicht. Die Diagramme sind jetzt eingebaut.
- **Marktmodell:** Erhöhten alle Firmen gemeinsam den Preis, sank die Gesamtnachfrage nicht. Jetzt kaufen bei zu hohen Preisen weniger Leute Energy Drinks.
- **Firmen, die während eines offenen Quartals gegründet wurden,** fehlten bei der Auswertung.
- **Beim automatischen Aktualisieren** flackerten Diagramme, und Eingaben konnten verloren gehen.
- Neu dazugekommen sind: fünf Levels mit Einstieg und Transfer, Nachhaltigkeitsdreieck und Wertung in drei Dimensionen, Reflexionsfragen, Start-Check, Lager und Jahreszeiten, Planungshilfe mit Gewinnschwelle, Computer-Konkurrenz, Autopilot, Auswertung zurücknehmen, Erfassen für Gruppen ohne Gerät, Druck, Export, Sicherung und Wiederherstellung, QR-Code für den Klassen-Link, helles und dunkles Farbschema sowie Bedienung auf dem Tablet.

---

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | die ganze App (Inhalt, Spielmodell, Oberfläche) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation als App und Offline-Start |
| `.nojekyll` | GitHub Pages veröffentlicht die Dateien unverändert |
| `firebase/regeln.json` | Sicherheitsregeln für den Online-Modus |
| `firebase/erwartungen.json` | Erwartungen für die Regelprüfung |
| `package.json`, `tests/` | automatische Tests |

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
