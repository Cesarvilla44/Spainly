const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Datos en memoria (simulación de base de datos)
let users = [];
const JWT_SECRET = 'spainly-secret-key-2024';

/**
 * Controlador para manejar la autenticación de usuarios
 */
class AuthController {
  /**
   * Registra un nuevo usuario
   */
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      
      // Validación
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos'
        });
      }
      
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya existe'
        });
      }
      
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear usuario
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      
      // Generar token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        success: true,
        message: '¡Conseguido! Usuario registrado correctamente',
        data: {
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Inicia sesión de usuario
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validación
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }
      
      // Buscar usuario
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      // Generar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
        message: '¡Conseguido! Inicio de sesión correcto',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene el perfil del usuario
   */
  async getProfile(req, res) {
    try {
      const user = users.find(u => u.id === req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      res.json({
        success: true,
        message: '¡Conseguido! Perfil obtenido correctamente',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Función para verificar token JWT (middleware)
   */
  static verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
}

module.exports = new AuthController();
