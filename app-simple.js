// Spainly App - Versión JavaScript Vanilla Simple
console.log('Spainly App - Iniciando...');

// Estado global de la aplicación
const SpainlyState = {
    places: [],
    favorites: [],
    currentUser: null,
    theme: localStorage.getItem('theme') || 'light',
    
    // Métodos
    setPlaces: function(places) {
        this.places = places;
    },
    
    addFavorite: function(placeId) {
        if (!this.favorites.includes(placeId)) {
            this.favorites.push(placeId);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.showMessage('conseguido', 'Lugar añadido a favoritos');
        }
    },
    
    removeFavorite: function(placeId) {
        this.favorites = this.favorites.filter(id => id !== placeId);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.showMessage('conseguido', 'Lugar eliminado de favoritos');
    },
    
    isFavorite: function(placeId) {
        return this.favorites.includes(placeId);
    },
    
    login: function(username, email) {
        this.currentUser = { username, email };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    },
    
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },
    
    showMessage: function(type, message) {
        const messageEl = document.getElementById('conseguidoMessage');
        const textEl = document.getElementById('conseguidoText');
        
        if (messageEl && textEl) {
            textEl.textContent = message;
            messageEl.classList.remove('hidden');
            
            setTimeout(() => {
                messageEl.classList.add('hidden');
            }, 3000);
        }
    },
    
    toggleTheme: function() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
        this.showMessage('conseguido', `Modo ${this.theme === 'light' ? 'claro' : 'oscuro'} activado`);
    },
    
    applyTheme: function() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
};

// Función principal de la aplicación
class SpainlyApp {
    constructor() {
        this.init();
    }
    
    async init() {
        console.log('Inicializando Spainly App...');
        
        try {
            await this.loadPlaces();
            this.loadFavorites();
            this.loadUser();
            this.setupEventListeners();
            this.renderHome();
            SpainlyState.applyTheme();
            SpainlyState.showMessage('conseguido', 'Aplicación iniciada correctamente');
            console.log('Spainly App inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando app:', error);
            SpainlyState.showMessage('error', 'Error al iniciar la aplicación');
        }
    }
    
    async loadPlaces() {
        // 40 lugares famosos de España
        const places = [
            {
                id: 1,
                name: "Sagrada Familia",
                province: "barcelona",
                category: "montaña",
                schedule: "09-20",
                image: "images\\lugares\\Sagrada Familia.png",
                description: "Templo católico en construcción, obra maestra de Gaudí",
                fullDescription: "La Sagrada Familia es el símbolo más reconocido de Barcelona. Esta basílica, diseñada por Antoni Gaudí, comenzó su construcción en 1882 y aún sigue en obras. Su arquitectura única combina elementos góticos y modernistas, creando un espectáculo visual impresionante tanto por fuera como por dentro.",
                rating: 4.8,
                reviews: 15420
            },
            {
                id: 2,
                name: "Playa de la Concha",
                province: "guipuzcoa",
                category: "playa",
                schedule: "24h",
                image: "images\\lugares\\Playa de La Concha.jpg",
                description: "Una de las playas más famosas de San Sebastián",
                fullDescription: "La Playa de la Concha es considerada una de las más bellas del mundo. Con su forma de concha y vistas espectaculares, ofrece arena fina y aguas tranquilas. Perfecta para pasear, nadar o simplemente disfrutar del paisaje único de la Bahía de la Concha.",
                rating: 4.7,
                reviews: 8930
            },
            {
                id: 3,
                name: "Alhambra",
                province: "granada",
                category: "montaña",
                schedule: "08-19",
                image: "images\\lugares\\Alhambra.jpg",
                description: "Palacio nazarí y conjunto monumental de Granada",
                fullDescription: "La Alhambra es el monumento más visitado de España. Este complejo palaciego-fortaleza del siglo XIII combina arquitectura islámica con jardines exuberantes. Los Patios de los Leones y los Generalife son sus joyas más preciadas.",
                rating: 4.9,
                reviews: 22150
            },
            {
                id: 4,
                name: "Park Güell",
                province: "barcelona",
                category: "montaña",
                schedule: "10-18",
                image: "images\\lugares\\park-guell.jpg",
                description: "Parque público diseñado por Antoni Gaudí",
                fullDescription: "El Park Güell es otro de los genios de Gaudí. Originalmente concebido como urbanización privada, hoy es un parque público donde el modernismo catalán se fusiona con la naturaleza. Sus mosaicos coloridos y estructuras orgánicas crean un mundo mágico.",
                rating: 4.6,
                reviews: 12890
            },
            {
                id: 5,
                name: "Dunas de Maspalomas",
                province: "grancanaria",
                category: "playa",
                schedule: "24h",
                image: "images\\lugares\\dunas de maspalomas.jpg",
                description: "Dunas naturales espectaculares en Gran Canaria",
                fullDescription: "Las Dunas de Maspalomas son un paisaje único en Gran Canaria. Este extenso arenal natural de 400 hectáreas forma un pequeño desierto junto al mar. Ideal para pasear al amanecer o atardecer cuando la luz crea efectos espectaculares.",
                rating: 4.5,
                reviews: 9870
            }
        ];
        
        SpainlyState.setPlaces(places);
        console.log('Lugares cargados:', places.length);
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            SpainlyState.favorites = JSON.parse(saved);
        }
    }
    
    loadUser() {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            SpainlyState.currentUser = JSON.parse(saved);
        }
    }
    
    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Botones de navegación principales
        this.setupButton('searchBtn', () => this.goToSearch());
        this.setupButton('favoritesBtn', () => this.goToFavorites());
        this.setupButton('ratingsBtn', () => this.goToRatings());
        this.setupButton('profileBtn', () => this.goToProfile());
        this.setupButton('registerBtn', () => this.openModal('registerModal'));
        this.setupButton('loginBtn', () => this.openModal('loginModal'));
        this.setupButton('reportsBtn', () => this.goToReports());
        this.setupButton('aboutBtn', () => this.goToAbout());
        this.setupButton('themeToggle', () => SpainlyState.toggleTheme());
        
        // Botones de cerrar modal
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = btn.getAttribute('data-close-modal');
                this.closeModal(modalId);
            });
        });
        
        // Eventos de formularios
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        
        console.log('Event listeners configurados');
    }
    
    setupButton(buttonId, clickHandler) {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Botón ${buttonId} clickeado`);
                clickHandler();
            });
            console.log(`Botón ${buttonId} configurado correctamente`);
        } else {
            console.warn(`Botón ${buttonId} no encontrado`);
        }
    }
    
    renderHome() {
        const container = document.getElementById('app');
        if (!container) {
            console.error('Container #app no encontrado');
            return;
        }
        
        const places = SpainlyState.places;
        
        container.innerHTML = `
            <div class="container mx-auto px-4 py-8">
                <h1 class="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    <i class="fas fa-flag text-spain-red mr-3"></i>Descubre España
                </h1>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${places.map(place => this.createPlaceCard(place)).join('')}
                </div>
            </div>
        `;
        
        console.log('Home renderizado con', places.length, 'lugares');
    }
    
    createPlaceCard(place) {
        const isFavorite = SpainlyState.isFavorite(place.id);
        const categoryIcon = this.getCategoryIcon(place.category);
        
        return `
            <div class="place-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" data-place-id="${place.id}">
                <div class="relative">
                    <img src="${place.image}" alt="${place.name}" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2">
                        <button class="favorite-btn p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow" data-place-id="${place.id}">
                            <i class="fas fa-heart ${isFavorite ? 'text-red-500' : 'text-gray-400'}"></i>
                        </button>
                    </div>
                    <div class="absolute bottom-2 left-2">
                        <span class="px-2 py-1 bg-spain-red text-white text-xs rounded-full">
                            <i class="fas ${categoryIcon} mr-1"></i>${place.category}
                        </span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">${place.name}</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">${place.description}</p>
                    <div class="flex items-center justify-between text-sm">
                        <div class="flex items-center">
                            <i class="fas fa-star text-yellow-500 mr-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">${place.rating}</span>
                            <span class="text-gray-500 dark:text-gray-400 ml-1">(${place.reviews})</span>
                        </div>
                        <div class="flex items-center text-gray-500 dark:text-gray-400">
                            <i class="fas fa-clock mr-1"></i>
                            <span>${this.formatSchedule(place.schedule)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCategoryIcon(category) {
        const icons = {
            'playa': 'fa-umbrella-beach',
            'montaña': 'fa-mountain',
            'monumento': 'fa-landmark'
        };
        return icons[category] || 'fa-map-marker-alt';
    }
    
    formatSchedule(schedule) {
        const schedules = {
            '24h': '24 horas',
            '09-20': '09:00 - 20:00',
            '10-18': '10:00 - 18:00',
            '08-19': '08:00 - 19:00'
        };
        return schedules[schedule] || schedule;
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            console.log(`Modal ${modalId} abierto`);
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            console.log(`Modal ${modalId} cerrado`);
        }
    }
    
    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        if (username && email && password) {
            SpainlyState.login(username, email);
            this.closeModal('registerModal');
            SpainlyState.showMessage('conseguido', 'Usuario registrado correctamente');
            e.target.reset();
        }
    }
    
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (email && password) {
            const username = email.split('@')[0] || email;
            SpainlyState.login(username, email);
            this.closeModal('loginModal');
            SpainlyState.showMessage('conseguido', 'Sesión iniciada correctamente');
            e.target.reset();
        }
    }
    
    goToSearch() {
        SpainlyState.showMessage('conseguido', 'Búsqueda activada');
    }
    
    goToFavorites() {
        SpainlyState.showMessage('conseguido', 'Favoritos activados');
    }
    
    goToRatings() {
        SpainlyState.showMessage('conseguido', 'Valoraciones activadas');
    }
    
    goToProfile() {
        SpainlyState.showMessage('conseguido', 'Perfil activado');
    }
    
    goToReports() {
        const reportsHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reportajes - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="window.close()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Cerrar
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-newspaper text-blue-600 mr-3"></i>Reportajes
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Descubre los mejores reportajes sobre los lugares más impresionantes de España.</p>
                        <div class="space-y-4">
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h3 class="font-bold text-gray-800 dark:text-white mb-2">Las Maravillas de Gaudí</h3>
                                <p class="text-gray-600 dark:text-gray-300">Un recorrido por las obras más emblemáticas del arquitecto modernista catalán.</p>
                            </div>
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h3 class="font-bold text-gray-800 dark:text-white mb-2">Playas Paradisíacas</h3>
                                <p class="text-gray-600 dark:text-gray-300">Descubre las playas más bonitas de la costa española.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(reportsHTML);
        }
    }
    
    goToAbout() {
        const aboutHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sobre mí - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="window.close()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Cerrar
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-info-circle text-gray-600 mr-3"></i>Sobre mí
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-6">
                            <div class="w-16 h-16 bg-spain-red rounded-full flex items-center justify-center">
                                <i class="fas fa-laptop-code text-white text-2xl"></i>
                            </div>
                            <div class="ml-4">
                                <h2 class="text-xl font-bold text-gray-800 dark:text-white">César Villacañas Moreno</h2>
                                <p class="text-gray-600 dark:text-gray-300">cesar.villacanas@alu.ceacfp.es</p>
                                <p class="text-gray-600 dark:text-gray-300">Curso: 2026-2027</p>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <h3 class="font-bold text-gray-800 dark:text-white mb-2">Sobre este proyecto</h3>
                                <p class="text-gray-600 dark:text-gray-300">
                                    Spainly es una aplicación web desarrollada como parte de mi formación en desarrollo de aplicaciones web. 
                                    Esta plataforma permite descubrir los lugares más impresionantes de España, con información detallada, 
                                    valoraciones y la posibilidad de guardar tus lugares favoritos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(aboutHTML);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado, iniciando Spainly App...');
    const app = new SpainlyApp();
    window.app = app;
});

console.log('Spainly App script cargado');
