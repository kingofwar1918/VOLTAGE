// Online-Modus: Lehrperson und Gruppen auf getrennten Geräten, Daten im Firebase-Emulator (mit den echten Regeln)
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { starteWebserver, starteEmulator, starteVermittler, ladePlaywright, beobachte } from "./hilfen.mjs";

const pw = ladePlaywright();
const ohne = !pw ? "Playwright nicht gefunden" : !process.env.FIREBASE_EMULATOR_JAR ? "FIREBASE_EMULATOR_JAR nicht gesetzt" : false;
let web, emu, netz, browser;
before(async () => {
  if (ohne) return;
  web = await starteWebserver();
  emu = await starteEmulator();
  netz = await starteVermittler(emu);
  browser = await pw.chromium.launch();
});
after(async () => {
  if (browser) await browser.close();
  if (netz) await netz.stop();
  if (emu) emu.stop();
  if (web) await web.stop();
});

async function dialogJa(seite, text) {
  await seite.locator(".dialog").waitFor();
  await seite.locator(".dialog button", { hasText: text }).click();
}
// Fehlgeschlagene Netzanfragen während des simulierten Ausfalls sind erwartet
const echteFehler = (liste) => liste.filter((f) => !/Failed to load resource|ERR_EMPTY_RESPONSE|ERR_CONNECTION|net::/.test(f));

test("Online-Modus mit drei Geräten", { skip: ohne, timeout: 240000 }, async () => {
  await emu.leeren();
  const fehler = [];
  const geraet = async (breite = 1100) => { const k = await browser.newContext({ viewport: { width: breite, height: 900 } }); const s = await k.newPage(); beobachte(s, fehler); return s; };
  const lehrer = await geraet();

  // Online-Modus einrichten und Spiel erstellen
  await lehrer.goto(web.url + "/index.html");
  await lehrer.click('[data-act="rolleLehrer"]');
  await lehrer.click('[data-act="einrichten"]');
  await lehrer.fill("#fb-url", "http://127.0.0.1:1/");
  await lehrer.click('form[data-form="einrichten"] button[type=submit]');
  await lehrer.locator("#fb-test", { hasText: "Keine Verbindung" }).waitFor();
  await lehrer.fill("#fb-url", netz.url);
  await lehrer.click('form[data-form="einrichten"] button[type=submit]');
  await lehrer.locator("#fb-test", { hasText: "Verbindung klappt" }).waitFor();
  await lehrer.locator('[data-act="lehrerNeu"]').waitFor();
  await lehrer.click('[data-act="lehrerNeu"]');
  await lehrer.fill("#sn-name", "Online 3a");
  await lehrer.fill("#sn-pin", "geheim7");
  await lehrer.fill("#sn-pin2", "geheim7");
  assert.equal(await lehrer.isChecked('input[name="modus"][value="online"]'), true);
  await lehrer.click('form[data-form="spielNeu"] button[type=submit]');
  await lehrer.locator("h2", { hasText: "Phase 1 · Einstieg" }).waitFor();
  const code = (await lehrer.textContent(".code")).trim();
  const link = (await lehrer.locator(".karte span.zahl").first().textContent()).trim();
  assert.ok(link.includes(`spiel=${code}`) && link.includes("db="), "Klassen-Link enthält Code und Datenbank");
  assert.equal(await lehrer.locator(".karte svg.qr").count(), 1, "QR-Code im Cockpit");
  await lehrer.click('[data-act="beamerZugang"]');
  await lehrer.locator(".dialog.beamer .code", { hasText: code }).waitFor();
  await lehrer.locator(".dialog.beamer button", { hasText: "Schliessen" }).click();

  // Zwei Gruppen auf eigenen Geräten (Tablet- und Handybreite)
  const g1 = await geraet(820), g2 = await geraet(390);
  for (const [g, name, pin] of [[g1, "Nordwind", "1111"], [g2, "Solaris", "2222"]]) {
    await g.goto(link);
    await g.fill("#gr-name", name);
    await g.fill("#gr-pin", pin);
    await g.fill("#gr-pin2", pin);
    await g.click('form[data-form="gruenden"] button[type=submit]');
    await g.locator(".leiste .kontext", { hasText: name }).waitFor();
  }
  await lehrer.getByText("2 Gruppen · 2 Computer").waitFor({ timeout: 15000 });

  // Quartal 1: beide geben ab, Lehrperson sieht es live
  await lehrer.click('[data-act="rundeOeffnen"]');
  for (const g of [g1, g2]) {
    await g.locator('.tab[data-act="tabG"][data-tab="entscheiden"]').click();
    await g.locator("#planung").waitFor({ timeout: 15000 });
    await g.click('[data-act="abgeben"]');
    await g.locator(".hinweis.gut", { hasText: "Abgegeben um" }).waitFor();
  }
  await lehrer.locator("text=Abgaben: 2 von 2").waitFor({ timeout: 15000 });
  await lehrer.click('[data-act="auswerten"]');
  await lehrer.locator("h2", { hasText: "Quartal 1 ist ausgewertet" }).waitFor({ timeout: 20000 });
  await g2.locator('.tab[data-act="tabG"][data-tab="bericht"]').click();
  await g2.locator("h2", { hasText: "Quartalsbericht Q1" }).waitFor({ timeout: 15000 });

  // Quartal 2: Netzausfall bei Gruppe 1 – die Abgabe wird nachgeliefert
  await lehrer.click('[data-act="rundeOeffnen"]');
  for (const g of [g1, g2]) {
    await g.locator('.tab[data-act="tabG"][data-tab="entscheiden"]').click();
    await g.locator("#planung").waitFor({ timeout: 15000 });
  }
  await g1.fill("#e-menge", "61000");
  await g1.context().setOffline(true);
  await g1.click('[data-act="abgeben"]');
  await g1.locator("#toast", { hasText: "Keine Verbindung" }).waitFor({ timeout: 20000 });
  await g1.locator(".hinweis.achtung", { hasText: "noch nicht übertragen" }).waitFor();
  await g1.context().setOffline(false);
  await g1.locator("#toast", { hasText: "nachgeliefert" }).waitFor({ timeout: 20000 });
  await g1.locator(".hinweis.gut", { hasText: "Abgegeben um" }).waitFor({ timeout: 10000 });
  await lehrer.locator("text=Abgaben: 1 von 2").waitFor({ timeout: 15000 });

  // Gruppe 2 gibt offline ab und ist erst nach der Auswertung wieder online: zu spät
  await g2.context().setOffline(true);
  await g2.click('[data-act="abgeben"]');
  await g2.locator("#toast", { hasText: "Keine Verbindung" }).waitFor({ timeout: 20000 });

  // Zweites Gerät der Lehrperson: mit Code und PIN anmelden
  const lehrer2 = await geraet();
  await lehrer2.goto(link);                       // merkt sich die Datenbank-Adresse aus dem Link
  await lehrer2.goto(web.url + "/index.html");
  await lehrer2.click('[data-act="rolleLehrer"]');
  await lehrer2.fill("#ll-code", code);
  await lehrer2.fill("#ll-pin", "falsch");
  await lehrer2.click('form[data-form="lehrerLogin"] button[type=submit]');
  await lehrer2.locator("#toast", { hasText: "PIN oder Spielcode stimmt nicht" }).waitFor();
  await lehrer2.fill("#ll-pin", "geheim7");
  await lehrer2.click('form[data-form="lehrerLogin"] button[type=submit]');
  await lehrer2.locator("h2", { hasText: "Quartal 2 läuft" }).waitFor({ timeout: 15000 });
  await lehrer2.click('[data-act="auswerten"]');
  await dialogJa(lehrer2, "Jetzt auswerten");
  await lehrer2.locator("h2", { hasText: "Quartal 2 ist ausgewertet" }).waitFor({ timeout: 20000 });
  const menge = await (await fetch(emu.url(`voltage/spiele/${code}/resultate/r2/firmen`))).json();
  assert.ok(Object.values(menge).some((x) => x.entscheid && x.entscheid.menge === 61000), "nachgelieferte Abgabe wurde ausgewertet");
  await lehrer.locator("h2", { hasText: "Quartal 2 ist ausgewertet" }).waitFor({ timeout: 15000 });
  await g2.context().setOffline(false);
  await g2.locator("#toast", { hasText: "kam zu spät" }).waitFor({ timeout: 20000 });

  // Spiel löschen: Gruppen landen auf der Startseite
  await lehrer.click('.tab[data-act="tabL"][data-tab="verwaltung"]');
  await lehrer.click('[data-act="spielLoeschen"]');
  await dialogJa(lehrer, "Endgültig löschen");
  await g1.locator(".rolle", { hasText: "Gruppe" }).waitFor({ timeout: 15000 });
  assert.equal(await (await fetch(emu.url(`voltage/spiele/${code}`))).json(), null);

  assert.deepEqual(echteFehler(fehler), [], "keine Fehler in der Konsole");
});

test("Fest eingetragene Datenbank: Verbindungstest und Beitritt nur mit dem Spielcode", { skip: ohne, timeout: 120000 }, async () => {
  await emu.leeren();
  const fest = await starteWebserver({ firebaseUrl: netz.url });   // wie KONFIG.firebaseUrl in index.html
  const fehler = [];
  try {
    const kL = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const lehrer = await kL.newPage(); beobachte(lehrer, fehler);
    await lehrer.goto(fest.url + "/index.html");
    await lehrer.click('[data-act="rolleLehrer"]');
    await lehrer.click('[data-act="einrichten"]');
    await lehrer.locator(".hinweis.gut", { hasText: "fest in der App eingetragen" }).waitFor();
    assert.equal(await lehrer.locator("#fb-url").count(), 0, "kein Eingabefeld bei fest eingetragener Adresse");
    await lehrer.click('[data-act="verbindungTesten"]');
    await lehrer.locator("#fb-test", { hasText: "Verbindung klappt, die Regeln greifen" }).waitFor();
    assert.ok(await lehrer.evaluate(() => document.documentElement.scrollWidth) <= 390, "lange Adresse bricht um");

    await lehrer.click('[data-act="rolleLehrer"]');
    await lehrer.click('[data-act="lehrerNeu"]');
    assert.equal(await lehrer.isChecked('input[name="modus"][value="online"]'), true, "Online ist vorgewählt");
    await lehrer.fill("#sn-name", "Fest 3b");
    await lehrer.fill("#sn-pin", "geheim8");
    await lehrer.fill("#sn-pin2", "geheim8");
    await lehrer.selectOption("#sn-ki", "0");
    await lehrer.click('form[data-form="spielNeu"] button[type=submit]');
    await lehrer.locator("h2", { hasText: "Phase 1 · Einstieg" }).waitFor();
    const code = (await lehrer.textContent(".code")).trim();
    const link = (await lehrer.locator(".karte span.zahl").first().textContent()).trim();
    assert.ok(link.includes(`spiel=${code}`) && !link.includes("db="), "Klassen-Link ohne Datenbank-Adresse");

    // Eine Gruppe tippt auf einem frischen Gerät nur den Spielcode ein
    const kG = await browser.newContext();
    const g = await kG.newPage(); beobachte(g, fehler);
    await g.goto(fest.url + "/index.html");
    await g.click('[data-act="rolleGruppe"]');
    await g.fill("#beitritt-code", code);
    await g.click('form[data-form="spielcode"] button[type=submit]');
    await g.fill("#gr-name", "Codeweg");
    await g.fill("#gr-pin", "3333");
    await g.fill("#gr-pin2", "3333");
    await g.click('form[data-form="gruenden"] button[type=submit]');
    await g.locator(".leiste .kontext", { hasText: "Codeweg" }).waitFor();
    await lehrer.locator("text=Codeweg").first().waitFor({ timeout: 15000 });
    const firmen = await (await fetch(emu.url(`voltage/spiele/${code}/firmen`))).json();
    assert.ok(Object.values(firmen).some((f) => f.name === "Codeweg"), "Firma liegt in der Online-Datenbank");
    await kL.close(); await kG.close();
  } finally { await fest.stop(); }
  assert.deepEqual(echteFehler(fehler), [], "keine Fehler in der Konsole");
});

test("Verbindungstest erkennt fehlende und offene Regeln", { skip: ohne, timeout: 90000 }, async () => {
  const regeln = async (ns, r) => {
    const a = await fetch(`${emu.basis}/.settings/rules.json?ns=${ns}`, { method: "PUT", headers: { Authorization: "Bearer owner" }, body: JSON.stringify({ rules: r }) });
    assert.equal(a.status, 200, `Regeln für ${ns}`);
  };
  await regeln("voltage-gesperrt", { ".read": false, ".write": false });   // gesperrter Modus, Regeln nie eingespielt
  await regeln("voltage-offen", { ".read": true, ".write": true });        // Testmodus
  const gesperrt = await starteVermittler(emu, "voltage-gesperrt"), offen = await starteVermittler(emu, "voltage-offen");
  const fehler = [];
  try {
    const k = await browser.newContext();
    const s = await k.newPage(); beobachte(s, fehler);
    await s.goto(web.url + "/index.html");
    await s.click('[data-act="rolleLehrer"]');
    await s.click('[data-act="einrichten"]');
    await s.fill("#fb-url", gesperrt.url);
    await s.click('form[data-form="einrichten"] button[type=submit]');
    await s.locator("#fb-test", { hasText: "Zugriff verweigert" }).waitFor();
    await s.fill("#fb-url", offen.url);
    await s.click('form[data-form="einrichten"] button[type=submit]');
    await s.locator("#fb-test", { hasText: "für alle lesbar" }).waitFor();
    assert.equal(await s.evaluate(() => localStorage.getItem("voltage:firebaseUrl")), null, "offene Datenbank wird nicht übernommen");
    await k.close();
  } finally { await gesperrt.stop(); await offen.stop(); }
  assert.deepEqual(echteFehler(fehler), [], "keine Fehler in der Konsole");
});
