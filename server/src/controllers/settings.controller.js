const config = require('../config/env');

/**
 * Controlador para manejar la configuración de la aplicación
 */
class SettingsController {
  /**
   * Obtiene la configuración actual del servidor
   */
  async getServerConfig(req, res) {
    try {
      const serverConfig = {
        port: config.port,
        nodeEnv: config.nodeEnv,
        corsOrigin: config.corsOrigin,
        helmetEnabled: config.helmetEnabled,
        dataPath: config.dataPath,
        version: '1.0.0',
        name: 'Spainly Server',
        description: 'Backend API para Spainly - Plataforma de turismo de España'
      };
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Configuración del servidor obtenida correctamente',
        data: { config: serverConfig }
      });
    } catch (error) {
      console.error('Error en getServerConfig:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener la configuración',
        error: error.message
      });
    }
  }

  /**
   * Verifica el estado de salud del servidor
   */
  async healthCheck(req, res) {
    try {
      const healthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0',
        environment: config.nodeEnv,
        port: config.port
      };
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Servidor Spainly funcionando correctamente',
        data: healthStatus
      });
    } catch (error) {
      console.error('Error en healthCheck:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al verificar estado de salud',
        error: error.message
      });
    }
  }

  /**
   * Obtiene estadísticas del servidor
   */
  async getServerStats(req, res) {
    try {
      const stats = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json({
        success: true,
        message: '¡Conseguido! Estadísticas del servidor obtenidas correctamente',
        data: { stats }
      });
    } catch (error) {
      console.error('Error en getServerStats:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor al obtener estadísticas',
        error: error.message
      });
    }
  }
}

module.exports = new SettingsController();
