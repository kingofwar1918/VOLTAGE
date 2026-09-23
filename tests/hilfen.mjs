// Gemeinsame Hilfsmittel für die Tests (Node ≥ 20, keine Abhängigkeiten ausser Playwright für die Browsertests)
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import net from "node:net";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

export const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const APP = path.join(WURZEL, "index.html");

// DATEN, Spielmodell und Computer-Konkurrenz direkt aus index.html laden
export function ladeSpielmodell() {
  const html = fs.readFileSync(APP, "utf8");
  const teil = (name) => {
    const m = html.match(new RegExp(`/\\*<${name}>\\*/([\\s\\S]*?)/\\*</${name}>\\*/`));
    if (!m) throw new Error(`Abschnitt ${name} fehlt in index.html`);
    return m[1];
  };
  return new Function(`${teil("DATEN")}\n${teil("ENGINE")}\n${teil("KI")}\nreturn { DATEN, Engine, KI };`)();
}

export function freierPort() {
  return new Promise((ok) => { const s = net.createServer(); s.listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => ok(p)); }); });
}

// Statischer Webserver für die App
export async function starteWebserver() {
  const port = await freierPort();
  const typen = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".png": "image/png" };
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://x");
    let datei = path.join(WURZEL, decodeURIComponent(u.pathname));
    if (!datei.startsWith(WURZEL)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(datei) && fs.statSync(datei).isDirectory()) datei = path.join(datei, "index.html");
    if (!fs.existsSync(datei)) { res.writeHead(404); res.end("nicht gefunden"); return; }
    res.writeHead(200, { "Content-Type": typen[path.extname(datei)] || "application/octet-stream" });
    fs.createReadStream(datei).pipe(res);
  });
  await new Promise((ok) => server.listen(port, "127.0.0.1", ok));
  return { url: `http://127.0.0.1:${port}`, stop: () => new Promise((ok) => server.close(ok)) };
}

/* Firebase-Emulator (Realtime Database). Pfad zum JAR über FIREBASE_EMULATOR_JAR.
   Ohne JAR werden die Online-Tests übersprungen. */
export const EMULATOR_JAR = process.env.FIREBASE_EMULATOR_JAR || "";
export const NAMESPACE = "voltage-test";

export async function starteEmulator() {
  if (!EMULATOR_JAR || !fs.existsSync(EMULATOR_JAR)) return null;
  const port = await freierPort();
  const proz = spawn("java", ["-jar", EMULATOR_JAR, "--host", "127.0.0.1", "--port", String(port)], { stdio: "ignore" });
  const basis = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`${basis}/.json?ns=${NAMESPACE}`); if (r.status) break; } catch (e) { /* startet noch */ }
    await new Promise((ok) => setTimeout(ok, 500));
  }
  const regeln = fs.readFileSync(path.join(WURZEL, "firebase", "regeln.json"), "utf8");
  const r = await fetch(`${basis}/.settings/rules.json?ns=${NAMESPACE}`, { method: "PUT", headers: { Authorization: "Bearer owner" }, body: regeln });
  if (!r.ok) throw new Error("Regeln konnten nicht geladen werden: " + (await r.text()));
  return {
    basis,
    url: (pfad, extra = "") => `${basis}/${pfad}.json?ns=${NAMESPACE}${extra}`,
    leeren: () => fetch(`${basis}/.json?ns=${NAMESPACE}`, { method: "DELETE", headers: { Authorization: "Bearer owner" } }),
    stop: () => { proz.kill(); }
  };
}

/* Vermittler zwischen App und Emulator: hängt den Namespace an (?ns=…),
   damit die App mit einer gewöhnlichen Datenbank-Adresse arbeiten kann. */
export async function starteVermittler(emulator) {
  const port = await freierPort();
  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, "http://x");
    u.searchParams.set("ns", NAMESPACE);
    const teile = [];
    for await (const t of req) teile.push(t);
    const kopf = {};
    for (const k of ["content-type", "origin", "access-control-request-method", "access-control-request-headers"]) if (req.headers[k]) kopf[k] = req.headers[k];
    try {
      const antwort = await fetch(`${emulator.basis}${u.pathname}${u.search}`, { method: req.method, headers: kopf, body: teile.length && req.method !== "GET" ? Buffer.concat(teile) : undefined });
      const kopfZurueck = {};
      antwort.headers.forEach((v, k) => { if (!["content-length", "transfer-encoding", "connection", "content-encoding"].includes(k)) kopfZurueck[k] = v; });
      res.writeHead(antwort.status, kopfZurueck);
      res.end(Buffer.from(await antwort.arrayBuffer()));
    } catch (e) { res.writeHead(502); res.end(); }
  });
  await new Promise((ok) => server.listen(port, "127.0.0.1", ok));
  return {
    url: `http://127.0.0.1:${port}`,
    stop: () => new Promise((ok) => { server.closeAllConnections?.(); server.close(ok); })
  };
}

// Playwright finden: lokal installiert oder global (NODE_PATH)
export function ladePlaywright() {
  const require = createRequire(import.meta.url);
  const kandidaten = ["playwright", ...(process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean).map((p) => path.join(p, "playwright")), "/opt/node22/lib/node_modules/playwright", "/usr/local/lib/node_modules/playwright", "/usr/lib/node_modules/playwright"];
  for (const k of kandidaten) { try { return require(k); } catch (e) { /* weiter */ } }
  return null;
}

// Browser mit Fehlerprotokoll pro Seite
export function beobachte(seite, fehler) {
  seite.on("pageerror", (e) => fehler.push(`pageerror: ${e.message}`));
  seite.on("console", (m) => { if (m.type() === "error") fehler.push(`console: ${m.text()}`); });
}
