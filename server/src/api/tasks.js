const apiClient = require('./client');

/**
 * Módulo específico para manejar operaciones de tareas
 * Proporciona una interfaz simplificada para el manejo de tareas
 */

class TasksApi {
  /**
   * Obtiene todas las tareas del servidor
   */
  async getAll() {
    try {
      const response = await apiClient.getTasks();
      return response.data.tasks;
    } catch (error) {
      console.error('Error obteniendo todas las tareas:', error);
      throw error;
    }
  }

  /**
   * Obtiene una tarea específica por su ID
   */
  async getById(id) {
    try {
      const response = await apiClient.getTask(id);
      return response.data.task;
    } catch (error) {
      console.error(`Error obteniendo tarea ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva tarea
   */
  async create(taskData) {
    try {
      const response = await apiClient.createTask(taskData);
      return response.data.task;
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async update(id, taskData) {
    try {
      const response = await apiClient.updateTask(id, taskData);
      return response.data.task;
    } catch (error) {
      console.error(`Error actualizando tarea ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una tarea
   */
  async delete(id) {
    try {
      await apiClient.deleteTask(id);
      return true;
    } catch (error) {
      console.error(`Error eliminando tarea ${id}:`, error);
      throw error;
    }
  }

  /**
   * Marca una tarea como completada
   */
  async markAsCompleted(id) {
    try {
      return await this.update(id, { completed: true });
    } catch (error) {
      console.error(`Error marcando tarea ${id} como completada:`, error);
      throw error;
    }
  }

  /**
   * Marca una tarea como no completada
   */
  async markAsIncomplete(id) {
    try {
      return await this.update(id, { completed: false });
    } catch (error) {
      console.error(`Error marcando tarea ${id} como no completada:`, error);
      throw error;
    }
  }

  /**
   * Obtiene tareas completadas
   */
  async getCompleted() {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => task.completed);
    } catch (error) {
      console.error('Error obteniendo tareas completadas:', error);
      throw error;
    }
  }

  /**
   * Obtiene tareas pendientes
   */
  async getPending() {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => !task.completed);
    } catch (error) {
      console.error('Error obteniendo tareas pendientes:', error);
      throw error;
    }
  }

  /**
   * Busca tareas por título o descripción
   */
  async search(query) {
    try {
      const allTasks = await this.getAll();
      const searchTerm = query.toLowerCase();
      return allTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error(`Error buscando tareas con query "${query}":`, error);
      throw error;
    }
  }
}

module.exports = new TasksApi();
