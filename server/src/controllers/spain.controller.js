/**
 * Controlador para manejar búsquedas, favoritos y valoraciones
 */

// Datos en memoria (simulación de base de datos)
let searches = [];
let favorites = [];
let ratings = [];

class SpainController {
  /**
   * Guarda una búsqueda
   */
  async saveSearch(req, res) {
    try {
      const { query, filters, resultsCount } = req.body;
      
      const newSearch = {
        id: Date.now().toString(),
        userId: req.user.userId,
        query,
        filters,
        resultsCount,
        timestamp: new Date().toISOString()
      };
      
      searches.push(newSearch);
      
      res.status(201).json({
        success: true,
        message: '¡Conseguido! Búsqueda guardada correctamente',
        data: { search: newSearch }
      });
    } catch (error) {
      console.error('Error guardando búsqueda:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene las búsquedas del usuario
   */
  async getSearches(req, res) {
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
  }

  /**
   * Añade un lugar a favoritos
   */
  async addFavorite(req, res) {
    try {
      const { placeId, placeName, province, category, image } = req.body;
      
      // Verificar si ya está en favoritos
      const existingFavorite = favorites.find(
        f => f.userId === req.user.userId && f.placeId === placeId
      );
      
      if (existingFavorite) {
        return res.status(400).json({
          success: false,
          message: 'Este lugar ya está en tus favoritos'
        });
      }
      
      const newFavorite = {
        id: Date.now().toString(),
        userId: req.user.userId,
        placeId,
        placeName,
        province,
        category,
        image,
        addedAt: new Date().toISOString()
      };
      
      favorites.push(newFavorite);
      
      res.status(201).json({
        success: true,
        message: '¡Conseguido! Lugar añadido a favoritos correctamente',
        data: { favorite: newFavorite }
      });
    } catch (error) {
      console.error('Error añadiendo favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Elimina un lugar de favoritos
   */
  async removeFavorite(req, res) {
    try {
      const { placeId } = req.params;
      
      const favoriteIndex = favorites.findIndex(
        f => f.userId === req.user.userId && f.placeId === placeId
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
        message: '¡Conseguido! Lugar eliminado de favoritos correctamente'
      });
    } catch (error) {
      console.error('Error eliminando favorito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene los favoritos del usuario
   */
  async getFavorites(req, res) {
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
  }

  /**
   * Guarda una valoración
   */
  async saveRating(req, res) {
    try {
      const { placeId } = req.params;
      const { rating, placeName } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'La valoración debe estar entre 1 y 5'
        });
      }
      
      // Verificar si ya existe una valoración
      const existingRating = ratings.find(
        r => r.userId === req.user.userId && r.placeId === placeId
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
  }

  /**
   * Obtiene las valoraciones del usuario
   */
  async getRatings(req, res) {
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
  }

  /**
   * Obtiene estadísticas del usuario
   */
  async getUserStats(req, res) {
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
  }
}

module.exports = new SpainController();
