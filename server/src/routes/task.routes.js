const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

/**
 * Rutas para el manejo de tareas
 * Arquitectura: routes → controllers → services
 */

// GET /api/tasks - Obtener todas las tareas
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Obtener una tarea por ID
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Crear una nueva tarea
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Actualizar una tarea existente
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Eliminar una tarea
router.delete('/:id', taskController.deleteTask);

module.exports = router;
