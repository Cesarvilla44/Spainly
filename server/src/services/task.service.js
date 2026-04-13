const fs = require('fs').promises;
const path = require('path');
const config = require('../config/env');

class TaskService {
  constructor() {
    this.tasksFile = path.join(__dirname, '../../..', config.tasksFile);
  }

  /**
   * Lee todas las tareas desde el archivo JSON
   */
  async getAllTasks() {
    try {
      const data = await fs.readFile(this.tasksFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo tareas:', error);
      return [];
    }
  }

  /**
   * Obtiene una tarea por su ID
   */
  async getTaskById(id) {
    try {
      const tasks = await this.getAllTasks();
      return tasks.find(task => task.id === parseInt(id));
    } catch (error) {
      console.error('Error obteniendo tarea por ID:', error);
      return null;
    }
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(taskData) {
    try {
      const tasks = await this.getAllTasks();
      const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      tasks.push(newTask);
      await this.saveTasks(tasks);
      return newTask;
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id, taskData) {
    try {
      const tasks = await this.getAllTasks();
      const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
      
      if (taskIndex === -1) {
        return null;
      }
      
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...taskData,
        updatedAt: new Date().toISOString()
      };
      
      await this.saveTasks(tasks);
      return tasks[taskIndex];
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id) {
    try {
      const tasks = await this.getAllTasks();
      const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
      
      if (taskIndex === -1) {
        return false;
      }
      
      tasks.splice(taskIndex, 1);
      await this.saveTasks(tasks);
      return true;
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  }

  /**
   * Guarda las tareas en el archivo JSON
   */
  async saveTasks(tasks) {
    try {
      await fs.writeFile(this.tasksFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
      console.error('Error guardando tareas:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();
