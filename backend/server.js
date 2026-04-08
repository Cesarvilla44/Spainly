const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Datos en memoria (simulación de base de datos)
let users = [];
let searches = [];
let favorites = [];
let ratings = [];

// Clave secreta para JWT
const JWT_SECRET = 'spainly-secret-key-2024';

// Función para verificar token JWT
function verifyToken(req, res, next) {
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

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '¡Conseguido! Servidor Spainly funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
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
});

app.post('/api/auth/login', async (req, res) => {
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
            message: '¡Conseguido! Inicio de sesión exitoso',
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
});

// Rutas de usuario
app.get('/api/user/profile', verifyToken, (req, res) => {
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
});

app.put('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const { username, email } = req.body;
        const userIndex = users.findIndex(u => u.id === req.user.userId);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Actualizar usuario
        if (username) users[userIndex].username = username;
        if (email) users[userIndex].email = email;
        
        res.json({
            success: true,
            message: '¡Conseguido! Perfil actualizado correctamente',
            data: {
                user: {
                    id: users[userIndex].id,
                    username: users[userIndex].username,
                    email: users[userIndex].email,
                    createdAt: users[userIndex].createdAt
                }
            }
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Rutas de búsquedas
app.post('/api/searches', verifyToken, (req, res) => {
    try {
        const { query, province, category, schedule } = req.body;
        
        const search = {
            id: Date.now().toString(),
            userId: req.user.userId,
            query,
            province,
            category,
            schedule,
            timestamp: new Date().toISOString()
        };
        
        searches.push(search);
        
        res.status(201).json({
            success: true,
            message: '¡Conseguido! Búsqueda guardada correctamente',
            data: { search }
        });
    } catch (error) {
        console.error('Error guardando búsqueda:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

app.get('/api/searches', verifyToken, (req, res) => {
    try {
        const userSearches = searches.filter(s => s.userId === req.user.userId);
        
        res.json({
            success: true,
            message: '¡Conseguido! Búsquedas obtenidas correctamente',
            data: {
                searches: userSearches,
                total: userSearches.length
            }
        });
    } catch (error) {
        console.error('Error obteniendo búsquedas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Rutas de favoritos
app.post('/api/favorites', verifyToken, (req, res) => {
    try {
        const { placeId, placeName, placeImage } = req.body;
        
        // Verificar si ya es favorito
        const existingFavorite = favorites.find(f => 
            f.userId === req.user.userId && f.placeId === placeId
        );
        
        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: 'El lugar ya está en favoritos'
            });
        }
        
        const favorite = {
            id: Date.now().toString(),
            userId: req.user.userId,
            placeId,
            placeName,
            placeImage,
            timestamp: new Date().toISOString()
        };
        
        favorites.push(favorite);
        
        res.status(201).json({
            success: true,
            message: '¡Conseguido! Lugar añadido a favoritos',
            data: { favorite }
        });
    } catch (error) {
        console.error('Error añadiendo favorito:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

app.get('/api/favorites', verifyToken, (req, res) => {
    try {
        const userFavorites = favorites.filter(f => f.userId === req.user.userId);
        
        res.json({
            success: true,
            message: '¡Conseguido! Favoritos obtenidos correctamente',
            data: {
                favorites: userFavorites,
                total: userFavorites.length
            }
        });
    } catch (error) {
        console.error('Error obteniendo favoritos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

app.delete('/api/favorites/:placeId', verifyToken, (req, res) => {
    try {
        const { placeId } = req.params;
        
        const favoriteIndex = favorites.findIndex(f => 
            f.userId === req.user.userId && f.placeId === placeId
        );
        
        if (favoriteIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Favorito no encontrado'
            });
        }
        
        favorites.splice(favoriteIndex, 1);
        
        res.json({
            success: true,
            message: '¡Conseguido! Favorito eliminado correctamente'
        });
    } catch (error) {
        console.error('Error eliminando favorito:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Rutas de valoraciones
app.post('/api/ratings', verifyToken, (req, res) => {
    try {
        const { placeId, placeName, rating } = req.body;
        
        // Verificar si ya ha valorado este lugar
        const existingRating = ratings.find(r => 
            r.userId === req.user.userId && r.placeId === placeId
        );
        
        if (existingRating) {
            // Actualizar valoración existente
            existingRating.rating = rating;
            existingRating.timestamp = new Date().toISOString();
            
            return res.json({
                success: true,
                message: '¡Conseguido! Valoración actualizada correctamente',
                data: { rating: existingRating }
            });
        }
        
        const newRating = {
            id: Date.now().toString(),
            userId: req.user.userId,
            placeId,
            placeName,
            rating,
            timestamp: new Date().toISOString()
        };
        
        ratings.push(newRating);
        
        res.status(201).json({
            success: true,
            message: '¡Conseguido! Valoración guardada correctamente',
            data: { rating: newRating }
        });
    } catch (error) {
        console.error('Error guardando valoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

app.get('/api/ratings', verifyToken, (req, res) => {
    try {
        const userRatings = ratings.filter(r => r.userId === req.user.userId);
        
        res.json({
            success: true,
            message: '¡Conseguido! Valoraciones obtenidas correctamente',
            data: {
                ratings: userRatings,
                total: userRatings.length
            }
        });
    } catch (error) {
        console.error('Error obteniendo valoraciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Rutas de estadísticas
app.get('/api/stats', verifyToken, (req, res) => {
    try {
        const userSearches = searches.filter(s => s.userId === req.user.userId);
        const userFavorites = favorites.filter(f => f.userId === req.user.userId);
        const userRatings = ratings.filter(r => r.userId === req.user.userId);
        
        res.json({
            success: true,
            message: '¡Conseguido! Estadísticas obtenidas correctamente',
            data: {
                searches: userSearches.length,
                favorites: userFavorites.length,
                ratings: userRatings.length,
                user: 1
            }
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Spainly iniciado en el puerto ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;
