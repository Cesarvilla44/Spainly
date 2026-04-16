import { useState, useEffect, useCallback } from 'react';
import { Place, User, Counter, Theme, FilterOptions } from '../types.js';

export const useSpainlyState = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [counters, setCounters] = useState<Counter>({
        searches: 0,
        favorites: 0,
        ratings: 0,
        user: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState<Place[]>([]);

    // Cargar datos iniciales
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            // Cargar lugares
            await loadPlaces();
            
            // Cargar datos del localStorage
            loadFavorites();
            loadUser();
            loadCounters();
            loadTheme();
            
            setLoading(false);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setLoading(false);
        }
    };

    const loadPlaces = async () => {
        // Simular carga de lugares (en producción sería una API)
        const mockPlaces: Place[] = [
            {
                id: 1,
                name: "Sagrada Familia",
                province: "barcelona",
                category: "montaña",
                schedule: "09-20",
                image: "images/lugares/Sagrada Familia.png",
                description: "Templo católico en construcción, obra maestra de Gaudí",
                fullDescription: "La Sagrada Familia es el símbolo más reconocido de Barcelona...",
                rating: 4.8,
                reviews: 15420
            },
            {
                id: 2,
                name: "Playa de la Concha",
                province: "guipuzcoa",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/Playa de La Concha.jpg",
                description: "Una de las playas más famosas de San Sebastián",
                fullDescription: "La Playa de la Concha es considerada una de las más bellas del mundo...",
                rating: 4.7,
                reviews: 8930
            }
            // ... más lugares
        ];
        setPlaces(mockPlaces);
    };

    const loadFavorites = () => {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    };

    const loadUser = () => {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            setCurrentUser(JSON.parse(saved));
        }
    };

    const loadCounters = () => {
        const saved = localStorage.getItem('counters');
        if (saved) {
            setCounters(JSON.parse(saved));
        }
    };

    const loadTheme = () => {
        const saved = localStorage.getItem('theme') as Theme;
        if (saved) {
            setTheme(saved);
        }
    };

    // Acciones optimizadas con useCallback
    const toggleFavorite = useCallback((placeId: number) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(placeId)
                ? prev.filter(id => id !== placeId)
                : [...prev, placeId];
            
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            
            // Actualizar contador
            setCounters(prevCounters => ({
                ...prevCounters,
                favorites: newFavorites.length
            }));
            
            return newFavorites;
        });
    }, []);

    const searchPlaces = useCallback((query: string, filters: FilterOptions) => {
        let results = places;

        // Filtrar por query
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(place => 
                place.name.toLowerCase().includes(lowerQuery) ||
                place.description.toLowerCase().includes(lowerQuery) ||
                place.province.toLowerCase().includes(lowerQuery)
            );
        }

        // Aplicar filtros
        if (filters.province) {
            results = results.filter(place => place.province === filters.province);
        }
        if (filters.category) {
            results = results.filter(place => place.category === filters.category);
        }
        if (filters.schedule) {
            results = results.filter(place => place.schedule === filters.schedule);
        }

        setSearchResults(results);
        
        // Actualizar contador de búsquedas
        setCounters(prev => ({
            ...prev,
            searches: prev.searches + 1
        }));
    }, [places]);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Aplicar tema al DOM
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, [theme]);

    const login = useCallback((user: User) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        setCounters(prev => ({
            ...prev,
            user: prev.user + 1
        }));
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    }, []);

    const isFavorite = useCallback((placeId: number) => {
        return favorites.includes(placeId);
    }, [favorites]);

    // Aplicar tema al cambiar
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return {
        // Estado
        places,
        favorites,
        currentUser,
        theme,
        counters,
        loading,
        searchResults,
        
        // Acciones
        toggleFavorite,
        searchPlaces,
        toggleTheme,
        login,
        logout,
        isFavorite,
        
        // Utilidades
        setSearchResults
    };
};

export default useSpainlyState;
