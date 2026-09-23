// Ganzes Spiel im Ein-Geräte-Modus: Lehrperson und zwei Gruppen in Tabs desselben Browsers
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { starteWebserver, ladePlaywright, beobachte } from "./hilfen.mjs";

const pw = ladePlaywright();
let web, browser;
before(async () => { if (pw) { web = await starteWebserver(); browser = await pw.chromium.launch(); } });
after(async () => { if (browser) await browser.close(); if (web) await web.stop(); });

async function dialogJa(seite, text) {
  await seite.locator(".dialog").waitFor();
  await seite.locator(".dialog button", { hasText: text }).click();
}
async function gruppeGruenden(seite, url, code, name, pin) {
  await seite.goto(url);
  // Gleiches Gerät: die zuletzt angemeldete Gruppe ist noch aktiv → Gruppe wechseln
  if (await seite.locator('[data-act="abmelden"]').count()) {
    await seite.click('[data-act="abmelden"]');
    await dialogJa(seite, "Abmelden");
  }
  await seite.click('[data-act="rolleGruppe"]');
  await seite.fill("#beitritt-code", code);
  await seite.click('form[data-form="spielcode"] button[type=submit]');
  await seite.fill("#gr-name", name);
  await seite.fill("#gr-pin", pin);
  await seite.fill("#gr-pin2", pin);
  await seite.click('form[data-form="gruenden"] button[type=submit]');
  await seite.locator(".leiste .kontext", { hasText: name }).waitFor();
}
async function entscheiden(seite, anpassen) {
  await seite.click('[data-act="tabG"][data-tab="entscheiden"]');
  await seite.locator("#planung").waitFor();
  if (anpassen) await anpassen(seite);
  await seite.click('[data-act="abgeben"]');
  await seite.locator(".hinweis.gut", { hasText: "Abgegeben um" }).waitFor();
}

test("Ein-Geräte-Modus: vom Einstieg bis zum Transfer", { skip: !pw && "Playwright nicht gefunden", timeout: 180000 }, async () => {
  const kontext = await browser.newContext({ viewport: { width: 1100, height: 900 }, acceptDownloads: true });
  const fehler = [];
  const lehrer = await kontext.newPage(); beobachte(lehrer, fehler);
  const alpha = await kontext.newPage(); beobachte(alpha, fehler);
  const beta = await kontext.newPage(); beobachte(beta, fehler);
  const url = web.url + "/index.html";

  // Phase 1: Spiel erstellen
  await lehrer.goto(url);
  await lehrer.click('[data-act="rolleLehrer"]');
  await lehrer.click('[data-act="lehrerNeu"]');
  await lehrer.fill("#sn-name", "Testklasse 2b");
  await lehrer.fill("#sn-pin", "4711");
  await lehrer.fill("#sn-pin2", "4711");
  await lehrer.selectOption("#sn-ki", "1");
  await lehrer.selectOption("#sn-runden", "1");
  await lehrer.click('form[data-form="spielNeu"] button[type=submit]');
  await lehrer.locator("h2", { hasText: "Phase 1 · Einstieg" }).waitFor();
  const code = (await lehrer.textContent(".code")).trim();
  assert.match(code, /^[A-HJ-NP-Z2-9]{6}$/);

  // Gruppen gründen ihre Firmen, Alpha löst den Start-Check
  await gruppeGruenden(alpha, url, code, "Alpha Drinks", "1357");
  await gruppeGruenden(beta, url, code, "Beta Boost", "2468");
  await alpha.click('[data-act="quizStart"]');
  for (let i = 0; i < 6; i++) {
    await alpha.click('[data-act="quizAntwort"][data-i="1"]');
    await alpha.click('[data-act="quizWeiter"]');
  }
  await alpha.locator("h2", { hasText: "Start-Check geschafft" }).waitFor();
  await lehrer.locator("text=Beta Boost").first().waitFor();

  // Quartal 1 mit Ereignis öffnen
  await lehrer.click('[data-act="ereignis"][data-ev="hitzewelle"]');
  await lehrer.click('[data-act="rundeOeffnen"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 läuft" }).waitFor();

  // Gruppen entscheiden (Stepper, Richtwert, Preis)
  await entscheiden(alpha, async (s) => {
    await s.click('[data-act="richtwert"]');
    await s.click('[data-act="schritt"][data-feld="preis"][data-d="0.1"]');
  });
  await entscheiden(beta, async (s) => {
    await s.click('[data-act="schritt"][data-feld="menge"][data-d="1000"]');
    await s.fill("#e-menge", "58000");
  });
  await lehrer.locator("text=Abgaben: 2 von 2").waitFor({ timeout: 10000 });

  // Auswerten, zurücknehmen, nochmals auswerten
  await lehrer.click('[data-act="auswerten"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 ist ausgewertet" }).waitFor();
  await lehrer.click('[data-act="auswertungZurueck"]');
  await dialogJa(lehrer, "Zurücknehmen");
  await lehrer.locator("h2", { hasText: "Quartal 1 läuft" }).waitFor();
  await lehrer.click('[data-act="auswerten"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 ist ausgewertet" }).waitFor();

  // Bericht der Gruppe
  await alpha.click('[data-act="tabG"][data-tab="bericht"]');
  await alpha.locator("h2", { hasText: "Quartalsbericht Q1" }).waitFor({ timeout: 10000 });
  assert.ok(await alpha.locator(".notizen li").count() >= 2, "Erklärungen im Bericht");
  const preisAlpha = await alpha.locator("tr.ich td.z").first().textContent();
  assert.equal(preisAlpha.trim(), "3.10");

  // Reflexion Level 1 (bei 1 Quartal pro Level sofort freigeschaltet)
  await alpha.click('[data-act="tabG"][data-tab="reflexion"]');
  await alpha.fill("#rf-l1-0", "Wir haben die Prognose genommen und etwas mehr produziert.");
  await alpha.click('form[data-form="reflexion"] button[type=submit]');
  await alpha.locator(".chip.offen", { hasText: "gespeichert" }).first().waitFor();

  // Quartale 2–5 (Level 2–5): Lehrperson öffnet und wertet aus, Alpha entscheidet in Level 3 über Personal
  for (let q = 2; q <= 5; q++) {
    await lehrer.click('[data-act="tabL"][data-tab="cockpit"]');
    await lehrer.click('[data-act="rundeOeffnen"]');
    await lehrer.locator("h2", { hasText: `Quartal ${q} läuft` }).waitFor();
    if (q === 3) {
      await entscheiden(alpha, async (s) => {
        await s.locator("h3", { hasText: "Mitarbeitende" }).waitFor();
        await s.click('[data-act="schritt"][data-feld="personal"][data-d="1"]');
        await s.click('[data-act="option"][data-feld="lohn"][data-wert="hoch"]');
      });
    }
    if (q === 5) {
      await entscheiden(alpha, async (s) => {
        await s.click('[data-act="option"][data-feld="investSolar"]');
        const planung = await s.textContent("#planung");
        assert.match(planung, /Abschreibung/);
      });
    }
    await lehrer.click('[data-act="auswerten"]');
    await dialogJa(lehrer, "Jetzt auswerten");
    await lehrer.locator("h2", { hasText: `Quartal ${q} ist ausgewertet` }).waitFor();
  }
  // Wirkungen prüfen: Personal +1 in Q3, Solaranlage in Q5
  await alpha.click('[data-act="tabG"][data-tab="zentrale"]');
  await alpha.locator("text=Solaranlage").first().waitFor({ timeout: 10000 });

  // Lehrperson sieht die Reflexion
  await lehrer.click('[data-act="tabL"][data-tab="reflexion"]');
  await lehrer.locator("summary", { hasText: "Level 1" }).click();
  await lehrer.locator("text=Wir haben die Prognose genommen").waitFor();

  // Phase 3: Transfer
  await lehrer.click('[data-act="tabL"][data-tab="cockpit"]');
  await lehrer.click('[data-act="spielBeenden"]');
  await dialogJa(lehrer, "Spiel beenden");
  await lehrer.locator("h2", { hasText: "Siegerehrung" }).waitFor();
  await beta.click('[data-act="tabG"][data-tab="zentrale"]');
  await beta.locator("h2", { hasText: "Schlussbilanz" }).waitFor({ timeout: 10000 });
  await beta.click('[data-act="tabG"][data-tab="reflexion"]');
  await beta.fill("#rf-transfer-0", "Auf Preis, Zucker und Verpackung.");
  await beta.click('form[data-form="reflexion"][data-teil="transfer"] button[type=submit]');
  await beta.locator("summary", { hasText: "Transfer" }).locator(".chip", { hasText: "gespeichert" }).waitFor();

  // Export
  await lehrer.click('[data-act="tabL"][data-tab="verwaltung"]');
  const [download] = await Promise.all([lehrer.waitForEvent("download"), lehrer.click('[data-act="exportCsv"]')]);
  assert.match(download.suggestedFilename(), /^voltage-testklasse-2b-resultate\.csv$/);
  const csv = fs.readFileSync(await download.path(), "utf8");
  assert.ok(csv.startsWith("﻿\"Quartal\";"));
  assert.equal(csv.trim().split("\r\n").length, 1 + 5 * 3, "5 Quartale × 3 Firmen");

  // Neu laden: Lehrperson bleibt angemeldet, Gruppe ebenfalls
  await lehrer.reload();
  await lehrer.locator(".leiste .kontext", { hasText: "Kontrollraum" }).waitFor();
  await beta.reload();
  await beta.locator(".leiste .kontext", { hasText: "Beta Boost" }).waitFor();

  // Falscher PIN beim Wiederanmelden
  await alpha.click('[data-act="abmelden"]');
  await dialogJa(alpha, "Abmelden");
  await alpha.click('[data-act="rolleGruppe"]');
  await alpha.fill("#beitritt-code", code);
  await alpha.click('form[data-form="spielcode"] button[type=submit]');
  await alpha.click('[data-act="firmaWaehlen"] >> text=Alpha Drinks');
  await alpha.fill("#login-pin", "0000");
  await alpha.click('form[data-form="gruppeLogin"] button[type=submit]');
  await alpha.locator("#toast", { hasText: "PIN stimmt nicht" }).waitFor();
  await alpha.fill("#login-pin", "1357");
  await alpha.click('form[data-form="gruppeLogin"] button[type=submit]');
  await alpha.locator(".leiste .kontext", { hasText: "Alpha Drinks" }).waitFor();

  assert.deepEqual(fehler, [], "keine Fehler in der Konsole");
  await kontext.close();
});

test("Demo und Lehrpersonen-Ansicht einer Gruppe", { skip: !pw && "Playwright nicht gefunden", timeout: 60000 }, async () => {
  const kontext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const fehler = [];
  const s = await kontext.newPage(); beobachte(s, fehler);
  await s.goto(web.url + "/index.html");
  await s.click('[data-act="demo"]');
  await s.locator("h2", { hasText: "Quartal 3 läuft" }).waitFor();
  for (const tab of ["ergebnisse", "rangliste", "eingaben", "reflexion", "regeln", "verwaltung", "cockpit"]) {
    await s.click(`[data-act="tabL"][data-tab="${tab}"]`);
    const breite = await s.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(breite <= 390, `kein horizontales Scrollen im Tab ${tab} (${breite}px)`);
  }
  await s.click('[data-act="alsGruppe"] >> nth=1');
  await s.locator("#planung").waitFor();
  await s.click('[data-act="abgeben"]');
  await s.locator(".hinweis.gut", { hasText: "von der Lehrperson erfasst" }).waitFor();
  await s.click('[data-act="zurueckKontrollraum"] >> nth=0');
  await s.locator("text=Abgaben: 2 von 3").waitFor();
  assert.deepEqual(fehler, []);
  await kontext.close();
});
