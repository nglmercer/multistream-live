# Multistream Live

Aplicación de escritorio para gestión de streaming en vivo multiplataforma que permite interactuar simultáneamente con TikTok, Kick y Twitch.

## Características Principales
- Gestión de chat en tiempo real de múltiples plataformas
- Sistema de automatización basado en eventos
- Overlays personalizables para streaming
- Text-to-Speech integrado
- Integración con Minecraft
- Interfaz web moderna con componentes personalizados


### 2. Arquitectura del Sistema
Basado en la estructura que veo en [1](#0-0) , el sistema usa:

- **Frontend**: Aplicación web con componentes personalizados
- **Backend**: Electron con Socket.IO para comunicación en tiempo real
- **Base de datos**: IndexedDB para almacenamiento local
- **Comunicación**: WebSockets para conexiones con plataformas de streaming

### 3. Instalación y Configuración
## Instalación

### Requisitos
- Node.js 16+
- Electron

### Pasos
1. Clonar el repositorio
2. `npm install`
3. `npm start`

### 4. Componentes Principales

#### Sistema de Navegación
El sistema de navegación [2](#0-1)  incluye:
- NavBar para navegación horizontal
- SideBar colapsible
- MainContent con sistema de slots

#### Gestión de Ventanas
El sistema de ventanas [3](#0-2)  permite:
- Crear ventanas de overlay
- Configurar transparencia y posicionamiento
- Gestión de múltiples monitores

#### Procesamiento de Eventos
El sistema de eventos [4](#0-3)  maneja:
- Eventos de chat de múltiples plataformas
- Sistema de automatización
- Triggers personalizables

### 5. Configuración de Plataformas
```markdown
## Configuración de Plataformas

### TikTok
- Conexión vía WebSocket (puerto 21213)
- API Tikfinity para eventos en vivo

### Kick
- Autenticación de usuario
- Conexión de sala automática

### Twitch
- Integración con API oficial
- Manejo de emotes y badges
```

### 6. Funcionalidades Avanzadas

#### Text-to-Speech
Sistema TTS integrado [5](#0-4)  con:
- Múltiples voces
- Filtros de palabras
- Configuración personalizable

#### Integración Minecraft
Funcionalidad para enviar comandos [6](#0-5)  a servidores Minecraft.

#### Sistema de Overlays
Overlays personalizables [7](#0-6)  para:
- Alertas de donaciones
- Notificaciones de seguidores
- Widgets personalizados

### 7. Estructura de Archivos
## Estructura del Proyecto

```
src/
├── public/
│   ├── components/          # Componentes web personalizados
│   ├── features/           # Módulos de funcionalidad
│   ├── assets/            # Estilos y recursos
│   ├── database/          # Gestión IndexedDB
│   └── server/            # Cliente Socket.IO
├── features/              # Funcionalidades del backend
└── assets/               # Recursos estáticos
```

### 8. API y Eventos
Documentar los eventos Socket.IO principales:
- `ChatMessage` - Mensajes de chat
- `gift` - Regalos/donaciones  
- `follow` - Nuevos seguidores
- `create-overlay` - Crear overlays
- `toggle-sidebar` - Controles UI

### 9. Desarrollo y Contribución
## Desarrollo

### Scripts disponibles
- `npm start` - Iniciar aplicación
- `npm run build` - Construir para producción
- `npm test` - Ejecutar tests

