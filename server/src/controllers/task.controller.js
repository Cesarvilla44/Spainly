const taskService = require('../services/task.service');

/**
 * Controlador para manejar las operaciones CRUD de tareas
 */
class TaskController {
  /**
   * Obtiene todas las tareas
   */
  async getAllTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Tareas obtenidas correctamente',
        data: {
          tasks,
          total: tasks.length
        }
      });
    } catch (error) {
      console.error('Error en getAllTasks:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener tareas',
        error: error.message
      });
    }
  }

  /**
   * Obtiene una tarea por su ID
   */
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Tarea obtenida correctamente',
        data: { task }
      });
    } catch (error) {
      console.error('Error en getTaskById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener la tarea',
        error: error.message
      });
    }
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      
      // Validación básica
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'El título y la descripción son requeridos'
        });
      }
      
      const newTask = await taskService.createTask({ title, description });
      
      res.status(201).json({
        success: true,
        message: '¡Conseguido! Tarea creada correctamente',
        data: { task: newTask }
      });
    } catch (error) {
      console.error('Error en createTask:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al crear la tarea',
        error: error.message
      });
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      
      const updatedTask = await taskService.updateTask(id, { title, description, completed });
      
      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Tarea actualizada correctamente',
        data: { task: updatedTask }
      });
    } catch (error) {
      console.error('Error en updateTask:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al actualizar la tarea',
        error: error.message
      });
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Tarea eliminada correctamente'
      });
    } catch (error) {
      console.error('Error en deleteTask:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al eliminar la tarea',
        error: error.message
      });
    }
  }
}

module.exports = new TaskController();
