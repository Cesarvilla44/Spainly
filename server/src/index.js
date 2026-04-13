const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/env');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const spainRoutes = require('./routes/spain.routes');
const taskRoutes = require('./routes/task.routes');
const reminderRoutes = require('./routes/reminder.routes');
const settingsRoutes = require('./routes/settings.routes');

// Crear aplicación Express
const app = express();

// Middlewares básicos
if (config.helmetEnabled) {
  app.use(helmet()); // Seguridad HTTP headers
}

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Parsear JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parsear URL-encoded

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/spain', spainRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/settings', settingsRoutes);

// Ruta de salud legado (compatibilidad)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Servidor activo' });
});

// Ruta raíz - información del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '¡Conseguido! Servidor Spainly funcionando correctamente',
    data: {
      name: 'Spainly Server',
      version: '1.0.0',
      description: 'Backend API para Spainly - Plataforma de turismo de España',
      endpoints: {
        auth: '/api/auth',
        spain: '/api/spain',
        tasks: '/api/tasks',
        reminders: '/api/reminders',
        settings: '/api/settings',
        health: '/api/health'
      },
      documentation: 'https://github.com/Cesarvilla44/Spainly',
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware para rutas no encontradas (404)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    error: `No se encontró la ruta ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /api/tasks',
      'POST /api/tasks',
      'GET /api/tasks/:id',
      'PUT /api/tasks/:id',
      'DELETE /api/tasks/:id',
      'GET /api/reminders',
      'POST /api/reminders',
      'GET /api/reminders/:id',
      'PUT /api/reminders/:id',
      'DELETE /api/reminders/:id',
      'GET /api/reminders/priority/:priority',
      'GET /api/settings/config',
      'GET /api/settings/health',
      'GET /api/settings/stats'
    ]
  });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const PORT = config.port;

app.listen(PORT, () => {
  console.log('🚀 Servidor Spainly iniciado correctamente');
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${config.nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📚 API Base: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/settings/health`);
  console.log('📖 Endpoints disponibles:');
  console.log('   • Tasks: GET, POST, PUT, DELETE /api/tasks');
  console.log('   • Reminders: GET, POST, PUT, DELETE /api/reminders');
  console.log('   • Settings: GET /api/settings/*');
  console.log('🎉 ¡Servidor listo para recibir peticiones!');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

module.exports = app;
