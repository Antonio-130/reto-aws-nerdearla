# 🎹 Piano Virtual - Reto AWS NerdearLA

Aplicación de piano virtual desarrollada con React y Tailwind CSS como parte del reto de AWS para NerdearLA. Permite tocar un piano interactivo, grabar secuencias musicales y reproducirlas.

## 🚀 Características

- **Piano interactivo**: 12 teclas (una octava completa) con sonidos generados por Web Audio API
- **Atajos de teclado**: Toca usando el teclado de tu computadora
- **Grabación**: Captura y guarda tus composiciones con timestamps precisos
- **Almacenamiento local**: Las grabaciones se guardan automáticamente en localStorage
- **Reproducción**: Reproduce tus grabaciones respetando los tiempos originales
- **Interfaz moderna**: Diseño responsive con Tailwind CSS

## 🎵 Controles

### Teclado del Piano
- **Teclas blancas**: A, S, D, F, G, H, J (C4 a B4)
- **Teclas negras**: W, E, T, Y, U (sostenidos)
- **ESPACIO**: Iniciar/detener grabación

### Mapeo de Notas
```
Piano: C4  C#4 D4  D#4 E4  F4  F#4 G4  G#4 A4  A#4 B4
Tecla: A   W   S   E   D   F   T   G   Y   H   U   J
```

## 🛠️ Tecnologías

- **React 19** con hooks (useReducer, useEffect, useRef)
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **Web Audio API** para generación de sonidos
- **localStorage** para persistencia de datos

## 📦 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos
1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd reto-aws-nerdearla
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

### Scripts disponibles
- `npm run dev` - Ejecuta en modo desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🏗️ Arquitectura

### Estructura del proyecto
```
src/
├── Piano.jsx          # Componente principal del piano
├── App.jsx           # Componente raíz
├── main.jsx          # Punto de entrada
└── index.css         # Estilos de Tailwind
```

### Gestión de Estado
Utiliza `useReducer` para manejar el estado de la aplicación:
- **recording**: Estado de grabación activa
- **currentRecording**: Notas de la grabación actual
- **savedRecordings**: Grabaciones guardadas
- **activeKeys**: Teclas actualmente presionadas

### Funcionalidades Técnicas
- **Síntesis de audio**: Osciladores sinusoidales con envelope de ganancia
- **Grabación temporal**: Captura timestamps relativos para reproducción precisa
- **Persistencia**: Serialización JSON en localStorage
- **Prevención de repetición**: Control de teclas activas para evitar spam

## 🎯 Reto AWS NerdearLA

Este proyecto fue desarrollado como parte del reto de AWS para demostrar:
- Desarrollo frontend moderno con React
- Gestión eficiente del estado con hooks
- Integración de APIs web nativas
- Diseño responsive y accesible
- Arquitectura escalable y mantenible

## 🤝 Contribución

Este es un proyecto de demostración para el reto AWS NerdearLA. Las mejoras y sugerencias son bienvenidas.

## 📄 Licencia

MIT License - Proyecto educativo para NerdearLA AWS Challenge.