const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * Rutas para autenticación de usuarios
 */

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// GET /api/auth/profile - Obtener perfil de usuario (requiere token)
router.get('/profile', authController.constructor.verifyToken, authController.getProfile);

module.exports = router;
