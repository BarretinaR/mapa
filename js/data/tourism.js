// Guía turística curada (en español) para los destinos más populares.
// r: resumen · epoca: mejor época para viajar · tips: recomendaciones · top: [nombre, descripción, lat, lng]
// Para los países que no aparecen aquí, la app completa la información en directo
// con Wikipedia y Wikidata.
window.TOURISM = {
  ES: {
    r: "Sol, historia y gastronomía: España combina ciudades monumentales, playas mediterráneas y atlánticas, islas y una vida en la calle única.",
    epoca: "Primavera (abril-junio) y otoño (septiembre-octubre). El verano es muy caluroso en el interior y el sur.",
    tips: ["Se come y se cena tarde: comida 14-16 h, cena a partir de las 21 h.", "El AVE conecta las grandes ciudades en pocas horas.", "Reserva con antelación la Alhambra y la Sagrada Família."],
    top: [
      ["Sagrada Família (Barcelona)", "La obra maestra inacabada de Gaudí.", 41.4036, 2.1744],
      ["Alhambra (Granada)", "Palacio y fortaleza nazarí con jardines del Generalife.", 37.1761, -3.5881],
      ["Museo del Prado (Madrid)", "Velázquez, Goya y El Greco en una de las pinacotecas más importantes del mundo.", 40.4138, -3.6921],
      ["Mezquita-Catedral de Córdoba", "Bosque de arcos califales del siglo VIII.", 37.8789, -4.7794],
      ["Real Alcázar de Sevilla", "Palacio mudéjar todavía en uso por la Casa Real.", 37.3831, -5.9902],
      ["Santiago de Compostela", "Meta del Camino de Santiago y su catedral románica.", 42.8806, -8.5446],
      ["Guggenheim Bilbao", "Icono de la arquitectura contemporánea de Frank Gehry.", 43.2687, -2.934],
      ["Parque Nacional del Teide (Tenerife)", "El pico más alto de España sobre un paisaje volcánico.", 28.2724, -16.6425]
    ]
  },
  FR: {
    r: "El país más visitado del mundo: París, castillos del Loira, la Costa Azul, viñedos y los Alpes.",
    epoca: "Abril-junio y septiembre-octubre. Julio-agosto para playas; diciembre-marzo para esquiar.",
    tips: ["El TGV conecta Barcelona con París en unas 6,5 h.", "Muchos museos nacionales son gratis el primer domingo de mes.", "Saluda siempre con un «Bonjour» al entrar en una tienda."],
    top: [
      ["Torre Eiffel (París)", "El símbolo de Francia, con vistas a toda la ciudad.", 48.8584, 2.2945],
      ["Museo del Louvre (París)", "La Gioconda y miles de obras maestras.", 48.8606, 2.3376],
      ["Monte Saint-Michel", "Abadía medieval sobre un islote rodeado por las mareas.", 48.6361, -1.5115],
      ["Palacio de Versalles", "La residencia de Luis XIV y su Galería de los Espejos.", 48.8049, 2.1204],
      ["Castillos del Loira", "Chambord, Chenonceau y decenas de castillos renacentistas.", 47.6162, 1.517],
      ["Costa Azul (Niza)", "Playas, Promenade des Anglais y pueblos como Èze.", 43.6959, 7.2716],
      ["Chamonix y el Mont Blanc", "La cumbre más alta de Europa occidental.", 45.9237, 6.8694],
      ["Carcasona", "Ciudad medieval amurallada a dos horas de Barcelona.", 43.2061, 2.3636]
    ]
  },
  IT: {
    r: "Arte, historia y la mejor cocina: Roma, Florencia, Venecia, la costa Amalfitana y la Toscana.",
    epoca: "Abril-junio y septiembre-octubre. Evita agosto en las ciudades por calor y multitudes.",
    tips: ["Reserva Vaticano, Coliseo y Uffizi con antelación.", "Los trenes Frecciarossa e Italo unen las grandes ciudades.", "En las ciudades se cobra una pequeña tasa turística por noche."],
    top: [
      ["Coliseo (Roma)", "El anfiteatro más grande del Imperio romano.", 41.8902, 12.4922],
      ["Museos Vaticanos y Capilla Sixtina", "Miguel Ángel y Rafael en el corazón de la Santa Sede.", 41.9065, 12.4536],
      ["Venecia", "Gran Canal, plaza de San Marcos y góndolas.", 45.4343, 12.3388],
      ["Florencia y la Galería Uffizi", "Cuna del Renacimiento: Duomo, David y Uffizi.", 43.7687, 11.2556],
      ["Costa Amalfitana", "Positano, Amalfi y Ravello colgados sobre el mar.", 40.6333, 14.6029],
      ["Pompeya", "Ciudad romana sepultada por el Vesubio en el 79 d. C.", 40.7489, 14.4848],
      ["Cinque Terre", "Cinco pueblos de colores en la costa de Liguria.", 44.1349, 9.6849],
      ["Torre de Pisa", "El campanario inclinado más famoso del mundo.", 43.723, 10.3966]
    ]
  },
  PT: {
    r: "Cercano, asequible y con mucho encanto: Lisboa, Oporto, el Algarve y las islas de Madeira y Azores.",
    epoca: "Marzo-junio y septiembre-octubre. Algarve, de mayo a octubre.",
    tips: ["Prueba los pastéis de nata y el bacalao en todas sus versiones.", "En Lisboa usa el tranvía 28 y prepárate para las cuestas.", "Portugal tiene una hora menos que España."],
    top: [
      ["Torre de Belém y Monasterio de los Jerónimos (Lisboa)", "Joyas manuelinas de la era de los descubrimientos.", 38.6916, -9.2159],
      ["Barrio de Alfama (Lisboa)", "Callejuelas, miradores y fado.", 38.7115, -9.1305],
      ["Sintra", "Palacio da Pena y bosques encantados.", 38.7876, -9.3906],
      ["Ribeira de Oporto", "Casas de colores junto al Duero y bodegas de oporto.", 41.1405, -8.6131],
      ["Valle del Duero", "Viñedos en terrazas, Patrimonio de la Humanidad.", 41.1622, -7.7888],
      ["Algarve", "Acantilados dorados, Benagil y playas como Marinha.", 37.0897, -8.4547],
      ["Madeira", "Isla volcánica de senderos (levadas) y naturaleza.", 32.65, -16.91]
    ]
  },
  GB: {
    r: "Londres, castillos escoceses, campiña inglesa y una enorme oferta cultural, gran parte gratuita.",
    epoca: "Mayo-septiembre. Lleva siempre algo para la lluvia.",
    tips: ["Se necesita pasaporte y, desde 2025, autorización electrónica ETA para ciudadanos de la UE.", "Los grandes museos de Londres son gratuitos.", "Se conduce por la izquierda."],
    top: [
      ["Big Ben y Parlamento (Londres)", "El icono de Londres a orillas del Támesis.", 51.5007, -0.1246],
      ["Museo Británico (Londres)", "La piedra de Rosetta y tesoros de todo el mundo, gratis.", 51.5194, -0.127],
      ["Torre de Londres", "Fortaleza milenaria con las Joyas de la Corona.", 51.5081, -0.0759],
      ["Edimburgo", "Castillo, Royal Mile y el festival de agosto.", 55.9486, -3.1999],
      ["Stonehenge", "Círculo de piedras prehistórico de hace 5.000 años.", 51.1789, -1.8262],
      ["Tierras Altas de Escocia", "Lagos, el Loch Ness y paisajes salvajes.", 57.3229, -4.4244],
      ["Bath", "Termas romanas y arquitectura georgiana.", 51.3811, -2.359],
      ["Oxford", "Ciudad universitaria de colegios medievales.", 51.752, -1.2577]
    ]
  },
  IE: {
    r: "Paisajes verdes, acantilados, pubs con música en directo y gente acogedora.",
    epoca: "Mayo-septiembre, con días largos y templados.",
    tips: ["Alquila coche para recorrer la costa oeste.", "Se conduce por la izquierda.", "Prueba un pub con sesión de música tradicional."],
    top: [
      ["Acantilados de Moher", "Paredes de 200 metros sobre el Atlántico.", 52.9715, -9.4309],
      ["Dublín y Trinity College", "El Libro de Kells y la vida en Temple Bar.", 53.3438, -6.2546],
      ["Calzada del Gigante", "Columnas de basalto en Irlanda del Norte (Reino Unido).", 55.2408, -6.5116],
      ["Anillo de Kerry", "Ruta escénica por la península de Iveragh.", 51.9984, -9.7432],
      ["Connemara", "Montañas, lagos y turberas salvajes.", 53.5459, -9.8898],
      ["Galway", "Ciudad bohemia y puerta a las islas Aran.", 53.2707, -9.0568]
    ]
  },
  DE: {
    r: "Ciudades vibrantes, castillos de cuento, mercados navideños y una red de trenes excelente.",
    epoca: "Mayo-septiembre; diciembre para los mercados de Navidad.",
    tips: ["El Deutschlandticket permite usar transporte regional por un precio mensual fijo.", "Mucho comercio cierra los domingos.", "Lleva efectivo: aún hay sitios que no aceptan tarjeta."],
    top: [
      ["Puerta de Brandeburgo (Berlín)", "Símbolo de la reunificación alemana.", 52.5163, 13.3777],
      ["Castillo de Neuschwanstein", "El castillo que inspiró a Disney.", 47.5576, 10.7498],
      ["Catedral de Colonia", "Obra maestra gótica junto al Rin.", 50.9413, 6.9583],
      ["Múnich y la Oktoberfest", "Cervecerías, Marienplatz y la gran fiesta de septiembre.", 48.1374, 11.5755],
      ["Valle del Rin", "Castillos y viñedos a orillas del río.", 50.1337, 7.7317],
      ["Selva Negra", "Bosques, pueblos y relojes de cuco.", 48.0, 8.2],
      ["Hamburgo", "Puerto, Speicherstadt y la Elbphilharmonie.", 53.5413, 9.9841]
    ]
  },
  NL: {
    r: "Canales, bicicletas, tulipanes y museos de primer nivel en un país pequeño y fácil de recorrer.",
    epoca: "Abril-mayo para los tulipanes; junio-septiembre para buen tiempo.",
    tips: ["Reserva el Museo Van Gogh y la Casa de Ana Frank con semanas de antelación.", "Cuidado con los carriles bici: tienen prioridad.", "Los trenes conectan todo el país en menos de 3 horas."],
    top: [
      ["Canales de Ámsterdam", "Cinturón de canales del siglo XVII.", 52.3667, 4.8833],
      ["Rijksmuseum (Ámsterdam)", "La ronda de noche de Rembrandt y Vermeer.", 52.36, 4.8852],
      ["Museo Van Gogh", "La mayor colección del pintor.", 52.3584, 4.8811],
      ["Casa de Ana Frank", "El escondite donde escribió su diario.", 52.3752, 4.884],
      ["Keukenhof", "Millones de tulipanes en primavera.", 52.2697, 4.5469],
      ["Molinos de Kinderdijk", "19 molinos históricos Patrimonio de la Humanidad.", 51.8833, 4.6406],
      ["Róterdam", "Arquitectura moderna y el puerto más grande de Europa.", 51.9244, 4.4777]
    ]
  },
  BE: {
    r: "Ciudades medievales, cómic, chocolate, gofres y cervezas trapenses.",
    epoca: "Abril-septiembre.",
    tips: ["Brujas y Gante están a menos de 1 h en tren de Bruselas.", "Prueba las patatas fritas con mayonesa y la cerveza local."],
    top: [
      ["Grand-Place (Bruselas)", "Una de las plazas más bellas del mundo.", 50.8467, 4.3525],
      ["Brujas", "Canales y casas medievales.", 51.2093, 3.2247],
      ["Gante", "Castillo de los Condes y el Políptico del Cordero Místico.", 51.0543, 3.7174],
      ["Atomium (Bruselas)", "Estructura de la Expo de 1958.", 50.8949, 4.3415],
      ["Amberes", "Diamantes, Rubens y moda.", 51.2194, 4.4025],
      ["Manneken Pis", "La pequeña estatua más famosa de Bruselas.", 50.845, 4.35]
    ]
  },
  CH: {
    r: "Alpes, lagos cristalinos y trenes panorámicos en uno de los países más caros y bellos de Europa.",
    epoca: "Junio-septiembre para senderismo; diciembre-marzo para esquí.",
    tips: ["El Swiss Travel Pass cubre trenes, barcos y museos.", "La moneda es el franco suizo (CHF).", "Es caro: compra en supermercados para ahorrar."],
    top: [
      ["Matterhorn (Zermatt)", "La montaña piramidal más famosa de los Alpes.", 45.9763, 7.6586],
      ["Jungfraujoch", "La estación de tren más alta de Europa.", 46.5475, 7.9853],
      ["Lucerna", "Puente de la Capilla y lago de los Cuatro Cantones.", 47.0517, 8.3075],
      ["Interlaken", "Entre dos lagos, capital de la aventura.", 46.6863, 7.8632],
      ["Glacier Express", "El «tren más lento del mundo» entre Zermatt y St. Moritz.", 46.6, 8.6],
      ["Ginebra y su lago", "El Jet d'Eau y la sede de la ONU.", 46.2073, 6.1559]
    ]
  },
  AT: {
    r: "Música clásica, palacios imperiales, cafés históricos y pueblos alpinos.",
    epoca: "Mayo-septiembre; diciembre para mercados navideños y esquí.",
    tips: ["Para autopistas necesitas la viñeta (peaje).", "Prueba la tarta Sacher en un café vienés."],
    top: [
      ["Palacio de Schönbrunn (Viena)", "Residencia de verano de los Habsburgo.", 48.1845, 16.3122],
      ["Salzburgo", "Ciudad de Mozart y de «Sonrisas y lágrimas».", 47.8095, 13.055],
      ["Hallstatt", "El pueblo de postal junto al lago.", 47.5622, 13.6493],
      ["Catedral de San Esteban (Viena)", "El corazón gótico de Viena.", 48.2085, 16.3731],
      ["Innsbruck", "Capital del Tirol rodeada de montañas.", 47.2692, 11.4041],
      ["Valle del Wachau", "Viñedos y abadías junto al Danubio.", 48.38, 15.42]
    ]
  },
  CZ: {
    r: "Praga es una de las ciudades más bellas de Europa; además, castillos, balnearios y cerveza.",
    epoca: "Abril-junio y septiembre-octubre; diciembre para mercados.",
    tips: ["La moneda es la corona checa: evita las casas de cambio del centro.", "La cerveza suele ser más barata que el agua."],
    top: [
      ["Puente de Carlos (Praga)", "Puente gótico con 30 estatuas barrocas.", 50.0865, 14.4114],
      ["Castillo de Praga", "El mayor conjunto de castillo antiguo del mundo.", 50.0909, 14.4005],
      ["Reloj Astronómico", "Reloj medieval de la Plaza de la Ciudad Vieja.", 50.087, 14.4208],
      ["Český Krumlov", "Pueblo medieval en un meandro del Moldava.", 48.8127, 14.3175],
      ["Karlovy Vary", "Ciudad balneario de aguas termales.", 50.2319, 12.872],
      ["Kutná Hora", "Osario de Sedlec, decorado con huesos humanos.", 49.962, 15.2883]
    ]
  },
  HU: {
    r: "Budapest, con sus baños termales y el Danubio, es la estrella; también el lago Balatón.",
    epoca: "Abril-junio y septiembre-octubre.",
    tips: ["La moneda es el florín (HUF).", "No te pierdas un «ruin bar» en el barrio judío."],
    top: [
      ["Parlamento de Budapest", "Edificio neogótico junto al Danubio.", 47.5071, 19.0457],
      ["Baños Széchenyi", "Gran balneario termal al aire libre.", 47.5186, 19.0823],
      ["Bastión de los Pescadores", "Miradores sobre Pest.", 47.5022, 19.0348],
      ["Puente de las Cadenas", "El primer puente permanente sobre el Danubio en Budapest.", 47.4991, 19.0436],
      ["Lago Balatón", "El mayor lago de Europa central.", 46.83, 17.73],
      ["Eger", "Castillo y vino «Sangre de Toro».", 47.9025, 20.3772]
    ]
  },
  PL: {
    r: "Historia intensa, ciudades reconstruidas con mimo, precios moderados y gran gastronomía.",
    epoca: "Mayo-septiembre; diciembre para mercados navideños.",
    tips: ["La moneda es el esloti (PLN).", "Prueba los pierogi.", "Reserva con antelación la visita a Auschwitz."],
    top: [
      ["Cracovia", "Plaza del Mercado y castillo de Wawel.", 50.0617, 19.9373],
      ["Auschwitz-Birkenau", "Memorial y museo del Holocausto.", 50.0359, 19.1783],
      ["Minas de sal de Wieliczka", "Capillas talladas en sal a 100 m de profundidad.", 49.9832, 20.0559],
      ["Varsovia", "Casco antiguo reconstruido tras la guerra.", 52.2497, 21.0122],
      ["Gdansk", "Ciudad hanseática junto al Báltico.", 54.3483, 18.6538],
      ["Montes Tatra (Zakopane)", "Senderismo y esquí en los Cárpatos.", 49.2992, 19.9496]
    ]
  },
  GR: {
    r: "Cuna de la civilización occidental: ruinas clásicas, más de 200 islas habitadas y comida mediterránea.",
    epoca: "Mayo-junio y septiembre-octubre. Julio-agosto, calor y mucha gente.",
    tips: ["Planifica los ferris con antelación en temporada alta.", "Muchos yacimientos cierran pronto: madruga.", "Prueba la souvlaki, la moussaka y el yogur griego."],
    top: [
      ["Acrópolis de Atenas", "El Partenón domina la ciudad desde hace 2.500 años.", 37.9715, 23.7257],
      ["Santorini", "Casas blancas sobre una caldera volcánica.", 36.4618, 25.3753],
      ["Meteora", "Monasterios en lo alto de pilares de roca.", 39.7217, 21.6306],
      ["Mykonos", "Molinos, calas y vida nocturna.", 37.4467, 25.3289],
      ["Delfos", "El santuario del oráculo de Apolo.", 38.4824, 22.501],
      ["Creta y el Palacio de Cnosos", "La gran isla minoica.", 35.2981, 25.163],
      ["Playa de Navagio (Zante)", "La famosa cala del barco naufragado.", 37.8592, 20.6247]
    ]
  },
  HR: {
    r: "Costa adriática de aguas cristalinas, islas, ciudades amuralladas y parques nacionales.",
    epoca: "Mayo-junio y septiembre. Julio-agosto muy concurridos.",
    tips: ["Desde 2023 usa el euro y forma parte de Schengen.", "Los catamaranes conectan Split con las islas."],
    top: [
      ["Dubrovnik", "Murallas medievales sobre el Adriático.", 42.6407, 18.1077],
      ["Lagos de Plitvice", "16 lagos escalonados unidos por cascadas.", 44.8654, 15.582],
      ["Palacio de Diocleciano (Split)", "Ciudad viva dentro de un palacio romano.", 43.5081, 16.4402],
      ["Isla de Hvar", "Lavanda, calas y ambiente.", 43.1729, 16.4411],
      ["Parque Nacional Krka", "Cascadas donde se puede pasear.", 43.8, 15.97],
      ["Rovinj", "Pueblo veneciano de Istria.", 45.0812, 13.6387]
    ]
  },
  TR: {
    r: "Puente entre Europa y Asia: Estambul, paisajes de Capadocia, ruinas grecorromanas y la costa turquesa.",
    epoca: "Abril-junio y septiembre-noviembre.",
    tips: ["Los ciudadanos españoles no necesitan visado para estancias turísticas cortas (compruébalo antes de viajar).", "Regatea en los bazares.", "Cúbrete hombros y rodillas en las mezquitas."],
    top: [
      ["Santa Sofía (Estambul)", "Basílica, mezquita y símbolo de 1.500 años de historia.", 41.0086, 28.9802],
      ["Capadocia", "Chimeneas de hadas y vuelos en globo al amanecer.", 38.6431, 34.8289],
      ["Mezquita Azul (Estambul)", "Seis minaretes y azulejos de Iznik.", 41.0054, 28.9768],
      ["Gran Bazar (Estambul)", "Uno de los mercados cubiertos más antiguos del mundo.", 41.0107, 28.968],
      ["Pamukkale", "Terrazas de travertino blanco y ruinas de Hierápolis.", 37.9203, 29.1206],
      ["Éfeso", "La Biblioteca de Celso y la gran ciudad romana.", 37.9395, 27.3417],
      ["Costa Turquesa (Antalya)", "Playas, calas y el casco antiguo de Kaleiçi.", 36.8841, 30.7056]
    ]
  },
  NO: {
    r: "Fiordos espectaculares, auroras boreales, sol de medianoche y naturaleza salvaje.",
    epoca: "Junio-agosto para fiordos; noviembre-marzo para auroras.",
    tips: ["Es caro: el alcohol especialmente.", "La moneda es la corona noruega (NOK).", "El tren Oslo-Bergen es uno de los más bonitos del mundo."],
    top: [
      ["Geirangerfjord", "Fiordo Patrimonio de la Humanidad con cascadas.", 62.1049, 7.0941],
      ["Preikestolen", "El «Púlpito» a 604 m sobre el Lysefjord.", 58.9864, 6.1904],
      ["Islas Lofoten", "Montañas sobre el mar y casas rorbu rojas.", 68.2, 13.9],
      ["Tromsø", "La capital de la aurora boreal.", 69.6492, 18.9553],
      ["Bergen y el muelle Bryggen", "Casas hanseáticas de madera.", 60.3975, 5.3245],
      ["Trolltunga", "La lengua del troll, para senderistas.", 60.124, 6.74]
    ]
  },
  IS: {
    r: "Tierra de hielo y fuego: volcanes, glaciares, géiseres, cascadas y auroras boreales.",
    epoca: "Junio-agosto para recorrer la isla; septiembre-marzo para auroras.",
    tips: ["Lo ideal es alquilar coche y hacer la Ring Road.", "Consulta el estado de las carreteras y del clima (vedur.is).", "Es muy caro: lleva presupuesto holgado."],
    top: [
      ["Círculo Dorado", "Thingvellir, géiser Strokkur y cascada Gullfoss.", 64.3271, -20.1199],
      ["Laguna Azul", "Spa geotermal de aguas lechosas.", 63.8804, -22.4495],
      ["Laguna glaciar Jökulsárlón", "Icebergs flotando junto a la playa de diamantes.", 64.0485, -16.1794],
      ["Playa negra de Reynisfjara", "Arena volcánica y columnas de basalto.", 63.4044, -19.0447],
      ["Cascada Skógafoss", "Una de las cascadas más grandes del país.", 63.5321, -19.5114],
      ["Reikiavik", "La capital más septentrional del mundo.", 64.1466, -21.9426]
    ]
  },
  SE: {
    r: "Diseño, naturaleza y ciudades sobre el agua; Laponia en el norte para auroras.",
    epoca: "Junio-agosto; invierno para Laponia.",
    tips: ["Casi todo se paga con tarjeta.", "La moneda es la corona sueca (SEK)."],
    top: [
      ["Gamla Stan (Estocolmo)", "Casco antiguo sobre una isla.", 59.3251, 18.0711],
      ["Museo Vasa", "Galeón del siglo XVII casi intacto.", 59.328, 18.0914],
      ["Laponia sueca (Abisko)", "Auroras boreales y Icehotel.", 68.35, 18.83],
      ["Gotemburgo", "Canales y el parque Liseberg.", 57.7089, 11.9746],
      ["Archipiélago de Estocolmo", "Miles de islas para navegar.", 59.4, 18.8]
    ]
  },
  DK: {
    r: "Hygge, diseño, bicicletas y una de las capitales más agradables de Europa.",
    epoca: "Mayo-septiembre.",
    tips: ["La moneda es la corona danesa (DKK).", "Copenhague se recorre perfectamente en bicicleta."],
    top: [
      ["Nyhavn (Copenhague)", "Casas de colores junto al canal.", 55.6797, 12.5907],
      ["Jardines de Tivoli", "Uno de los parques de atracciones más antiguos.", 55.6737, 12.5681],
      ["La Sirenita", "Estatua inspirada en Andersen.", 55.6929, 12.5993],
      ["Castillo de Kronborg", "El castillo de Hamlet.", 56.0391, 12.6216],
      ["Legoland (Billund)", "La casa original de LEGO.", 55.7357, 9.1265]
    ]
  },
  MA: {
    r: "A solo 1-2 horas de vuelo: medinas, zocos, desierto del Sáhara y las montañas del Atlas.",
    epoca: "Marzo-mayo y septiembre-noviembre.",
    tips: ["Los españoles no necesitan visado para estancias turísticas de hasta 90 días.", "Regatea en los zocos con buen humor.", "Viste de forma respetuosa, sobre todo fuera de las ciudades."],
    top: [
      ["Plaza Jemaa el-Fna (Marrakech)", "Encantadores, músicos y puestos de comida.", 31.6258, -7.9891],
      ["Desierto de Merzouga", "Dunas de Erg Chebbi y noche en jaima.", 31.0994, -4.0134],
      ["Chefchaouen", "La ciudad azul del Rif.", 35.1688, -5.2636],
      ["Medina de Fez", "La medina medieval más grande del mundo.", 34.0648, -4.9734],
      ["Mezquita Hassan II (Casablanca)", "Minarete de 210 m sobre el Atlántico.", 33.6083, -7.6328],
      ["Aït Ben Haddou", "Ksar de adobe y plató de cine.", 31.047, -7.1319],
      ["Jardín Majorelle", "El jardín azul de Yves Saint Laurent.", 31.6416, -8.0035]
    ]
  },
  EG: {
    r: "Pirámides, templos faraónicos, cruceros por el Nilo y el mar Rojo para bucear.",
    epoca: "Octubre-abril. En verano el calor es extremo.",
    tips: ["Se necesita visado (se tramita online o a la llegada).", "Contrata guías oficiales en los yacimientos.", "Bebe solo agua embotellada."],
    top: [
      ["Pirámides de Guiza y la Esfinge", "La última maravilla del mundo antiguo en pie.", 29.9792, 31.1342],
      ["Gran Museo Egipcio", "El tesoro completo de Tutankamón.", 29.9946, 31.1196],
      ["Templos de Karnak y Luxor", "Columnas colosales en la antigua Tebas.", 25.7188, 32.6573],
      ["Valle de los Reyes", "Tumbas faraónicas excavadas en la roca.", 25.7402, 32.6014],
      ["Abu Simbel", "Templos de Ramsés II junto al lago Nasser.", 22.3372, 31.6258],
      ["Crucero por el Nilo", "De Luxor a Asuán entre templos.", 24.9, 32.9],
      ["Mar Rojo (Hurghada / Sharm el-Sheij)", "Arrecifes de coral de primer nivel.", 27.2579, 33.8116]
    ]
  },
  ZA: {
    r: "Safaris, viñedos, costas espectaculares y ciudades cosmopolitas.",
    epoca: "Mayo-septiembre para safari; noviembre-marzo para Ciudad del Cabo.",
    tips: ["Los españoles no necesitan visado para estancias turísticas cortas.", "Se conduce por la izquierda.", "Infórmate sobre zonas seguras en las ciudades."],
    top: [
      ["Parque Nacional Kruger", "Safari para ver a los «cinco grandes».", -23.9884, 31.5547],
      ["Montaña de la Mesa (Ciudad del Cabo)", "Vistas sobre la ciudad y el océano.", -33.9628, 18.4098],
      ["Cabo de Buena Esperanza", "El extremo sudoccidental de África.", -34.3568, 18.474],
      ["Ruta Jardín", "Carretera costera entre bosques y lagunas.", -34.0, 23.0],
      ["Viñedos de Stellenbosch", "Bodegas a 50 km de Ciudad del Cabo.", -33.9321, 18.8602],
      ["Boulders Beach", "Colonia de pingüinos africanos.", -34.1975, 18.4513]
    ]
  },
  KE: {
    r: "El safari clásico: la gran migración, el Kilimanjaro de fondo y playas en el Índico.",
    epoca: "Julio-octubre (gran migración) y enero-febrero.",
    tips: ["Se necesita autorización electrónica de viaje (eTA).", "Consulta las vacunas recomendadas (fiebre amarilla, malaria)."],
    top: [
      ["Reserva Nacional Masái Mara", "Escenario de la gran migración de ñus.", -1.4061, 35.0],
      ["Parque Nacional Amboseli", "Elefantes con el Kilimanjaro al fondo.", -2.6527, 37.2606],
      ["Lago Nakuru", "Flamencos y rinocerontes.", -0.3667, 36.0833],
      ["Diani Beach", "Arena blanca en la costa del Índico.", -4.2797, 39.5947],
      ["Nairobi y el Centro de Jirafas", "Parque nacional junto a la capital.", -1.3762, 36.7445]
    ]
  },
  TZ: {
    r: "Serengeti, cráter del Ngorongoro, Kilimanjaro y las playas de Zanzíbar.",
    epoca: "Junio-octubre (estación seca) y enero-febrero.",
    tips: ["Se necesita visado (e-visa).", "Consulta las vacunas recomendadas.", "Combina safari y playa en Zanzíbar."],
    top: [
      ["Parque Nacional del Serengeti", "Llanuras infinitas y la gran migración.", -2.3333, 34.8333],
      ["Cráter del Ngorongoro", "Una caldera llena de fauna.", -3.2, 35.5],
      ["Kilimanjaro", "El techo de África (5.895 m).", -3.0674, 37.3556],
      ["Zanzíbar y Stone Town", "Playas de ensueño y ciudad de las especias.", -6.1659, 39.2026],
      ["Parque Nacional Tarangire", "Baobabs y manadas de elefantes.", -3.8333, 36.0]
    ]
  },
  AE: {
    r: "Rascacielos récord, lujo, desierto y playas; además, un gran hub para vuelos a Asia.",
    epoca: "Noviembre-marzo. El verano supera los 40 °C.",
    tips: ["Los ciudadanos de la UE no necesitan visado para estancias cortas.", "Respeta las normas de vestimenta en lugares religiosos.", "Ideal como escala de varios días en ruta a Asia."],
    top: [
      ["Burj Khalifa (Dubái)", "El edificio más alto del mundo (828 m).", 25.1972, 55.2744],
      ["Gran Mezquita Sheikh Zayed (Abu Dabi)", "Mármol blanco y la alfombra más grande del mundo.", 24.4128, 54.4749],
      ["Safari por el desierto", "Dunas, 4x4 y cena beduina.", 24.9, 55.6],
      ["Dubai Mall y la fuente", "Centro comercial gigante y espectáculo de agua.", 25.1985, 55.2796],
      ["Louvre Abu Dabi", "Museo bajo una cúpula de luz.", 24.5338, 54.3982],
      ["Palm Jumeirah", "La isla artificial con forma de palmera.", 25.1124, 55.139]
    ]
  },
  JO: {
    r: "Petra, el desierto de Wadi Rum y el mar Muerto en un país pequeño y hospitalario.",
    epoca: "Marzo-mayo y septiembre-noviembre.",
    tips: ["El Jordan Pass incluye el visado y la entrada a Petra.", "Reserva al menos dos días para Petra."],
    top: [
      ["Petra", "La ciudad nabatea tallada en roca rosa.", 30.3285, 35.4444],
      ["Wadi Rum", "El desierto de Lawrence de Arabia.", 29.5759, 35.4196],
      ["Mar Muerto", "Flotar en el punto más bajo de la Tierra.", 31.559, 35.4732],
      ["Jerash", "Una de las ciudades romanas mejor conservadas.", 32.2803, 35.8993],
      ["Ammán y su ciudadela", "Capital con teatro romano.", 31.9539, 35.9349]
    ]
  },
  IN: {
    r: "Un subcontinente de contrastes: palacios, templos, espiritualidad, especias y caos fascinante.",
    epoca: "Octubre-marzo. Evita el monzón (junio-septiembre) en gran parte del país.",
    tips: ["Se necesita visado (e-visa online).", "Bebe solo agua embotellada.", "El «Triángulo de Oro» (Delhi-Agra-Jaipur) es ideal para un primer viaje."],
    top: [
      ["Taj Mahal (Agra)", "El mausoleo de mármol símbolo del amor.", 27.1751, 78.0421],
      ["Jaipur, la ciudad rosa", "Palacio de los Vientos y fuerte de Amber.", 26.9239, 75.8267],
      ["Varanasi", "Ghats y ceremonias junto al Ganges.", 25.3176, 82.9739],
      ["Backwaters de Kerala", "Canales en casa-barco entre palmeras.", 9.4981, 76.3388],
      ["Templo Dorado (Amritsar)", "El lugar más sagrado del sijismo.", 31.62, 74.8765],
      ["Goa", "Playas y herencia portuguesa.", 15.2993, 74.124],
      ["Udaipur", "La ciudad de los lagos.", 24.5854, 73.7125]
    ]
  },
  NP: {
    r: "El Himalaya: trekkings legendarios, templos y la ciudad de Katmandú.",
    epoca: "Octubre-noviembre y marzo-mayo.",
    tips: ["Visado a la llegada o online.", "Necesitas permisos (TIMS) para hacer trekkings.", "Aclimátate bien para evitar el mal de altura."],
    top: [
      ["Campo Base del Everest", "El trekking más famoso del mundo.", 28.0026, 86.8528],
      ["Circuito del Annapurna", "Paisajes de alta montaña.", 28.5965, 83.8203],
      ["Valle de Katmandú", "Plazas Durbar y estupas.", 27.7172, 85.324],
      ["Estupa de Boudhanath", "Una de las mayores estupas del mundo.", 27.7215, 85.362],
      ["Pokhara", "Lago Phewa con vistas al Himalaya.", 28.2096, 83.9856],
      ["Parque Nacional de Chitwan", "Rinocerontes y tigres en la selva.", 27.5, 84.33]
    ]
  },
  TH: {
    r: "Templos dorados, comida callejera, islas paradisíacas y gente amable.",
    epoca: "Noviembre-marzo (estación seca y fresca).",
    tips: ["Los españoles pueden entrar sin visado para estancias turísticas (consulta los días permitidos).", "Cúbrete hombros y rodillas en los templos.", "Negocia el precio del tuk-tuk antes de subir."],
    top: [
      ["Gran Palacio (Bangkok)", "Residencia real y templo del Buda Esmeralda.", 13.75, 100.4913],
      ["Wat Arun (Bangkok)", "El templo del Amanecer junto al río.", 13.7437, 100.4888],
      ["Chiang Mai", "Templos, mercados nocturnos y montañas.", 18.7883, 98.9853],
      ["Islas Phi Phi", "Aguas turquesa y la playa Maya Bay.", 7.7407, 98.7784],
      ["Ayutthaya", "Ruinas de la antigua capital del reino de Siam.", 14.3532, 100.5689],
      ["Krabi y Railay", "Acantilados de caliza y playas.", 8.0119, 98.8381],
      ["Mercado flotante Damnoen Saduak", "Comercio sobre canales.", 13.5193, 99.959]
    ]
  },
  VN: {
    r: "Paisajes de arrozales, la bahía de Ha Long, ciudades históricas y una cocina extraordinaria.",
    epoca: "Varía por región: norte, octubre-abril; centro, febrero-agosto; sur, diciembre-abril.",
    tips: ["Los españoles pueden entrar sin visado para estancias cortas (consulta la duración vigente).", "Prueba el pho y el banh mi.", "Cruza la calle a ritmo constante: las motos te esquivarán."],
    top: [
      ["Bahía de Ha Long", "Miles de islotes de caliza sobre aguas esmeralda.", 20.9101, 107.1839],
      ["Hoi An", "Ciudad antigua iluminada con farolillos.", 15.8801, 108.338],
      ["Hanói", "Barrio antiguo y lago Hoan Kiem.", 21.0285, 105.8542],
      ["Sapa", "Arrozales en terrazas y minorías étnicas.", 22.3364, 103.8438],
      ["Delta del Mekong", "Mercados flotantes y canales.", 10.0452, 105.7469],
      ["Ciudad de Ho Chi Minh", "La antigua Saigón, vibrante y moderna.", 10.8231, 106.6297],
      ["Phong Nha-Ke Bang", "Algunas de las cuevas más grandes del mundo.", 17.5917, 106.2833]
    ]
  },
  ID: {
    r: "Más de 17.000 islas: Bali, volcanes, templos, arrozales y algunas de las mejores inmersiones del mundo.",
    epoca: "Abril-octubre (estación seca).",
    tips: ["Visado a la llegada (VoA) para ciudadanos españoles.", "Bali tiene una tasa turística de entrada.", "Respeta las ceremonias en los templos balineses."],
    top: [
      ["Bali (Ubud)", "Arrozales de Tegallalang y templos.", -8.5069, 115.2625],
      ["Templo Borobudur (Java)", "El mayor templo budista del mundo.", -7.6079, 110.2038],
      ["Parque Nacional de Komodo", "Dragones de Komodo y playas rosas.", -8.55, 119.49],
      ["Monte Bromo", "Volcán activo en un mar de arena.", -7.9425, 112.953],
      ["Islas Gili", "Islas sin coches para bucear y relajarse.", -8.35, 116.04],
      ["Raja Ampat", "La biodiversidad marina más rica del planeta.", -0.5, 130.5],
      ["Templo Tanah Lot (Bali)", "Templo sobre una roca en el mar.", -8.6212, 115.0868]
    ]
  },
  JP: {
    r: "Tradición milenaria y tecnología futurista: templos, jardines, neones, gastronomía y un transporte impecable.",
    epoca: "Primavera (marzo-abril, cerezos en flor) y otoño (octubre-noviembre, hojas rojas).",
    tips: ["Los españoles no necesitan visado para estancias turísticas de hasta 90 días.", "El Japan Rail Pass puede compensar si haces varios trayectos en shinkansen.", "No se da propina; lleva algo de efectivo."],
    top: [
      ["Kioto: Fushimi Inari", "Miles de torii rojos en la montaña.", 34.9671, 135.7727],
      ["Monte Fuji", "El volcán sagrado de Japón.", 35.3606, 138.7274],
      ["Tokio: Shibuya y Shinjuku", "El cruce más famoso y la vida nocturna.", 35.6595, 139.7005],
      ["Templo Senso-ji (Tokio)", "El templo más antiguo de Tokio en Asakusa.", 35.7148, 139.7967],
      ["Nara", "Ciervos y el gran Buda del Todai-ji.", 34.6851, 135.843],
      ["Hiroshima y Miyajima", "Memorial de la Paz y el torii flotante.", 34.2959, 132.3199],
      ["Kioto: bosque de bambú de Arashiyama", "Senderos entre bambú gigante.", 35.017, 135.6713],
      ["Osaka: Dotonbori", "Neones y comida callejera.", 34.6687, 135.5013]
    ]
  },
  CN: {
    r: "Un país-continente: la Gran Muralla, ciudades futuristas, paisajes kársticos y 5.000 años de historia.",
    epoca: "Abril-mayo y septiembre-octubre.",
    tips: ["Los españoles pueden entrar sin visado para estancias cortas (consulta la política vigente).", "Instala Alipay o WeChat Pay y una VPN antes de viajar.", "Evita viajar durante la Semana Dorada (1-7 de octubre)."],
    top: [
      ["Gran Muralla (Mutianyu)", "El tramo restaurado más espectacular cerca de Pekín.", 40.4319, 116.5704],
      ["Ciudad Prohibida (Pekín)", "Palacio imperial de las dinastías Ming y Qing.", 39.9163, 116.3972],
      ["Guerreros de Terracota (Xi'an)", "Ejército de 8.000 figuras.", 34.3853, 109.2785],
      ["Shanghái: el Bund", "Skyline futurista frente a edificios coloniales.", 31.24, 121.49],
      ["Guilin y río Li", "Montañas kársticas de cuento.", 24.7779, 110.4961],
      ["Zhangjiajie", "Los pilares de piedra que inspiraron «Avatar».", 29.3249, 110.4343],
      ["Chengdu y los pandas", "Centro de cría del panda gigante.", 30.7333, 104.1458]
    ]
  },
  KR: {
    r: "K-pop, palacios, templos, montañas y una gastronomía adictiva.",
    epoca: "Abril-junio y septiembre-noviembre.",
    tips: ["Se necesita la autorización K-ETA (consulta exenciones temporales).", "La tarjeta T-money sirve para todo el transporte.", "Prueba la barbacoa coreana y el kimchi."],
    top: [
      ["Palacio Gyeongbokgung (Seúl)", "El gran palacio de la dinastía Joseon.", 37.5796, 126.977],
      ["Aldea Bukchon Hanok (Seúl)", "Casas tradicionales coreanas.", 37.5826, 126.9831],
      ["Isla de Jeju", "Volcanes, cascadas y playas.", 33.4996, 126.5312],
      ["Busan", "Playas y la colorida aldea de Gamcheon.", 35.0975, 129.0106],
      ["Gyeongju", "Antigua capital del reino Silla.", 35.8562, 129.2247],
      ["Zona Desmilitarizada (DMZ)", "La frontera con Corea del Norte.", 37.9562, 126.6772]
    ]
  },
  AU: {
    r: "Gran Barrera de Coral, Outback rojo, fauna única y ciudades vibrantes.",
    epoca: "Septiembre-noviembre y marzo-mayo. El norte tropical, de mayo a octubre.",
    tips: ["Se necesita visado electrónico eVisitor (gratuito para ciudadanos de la UE).", "Usa siempre protección solar.", "Se conduce por la izquierda; las distancias son enormes."],
    top: [
      ["Ópera de Sídney", "El edificio icónico junto al Harbour Bridge.", -33.8568, 151.2153],
      ["Gran Barrera de Coral", "El mayor sistema de arrecifes del mundo.", -18.2871, 147.6992],
      ["Uluru", "Monolito sagrado en el corazón del Outback.", -25.3444, 131.0369],
      ["Great Ocean Road", "Carretera costera y los Doce Apóstoles.", -38.6662, 143.1051],
      ["Bondi Beach (Sídney)", "La playa más famosa de Australia.", -33.8915, 151.2767],
      ["Selva de Daintree", "La selva tropical más antigua del mundo.", -16.1667, 145.4167],
      ["Melbourne", "Callejones, café y cultura.", -37.8136, 144.9631]
    ]
  },
  NZ: {
    r: "Paisajes de película: fiordos, glaciares, volcanes y deportes de aventura.",
    epoca: "Diciembre-marzo (verano austral); junio-agosto para esquí.",
    tips: ["Se necesita la autorización NZeTA.", "Lo ideal es recorrerla en autocaravana.", "Muy estrictos con la bioseguridad: declara comida y material de montaña."],
    top: [
      ["Milford Sound", "Fiordo espectacular entre picos y cascadas.", -44.6414, 167.8974],
      ["Queenstown", "Capital mundial de la aventura.", -45.0312, 168.6626],
      ["Hobbiton", "El plató de «El Señor de los Anillos».", -37.8721, 175.6829],
      ["Rotorua", "Géiseres y cultura maorí.", -38.1368, 176.2497],
      ["Tongariro Alpine Crossing", "La mejor ruta de un día del país.", -39.1333, 175.65],
      ["Glaciar Franz Josef", "Glaciar que desciende hacia la selva.", -43.4667, 170.1833],
      ["Cuevas de Waitomo", "Gusanos luminosos en cuevas.", -38.2608, 175.1035]
    ]
  },
  US: {
    r: "Grandes ciudades, parques nacionales colosales y carreteras míticas de costa a costa.",
    epoca: "Depende de la zona: primavera y otoño suelen ser ideales.",
    tips: ["Necesitas la autorización ESTA antes de volar.", "La propina (15-20 %) es casi obligatoria en restaurantes.", "Contrata un seguro médico de viaje: la sanidad es muy cara."],
    top: [
      ["Nueva York: Times Square y Central Park", "La ciudad que nunca duerme.", 40.758, -73.9855],
      ["Gran Cañón (Arizona)", "Un abismo de 1,6 km de profundidad.", 36.1069, -112.1129],
      ["Estatua de la Libertad", "Símbolo de la llegada al Nuevo Mundo.", 40.6892, -74.0445],
      ["Golden Gate (San Francisco)", "El puente rojo más famoso.", 37.8199, -122.4783],
      ["Parque Nacional de Yellowstone", "Géiseres, bisontes y aguas termales.", 44.428, -110.5885],
      ["Las Vegas", "Casinos y espectáculos en pleno desierto.", 36.1147, -115.1728],
      ["Parque Nacional de Yosemite", "El Capitán y cascadas gigantes.", 37.8651, -119.5383],
      ["Miami y los Cayos de Florida", "Playas, art déco y la Overseas Highway.", 25.7907, -80.13]
    ]
  },
  CA: {
    r: "Naturaleza inmensa: montañas Rocosas, lagos turquesa, cataratas y ciudades multiculturales.",
    epoca: "Junio-septiembre; otoño para el «verano indio»; invierno para esquí.",
    tips: ["Necesitas la autorización eTA antes de volar.", "En Quebec se habla francés.", "Propina habitual del 15-20 %."],
    top: [
      ["Cataratas del Niágara", "Las cataratas más famosas de Norteamérica.", 43.0896, -79.0849],
      ["Parque Nacional Banff", "Lago Louise y las Montañas Rocosas.", 51.4968, -115.9281],
      ["Lago Moraine", "Agua turquesa entre picos.", 51.3217, -116.186],
      ["Quebec (ciudad)", "Ciudad amurallada de aire francés.", 46.8139, -71.208],
      ["Vancouver", "Stanley Park, mar y montaña.", 49.2827, -123.1207],
      ["Toronto y la CN Tower", "La gran metrópolis canadiense.", 43.6426, -79.3871],
      ["Montreal", "Viejo Montreal y vida cultural.", 45.5017, -73.5673]
    ]
  },
  MX: {
    r: "Pirámides mayas y aztecas, playas caribeñas, cenotes, pueblos mágicos y una cocina Patrimonio de la Humanidad.",
    epoca: "Noviembre-abril (estación seca).",
    tips: ["Los españoles no necesitan visado para turismo.", "Bebe agua embotellada.", "Prueba los tacos al pastor y el mole."],
    top: [
      ["Chichén Itzá", "La pirámide de Kukulkán, maravilla del mundo moderno.", 20.6843, -88.5678],
      ["Tulum", "Ruinas mayas sobre el Caribe.", 20.2148, -87.4291],
      ["Teotihuacán", "Pirámides del Sol y la Luna.", 19.6925, -98.8438],
      ["Ciudad de México", "Zócalo, Frida Kahlo y Museo de Antropología.", 19.4326, -99.1332],
      ["Cenotes de Yucatán", "Pozas de agua cristalina.", 20.66, -88.24],
      ["Oaxaca", "Gastronomía, mezcal y Monte Albán.", 17.0732, -96.7266],
      ["Cancún e Isla Mujeres", "Playas de arena blanca.", 21.1619, -86.8515],
      ["Palenque", "Ciudad maya en la selva de Chiapas.", 17.4838, -92.0462]
    ]
  },
  CU: {
    r: "Coches clásicos, música, playas de arena blanca y una arquitectura colonial detenida en el tiempo.",
    epoca: "Noviembre-abril.",
    tips: ["Se necesita la tarjeta del turista / visado electrónico.", "Lleva efectivo en euros: las tarjetas pueden fallar.", "Alójate en casas particulares para conocer el país."],
    top: [
      ["La Habana Vieja", "Plazas coloniales y el Malecón.", 23.1365, -82.3499],
      ["Trinidad", "Ciudad colonial perfectamente conservada.", 21.8024, -79.9846],
      ["Valle de Viñales", "Mogotes y plantaciones de tabaco.", 22.6167, -83.7167],
      ["Varadero", "Kilómetros de playa caribeña.", 23.1394, -81.2861],
      ["Cayo Santa María", "Cayos de arena blanca.", 22.66, -79.0],
      ["Cienfuegos", "La perla del sur.", 22.1461, -80.4356]
    ]
  },
  CR: {
    r: "Pura vida: selvas, volcanes, dos océanos y una biodiversidad asombrosa.",
    epoca: "Diciembre-abril (estación seca).",
    tips: ["Los españoles no necesitan visado para turismo.", "Alquila un 4x4 para algunas zonas.", "Lleva repelente y chubasquero."],
    top: [
      ["Volcán Arenal", "Volcán perfecto, termas y puentes colgantes.", 10.4626, -84.7032],
      ["Parque Nacional Manuel Antonio", "Playas con monos y perezosos.", 9.3923, -84.137],
      ["Monteverde", "Bosque nuboso y tirolinas.", 10.3009, -84.8256],
      ["Tortuguero", "Canales y desove de tortugas.", 10.5428, -83.5022],
      ["Río Celeste", "Río de color azul intenso.", 10.7, -85.0],
      ["Península de Osa (Corcovado)", "Uno de los lugares más biodiversos del planeta.", 8.5404, -83.5711]
    ]
  },
  CO: {
    r: "Caribe, Andes, Amazonía, café y ciudades llenas de vida y transformación.",
    epoca: "Diciembre-marzo y julio-agosto (temporadas más secas).",
    tips: ["Los españoles no necesitan visado para turismo.", "Infórmate sobre zonas recomendadas.", "Prueba la bandeja paisa y el café local."],
    top: [
      ["Cartagena de Indias", "Ciudad amurallada colonial en el Caribe.", 10.391, -75.4794],
      ["Eje Cafetero (Valle de Cocora)", "Palmas de cera gigantes y fincas de café.", 4.6383, -75.4874],
      ["Medellín y la Comuna 13", "Grafitis y la ciudad de la eterna primavera.", 6.2476, -75.5658],
      ["Parque Tayrona", "Playas entre selva y mar.", 11.3087, -74.0294],
      ["Bogotá y el Museo del Oro", "Capital andina y su tesoro precolombino.", 4.6019, -74.0721],
      ["Caño Cristales", "El «río de los cinco colores».", 2.2654, -73.7926],
      ["Guatapé", "La piedra del Peñol y pueblo de colores.", 6.2214, -75.1792]
    ]
  },
  PE: {
    r: "Machu Picchu, cultura inca, Amazonía y una de las mejores gastronomías del mundo.",
    epoca: "Mayo-septiembre (estación seca en los Andes).",
    tips: ["Reserva Machu Picchu y el Camino Inca con meses de antelación.", "Aclimátate en Cusco para evitar el soroche (mal de altura).", "Prueba el ceviche y el pisco sour."],
    top: [
      ["Machu Picchu", "La ciudadela inca entre montañas.", -13.1631, -72.545],
      ["Cusco", "Antigua capital del Imperio inca.", -13.5319, -71.9675],
      ["Valle Sagrado", "Pisac, Ollantaytambo y terrazas incas.", -13.3333, -72.0833],
      ["Lago Titicaca", "Islas flotantes de los Uros.", -15.8402, -69.9],
      ["Montaña de Siete Colores (Vinicunca)", "Montaña de franjas de colores.", -13.8691, -71.3031],
      ["Líneas de Nazca", "Geoglifos gigantes en el desierto.", -14.739, -75.13],
      ["Lima: Miraflores y Barranco", "Gastronomía y acantilados.", -12.1211, -77.0298],
      ["Cañón del Colca", "Uno de los más profundos del mundo, con cóndores.", -15.6, -71.9]
    ]
  },
  AR: {
    r: "Tango, glaciares patagónicos, cataratas del Iguazú, vino y la mejor carne.",
    epoca: "Octubre-abril para la Patagonia; todo el año para Buenos Aires.",
    tips: ["Los españoles no necesitan visado.", "Las distancias son enormes: combina vuelos internos.", "Prueba el asado, el mate y el malbec."],
    top: [
      ["Glaciar Perito Moreno", "Un glaciar vivo que se puede escuchar crujir.", -50.4967, -73.1377],
      ["Cataratas del Iguazú", "Más de 270 saltos, incluida la Garganta del Diablo.", -25.6953, -54.4367],
      ["Buenos Aires", "Tango en San Telmo, Caminito y Recoleta.", -34.6037, -58.3816],
      ["El Chaltén y el Fitz Roy", "Capital nacional del trekking.", -49.3315, -72.8863],
      ["Ushuaia", "La ciudad del fin del mundo.", -54.8019, -68.303],
      ["Mendoza", "Bodegas al pie del Aconcagua.", -32.8895, -68.8458],
      ["Península Valdés", "Ballenas, pingüinos y elefantes marinos.", -42.5, -64.0]
    ]
  },
  BR: {
    r: "Playas infinitas, selva amazónica, carnaval y ciudades llenas de ritmo.",
    epoca: "Abril-octubre en el sureste; el carnaval se celebra en febrero/marzo.",
    tips: ["Los españoles no necesitan visado para turismo.", "Ten cuidado con tus pertenencias en zonas turísticas.", "Vuelos internos para cubrir grandes distancias."],
    top: [
      ["Cristo Redentor (Río de Janeiro)", "Sobre el cerro del Corcovado.", -22.9519, -43.2105],
      ["Pan de Azúcar", "Teleférico con vistas a la bahía de Río.", -22.9486, -43.1566],
      ["Cataratas de Iguazú (lado brasileño)", "Vistas panorámicas de las cataratas.", -25.6953, -54.4367],
      ["Amazonas (Manaos)", "La mayor selva tropical del planeta.", -3.119, -60.0217],
      ["Salvador de Bahía", "Pelourinho y cultura afrobrasileña.", -12.9714, -38.5014],
      ["Lençóis Maranhenses", "Dunas blancas con lagunas de agua dulce.", -2.5297, -43.1267],
      ["Fernando de Noronha", "Archipiélago con algunas de las mejores playas del mundo.", -3.8547, -32.4245]
    ]
  },
  CL: {
    r: "Del desierto más árido del mundo a los glaciares patagónicos e Isla de Pascua.",
    epoca: "Octubre-abril; la Patagonia, de diciembre a febrero.",
    tips: ["Los españoles no necesitan visado.", "Prueba el pisco, la empanada de pino y los vinos chilenos."],
    top: [
      ["Torres del Paine", "El parque nacional icónico de la Patagonia.", -50.9423, -73.4068],
      ["Desierto de Atacama", "Géiseres, salares y cielos estrellados.", -22.9087, -68.1997],
      ["Isla de Pascua", "Los misteriosos moáis de Rapa Nui.", -27.1127, -109.3497],
      ["Valparaíso", "Cerros de colores y ascensores históricos.", -33.0472, -71.6127],
      ["Santiago de Chile", "Capital al pie de los Andes.", -33.4489, -70.6693],
      ["Región de los Lagos", "Volcanes y lagos de la Patagonia norte.", -41.1, -72.6]
    ]
  },
  MV: {
    r: "Atolones de arena blanca, aguas turquesa y bungalós sobre el agua.",
    epoca: "Noviembre-abril (estación seca).",
    tips: ["Visado gratuito a la llegada para turistas.", "Las islas locales son una alternativa económica a los resorts.", "Respeta las normas locales: país musulmán."],
    top: [
      ["Atolón de Malé Sur", "Resorts y arrecifes a poca distancia de la capital.", 3.9, 73.45],
      ["Atolón de Ari", "Tiburones ballena y mantas.", 3.86, 72.83],
      ["Bahía de Hanifaru", "Reserva de la biosfera con mantas gigantes.", 5.17, 73.13],
      ["Malé", "La pequeña y colorida capital.", 4.1755, 73.5093],
      ["Bioluminiscencia en Vaadhoo", "El «mar de estrellas».", 5.84, 73.36]
    ]
  },
  AD: {
    r: "País de montaña en los Pirineos: esquí, senderismo, compras y el spa de Caldea.",
    epoca: "Diciembre-abril para esquí; junio-septiembre para senderismo.",
    tips: ["No tiene aeropuerto internacional: se llega por carretera desde Barcelona (unas 3 h).", "Hay autobuses directos desde el aeropuerto de Barcelona.", "Usa el euro pero no es parte de la UE: controla los límites de compras."],
    top: [
      ["Grandvalira", "El mayor dominio esquiable de los Pirineos.", 42.5397, 1.7334],
      ["Caldea", "Centro termolúdico en Escaldes-Engordany.", 42.5112, 1.5395],
      ["Valle del Madriu-Perafita-Claror", "Valle glaciar Patrimonio de la Humanidad.", 42.48, 1.58],
      ["Andorra la Vella", "Barri Antic y compras.", 42.5063, 1.5218],
      ["Iglesia de Sant Joan de Caselles", "Joya románica del país.", 42.5662, 1.6043]
    ]
  }
};
