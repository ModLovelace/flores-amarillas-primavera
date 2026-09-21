# 🌻 Regala Flores Amarillas & Feliz Día de la Primavera

> 🌐 **Sitio Web en Vivo:** [https://regala-flores-amarillas.vercel.app](https://regala-flores-amarillas.vercel.app)

Una experiencia web interactiva, estética y romántica creada para celebrar el **Día de la Primavera** y la hermosa tradición de regalar **Flores Amarillas** (21 de Septiembre). Diseñada como una aplicación web universal donde cualquier persona puede personalizar un ramo virtual, disfrutar de dulces melodías acústicas, leer una carta secreta sellada en cera y presumir sus flores en redes sociales (TikTok e Instagram).

---

## 🌐 Demostración en Vivo (Vercel)

👉 **[https://regala-flores-amarillas.vercel.app](https://regala-flores-amarillas.vercel.app)**

* Permite personalizar el nombre del destinatario, remitente y el mensaje de la carta secreta mediante el personalizador de enlaces o parámetros en la URL (`?to=Nombre&from=TuNombre&msg=...`).
* 100% responsivo y optimizado para compartir directamente por **WhatsApp**, **Instagram** o **TikTok**.

---

## ✨ Características Principales

- 🌻 **Ramo Floral Interactivo de Primavera (4 Etapas de Floración)**:
  - **Fase 1 (Primeros Brotes & Margaritas)**: Dientes de león dorados resplandecientes, tiernas margaritas acariciadas por el sol y espigas doradas.
  - **Fase 2 (Girasoles & Rosas Silvestres)**: Girasoles radiantes, rosas doradas aterciopeladas y hojas verdes frescas en floración.
  - **Fase 3 (Jardín de Amor & Follaje)**: Flores silvestres doradas, helechos esmeralda y mariquita de la buena suerte.
  - **Fase 4 (Eterna Primavera Radiante)**: Floración plena con mariposas doradas revoloteando, aura solar brillante y semillas de diente de león al viento.
- 🎶 **Banda Sonora Dinámica Sintetizada (Web Audio API)**:
  - *Flores Amarillas (Vals de Primavera)* en campanas y celesta suave.
  - *Arpegio de los Girasoles* en arpa y acordes cálidos.
  - *Sonrisa de Primavera* en guitarra acústica y brisa primaveral.
  - *El Florecer de la Esperanza* con armonías triunfales de alegría y luz.
  - Reproductor vinilo retro flotante con animación de giro y sincronización automática según la etapa de floración.
- 📸 **✨ Presumir en Redes (TikTok & Instagram)**:
  - **📱 Historia / TikTok (9:16 Pantalla Completa)**: Optimizado con zonas seguras (safe margins) para que ni la interfaz de TikTok ni la de Instagram Stories tapen el ramo ni el texto. Incluye etiqueta de audio oficial (`🎵 Floricienta · Flores Amarillas`) y hashtags virales (`#FloresAmarillas #21DeSeptiembre`).
  - **🖼️ Post / Feed (1:1 Cuadrado Clásico)**: Formato ideal para publicaciones fijas en muro o carruseles.
  - **Estilos Visuales Seleccionables**: 🌻 *Sol Primavera*, 🌙 *TikTok Aesthetic* (modo oscuro con flores luminiscentes) y 🌸 *Romance*.
  - **Compartir Nativo**: Web Share API en celulares para enviar directamente a historias o feeds, además de descarga en HD (PNG) y copiado rápido al portapapeles (`Ctrl+V`).
- 💌 **Carta Secreta con Sello de Cera Vintage**:
  - Sobre interactivo con sello de cera dorado que se abre al hacer clic, revelando una dedicatoria romántica con tipografía manuscrita.
- 🌸 **Lluvia de Pétalos Flotantes en Canvas**:
  - Pétalos dorados y amarillos que caen suavemente con física interactiva reactiva al movimiento del cursor o al deslizar en móviles.
- 🔗 **Personalizador de Enlaces & Compartir por WhatsApp**:
  - Modal intuitivo para ingresar nombres y dedicatoria personalizada, generando un enlace listo para copiar o enviar con un clic por WhatsApp.

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/ModLovelace/flores-amarillas-primavera.git
cd flores-amarillas-primavera

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 🛠️ Tecnologías Utilizadas

- **React 18** + **Vite**
- **Tailwind CSS** (animaciones personalizadas de pétalos, resplandores y floración)
- **html-to-image** (renderizado de tarjetas HD 9:16 y 1:1 en el navegador del usuario)
- **Web Audio API** (síntesis de sonido acústico ambiental en tiempo real, 100% libre de copyright y sin dependencias de archivos de audio pesados)
- **Lucide React** (iconografía vectorial)
- **Canvas Confetti**
- **Vercel** (despliegue global en el edge con cero configuración)

---

## 💛 Licencia

Código libre y abierto para que puedas compartir flores amarillas virtuales con tus seres queridos cada 21 de septiembre. ¡Feliz Día de la Primavera! 🌻✨
