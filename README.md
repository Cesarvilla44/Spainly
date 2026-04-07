# Spainly - Plataforma de Descubrimiento Turístico de España

Aplicación web completa para descubrir y explorar los lugares más fascinantes de España.

## 🌍 Descripción

Spainly es una plataforma turística completa que permite a los usuarios descubrir lugares increíbles de España, buscar con filtros avanzados, guardar favoritos, dejar valoraciones y explorar reportajes detallados de destinos turísticos.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **🏠 Página Principal**: Mensaje de bienvenida atractivo con descripción del proyecto
- **🔍 Búsqueda Avanzada**: Filtros por provincia, categoría (Montaña/Playa) y horario de apertura
- **📍 40 Lugares Turísticos**: Tarjetas interactivas con información detallada
- **📊 Sistema de Contadores**: Búsquedas, favoritos, valoraciones y usuario (empiezan en 0)
- **❤️ Sistema de Favoritos**: Añadir/eliminar lugares favoritos con contador dinámico
- **⭐ Sistema de Valoraciones**: Sistema de estrellas 1-5 para cada lugar
- **👤 Perfil de Usuario**: Edición de datos personales y foto de perfil
- **📖 Reportajes Turísticos**: 10 temas específicos sobre destinos españoles
- **🔐 Autenticación**: Registro e inicio de sesión con modales funcionales
- **🌓 Modo Claro/Oscuro**: Toggle con persistencia de preferencia
- **💬 Mensajes "¡Conseguido!"**: Feedback visual en todas las acciones

### 🏖️ Reportajes Disponibles

1. **Ordesa y Monte Perdido** - Espectacular parque nacional pirenáico
2. **Parque Natural de Grazalema** - Paraíso de biodiversidad en Cádiz
3. **Las Islas Cíes** - Archipiélago protegido en Galicia
4. **Lugares Icónicos de Baleares** - Joyas de Mallorca, Menorca, Ibiza y Formentera
5. **Qué ver en Zaragoza** - Ciudad con 2000 años de historia
6. **Los Balnearios de Panticosa** - Aguas termales en el Pirineo
7. **La Ruta del Pico Cares** - Sendero impresionante entre Picos de Europa
8. **Las Mejores Playas del País** - Paraísos costeros de todo el litoral
9. **El Parque Regional de Doñana** - Espacio natural más importante de Europa
10. **El Delta del Ebro** - Paraíso de agua y tierra en Tarragona

## 🛠️ Arquitectura Técnica

### Frontend
- **HTML5** - Estructura semántica moderna
- **CSS3 con Tailwind CSS** - Diseño responsive y utilitario
- **JavaScript Vanilla** - Lógica completa sin frameworks
- **LocalStorage** - Persistencia de datos locales
- **Font Awesome** - Iconos modernos
- **Picsum Photos** - Imágenes aleatorias para lugares

### Backend
- **Node.js** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Compartir recursos entre orígenes
- **Body-parser** - Parseo de datos de formularios

## 📁 Estructura del Proyecto

```
spainly/
├── index.html              # Página principal con toda la interfaz
├── app.js                 # Lógica completa de la aplicación
├── backend/
│   ├── package.json       # Dependencias del backend
│   └── server.js         # Servidor con API REST
└── README.md              # Documentación del proyecto
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación del Backend
```bash
cd backend
npm install
npm start
```

### Ejecución del Frontend
Simplemente abre `index.html` en tu navegador web preferido.

### URLs de Desarrollo
- **Frontend**: `file:///ruta/al/proyecto/index.html`
- **Backend API**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/health`

## 📡 API REST Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Perfil de Usuario
- `GET /api/user/profile` - Obtener perfil
- `PUT /api/user/profile` - Actualizar perfil

### Búsquedas
- `POST /api/searches` - Guardar búsqueda
- `GET /api/searches` - Obtener búsquedas del usuario

### Favoritos
- `POST /api/favorites` - Añadir favorito
- `GET /api/favorites` - Obtener favoritos del usuario
- `DELETE /api/favorites/:placeId` - Eliminar favorito

### Valoraciones
- `POST /api/ratings` - Guardar/actualizar valoración
- `GET /api/ratings` - Obtener valoraciones del usuario

### Estadísticas
- `GET /api/stats` - Obtener contadores del usuario

## 🎨 Diseño y UX

### Características de Diseño
- **Responsive Design**: Adaptación perfecta a todos los dispositivos
- **Modo Oscuro**: Toggle con persistencia de preferencia
- **Animaciones Suaves**: Transiciones y microinteracciones
- **Feedback Visual**: Mensajes "¡Conseguido!" en todas las acciones
- **Iconos Intuitivos**: Font Awesome para mejor UX
- **Colores Españoles**: Rojo (#c41e3a) y Amarillo (#f1bf00)

### Accesibilidad
- **Navegación por Teclado**: Totalmente accesible
- **Contraste Alto**: Cumple WCAG 2.1 AA
- **Etiquetas Semánticas**: HTML5 bien estructurado
- **Lectores de Pantalla**: Compatible con lectores

## 📊 Sistema de Contadores

Los contadores funcionan de la siguiente manera:

- **🔍 Búsquedas**: Se incrementa al usar filtros de búsqueda
- **❤️ Favoritos**: Se incrementa al añadir lugar a favoritos
- **⭐ Valoraciones**: Se incrementa al valorar un lugar
- **👤 Usuario**: Se activa al iniciar sesión (valor: 1)

Todos los contadores empiezan en **0** y se guardan en LocalStorage.

## 🔐 Seguridad

### Autenticación
- **JWT Tokens**: Tokens con expiración de 7 días
- **Contraseñas Encriptadas**: bcrypt con salt rounds de 10
- **Validación de Entrada**: Todos los datos validados
- **CORS Configurado**: Solo orígenes permitidos

### Protección de Datos
- **Sin Almacenamiento Sensible**: Sin datos personales en logs
- **Sanitización de Input**: Prevención de XSS
- **Rate Limiting**: Protección contra ataques de fuerza bruta

## 🚀 Despliegue

### Frontend (Vercel)
1. **Crear cuenta en [Vercel](https://vercel.com)**
2. **Conectar repositorio GitHub**
3. **Configurar variables de entorno** (si es necesario)
4. **Desplegar automáticamente**

### Backend (Railway/Heroku)
1. **Crear cuenta en plataforma de hosting**
2. **Configurar variables de entorno**
3. **Desplegar desde GitHub**
4. **Configurar dominio personalizado**

## 📈 Métricas y Monitoreo

### Health Check
- **Endpoint**: `/health`
- **Respuesta**: Estado del servidor y timestamp
- **Uso**: Para monitoreo y alertas

### Logs
- **Console Logging**: Todos los errores registrados
- **Request Logging**: Peticiones API registradas
- **Error Handling**: Respuestas consistentes

## 🤝 Contribución

### Cómo Contribuir
1. **Fork del repositorio**
2. **Crear rama de características**
3. **Realizar cambios**
4. **Crear Pull Request**
5. **Esperar revisión**

### Guía de Estilo
- **Código Limpio**: Comentarios donde sea necesario
- **Nombres Descriptivos**: Variables y funciones claras
- **Consistencia**: Seguir patrones establecidos
- **Testing**: Probar todas las funcionalidades

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT** - puedes usarlo, modificarlo y distribuirlo libremente.

## 👨‍💻 Autor

**César Villacañas Moreno**
- 📧 Email: cesar.villacanas@alu.ceacfp.es
- 📚 Curso: 2026-2027
- 🐙 GitHub: [https://github.com/Cesarvilla44/Spainly](https://github.com/Cesarvilla44/Spainly)

## 🌟 Agradecimientos

- **Tailwind CSS** - Framework CSS increíble
- **Font Awesome** - Iconos espectaculares
- **Picsum Photos** - Imágenes aleatorias de calidad
- **Express.js** - Backend robusto y rápido

---

**¡Gracias por usar Spainly! 🇪🇸**

*Descubre España, crea recuerdos, vive aventuras.*
