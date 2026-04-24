// Hook personalizado optimizado para TypeScript (sin React)
import { Place, User, Counter, Theme, FilterOptions } from '../types.js';

export class SpainlyState {
    private static instance: SpainlyState;
    private places: Place[] = [];
    private favorites: number[] = [];
    private ratings: { placeId: number; rating: number }[] = [];
    private searchHistory: string[] = [];
    private currentUser: User | null = null;
    private theme: Theme = 'light';
    private counters: Counter = {
        searches: 0,
        favorites: 0,
        ratings: 0,
        user: 0
    };
    private loading: boolean = false;

    private constructor() {
        this.loadFromStorage();
    }

    public static getInstance(): SpainlyState {
        if (!SpainlyState.instance) {
            SpainlyState.instance = new SpainlyState();
        }
        return SpainlyState.instance;
    }

    private loadFromStorage(): void {
        try {
            const favorites = localStorage.getItem('favorites');
            const ratings = localStorage.getItem('ratings');
            const searchHistory = localStorage.getItem('searchHistory');
            const user = localStorage.getItem('currentUser');
            const theme = localStorage.getItem('theme');
            const counters = localStorage.getItem('counters');

            if (favorites) this.favorites = JSON.parse(favorites);
            if (ratings) this.ratings = JSON.parse(ratings);
            if (searchHistory) this.searchHistory = JSON.parse(searchHistory);
            if (user) this.currentUser = JSON.parse(user);
            if (theme) this.theme = theme as Theme;
            if (counters) this.counters = JSON.parse(counters);
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    private saveToStorage(key: string, data: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Guardado en localStorage: ${key}`, data);
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    // Getters
    public getPlaces(): Place[] {
        return this.places;
    }

    public getFavorites(): number[] {
        return this.favorites;
    }

    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    public getTheme(): Theme {
        return this.theme;
    }

    public getCounters(): Counter {
        return this.counters;
    }

    public getLoading(): boolean {
        return this.loading;
    }

    // Setters
    public setPlaces(places: Place[]): void {
        this.places = places;
    }

    public setLoading(loading: boolean): void {
        this.loading = loading;
    }

    // Actions
    public toggleFavorite(placeId: number): boolean {
        const index = this.favorites.indexOf(placeId);
        let isFavorite: boolean;

        if (index > -1) {
            this.favorites.splice(index, 1);
            isFavorite = false;
        } else {
            this.favorites.push(placeId);
            isFavorite = true;
        }

        this.counters.favorites = this.favorites.length;
        this.saveToStorage('favorites', this.favorites);
        this.saveToStorage('counters', this.counters);

        return isFavorite;
    }

    public isFavorite(placeId: number): boolean {
        return this.favorites.includes(placeId);
    }

    public getSearchHistory(): string[] {
        return [...this.searchHistory];
    }

    public addSearch(query: string): void {
        if (!query.trim()) return;
        // Añadir al principio y eliminar duplicados
        this.searchHistory = [query, ...this.searchHistory.filter(s => s !== query)].slice(0, 20);
        this.counters.searches++;
        this.saveToStorage('searchHistory', this.searchHistory);
        this.saveToStorage('counters', this.counters);
    }

    public addRating(placeId: number, rating: number): void {
        // Verificar si ya existe una valoración para este lugar
        const existingIndex = this.ratings.findIndex(r => r.placeId === placeId);
        
        if (existingIndex > -1) {
            // Actualizar valoración existente
            const existingRating = this.ratings[existingIndex];
            if (existingRating) {
                existingRating.rating = rating;
            }
        } else {
            // Añadir nueva valoración
            this.ratings.push({ placeId, rating });
            // Incrementar contador solo cuando es una nueva valoración
            this.counters.ratings++;
        }
        
        this.saveToStorage('ratings', this.ratings);
        this.saveToStorage('counters', this.counters);
    }

    public getRating(placeId: number): number | null {
        const rating = this.ratings.find(r => r.placeId === placeId);
        return rating ? rating.rating : null;
    }

    public getTotalRatings(): number {
        return this.ratings.length;
    }

    public removeRating(placeId: number): void {
        const initialLength = this.ratings.length;
        this.ratings = this.ratings.filter(r => r.placeId !== placeId);
        
        // Solo decrementar si realmente se eliminó algo
        if (this.ratings.length < initialLength) {
            this.counters.ratings = Math.max(0, this.counters.ratings - 1);
        }
        
        this.saveToStorage('ratings', this.ratings);
        this.saveToStorage('counters', this.counters);
    }

    public searchPlaces(query: string, filters: FilterOptions): Place[] {
        let results = this.places;

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

        // Actualizar contador de búsquedas
        this.counters.searches++;
        this.saveToStorage('counters', this.counters);

        return results;
    }

    public toggleTheme(): Theme {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.saveToStorage('theme', this.theme);
        
        // Aplicar tema al DOM
        document.documentElement.classList.toggle('dark', this.theme === 'dark');
        
        return this.theme;
    }

    public register(username: string, email: string, password: string): void {
        // Crear usuario básico, el perfil completo se completa después
        this.currentUser = { username, email, password };
        this.saveToStorage('currentUser', this.currentUser);
        console.log('Usuario registrado y guardado:', { username, email, password: '***' });
    }

    public login(email: string, password: string, keepSession: boolean = false): boolean {
        // En una app real, aquí verificaríamos contra una base de datos
        // Por ahora, simulamos que el login es exitoso si hay un usuario registrado
        const storedUser = localStorage.getItem('currentUser');
        console.log('Intentando login con:', { email, password: '***' });
        console.log('Usuario en localStorage:', storedUser);
        
        if (storedUser) {
            const user = JSON.parse(storedUser);
            console.log('Comparando:', { storedEmail: user.email, inputEmail: email, match: user.email === email });
            
            if (user.email === email && user.password === password) {
                this.currentUser = { ...user, keepSession };
                this.counters.user = 1;
                this.saveToStorage('currentUser', this.currentUser);
                this.saveToStorage('counters', this.counters);
                console.log('Login exitoso');
                return true;
            } else {
                console.log('Credenciales incorrectas');
            }
        } else {
            console.log('No hay usuario registrado en localStorage');
        }
        return false;
    }

    public logout(): void {
        this.currentUser = null;
        this.counters.user = 0;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionActive');
        this.saveToStorage('counters', this.counters);
    }

    public isLoggedIn(): boolean {
        // Si hay usuario cargado en memoria, está logueado
        if (this.currentUser !== null) {
            // Asegurar que el contador refleje que hay usuario
            if (this.counters.user === 0) {
                this.counters.user = 1;
                this.saveToStorage('counters', this.counters);
            }
            return true;
        }
        return false;
    }

    public hasRegisteredUser(): boolean {
        // Verificar si existe un usuario registrado en localStorage
        const storedUser = localStorage.getItem('currentUser');
        return storedUser !== null;
    }

    public setSessionActive(active: boolean): void {
        localStorage.setItem('sessionActive', active ? 'true' : 'false');
    }

    public updateUserProfile(profileData: Partial<User>): void {
        if (this.currentUser) {
            const prevUser = { ...this.currentUser };
            this.currentUser = { ...this.currentUser, ...profileData };
            this.saveToStorage('currentUser', this.currentUser);
            console.log('Perfil actualizado. Antes:', { email: prevUser.email, password: prevUser.password ? '***' : 'none' });
            console.log('Perfil actualizado. Después:', { email: this.currentUser.email, password: this.currentUser.password ? '***' : 'none' });
        }
    }

    public updateUserPhoto(photoBase64: string): void {
        if (this.currentUser) {
            this.currentUser.photo = photoBase64;
            this.saveToStorage('currentUser', this.currentUser);
        }
    }

    // Métodos de utilidad
    public updateCountersDisplay(): void {
        // Actualizar contador de favoritos
        const favoriteCountElement = document.getElementById('favoriteCount');
        if (favoriteCountElement) {
            favoriteCountElement.textContent = this.counters.favorites.toString();
        }
        
        // Actualizar contador de valoraciones
        const ratingCountElement = document.getElementById('ratingCount');
        if (ratingCountElement) {
            ratingCountElement.textContent = this.counters.ratings.toString();
        }
        
        // Actualizar contador de usuario
        const userCountElement = document.getElementById('userCount');
        if (userCountElement) {
            userCountElement.textContent = this.counters.user.toString();
        }
    }

    public showMessage(type: 'conseguido' | 'error', message: string): void {
        const elementId = type === 'conseguido' ? 'conseguidoMessage' : 'errorMessage';
        const element = document.getElementById(elementId);
        
        if (element) {
            element.textContent = type === 'conseguido' ? `¡Conseguido! ${message}` : message;
            element.classList.remove('hidden');
            setTimeout(() => element.classList.add('hidden'), 3000);
        }
    }

    public getPlaceById(id: number): Place | undefined {
        return this.places.find(place => place.id === id);
    }

    public getFavoritePlaces(): Place[] {
        return this.places.filter(place => this.favorites.includes(place.id));
    }

    public getPlacesByCategory(category: 'playa' | 'montaña' | 'monumento'): Place[] {
        return this.places.filter(place => place.category === category);
    }

    public getPlacesByProvince(province: string): Place[] {
        return this.places.filter(place => place.province === province);
    }

    public getTopRatedPlaces(limit: number = 6): Place[] {
        return this.places
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
}

export default SpainlyState;
