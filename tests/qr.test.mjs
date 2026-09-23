// QR-Codes der App mit einem unabhängigen Leser (jsQR) prüfen: npm install --no-save jsqr
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { APP } from "./hilfen.mjs";

const require = createRequire(import.meta.url);
let jsQR = null;
for (const k of ["jsqr", ...(process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean).map((p) => path.join(p, "jsqr"))]) {
  try { jsQR = require(k); break; } catch (e) { /* weiter */ }
}

const html = fs.readFileSync(APP, "utf8");
const QR = new Function(`${html.match(/\/\*<QR>\*\/([\s\S]*?)\/\*<\/QR>\*\//)[1]}\nreturn QR;`)();

function lies(text, skala = 4) {
  const m = QR.erzeuge(text), n = m.length, rand = 4, g = (n + 2 * rand) * skala;
  const bild = new Uint8ClampedArray(g * g * 4).fill(255);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) {
    for (let dy = 0; dy < skala; dy++) for (let dx = 0; dx < skala; dx++) {
      const i = (((y + rand) * skala + dy) * g + (x + rand) * skala + dx) * 4;
      bild[i] = bild[i + 1] = bild[i + 2] = 0;
    }
  }
  const r = jsQR(bild, g, g);
  return r ? r.data : null;
}

test("QR-Codes lassen sich lesen (Versionen 1–15, auch mit Umlauten)", { skip: !jsQR && "jsqr nicht installiert" }, () => {
  const link = "https://kingofwar1918.github.io/VOLTAGE/index.html?spiel=K7Q2XM&db=https%3A%2F%2Fvoltage-7a-default-rtdb.europe-west1.firebasedatabase.app";
  const texte = [link, "K7Q2XM", "Grüezi – Zürich ÄÖÜ ⚡"];
  for (let n = 1; n <= 400; n += 13) texte.push(link.repeat(4).slice(0, n));
  for (const t of texte) assert.equal(lies(t), t, `Länge ${t.length}`);
});

test("QR-Code als SVG", () => {
  const svg = QR.svg("https://example.org/?spiel=K7Q2XM", 200);
  assert.match(svg, /^<svg class="qr" width="200"/);
  assert.ok(svg.includes('fill="#fff"') && svg.includes('fill="#000"'));
});
