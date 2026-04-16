import { Place, User, Counter, Search, Rating, Theme, FilterOptions } from './types.js';
import SpainlyState from './hooks/SpainlyState.js';
import { PlaceCard } from './components/PlaceCard.js';
import { SearchBar } from './components/SearchBar.js';
import { Modal } from './components/Modal.js';

// Clase optimizada con TypeScript y componentes modulares
class SpainlyApp {
    private static instance: SpainlyApp;
    private state: SpainlyState;
    private searchBar: SearchBar;
    private currentView: string = 'home';

    private constructor() {
        this.state = SpainlyState.getInstance();
        this.searchBar = new SearchBar({
            onSearch: (query: string, filters: FilterOptions) => this.handleSearch(query, filters),
            loading: false
        });
        this.init();
    }

    // Singleton pattern
    public static getInstance(): SpainlyApp {
        if (!SpainlyApp.instance) {
            SpainlyApp.instance = new SpainlyApp();
        }
        return SpainlyApp.instance;
    }

    private async init(): Promise<void> {
        try {
            await this.loadPlaces();
            this.setupEventListeners();
            this.renderCurrentView();
            this.state.showMessage('conseguido', 'Aplicación iniciada correctamente');
            this.connectToServer();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.state.showMessage('error', 'Error al iniciar la aplicación');
        }
    }

    private async connectToServer(): Promise<void> {
        try {
            const API_URL = this.getApiUrl('/api/health');
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.success) {
                this.state.showMessage('conseguido', data.message);
            }
        } catch (error) {
            console.error('Error conectando al servidor:', error);
        }
    }

    private getApiUrl(endpoint: string): string {
        const baseUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000' 
            : '';
        return `${baseUrl}${endpoint}`;
    }

    private async loadPlaces(): Promise<void> {
        // 40 lugares famosos de España con imágenes reales
        const places: Place[] = [
            {
                id: 1,
                name: "Sagrada Familia",
                province: "barcelona",
                category: "montaña",
                schedule: "09-20",
                image: "images/lugares/Sagrada Familia.png",
                description: "Templo católico en construcción, obra maestra de Gaudí",
                fullDescription: "La Sagrada Familia es el símbolo más reconocido de Barcelona. Esta basílica, diseñada por Antoni Gaudí, comenzó su construcción en 1882 y aún sigue en obras. Su arquitectura única combina elementos góticos y modernistas.",
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
                fullDescription: "La Playa de la Concha es considerada una de las más bellas del mundo. Con su forma de concha y vistas espectaculares, ofrece arena fina y aguas tranquilas.",
                rating: 4.7,
                reviews: 8930
            },
            {
                id: 3,
                name: "Alhambra",
                province: "granada",
                category: "montaña",
                schedule: "08-19",
                image: "images/lugares/Alhambra.jpg",
                description: "Palacio nazarí y conjunto monumental de Granada",
                fullDescription: "La Alhambra es el monumento más visitado de España. Este complejo palaciego-fortaleza del siglo XIII combina arquitectura islámica con jardines exuberantes.",
                rating: 4.9,
                reviews: 22150
            },
            {
                id: 4,
                name: "Park Güell",
                province: "barcelona",
                category: "montaña",
                schedule: "10-18",
                image: "images/lugares/park-guell.jpg",
                description: "Parque público con mosaicos de Gaudí",
                fullDescription: "El Park Güell es otro de los tesoros de Gaudí en Barcelona. Diseñado como urbanización privada, se convirtió en parque público.",
                rating: 4.6,
                reviews: 12450
            },
            {
                id: 5,
                name: "Mezquita de Córdoba",
                province: "cordoba",
                category: "monumento",
                schedule: "10-19",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/La_Mezquita_de_C%C3%B3rdoba_-_interior.jpg/400/300.jpg",
                description: "Catedral-mezquita del siglo VIII",
                fullDescription: "La Mezquita-Catedral de Córdoba es un monumento único. Sus más de 850 columnas de mármol, jaspe y granito crean un bosque impresionante.",
                rating: 4.8,
                reviews: 18900
            },
            {
                id: 6,
                name: "Playa de Bolnuevo",
                province: "murcia",
                category: "playa",
                schedule: "24h",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Las_Gredas_de_Bolnuevo.jpg/400/300.jpg",
                description: "Playa con formación rocas únicas en Murcia",
                fullDescription: "Las Gredas de Bolnuevo son unas formaciones rocosas espectaculares junto a esta playa de aguas tranquilas.",
                rating: 4.4,
                reviews: 6540
            },
            {
                id: 7,
                name: "Teide",
                province: "tenerife",
                category: "montaña",
                schedule: "09-17",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Naranjo_de_Bulnes_-_Picos_de_Europa.jpg/400/300.jpg",
                description: "Volcán más alto de España",
                fullDescription: "El Teide es el pico más alto de España y el tercer volcán más grande del mundo. Su paisaje lunar y las vistas desde la cima son espectaculares.",
                rating: 4.8,
                reviews: 19870
            },
            {
                id: 8,
                name: "Alcázar de Segovia",
                province: "segovia",
                category: "monumento",
                schedule: "10-18",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Alc%C3%A1zar_de_Segovia_04.jpg/400/300.jpg",
                description: "Castillo inspirador de Disney",
                fullDescription: "El Alcázar de Segovia es una fortaleza palaciega que data del siglo XII. Su silueta inspiró el castillo de la Cenicienta de Disney.",
                rating: 4.8,
                reviews: 15670
            },
            {
                id: 9,
                name: "Playa de Ses Illetes",
                province: "formentera",
                category: "playa",
                schedule: "24h",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ses_Illetes_Beach_Formentera.jpg/400/300.jpg",
                description: "Playa paradisíaca en Formentera",
                fullDescription: "Ses Illetes es considerada una de las playas más bonitas del Mediterráneo. Sus aguas turquesas y arena blanca la hacen parecer el Caribe.",
                rating: 4.9,
                reviews: 8760
            },
            {
                id: 10,
                name: "Monasterio de El Escorial",
                province: "madrid",
                category: "monumento",
                schedule: "10-18",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/El_Escorial_from_the_air_-_2017.jpg/400/300.jpg",
                description: "Monumento renacentista del siglo XVI",
                fullDescription: "El Monasterio de San Lorenzo de El Escorial es una de las maravillas de la arquitectura renacentista. Construido por Felipe II.",
                rating: 4.7,
                reviews: 13450
            }
        ];

        this.state.setPlaces(places);
    }

    private setupEventListeners(): void {
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('submit', this.handleGlobalSubmit.bind(this));
        this.setupNavigationListeners();
        this.setupThemeToggle();
    }

    private setupNavigationListeners(): void {
        const navButtons = [
            'searchBtn', 'favoritesBtn', 'ratingsBtn', 'profileBtn',
            'registerBtn', 'loginBtn', 'reportsBtn', 'aboutBtn'
        ];

        navButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleNavigation(btnId);
                });
            }
        });
    }

    private setupThemeToggle(): void {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    private handleGlobalClick(e: Event): void {
        const target = e.target as HTMLElement;
        
        if (target.closest('[data-close-modal]')) {
            const modalId = target.closest('[data-close-modal]')?.getAttribute('data-close-modal');
            if (modalId) this.closeModal(modalId);
        }
        
        if (target.closest('.place-card')) {
            const placeId = parseInt(target.closest('.place-card')?.getAttribute('data-place-id') || '0');
            if (placeId) this.showPlaceDetails(placeId);
        }
    }

    private handleGlobalSubmit(e: Event): void {
        const target = e.target as HTMLFormElement;
        
        if (target.id === 'registerForm') {
            this.handleRegister(e);
        } else if (target.id === 'loginForm') {
            this.handleLogin(e);
        }
    }

    private handleNavigation(btnId: string): void {
        const navigationMap: Record<string, () => void> = {
            'searchBtn': () => this.goToSearch(),
            'favoritesBtn': () => this.goToFavorites(),
            'ratingsBtn': () => this.goToRatings(),
            'profileBtn': () => this.goToProfile(),
            'registerBtn': () => this.openModal('registerModal'),
            'loginBtn': () => this.openModal('loginModal'),
            'reportsBtn': () => this.goToReports(),
            'aboutBtn': () => this.goToAbout()
        };

        const handler = navigationMap[btnId];
        if (handler) handler();
    }

    private renderCurrentView(): void {
        const viewMap: Record<string, () => void> = {
            'home': () => this.renderHome(),
            'search': () => this.renderSearch(),
            'favorites': () => this.renderFavorites(),
            'ratings': () => this.renderRatings(),
            'profile': () => this.renderProfile(),
            'reports': () => this.renderReports(),
            'about': () => this.renderAbout()
        };

        const renderer = viewMap[this.currentView] || viewMap['home'];
        if (renderer) {
            renderer();
        }
        this.state.updateCountersDisplay();
    }

    private renderHome(): void {
        const container = document.getElementById('app');
        if (!container) return;

        const topPlaces = this.state.getTopRatedPlaces(6);
        const allPlaces = this.state.getPlaces();

        container.innerHTML = `
            <main class="container mx-auto px-4 py-8">
                <section class="mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        <i class="fas fa-star text-spain-yellow mr-3"></i>
                        Lugares Recomendados
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${topPlaces.map(place => this.createPlaceCard(place)).join('')}
                    </div>
                </section>
                
                <section>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        <i class="fas fa-map-marked-alt text-spain-red mr-3"></i>
                        Todos los Lugares
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="placesContainer">
                        ${allPlaces.map(place => this.createPlaceCard(place)).join('')}
                    </div>
                </section>
            </main>
        `;
    }

    private createPlaceCard(place: Place): string {
        const placeCard = new PlaceCard({
            place,
            onDetails: (placeId: number) => this.showPlaceDetails(placeId),
            onFavorite: (placeId: number) => this.toggleFavorite(placeId),
            isFavorite: this.state.isFavorite(place.id)
        });
        
        return placeCard.render();
    }

    public openModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    public closeModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    // Métodos de navegación
    public goToSearch(): void {
        this.currentView = 'search';
        this.renderCurrentView();
        window.location.hash = '#search';
    }

    public goToFavorites(): void {
        this.currentView = 'favorites';
        this.renderCurrentView();
        window.location.hash = '#favorites';
    }

    public goToRatings(): void {
        this.currentView = 'ratings';
        this.renderCurrentView();
        window.location.hash = '#ratings';
    }

    public goToProfile(): void {
        this.currentView = 'profile';
        this.renderCurrentView();
        window.location.hash = '#profile';
    }

    public goToReports(): void {
        this.currentView = 'reports';
        this.renderCurrentView();
        window.location.hash = '#reports';
    }

    public goToAbout(): void {
        this.currentView = 'about';
        this.renderCurrentView();
        window.location.hash = '#about';
    }

    private renderSearch(): void {
        const container = document.getElementById('app');
        if (!container) return;

        container.innerHTML = `
            <main class="container mx-auto px-4 py-8">
                <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                    <i class="fas fa-arrow-left mr-2"></i>Volver
                </button>
                
                ${this.searchBar.render()}
                
                <div id="searchResults" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Los resultados de búsqueda aparecerán aquí -->
                </div>
            </main>
        `;

        this.searchBar.setupEventListeners();
    }

    private handleSearch(query: string, filters: FilterOptions): void {
        const results = this.state.searchPlaces(query, filters);
        const resultsContainer = document.getElementById('searchResults');
        
        if (resultsContainer) {
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <p class="text-xl text-gray-600 dark:text-gray-400">
                            No se encontraron resultados para "${query}"
                        </p>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = results.map(place => this.createPlaceCard(place)).join('');
            }
        }
    }

    private renderFavorites(): void {
        const container = document.getElementById('app');
        if (!container) return;

        const favoritePlaces = this.state.getFavoritePlaces();

        container.innerHTML = `
            <main class="container mx-auto px-4 py-8">
                <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                    <i class="fas fa-arrow-left mr-2"></i>Volver
                </button>
                
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                    <i class="fas fa-heart text-red-500 mr-3"></i>
                    Mis Favoritos
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${favoritePlaces.map(place => this.createPlaceCard(place)).join('')}
                </div>
                
                ${favoritePlaces.length === 0 ? `
                    <div class="text-center py-12">
                        <i class="fas fa-heart text-6xl text-gray-300 mb-4"></i>
                        <p class="text-xl text-gray-600 dark:text-gray-400">
                            No tienes lugares favoritos aún
                        </p>
                    </div>
                ` : ''}
            </main>
        `;
    }

    private renderRatings(): void {
        this.renderHome();
    }

    private renderProfile(): void {
        this.renderHome();
    }

    private renderReports(): void {
        this.renderHome();
    }

    private renderAbout(): void {
        this.renderHome();
    }

    public showPlaceDetails(placeId: number): void {
        const place = this.state.getPlaceById(placeId);
        if (!place) return;

        const container = document.getElementById('app');
        if (!container) return;

        const isFavorite = this.state.isFavorite(placeId);

        container.innerHTML = `
            <main class="container mx-auto px-4 py-8">
                <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                    <i class="fas fa-arrow-left mr-2"></i>Volver
                </button>
                
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <img src="${place.image}" alt="${place.name}" class="w-full h-96 object-cover">
                    
                    <div class="p-8">
                        <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            ${place.name}
                        </h1>
                        
                        <div class="flex items-center mb-6">
                            <i class="fas fa-star text-yellow-500 mr-2"></i>
                            <span class="text-2xl font-bold text-gray-800 dark:text-white mr-4">
                                ${place.rating}
                            </span>
                            <span class="text-gray-600 dark:text-gray-300">
                                (${place.reviews} reseñas)
                            </span>
                        </div>
                        
                        <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            ${place.fullDescription}
                        </p>
                        
                        <div class="flex space-x-4">
                            <button onclick="app.toggleFavorite(${place.id})" 
                                    class="px-6 py-3 ${isFavorite ? 'bg-red-500' : 'bg-spain-red'} text-white rounded-lg hover:bg-red-700">
                                <i class="fas fa-heart mr-2"></i>
                                ${isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            </button>
                            <button onclick="app.ratePlace(${place.id})" 
                                    class="px-6 py-3 bg-spain-yellow text-gray-800 rounded-lg hover:bg-yellow-500">
                                <i class="fas fa-star mr-2"></i>Valorar
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    public toggleFavorite(placeId: number): void {
        const isFavorite = this.state.toggleFavorite(placeId);
        this.state.showMessage('conseguido', isFavorite ? 'Lugar añadido a favoritos' : 'Lugar eliminado de favoritos');
        
        // Si estamos en la vista de detalles, actualizar el botón
        if (this.currentView === 'place-details') {
            this.showPlaceDetails(placeId);
        }
    }

    public ratePlace(placeId: number): void {
        const rating = prompt('Valora este lugar (1-5):');
        if (rating && parseInt(rating) >= 1 && parseInt(rating) <= 5) {
            this.state.showMessage('conseguido', 'Valoración guardada correctamente');
        }
    }

    public toggleTheme(): void {
        this.state.toggleTheme();
    }

    // Manejadores de eventos
    private handleRegister(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (username && email && password) {
            this.state.login(username, email);
            this.closeModal('registerModal');
            this.state.showMessage('conseguido', 'Usuario registrado correctamente');
            form.reset();
        }
    }

    private handleLogin(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (email && password) {
            const username = email.split('@')[0] || email;
            this.state.login(username, email);
            this.closeModal('loginModal');
            this.state.showMessage('conseguido', 'Sesión iniciada correctamente');
            form.reset();
        }
    }
}

// Declaración global para TypeScript
declare global {
    interface Window {
        app: SpainlyApp;
    }
}

// Inicialización de la aplicación
const app = SpainlyApp.getInstance();
window.app = app;

export default SpainlyApp;
