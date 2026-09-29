// Die fest eingetragene Datenbank-Adresse muss zur App und zu den Regeln passen
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { APP, WURZEL } from "./hilfen.mjs";

test("KONFIG: gültige Datenbank-Adresse, oberster Pfad passt zu den Regeln", () => {
  const html = fs.readFileSync(APP, "utf8");
  const url = /\n\s*firebaseUrl:\s*"([^"]*)"/.exec(html)[1];
  assert.ok(url === "" || /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.(firebaseio\.com|firebasedatabase\.app)$/.test(url), `ungültige Adresse: ${url}`);
  const projekt = /\n\s*projekt:\s*"([^"]*)"/.exec(html)[1];
  const regeln = JSON.parse(fs.readFileSync(path.join(WURZEL, "firebase", "regeln.json"), "utf8"));
  assert.ok(regeln.rules[projekt], `firebase/regeln.json enthält keine Regeln für «${projekt}»`);
});
