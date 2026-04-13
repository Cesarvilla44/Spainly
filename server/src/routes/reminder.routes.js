const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');

/**
 * Rutas para el manejo de recordatorios
 * Arquitectura: routes → controllers → services
 */

// GET /api/reminders - Obtener todos los recordatorios
router.get('/', reminderController.getAllReminders);

// GET /api/reminders/:id - Obtener un recordatorio por ID
router.get('/:id', reminderController.getReminderById);

// GET /api/reminders/priority/:priority - Obtener recordatorios por prioridad
router.get('/priority/:priority', reminderController.getRemindersByPriority);

// POST /api/reminders - Crear un nuevo recordatorio
router.post('/', reminderController.createReminder);

// PUT /api/reminders/:id - Actualizar un recordatorio existente
router.put('/:id', reminderController.updateReminder);

// DELETE /api/reminders/:id - Eliminar un recordatorio
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;
