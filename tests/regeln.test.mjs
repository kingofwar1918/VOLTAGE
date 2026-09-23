// Sicherheitsregeln gegen den echten Firebase-Emulator prüfen (ohne Anmeldung = wie ein Schülergerät)
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { starteEmulator } from "./hilfen.mjs";

let emu = null;
before(async () => { emu = await starteEmulator(); });
after(() => { if (emu) emu.stop(); });

const CODE = "K7Q2XM";
const HASH = "0123456789abcdef";
async function anfrage(pfad, methode = "GET", koerper) {
  const r = await fetch(emu.url(pfad), { method: methode, headers: koerper !== undefined ? { "Content-Type": "application/json" } : {}, body: koerper !== undefined ? JSON.stringify(koerper) : undefined });
  const text = await r.text();
  return { status: r.status, daten: text ? JSON.parse(text) : null };
}
const spiel = (extra) => Object.assign({ name: "Test", code: CODE, status: "vorbereitung", runde: 0, level: 1, version: 1, erstellt: 1, einstellungen: { ki: 0 } }, extra);

test("Regeln im Emulator", { skip: !process.env.FIREBASE_EMULATOR_JAR && "FIREBASE_EMULATOR_JAR nicht gesetzt" }, async (t) => {
  await emu.leeren();

  await t.test("Wurzel und Spielliste sind gesperrt", async () => {
    assert.equal((await anfrage("")).status, 401);
    assert.equal((await anfrage("voltage")).status, 401);
    assert.equal((await anfrage("voltage/spiele")).status, 401);
    assert.equal((await anfrage("anderes", "PUT", { x: 1 })).status, 401);
  });

  await t.test("Ein Spiel lässt sich mit gültigem Code lesen und schreiben", async () => {
    assert.equal((await anfrage(`voltage/spiele/${CODE}`)).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/spiel`, "PUT", spiel())).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/spiel`)).daten.name, "Test");
  });

  await t.test("Ungültige Codes und falsche Spieldaten werden abgelehnt", async () => {
    assert.equal((await anfrage("voltage/spiele/k7q2xm")).status, 401);
    assert.equal((await anfrage("voltage/spiele/K7Q2X0/spiel", "PUT", spiel({ code: "K7Q2X0" }))).status, 401); // 0 ist nicht im Alphabet
    assert.equal((await anfrage(`voltage/spiele/${CODE}/spiel`, "PUT", spiel({ code: "ANDERS" }))).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/spiel`, "PUT", { name: "ohne Pflichtfelder" })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/spiel`, "PUT", spiel({ name: "x".repeat(61) }))).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/unbekannt`, "PUT", { a: 1 })).status, 401);
  });

  await t.test("Firmen: gültige Kennung, Name höchstens 24 Zeichen", async () => {
    assert.equal((await anfrage(`voltage/spiele/${CODE}/firmen/fabc12345`, "PUT", { id: "fabc12345", name: "BLITZ", logo: "⚡", farbe: "#B7E62E", erstellt: 1 })).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/firmen/fabc12345/pinHash`, "PUT", "0011223344556677")).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/firmen/FALSCH`, "PUT", { id: "FALSCH", name: "x" })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/firmen/fxyz`, "PUT", { id: "fanders", name: "x" })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/firmen/fxyz`, "PUT", { id: "fxyz", name: "x".repeat(25) })).status, 401);
  });

  await t.test("Entscheide, Resultate und Reflexion", async () => {
    assert.equal((await anfrage(`voltage/spiele/${CODE}/entscheide/r1/fabc12345`, "PUT", { menge: 50000, preis: 3, zeit: 1 })).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/entscheide/r1/fabc12345`, "PUT", { menge: 50000 })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/entscheide/runde1/fabc12345`, "PUT", { zeit: 1 })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/resultate/r1`, "PUT", { runde: 1, firmen: { fabc12345: { gewinn: 1 } } })).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/resultate/r1`, "PUT", { runde: 1 })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/reflexion/l1/fabc12345`, "PUT", { antworten: { f0: "Antwort" }, zeit: 1 })).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/reflexion/transfer/fabc12345`, "PUT", { antworten: { f0: "Antwort" }, zeit: 1 })).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/reflexion/l6/fabc12345`, "PUT", { zeit: 1 })).status, 401);
    assert.equal((await anfrage(`voltage/spiele/${CODE}/reflexion/l1/fabc12345`, "PUT", { antworten: { f0: "x".repeat(1001) }, zeit: 1 })).status, 401);
  });

  await t.test("Lehrpersonen-PIN: nur einmal setzbar, nicht auflistbar", async () => {
    assert.equal((await anfrage(`voltage/lehrer/${CODE}/${HASH}`, "PUT", true)).status, 200);
    assert.equal((await anfrage(`voltage/lehrer/${CODE}/fedcba9876543210`, "PUT", true)).status, 401);
    assert.equal((await anfrage(`voltage/lehrer/${CODE}/${HASH}`, "DELETE")).status, 401);
    assert.equal((await anfrage(`voltage/lehrer/${CODE}`)).status, 401);
    assert.equal((await anfrage("voltage/lehrer")).status, 401);
    assert.equal((await anfrage(`voltage/lehrer/${CODE}/${HASH}`)).daten, true);
    assert.equal((await anfrage(`voltage/lehrer/${CODE}/fedcba9876543210`)).daten, null);
    assert.equal((await anfrage(`voltage/lehrer/ANDERE/nichthex`, "PUT", true)).status, 401);
  });

  await t.test("Sicherung einspielen und Spiel löschen", async () => {
    const r = await anfrage(`voltage/spiele/${CODE}`);
    assert.equal((await anfrage(`voltage/spiele/${CODE}`, "PUT", r.daten)).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}`, "DELETE")).status, 200);
    assert.equal((await anfrage(`voltage/spiele/${CODE}`)).daten, null);
  });
});
