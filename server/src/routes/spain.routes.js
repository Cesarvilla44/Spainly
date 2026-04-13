const express = require('express');
const router = express.Router();
const spainController = require('../controllers/spain.controller');
const authController = require('../controllers/auth.controller');

/**
 * Rutas para funcionalidades de Spain (búsquedas, favoritos, valoraciones)
 * Todas requieren autenticación
 */

// Middleware para verificar token en todas las rutas
router.use(authController.constructor.verifyToken);

// Búsquedas
// POST /api/spain/searches - Guardar búsqueda
router.post('/searches', spainController.saveSearch);

// GET /api/spain/searches - Obtener búsquedas del usuario
router.get('/searches', spainController.getSearches);

// Favoritos
// POST /api/spain/favorites - Añadir lugar a favoritos
router.post('/favorites', spainController.addFavorite);

// DELETE /api/spain/favorites/:placeId - Eliminar lugar de favoritos
router.delete('/favorites/:placeId', spainController.removeFavorite);

// GET /api/spain/favorites - Obtener favoritos del usuario
router.get('/favorites', spainController.getFavorites);

// Valoraciones
// POST /api/spain/ratings/:placeId - Guardar valoración de un lugar
router.post('/ratings/:placeId', spainController.saveRating);

// GET /api/spain/ratings - Obtener valoraciones del usuario
router.get('/ratings', spainController.getRatings);

// Estadísticas
// GET /api/spain/stats - Obtener estadísticas del usuario
router.get('/stats', spainController.getUserStats);

module.exports = router;
