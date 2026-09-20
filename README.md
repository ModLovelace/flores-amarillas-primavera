# 🌻 Feliz Día de la Primavera & Flores Amarillas (Estilo Pinterest)

Una landing page interactiva, responsiva y estética inspirada en **Pinterest**, creada especialmente para celebrar el **Día de la Primavera** y la tradición romántica del **Día de las Flores Amarillas** (21 de Septiembre).

---

## ✨ Características Principales

- 🌸 **Lluvia Interactiva de Pétalos**: Pétalos de girasoles y margaritas amarillas flotando suavemente en la pantalla con respuesta física al movimiento del mouse y al tacto en pantallas móviles.
- 🌻 **Ramo de Flores Amarillas Interactivo**: Ilustración floral de girasoles y rosas con botón interactivo *"¡Hacer florecer este ramo!"*, confeti dorado y sonidos sintetizados (Web Audio API).
- 💌 **Carta Secreta con Sello de Cera**: Sobre vintage interactivo con sello dorado que al hacer clic se abre revelando una carta romántica personalizada.
- 📌 **Moodboard Estilo Pinterest**: Cuadrícula de tarjetas Polaroid con cinta adhesiva washi tape, alfileres dorados y efecto 3D flip card al tocarlas para leer secretos y razones especiales.
- 🎶 **Mini Reproductor Vinilo Retro**: Reproductor flotante con animación de disco de vinilo giratorio y melodía romántica acústica ambiental.
- 🔗 **Personalizador de Enlaces & WhatsApp**: Generador de enlaces dinámicos con parámetros URL (`?to=Nombre&from=TuNombre&msg=...`) para que el usuario pueda enviárselo directamente por WhatsApp con el nombre de la chica ya integrado.
- ⚡ **Optimizado para Vercel**: Proyecto Vite + React + Tailwind CSS ultra-rápido, responsivo (mobile-first) y sin dependencias pesadas de servidor.

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Instalar dependencias (ya instaladas)
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## ☁️ Cómo Desplegar en Vercel

Tienes dos formas súper sencillas:

### Opción 1: Con la CLI de Vercel (1 comando)

Ejecuta en tu terminal:
```bash
npx vercel
```
- Te pedirá iniciar sesión o confirmar tu cuenta de Vercel.
- Responde `y` para vincularlo a tu proyecto o crear uno nuevo.
- Selecciona la configuración por defecto (ya viene con `vercel.json` configurado).
- En pocos segundos tendrás tu URL pública (ejemplo: `https://flores-amarillas-xxx.vercel.app`).

Para publicar a producción:
```bash
npx vercel --prod
```

### Opción 2: Con GitHub / GitLab

1. Inicializa git y sube tu repositorio:
   ```bash
   git init
   git add .
   git commit -m "feat: landing flores amarillas pinterest"
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```
2. En [vercel.com](https://vercel.com), haz clic en **"Add New Project"**, selecciona el repositorio y presiona **"Deploy"**.
Vercel detectará automáticamente que es un proyecto Vite y lo desplegará al instante.
