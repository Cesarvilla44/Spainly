require('dotenv').config();

const config = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuración de la base de datos
  dataPath: process.env.DATA_PATH || './data',
  
  // Configuración de CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Configuración de seguridad
  helmetEnabled: process.env.HELMET_ENABLED === 'true',
  
  // URLs de archivos JSON
  tasksFile: process.env.DATA_PATH ? `${process.env.DATA_PATH}/tasks.json` : './data/tasks.json',
  remindersFile: process.env.DATA_PATH ? `${process.env.DATA_PATH}/reminders.json` : './data/reminders.json'
};

module.exports = config;
