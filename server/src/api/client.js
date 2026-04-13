/**
 * Cliente API para interactuar con el backend de Spainly
 * Proporciona métodos para consumir los endpoints de la API
 */

class ApiClient {
  constructor(baseUrl = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Realiza una petición HTTP genérica
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error en petición a ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Métodos para tareas
   */
  async getTasks() {
    return this.request('/tasks');
  }

  async getTask(id) {
    return this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id, taskData) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Métodos para recordatorios
   */
  async getReminders() {
    return this.request('/reminders');
  }

  async getReminder(id) {
    return this.request(`/reminders/${id}`);
  }

  async createReminder(reminderData) {
    return this.request('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData)
    });
  }

  async updateReminder(id, reminderData) {
    return this.request(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminderData)
    });
  }

  async deleteReminder(id) {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE'
    });
  }

  async getRemindersByPriority(priority) {
    return this.request(`/reminders/priority/${priority}`);
  }

  /**
   * Métodos para configuración y estado
   */
  async getServerConfig() {
    return this.request('/settings/config');
  }

  async getHealthStatus() {
    return this.request('/settings/health');
  }

  async getServerStats() {
    return this.request('/settings/stats');
  }
}

// Exportar una instancia por defecto
module.exports = new ApiClient();

// También exportar la clase para poder crear instancias con diferentes URLs
module.exports.ApiClient = ApiClient;
