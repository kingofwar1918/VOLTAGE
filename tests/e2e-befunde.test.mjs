// Regressionstests zu Befunden aus der Code-Prüfung (Ein-Geräte-Modus, mehrere Tabs)
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { starteWebserver, ladePlaywright, beobachte } from "./hilfen.mjs";

const pw = ladePlaywright();
let web, browser;
before(async () => { if (pw) { web = await starteWebserver(); browser = await pw.chromium.launch(); } });
after(async () => { if (browser) await browser.close(); if (web) await web.stop(); });
const ohne = !pw && "Playwright nicht gefunden";

async function dialogJa(seite, text) {
  await seite.locator(".dialog").waitFor();
  await seite.locator(".dialog button", { hasText: text }).click();
}
async function spielErstellen(seite, url, { name = "Befunde", ki = "0", runden = "2" } = {}) {
  await seite.goto(url);
  await seite.click('[data-act="rolleLehrer"]');
  await seite.click('[data-act="lehrerNeu"]');
  await seite.fill("#sn-name", name);
  await seite.fill("#sn-pin", "9876");
  await seite.fill("#sn-pin2", "9876");
  await seite.selectOption("#sn-ki", ki);
  await seite.selectOption("#sn-runden", runden);
  await seite.click('form[data-form="spielNeu"] button[type=submit]');
  await seite.locator("h2", { hasText: "Phase 1 · Einstieg" }).waitFor();
  return (await seite.textContent(".code")).trim();
}
async function gruenden(seite, url, code, name, pin) {
  await seite.goto(`${url}?spiel=${code}`);
  await seite.fill("#gr-name", name);
  await seite.fill("#gr-pin", pin);
  await seite.fill("#gr-pin2", pin);
  await seite.click('form[data-form="gruenden"] button[type=submit]');
  await seite.locator(".leiste .kontext", { hasText: name }).waitFor();
  return seite.evaluate(() => App.sitzung.fid);
}
const spielDaten = (seite, code) => seite.evaluate((c) => JSON.parse(localStorage.getItem("voltage:db:spiele/" + c)), code);
const setzeSpielDaten = (seite, code, daten) => seite.evaluate(([c, d]) => localStorage.setItem("voltage:db:spiele/" + c, JSON.stringify(d)), [code, daten]);

test("Entwürfe verdecken keine neueren Abgaben (Lehrperson und Gruppe)", { skip: ohne, timeout: 120000 }, async () => {
  const k = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  const fehler = [];
  const lehrer = await k.newPage(); beobachte(lehrer, fehler);
  const alpha = await k.newPage(); beobachte(alpha, fehler);
  const url = web.url + "/index.html";
  const code = await spielErstellen(lehrer, url);
  const fid = await gruenden(alpha, url, code, "Alpha", "1357");
  await lehrer.locator("text=Alpha").first().waitFor();
  await lehrer.click('[data-act="rundeOeffnen"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 läuft" }).waitFor();

  // Lehrperson schaut die Gruppe an, tippt etwas (Entwurf) und geht ohne Abgabe zurück
  const alsAlpha = lehrer.locator(`[data-act="alsGruppe"][data-fid="${fid}"]`).first();
  await alsAlpha.click();
  await lehrer.locator("#planung").waitFor();
  await lehrer.fill("#e-menge", "52000");
  await lehrer.waitForTimeout(600);
  await lehrer.click('.banner [data-act="zurueckKontrollraum"]');
  await lehrer.waitForTimeout(600);   // Entwürfe werden 400 ms verzögert gespeichert (auch beim Verlassen des Felds)

  // Gruppe gibt 70'000 ab – der Entwurf darf danach nicht wieder auftauchen
  await alpha.click('.tab[data-act="tabG"][data-tab="entscheiden"]');
  await alpha.locator("#planung").waitFor();
  await alpha.fill("#e-menge", "70000");
  await alpha.click('[data-act="abgeben"]');
  await alpha.locator(".hinweis.gut", { hasText: "Abgegeben um" }).waitFor();
  await alpha.waitForTimeout(1000);
  assert.equal(await alpha.evaluate((s) => localStorage.getItem("voltage:entwurf:" + s), `${code}:${fid}:r1`), null, "gelöschter Entwurf bleibt gelöscht");

  // Lehrperson öffnet die Gruppe wieder: ihr alter Entwurf weicht der Abgabe (70'000)
  await lehrer.locator("text=Abgaben: 1 von 1").waitFor({ timeout: 10000 });
  await alsAlpha.click();
  await lehrer.locator("#planung").waitFor();
  await lehrer.locator(".hinweis", { hasText: "auf einem anderen Gerät geändert" }).waitFor();
  assert.equal(await lehrer.inputValue("#e-menge"), "70000");
  assert.equal(await lehrer.locator(".hinweis", { hasText: "Änderungen, die noch nicht abgegeben" }).count(), 0);

  // Lehrperson korrigiert auf 65'000 – das Gerät der Gruppe zeigt den neuen Stand
  await lehrer.fill("#e-menge", "65000");
  await lehrer.click('[data-act="abgeben"]');
  await lehrer.locator(".hinweis.gut", { hasText: "von der Lehrperson erfasst" }).waitFor();
  await alpha.locator(".hinweis", { hasText: "auf einem anderen Gerät geändert" }).waitFor({ timeout: 10000 });
  assert.equal(await alpha.inputValue("#e-menge"), "65000");
  const daten = await spielDaten(lehrer, code);
  assert.equal(daten.entscheide.r1[fid].menge, 65000);
  assert.ok(!Object.keys(daten.entscheide.r1[fid]).some((x) => x.startsWith("_")), "keine internen Felder in der Abgabe");
  assert.deepEqual(fehler, []);
  await k.close();
});

test("Manipulierte Resultate führen keinen Code aus", { skip: ohne, timeout: 120000 }, async () => {
  const k = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  const fehler = [];
  const lehrer = await k.newPage(); beobachte(lehrer, fehler);
  const gruppe = await k.newPage(); beobachte(gruppe, fehler);
  const url = web.url + "/index.html";
  const code = await spielErstellen(lehrer, url, { ki: "1" });
  const fid = await gruenden(gruppe, url, code, "Gamma", "2468");
  await lehrer.locator("text=Gamma").first().waitFor();
  await lehrer.click('[data-act="rundeOeffnen"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 läuft" }).waitFor();
  await lehrer.click('[data-act="auswerten"]');
  await dialogJa(lehrer, "Jetzt auswerten");
  await lehrer.locator("h2", { hasText: "Quartal 1 ist ausgewertet" }).waitFor();

  const boese = '<img src=x onerror="window.__xss=(window.__xss||0)+1">';
  const d = await spielDaten(lehrer, code);
  const x = d.resultate.r1.firmen[fid];
  Object.assign(x, { marktanteil: boese, gewinn: boese, eingestellt: boese, verkauft: boese });
  x.punkte = { wirtschaft: boese, umwelt: boese, gesellschaft: boese, gesamt: boese };
  x.entscheid.preis = boese; x.entscheid.lohn = boese;
  x.zustand.kasse = boese; x.zustand.image = boese;
  d.resultate.r1.saison = { name: boese, ic: boese };
  d.resultate.r1.level = boese;
  d.spiel.version += 1;
  await setzeSpielDaten(lehrer, code, d);

  for (const tab of ["cockpit", "ergebnisse", "rangliste", "eingaben"]) {
    await lehrer.click(`.tab[data-act="tabL"][data-tab="${tab}"]`);
    await lehrer.waitForTimeout(150);
  }
  for (const tab of ["zentrale", "bericht", "rangliste"]) {
    await gruppe.click(`.tab[data-act="tabG"][data-tab="${tab}"]`);
    await gruppe.waitForTimeout(150);
  }
  await gruppe.waitForTimeout(2000);
  for (const s of [lehrer, gruppe]) {
    assert.equal(await s.evaluate(() => window.__xss), undefined, "eingeschleuster Code wurde ausgeführt");
    assert.equal(await s.locator('img[src="x"]').count(), 0);
  }
  assert.deepEqual(fehler.filter((f) => !/Failed to load resource/.test(f)), []);
  await k.close();
});

test("Sicherung in ein anderes Spiel einspielen: Gruppen-PINs gelten weiter", { skip: ohne, timeout: 120000 }, async () => {
  const k = await browser.newContext({ viewport: { width: 1000, height: 900 }, acceptDownloads: true });
  const lehrer = await k.newPage(), gruppe = await k.newPage();
  const url = web.url + "/index.html";
  const codeA = await spielErstellen(lehrer, url, { name: "Spiel A" });
  await gruenden(gruppe, url, codeA, "Delta", "4242");
  await lehrer.locator("text=Delta").first().waitFor();
  await lehrer.click('.tab[data-act="tabL"][data-tab="verwaltung"]');
  const [download] = await Promise.all([lehrer.waitForEvent("download"), lehrer.click('[data-act="sicherung"]')]);
  const pfad = await download.path();
  assert.equal(JSON.parse(fs.readFileSync(pfad, "utf8")).code, codeA);

  await lehrer.click('[data-act="abmelden"]');
  const codeB = await spielErstellen(lehrer, url, { name: "Spiel B" });
  assert.notEqual(codeA, codeB);
  await lehrer.click('.tab[data-act="tabL"][data-tab="verwaltung"]');
  await lehrer.setInputFiles("#sicherung-datei", pfad);
  await dialogJa(lehrer, "Einspielen");
  await lehrer.locator("#toast", { hasText: "Sicherung eingespielt" }).waitFor();

  await gruppe.click('[data-act="abmelden"]');
  await dialogJa(gruppe, "Abmelden");
  await gruppe.goto(`${url}?spiel=${codeB}`);
  await gruppe.click('[data-act="firmaWaehlen"] >> text=Delta');
  await gruppe.fill("#login-pin", "4242");
  await gruppe.click('form[data-form="gruppeLogin"] button[type=submit]');
  await gruppe.locator(".leiste .kontext", { hasText: "Delta" }).waitFor();
  assert.equal(await gruppe.evaluate(() => App.sitzung.code), codeB);
  await k.close();
});

test("Sitzungen gelten pro Tab; ein neuer Tab bietet «Weiter» an", { skip: ohne, timeout: 120000 }, async () => {
  const k = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  const lehrer = await k.newPage(), a = await k.newPage(), b = await k.newPage();
  const url = web.url + "/index.html";
  const code = await spielErstellen(lehrer, url);
  await gruenden(a, url, code, "Alpha", "1111");
  await gruenden(b, url, code, "Beta", "2222");
  await a.reload();
  await a.locator(".leiste .kontext", { hasText: "Alpha" }).waitFor();
  await lehrer.reload();
  await lehrer.locator(".leiste .kontext", { hasText: "Kontrollraum" }).waitFor();
  const neu = await k.newPage();
  await neu.goto(url);
  await neu.locator(".karte", { hasText: "Zuletzt auf diesem Gerät" }).waitFor();
  assert.equal(await neu.locator('[data-act="rolleGruppe"]').count(), 1, "Startseite statt fremder Firma");
  await neu.click('[data-act="weiterAls"]');
  await neu.locator(".leiste .kontext", { hasText: "Beta" }).waitFor();
  await k.close();
});

test("Planungshilfe rechnet mit Kündigungen wie das Spielmodell", { skip: ohne, timeout: 120000 }, async () => {
  const k = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  const lehrer = await k.newPage(), gruppe = await k.newPage();
  const url = web.url + "/index.html";
  const code = await spielErstellen(lehrer, url, { runden: "1" });
  const fid = await gruenden(gruppe, url, code, "Epsilon", "3333");
  await lehrer.locator("text=Epsilon").first().waitFor();
  await lehrer.click('[data-act="rundeOeffnen"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 läuft" }).waitFor();
  await lehrer.click('[data-act="auswerten"]');
  await dialogJa(lehrer, "Jetzt auswerten");
  await lehrer.locator("h2", { hasText: "Quartal 1 ist ausgewertet" }).waitFor();
  // Zufriedenheit auf 20 setzen, dann Level 3 öffnen
  const d = await spielDaten(lehrer, code);
  d.resultate.r1.firmen[fid].zustand.zufriedenheit = 20;
  d.spiel.version += 1;
  await setzeSpielDaten(lehrer, code, d);
  await lehrer.click('[data-act="aktualisieren"]');
  await lehrer.selectOption("#plan-level", "3");
  await lehrer.click('[data-act="rundeOeffnen"]');
  await lehrer.locator("h2", { hasText: "Quartal 2 läuft" }).waitFor();
  await gruppe.click('.tab[data-act="tabG"][data-tab="entscheiden"]');
  await gruppe.locator("#planung").waitFor({ timeout: 10000 });
  await gruppe.locator(".hinweis", { hasText: "kündigt eine Person" }).waitFor();
  // Erwartet: eine Person weniger als im Vorquartal – genau wie im Spielmodell
  const { vorher, erwartet } = await gruppe.evaluate(() => {
    const z = zustandVor(App.sitzung.fid, App.spiel.runde);
    const zz = Object.assign({}, z, { mitarbeitende: z.mitarbeitende - 1 });
    return { vorher: z.mitarbeitende, erwartet: fmt(Engine.kapazitaetVon(zz, Engine.effekte(App.spiel.ereignisse))) };
  });
  assert.equal(vorher, 4);
  const hinweis = await gruppe.textContent("#kap-hinweis");
  assert.ok(hinweis.startsWith(`Kapazität: ${erwartet} Dosen`), `${hinweis} ≠ ${erwartet}`);
  assert.ok((await gruppe.textContent("#planung")).includes("(3 Personen)"));
  // Gegenprobe mit dem Spielmodell: dieselbe Zahl Mitarbeitende nach der Auswertung
  await lehrer.click('[data-act="auswerten"]');
  await dialogJa(lehrer, "Jetzt auswerten");
  await lehrer.locator("h2", { hasText: "Quartal 2 ist ausgewertet" }).waitFor();
  const nachher = await spielDaten(lehrer, code);
  assert.equal(nachher.resultate.r2.firmen[fid].zustand.mitarbeitende, 3);
  assert.equal(nachher.resultate.r2.firmen[fid].gekuendigt, 1);
  await k.close();
});

test("?db= im Link überschreibt die gespeicherte Datenbank nicht", { skip: ohne, timeout: 60000 }, async () => {
  const k = await browser.newContext();
  const s = await k.newPage();
  const url = web.url + "/index.html";
  await s.goto(url);
  await s.evaluate(() => localStorage.setItem("voltage:firebaseUrl", JSON.stringify("https://schule-a-default-rtdb.europe-west1.firebasedatabase.app")));
  await s.goto(url + "?db=" + encodeURIComponent("https://fremd-default-rtdb.europe-west1.firebasedatabase.app"));
  assert.equal(await s.evaluate(() => JSON.parse(localStorage.getItem("voltage:firebaseUrl"))), "https://schule-a-default-rtdb.europe-west1.firebasedatabase.app");
  assert.equal(await s.evaluate(() => onlineAdresse()), "https://fremd-default-rtdb.europe-west1.firebasedatabase.app", "gilt nur für diesen Tab");
  const zweiter = await k.newPage();
  await zweiter.goto(url);
  assert.equal(await zweiter.evaluate(() => onlineAdresse()), "https://schule-a-default-rtdb.europe-west1.firebasedatabase.app");
  await k.close();
});

test("Kleinigkeiten: Ereignisse, offene Abschnitte, Reflexionsentwurf", { skip: ohne, timeout: 120000 }, async () => {
  const k = await browser.newContext({ viewport: { width: 1000, height: 900 } });
  const lehrer = await k.newPage(), gruppe = await k.newPage();
  const url = web.url + "/index.html";
  const code = await spielErstellen(lehrer, url, { runden: "1" });
  await gruenden(gruppe, url, code, "Zeta", "5555");
  await lehrer.locator("text=Zeta").first().waitFor();
  // Versteckte Ereignisse zählen nicht
  await lehrer.selectOption("#plan-level", "2");
  await lehrer.click('[data-act="ereignis"][data-ev="tiktok"]');
  await lehrer.click('[data-act="ereignis"][data-ev="influencer"]');
  await lehrer.selectOption("#plan-level", "1");
  await lehrer.click('[data-act="ereignis"][data-ev="hitzewelle"]');
  assert.equal(await lehrer.getAttribute('[data-act="ereignis"][data-ev="hitzewelle"]', "aria-pressed"), "true");
  await lehrer.click('[data-act="rundeOeffnen"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 läuft" }).waitFor();
  await lehrer.click('[data-act="auswerten"]');
  await dialogJa(lehrer, "Jetzt auswerten");
  await lehrer.locator("h2", { hasText: "Quartal 1 ist ausgewertet" }).waitFor();
  await lehrer.click('[data-act="rundeOeffnen"]');
  // Offener Abschnitt bleibt offen, auch wenn eine Gruppe abgibt
  await lehrer.click('.tab[data-act="tabL"][data-tab="eingaben"]');
  await lehrer.locator("summary", { hasText: "Quartal 1" }).click();
  await gruppe.click('.tab[data-act="tabG"][data-tab="entscheiden"]');
  await gruppe.locator("#planung").waitFor();
  await gruppe.click('[data-act="abgeben"]');
  await lehrer.locator('[data-act="alsGruppe"]', { hasText: "Ändern" }).waitFor({ timeout: 10000 });
  await lehrer.waitForTimeout(500);
  assert.equal(await lehrer.locator('details[data-auf="eing-r1"]').getAttribute("open"), "");
  // Reflexionsentwurf übersteht das Neuladen
  await gruppe.click('.tab[data-act="tabG"][data-tab="reflexion"]');
  await gruppe.fill("#rf-l1-0", "Noch nicht gespeichert, aber nicht verloren.");
  await gruppe.fill("#rf-l1-1", "Auch das zweite Feld bleibt.");   // sofort weiter ins nächste Feld
  await gruppe.waitForTimeout(700);
  await gruppe.reload();
  await gruppe.click('.tab[data-act="tabG"][data-tab="reflexion"]');
  assert.equal(await gruppe.inputValue("#rf-l1-0"), "Noch nicht gespeichert, aber nicht verloren.");
  assert.equal(await gruppe.inputValue("#rf-l1-1"), "Auch das zweite Feld bleibt.");
  // Nach dem Speichern sind die Entwürfe weg
  await gruppe.click('form[data-form="reflexion"][data-teil="l1"] button[type=submit]');
  await gruppe.locator("#toast", { hasText: "Antworten gespeichert" }).waitFor();
  assert.deepEqual(await gruppe.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("voltage:rf:"))), []);
  await k.close();
});
