const fs = require('fs').promises;
const path = require('path');
const config = require('../config/env');

class ReminderService {
  constructor() {
    this.remindersFile = path.join(__dirname, '../../..', config.remindersFile);
  }

  /**
   * Lee todos los recordatorios desde el archivo JSON
   */
  async getAllReminders() {
    try {
      const data = await fs.readFile(this.remindersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo recordatorios:', error);
      return [];
    }
  }

  /**
   * Obtiene un recordatorio por su ID
   */
  async getReminderById(id) {
    try {
      const reminders = await this.getAllReminders();
      return reminders.find(reminder => reminder.id === parseInt(id));
    } catch (error) {
      console.error('Error obteniendo recordatorio por ID:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo recordatorio
   */
  async createReminder(reminderData) {
    try {
      const reminders = await this.getAllReminders();
      const newReminder = {
        id: reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1,
        ...reminderData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      reminders.push(newReminder);
      await this.saveReminders(reminders);
      return newReminder;
    } catch (error) {
      console.error('Error creando recordatorio:', error);
      throw error;
    }
  }

  /**
   * Actualiza un recordatorio existente
   */
  async updateReminder(id, reminderData) {
    try {
      const reminders = await this.getAllReminders();
      const reminderIndex = reminders.findIndex(reminder => reminder.id === parseInt(id));
      
      if (reminderIndex === -1) {
        return null;
      }
      
      reminders[reminderIndex] = {
        ...reminders[reminderIndex],
        ...reminderData,
        updatedAt: new Date().toISOString()
      };
      
      await this.saveReminders(reminders);
      return reminders[reminderIndex];
    } catch (error) {
      console.error('Error actualizando recordatorio:', error);
      throw error;
    }
  }

  /**
   * Elimina un recordatorio
   */
  async deleteReminder(id) {
    try {
      const reminders = await this.getAllReminders();
      const reminderIndex = reminders.findIndex(reminder => reminder.id === parseInt(id));
      
      if (reminderIndex === -1) {
        return false;
      }
      
      reminders.splice(reminderIndex, 1);
      await this.saveReminders(reminders);
      return true;
    } catch (error) {
      console.error('Error eliminando recordatorio:', error);
      throw error;
    }
  }

  /**
   * Obtiene recordatorios por prioridad
   */
  async getRemindersByPriority(priority) {
    try {
      const reminders = await this.getAllReminders();
      return reminders.filter(reminder => reminder.priority === priority);
    } catch (error) {
      console.error('Error obteniendo recordatorios por prioridad:', error);
      return [];
    }
  }

  /**
   * Guarda los recordatorios en el archivo JSON
   */
  async saveReminders(reminders) {
    try {
      await fs.writeFile(this.remindersFile, JSON.stringify(reminders, null, 2));
    } catch (error) {
      console.error('Error guardando recordatorios:', error);
      throw error;
    }
  }
}

module.exports = new ReminderService();
