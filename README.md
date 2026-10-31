# 🌍 Mundo Viajero

Mapa del mundo interactivo en 3D, al estilo Google Earth, pensado para **planificar viajes**.
Gira el globo, haz zoom y selecciona un país: verás un resumen, la información turística,
sus imprescindibles y **cómo llegar desde tu ciudad**, con enlaces directos a buscadores de vuelos
(Google Flights, Skyscanner, Kayak, Rome2rio…).

## Funcionalidades

- **Globo 3D con imágenes de satélite** que ganan detalle al hacer zoom (teselas de Esri World Imagery),
  además de un modo *Mapa* (CARTO Voyager sobre OpenStreetMap, nítido en pantallas Retina) y un modo *Clásico* que funciona sin conexión.
- **Selección de países** con clic, buscador (atajo `/`) o enlace directo (`index.html#JP`).
  Al acercarte aparecen los nombres de los países y un botón para abrir la guía del país que tienes en el centro.
- **Ficha del país**:
  - 🧭 Resumen (texto propio + Wikipedia en español).
  - 📊 Datos rápidos: capital, población, idiomas, moneda, conducción, zonas horarias, mejor época.
  - ✈️ **Cómo llegar desde tu origen**: distancia, duración estimada del vuelo, escalas probables,
    diferencia horaria, selector de fechas y enlaces a Google Flights, Skyscanner, Kayak, Google Travel Explore,
    Rome2rio y hoteles (Google Hotels / Booking). Si el destino está cerca, también opciones en tren/coche.
    La ruta se dibuja en el globo como un arco animado.
  - ⭐ **Imprescindibles**: 5–10 lugares famosos con marcadores numerados en el globo; pulsa uno para volar hasta él.
  - 💡 Recomendaciones: mejor época, consejos prácticos y enlaces a Wikivoyage y a las recomendaciones de viaje del Ministerio de Exteriores (si viajas desde España).
- **Detecta dónde estás**: en cada visita usa la ubicación del navegador (con tu permiso) o, si no la das,
  una ubicación aproximada por tu conexión. Busca el aeropuerto internacional más cercano entre ~1.150 de todo el mundo
  y te propone alternativas cercanas (p. ej. Girona, Barcelona o Reus). Si eliges una ciudad a mano con «📍 Desde…»,
  se respeta esa elección. Si no se puede detectar nada, usa **Barcelona**.
- Diseño adaptado a móvil (panel inferior deslizable).

## Fuentes de información

| Información | Fuente |
| --- | --- |
| Guías curadas (≈50 destinos populares) | `js/data/tourism.js` (escritas a mano, en español) |
| Resto de países: lugares famosos | Wikidata (Patrimonio de la Humanidad, atracciones turísticas y parques nacionales, ordenados por relevancia) |
| Resúmenes | Wikipedia en español |
| Datos del país | REST Countries |
| Aeropuertos de llegada y ciudades de origen | `js/data/airports.js` |
| Aeropuertos de salida de todo el mundo | `data/airports-world.json` (OurAirports, dominio público) |
| Tu ubicación | Geolocalización del navegador · BigDataCloud (nombre de la ciudad) · GeoJS / ipapi (ubicación aproximada por IP) |
| Fronteras | Natural Earth 1:50m |

> Las duraciones de vuelo son estimaciones para un vuelo directo. Los precios, horarios y requisitos de entrada
> reales deben consultarse siempre en los buscadores y fuentes oficiales enlazadas.

## Cómo usarlo

Es una web estática sin dependencias de compilación. Sólo hay que servir la carpeta con cualquier servidor web
(abrir `index.html` directamente con `file://` no funciona porque el navegador bloquea la carga del GeoJSON):

```bash
python3 -m http.server 8000
# y abre http://localhost:8000
```

También se puede publicar tal cual en GitHub Pages, Netlify, Vercel, etc.

## Estructura

```
index.html            Página principal
css/style.css         Estilos
js/app.js             Lógica del globo, panel, rutas y llamadas a APIs
js/data/tourism.js    Guías turísticas curadas
js/data/airports.js   Aeropuerto principal por país y ciudades de origen
data/countries.geojson Fronteras de países (Natural Earth, simplificado)
vendor/globe.gl.min.js globe.gl 2.46.2 (Three.js)
assets/               Texturas de la Tierra y del cielo
```

## Ampliar la guía

Para añadir o mejorar un país, edita `js/data/tourism.js` usando su código ISO de dos letras:

```js
XX: {
  r: "Resumen corto…",
  epoca: "Mejor época para viajar…",
  tips: ["Consejo 1", "Consejo 2"],
  top: [["Nombre del lugar", "Descripción corta", lat, lng], …]
}
```

Para añadir ciudades de origen, amplía `window.ORIGINS` en `js/data/airports.js`.

## Créditos

Globo: [globe.gl](https://github.com/vasturiano/globe.gl) · Imágenes: NASA Blue Marble, Esri World Imagery,
OpenStreetMap · Fronteras: Natural Earth · Datos: Wikipedia, Wikidata, REST Countries.
