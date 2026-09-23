// Tests für das Spielmodell (Markt, Kosten, Nachhaltigkeit) – direkt aus index.html geladen
import { test } from "node:test";
import assert from "node:assert/strict";
import { ladeSpielmodell } from "./hilfen.mjs";

const { DATEN, Engine, KI } = ladeSpielmodell();
const einst = { startkapital: 150000, saison: true };
const R = DATEN.regeln;
const levelVon = (runde) => Math.min(5, Math.ceil(runde / 2));

// Kleiner, reproduzierbarer Zufallsgenerator
function zufall(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }

function spiele(strategien, runden = 10, ereignisse = {}) {
  const namen = Object.keys(strategien);
  const firmen = namen.map((id) => ({ id }));
  const zust = {}, log = Object.fromEntries(namen.map((n) => [n, []]));
  for (let r = 1; r <= runden; r++) {
    const L = levelVon(r), ev = ereignisse[r] || [], p = Engine.prognose(r, ev, einst), ent = {};
    for (const n of namen) {
      const z = Engine.zustandVon(zust[n], einst);
      const hist = log[n];
      const schaetzung = hist.length ? Math.round(hist[hist.length - 1].nachfrage * p.faktor / hist[hist.length - 1].faktor) : p.richtwert;
      ent[n] = Object.assign({ zeit: 1 }, strategien[n]({ z, L, p, r, schaetzung }));
    }
    const res = Engine.simuliere({ firmen, zustaende: zust, entscheide: ent, level: L, runde: r, ereignisse: ev, einst });
    for (const n of namen) { zust[n] = res.firmen[n].zustand; log[n].push(Object.assign({ faktor: res.prognoseFaktor }, res.firmen[n])); }
  }
  return log;
}
const endpunkte = (log) => Object.fromEntries(Object.entries(log).map(([n, rs]) => [n, rs[rs.length - 1].punkte.gesamt]));

function pruefeZahlen(o, pfad = "") {
  if (typeof o === "number") assert.ok(Number.isFinite(o), `keine gültige Zahl bei ${pfad}: ${o}`);
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) pruefeZahlen(v, pfad + "." + k);
}

test("Referenzmarkt: gleiche Firmen erhalten gleich viel Nachfrage", () => {
  const firmen = ["a", "b", "c", "d"].map((id) => ({ id }));
  const ent = Object.fromEntries(firmen.map((f) => [f.id, { menge: 50000, preis: 3, zeit: 1 }]));
  const res = Engine.simuliere({ firmen, zustaende: {}, entscheide: ent, level: 1, runde: 1, ereignisse: [], einst });
  const n = Object.values(res.firmen).map((x) => x.nachfrage);
  assert.ok(n.every((v) => v === n[0]));
  assert.ok(Math.abs(n[0] - R.basisNachfrage) <= 500, `Nachfrage ${n[0]} statt rund ${R.basisNachfrage}`);
  assert.ok(Object.values(res.firmen).every((x) => x.gewinn > 0), "bei marktüblichem Verhalten gibt es im Frühling Gewinn");
});

test("Gleiche Eingaben ergeben gleiche Resultate", () => {
  const s = { a: () => ({ menge: 52000, preis: 3.1 }), b: () => ({ menge: 48000, preis: 2.9, social: 5000 }) };
  assert.deepEqual(JSON.stringify(spiele(s, 6)), JSON.stringify(spiele(s, 6)));
});

test("Höherer Preis senkt die eigene Nachfrage, mehr Werbung erhöht die Bekanntheit (abnehmend)", () => {
  const firmen = [{ id: "ich" }, { id: "k1" }, { id: "k2" }];
  let vorher = Infinity;
  for (const preis of [2, 2.5, 3, 3.5, 4, 5, 6]) {
    const ent = { ich: { menge: 1e5, preis, zeit: 1 }, k1: { menge: 5e4, preis: 3, zeit: 1 }, k2: { menge: 5e4, preis: 3, zeit: 1 } };
    const n = Engine.simuliere({ firmen, zustaende: {}, entscheide: ent, level: 1, runde: 1, ereignisse: [], einst }).firmen.ich.nachfrage;
    assert.ok(n < vorher, `Nachfrage bei ${preis} Fr. sinkt nicht`);
    vorher = n;
  }
  const fx = Engine.effekte([]);
  const b = (budget) => Engine.bekanntheitNach(50, { social: budget, plakat: 0, sponsoring: 0 }, fx);
  assert.ok(b(0) < 50 && b(10000) > b(0) && b(20000) > b(10000));
  assert.ok(b(20000) - b(10000) < b(10000) - b(0), "Werbung wirkt abnehmend");
});

test("Kassenrechnung, Grenzen und gültige Zahlen – auch bei unsinnigen Eingaben", () => {
  const rnd = zufall(42);
  const auswahl = (a) => a[Math.floor(rnd() * a.length)];
  const firmen = ["a", "b", "c", "d", "e"].map((id) => ({ id }));
  let zust = {};
  for (let runde = 1; runde <= 30; runde++) {
    const level = 1 + (runde % 5);
    const ent = {};
    for (const f of firmen) {
      ent[f.id] = rnd() < 0.1 ? undefined : {
        zeit: 1, menge: auswahl([0, 20000, 50000, 90000, -5, "abc", 1e9]), preis: auswahl([0.5, 2, 3, 4.5, 9, "x"]),
        social: auswahl([0, 5000, 60000, -3]), plakat: auswahl([0, 8000]), sponsoring: auswahl([0, 12000]),
        personal: auswahl([-9, -1, 0, 1, 3, 20]), lohn: auswahl(["tief", "mittel", "hoch", "gratis"]), weiterbildung: auswahl([0, 5000, 99999]),
        zutaten: auswahl(["standard", "bio", "gold"]), dose: auswahl(["standard", "recycling"]), rezeptur: auswahl(["normal", "zuckerreduziert"]),
        investAnlage: rnd() < 0.3, investSolar: rnd() < 0.3, kreditNeu: auswahl([0, 50000, 1e7]), kreditRueck: auswahl([0, 20000, 1e7]),
        lernende: auswahl([0, 1, 9]), engagement: auswahl([0, 5000, 1e6])
      };
    }
    const ev = rnd() < 0.5 ? [auswahl(Object.keys(DATEN.ereignisse))] : [];
    const res = Engine.simuliere({ firmen, zustaende: zust, entscheide: ent, level, runde, ereignisse: ev, einst });
    pruefeZahlen(res);
    for (const f of firmen) {
      const x = res.firmen[f.id], vor = Engine.zustandVon(zust[f.id], einst), z = x.zustand;
      assert.ok(x.produziert <= x.kapazitaet && x.produziert >= 0);
      assert.ok(x.verkauft <= x.verfuegbar && x.verkauft >= 0);
      assert.ok(z.lager >= 0 && z.lager <= R.lagerMax && x.restposten >= 0);
      assert.ok(z.kasse >= 0, "Kasse nie negativ (Notkredit)");
      assert.ok(z.mitarbeitende >= 1);
      for (const k of ["zufriedenheit", "qualitaet", "image", "bekanntheit", "umwelt", "gesellschaft"]) assert.ok(z[k] >= 0 && z[k] <= 100, k);
      for (const k of ["wirtschaft", "umwelt", "gesellschaft", "gesamt"]) assert.ok(x.punkte[k] >= 0 && x.punkte[k] <= 100, k);
      const d = x.entscheid;
      const erwartet = vor.kasse + x.gewinn + x.kosten.abschreibung - x.investition + d.kreditNeu - d.kreditRueck + (x.notkredit ? x.notkredit - R.kredit.notkreditGebuehr : 0);
      assert.ok(Math.abs(z.kasse - erwartet) < 1e-6, `Kassenrechnung stimmt nicht (${z.kasse} vs ${erwartet})`);
      const p = x.punkte;
      assert.equal(p.gesamt, Math.round((p.wirtschaft + p.umwelt + p.gesellschaft + Math.min(p.wirtschaft, p.umwelt, p.gesellschaft)) / 4));
    }
    zust = Object.fromEntries(firmen.map((f) => [f.id, res.firmen[f.id].zustand]));
  }
});

test("Gesperrte Bereiche wirken erst ab ihrem Level", () => {
  const z = Engine.startZustand(einst);
  const roh = { menge: 50000, preis: 3, social: 30000, personal: 3, lohn: "hoch", zutaten: "bio", investSolar: true, kreditNeu: 50000 };
  const l1 = Engine.normalisiere(roh, 1, z);
  assert.equal(l1.social, 0); assert.equal(l1.plakat, R.grundwerbung); assert.equal(l1.personal, 0); assert.equal(l1.lohn, "mittel");
  assert.equal(l1.zutaten, "standard"); assert.equal(l1.investSolar, false); assert.equal(l1.kreditNeu, 0);
  const l5 = Engine.normalisiere(roh, 5, z);
  assert.equal(l5.social, 30000); assert.equal(l5.personal, 3); assert.equal(l5.zutaten, "bio"); assert.equal(l5.investSolar, true); assert.equal(l5.kreditNeu, 50000);
});

test("Ohne Abgabe wiederholt der Autopilot den letzten Entscheid", () => {
  const firmen = [{ id: "a" }, { id: "b" }];
  const r1 = Engine.simuliere({ firmen, zustaende: {}, entscheide: { a: { menge: 42000, preis: 3.4, zeit: 1 }, b: { menge: 50000, preis: 3, zeit: 1 } }, level: 1, runde: 1, ereignisse: [], einst });
  const zust = { a: r1.firmen.a.zustand, b: r1.firmen.b.zustand };
  const r2 = Engine.simuliere({ firmen, zustaende: zust, entscheide: { b: { menge: 50000, preis: 3, zeit: 1 } }, level: 1, runde: 2, ereignisse: [], einst });
  assert.equal(r2.firmen.a.abgegeben, false);
  assert.equal(r2.firmen.a.entscheid.menge, 42000);
  assert.equal(r2.firmen.a.entscheid.preis, 3.4);
});

test("Ereignisse wirken wie beschrieben", () => {
  const firmen = [{ id: "a" }, { id: "b" }];
  const ent = { a: { menge: 50000, preis: 3, zeit: 1, rezeptur: "normal" }, b: { menge: 50000, preis: 3, zeit: 1, rezeptur: "zuckerreduziert" } };
  const lauf = (ev, level = 4) => Engine.simuliere({ firmen, zustaende: {}, entscheide: ent, level, runde: 1, ereignisse: ev, einst });
  const normal = lauf([]), hitze = lauf(["hitzewelle"]), zucker = lauf(["zuckersteuer"]), grippe = lauf(["grippe"]);
  assert.ok(hitze.firmen.a.nachfrage > normal.firmen.a.nachfrage * 1.2);
  assert.ok(Math.abs(zucker.firmen.a.stueckkosten - normal.firmen.a.stueckkosten - 0.30) < 0.002, "Zuckersteuer trifft normale Rezeptur");
  assert.equal(zucker.firmen.b.stueckkosten, normal.firmen.b.stueckkosten, "zuckerreduziert ist befreit");
  assert.ok(grippe.firmen.a.kapazitaet < normal.firmen.a.kapazitaet * 0.85);
});

test("Leere Kasse führt zu einem Notkredit", () => {
  const firmen = [{ id: "a" }];
  const res = Engine.simuliere({ firmen, zustaende: { a: Object.assign(Engine.startZustand(einst), { kasse: 1000 }) }, entscheide: { a: { menge: 0, preis: 3, zeit: 1 } }, level: 1, runde: 1, ereignisse: [], einst });
  assert.ok(res.firmen.a.notkredit > 0);
  assert.ok(res.firmen.a.zustand.kredit >= res.firmen.a.notkredit);
});

test("Spielbalance: ausgewogen schlägt reine Gewinnmaximierung, Verschwendung und Extreme", () => {
  const std = { social: 4000, plakat: 4000, sponsoring: 2000 };
  const log = spiele({
    ausgewogen: ({ z, L, schaetzung, r }) => ({ ...std, social: 6000, plakat: 5000, sponsoring: 4000, preis: 3.2, weiterbildung: 5000, lohn: "mittel",
      menge: Math.max(0, schaetzung - z.lager + ((r % 4) === 1 ? 8000 : 0)), personal: L >= 3 && schaetzung > Engine.kapazitaetVon(z, Engine.effekte([])) ? 1 : 0,
      dose: "recycling", rezeptur: "zuckerreduziert", investSolar: true, lernende: 1, engagement: 3000 }),
    nurGewinn: ({ z, schaetzung }) => ({ ...std, preis: 3.0, menge: Math.max(0, schaetzung - z.lager) }),
    billig: ({ z, schaetzung }) => ({ social: 1500, plakat: 1500, preis: 2.5, lohn: "tief", menge: Math.max(0, schaetzung - z.lager) }),
    ueberproduktion: () => ({ ...std, preis: 3.0, menge: 70000 }),
    wucher: ({ z, schaetzung }) => ({ ...std, preis: 4.8, menge: Math.max(0, schaetzung - z.lager) }),
    oekoOhneRechnen: ({ z, schaetzung }) => ({ ...std, preis: 3.0, menge: Math.max(0, schaetzung - z.lager), lohn: "hoch", weiterbildung: 20000,
      zutaten: "bio", dose: "recycling", rezeptur: "zuckerreduziert", investSolar: true, lernende: 3, engagement: 20000 })
  });
  const p = endpunkte(log);
  for (const andere of ["nurGewinn", "billig", "ueberproduktion", "wucher", "oekoOhneRechnen"]) assert.ok(p.ausgewogen > p[andere], `ausgewogen (${p.ausgewogen}) sollte vor ${andere} (${p[andere]}) liegen`);
  const gewinn = (n) => log[n][log[n].length - 1].zustand.gewinnTotal;
  assert.ok(gewinn("ausgewogen") > 0, "die ausgewogene Strategie verdient Geld");
  assert.ok(gewinn("wucher") < gewinn("nurGewinn"), "Wucherpreise lohnen sich nicht");
  assert.ok(gewinn("oekoOhneRechnen") < 0, "Nachhaltigkeit ohne Rechnen kostet Geld");
});

test("Computer-Konkurrenz entscheidet gültig und reproduzierbar", () => {
  const z = Engine.startZustand(einst), prog = Engine.prognose(3, [], einst);
  for (const k of DATEN.kiFirmen) {
    const a = KI.entscheid(k.id, z, 5, 3, prog, { nachfrage: 48000 }, 1.0);
    const b = KI.entscheid(k.id, z, 5, 3, prog, { nachfrage: 48000 }, 1.0);
    assert.equal(a.preis, b.preis);
    assert.ok(a.menge >= 0 && a.preis >= R.preisMin && a.preis <= R.preisMax);
  }
});
