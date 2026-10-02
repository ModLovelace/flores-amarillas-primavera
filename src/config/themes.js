/**
 * Configuración central de Temas y Ocasiones (Inspiración Pinterest & Marketing Viral)
 * Soporta:
 * 1. Flores Amarillas & Primavera (Tradición del 21 de Septiembre)
 * 2. Feliz Cumpleaños (Pastel aesthetic, velas mágicas y confeti)
 * 3. Logro Profesional & Nuevo Comienzo (Graduación, ascenso, éxito y triunfo)
 * 4. Aniversario, Amor & Amistad (Rosas rojas/rosadas, complicidad y recuerdos)
 */

export const THEMES = {
  'flores-amarillas': {
    id: 'flores-amarillas',
    name: 'Flores Amarillas & Primavera',
    shortName: 'Flores Amarillas',
    emoji: '🌻',
    tagline: 'Tradición del 21 de Septiembre · Luz y Cariño',
    categoryBadge: '🌻 Tradición de Primavera',
    primaryColor: 'amber',
    badgeText: '21 de Septiembre · Día de las Flores Amarillas',
    badgeIcon: '🌻',
    headlinePrefix: 'Que nunca te falten tus',
    headlineHighlight: 'flores amarillas',
    headlineSuffix: '',
    subtitle: 'Porque la primavera no empieza en el calendario, empieza cuando personas tan maravillosas como tú iluminan los días con su sonrisa.',
    defaultTo: 'Mi Persona Favorita',
    defaultFrom: 'Alguien que te adora',
    defaultDate: '21 de Septiembre',
    defaultMessage: 'En este 21 de septiembre, quería recordarte lo especial que eres. Que nunca te falten motivos para sonreír, ni flores amarillas en tu vida. Eres la luz y la primavera más bonita de mis días.',
    palette: {
      bgGradient: 'bg-gradient-to-b from-amber-50/80 via-cream-100 to-amber-100/50',
      heroTagBg: 'bg-sunflower-100/90 border-sunflower-300 text-sunflower-900',
      accentColor: 'text-amber-600',
      accentBg: 'bg-amber-500',
      buttonBg: 'bg-sunflower-400 hover:bg-sunflower-500 text-stone-900',
      buttonGradient: 'bg-gradient-to-r from-sunflower-400 via-amber-400 to-sunflower-500 text-stone-900',
      shadowColor: 'shadow-sunflower-400/40',
      activeTab: 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-300/50',
      inactiveTab: 'bg-white/80 hover:bg-amber-50 text-stone-700 border border-amber-200',
      waxSealColor: '#EAB308',
      particleType: 'petals',
      particleColors: ['#FDE047', '#FACC15', '#FEF08A', '#EAB308', '#FFFBEB', '#FBBF24']
    },
    actionButton: '¡Regar & Hacer Florecer! 🌻',
    actionSubtext: 'Toca para regar: las flores brotarán y sonará el vals primaveral',
    counterText: (count, name) => `🌻 Has hecho florecer este hermoso ramo ${count} ${count === 1 ? 'vez' : 'veces'} para ${name} 💛`,
    stageNames: [
      { name: 'Primeros Brotes & Margaritas', desc: 'Dientes de león dorados y tiernas margaritas acariciadas por el sol' },
      { name: 'Girasoles & Rosas Silvestres', desc: 'Girasoles radiantes, rosas doradas aterciopeladas y hojas en flor' },
      { name: 'Jardín de Amor & Follaje', desc: 'Flores silvestres doradas, mariquitas de la suerte y follaje esmeralda' },
      { name: 'Eterna Primavera Radiante', desc: 'Floración total con mariposas doradas, brillo solar y pétalos al viento' }
    ],
    quotes: [
      {
        stage: 1,
        tag: '21 de Septiembre · El Despertar del Sol',
        quote: '“Dicen que regalar flores amarillas el 21 de septiembre es prometer luz, alegría y desearle a quien las recibe que nunca le falte un motivo para sonreír.”',
        author: '— Tradición de Primavera'
      },
      {
        stage: 2,
        tag: 'Flores Amarillas · Promesa de Amor',
        quote: '“Ella sabía que él sabía, que algún día pasaría, que vendría a buscarla con sus flores amarillas... porque el cariño verdadero siempre encuentra el camino para florecer.”',
        author: '— Himno de las Flores Amarillas'
      },
      {
        stage: 3,
        tag: 'Jardín de Primavera · Esperanza y Vida',
        quote: '“El amarillo es el color de la luz, de la energía que renace y de la felicidad compartida. Donde florece una flor amarilla, siempre florece un nuevo comienzo lleno de dicha.”',
        author: '— Poesía Primaveral'
      },
      {
        stage: 4,
        tag: 'Plena Floración · Amor y Gratitud',
        quote: '“La primavera no empieza en una fecha del calendario; empieza cada vez que personas maravillosas llenan de color y calidez la vida de quienes las rodean.”',
        author: '— Celebración de la Primavera'
      }
    ],
    brag: {
      title: '¡Me regalaron mis flores amarillas!',
      hashtags: '#FloresAmarillas #21DeSeptiembre',
      audio: 'Floricienta · Flores Amarillas',
      quote: '"Ella sabía que él sabía, que vendría a buscarla con sus flores amarillas..."',
      centerpieceType: 'sunflower'
    },
    trackName: 'Vals de Primavera · Flores Amarillas'
  },

  'cumpleanos': {
    id: 'cumpleanos',
    name: 'Feliz Cumpleaños',
    shortName: 'Cumpleaños',
    emoji: '🎂',
    tagline: 'Celebra una Nueva Vuelta al Sol · Magia y Alegría',
    categoryBadge: '🎂 Fiesta & Deseos',
    primaryColor: 'pink',
    badgeText: '✨ ¡Feliz Cumpleaños · Día de Celebración! ✨',
    badgeIcon: '🎂',
    headlinePrefix: '¡Un año más brillando,',
    headlineHighlight: 'Feliz Cumpleaños',
    headlineSuffix: '!',
    subtitle: 'Hoy el mundo celebra tu existencia, tu luz y todas las sonrisas que contagias a quienes tenemos la suerte de tenerte en nuestra vida. ¡Pide un deseo!',
    defaultTo: 'Cumpleañera(o) Estrella',
    defaultFrom: 'Quien te quiere con el alma',
    defaultDate: 'Hoy es tu Cumpleaños',
    defaultMessage: '¡Feliz Cumpleaños! Que esta nueva vuelta al sol esté repleta de bendiciones, metas cumplidas, viajes soñados, salud y amor infinito. Gracias por iluminar nuestros días con tu chispa inigualable. ¡A celebrar en grande!',
    palette: {
      bgGradient: 'bg-gradient-to-b from-pink-50/80 via-rose-50/60 to-purple-50/40',
      heroTagBg: 'bg-pink-100/90 border-pink-300 text-pink-900',
      accentColor: 'text-pink-600',
      accentBg: 'bg-pink-500',
      buttonBg: 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white',
      buttonGradient: 'bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300 text-stone-900',
      shadowColor: 'shadow-pink-400/40',
      activeTab: 'bg-pink-500 text-white font-bold shadow-md shadow-pink-300/50',
      inactiveTab: 'bg-white/80 hover:bg-pink-50 text-stone-700 border border-pink-200',
      waxSealColor: '#EC4899',
      particleType: 'confetti',
      particleColors: ['#F472B6', '#FB7185', '#FDE047', '#A78BFA', '#FBCFE8', '#38BDF8', '#FBBF24']
    },
    actionButton: '¡Encender Velas & Pedir Deseo! 🎂✨',
    actionSubtext: 'Toca para soplar las velas: la música de cumpleaños sonará y desatará confeti mágico',
    counterText: (count, name) => `🎂 ¡Has encendido las velas y celebrado ${count} ${count === 1 ? 'deseo' : 'deseos'} para ${name}! 🎉✨`,
    stageNames: [
      { name: 'Pastel & Primeros Deseos', desc: 'Pastel aesthetic de fresas y crema con velitas esperando por tu deseo' },
      { name: 'Velas Encendidas & Chispa', desc: 'La luz de las velas brilla iluminando los sueños de este nuevo año' },
      { name: 'Lluvia de Confeti & Fiesta', desc: 'Explosión de serpentinas, globos festivos y sonrisas compartidas' },
      { name: '¡Deseo Cumplido en el Cosmos!', desc: 'Chispas mágicas de bengala, fuegos artificiales y alegría eterna' }
    ],
    quotes: [
      {
        stage: 1,
        tag: 'Una Nueva Vuelta al Sol · Inicio del Viaje',
        quote: '“Cumplir años no es sumar años a la vida, sino sumar vida, risas, historias y magia a cada uno de tus días.”',
        author: '— Deseo de Cumpleaños'
      },
      {
        stage: 2,
        tag: 'Pide un Deseo · La Magia de Creer',
        quote: '“Cierra los ojos, piensa en lo que más anhela tu corazón y sopla con fuerza. El universo siempre escucha a las almas luminosas como la tuya.”',
        author: '— Magia de las Velas'
      },
      {
        stage: 3,
        tag: 'Celebración & Alegría · Abrazo de Quienes te Aman',
        quote: '“La verdadera fiesta no son los regalos bajo la mesa, sino saber que hay personas que te celebran con todo el corazón.”',
        author: '— Gratitud y Fiesta'
      },
      {
        stage: 4,
        tag: 'El Mejor Año de tu Vida · Futuro Brillante',
        quote: '“Que este nuevo año esté lleno de puertas abiertas, abrazos sinceros, carcajadas inolvidables y sueños que se hacen realidad.”',
        author: '— Bendición de Cumpleaños'
      }
    ],
    brag: {
      title: '¡Hoy celebro mi cumpleaños! 🎂✨',
      hashtags: '#FelizCumpleaños #BirthdayVibes #UnaVueltaAlSol',
      audio: 'Happy Birthday · Sweet Acoustic Celebration',
      quote: '"Cierra los ojos, pide un deseo y prepárate para el mejor año de tu vida..."',
      centerpieceType: 'cake'
    },
    trackName: 'Cumpleaños Feliz · Sweet Celebration'
  },

  'logro-profesional': {
    id: 'logro-profesional',
    name: 'Logro Profesional & Nuevo Comienzo',
    shortName: 'Logro Profesional',
    emoji: '🎓',
    tagline: 'Graduación, Ascenso & Metas Cumplidas · Orgullo y Éxito',
    categoryBadge: '🎓 Orgullo & Éxito',
    primaryColor: 'emerald',
    badgeText: '🥂 ¡Brindis por tu Éxito y Esfuerzo! 🥂',
    badgeIcon: '🏆',
    headlinePrefix: 'Orgullo absoluto por tu',
    headlineHighlight: 'gran logro profesional',
    headlineSuffix: '',
    subtitle: 'Detrás de cada meta alcanzada hay noches de esfuerzo, pasión y constancia. Hoy el mundo reconoce tu brillantez. ¡Esto es solo el comienzo!',
    defaultTo: 'Gran Profesional & Triunfador(a)',
    defaultFrom: 'Tu mayor admirador(a)',
    defaultDate: 'Día de la Victoria',
    defaultMessage: '¡Muchísimas felicidades por este enorme logro! Tu dedicación, talento y perseverancia rinden frutos hoy. Que este éxito sea el primer escalón de una trayectoria llena de triunfos y grandes satisfacciones profesionales.',
    palette: {
      bgGradient: 'bg-gradient-to-b from-emerald-50/70 via-slate-50 to-teal-50/50',
      heroTagBg: 'bg-emerald-100/90 border-emerald-300 text-emerald-900',
      accentColor: 'text-emerald-600',
      accentBg: 'bg-emerald-500',
      buttonBg: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white',
      buttonGradient: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-300 text-stone-900',
      shadowColor: 'shadow-emerald-400/40',
      activeTab: 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-400/50',
      inactiveTab: 'bg-white/80 hover:bg-emerald-50 text-stone-700 border border-emerald-200',
      waxSealColor: '#059669',
      particleType: 'sparkles',
      particleColors: ['#10B981', '#34D399', '#FBBF24', '#6EE7B7', '#FDE68A', '#047857', '#38BDF8']
    },
    actionButton: '¡Brindar & Celebrar el Triunfo! 🥂🏆',
    actionSubtext: 'Toca para brindar: laureles dorados y una fanfarria de victoria celebrarán tu éxito',
    counterText: (count, name) => `🏆 ¡Has brindado ${count} ${count === 1 ? 'vez' : 'veces'} por el éxito y futuro brillante de ${name}! 🥂🌟`,
    stageNames: [
      { name: 'El Esfuerzo & La Semilla', desc: 'Días de estudio, constancia y disciplina que hoy dan sus primeros grandes frutos' },
      { name: 'Diploma & Laureles Dorados', desc: 'Reconocimiento a tu talento con corona de laurel y medalla al mérito' },
      { name: 'Brindis de Éxito & Champagne', desc: 'Copas en alto y brindis festivo por una meta soñada y alcanzada' },
      { name: '¡Cima Conquistada & Futuro Brillante!', desc: 'Estrellas de victoria, lluvia de destellos dorados y nuevos horizontes' }
    ],
    quotes: [
      {
        stage: 1,
        tag: 'Dedicación Constante · El Camino al Triunfo',
        quote: '“El éxito no es producto del azar, sino de la constancia de levantarse cada día dispuesto a dar lo mejor de uno mismo.”',
        author: '— Elogio al Esfuerzo'
      },
      {
        stage: 2,
        tag: 'Meta Desbloqueada · La Corona del Talento',
        quote: '“Detrás de cada diploma o ascenso hay sacrificios que nadie vio, pero un resultado que todo el mundo admira hoy.”',
        author: '— Triunfo Profesional'
      },
      {
        stage: 3,
        tag: 'Brindis por la Excelencia · Celebración Colectiva',
        quote: '“¡Levantemos las copas! Porque ver triunfar a las personas buenas, trabajadoras e inteligentes alegra el corazón.”',
        author: '— Brindis de Honor'
      },
      {
        stage: 4,
        tag: 'Nuevos Horizontes · Esto es Solo el Inicio',
        quote: '“Que este gran logro sea solo el prólogo del brillante camino que estás construyendo con tu talento y pasión.”',
        author: '— Hacia el Futuro'
      }
    ],
    brag: {
      title: '¡Meta cumplida y logro desbloqueado! 🎓🏆',
      hashtags: '#LogroProfesional #Graduación #Éxito #Orgullo',
      audio: 'Triumph & Fanfare of Victory · Celebration Anthem',
      quote: '"Detrás de cada meta alcanzada hay constancia, pasión y un futuro brillante por conquistar."',
      centerpieceType: 'trophy'
    },
    trackName: 'Fanfarria de Triunfo · Himno de Éxito'
  },

  'aniversario': {
    id: 'aniversario',
    name: 'Aniversario, Amor & Amistad',
    shortName: 'Aniversario & Amor',
    emoji: '💖',
    tagline: 'Pareja, Complicidad & Recuerdos Inolvidables',
    categoryBadge: '💖 Amor Incondicional',
    primaryColor: 'rose',
    badgeText: '💌 Feliz Aniversario & Amor Incondicional 💌',
    badgeIcon: '💖',
    headlinePrefix: 'Celebrando nuestra historia y',
    headlineHighlight: 'nuestro amor infinito',
    headlineSuffix: '',
    subtitle: 'El amor y la verdadera amistad no se miden en el tiempo, sino en las risas compartidas, los abrazos sinceros y cada recuerdo inolvidable a tu lado.',
    defaultTo: 'Mi Amor & Compañera(o) de Vida',
    defaultFrom: 'Quien te amará por siempre',
    defaultDate: 'Nuestro Aniversario',
    defaultMessage: '¡Feliz Aniversario! Gracias por cada momento, cada sonrisa cómplice y por caminar a mi lado. Contigo cada día es más bonito, más dulce y más especial. Te elijo hoy, mañana y siempre con todo mi corazón.',
    palette: {
      bgGradient: 'bg-gradient-to-b from-rose-50/80 via-red-50/40 to-amber-50/30',
      heroTagBg: 'bg-rose-100/90 border-rose-300 text-rose-900',
      accentColor: 'text-rose-600',
      accentBg: 'bg-rose-500',
      buttonBg: 'bg-gradient-to-r from-rose-500 via-pink-600 to-red-500 text-white',
      buttonGradient: 'bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 text-stone-900',
      shadowColor: 'shadow-rose-400/40',
      activeTab: 'bg-rose-500 text-white font-bold shadow-md shadow-rose-300/50',
      inactiveTab: 'bg-white/80 hover:bg-rose-50 text-stone-700 border border-rose-200',
      waxSealColor: '#E11D48',
      particleType: 'hearts',
      particleColors: ['#FB7185', '#F43F5E', '#E11D48', '#FECDD3', '#FFE4E6', '#FBBF24', '#F472B6']
    },
    actionButton: '¡Hacer Florecer Nuestro Amor! 🌹💖',
    actionSubtext: 'Toca para regar las rosas eternas: una balada romántica y corazones flotarán en el aire',
    counterText: (count, name) => `💖 Has hecho florecer este amor ${count} ${count === 1 ? 'vez' : 'veces'} para ${name} 🌹`,
    stageNames: [
      { name: 'Primeras Miradas & Chispa', desc: 'Rosas rosadas y peonías tiernas que recuerdan el día en que todo comenzó' },
      { name: 'Rosas Rojas & Promesa', desc: 'Rosas carmesí de pasión y cariño profundo con lazos de seda dorada' },
      { name: 'Jardín de Recuerdos & Risas', desc: 'Flores de amor eterno, mariposas cómplices y momentos inolvidables' },
      { name: '¡Amor Infinito & Eterna Complicidad!', desc: 'Lluvia de corazones dorados, pétalos aterciopelados y una promesa para siempre' }
    ],
    quotes: [
      {
        stage: 1,
        tag: 'El Comienzo de Todo · Miradas y Sonrisas',
        quote: '“El amor verdadero no llega con estruendo; llega como un susurro suave que transforma todos tus días en poesía.”',
        author: '— Recuerdos de Nuestro Inicio'
      },
      {
        stage: 2,
        tag: 'Caminar de la Mano · Promesas Sinceras',
        quote: '“Estar a tu lado es tener siempre un refugio, un motivo para soñar despierto y la certeza de estar en el lugar correcto.”',
        author: '— Promesa de Amor'
      },
      {
        stage: 3,
        tag: 'Complicidad & Risas · Cada Detalle Importa',
        quote: '“No es solo quererte por quien eres, sino por la persona tan feliz en la que me convierto cada vez que estoy contigo.”',
        author: '— Amor y Amistad Verdadera'
      },
      {
        stage: 4,
        tag: 'Por Muchos Años Más · Siempre Juntos',
        quote: '“Si tuviera que elegirte un millón de veces en un millón de vidas, te elegiría a ti en cada una de ellas sin dudarlo.”',
        author: '— Amor Eterno'
      }
    ],
    brag: {
      title: '¡Feliz Aniversario mi amor! 💖🌹',
      hashtags: '#FelizAniversario #AmorVerdadero #JuntosSiempre #Pareja',
      audio: 'Romantic Acoustic Melody · Sweet Love Song',
      quote: '"Si tuviera que elegirte un millón de veces, te elegiría a ti en cada una de ellas..."',
      centerpieceType: 'roses'
    },
    trackName: 'Balada de Amor · Eterna Complicidad'
  }
};

export const THEME_KEYS = Object.keys(THEMES);
export const DEFAULT_THEME_ID = 'flores-amarillas';

export function getTheme(id) {
  return THEMES[id] || THEMES[DEFAULT_THEME_ID];
}
