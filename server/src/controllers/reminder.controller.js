const reminderService = require('../services/reminder.service');

/**
 * Controlador para manejar las operaciones CRUD de recordatorios
 */
class ReminderController {
  /**
   * Obtiene todos los recordatorios
   */
  async getAllReminders(req, res) {
    try {
      const reminders = await reminderService.getAllReminders();
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Recordatorios obtenidos correctamente',
        data: {
          reminders,
          total: reminders.length
        }
      });
    } catch (error) {
      console.error('Error en getAllReminders:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener recordatorios',
        error: error.message
      });
    }
  }

  /**
   * Obtiene un recordatorio por su ID
   */
  async getReminderById(req, res) {
    try {
      const { id } = req.params;
      const reminder = await reminderService.getReminderById(id);
      
      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: 'Recordatorio no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Recordatorio obtenido correctamente',
        data: { reminder }
      });
    } catch (error) {
      console.error('Error en getReminderById:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener el recordatorio',
        error: error.message
      });
    }
  }

  /**
   * Crea un nuevo recordatorio
   */
  async createReminder(req, res) {
    try {
      const { title, description, date, priority } = req.body;
      
      // Validación básica
      if (!title || !description || !date) {
        return res.status(400).json({
          success: false,
          message: 'El título, descripción y fecha son requeridos'
        });
      }
      
      // Validar prioridad
      const validPriorities = ['low', 'medium', 'high'];
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'La prioridad debe ser: low, medium o high'
        });
      }
      
      const newReminder = await reminderService.createReminder({ 
        title, 
        description, 
        date, 
        priority: priority || 'medium' 
      });
      
      res.status(201).json({
        success: true,
        message: '¡Conseguido! Recordatorio creado correctamente',
        data: { reminder: newReminder }
      });
    } catch (error) {
      console.error('Error en createReminder:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al crear el recordatorio',
        error: error.message
      });
    }
  }

  /**
   * Actualiza un recordatorio existente
   */
  async updateReminder(req, res) {
    try {
      const { id } = req.params;
      const { title, description, date, priority, completed } = req.body;
      
      // Validar prioridad si se proporciona
      if (priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
          return res.status(400).json({
            success: false,
            message: 'La prioridad debe ser: low, medium o high'
          });
        }
      }
      
      const updatedReminder = await reminderService.updateReminder(id, { 
        title, 
        description, 
        date, 
        priority, 
        completed 
      });
      
      if (!updatedReminder) {
        return res.status(404).json({
          success: false,
          message: 'Recordatorio no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Recordatorio actualizado correctamente',
        data: { reminder: updatedReminder }
      });
    } catch (error) {
      console.error('Error en updateReminder:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al actualizar el recordatorio',
        error: error.message
      });
    }
  }

  /**
   * Elimina un recordatorio
   */
  async deleteReminder(req, res) {
    try {
      const { id } = req.params;
      const deleted = await reminderService.deleteReminder(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Recordatorio no encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Recordatorio eliminado correctamente'
      });
    } catch (error) {
      console.error('Error en deleteReminder:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al eliminar el recordatorio',
        error: error.message
      });
    }
  }

  /**
   * Obtiene recordatorios por prioridad
   */
  async getRemindersByPriority(req, res) {
    try {
      const { priority } = req.params;
      
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'La prioridad debe ser: low, medium o high'
        });
      }
      
      const reminders = await reminderService.getRemindersByPriority(priority);
      
      res.status(200).json({
        success: true,
        message: `¡Conseguido! Recordatorios con prioridad ${priority} obtenidos correctamente`,
        data: {
          reminders,
          total: reminders.length
        }
      });
    } catch (error) {
      console.error('Error en getRemindersByPriority:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener recordatorios por prioridad',
        error: error.message
      });
    }
  }
}

module.exports = new ReminderController();
