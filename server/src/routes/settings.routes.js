const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

/**
 * Rutas para el manejo de configuración y estado del servidor
 * Arquitectura: routes → controllers → services
 */

// GET /api/settings/config - Obtener configuración del servidor
router.get('/config', settingsController.getServerConfig);

// GET /api/settings/health - Verificar estado de salud del servidor
router.get('/health', settingsController.healthCheck);

// GET /api/settings/stats - Obtener estadísticas del servidor
router.get('/stats', settingsController.getServerStats);

module.exports = router;
