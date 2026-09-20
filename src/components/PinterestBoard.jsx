import React, { useState } from 'react';
import { Sparkles, Heart, RotateCcw, Bookmark, Pin, Sun, Music2 } from 'lucide-react';
import { playFlipSound } from '../utils/audioChimes';

export default function PinterestBoard({ recipientName }) {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    playFlipSound();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const cards = [
    {
      id: 1,
      tapeColor: 'washi-tape',
      rotation: '-rotate-2',
      category: 'Significado',
      front: {
        title: '¿Por qué flores amarillas hoy?',
        subtitle: '21 de Septiembre · Tradición',
        icon: Sun,
        illustration: (
          <div className="w-full h-40 rounded-lg bg-gradient-to-b from-amber-100 to-sunflower-100 flex items-center justify-center relative overflow-hidden">
            <div className="text-6xl animate-bounce">🌻</div>
            <div className="absolute inset-0 bg-gradient-to-t from-sunflower-200/50 to-transparent" />
          </div>
        ),
        hint: 'Toca para descubrir el significado ✨',
      },
      back: {
        title: 'El Simbolismo Dorado',
        content: 'Regalar flores amarillas el 21 de septiembre simboliza amor incondicional, alegría compartida, lealtad y la promesa de permanecer juntos. Es decirle a esa chica que su presencia llena la vida de calidez, como el primer rayo de sol primaveral.',
        note: 'Para ti, hoy y siempre 💛',
      },
    },
    {
      id: 2,
      tapeColor: 'washi-tape-pink',
      rotation: 'rotate-1',
      category: 'Razones',
      front: {
        title: 'Razones para darte flores',
        subtitle: 'Para ' + recipientName,
        icon: Heart,
        illustration: (
          <div className="w-full h-40 rounded-lg bg-gradient-to-tr from-pink-100 via-yellow-50 to-amber-100 flex flex-col items-center justify-center p-3 text-center">
            <span className="text-4xl mb-1">🌼✨</span>
            <span className="font-handwriting text-lg text-stone-700">
              "Porque mereces que alguien haga realidad tus ilusiones"
            </span>
          </div>
        ),
        hint: 'Gira para leer las 3 razones 💌',
      },
      back: {
        title: '3 Razones Especiales',
        content: (
          <ul className="text-left text-xs sm:text-sm space-y-2 text-stone-700 font-sans">
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">1.</span>
              <span>Por tu sonrisa que hace que cualquier día pesado se vuelva ligero.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">2.</span>
              <span>Por la bondad y ternura con la que tratas a los demás.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-500 font-bold">3.</span>
              <span>Porque la vida es más bonita cuando estás cerca.</span>
            </li>
          </ul>
        ),
        note: '¡Y faltan infinitas más!',
      },
    },
    {
      id: 3,
      tapeColor: 'washi-tape-sage',
      rotation: '-rotate-1',
      category: 'Música & Nostalgia',
      front: {
        title: 'Floricienta & Recuerdos',
        subtitle: 'Un clásico de septiembre',
        icon: Music2,
        illustration: (
          <div className="w-full h-40 rounded-lg bg-gradient-to-b from-amber-50 to-yellow-100 flex flex-col items-center justify-center relative p-3">
            <div className="w-16 h-16 rounded-full bg-stone-900 border-4 border-amber-400 flex items-center justify-center shadow-md animate-spin-slow">
              <div className="w-5 h-5 rounded-full bg-amber-400" />
            </div>
            <span className="font-handwriting text-base text-amber-900 mt-2">
              "Él la estaba esperando con una flor amarilla..."
            </span>
          </div>
        ),
        hint: 'Toca para leer la estrofa 🎶',
      },
      back: {
        title: 'La Promesa Cumplida',
        content: '"Ella lo estaba soñando con la luz en su pupila, y el amarillo del sol iluminaba la esquina... No te apures, no detengas el instante del encuentro, está dicho que es un hecho, no la pierdas, no hay derecho."',
        note: 'Que nunca se apague tu magia de niña 🌻',
      },
    },
    {
      id: 4,
      tapeColor: 'washi-tape',
      rotation: 'rotate-2',
      category: 'Deseo Primaveral',
      front: {
        title: 'Un Deseo de Primavera',
        subtitle: 'Para este nuevo ciclo',
        icon: Sparkles,
        illustration: (
          <div className="w-full h-40 rounded-lg bg-gradient-to-br from-yellow-100 to-green-100 flex items-center justify-center">
            <span className="text-5xl">🌿🌷🌞</span>
          </div>
        ),
        hint: 'Toca para abrir el deseo 🌟',
      },
      back: {
        title: 'Florecer con Fuerza',
        content: 'Que esta primavera te traiga risas que te duelan la panza, metas cumplidas, tranquilidad en el corazón y personas que sepan cuidar tu luz tan bonita. Recuerda siempre lo valiosa e importante que eres.',
        note: 'Florece alto, como los girasoles 🌻',
      },
    },
    {
      id: 5,
      tapeColor: 'washi-tape-pink',
      rotation: '-rotate-2',
      category: 'Cumplido',
      front: {
        title: 'Un Secreto para Ti',
        subtitle: 'Solo para tus ojos',
        icon: Bookmark,
        illustration: (
          <div className="w-full h-40 rounded-lg bg-amber-50/80 border border-amber-200/60 flex flex-col items-center justify-center p-3 text-center">
            <span className="text-4xl mb-1">🤫💌</span>
            <span className="font-serif italic text-sm text-stone-600">
              "Hay algo que siempre quise decirte..."
            </span>
          </div>
        ),
        hint: 'Gira para revelarlo 💛',
      },
      back: {
        title: 'La Verdad:',
        content: 'Si todas las flores del campo compitieran por ser la más radiante, todas se rendirían al verte sonreír. Tienes esa luz natural que alegra cualquier lugar a donde vas.',
        note: 'Nunca dejes de sonreír así ✨',
      },
    },
    {
      id: 6,
      tapeColor: 'washi-tape-sage',
      rotation: 'rotate-1',
      category: 'Cita Poética',
      front: {
        title: 'Poema en el Viento',
        subtitle: 'Pablo Neruda',
        icon: Pin,
        illustration: (
          <div className="w-full h-40 rounded-lg bg-gradient-to-t from-yellow-200/40 via-amber-50 to-amber-100/50 flex flex-col items-center justify-center p-4 text-center">
            <span className="font-serif text-lg text-amber-950 italic">
              "Podrán cortar todas las flores, pero no podrán detener la primavera."
            </span>
          </div>
        ),
        hint: 'Toca para reflexionar 🍃',
      },
      back: {
        title: 'Siempre Floreces',
        content: 'No importa qué tormenta o día difícil hayas pasado, siempre encuentras la forma de florecer con más belleza y gracia. Esa fuerza y dulzura tuya son admirables.',
        note: 'Feliz 21 de septiembre 🌼',
      },
    },
  ];

  return (
    <section id="moodboard" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunflower-100 text-sunflower-900 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Moodboard Estilo Pinterest</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 font-semibold">
          Muro de Recuerdos & Flores Amarillas
        </h2>
        <p className="text-stone-600 font-handwriting text-xl sm:text-2xl mt-1">
          Toca cada tarjeta Polaroid para voltearla y descubrir su mensaje secreto
        </p>
      </div>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {cards.map((card) => {
          const isFlipped = !!flippedCards[card.id];
          const IconComp = card.front.icon;

          return (
            <div
              key={card.id}
              className={`relative perspective-1000 transition-all duration-300 hover:z-20 ${card.rotation}`}
            >
              {/* Top Washi Tape Deco */}
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 ${card.tapeColor} rounded-sm z-20 shadow-sm pointer-events-none`}
              />

              {/* Card Inner with 3D Flip */}
              <div
                onClick={() => toggleFlip(card.id)}
                className={`relative w-full min-h-[380px] bg-white p-4 pb-6 rounded-md shadow-polaroid hover:shadow-polaroid-hover transition-all duration-500 cursor-pointer transform-style-3d select-none border border-stone-100 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* FRONT FACE */}
                <div className="backface-hidden flex flex-col justify-between h-full">
                  <div>
                    {/* Illustration / Picture */}
                    {card.front.illustration}

                    {/* Category tag */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[11px] font-sans tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
                        {card.category}
                      </span>
                      <IconComp className="w-4 h-4 text-amber-600" />
                    </div>

                    {/* Titles */}
                    <h3 className="font-serif text-xl text-stone-800 font-bold mt-2">
                      {card.front.title}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans mt-0.5">
                      {card.front.subtitle}
                    </p>
                  </div>

                  {/* Bottom Hint */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium">
                    <span>{card.front.hint}</span>
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 p-6 backface-hidden rotate-y-180 bg-[#FFFDF9] rounded-md border-2 border-dashed border-amber-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2 mb-3">
                      <h4 className="font-serif text-lg font-bold text-amber-900">
                        {card.back.title}
                      </h4>
                      <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>

                    {typeof card.back.content === 'string' ? (
                      <p className="font-serif text-stone-700 text-sm sm:text-base leading-relaxed">
                        {card.back.content}
                      </p>
                    ) : (
                      card.back.content
                    )}
                  </div>

                  <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                    <span className="font-handwriting text-lg text-amber-800 font-bold">
                      {card.back.note}
                    </span>
                    <span className="text-[10px] uppercase text-stone-400 font-sans flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Voltear
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
