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
