import { AreaId } from '../types';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  areaId: AreaId;
  difficulty: 'facil' | 'medio' | 'experto';
  points: number;
  funFactBadge: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '¿A qué velocidad máxima llega Shambhala en su primera bajada?',
    options: ['110 km/h', '134 km/h', '160 km/h', '95 km/h'],
    correctIndex: 1,
    explanation: 'Shambhala alcanza 134 km/h tras su impresionante caída de 78 metros y 77 grados de inclinación.',
    areaId: 'china',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Hipercoaster Récord',
  },
  {
    id: 'q2',
    question: '¿Cuántas inversiones (giros de 360°) tiene Dragon Khan?',
    options: ['6 inversiones', '7 inversiones', '8 inversiones', '10 inversiones'],
    correctIndex: 2,
    explanation: 'Dragon Khan batió el récord mundial al inaugurarse en 1995 con 8 espectaculares inversiones.',
    areaId: 'china',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Mito del Parque',
  },
  {
    id: 'q3',
    question: '¿En cuántos segundos acelera Red Force de 0 a 180 km/h?',
    options: ['5,0 segundos', '3,5 segundos', '8,0 segundos', '1,9 segundos'],
    correctIndex: 1,
    explanation: 'Red Force en Ferrari Land te propulsa de 0 a 180 km/h en tan solo 3,5 segundos, alcanzando 112 metros de altura.',
    areaId: 'ferrari-land',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'La Aceleración Más Rápida',
  },
  {
    id: 'q4',
    question: '¿Qué tipo de propulsión utiliza Furius Baco para lanzarte a 135 km/h en Mediterrània?',
    options: ['Cadena tradicional', 'Propulsión hidráulica', 'Motor magnético LSM', 'Caída por gravedad'],
    correctIndex: 1,
    explanation: 'Furius Baco utiliza un motor hidráulico masivo que acelera a 135 km/h en solo 3 segundos sobre los viñedos.',
    areaId: 'mediterrania',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Ingeniería Wing Coaster',
  },
  {
    id: 'q5',
    question: '¿Cuál es la altura total de la torre de caída libre Hurakan Condor?',
    options: ['70 metros', '86 metros', '100 metros', '125 metros'],
    correctIndex: 2,
    explanation: 'Hurakan Condor mide exactamente 100 metros de altura con una caída libre vertiginosa de 86 metros a 115 km/h.',
    areaId: 'mexico',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Sacrificio Maya',
  },
  {
    id: 'q6',
    question: '¿Cómo se llaman los dos trenes que compiten en la montaña rusa de madera Stampida?',
    options: ['Rojo y Azul', 'Tiburón y Águila', 'Búfalo y Puma', 'Coyote y Correcaminos'],
    correctIndex: 0,
    explanation: 'Stampida es un duelo entre dos familias del viejo oeste: el tren Rojo y el tren Azul compitiendo en paralelo.',
    areaId: 'far-west',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Duelo de Madera',
  },
  {
    id: 'q7',
    question: '¿Qué atracción acuática de Polynesia te lanza desde un volcán sagrado?',
    options: ['Grand Canyon Rapids', 'Silver River Flume', 'Tutuki Splash', 'Angkor'],
    correctIndex: 2,
    explanation: 'Tutuki Splash te hace escapar de la erupción de un volcán polinesio con dos caídas de agua refrescantes.',
    areaId: 'polynesia',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Erupción Tropical',
  },
  {
    id: 'q8',
    question: '¿En qué año abrió sus puertas por primera vez PortAventura?',
    options: ['1992', '1995', '1998', '2001'],
    correctIndex: 1,
    explanation: 'PortAventura fue inaugurado el 1 de mayo de 1995, convirtiéndose rápidamente en el resort temático de referencia en Europa.',
    areaId: 'mediterrania',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Historia del Parque',
  },
  {
    id: 'q9',
    question: '¿En qué atracción del Far West buscas el tesoro perdido de la película Uncharted?',
    options: ['El Diablo', 'Uncharted: El Enigma de Penitence', 'Tomahawk', 'Crazy Barrels'],
    correctIndex: 1,
    explanation: 'Uncharted es una Dark Ride multidimensional de última generación con caídas laterales, marcha atrás y efectos especiales.',
    areaId: 'far-west',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Novedad de Aventura',
  },
  {
    id: 'q10',
    question: '¿Cómo se llama la Dark Ride interactiva 3D con pistolas de galletas en SésamoAventura?',
    options: ['Elmo Safari', 'Street Mission', 'Tami-Tami', 'El Salto de Blas'],
    correctIndex: 1,
    explanation: 'Street Mission te convierte en detective secreto con el Monstruo de las Galletas para salvar el Big Cookie.',
    areaId: 'sesamo',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Misión Galletera',
  },
  {
    id: 'q11',
    question: '¿Cuál es la longitud total de la vía de Shambhala?',
    options: ['980 metros', '1.650 metros', '2.100 metros', '1.200 metros'],
    correctIndex: 1,
    explanation: 'Shambhala recorre 1.650 metros de vía aérea a través de colinas de gravedad cero (camelbacks) y un túnel.',
    areaId: 'china',
    difficulty: 'experto',
    points: 200,
    funFactBadge: 'Dato Técnico Pro',
  },
  {
    id: 'q12',
    question: '¿Qué famosa criatura marina y viñedos inspiran la historia de Furius Baco?',
    options: ['Un tiburón del lago', 'El mono inventor del profesor', 'Un dragón marino', 'Un águila real'],
    correctIndex: 1,
    explanation: 'Un travieso mono enciende por error la máquina recolectora de vino del profesor loco, desatando una aceleración descomunal.',
    areaId: 'mediterrania',
    difficulty: 'experto',
    points: 200,
    funFactBadge: 'Lore Secreto',
  },
  {
    id: 'q13',
    question: '¿En qué atracción de México te enfrentas a una maldición con fuego real y efectos pirotécnicos?',
    options: ['Los Potrillos', 'El Secreto de los Mayas', 'Templo del Fuego', 'Serpiente Emplumada'],
    correctIndex: 2,
    explanation: 'El Templo del Fuego es un show inmersivo donde el suelo tiembla y las llamas rodean a los visitantes.',
    areaId: 'mexico',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Efectos Especiales',
  },
  {
    id: 'q14',
    question: '¿Cómo se llama el pueblo fronterizo minero donde se ambienta Far West?',
    options: ['Tombstone', 'Penitence', 'Silverado', 'Deadwood'],
    correctIndex: 1,
    explanation: 'Penitence celebra el 4 de Julio de 1876 con sus saloons, carreras de troncos y duelos en el río.',
    areaId: 'far-west',
    difficulty: 'experto',
    points: 200,
    funFactBadge: 'Cultura Temática',
  },
  {
    id: 'q15',
    question: '¿Cuál es la atracción acuática de troncos que baja por un aserradero en Far West?',
    options: ['Tutuki Splash', 'Silver River Flume', 'Grand Canyon Rapids', 'Angkor'],
    correctIndex: 1,
    explanation: 'Silver River Flume te sube en troncos de madera tallada con tres caídas consecutivas llenas de agua.',
    areaId: 'far-west',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Clásico de Agua',
  },
  {
    id: 'q16',
    question: '¿Cuántas zonas o mundos temáticos componen actualmente PortAventura World (incluyendo Ferrari Land)?',
    options: ['5 mundos', '6 mundos', '7 mundos', '8 mundos'],
    correctIndex: 2,
    explanation: 'Son 7 mundos: Mediterrània, Polynesia, China, México, Far West, SésamoAventura y el parque anexo Ferrari Land.',
    areaId: 'china',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Geografía del Parque',
  },
  {
    id: 'q17',
    question: '¿Qué célebre fabricante suizo diseñó tanto Dragon Khan como Shambhala?',
    options: ['Intamin Amusement Rides', 'Bolliger & Mabillard (B&M)', 'Mack Rides', 'Vekoma Rides'],
    correctIndex: 1,
    explanation: 'Bolliger & Mabillard (B&M) es el legendario fabricante suizo creador del Dragon Khan (1995) y Shambhala (2012).',
    areaId: 'china',
    difficulty: 'experto',
    points: 200,
    funFactBadge: 'Ingeniería Máxima',
  },
  {
    id: 'q18',
    question: '¿Qué barco de pesca tradicional descansa en el puerto de entrada de Mediterrània?',
    options: ['La Santa María', 'El Carmencita / Barca Marinera', 'El Halcón Milenario', 'El Holandés Errante'],
    correctIndex: 1,
    explanation: 'Mediterrània recrea un auténtico pueblo de pescadores de la Costa Daurada con barcos tradicionales amarrados al lago.',
    areaId: 'mediterrania',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Detalles del Puerto',
  },
  {
    id: 'q19',
    question: '¿Qué montaña rusa de madera infantil acompaña a Stampida compartiendo parte de su trazado?',
    options: ['Tami-Tami', 'Tomahawk', 'El Diablo', 'Canoes'],
    correctIndex: 1,
    explanation: 'Tomahawk es la montaña rusa de madera familiar cuyos raíles se entrelazan de forma espectacular con los de Stampida.',
    areaId: 'far-west',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Vías Cruzadas',
  },
  {
    id: 'q20',
    question: '¿En qué atracción recorres un templo místico de Camboya disparando chorros de agua a otros botes?',
    options: ['Tutuki Splash', 'Silver River Flume', 'Angkor: Aventura en el Reino Perdido', 'Grand Canyon Rapids'],
    correctIndex: 2,
    explanation: 'Angkor es una batalla naval interactiva donde cada tripulante usa cañones de agua para apuntar a dianas y otros barcos.',
    areaId: 'china',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Batalla Naval',
  },
  {
    id: 'q21',
    question: '¿A qué velocidad circula la montaña rusa de la mina "El Diablo - Tren de la Mina"?',
    options: ['Aproximadamente 60 km/h', '110 km/h', '35 km/h', '85 km/h'],
    correctIndex: 0,
    explanation: 'El Diablo circula a unos 60 km/h a lo largo de un serpenteante recorrido minero con tres zonas de subida con cadena.',
    areaId: 'mexico',
    difficulty: 'medio',
    points: 150,
    funFactBadge: 'Mina Abandonada',
  },
  {
    id: 'q22',
    question: '¿Cuál es la mascota principal e icono oficial de PortAventura World desde sus orígenes?',
    options: ['El Pájaro Loco (Woody Woodpecker)', 'El Monstruo de las Galletas', 'Beto el Búho', 'Kukuxumusu'],
    correctIndex: 0,
    explanation: 'Woody Woodpecker (el Pájaro Loco) es la simpática e histórica mascota oficial que da la bienvenida a todos los visitantes.',
    areaId: 'mediterrania',
    difficulty: 'facil',
    points: 100,
    funFactBadge: 'Mascota Legendaria',
  },
];

export interface QueueChallenge {
  id: string;
  title: string;
  category: 'imitacion' | 'memoria' | 'rapidez' | 'grupo' | 'conocimiento';
  description: string;
  rewardPoints: number;
}

export const QUEUE_CHALLENGES: QueueChallenge[] = [
  {
    id: 'ch1',
    title: 'Grito de Montaña Rusa',
    category: 'imitacion',
    description: 'Imita en 5 segundos el grito de la primera bajada de Shambhala o Dragon Khan sin romperte de risa.',
    rewardPoints: 50,
  },
  {
    id: 'ch2',
    title: 'Cadena de Atracciones',
    category: 'memoria',
    description: 'Nombra por turnos 5 atracciones de PortAventura que empiecen por letras distintas sin repetir ninguna.',
    rewardPoints: 60,
  },
  {
    id: 'ch3',
    title: 'El Trono de la Cola',
    category: 'grupo',
    description: 'Haz que todo tu grupo vote al unísono quién es el más valiente del día y quién es el que más se marea.',
    rewardPoints: 40,
  },
  {
    id: 'ch4',
    title: 'Estatua del Drop',
    category: 'imitacion',
    description: 'Quédate totalmente congelado con cara de velocidad máxima durante 10 segundos mientras los demás te hacen reír.',
    rewardPoints: 50,
  },
  {
    id: 'ch5',
    title: 'Adivina la Velocidad',
    category: 'conocimiento',
    description: 'Sin mirar, adivina si Furius Baco o Red Force tiene mayor velocidad máxima y cuántos km/h de diferencia tienen.',
    rewardPoints: 70,
  },
  {
    id: 'ch6',
    title: 'El Pato Mojado',
    category: 'grupo',
    description: 'Pregunta a los que vienen saliendo si salieron muy mojados de la atracción y calcula su nivel de humedad.',
    rewardPoints: 40,
  },
  {
    id: 'ch7',
    title: 'Duelo de Miradas del Salvaje Oeste',
    category: 'rapidez',
    description: 'Poneos cara a cara dos personas del grupo como en un duelo de Penitence. El primero que parpadee o sonría pierde.',
    rewardPoints: 50,
  },
  {
    id: 'ch8',
    title: 'Sonido de Frenos Magnéticos',
    category: 'imitacion',
    description: 'Haz el sonido exacto que hace el tren de Dragon Khan o Shambhala al frenar bruscamente en la estación.',
    rewardPoints: 50,
  },
  {
    id: 'ch9',
    title: 'Las 7 Zonas Contrarreloj',
    category: 'memoria',
    description: 'Nombra en voz alta los 7 mundos temáticos de PortAventura en menos de 10 segundos sin equivocarte.',
    rewardPoints: 60,
  },
  {
    id: 'ch10',
    title: 'Foto Divertida de Grupo en la Fila',
    category: 'grupo',
    description: 'Sacad todos la lengua o poned cara de bajada de montaña rusa para la foto del recuerdo en la fila.',
    rewardPoints: 45,
  },
];

export interface WheelChoice {
  id: string;
  label: string;
  color: string;
  type: 'coaster' | 'water' | 'family' | 'chill' | 'food' | 'secret';
  attractionId?: string;
  description: string;
}

export const WHEEL_CHOICES: WheelChoice[] = [
  {
    id: 'w1',
    label: 'Shambhala',
    color: '#0284c7',
    type: 'coaster',
    attractionId: 'shambhala',
    description: '¡Rumbo al Himalaya! Subida a la colosal montaña rusa de 76 metros.',
  },
  {
    id: 'w2',
    label: 'Dragon Khan',
    color: '#dc2626',
    type: 'coaster',
    attractionId: 'dragon-khan',
    description: '¡8 inversiones legendarias te esperan en la China Imperial!',
  },
  {
    id: 'w3',
    label: 'Tutuki Splash',
    color: '#059669',
    type: 'water',
    attractionId: 'tutuki-splash',
    description: '¡Chapuzón asegurado! Toca escapar del volcán de Polynesia.',
  },
  {
    id: 'w4',
    label: 'Red Force',
    color: '#e11d48',
    type: 'coaster',
    attractionId: 'red-force',
    description: '¡0 a 180 km/h en 3,5s! El mito de Ferrari Land.',
  },
  {
    id: 'w5',
    label: 'Furius Baco',
    color: '#9a3412',
    type: 'coaster',
    attractionId: 'furius-baco',
    description: '¡Volar a ras de viñedo a 135 km/h en Mediterrània!',
  },
  {
    id: 'w6',
    label: 'Uncharted',
    color: '#d97706',
    type: 'coaster',
    attractionId: 'uncharted',
    description: '¡En busca del tesoro en la Dark Ride más moderna del Far West!',
  },
  {
    id: 'w7',
    label: 'Hurakan Condor',
    color: '#7c3aed',
    type: 'coaster',
    attractionId: 'hurakan-condor',
    description: '¡100 metros de caída libre maya para los más valientes!',
  },
  {
    id: 'w8',
    label: 'Gran Canyon Rapids',
    color: '#0891b2',
    type: 'water',
    attractionId: 'grand-canyon-rapids',
    description: '¡Rápidos fluviales en barca redonda por los cañones del oeste!',
  },
];

// ==========================================
// 10 NUEVOS JUEGOS DE COLA INTERACTIVOS
// ==========================================

// 1. ¿Quién mide más? (Comparador de alturas de atracciones)
export interface HeightDuelCard {
  id: string;
  name: string;
  heightMeters: number;
  area: string;
  imageIcon: string;
}

export const HEIGHT_DUEL_CARDS: HeightDuelCard[] = [
  { id: 'hd1', name: 'Red Force (Ferrari Land)', heightMeters: 112, area: 'Ferrari Land', imageIcon: '🏎️' },
  { id: 'hd2', name: 'Hurakan Condor', heightMeters: 100, area: 'México', imageIcon: '🗿' },
  { id: 'hd3', name: 'Shambhala', heightMeters: 76, area: 'China', imageIcon: '🏔️' },
  { id: 'hd4', name: 'Dragon Khan', heightMeters: 45, area: 'China', imageIcon: '🐉' },
  { id: 'hd5', name: 'Stampida', heightMeters: 26, area: 'Far West', imageIcon: '🤠' },
  { id: 'hd6', name: 'Furius Baco (Vía)', heightMeters: 16, area: 'Mediterrània', imageIcon: '🍇' },
  { id: 'hd7', name: 'Tutuki Splash', heightMeters: 15, area: 'Polynesia', imageIcon: '🌋' },
  { id: 'hd8', name: 'El Diablo (Tren Mina)', heightMeters: 17, area: 'México', imageIcon: '⛏️' },
  { id: 'hd9', name: 'Silver River Flume', heightMeters: 16, area: 'Far West', imageIcon: '🪵' },
  { id: 'hd10', name: 'Tomahawk', heightMeters: 13, area: 'Far West', imageIcon: '🪓' },
  { id: 'hd11', name: 'Tami-Tami', heightMeters: 9, area: 'SésamoAventura', imageIcon: '🐥' },
];

// 2. Cronómetro Ciego (Detén en 10.00 exactos)
// 3. Cadena de Palabras Temáticas de PortAventura (Bomb Party de Cola)
export const WORD_CHAIN_PROMPTS = [
  { topic: 'Atracciones o montañas rusas del parque', example: 'Shambhala, Dragon Khan, Stampida...' },
  { topic: 'Cosas que te encuentras en una zona acuática', example: 'Chubasquero, olas, flotador, splash...' },
  { topic: 'Comidas y snacks típicos de PortAventura', example: 'Churros, perrito caliente, helado, pizza...' },
  { topic: 'Personajes de SésamoAventura y mascotas', example: 'Woody, Elmo, Triki Monstruo Galletas, Epi...' },
  { topic: 'Objetos del Salvaje Oeste (Far West)', example: 'Herradura, sombrero, revólver, carreta...' },
  { topic: 'Elementos de la China Imperial', example: 'Muralla, dragón, farolillo, té, pagoda...' },
  { topic: 'Sensaciones en una montaña rusa', example: 'Airtime, adrenalina, vértigo, aceleración...' },
];

// 4. Adivina el Precio / Dato Curioso Numérico
export interface GuessNumberItem {
  id: string;
  title: string;
  targetNumber: number;
  unit: string;
  tolerance: number;
  funFact: string;
}

export const GUESS_NUMBER_ITEMS: GuessNumberItem[] = [
  {
    id: 'gn1',
    title: '¿Cuántas toneladas de madera se usaron para construir Stampida?',
    targetNumber: 1300,
    unit: 'toneladas',
    tolerance: 300,
    funFact: '¡Más de 1.300 toneladas de madera de pino amarillo traído de Estados Unidos!',
  },
  {
    id: 'gn2',
    title: '¿En qué año se inauguró Shambhala en PortAventura?',
    targetNumber: 2012,
    unit: 'año',
    tolerance: 1,
    funFact: 'Abrió sus puertas en mayo de 2012 convirtiéndose en la montaña rusa más alta de Europa.',
  },
  {
    id: 'gn3',
    title: '¿Cuántos metros de longitud tiene el recorrido de Dragon Khan?',
    targetNumber: 1269,
    unit: 'metros',
    tolerance: 150,
    funFact: 'Mide exactamente 1.269 metros de vía con 8 inversiones de acero.',
  },
  {
    id: 'gn4',
    title: '¿Cuántos kilómetros por hora alcanza el lanzamiento de Furius Baco?',
    targetNumber: 135,
    unit: 'km/h',
    tolerance: 10,
    funFact: 'Acelera de 0 a 135 km/h en solo 3 segundos sobre el lago de Mediterrània.',
  },
  {
    id: 'gn5',
    title: '¿A cuántos grados de inclinación cae Shambhala en su primera bajada?',
    targetNumber: 77,
    unit: 'grados',
    tolerance: 5,
    funFact: '¡Una caída casi vertical de 77 grados de pura adrenalina y sensación de gravedad cero!',
  },
  {
    id: 'gn6',
    title: '¿Cuántos metros mide la torre de Red Force en Ferrari Land?',
    targetNumber: 112,
    unit: 'metros',
    tolerance: 8,
    funFact: '112 metros de altura máxima, siendo el Top Hat más alto de toda Europa.',
  },
];

// 5. El Detector de Mentiras de PortAventura (2 Verdades y 1 Mentira)
export interface TruthOrLieSet {
  id: string;
  statements: { text: string; isLie: boolean; explanation: string }[];
}

export const TRUTH_OR_LIE_SETS: TruthOrLieSet[] = [
  {
    id: 'tol1',
    statements: [
      { text: 'Shambhala cruza por debajo de una de las vías de Dragon Khan.', isLie: false, explanation: 'Verdad: Se cruzan hasta 4 veces de manera espectacular.' },
      { text: 'Furius Baco fue la primera Wing Coaster del mundo diseñada por Intamin.', isLie: false, explanation: 'Verdad: Fue inaugurada por Valentino Rossi en 2007.' },
      { text: 'Dragon Khan tiene 10 inversiones en su recorrido.', isLie: true, explanation: '¡Mentira! Tiene exactamente 8 inversiones, nunca 10.' },
    ],
  },
  {
    id: 'tol2',
    statements: [
      { text: 'Hurakan Condor tiene góndolas donde los pasajeros caen de pie.', isLie: false, explanation: 'Verdad: Cuenta con góndolas sentadas e inclinadas de pie.' },
      { text: 'Tutuki Splash se inauguró en el año 2015 como novedad de Polynesia.', isLie: true, explanation: '¡Mentira! Tutuki Splash está en el parque desde su inauguración en 1995.' },
      { text: 'En SésamoAventura hay una montaña rusa llamada Tami-Tami.', isLie: false, explanation: 'Verdad: Es la montaña rusa familiar junior de SésamoAventura.' },
    ],
  },
  {
    id: 'tol3',
    statements: [
      { text: 'Red Force en Ferrari Land acelera a 180 km/h en solo 3,5 segundos.', isLie: false, explanation: 'Verdad: Es la propulsión más rápida y alta de Europa.' },
      { text: 'Uncharted en Far West tiene una caída lateral y tramos hacia atrás.', isLie: false, explanation: 'Verdad: Es una montaña rusa multidimensional con efectos especiales.' },
      { text: 'PortAventura se encuentra ubicado en el centro de la ciudad de Barcelona.', isLie: true, explanation: '¡Mentira! Está ubicado en Salou y Vila-seca (Tarragona, Costa Daurada).' },
    ],
  },
  {
    id: 'tol4',
    statements: [
      { text: 'El Templo del Fuego utiliza fuego y efectos pirotécnicos reales.', isLie: false, explanation: 'Verdad: Es un show de fuego real dentro de una pirámide maya.' },
      { text: 'Stampida tiene trenes de madera bautizados como Tren Verde y Tren Amarillo.', isLie: true, explanation: '¡Mentira! Los dos trenes rivales son el Tren Rojo y el Tren Azul.' },
      { text: 'Angkor es una atracción acuática inspirada en los templos de Camboya.', isLie: false, explanation: 'Verdad: Recrea las ruinas del místico templo de Angkor Wat.' },
    ],
  },
];

// 6. Tres en Raya de PortAventura (X vs O)
// 7. Test de Personalidad Rápido de Cola: "¿Qué Montaña Rusa Eres Hoy?"
export interface CoasterPersonalityResult {
  coasterName: string;
  badge: string;
  icon: string;
  description: string;
  recommendedZone: string;
}

export const COASTER_PERSONALITIES: Record<string, CoasterPersonalityResult> = {
  shambhala: {
    coasterName: 'Shambhala',
    badge: 'Espíritu de las Alturas',
    icon: '🏔️',
    description: 'Amas la libertad, las vistas panorámicas y la sensación de volar sin límites.',
    recommendedZone: 'China Imperial',
  },
  dragonKhan: {
    coasterName: 'Dragon Khan',
    badge: 'Leyenda Indomable',
    icon: '🐉',
    description: 'No temes a nada ni a nadie: los giros y emociones fuertes son tu hábitat natural.',
    recommendedZone: 'China Imperial',
  },
  redForce: {
    coasterName: 'Red Force',
    badge: 'Bala de Competición',
    icon: '🏎️',
    description: 'Vives a 180 km/h: te gusta la máxima adrenalina en el menor tiempo posible.',
    recommendedZone: 'Ferrari Land',
  },
  tutuki: {
    coasterName: 'Tutuki Splash',
    badge: 'Alma Fiestera y Tropical',
    icon: '🌊',
    description: 'Disfrutas del buen rollo, mojarte con amigos y reírte a carcajadas con el grupo.',
    recommendedZone: 'Polynesia',
  },
  uncharted: {
    coasterName: 'Uncharted',
    badge: 'Cazador de Tesoros',
    icon: '🧭',
    description: 'Curioso, estratégico y apasionado por las historias inmersivas y misterios.',
    recommendedZone: 'Far West',
  },
};

// 8. Siluetas & Pistas Rápidas de Atracciones
export interface CoasterRiddle {
  id: string;
  clues: string[];
  answer: string;
  area: string;
  icon: string;
}

export const COASTER_RIDDLES: CoasterRiddle[] = [
  {
    id: 'cr1',
    clues: [
      'Mi color principal es el rojo vivo con soportes azules y blancos.',
      'Tengo 8 loopings impresionantes que cruzan el horizonte.',
      'Fui inaugurado junto con el parque en 1995.',
    ],
    answer: 'Dragon Khan',
    area: 'China',
    icon: '🐉',
  },
  {
    id: 'cr2',
    clues: [
      'Vuelo a ras de suelo entre campos de vides y viñedos.',
      'Un mono travieso enciende un motor hidráulico descomunal.',
      'Acelero de 0 a 135 km/h en solo 3 segundos.',
    ],
    answer: 'Furius Baco',
    area: 'Mediterrània',
    icon: '🍇',
  },
  {
    id: 'cr3',
    clues: [
      'Mido 100 metros de altura con vistas a toda la Costa Daurada.',
      'Te ofrezco una caída libre de 86 metros a 115 km/h.',
      'Tengo góndolas sentadas y de pie en una pirámide maya.',
    ],
    answer: 'Hurakan Condor',
    area: 'México',
    icon: '🗿',
  },
  {
    id: 'cr4',
    clues: [
      'Mis vías son de madera y dos trenes (Rojo y Azul) compiten en paralelo.',
      'El sonido de mis vigas de pino es inconfundible en Penitence.',
      'Mi trazado se cruza con la montaña rusa infantil Tomahawk.',
    ],
    answer: 'Stampida',
    area: 'Far West',
    icon: '🤠',
  },
  {
    id: 'cr5',
    clues: [
      'Te subes a barcas redondas que giran por un río salvaje del oeste.',
      'Piedras, remolinos y cascadas aseguran salpicaduras refrescantes.',
      'Los espectadores desde los puentes pueden mojarte con cañones.',
    ],
    answer: 'Grand Canyon Rapids',
    area: 'Far West',
    icon: '🌊',
  },
];

// 9. Duelo de Reacción Rápida para 2 Jugadores (Tap de Pantalla Dividida)
// 10. Piedra, Papel, Tijera, Montaña Rusa (Rock, Paper, Coaster!)
