# Spainly Server

Backend API para Spainly - Plataforma de turismo de España con arquitectura por capas.

## 📋 Descripción

Servidor Node.js con Express que implementa una arquitectura limpia y modular para gestionar tareas y recordatorios relacionados con lugares turísticos de España.

## 🏗️ Arquitectura

El servidor sigue una arquitectura por capas:

```
routes → controllers → services → data (JSON)
```

### Estructura de Carpetas

```
server/
├── data/                          # Base de datos simulada (archivos JSON)
│   ├── tasks.json                 # Datos de tareas
│   └── reminders.json             # Datos de recordatorios
├── src/
│   ├── api/                       # Cliente API para frontend
│   │   ├── client.js              # Cliente API genérico
│   │   └── tasks.js               # Cliente específico para tareas
│   ├── config/
│   │   └── env.js                 # Configuración de variables de entorno
│   ├── controllers/               # Manejo de request/response
│   │   ├── reminder.controller.js # Controlador de recordatorios
│   │   ├── settings.controller.js # Controlador de configuración
│   │   └── task.controller.js     # Controlador de tareas
│   ├── routes/                    # Definición de rutas
│   │   ├── reminder.routes.js     # Rutas de recordatorios
│   │   ├── settings.routes.js     # Rutas de configuración
│   │   └── task.routes.js         # Rutas de tareas
│   ├── services/                  # Lógica de negocio
│   │   ├── reminder.service.js    # Servicio de recordatorios
│   │   └── task.service.js        # Servicio de tareas
│   └── index.js                   # Punto de entrada del servidor
├── .env                           # Variables de entorno
├── package.json                   # Dependencias del proyecto
└── README.md                      # Este archivo
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Cesarvilla44/Spainly.git
   cd Spainly/server
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   # Editar .env según sea necesario
   ```

4. **Iniciar el servidor:**
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

5. **Verificar funcionamiento:**
   ```bash
   curl http://localhost:3000/api/settings/health
   ```

## 📡 API Endpoints

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Obtener todas las tareas |
| GET | `/api/tasks/:id` | Obtener una tarea por ID |
| POST | `/api/tasks` | Crear una nueva tarea |
| PUT | `/api/tasks/:id` | Actualizar una tarea |
| DELETE | `/api/tasks/:id` | Eliminar una tarea |

### Recordatorios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reminders` | Obtener todos los recordatorios |
| GET | `/api/reminders/:id` | Obtener un recordatorio por ID |
| GET | `/api/reminders/priority/:priority` | Obtener recordatorios por prioridad |
| POST | `/api/reminders` | Crear un nuevo recordatorio |
| PUT | `/api/reminders/:id` | Actualizar un recordatorio |
| DELETE | `/api/reminders/:id` | Eliminar un recordatorio |

### Configuración

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/settings/config` | Obtener configuración del servidor |
| GET | `/api/settings/health` | Verificar estado de salud |
| GET | `/api/settings/stats` | Obtener estadísticas del servidor |

## 📝 Ejemplos de Uso

### Crear una tarea

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Visitar Sagrada Familia",
    "description": "Visitar la famosa basílica de Gaudí en Barcelona"
  }'
```

### Obtener todas las tareas

```bash
curl http://localhost:3000/api/tasks
```

### Crear un recordatorio

```bash
curl -X POST http://localhost:3000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Recordatorio: Reservar entradas Alhambra",
    "description": "No olvidar reservar las entradas con antelación",
    "date": "2024-02-01T09:00:00Z",
    "priority": "high"
  }'
```

## 🔧 Configuración

Variables de entorno disponibles:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |
| DATA_PATH | Ruta a los archivos JSON | ./data |
| CORS_ORIGIN | Origen permitido para CORS | http://localhost:3000 |
| HELMET_ENABLED | Activar seguridad Helmet | true |

## 🛡️ Seguridad

- **Helmet**: Protección contra vulnerabilidades HTTP
- **CORS**: Configurado para permitir orígenes específicos
- **Validación**: Validación de datos de entrada
- **Rate Limiting**: Implementación recomendada para producción

## 🧪 Desarrollo

### Scripts disponibles

```bash
npm start        # Iniciar servidor en modo producción
npm run dev      # Iniciar servidor con nodemon
npm test         # Ejecutar pruebas (pendiente de implementar)
```

### Estructura de datos

#### Tarea (Task)

```json
{
  "id": 1,
  "title": "Visitar Sagrada Familia",
  "description": "Visitar la famosa basílica de Gaudí",
  "completed": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### Recordatorio (Reminder)

```json
{
  "id": 1,
  "title": "Recordatorio: Reservar entradas",
  "description": "No olvidar reservar las entradas",
  "date": "2024-02-01T09:00:00Z",
  "priority": "high",
  "completed": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 📊 Monitoreo

- **Health Check**: `/api/settings/health`
- **Estadísticas**: `/api/settings/stats`
- **Configuración**: `/api/settings/config`

## 🚀 Despliegue

### Vercel

El servidor está configurado para despliegue en Vercel con el archivo `vercel.json` en el directorio raíz del proyecto.

### Variables de entorno en producción

Asegúrate de configurar las siguientes variables en tu plataforma de despliegue:

- `NODE_ENV=production`
- `PORT` (según la plataforma)
- `DATA_PATH` (ruta a los archivos JSON)

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama de características
3. Realizar cambios
4. Crear Pull Request
5. Esperar revisión

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** - puedes usarlo, modificarlo y distribuirlo libremente.

## 👨‍💻 Autor

**Carlos Vidal**
- 📧 Email: cevidal@estudiantes.esei.uva.es
- 📚 Curso: 2026-2027
- 🐙 GitHub: [https://github.com/Cesarvilla44/Spainly](https://github.com/Cesarvilla44/Spainly)

## 🌟 Agradecimientos

- **Express.js** - Backend robusto y rápido
- **Node.js** - Entorno de ejecución JavaScript
- **Helmet** - Seguridad HTTP
- **CORS** - Compartir recursos entre orígenes

---

**¡Gracias por usar Spainly Server! 🇪🇸**

*Backend potente y modular para tu aplicación de turismo.*
