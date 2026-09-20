# 🌻 Regala Flores Amarillas & Feliz Día de la Primavera

Una experiencia web interactiva, estética y romántica creada para celebrar el **Día de la Primavera** y la tradición de regalar **Flores Amarillas** (21 de Septiembre), con el ramo temático y banda sonora de *Los Juegos del Hambre*.

---

## 🌐 Enlaces en Vivo (Vercel)

- 🌻 **Web Pública (Regala Flores Amarillas - Rama `main`)**:  
  👉 **[https://regala-flores-amarillas.vercel.app](https://regala-flores-amarillas.vercel.app)**  
  *(Permite personalizar el nombre de quien recibe las flores y compartir el enlace directo por WhatsApp)*

- 💛 **Edición Especial Personalizada (Rama `personal`)**:  
  👉 **[https://cristtel-con-amor-flores-amarillas.vercel.app](https://cristtel-con-amor-flores-amarillas.vercel.app)**  
  *(Incluye el Scrapbook Polaroid 3D con poema y la Carta Secreta con sello de cera vintage)*

---

## ✨ Características de esta Versión (`main`)

- 🌻 **Ramo Floral Interactivo de Los Juegos del Hambre**:
  - **Fase 1 (Distrito 12 & Peeta)**: Dientes de león dorados resplandecientes, prímulas tiernas silvestres y espigas doradas de cebada.
  - **Fase 2 (En Llamas - Catching Fire)**: Helechos frondosos del Vasallaje de los 25, orquídeas tropicales y la rosa silvestre con pétalos aterciopelados.
  - **Fase 3 (Balada de Pájaros Cantores & Rue)**: Flores amarillas de ruda con una mariquita detallada (símbolo de ternura y lealtad) y margaritas silvestres del lago de los Covey.
- 🎶 **Banda Sonora Sintetizada (Web Audio API)**:
  - *Rue's Lullaby* (Nana de Rue) en modo campanas celestes.
  - *The Hanging Tree* (El Árbol del Ahorcado) en modo arpa folk.
  - *Horn of Plenty* (Himno de Panem) en modo himno épico.
  - Reproductor vinilo retro flotante con cambio de color según la película activa y reproducción automática sincronizada al regar/florecer.
- 🌸 **Lluvia Interactiva de Pétalos**: Pétalos dorados flotando con física y respuesta suave al cursor y al tacto en pantallas móviles.
- 🔗 **Personalizador de Enlaces & Compartir por WhatsApp**:
  - Modal para ingresar el nombre de la persona especial (`?to=Nombre`).
  - Genera automáticamente el mensaje y enlace para enviar por WhatsApp o copiar al portapapeles.
- 📱 **Diseño 100% Responsivo**: Optimizado para dispositivos móviles y escritorio con animaciones fluidas a 60 FPS.

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## 🌿 Ramas del Proyecto

| Rama | Descripción | Despliegue en Vercel |
|---|---|---|
| `main` | Versión pública con generador de enlaces para que cualquiera pueda regalar flores amarillas personalizadas | [regala-flores-amarillas.vercel.app](https://regala-flores-amarillas.vercel.app) |
| `personal` | Edición romántica exclusiva con Polaroids 3D, poema parafraseado y carta con sello de cera | [cristtel-con-amor-flores-amarillas.vercel.app](https://cristtel-con-amor-flores-amarillas.vercel.app) |

---

## 🛠️ Tecnologías

- **React 18** + **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **Canvas Confetti**
- **Web Audio API** (música ambiental y campanas sin archivos externos pesados)
- **Vercel** para despliegue global ultra-rápido
