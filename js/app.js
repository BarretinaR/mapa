/* Mundo Viajero – globo interactivo con información turística y rutas desde tu ciudad */
import { BufferGeometry, Float32BufferAttribute, LineSegments, LineBasicMaterial } from "../vendor/three.core.min.js";

(() => {
  "use strict";

  // ---------------------------------------------------------------- utilidades
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
  const regionNames = new Intl.DisplayNames(["es"], { type: "region" });
  const nf = new Intl.NumberFormat("es-ES");

  const flag = (iso) =>
    /^[A-Z]{2}$/.test(iso) ? String.fromCodePoint(...[...iso].map((c) => 127397 + c.charCodeAt(0))) : "🏳️";

  function esName(iso, fallback) {
    if (/^[A-Z]{2}$/.test(iso)) {
      try {
        const n = regionNames.of(iso);
        if (n && n !== iso) return n;
      } catch (_) { /* ignorar */ }
    }
    return fallback || iso;
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371, r = Math.PI / 180;
    const dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  const fmtHours = (h) => {
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60 / 5) * 5;
    return mm === 60 ? `${hh + 1} h` : hh === 0 ? `${mm} min` : `${hh} h${mm ? " " + mm + " min" : ""}`;
  };
  const isoDate = (d) => d.toISOString().slice(0, 10);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const cleanCity = (c) => String(c).replace(/\s*\(.*?\)\s*/g, "").trim();

  async function fetchJSON(url, signal, timeout = 9000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    if (signal) signal.addEventListener("abort", () => ctrl.abort(), { once: true });
    try {
      const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally {
      clearTimeout(t);
    }
  }

  function toast(msg, ms = 4200) {
    const el = $("#toast");
    el.innerHTML = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (el.hidden = true), ms);
  }

  // Offset UTC (en minutos) de una zona IANA en este momento
  function tzOffsetMinutes(tz) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date());
      const name = parts.find((p) => p.type === "timeZoneName").value; // "GMT+5:30"
      const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (!m) return 0;
      return (m[1] === "-" ? -1 : 1) * (parseInt(m[2], 10) * 60 + parseInt(m[3] || "0", 10));
    } catch (_) {
      return null;
    }
  }
  const parseUtc = (s) => {
    const m = String(s).match(/UTC(?:([+-−])(\d{2}):(\d{2}))?/);
    if (!m) return null;
    if (!m[1]) return 0;
    return (m[1] === "+" ? 1 : -1) * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10));
  };
  const fmtDiff = (min) => {
    if (min === 0) return "Misma hora";
    const sign = min > 0 ? "+" : "−";
    const a = Math.abs(min), h = Math.floor(a / 60), m = a % 60;
    return `${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""} h`;
  };

  // ---------------------------------------------------------------- estado
  const ORIGINS = window.ORIGINS.map(([name, iata, lat, lng, iso, tz]) => ({ name, iata, lat, lng, iso, tz }));
  const AIRPORTS = window.AIRPORTS;
  const TOURISM = window.TOURISM;

  const state = {
    features: [],
    byIso: new Map(),
    countries: [], // para el buscador
    selected: null,
    hover: null,
    origin: null,
    places: [],
    activePlace: null,
    centerIso: null,
    reqId: 0,
    abort: null,
    depart: isoDate(addDays(new Date(), 30)),
    ret: isoDate(addDays(new Date(), 37)),
    labelsOn: false
  };

  // ---------------------------------------------------------------- globo
  const RETINA = (window.devicePixelRatio || 1) >= 1.5;
  const STYLES = {
    sat: {
      url: (x, y, l) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${l}/${y}/${x}`,
      attr: 'Imágenes © <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a>, Maxar, Earthstar Geographics',
      detail: 2, // un nivel más de detalle que el predeterminado
      overlays: true
    },
    map: {
      // CARTO Voyager: mapa limpio y legible, con teselas @2x en pantallas Retina
      url: (x, y, l) => `https://${"abcd"[(x + y) % 4]}.basemaps.cartocdn.com/rastertiles/voyager/${l}/${x}/${y}${RETINA ? "@2x" : ""}.png`,
      attr: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      detail: 2,
      overlays: false // el propio mapa ya trae fronteras y nombres
    },
    classic: { url: null, attr: "NASA Blue Marble · Natural Earth", detail: 1, overlays: true }
  };

  const globe = new Globe($("#globe"), { rendererConfig: { antialias: true, logarithmicDepthBuffer: true } })
    .backgroundImageUrl("assets/night-sky.png")
    .globeImageUrl("assets/earth-blue-marble.jpg")
    .bumpImageUrl("assets/earth-topology.png")
    .showAtmosphere(true)
    .atmosphereColor("#7cc4ff")
    .atmosphereAltitude(0.18)
    // Sólo se dibujan como polígonos el país seleccionado y el que está bajo el ratón;
    // las fronteras de todos los países van en un único objeto (ver buildBorders) para que sea fluido.
    .polygonsTransitionDuration(0)
    .polygonCapColor((d) => capColor(d))
    .polygonSideColor(() => "rgba(0,0,0,0)")
    .polygonStrokeColor((d) => (d.properties.iso === state.selected ? "rgba(255,181,71,0.95)" : "rgba(255,255,255,0.9)"))
    .polygonAltitude((d) => (d.properties.iso === state.selected ? 0.005 : 0.004))
    .polygonLabel((d) => `<div class="globe-tip">${flag(d.properties.iso)} <b>${esc(d.properties.label)}</b><br><span style="opacity:.7">Haz clic para ver la guía</span></div>`)
    .onPolygonClick((d) => selectCountry(d.properties.iso))
    .onGlobeClick(({ lat, lng }) => {
      const f = countryAt(lat, lng);
      if (f) selectCountry(f.properties.iso);
    })
    .customThreeObject((d) => d.obj)
    .customThreeObjectUpdate(() => {})
    .arcColor(() => ["rgba(79,195,255,0.95)", "rgba(255,181,71,0.95)"])
    .arcStroke(0.7)
    .arcDashLength(0.35)
    .arcDashGap(0.12)
    .arcDashAnimateTime(2200)
    .arcAltitudeAutoScale(0.4)
    .ringColor(() => (t) => `rgba(79,195,255,${1 - t})`)
    .ringMaxRadius(3)
    .ringPropagationSpeed(2)
    .ringRepeatPeriod(1400)
    .htmlElement((d) => d.el)
    .htmlAltitude((d) => d.alt || 0.01)
    .htmlTransitionDuration(0)
    .onZoom(onZoom);

  function capColor(d) {
    if (d.properties.iso === state.selected) return d.properties.iso === state.hover?.properties.iso ? "rgba(255,181,71,0.32)" : "rgba(255,181,71,0.22)";
    return "rgba(255,255,255,0.16)";
  }
  function refreshPolygons() {
    const list = state.selected ? state.features.filter((f) => f.properties.iso === state.selected) : [];
    if (state.hover && state.hover.properties.iso !== state.selected) list.push(state.hover);
    globe.polygonsData(list);
  }

  // Todas las fronteras en un único LineSegments (1 llamada de dibujo en vez de miles)
  function buildBorders() {
    const pos = [];
    const R = globe.getGlobeRadius();
    const alt = 0.0015;
    const toXYZ = ([lng, lat]) => {
      const phi = (90 - lat) * Math.PI / 180, theta = (90 - lng) * Math.PI / 180, r = R * (1 + alt);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
    };
    state.features.forEach((f) => {
      const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      polys.forEach((poly) => poly.forEach((ring) => {
        for (let i = 0; i < ring.length - 1; i++) {
          // densificamos segmentos largos para que sigan la curvatura del globo
          const [a, b] = [ring[i], ring[i + 1]];
          const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2));
          let prev = toXYZ(a);
          for (let k = 1; k <= steps; k++) {
            const t = k / steps;
            const cur = toXYZ([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
            pos.push(...prev, ...cur);
            prev = cur;
          }
        }
      }));
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    const mat = new LineBasicMaterial({ color: 0xffe08a, transparent: true, opacity: 0.6 });
    state.borders = new LineSegments(geo, mat);
    state.borders.raycast = () => {}; // las líneas no deben "robar" el clic al país que hay debajo
    state.borders.visible = STYLES[state.style || "sat"].overlays;
    globe.customLayerData([{ obj: state.borders }]);
  }

  // Detección del país bajo el puntero (más ligera que hacer raycasting contra cientos de polígonos)
  let moveRaf = null, lastMove = null;
  function onPointerMove(e) {
    if (e.pointerType === "touch") return;
    lastMove = e;
    if (moveRaf) return;
    moveRaf = requestAnimationFrame(() => {
      moveRaf = null;
      const rect = $("#globe").getBoundingClientRect();
      const c = globe.toGlobeCoords(lastMove.clientX - rect.left, lastMove.clientY - rect.top);
      const f = c ? countryAt(c.lat, c.lng) : null;
      if (f !== state.hover) {
        state.hover = f;
        $("#globe").style.cursor = f ? "pointer" : "";
        refreshPolygons();
      }
    });
  }

  window.mvGlobe = globe; // útil para depurar desde la consola
  const controls = globe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;
  controls.enableDamping = true;
  controls.minDistance = 100.4;
  controls.addEventListener("start", () => {
    controls.autoRotate = false;
    $("#hint").classList.add("hide");
  });

  // Las teselas que elige globe.gl por defecto son de poco detalle (se ven borrosas, sobre todo en Retina).
  // Multiplicamos los umbrales de distancia para cargar uno o dos niveles más de detalle.
  function applyTileDetail(factor, tries = 0) {
    let found = false;
    globe.scene().traverse((o) => {
      if (Array.isArray(o.thresholds) && "minLevel" in o) {
        if (!o._baseThresholds) o._baseThresholds = o.thresholds.slice();
        o.thresholds = o._baseThresholds.map((t) => t * factor);
        found = true;
      }
    });
    // la capa de teselas se crea de forma asíncrona al iniciar el globo: reintentamos si aún no existe
    if (!found && tries < 20) return setTimeout(() => applyTileDetail(factor, tries + 1), 150);
    // fuerza a recalcular y pedir las teselas aunque la cámara esté quieta (un cambio mínimo de altitud)
    const pov = globe.pointOfView();
    globe.pointOfView({ ...pov, altitude: pov.altitude * 1.0001 }, 0);
  }

  function setStyle(key) {
    const s = STYLES[key];
    state.style = key;
    globe.globeTileEngineUrl(s.url);
    applyTileDetail(s.detail);
    if (state.borders) state.borders.visible = s.overlays;
    afterZoom(globe.pointOfView());
    $("#attribution").innerHTML = s.attr + " · Datos: Wikipedia, Wikidata, REST Countries";
    $$(".segmented button").forEach((b) => b.classList.toggle("active", b.dataset.style === key));
    try { localStorage.setItem("mv-style", key); } catch (_) { /* ignorar */ }
  }

  function resize() {
    globe.width(window.innerWidth).height(window.innerHeight);
    applyOffset();
  }
  function applyOffset() {
    const open = !$("#panel").hidden;
    if (!open) return globe.globeOffset([0, 0]);
    if (isMobile()) {
      // centramos el globo en la franja visible entre la barra superior y el panel inferior
      const h = window.innerHeight;
      const top = $(".topbar").getBoundingClientRect().bottom;
      const bottom = h * 0.4;
      globe.globeOffset([0, (top + bottom) / 2 - h / 2]);
    }
    else globe.globeOffset([-(Math.min(440, window.innerWidth * 0.4) + 12) / 2, 0]);
  }
  window.addEventListener("resize", resize);

  // ---------------------------------------------------------------- capa HTML: origen, lugares y etiquetas de países
  function makePin(cls, html, onClick) {
    const el = document.createElement("div");
    el.className = cls;
    el.innerHTML = html;
    if (onClick) {
      el.style.pointerEvents = "auto";
      // evitamos que el globo interprete también el clic (con coordenadas erróneas)
      ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"].forEach((t) =>
        el.addEventListener(t, (e) => e.stopPropagation()));
      el.addEventListener("click", (e) => { e.stopPropagation(); onClick(); });
    } else {
      el.style.pointerEvents = "none";
    }
    return el;
  }

  function injectPinStyles() {
    const css = `
      .pin-origin{transform:translate(-50%,-100%);font-size:12px;font-weight:700;color:#fff;white-space:nowrap;text-shadow:0 1px 3px #000;display:flex;flex-direction:column;align-items:center;pointer-events:none}
      .pin-origin span{background:rgba(79,195,255,.9);color:#02121c;padding:2px 8px;border-radius:99px;margin-bottom:2px}
      .pin-place{transform:translate(-50%,-50%);cursor:pointer;display:flex;align-items:center;gap:6px}
      .pin-place b{width:24px;height:24px;border-radius:50%;background:#ffb547;color:#1a1205;display:grid;place-items:center;font-size:12px;box-shadow:0 0 0 3px rgba(255,181,71,.35),0 2px 8px rgba(0,0,0,.6);transition:transform .2s}
      .pin-place i{font-style:normal;font-size:12px;color:#fff;background:rgba(10,14,26,.85);padding:3px 8px;border-radius:8px;white-space:nowrap;opacity:0;transition:opacity .2s;pointer-events:none}
      .pin-place:hover i,.pin-place.active i{opacity:1}
      .pin-place.active b,.pin-place:hover b{transform:scale(1.25)}
      .pin-country{transform:translate(-50%,-50%);font-size:12.5px;font-weight:700;color:#ffe9a8;text-shadow:0 1px 3px #000,0 0 8px #000;white-space:nowrap;letter-spacing:.8px;text-transform:uppercase}
      .pin-city{transform:translate(-4px,-50%);display:flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:#fff;text-shadow:0 1px 2px #000,0 0 6px #000;white-space:nowrap}
      .pin-city i{width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 0 1.5px rgba(0,0,0,.7);flex:none}
      .pin-city.capital{font-weight:700}
      .pin-city.capital i{width:8px;height:8px;background:#ffb547;border-radius:1px;transform:rotate(45deg)}`;
    const st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
  }

  function updateHtmlLayer() {
    const items = (state.mapLabels || []).slice();
    state.places.forEach((p) => p.el && items.push({ lat: p.lat, lng: p.lng, alt: 0.012, el: p.el }));
    if (state.origin) items.push({ lat: state.origin.lat, lng: state.origin.lng, alt: 0.012, el: state.originEl });
    globe.htmlElementsData(items);
  }

  function updateRings() {
    globe.ringsData(state.origin ? [{ lat: state.origin.lat, lng: state.origin.lng }] : []);
  }

  // ---------------------------------------------------------------- etiquetas del mapa (países y ciudades)
  // Como en Google Earth: al acercarte aparecen más ciudades; se descartan las que se solaparían en pantalla.
  function buildCountryLabels() {
    const seen = new Set();
    state.countryLabels = [];
    state.features.forEach((f) => {
      const p = f.properties;
      if (seen.has(p.iso) || p.lx == null) return;
      seen.add(p.iso);
      const main = state.byIso.get(p.iso) || f;
      const [minX, minY, maxX, maxY] = main.bbox;
      state.countryLabels.push({
        kind: "country", iso: p.iso, name: p.label, lat: p.ly, lng: p.lx, alt: 0.008,
        size: Math.min(Math.abs(maxX - minX), 60) * Math.abs(maxY - minY), el: null
      });
    });
  }

  async function loadCities() {
    if (state.cities) return state.cities;
    const raw = await (await fetch("data/cities.json")).json();
    state.cities = raw.map(([name, lat, lng, pop, rank, cap, iso]) => ({ kind: "city", name, lat, lng, pop, rank, cap, iso, alt: 0.004, el: null }));
    return state.cities;
  }

  function labelEl(item) {
    if (item.el) return item.el;
    if (item.kind === "country") item.el = makePin("pin-country", esc(item.name));
    else item.el = makePin(`pin-city${item.cap === 2 ? " capital" : ""}`, `<i></i><span>${esc(item.name)}</span>`);
    item.el.dataset.label = item.name;
    return item.el;
  }

  function computeLabels(pov) {
    const alt = pov.altitude;
    if (!STYLES[state.style || "sat"].overlays || alt > 1.8 || !state.countryLabels) return [];
    const horizon = Math.acos(1 / (1 + alt)) * 180 / Math.PI; // ángulo visible desde el centro de la vista
    const maxDeg = Math.min(horizon * 0.9, 80);
    const minPop = alt > 1.2 ? 8e6 : alt > 0.8 ? 2e6 : alt > 0.5 ? 7e5 : alt > 0.3 ? 2.5e5 : alt > 0.15 ? 1e5 : alt > 0.07 ? 3e4 : 0;
    const cands = [];
    if (alt > 0.12) {
      state.countryLabels.forEach((c) => {
        if (c.iso === state.selected && alt < 0.5) return;
        // de lejos mandan los países; de cerca, las ciudades grandes
        cands.push([c, (alt > 0.45 ? 1e10 : 3e5) + c.size * 1e3]);
      });
    }
    (state.cities || []).forEach((c) => {
      const isCap = c.cap === 2;
      if (c.pop < minPop && !(isCap && alt < 1.3)) return;
      cands.push([c, c.pop + (isCap ? 2e7 : 0) + (c.cap === 1 ? 2e5 : 0)]);
    });
    const vis = cands.filter(([c]) => haversine(pov.lat, pov.lng, c.lat, c.lng) / 111.2 < maxDeg);
    vis.sort((a, b) => b[1] - a[1]);

    const W = window.innerWidth, H = window.innerHeight;
    const panel = $("#panel").hidden ? null : $("#panel").getBoundingClientRect();
    const boxes = [], out = [];
    const MAX = isMobile() ? 35 : 75;
    for (const [c] of vis) {
      if (out.length >= MAX) break;
      const sc = globe.getScreenCoords(c.lat, c.lng, c.alt);
      if (!sc || !Number.isFinite(sc.x)) continue;
      const w = c.name.length * (c.kind === "country" ? 7.2 : 6.6) + (c.kind === "country" ? 8 : 16);
      const h = c.kind === "country" ? 18 : 16;
      const box = c.kind === "country" ? [sc.x - w / 2, sc.y - h / 2, sc.x + w / 2, sc.y + h / 2] : [sc.x - 5, sc.y - h / 2, sc.x + w, sc.y + h / 2];
      if (box[2] < 0 || box[0] > W || box[3] < 0 || box[1] > H) continue;
      if (panel && box[0] < panel.right && box[2] > panel.left && box[1] < panel.bottom && box[3] > panel.top) continue;
      if (boxes.some((b) => box[0] < b[2] + 4 && box[2] + 4 > b[0] && box[1] < b[3] + 2 && box[3] + 2 > b[1])) continue;
      boxes.push(box);
      labelEl(c);
      out.push(c);
    }
    return out;
  }

  // Fronteras de regiones / provincias (se cargan al acercarse)
  async function loadRegions() {
    if (state.regionsLoading) return;
    state.regionsLoading = true;
    try {
      const lines = await (await fetch("data/regions.json")).json();
      const R = globe.getGlobeRadius() * 1.0012;
      const pos = [];
      const toXYZ = (lng, lat) => {
        const phi = (90 - lat) * Math.PI / 180, theta = (90 - lng) * Math.PI / 180;
        return [R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta)];
      };
      lines.forEach((l) => {
        let prev = toXYZ(l[0], l[1]);
        for (let i = 2; i < l.length; i += 2) {
          const cur = toXYZ(l[i], l[i + 1]);
          pos.push(...prev, ...cur);
          prev = cur;
        }
      });
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
      state.regions = new LineSegments(geo, new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 }));
      state.regions.visible = false;
      state.regions.raycast = () => {};
      globe.customLayerData([{ obj: state.borders }, { obj: state.regions }]);
      afterZoom(globe.pointOfView());
    } catch (e) {
      state.regionsLoading = false;
    }
  }

  let zoomTimer = null;
  function onZoom(pov) {
    controls.rotateSpeed = clamp(pov.altitude * 0.55, 0.03, 1);
    controls.zoomSpeed = clamp(0.6 + pov.altitude * 0.3, 0.6, 1.2);
    clearTimeout(zoomTimer);
    zoomTimer = setTimeout(() => afterZoom(pov), 120);
  }

  function afterZoom(pov) {
    // grosor de la ruta proporcional al zoom
    const stroke = +clamp(pov.altitude * 0.35, 0.04, 0.7).toFixed(2);
    if (stroke !== state.arcStroke) {
      state.arcStroke = stroke;
      globe.arcStroke(stroke);
    }
    // Etiquetas de países y ciudades
    const labels = computeLabels(pov);
    const prev = state.mapLabels || [];
    if (labels.length !== prev.length || labels.some((l, i) => l !== prev[i])) {
      state.mapLabels = labels;
      updateHtmlLayer();
    }
    // Fronteras de regiones al acercarse
    const overlays = STYLES[state.style || "sat"].overlays;
    if (pov.altitude < 1.0 && overlays && !state.regions) loadRegions();
    if (state.regions) state.regions.visible = overlays && pov.altitude < 1.0;
    // País bajo el centro de la vista → botón de acceso rápido
    const cBtn = $("#center-btn");
    if (pov.altitude < 0.9) {
      const f = countryAt(pov.lat, pov.lng);
      const iso = f && f.properties.iso;
      state.centerIso = iso;
      if (iso && iso !== state.selected) {
        cBtn.innerHTML = `${flag(iso)} Ver guía de <b>${esc(f.properties.label)}</b>`;
        cBtn.hidden = false;
      } else cBtn.hidden = true;
    } else cBtn.hidden = true;
  }

  // ---------------------------------------------------------------- punto en polígono
  function inRing(lng, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function inPoly(lng, lat, poly) {
    if (!inRing(lng, lat, poly[0])) return false;
    for (let k = 1; k < poly.length; k++) if (inRing(lng, lat, poly[k])) return false;
    return true;
  }
  function countryAt(lat, lng) {
    for (const f of state.features) {
      const [minX, minY, maxX, maxY] = f.bbox;
      if (lng < minX || lng > maxX || lat < minY || lat > maxY) continue;
      const g = f.geometry;
      const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
      if (polys.some((p) => inPoly(lng, lat, p))) return f;
    }
    return null;
  }

  // ---------------------------------------------------------------- carga de datos
  async function loadCountries() {
    const gj = await (await fetch("data/countries.geojson")).json();
    gj.features.forEach((f) => {
      const p = f.properties;
      p.label = esName(p.iso, p.es || p.name);
      // bbox y "peso" (nº de vértices) para elegir la geometría principal de cada país
      let minX = 180, minY = 90, maxX = -180, maxY = -90, n = 0;
      const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
      polys.forEach((poly) => poly[0].forEach(([x, y]) => {
        n++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }));
      f.bbox = [minX, minY, maxX, maxY];
      f.weight = n;
      const prev = state.byIso.get(p.iso);
      if (!prev || prev.weight < n) state.byIso.set(p.iso, f);
    });
    state.features = gj.features;
    state.countries = [...state.byIso.values()]
      .map((f) => ({ iso: f.properties.iso, name: f.properties.label, alt: f.properties.name }))
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
    buildBorders();
    buildCountryLabels();
  }

  // ---------------------------------------------------------------- origen
  // El origen guarda dónde está la persona (lat/lng, ciudad) y el aeropuerto desde el que volaría (iata, apLat/apLng).
  const BROWSER_TZ = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (_) { return null; } })();
  let WORLD_AP = null;
  async function loadWorldAirports() {
    if (!WORLD_AP) {
      const raw = await (await fetch("data/airports-world.json")).json();
      WORLD_AP = raw.map(([iata, name, city, lat, lng, iso]) => ({ iata, name, city, lat, lng, iso }));
    }
    return WORLD_AP;
  }
  function airportsNear(lat, lng, n = 4) {
    return (WORLD_AP || [])
      .map((a) => ({ ...a, dist: haversine(lat, lng, a.lat, a.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, n);
  }
  const tzForCountry = (iso) => (ORIGINS.find((o) => o.iso === iso) || {}).tz || null;

  // Origen a partir de una de las ciudades populares de la lista
  function originFromCity(o) {
    return { name: o.name, lat: o.lat, lng: o.lng, iso: o.iso, tz: o.tz, iata: o.iata, apName: null, apLat: o.lat, apLng: o.lng, apDist: 0, source: "manual" };
  }
  // Origen a partir de un aeropuerto de la base mundial
  function originFromAirport(a, source = "manual") {
    return { name: a.city || a.name, lat: a.lat, lng: a.lng, iso: a.iso, tz: tzForCountry(a.iso), iata: a.iata, apName: a.name, apLat: a.lat, apLng: a.lng, apDist: 0, source };
  }
  // Origen a partir de la ubicación real de la persona
  function originFromPosition({ lat, lng, city, iso, source }) {
    const near = airportsNear(lat, lng, 4);
    const ap = near[0];
    return {
      name: city || (ap && ap.city) || "Tu ubicación",
      lat, lng,
      iso: iso || (ap && ap.iso),
      tz: BROWSER_TZ || tzForCountry(iso || (ap && ap.iso)),
      iata: ap.iata, apName: ap.name, apLat: ap.lat, apLng: ap.lng, apDist: ap.dist,
      nearby: near.filter((a) => a.dist < 300).map(({ iata, name, city, lat, lng, dist }) => ({ iata, name, city, lat, lng, dist })),
      source
    };
  }

  function setOrigin(o, { silent = false } = {}) {
    state.origin = { ...o, label: o.name };
    $("#origin-name").textContent = o.name;
    state.originEl = makePin("pin-origin", `<span>${esc(o.source === "gps" || o.source === "ip" ? "Tú · " + o.iata : o.iata)}</span>📍`);
    try { localStorage.setItem("mv-origin2", JSON.stringify(o)); } catch (_) { /* ignorar */ }
    updateRings();
    updateHtmlLayer();
    if (state.selected) {
      renderRoute();
      drawArc();
    }
    if (!silent) {
      const where = o.source === "gps" ? "Te hemos localizado en" : o.source === "ip" ? "Ubicación aproximada:" : "Origen:";
      const ap = o.apDist > 3 ? ` · aeropuerto ${esc(o.iata)} a ${nf.format(Math.round(o.apDist))} km` : ` (${esc(o.iata)})`;
      toast(`📍 ${where} <b>${esc(o.name)}</b>${ap}`);
    }
  }

  // Cambia sólo el aeropuerto de salida, manteniendo la ubicación de la persona
  function setDepartureAirport(iata) {
    const o = state.origin;
    const a = (o.nearby || []).find((x) => x.iata === iata) || (WORLD_AP || []).find((x) => x.iata === iata);
    if (!a) return;
    setOrigin({ ...o, iata: a.iata, apName: a.name, apLat: a.lat, apLng: a.lng, apDist: haversine(o.lat, o.lng, a.lat, a.lng) }, { silent: true });
  }

  async function reverseGeocode(lat, lng, signal) {
    try {
      const r = await fetchJSON(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=es`, signal, 6000);
      return { city: r.city || r.locality || r.principalSubdivision || null, iso: r.countryCode || null };
    } catch (_) {
      return { city: null, iso: null };
    }
  }

  async function ipLocation() {
    try {
      const r = await fetchJSON("https://get.geojs.io/v1/ip/geo.json", null, 6000);
      if (r.latitude && r.longitude) return { lat: +r.latitude, lng: +r.longitude, city: r.city || null, iso: r.country_code || null };
    } catch (_) { /* probamos otro servicio */ }
    try {
      const r = await fetchJSON("https://ipapi.co/json/", null, 6000);
      if (r.latitude && r.longitude) return { lat: +r.latitude, lng: +r.longitude, city: r.city || null, iso: r.country_code || null };
    } catch (_) { /* sin ubicación por IP */ }
    return null;
  }

  function gpsLocation() {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) return reject(new Error("no soportado"));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 }
      );
    });
  }

  // Detecta dónde está la persona: GPS del navegador (preciso, pide permiso) y, como respaldo, su IP (aproximado).
  async function detectLocation({ manual = false } = {}) {
    const status = $("#geo-status");
    const say = (t) => { if (manual) status.textContent = t; };
    say("Buscando tu ubicación…");
    await loadWorldAirports();
    const prev = state.origin;
    let gotGps = false;

    const apply = async (pos, source) => {
      let { city, iso } = pos;
      if (source === "gps") {
        const g = await reverseGeocode(pos.lat, pos.lng);
        city = g.city || city;
        iso = g.iso || iso;
      }
      const o = originFromPosition({ lat: pos.lat, lng: pos.lng, city, iso, source });
      const changed = !prev || prev.iata !== o.iata || prev.name !== o.name || prev.source !== o.source;
      setOrigin(o, { silent: !manual && !changed });
      say(`Ubicación ${source === "gps" ? "detectada" : "aproximada (por tu conexión)"}: ${o.name}. Aeropuerto más cercano: ${o.apName} (${o.iata}), a ${nf.format(Math.round(o.apDist))} km.`);
    };

    // Ubicación aproximada por IP: rápida y sin permisos (no sustituye a una ubicación GPS)
    const ipP = ipLocation().then((pos) => { if (pos && !gotGps) return apply(pos, "ip"); });

    let perm = "prompt";
    try { perm = (await navigator.permissions.query({ name: "geolocation" })).state; } catch (_) { /* Safari antiguo */ }
    if (perm !== "denied" || manual) {
      try {
        const pos = await gpsLocation();
        gotGps = true;
        await apply(pos, "gps");
        if (manual) setTimeout(closeOriginModal, 1200);
        return;
      } catch (err) {
        say(err && err.code === 1
          ? "Has bloqueado el permiso de ubicación. Actívalo en los ajustes del navegador o elige tu ciudad abajo."
          : "No se pudo obtener la ubicación exacta. Usamos una aproximada; también puedes elegir tu ciudad abajo.");
      }
    }
    await ipP;
  }

  function renderOriginList(q = "") {
    const nq = norm(q);
    const cur = state.origin && state.origin.iata;
    let html = "";
    if (!nq && state.origin && state.origin.nearby && state.origin.nearby.length > 1) {
      html += `<li class="muted small" style="cursor:default">Aeropuertos cerca de ti</li>` + state.origin.nearby
        .map((a) => `<li data-alt="${a.iata}" class="${a.iata === cur ? "selected" : ""}"><span>🛫</span><span>${esc(a.city || a.name)} <span class="muted small">· ${nf.format(Math.round(a.dist))} km</span></span><span class="code">${a.iata}</span></li>`)
        .join("") + `<li class="muted small" style="cursor:default">Ciudades populares</li>`;
    }
    const pop = ORIGINS.filter((o) => !nq || norm(o.name).includes(nq) || norm(o.iata).includes(nq) || norm(esName(o.iso)).includes(nq));
    html += pop.map((o) => `<li data-pop="${o.iata}" class="${cur === o.iata ? "selected" : ""}">
        <span>${flag(o.iso)}</span><span>${esc(o.name)} <span class="muted small">· ${esc(esName(o.iso))}</span></span><span class="code">${o.iata}</span></li>`).join("");
    if (nq && WORLD_AP) {
      const seen = new Set(pop.map((o) => o.iata));
      const aps = WORLD_AP.filter((a) => !seen.has(a.iata) && (norm(a.city).includes(nq) || norm(a.name).includes(nq) || norm(a.iata) === nq || norm(esName(a.iso)).includes(nq))).slice(0, 25);
      html += aps.map((a) => `<li data-ap="${a.iata}" class="${cur === a.iata ? "selected" : ""}">
        <span>${flag(a.iso)}</span><span>${esc(a.city || a.name)} <span class="muted small">· ${esc(a.name)}</span></span><span class="code">${a.iata}</span></li>`).join("");
    }
    $("#origin-list").innerHTML = html || `<li class="muted">Sin resultados. Prueba con el nombre de la ciudad o el código del aeropuerto.</li>`;
  }
  function openOriginModal() {
    $("#origin-modal").hidden = false;
    $("#geo-status").textContent = "";
    $("#origin-search").value = "";
    renderOriginList();
    loadWorldAirports().catch(() => {});
    if (!isMobile()) setTimeout(() => $("#origin-search").focus(), 50);
  }
  function closeOriginModal() { $("#origin-modal").hidden = true; }

  // ---------------------------------------------------------------- selección de país
  function countryView(iso) {
    const f = state.byIso.get(iso);
    const ap = AIRPORTS[iso];
    if (f) {
      let [minX, minY, maxX, maxY] = f.bbox;
      let spanX = maxX - minX;
      if (spanX > 180) spanX = 40; // países que cruzan el antimeridiano (Rusia, Fiyi…)
      const span = Math.max(spanX, maxY - minY);
      return {
        lat: f.properties.ly ?? (minY + maxY) / 2,
        lng: f.properties.lx ?? (minX + maxX) / 2,
        altitude: clamp(span / 32, 0.18, 2.0) * (isMobile() ? 1.35 : 1)
      };
    }
    if (ap) return { lat: ap[2], lng: ap[3], altitude: 0.3 };
    return null;
  }

  function selectCountry(iso, { fly = true } = {}) {
    if (!iso) return;
    state.selected = iso;
    state.activePlace = null;
    controls.autoRotate = false;
    $("#hint").classList.add("hide");
    $("#center-btn").hidden = true;
    refreshPolygons();
    clearPlaces();
    openPanel();
    renderPanel(iso);
    drawArc();
    if (fly) {
      const v = countryView(iso);
      if (v) globe.pointOfView(v, 1600);
    }
    try { history.replaceState(null, "", "#" + iso); } catch (_) { /* ignorar */ }
  }

  function deselect() {
    state.selected = null;
    state.reqId++;
    if (state.abort) state.abort.abort();
    clearPlaces();
    globe.arcsData([]);
    refreshPolygons();
    closePanel();
    try { history.replaceState(null, "", location.pathname + location.search); } catch (_) { /* ignorar */ }
  }

  function openPanel() {
    $("#panel").hidden = false;
    applyOffset();
  }
  function closePanel() {
    $("#panel").hidden = true;
    applyOffset();
  }

  function destInfo(iso) {
    const ap = AIRPORTS[iso];
    const f = state.byIso.get(iso);
    if (ap) return { iata: ap[0], city: ap[1], lat: ap[2], lng: ap[3] };
    if (f) return { iata: null, city: f.properties.label, lat: f.properties.ly, lng: f.properties.lx };
    return null;
  }

  function drawArc() {
    if (!state.selected || !state.origin) return globe.arcsData([]);
    const d = destInfo(state.selected);
    if (!d || haversine(state.origin.lat, state.origin.lng, d.lat, d.lng) < 30) return globe.arcsData([]);
    globe.arcsData([{ startLat: state.origin.lat, startLng: state.origin.lng, endLat: d.lat, endLng: d.lng }]);
  }

  // ---------------------------------------------------------------- lugares en el globo
  function clearPlaces() {
    state.places = [];
    updateHtmlLayer();
  }
  function setPlaces(list) {
    state.places = list
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
      .map((p) => ({
        ...p,
        el: makePin("pin-place", `<b>${p.n}</b><i>${esc(p.name)}</i>`, () => focusPlace(p.n, true))
      }));
    updateHtmlLayer();
  }
  function focusPlace(n, fromGlobe) {
    const p = state.places.find((x) => x.n === n);
    state.activePlace = n;
    state.places.forEach((x) => x.el && x.el.classList.toggle("active", x.n === n));
    $$(".place").forEach((li) => li.classList.toggle("active", Number(li.dataset.n) === n));
    if (p) {
      globe.pointOfView({ lat: p.lat, lng: p.lng, altitude: 0.06 }, 1800);
      if (fromGlobe) {
        const li = $(`.place[data-n="${n}"]`);
        if (li) li.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  // ---------------------------------------------------------------- panel
  const skeleton = (n = 3) => Array.from({ length: n }, (_, i) => `<div class="skeleton" style="width:${90 - i * 12}%"></div>`).join("");

  function renderPanel(iso) {
    const f = state.byIso.get(iso);
    const name = f ? f.properties.label : esName(iso);
    const t = TOURISM[iso];
    const cont = f && f.properties.cont ? f.properties.cont : "";
    const contEs = { Europe: "Europa", Asia: "Asia", Africa: "África", "North America": "América del Norte", "South America": "América del Sur", Oceania: "Oceanía", Antarctica: "Antártida", "Seven seas (open ocean)": "Océanos" }[cont] || cont;

    $("#panel-content").innerHTML = `
      <div class="hero" id="hero">
        <div class="hero-text">
          <div class="flag">${flag(iso)}</div>
          <h2>${esc(name)}</h2>
          <div class="sub" id="hero-sub">${esc(contEs)}</div>
          ${countryEarthUrl(iso, name) ? `<a class="hero-earth" href="${countryEarthUrl(iso, name)}" target="_blank" rel="noopener">🌍 Ver ${esc(name)} en Google Earth</a>` : ""}
        </div>
      </div>

      <section class="section">
        <h3>🧭 Resumen</h3>
        <div id="summary">${t ? `<p>${esc(t.r)}</p>` : ""}<div id="wiki-summary">${t ? "" : skeleton(4)}</div></div>
      </section>

      <section class="section">
        <h3>📊 Datos rápidos</h3>
        <div class="facts" id="facts">${skeleton(2)}</div>
      </section>

      <section class="section" id="route-section">
        <h3>✈️ Cómo llegar</h3>
        <div id="route"></div>
      </section>

      <section class="section">
        <h3>⭐ Imprescindibles</h3>
        <ul class="places" id="places">${t ? "" : skeleton(5)}</ul>
        <div id="more-places"></div>
      </section>

      <section class="section">
        <h3>💡 Recomendaciones</h3>
        <div id="tips"></div>
      </section>`;

    renderRoute();
    renderTips(iso, null);

    if (t) {
      const list = t.top.map(([n, d, lat, lng], i) => ({ n: i + 1, name: n, desc: d, lat, lng }));
      renderPlaces(list, name);
      setPlaces(list);
    }

    loadDynamic(iso, name);
  }

  // Enlaces a Google Earth (vista 3D) y Street View
  const earthUrl = (lat, lng, distM, name, tilt = 55) =>
    `https://earth.google.com/web/search/${encodeURIComponent(name || "")}/@${(+lat).toFixed(5)},${(+lng).toFixed(5)},0a,${Math.round(distM)}d,35y,0h,${tilt}t,0r`;
  const streetViewUrl = (lat, lng) => `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${(+lat).toFixed(5)},${(+lng).toFixed(5)}`;
  function countryEarthUrl(iso, name) {
    const f = state.byIso.get(iso);
    if (!f) return null;
    const [minX, minY, maxX, maxY] = f.bbox;
    const span = Math.max(Math.min(maxX - minX, 60), maxY - minY);
    return earthUrl(f.properties.ly, f.properties.lx, clamp(span * 111000 * 2.2, 60000, 9000000), name, 0);
  }

  function renderPlaces(list, countryName, target = "#places") {
    $(target).innerHTML = list
      .map((p) => {
        const q = encodeURIComponent(`${p.name}${countryName ? ", " + countryName : ""}`);
        const maps = Number.isFinite(p.lat)
          ? `https://www.google.com/maps/search/?api=1&query=${q}`
          : `https://www.google.com/maps/search/?api=1&query=${q}`;
        return `<li class="place" data-n="${p.n}">
          ${p.img ? `<img loading="lazy" src="${esc(p.img)}" alt="">` : `<span class="num">${p.n}</span>`}
          <div>
            <div class="t">${p.img ? `<span class="muted">${p.n}.</span> ` : ""}${esc(p.name)}</div>
            ${p.desc ? `<div class="d">${esc(p.desc)}</div>` : ""}
            <div class="acts">
              ${Number.isFinite(p.lat) ? `<a href="#" data-fly="${p.n}">🔭 Ver en el globo</a>` : ""}
              ${Number.isFinite(p.lat) ? `<a href="${earthUrl(p.lat, p.lng, 1500, p.name)}" target="_blank" rel="noopener" data-earth>🌍 Google Earth</a>` : ""}
              <a href="${maps}" target="_blank" rel="noopener">🗺️ Google Maps</a>
              ${Number.isFinite(p.lat) ? `<a href="${streetViewUrl(p.lat, p.lng)}" target="_blank" rel="noopener">🚶 Street View</a>` : ""}
              ${p.wiki ? `<a href="${esc(p.wiki)}" target="_blank" rel="noopener">📖 Wikipedia</a>` : ""}
            </div>
          </div>
        </li>`;
      })
      .join("");
  }

  // ---------------------------------------------------------------- ruta / vuelos
  function flightLinks(o, d, depart, ret) {
    const yymmdd = (s) => s.slice(2).replace(/-/g, "");
    const O = o.iata, D = d.iata;
    const city = cleanCity(d.city);
    return {
      google: `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights to ${D} from ${O} on ${depart} through ${ret}`)}&hl=es&curr=EUR`,
      skyscanner: `https://www.skyscanner.es/transporte/vuelos/${O.toLowerCase()}/${D.toLowerCase()}/${yymmdd(depart)}/${yymmdd(ret)}/`,
      kayak: `https://www.kayak.es/flights/${O}-${D}/${depart}/${ret}`,
      explore: `https://www.google.com/travel/explore?q=${encodeURIComponent(`Flights from ${O}`)}&hl=es&curr=EUR`,
      rome2rio: `https://www.rome2rio.com/es/map/${encodeURIComponent(cleanCity(o.name))}/${encodeURIComponent(city)}`,
      hotels: `https://www.google.com/travel/search?q=${encodeURIComponent("hoteles en " + city)}&hl=es&curr=EUR&checkin=${depart}&checkout=${ret}`,
      booking: `https://www.booking.com/searchresults.es.html?ss=${encodeURIComponent(city)}&checkin=${depart}&checkout=${ret}`,
      drive: `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o.source === "gps" ? `${o.lat},${o.lng}` : o.name)}&destination=${encodeURIComponent(city)}`,
      train: `https://www.thetrainline.com/es`
    };
  }

  function renderRoute() {
    const el = $("#route");
    if (!el || !state.selected) return;
    const o = state.origin;
    const d = destInfo(state.selected);
    if (!o || !d) {
      el.innerHTML = `<p class="muted">Elige tu ciudad de origen para ver cómo llegar.</p>`;
      return;
    }
    const apLat = o.apLat ?? o.lat, apLng = o.apLng ?? o.lng;
    const dist = haversine(apLat, apLng, d.lat, d.lng);
    const groundDist = haversine(o.lat, o.lng, d.lat, d.lng);
    const hours = dist / 820 + 0.5;
    const sameCountry = o.iso === state.selected;
    const sameAirport = d.iata && d.iata === o.iata;
    const links = d.iata ? flightLinks(o, d, state.depart, state.ret) : null;
    const name = state.byIso.get(state.selected)?.properties.label || esName(state.selected);
    const [stopsShort, stopsLong] = dist > 9500 ? ["1+ escala", "lo habitual es hacer escala"] : dist > 6500 ? ["0-1 escalas", "directo o con 1 escala"] : ["Directo", "suele haber vuelos directos"];

    let html = "";
    if (!sameAirport && d.iata) {
      html += `
        <div class="route">
          <div class="route-line">
            <div class="route-end"><div class="code">${esc(o.iata)}</div><div class="city">${esc(o.apName && o.apDist > 3 ? cleanCity(o.apName).replace(/ (International )?Airport$/i, "") : o.label)}</div></div>
            <div class="route-mid"><span>✈ ${nf.format(Math.round(dist))} km</span></div>
            <div class="route-end"><div class="code">${esc(d.iata)}</div><div class="city">${esc(d.city)}</div></div>
          </div>
          <div class="route-stats">
            <div><b>≈ ${fmtHours(hours)}</b><small>vuelo directo estimado</small></div>
            <div><b>${stopsShort}</b><small>${stopsLong}</small></div>
            <div id="tz-diff"><b>…</b><small>diferencia horaria</small></div>
          </div>
        </div>
        ${departureNote(o)}
        <div class="dates">
          <label>Ida<input type="date" id="date-dep" value="${state.depart}" min="${isoDate(new Date())}"></label>
          <label>Vuelta<input type="date" id="date-ret" value="${state.ret}" min="${state.depart}"></label>
        </div>
        <div class="links">
          <a class="btn btn-primary" href="${links.google}" target="_blank" rel="noopener">🔎 Buscar vuelos en Google Flights</a>
          <a class="btn" href="${links.skyscanner}" target="_blank" rel="noopener">Skyscanner</a>
          <a class="btn" href="${links.kayak}" target="_blank" rel="noopener">Kayak</a>
          <a class="btn" href="${links.rome2rio}" target="_blank" rel="noopener">Rome2rio (todas las opciones)</a>
          <a class="btn" href="${links.explore}" target="_blank" rel="noopener">Google Travel Explore</a>
          <a class="btn" href="${links.hotels}" target="_blank" rel="noopener">🏨 Hoteles (Google)</a>
          <a class="btn" href="${links.booking}" target="_blank" rel="noopener">🏨 Booking</a>
        </div>
        <p class="note">Llegada principal: aeropuerto <b>${esc(d.iata)}</b> (${esc(d.city)}). La duración es una estimación para un vuelo directo; los precios y horarios reales los verás en el buscador.</p>`;
    } else if (!d.iata) {
      html += `<p class="muted">No tenemos un aeropuerto de referencia para ${esc(name)}.</p>`;
    }

    if (sameCountry || sameAirport || groundDist < 1300) {
      const lk = links || flightLinks(o, { iata: o.iata, city: d.city }, state.depart, state.ret);
      html += `
        <div class="ground">
          ${sameCountry ? `🏠 Estás viajando dentro de ${esc(name)}.` : sameAirport ? `🚗 ${esc(name)} no tiene aeropuerto propio cercano: se llega por carretera desde ${esc(o.label)}.` : `🚆 ${esc(name)} está a ${nf.format(Math.round(groundDist))} km: también puedes ir en tren, autobús o coche.`}
          <div class="extra-links">
            <a class="btn" href="${lk.drive}" target="_blank" rel="noopener">🚗 Ruta en coche (Google Maps)</a>
            <a class="btn" href="${lk.rome2rio}" target="_blank" rel="noopener">🚆 Tren y bus (Rome2rio)</a>
            <a class="btn" href="${lk.train}" target="_blank" rel="noopener">Trainline</a>
          </div>
        </div>`;
    }
    el.innerHTML = html;

    $$("[data-dep-ap]", el).forEach((b) => b.addEventListener("click", () => setDepartureAirport(b.dataset.depAp)));
    const dep = $("#date-dep"), ret = $("#date-ret");
    if (dep) {
      dep.addEventListener("change", () => {
        state.depart = dep.value;
        if (state.ret <= state.depart) state.ret = isoDate(addDays(new Date(state.depart), 7));
        renderRoute();
      });
      ret.addEventListener("change", () => { state.ret = ret.value; renderRoute(); });
    }
    if (state.countryFacts) renderTzDiff(state.countryFacts);
  }

  // Desde qué aeropuerto se sale y alternativas cercanas (p. ej. Girona o Reus si estás cerca de Barcelona)
  function departureNote(o) {
    const fromYou = o.source === "gps" || o.source === "ip";
    const alts = (o.nearby || []).filter((a) => a.iata !== o.iata).slice(0, 3);
    if (!fromYou && !alts.length) return "";
    const where = fromYou ? `Estás en <b>${esc(o.name)}</b>${o.source === "ip" ? " (ubicación aproximada)" : ""}. ` : "";
    const ap = o.apName ? `Sales desde <b>${esc(o.apName)}</b> (${esc(o.iata)})${o.apDist > 3 ? `, a ${nf.format(Math.round(o.apDist))} km` : ""}.` : "";
    const chips = alts.length
      ? `<div class="alt-aps">Otros aeropuertos cerca: ${alts.map((a) => `<button type="button" class="alt-ap" data-dep-ap="${a.iata}" title="${esc(a.name)}">${esc(a.iata)} · ${esc(a.city || a.name)} <small>${nf.format(Math.round(a.dist))} km</small></button>`).join("")}</div>`
      : "";
    return `<div class="dep-note">📍 ${where}${ap}${chips}</div>`;
  }

  function originOffset() {
    const o = state.origin;
    const off = o.tz ? tzOffsetMinutes(o.tz) : null;
    return off !== null ? off : Math.round((o.lng || 0) / 15) * 60; // aproximación por longitud
  }

  function renderTzDiff(facts) {
    const el = $("#tz-diff");
    if (!el || !facts || !facts.timezones || !state.origin) return;
    const oOff = originOffset();
    const offs = facts.timezones.map(parseUtc).filter((x) => x !== null);
    if (oOff === null || !offs.length) return;
    const min = Math.min(...offs), max = Math.max(...offs);
    const txt = min === max ? fmtDiff(min - oOff) : `${fmtDiff(min - oOff)} a ${fmtDiff(max - oOff)}`;
    el.innerHTML = `<b>${txt}</b><small>diferencia horaria (aprox.)</small>`;
  }

  // ---------------------------------------------------------------- recomendaciones
  function renderTips(iso, facts) {
    const t = TOURISM[iso];
    const name = state.byIso.get(iso)?.properties.label || esName(iso);
    const tips = [];
    if (t) {
      tips.push(`<b>Mejor época:</b> ${esc(t.epoca)}`);
      t.tips.forEach((x) => tips.push(esc(x)));
    } else {
      tips.push("Consulta los requisitos de entrada (pasaporte, visado) y la situación de seguridad antes de reservar.");
      if (facts && facts.car === "left") tips.push("Se conduce por la <b>izquierda</b>.");
      if (facts && facts.currencies) tips.push(`Moneda local: <b>${esc(facts.currencies)}</b>. Lleva algo de efectivo y una tarjeta sin comisiones.`);
      tips.push("Contrata un seguro de viaje con cobertura médica.");
    }
    const fromSpain = state.origin && state.origin.iso === "ES";
    const wv = `https://es.wikivoyage.org/wiki/${encodeURIComponent(name.replace(/ /g, "_"))}`;
    const ge = countryEarthUrl(iso, name);
    $("#tips").innerHTML = `
      <ul class="tips">${tips.map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="extra-links">
        ${fromSpain ? `<a class="btn" href="https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Recomendaciones-de-viaje.aspx" target="_blank" rel="noopener">🇪🇸 Recomendaciones de viaje (Exteriores)</a>` : ""}
        ${ge ? `<a class="btn" href="${ge}" target="_blank" rel="noopener" data-earth-country>🌍 Explorar en Google Earth</a>` : ""}
        <a class="btn" href="${wv}" target="_blank" rel="noopener">🧳 Guía en Wikivoyage</a>
        <a class="btn" href="https://www.google.com/maps/search/${encodeURIComponent("atracciones turísticas en " + name)}" target="_blank" rel="noopener">📍 Qué ver (Google Maps)</a>
      </div>`;
  }

  // ---------------------------------------------------------------- datos en directo
  async function loadDynamic(iso, name) {
    const id = ++state.reqId;
    if (state.abort) state.abort.abort();
    const ac = new AbortController();
    state.abort = ac;
    state.countryFacts = null;
    const alive = () => id === state.reqId;
    const real = /^[A-Z]{2}$/.test(iso);

    // 1) Datos del país (REST Countries)
    const factsP = real
      ? fetchJSON(`https://restcountries.com/v3.1/alpha/${iso}?fields=name,capital,population,currencies,languages,timezones,car,region,subregion,area,flags,translations`, ac.signal)
          .then((r) => (Array.isArray(r) ? r[0] : r))
          .catch(() => null)
      : Promise.resolve(null);

    // 2) Resumen de Wikipedia en español
    const wikiP = fetchWikiSummary(name, iso, ac.signal).catch(() => null);

    // 3) Lugares famosos desde Wikidata
    const placesP = real ? fetchWikidataPlaces(iso, ac.signal).catch(() => null) : Promise.resolve(null);

    factsP.then((r) => {
      if (!alive()) return;
      const facts = r ? {
        capital: (r.capital || []).join(", "),
        population: r.population,
        area: r.area,
        languages: r.languages ? Object.values(r.languages).map(langEs).join(", ") : "",
        currencies: r.currencies ? Object.entries(r.currencies).map(([k, v]) => `${v.name}${v.symbol ? " (" + v.symbol + ")" : ""} · ${k}`).join(", ") : "",
        timezones: r.timezones || [],
        car: r.car && r.car.side,
        subregion: r.subregion
      } : null;
      state.countryFacts = facts;
      renderFacts(iso, facts);
      renderTzDiff(facts);
      if (!TOURISM[iso]) renderTips(iso, facts);
      if (facts && facts.capital) $("#hero-sub").textContent = `Capital: ${facts.capital}${facts.subregion ? " · " + subregionEs(facts.subregion) : ""}`;
    });

    wikiP.then((w) => {
      if (!alive()) return;
      const box = $("#wiki-summary");
      if (!w) {
        box.innerHTML = TOURISM[iso] ? "" : `<p class="muted">No se pudo cargar el resumen en este momento.</p>`;
        return;
      }
      const extract = TOURISM[iso] ? truncate(w.extract, 420) : w.extract;
      box.innerHTML = `<p>${esc(extract)}</p><p class="source">Fuente: <a href="${esc(w.url)}" target="_blank" rel="noopener">Wikipedia</a></p>`;
    });

    placesP.then((list) => {
      if (!alive()) return;
      const curated = TOURISM[iso];
      if (list && list.length) {
        const hero = list.find((p) => p.img);
        if (hero) setHero(hero.img);
      }
      if (curated) {
        // Lista curada ya mostrada; añadimos lugares extra de Wikidata
        const known = new Set(curated.top.map((x) => norm(x[0])));
        const extra = (list || []).filter((p) => ![...known].some((k) => k.includes(norm(p.name)) || norm(p.name).includes(k.split(" (")[0]))).slice(0, 5);
        if (extra.length) {
          const start = curated.top.length;
          extra.forEach((p, i) => (p.n = start + i + 1));
          $("#more-places").innerHTML = `<h3 style="margin:16px 0 10px">🏛️ Más lugares destacados</h3><ul class="places" id="places-extra"></ul><p class="source">Patrimonio y lugares de interés según Wikidata.</p>`;
          renderPlaces(extra, state.byIso.get(iso)?.properties.label, "#places-extra");
          setPlaces([...state.places.map(({ el, ...p }) => p), ...extra]);
        }
      } else {
        if (list && list.length) {
          const top = list.slice(0, 10);
          top.forEach((p, i) => (p.n = i + 1));
          renderPlaces(top, name);
          setPlaces(top);
          $("#more-places").innerHTML = `<p class="source">Selección automática de Patrimonio de la Humanidad y lugares de interés más conocidos (Wikidata).</p>`;
        } else {
          $("#places").innerHTML = `<p class="muted">No hemos encontrado una lista de lugares para este destino. Prueba con <a href="https://www.google.com/maps/search/${encodeURIComponent("atracciones turísticas en " + name)}" target="_blank" rel="noopener">Google Maps</a> o <a href="https://es.wikivoyage.org/wiki/${encodeURIComponent(name)}" target="_blank" rel="noopener">Wikivoyage</a>.</p>`;
        }
      }
    });
  }

  function truncate(s, n) {
    if (!s || s.length <= n) return s;
    const cut = s.slice(0, n);
    return cut.slice(0, cut.lastIndexOf(". ") + 1 || cut.lastIndexOf(" ")) + (cut.lastIndexOf(". ") > 0 ? "" : "…");
  }

  function setHero(img) {
    const hero = $("#hero");
    if (!hero || $("img", hero)) return;
    const el = new Image();
    el.alt = "";
    el.onload = () => hero.prepend(el);
    el.src = img;
  }

  function renderFacts(iso, f) {
    const box = $("#facts");
    if (!box) return;
    const t = TOURISM[iso];
    if (!f) {
      box.innerHTML = `${t ? `<div class="fact wide"><div class="k">Mejor época</div><div class="v">${esc(t.epoca)}</div></div>` : ""}<p class="muted small">No se pudieron cargar los datos del país.</p>`;
      return;
    }
    const facts = [
      ["Capital", f.capital || "—"],
      ["Población", f.population ? nf.format(f.population) : "—"],
      ["Idioma(s)", f.languages || "—"],
      ["Superficie", f.area ? nf.format(Math.round(f.area)) + " km²" : "—"],
      ["Moneda", f.currencies || "—", true],
      ["Conducción", f.car === "left" ? "Por la izquierda" : f.car === "right" ? "Por la derecha" : "—"],
      ["Zona horaria", f.timezones.length > 3 ? `${f.timezones[0]} … ${f.timezones[f.timezones.length - 1]}` : f.timezones.join(", ")]
    ];
    if (t) facts.push(["Mejor época", t.epoca, true]);
    box.innerHTML = facts.map(([k, v, wide]) => `<div class="fact${wide ? " wide" : ""}"><div class="k">${k}</div><div class="v">${esc(v)}</div></div>`).join("");
  }

  const LANGS = { English: "Inglés", Spanish: "Español", French: "Francés", German: "Alemán", Italian: "Italiano", Portuguese: "Portugués", Arabic: "Árabe", Chinese: "Chino", Japanese: "Japonés", Russian: "Ruso", Dutch: "Neerlandés", Greek: "Griego", Turkish: "Turco", Hindi: "Hindi", Korean: "Coreano", Swedish: "Sueco", Norwegian: "Noruego", Danish: "Danés", Finnish: "Finés", Polish: "Polaco", Czech: "Checo", Hungarian: "Húngaro", Romanian: "Rumano", Croatian: "Croata", Serbian: "Serbio", Bulgarian: "Búlgaro", Ukrainian: "Ucraniano", Hebrew: "Hebreo", Persian: "Persa", Thai: "Tailandés", Vietnamese: "Vietnamita", Indonesian: "Indonesio", Malay: "Malayo", Swahili: "Suajili", Catalan: "Catalán", Irish: "Irlandés", Icelandic: "Islandés", Quechua: "Quechua", Aymara: "Aimara", Guaraní: "Guaraní", Tamil: "Tamil", Bengali: "Bengalí", Urdu: "Urdu", Filipino: "Filipino", Afrikaans: "Afrikáans", Zulu: "Zulú", Amharic: "Amárico", Nepali: "Nepalí", Mongolian: "Mongol", Albanian: "Albanés", Slovak: "Eslovaco", Slovene: "Esloveno", Estonian: "Estonio", Latvian: "Letón", Lithuanian: "Lituano", Maltese: "Maltés", Luxembourgish: "Luxemburgués", Georgian: "Georgiano", Armenian: "Armenio", Kazakh: "Kazajo", Uzbek: "Uzbeko", Khmer: "Jemer", Lao: "Lao", Burmese: "Birmano", Sinhala: "Cingalés", Dhivehi: "Dhivehi", Maori: "Maorí", Samoan: "Samoano", Fijian: "Fiyiano", Tongan: "Tongano", Belarusian: "Bielorruso", Macedonian: "Macedonio", Bosnian: "Bosnio", Montenegrin: "Montenegrino", Faroese: "Feroés", Greenlandic: "Groenlandés", Kyrgyz: "Kirguís", Tajik: "Tayiko", Turkmen: "Turcomano", Azerbaijani: "Azerí", Pashto: "Pastún", Dari: "Darí", Somali: "Somalí", Kinyarwanda: "Kinyarwanda", Malagasy: "Malgache" };
  const langEs = (l) => LANGS[l] || l;
  const SUBREG = { "Southern Europe": "Europa del Sur", "Western Europe": "Europa Occidental", "Northern Europe": "Europa del Norte", "Eastern Europe": "Europa del Este", "Central Europe": "Europa Central", "Southeast Europe": "Sudeste de Europa", "Eastern Asia": "Asia Oriental", "South-Eastern Asia": "Sudeste Asiático", "Southern Asia": "Asia del Sur", "Western Asia": "Asia Occidental", "Central Asia": "Asia Central", "Northern Africa": "Norte de África", "Western Africa": "África Occidental", "Eastern Africa": "África Oriental", "Middle Africa": "África Central", "Southern Africa": "África Austral", "North America": "América del Norte", "Central America": "Centroamérica", Caribbean: "Caribe", "South America": "Sudamérica", "Australia and New Zealand": "Australia y Nueva Zelanda", Melanesia: "Melanesia", Micronesia: "Micronesia", Polynesia: "Polinesia" };
  const subregionEs = (s) => SUBREG[s] || s;

  async function fetchWikiSummary(name, iso, signal) {
    const tryTitle = async (title) => {
      const r = await fetchJSON(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}?redirect=true`, signal);
      if (!r || r.type === "disambiguation" || !r.extract) throw new Error("no válido");
      return { extract: r.extract, url: r.content_urls?.desktop?.page || `https://es.wikipedia.org/wiki/${encodeURIComponent(title)}` };
    };
    try {
      return await tryTitle(name);
    } catch (_) {
      if (!/^[A-Z]{2}$/.test(iso)) throw _;
      // Buscamos el artículo correcto a través de Wikidata (código ISO → artículo en es.wikipedia)
      const q = `SELECT ?article ?sl WHERE { ?c wdt:P297 "${iso}"; wikibase:sitelinks ?sl. ?article schema:about ?c; schema:isPartOf <https://es.wikipedia.org/>. } ORDER BY DESC(?sl) LIMIT 1`;
      const r = await fetchJSON(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(q)}`, signal, 12000);
      const url = r.results.bindings[0]?.article?.value;
      if (!url) throw new Error("sin artículo");
      return tryTitle(decodeURIComponent(url.split("/wiki/")[1]));
    }
  }

  async function fetchWikidataPlaces(iso, signal) {
    const q = `
      SELECT ?item ?itemLabel ?itemDescription ?coord ?image ?sl ?article WHERE {
        ?country wdt:P297 "${iso}" .
        { ?item wdt:P1435 wd:Q9259 . } UNION { ?item wdt:P31 wd:Q570116 . } UNION { ?item wdt:P31 wd:Q46169 . }
        ?item wdt:P17 ?country ; wikibase:sitelinks ?sl .
        OPTIONAL { ?item wdt:P625 ?coord . }
        OPTIONAL { ?item wdt:P18 ?image . }
        OPTIONAL { ?article schema:about ?item ; schema:isPartOf <https://es.wikipedia.org/> . }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "es,en". }
      } ORDER BY DESC(?sl) LIMIT 40`;
    const r = await fetchJSON(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(q)}`, signal, 15000);
    const seen = new Set();
    const out = [];
    for (const b of r.results.bindings) {
      const id = b.item.value;
      const label = b.itemLabel?.value;
      if (seen.has(id) || !label || /^Q\d+$/.test(label)) continue;
      seen.add(id);
      let lat, lng;
      const m = b.coord?.value.match(/Point\(([-\d.eE]+) ([-\d.eE]+)\)/);
      if (m) { lng = parseFloat(m[1]); lat = parseFloat(m[2]); }
      const desc = b.itemDescription?.value || "";
      out.push({
        name: label,
        desc: desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : "",
        lat, lng,
        img: b.image ? b.image.value.replace(/^http:/, "https:") + "?width=240" : null,
        wiki: b.article?.value || null
      });
    }
    return out;
  }

  // ---------------------------------------------------------------- buscador
  let searchIdx = -1;
  function renderSearch(q) {
    const ul = $("#search-results");
    const nq = norm(q);
    if (!nq) { ul.hidden = true; return; }
    const res = state.countries
      .filter((c) => norm(c.name).includes(nq) || norm(c.alt).includes(nq) || c.iso.toLowerCase() === nq)
      .sort((a, b) => (norm(a.name).startsWith(nq) ? 0 : 1) - (norm(b.name).startsWith(nq) ? 0 : 1))
      .slice(0, 8);
    searchIdx = res.length ? 0 : -1;
    ul.innerHTML = res.length
      ? res.map((c, i) => `<li role="option" data-iso="${c.iso}" class="${i === 0 ? "active" : ""}"><span class="flag">${flag(c.iso)}</span>${esc(c.name)}${TOURISM[c.iso] ? ' <span class="muted small">· guía completa</span>' : ""}</li>`).join("")
      : `<li class="muted">Sin resultados</li>`;
    ul.hidden = false;
  }
  function pickSearch(iso) {
    $("#search-results").hidden = true;
    $("#search").value = "";
    $("#search").blur();
    selectCountry(iso);
  }

  // ---------------------------------------------------------------- eventos
  function bindEvents() {
    $("#globe").addEventListener("pointermove", onPointerMove);
    $("#globe").addEventListener("pointerleave", () => { if (state.hover) { state.hover = null; refreshPolygons(); } });
    const s = $("#search");
    s.addEventListener("input", () => renderSearch(s.value));
    s.addEventListener("keydown", (e) => {
      const items = $$("#search-results li[data-iso]");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        searchIdx = (searchIdx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((li, i) => li.classList.toggle("active", i === searchIdx));
      } else if (e.key === "Enter" && items[searchIdx]) {
        pickSearch(items[searchIdx].dataset.iso);
      } else if (e.key === "Escape") {
        $("#search-results").hidden = true;
      }
    });
    $("#search-results").addEventListener("mousedown", (e) => {
      const li = e.target.closest("li[data-iso]");
      if (li) pickSearch(li.dataset.iso);
    });
    s.addEventListener("blur", () => setTimeout(() => ($("#search-results").hidden = true), 150));

    $("#origin-btn").addEventListener("click", openOriginModal);
    $("#origin-modal").addEventListener("click", (e) => {
      if (e.target.id === "origin-modal" || e.target.closest("[data-close]")) closeOriginModal();
      const li = e.target.closest("li[data-pop],li[data-ap],li[data-alt]");
      if (!li) return;
      if (li.dataset.pop) setOrigin(originFromCity(ORIGINS.find((o) => o.iata === li.dataset.pop)));
      else if (li.dataset.ap) setOrigin(originFromAirport(WORLD_AP.find((a) => a.iata === li.dataset.ap)));
      else setDepartureAirport(li.dataset.alt);
      closeOriginModal();
    });
    $("#origin-search").addEventListener("input", (e) => renderOriginList(e.target.value));
    $("#geo-btn").addEventListener("click", () => detectLocation({ manual: true }));

    $("#panel-close").addEventListener("click", deselect);
    $("#panel").addEventListener("click", (e) => {
      const a = e.target.closest("[data-fly]");
      if (a) { e.preventDefault(); focusPlace(Number(a.dataset.fly)); return; }
      const li = e.target.closest(".place");
      if (li && !e.target.closest("a")) focusPlace(Number(li.dataset.n));
    });

    $$(".segmented button").forEach((b) => b.addEventListener("click", () => setStyle(b.dataset.style)));
    const zoomBy = (k) => {
      const p = globe.pointOfView();
      globe.pointOfView({ ...p, altitude: clamp(p.altitude * k, 0.004, 6) }, 500);
    };
    $("#zoom-in").addEventListener("click", () => zoomBy(0.55));
    $("#zoom-out").addEventListener("click", () => zoomBy(1.8));
    $("#zoom-home").addEventListener("click", () => {
      const v = state.selected ? countryView(state.selected) : { lat: state.origin?.lat || 30, lng: state.origin?.lng || 0, altitude: 2.4 };
      globe.pointOfView(v, 1200);
    });
    $("#center-btn").addEventListener("click", () => state.centerIso && selectCountry(state.centerIso, { fly: false }));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!$("#origin-modal").hidden) closeOriginModal();
        else if (state.selected) deselect();
      }
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); s.focus(); }
    });
    window.addEventListener("hashchange", () => {
      const iso = location.hash.slice(1).toUpperCase();
      if (iso && iso !== state.selected && (state.byIso.has(iso) || AIRPORTS[iso])) selectCountry(iso);
    });
  }

  // ---------------------------------------------------------------- inicio
  async function init() {
    injectPinStyles();
    const btn = document.createElement("button");
    btn.id = "center-btn";
    btn.className = "chip center-btn";
    btn.hidden = true;
    btn.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:6;margin:0";
    document.body.appendChild(btn);

    let style = "sat";
    try { style = localStorage.getItem("mv-style") || "sat"; } catch (_) { /* ignorar */ }
    setStyle(STYLES[style] ? style : "sat");
    resize();

    // Origen: el último usado (o Barcelona) mientras detectamos dónde está la persona
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem("mv-origin2") || "null"); } catch (_) { /* ignorar */ }
    const savedOk = saved && saved.iata && Number.isFinite(saved.lat);
    setOrigin(savedOk ? saved : originFromCity(ORIGINS[0]), { silent: true });
    globe.pointOfView({ lat: state.origin.lat - 5, lng: state.origin.lng, altitude: 2.4 }, 0);

    bindEvents();
    await loadCountries();
    loadCities().then(() => afterZoom(globe.pointOfView())).catch(() => {});

    // Si la persona no ha elegido su ciudad a mano, detectamos su ubicación en cada visita
    if (!savedOk || saved.source !== "manual") {
      detectLocation().catch(() => {
        if (!savedOk) toast("📍 Calculamos las rutas desde <b>Barcelona</b>. Pulsa «Desde…» para cambiarlo.", 6500);
      });
    }

    const iso = location.hash.slice(1).toUpperCase();
    if (iso && (state.byIso.has(iso) || AIRPORTS[iso])) selectCountry(iso);
    setTimeout(() => $("#hint").classList.add("hide"), 9000);
  }

  init().catch((err) => {
    console.error(err);
    toast("No se pudo cargar el mapa. Abre la página desde un servidor web (ver README).", 10000);
  });
})();
