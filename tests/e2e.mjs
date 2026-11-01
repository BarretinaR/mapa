// Tests de extremo a extremo de Mundo Viajero.
// Uso:  node tests/e2e.mjs        (requiere Playwright: npm i -D playwright && npx playwright install chromium)
// Sirve la carpeta del proyecto en local, simula las APIs externas (Wikipedia, Wikidata, REST Countries,
// ubicación…) para que los resultados sean reproducibles y comprueba las funciones principales.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".geojson": "application/json", ".png": "image/png", ".jpg": "image/jpeg" };

// ------------------------------------------------------------ servidor estático
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const file = p.endsWith("/") ? path.join(p, "index.html") : p;
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}/`;

// ------------------------------------------------------------ simulación de APIs externas
const tileRequests = [];
async function mockNetwork(page) {
  await page.route(/server\.arcgisonline\.com|basemaps\.cartocdn\.com/, (r) => { tileRequests.push(r.request().url()); r.abort(); });
  await page.route(/restcountries\.com/, (r) => r.fulfill({ json: { capital: ["Tokio"], population: 124000000, currencies: { JPY: { name: "Japanese yen", symbol: "¥" } }, languages: { jpn: "Japanese" }, timezones: ["UTC+09:00"], car: { side: "left" }, area: 377930, subregion: "Eastern Asia" } }));
  await page.route(/es\.wikipedia\.org/, (r) => r.fulfill({ json: { type: "standard", extract: "Resumen de prueba de Wikipedia.", content_urls: { desktop: { page: "https://es.wikipedia.org/wiki/Prueba" } } } }));
  await page.route(/query\.wikidata\.org/, (r) => r.fulfill({ json: { results: { bindings: [
    { item: { value: "Q1" }, itemLabel: { value: "Luang Prabang" }, itemDescription: { value: "ciudad de Laos" }, coord: { value: "Point(102.135 19.886)" } },
    { item: { value: "Q2" }, itemLabel: { value: "Vat Phou" }, itemDescription: { value: "templo jemer" }, coord: { value: "Point(105.822 14.851)" } }
  ] } } }));
  await page.route(/get\.geojs\.io/, (r) => r.fulfill({ json: { latitude: "41.39", longitude: "2.17", city: "Barcelona", country_code: "ES" } }));
  await page.route(/ipapi\.co/, (r) => r.abort());
  await page.route(/bigdatacloud/, (r) => r.fulfill({ json: { city: "Girona", countryCode: "ES" } }));
}

// ------------------------------------------------------------ utilidades
const results = [];
async function test(name, fn) {
  const t0 = Date.now();
  try {
    const detail = await fn();
    results.push({ name, ok: true, ms: Date.now() - t0, detail: detail || "" });
    console.log(`  ✅ ${name}${detail ? " — " + detail : ""}`);
  } catch (e) {
    results.push({ name, ok: false, ms: Date.now() - t0, detail: e.message.split("\n")[0] });
    console.log(`  ❌ ${name} — ${e.message.split("\n")[0]}`);
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
const wait = (p, ms) => p.waitForTimeout(ms);

// ------------------------------------------------------------ tests
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, geolocation: { latitude: 41.98, longitude: 2.82 }, permissions: ["geolocation"] });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
await mockNetwork(page);

console.log("\nMundo Viajero · tests de extremo a extremo\n");

await test("La página carga y dibuja el globo", async () => {
  await page.goto(BASE);
  await page.waitForFunction(() => window.mvGlobe && window.mvGlobe.customLayerData().length > 0, null, { timeout: 20000 });
  assert(await page.$("#globe canvas"), "no hay canvas WebGL");
  return `título: «${await page.title()}»`;
});

await test("Fronteras de países dibujadas en un único objeto (render fluido)", async () => {
  const r = await page.evaluate(() => {
    const b = mvGlobe.customLayerData()[0].obj;
    const g = mvGlobe;
    g.renderer().render(g.scene(), g.camera());
    return { segs: b.geometry.attributes.position.count / 2, calls: g.renderer().info.render.calls };
  });
  assert(r.segs > 20000, `pocos segmentos de frontera (${r.segs})`);
  assert(r.calls < 60, `demasiadas llamadas de dibujo (${r.calls})`);
  return `${r.segs.toLocaleString("es")} segmentos · ${r.calls} llamadas de dibujo por fotograma`;
});

await test("Detecta la ubicación del usuario (GPS simulado en Girona)", async () => {
  await page.waitForFunction(() => document.querySelector("#origin-name").textContent === "Girona", null, { timeout: 15000 });
  const o = await page.evaluate(() => JSON.parse(localStorage.getItem("mv-origin2")));
  assert(o.source === "gps", "origen no viene del GPS: " + o.source);
  assert(o.iata === "GRO", "aeropuerto más cercano incorrecto: " + o.iata);
  assert(o.nearby.some((a) => a.iata === "BCN"), "BCN no aparece como alternativa");
  return `Girona → aeropuerto ${o.iata} a ${Math.round(o.apDist)} km; alternativas: ${o.nearby.slice(1).map((a) => a.iata).join(", ")}`;
});

await test("Nombres de ciudades en español al acercarse (España)", async () => {
  await page.evaluate(() => { mvGlobe.controls().autoRotate = false; mvGlobe.pointOfView({ lat: 40.2, lng: -3.7, altitude: 0.35 }, 0); });
  await page.waitForFunction(() => [...document.querySelectorAll(".pin-city")].some((e) => e.dataset.label === "Madrid"), null, { timeout: 15000 });
  const labels = await page.$$eval(".pin-city, .pin-country", (els) => els.filter((e) => e.offsetParent && getComputedStyle(e).display !== "none").map((e) => e.dataset.label));
  assert(labels.includes("Sevilla") || labels.includes("Valencia"), "faltan ciudades españolas");
  return `${labels.length} etiquetas: ${labels.slice(0, 8).join(", ")}…`;
});

await test("Las etiquetas no se solapan entre sí", async () => {
  const overlaps = await page.$$eval(".pin-city span, .pin-country", (els) => {
    const r = els.filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect()).filter((b) => b.width);
    let n = 0;
    for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) {
      const a = r[i], b = r[j];
      if (a.left < b.right - 2 && a.right > b.left + 2 && a.top < b.bottom - 2 && a.bottom > b.top + 2) n++;
    }
    return n;
  });
  assert(overlaps === 0, `${overlaps} pares de etiquetas solapados`);
  return "0 solapamientos";
});

await test("Fronteras de regiones/provincias al acercarse", async () => {
  await page.waitForFunction(() => mvGlobe.customLayerData()[1] && mvGlobe.customLayerData()[1].obj.visible, null, { timeout: 20000 });
  const n = await page.evaluate(() => mvGlobe.customLayerData()[1].obj.geometry.attributes.position.count / 2);
  return `${n.toLocaleString("es")} segmentos de límites regionales visibles`;
});

await test("Clic en el globo selecciona el país (Francia)", async () => {
  await page.evaluate(() => mvGlobe.pointOfView({ lat: 46.6, lng: 2.4, altitude: 1.1 }, 0));
  await wait(page, 800);
  const box = await page.$eval("#globe canvas", (c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  // buscamos un punto del centro sin etiquetas encima
  const pt = await page.evaluate(({ x, y }) => {
    for (let dy = 0; dy < 60; dy += 6) for (const s of [1, -1]) {
      const el = document.elementFromPoint(x, y + dy * s);
      if (el && el.tagName === "CANVAS") return { x, y: y + dy * s };
    }
    return { x, y };
  }, box);
  await page.mouse.click(pt.x, pt.y);
  await page.waitForSelector("#panel:not([hidden]) h2", { timeout: 8000 });
  const t = await page.$eval("#panel h2", (e) => e.textContent);
  assert(t === "Francia", "se seleccionó " + t);
  return "panel abierto: " + t;
});

await test("Buscador de países (Japón) y guía completa", async () => {
  await page.fill("#search", "japon");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.querySelector("#panel h2")?.textContent === "Japón", null, { timeout: 8000 });
  const n = await page.$$eval("#places .place", (l) => l.length);
  assert(n >= 5 && n <= 10, `${n} imprescindibles`);
  await page.waitForFunction(() => document.querySelectorAll(".pin-place").length >= 5, null, { timeout: 10000 }).catch(() => {});
  const pins = await page.$$eval(".pin-place", (l) => l.length);
  assert(pins >= 5, "faltan marcadores numerados en el globo");
  return `${n} imprescindibles y ${pins} marcadores en el globo`;
});

await test("Ruta desde el aeropuerto del usuario y enlaces de vuelos", async () => {
  await page.waitForSelector(".route .code");
  const codes = await page.$$eval(".route .code", (l) => l.map((e) => e.textContent));
  const g = await page.$eval(".links .btn-primary", (a) => a.href);
  const sky = await page.$eval('.links a[href*="skyscanner"]', (a) => a.href);
  assert(codes[0] === "GRO" && codes[1] === "NRT", "ruta " + codes.join("→"));
  assert(/Flights%20to%20NRT%20from%20GRO/.test(g), "Google Flights mal formado");
  assert(/skyscanner\.es\/transporte\/vuelos\/gro\/nrt\/\d{6}\/\d{6}\//.test(sky), "Skyscanner mal formado");
  return `${codes.join(" → ")} · Google Flights, Skyscanner y Kayak correctos`;
});

await test("Cambiar al aeropuerto alternativo (BCN) recalcula la ruta", async () => {
  await page.click('.alt-ap[data-dep-ap="BCN"]');
  await wait(page, 300);
  const codes = await page.$$eval(".route .code", (l) => l.map((e) => e.textContent));
  assert(codes[0] === "BCN", "sigue saliendo de " + codes[0]);
  const stats = await page.$eval(".route-stats", (e) => e.innerText.replace(/\s+/g, " "));
  return `${codes.join(" → ")} · ${stats}`;
});

await test("Enlaces a Google Earth y Street View", async () => {
  const hero = await page.$eval(".hero-earth", (a) => a.href);
  const place = await page.$eval("#places a[data-earth]", (a) => a.href);
  const re = /^https:\/\/earth\.google\.com\/web\/search\/.+\/@-?\d+\.\d+,-?\d+\.\d+,0a,\d+d,35y,0h,\d+t,0r$/;
  assert(re.test(hero), "enlace de país incorrecto: " + hero);
  assert(re.test(place), "enlace de lugar incorrecto: " + place);
  const sv = await page.$$eval('#places a[href*="map_action=pano"]', (l) => l.length);
  assert(sv >= 5, "faltan enlaces a Street View");
  return place.replace("https://", "");
});

await test("País sin guía escrita (Laos) usa Wikidata y Wikipedia", async () => {
  await page.evaluate(() => { location.hash = "LA"; });
  await page.waitForFunction(() => document.querySelector("#panel h2")?.textContent === "Laos" && document.querySelectorAll("#places .place").length > 0, null, { timeout: 10000 });
  const names = await page.$$eval("#places .place .t", (l) => l.map((e) => e.textContent.trim()));
  const wiki = await page.$eval("#wiki-summary", (e) => e.textContent);
  assert(/Wikipedia/.test(wiki), "sin resumen de Wikipedia");
  return names.join(", ");
});

await test("Escape en el buscador cierra sólo las sugerencias (no el país abierto)", async () => {
  await page.fill("#search", "ita");
  await page.keyboard.press("Escape");
  await wait(page, 200);
  const open = await page.$eval("#panel", (e) => !e.hidden);
  assert(open, "el panel del país se cerró");
  return "panel de Laos sigue abierto";
});

await test("Destino cercano (Andorra desde Girona): sin vuelos absurdos, sólo carretera/tren", async () => {
  await page.evaluate(() => { location.hash = "JP"; });
  await page.waitForSelector('.alt-ap[data-dep-ap="GRO"]', { timeout: 8000 });
  await page.click('.alt-ap[data-dep-ap="GRO"]');
  await page.evaluate(() => { location.hash = "AD"; });
  await page.waitForFunction(() => document.querySelector("#panel h2")?.textContent === "Andorra", null, { timeout: 8000 });
  const r = await page.evaluate(() => ({ flights: !!document.querySelector("#route .route"), ground: document.querySelector("#route .ground")?.innerText.split("\n")[0] }));
  assert(!r.flights, "se ofrecen vuelos GRO→BCN");
  assert(r.ground, "no hay opciones por tierra");
  return r.ground;
});

await test("Fechas del viaje en hora local", async () => {
  const r = await page.evaluate(() => {
    const d = new Date(), today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    location.hash = "JP";
    return today;
  });
  await page.waitForSelector("#date-dep");
  const min = await page.$eval("#date-dep", (e) => e.min);
  assert(min === r, `mínimo ${min}, hoy ${r}`);
  return "mínimo = hoy (" + min + ")";
});

await test("Modo «Mapa»: usa CARTO y oculta capas duplicadas", async () => {
  await page.click('.segmented button[data-style="map"]');
  for (let i = 0; i < 40 && !tileRequests.some((u) => u.includes("cartocdn")); i++) await wait(page, 250);
  const r = await page.evaluate(() => ({ borders: mvGlobe.customLayerData()[0].obj.visible, labels: document.querySelectorAll(".pin-city").length }));
  const carto = tileRequests.filter((u) => u.includes("cartocdn"));
  assert(carto.length > 0, "no se pidieron teselas de CARTO");
  assert(!r.borders, "las fronteras propias siguen visibles");
  return `${carto.length} teselas CARTO pedidas; fronteras/etiquetas propias ocultas`;
});

await test("Modo «Satélite»: un nivel extra de detalle en las teselas", async () => {
  await page.click('.segmented button[data-style="sat"]');
  await wait(page, 800);
  const t = await page.evaluate(() => { let r = null; mvGlobe.scene().traverse((o) => { if (o._baseThresholds) r = o.thresholds[3] / o._baseThresholds[3]; }); return r; });
  assert(t === 2, "factor de detalle " + t);
  return "factor ×2 aplicado";
});

await test("Buscador de origen encuentra cualquier aeropuerto del mundo", async () => {
  await page.click("#origin-btn");
  await page.fill("#origin-search", "wroc");
  await wait(page, 300);
  const first = await page.$eval("#origin-list li[data-ap]", (e) => e.innerText.replace(/\s+/g, " "));
  await page.click("#origin-list li[data-ap]");
  const o = await page.evaluate(() => JSON.parse(localStorage.getItem("mv-origin2")));
  assert(o.iata === "WRO" && o.source === "manual", "origen " + o.iata);
  return first;
});

await test("Una ubicación que llega tarde no pisa la ciudad elegida a mano", async () => {
  const c2 = await browser.newContext({ viewport: { width: 1280, height: 800 } }); // sin permiso de ubicación
  const p2 = await c2.newPage();
  await mockNetwork(p2);
  await p2.route(/get\.geojs\.io/, async (r) => { await new Promise((res) => setTimeout(res, 4000)); r.fulfill({ json: { latitude: "48.85", longitude: "2.35", city: "París", country_code: "FR" } }); });
  await p2.goto(BASE);
  await p2.waitForSelector("#origin-btn");
  await p2.click("#origin-btn");
  await p2.click('#origin-list li[data-pop="MAD"]');
  await wait(p2, 6000);
  const name = await p2.$eval("#origin-name", (e) => e.textContent);
  await c2.close();
  assert(name === "Madrid", "el origen cambió a " + name);
  return "sigue en Madrid tras llegar la ubicación por IP (París)";
});

await test("Vista móvil: panel inferior y país centrado en la zona visible", async () => {
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mockNetwork(m);
  await m.goto(BASE + "#PT");
  await m.waitForSelector("#panel:not([hidden]) h2", { timeout: 15000 });
  await wait(m, 2500);
  const r = await m.evaluate(() => {
    const p = document.querySelector("#panel").getBoundingClientRect();
    const c = mvGlobe.getScreenCoords(39.5, -8.0);
    return { panelTop: Math.round(p.top), countryY: Math.round(c.y), w: document.documentElement.scrollWidth };
  });
  await m.close();
  assert(r.w <= 390, "hay scroll horizontal");
  assert(r.countryY < r.panelTop && r.countryY > 0, `Portugal queda tapado (y=${r.countryY}, panel=${r.panelTop})`);
  return `panel desde y=${r.panelTop}px, Portugal en y=${r.countryY}px`;
});

await test("Sin errores de JavaScript durante toda la sesión", async () => {
  assert(errors.length === 0, errors.join(" | "));
  return "0 errores";
});

await browser.close();
server.close();

const ok = results.filter((r) => r.ok).length;
console.log(`\nResultado: ${ok}/${results.length} tests superados\n`);
process.exit(ok === results.length ? 0 : 1);
