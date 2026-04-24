import { Place, User, Counter, Search, Rating, Theme, FilterOptions } from './types.js';
import SpainlyState from './hooks/SpainlyState.js';
import { PlaceCard } from './components/PlaceCard.js';
import { SearchBar } from './components/SearchBar.js';
import { Modal } from './components/Modal.js';

// Declaración global para TypeScript
declare global {
    interface Window {
        app: SpainlyApp;
    }
}

// Clase optimizada con TypeScript y componentes modulares
class SpainlyApp {
    private static instance: SpainlyApp;
    private state: SpainlyState;
    private searchBar: SearchBar;
    private currentView: string = 'home';
    private homeMainContent: string = '';

    private constructor() {
        this.state = SpainlyState.getInstance();
        this.searchBar = new SearchBar({
            onSearch: (query: string, filters: FilterOptions) => this.handleSearch(query, filters),
            loading: false
        });
        // Ya no usamos homeSearchBar, usamos HTML directo
        console.log('SpainlyApp inicializado con búsqueda directa en el home');
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
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

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
            ? 'http://localhost:3001' 
            : '';
        return `${baseUrl}${endpoint}`;
    }

    private async loadPlaces(): Promise<void> {
        // 40 lugares famosos de España
        const places: Place[] = [
            {
                id: 1,
                name: "Sagrada Familia",
                province: "barcelona",
                category: "monumento",
                schedule: "09-20",
                image: "images/lugares/Sagrada Familia.png",
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
                image: "images/lugares/Playa de la Concha.jpg",
                description: "Una de las playas más famosas de San Sebastián",
                fullDescription: "La Playa de la Concha es considerada una de las más bellas del mundo. Con su forma de concha y vistas espectaculares, ofrece arena fina y aguas tranquilas. Perfecta para pasear, nadar o simplemente disfrutar del paisaje único de la Bahía de la Concha.",
                rating: 4.7,
                reviews: 8930
            },
            {
                id: 3,
                name: "Alhambra",
                province: "granada",
                category: "monumento",
                schedule: "08-19",
                image: "images/lugares/Alhambra.jpg",
                description: "Palacio nazarí y conjunto monumental de Granada",
                fullDescription: "La Alhambra es el monumento más visitado de España. Este complejo palaciego-fortaleza del siglo XIII combina arquitectura islámica con jardines exuberantes. Los Patios de los Leones y los Generalife son sus joyas más preciadas.",
                rating: 4.9,
                reviews: 22150
            },
            {
                id: 4,
                name: "Park Güell",
                province: "barcelona",
                category: "monumento",
                schedule: "10-18",
                image: "images/lugares/park-guell.jpg",
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
                image: "images/lugares/dunas de maspalomas.jpg",
                description: "Dunas naturales espectaculares en Gran Canaria",
                fullDescription: "Las Dunas de Maspalomas son un paisaje único en Gran Canaria. Este extenso arenal natural de 400 hectáreas forma un pequeño desierto junto al mar. Ideal para pasear al amanecer o atardecer cuando la luz crea efectos espectaculares.",
                rating: 4.5,
                reviews: 9870
            },
            {
                id: 6,
                name: "Mezquita de Córdoba",
                province: "cordoba",
                category: "monumento",
                schedule: "10-19",
                image: "images/lugares/mezquita de cordoba.jpg",
                description: "Catedral de estilo califal con bosque de columnas",
                fullDescription: "La Mezquita-Catedral de Córdoba es un monumento único. Sus más de 850 columnas de mármol, jaspe y granito crean un bosque impresionante. La alternancia de arcos blancos y rojos es una obra maestra del arte islámico.",
                rating: 4.8,
                reviews: 18900
            },
            {
                id: 7,
                name: "Playa de Bolnuevo",
                province: "murcia",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/bolnuevo-en-costa-calida-españa-1024x683.jpg",
                description: "Playa con formación rocas únicas en Murcia",
                fullDescription: "Las Gredas de Bolnuevo son unas formaciones rocosas espectaculares junto a esta playa de aguas tranquilas. Las rocas erosionadas por el viento y el mar crean formas caprichosas que parecen sacadas de otro planeta.",
                rating: 4.4,
                reviews: 6540
            },
            {
                id: 8,
                name: "Teide",
                province: "tenerife",
                category: "montaña",
                schedule: "09-18",
                image: "images/lugares/teide.jpeg",
                description: "Volcán más alto de España y parque nacional",
                fullDescription: "El Teide, con sus 3.718 metros, es el pico más alto de España. Su paisaje volcánico parece lunar, y el teleférico te lleva casi a la cima para disfrutar de vistas espectaculares del archipiélago canario.",
                rating: 4.7,
                reviews: 15670
            },
            {
                id: 9,
                name: "Playa de la Victoria",
                province: "cadiz",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa la victoria.jpg",
                description: "Playa urbana de Cádiz con bandera azul",
                fullDescription: "La Playa de la Victoria es la más popular de Cádiz. Con más de 3 km de arena dorada y aguas tranquilas, es perfecta para familias. Su paseo marítimo está lleno de bares donde disfrutar del pescado fresco.",
                rating: 4.3,
                reviews: 7890
            },
            {
                id: 10,
                name: "Alcázar de Segovia",
                province: "segovia",
                category: "monumento",
                schedule: "10-18",
                image: "images/lugares/AlcazardeSegovia_-linecar.jpg",
                description: "Castillo inspirador de Disney",
                fullDescription: "El Alcázar de Segovia es una fortaleza palaciega que data del siglo XII. Su silueta inspiró el castillo de la Cenicienta de Disney. Desde sus torres se contempla un paisaje impresionante.",
                rating: 4.8,
                reviews: 15670
            },
            {
                id: 11,
                name: "Playa de Ses Illetes",
                province: "formentera",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/ses illetes.jpg",
                description: "Playa paradisíaca en Formentera",
                fullDescription: "Ses Illetes es considerada una de las playas más bonitas del Mediterráneo. Sus aguas turquesas y arena blanca la hacen parecer el Caribe. El acceso es limitado para preservar este paraíso natural.",
                rating: 4.9,
                reviews: 8760
            },
            {
                id: 12,
                name: "Monasterio de El Escorial",
                province: "madrid",
                category: "monumento",
                schedule: "10-18",
                image: "images/lugares/Monasterio-de-El-Escorial-historia-y-legado-cultural.jpg",
                description: "Monumento renacentista del siglo XVI",
                fullDescription: "El Monasterio de San Lorenzo de El Escorial es una de las maravillas de la arquitectura renacentista. Construido por Felipe II, combina palacio, basílica, biblioteca y monasterio en un complejo monumental.",
                rating: 4.7,
                reviews: 13450
            },
            {
                id: 13,
                name: "Playa de Rodas",
                province: "pontevedra",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/praia-rodas-beach-islas-cies.jpg",
                description: "La playa más famosa de las Islas Cíes",
                fullDescription: "La Playa de Rodas en las Islas Cíes es un paraíso accesible solo en barco. Sus aguas cristalinas y arena blanca la hacen perfecta para bucear y relajarse. El parque natural la protege manteniéndola virgen.",
                rating: 4.8,
                reviews: 10230
            },
            {
                id: 14,
                name: "Ciudad de las Artes y las Ciencias",
                province: "valencia",
                category: "monumento",
                schedule: "10-19",
                image: "images/lugares/ciudad de la ciencia y las artes.jpg",
                description: "Complejo arquitectónico y cultural de Santiago Calatrava",
                fullDescription: "La Ciudad de las Artes y las Ciencias es un ejemplo de arquitectura futurista. Diseñada por Santiago Calatrava, sus edificios blancos y formas orgánicas crean un paisaje único. El Oceanográfico es el mayor acuario de Europa.",
                rating: 4.4,
                reviews: 18900
            },
            {
                id: 15,
                name: "Playa de Mónsul",
                province: "almeria",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/monsul-2.jpg",
                description: "Playa volcánica en el Cabo de Gata",
                fullDescription: "La Playa de Mónsul es famosa por su dunas de arena volcánica oscura y su peña en el mar. Fue escenario de películas como Indiana Jones. Sus aguas transparentes y paisaje árido la hacen única.",
                rating: 4.6,
                reviews: 7230
            },
            {
                id: 16,
                name: "Guggenheim Bilbao",
                province: "bilbao",
                category: "monumento",
                schedule: "10-20",
                image: "images/lugares/museoguggenheimbilbao1.jpg",
                description: "Museo de arte contemporáneo de Frank Gehry",
                fullDescription: "El Museo Guggenheim Bilbao transformó la ciudad. Su arquitectura revolucionaria con titanio curvado refleja la luz del río Nervión. Alberga arte contemporáneo de primer nivel y es un icono del siglo XX.",
                rating: 4.5,
                reviews: 16780
            },
            {
                id: 17,
                name: "Playa de la Caleta",
                province: "cadiz",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa de la caleta.jpg",
                description: "Playa histórica donde aterrizó Colón",
                fullDescription: "La Playa de la Caleta es la única playa de arena en el casco antiguo de Cádiz. Su historia es legendaria, se dice que fue el último lugar europeo que pisó Cristóbal Colón antes de llegar a América.",
                rating: 4.3,
                reviews: 6780
            },
            {
                id: 18,
                name: "Acueducto de Segovia",
                province: "segovia",
                category: "monumento",
                schedule: "24h",
                image: "images/lugares/Aqueduct_of_Segovia_02.jpg",
                description: "Obra de ingeniería romana del siglo I",
                fullDescription: "El Acueducto de Segovia es una maravilla de la ingeniería romana. Con sus 167 arcos y más de 15 km de longitud, transportaba agua desde la Sierra de Guadarrama hasta la ciudad. Después de 2.000 años sigue impresionante.",
                rating: 4.7,
                reviews: 13450
            },
            {
                id: 19,
                name: "Playas de Benidorm",
                province: "alicante",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa de benidorm.jpeg",
                description: "Playas de Levante y Poniente en Benidorm",
                fullDescription: "Benidorm tiene dos playas principales: Levante y Poniente. Con aguas tranquilas y arena dorada, son perfectas para familias. El skyline de la ciudad las convierte en las playas urbanas más espectaculares de España.",
                rating: 4.2,
                reviews: 21340
            },
            {
                id: 20,
                name: "Catedral de Burgos",
                province: "burgos",
                category: "monumento",
                schedule: "10-19",
                image: "images/lugares/Burgos_-_Catedral_173.jpg",
                description: "Catedral gótica del siglo XIII",
                fullDescription: "La Catedral de Burgos es una joya del gótico español. Sus agujas esbeltas y su impresionante crucero la hacen única. Alberga obras de arte de artistas como Gil de Siloé y Felipe Bigarny.",
                rating: 4.6,
                reviews: 8230
            },
            {
                id: 21,
                name: "Playa de las Teresitas",
                province: "tenerife",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa-de-las-teresitas.jpg",
                description: "Playa con arena blanca traída del Sahara",
                fullDescription: "Las Teresitas es una playa artificial creada con arena traída del Sahara. Sus aguas tranquilas y el paisaje montaña la hacen especial. Perfecta para nadar y disfrutar de vistas espectaculares del Anaga.",
                rating: 4.4,
                reviews: 9870
            },
            {
                id: 22,
                name: "Museo del Prado",
                province: "madrid",
                category: "monumento",
                schedule: "10-20",
                image: "images/lugares/museo del prado.jpg",
                description: "Uno de los museos más importantes del mundo",
                fullDescription: "El Museo del Prado alberga la mejor colección de pintura española del mundo. Obras maestras de Velázquez, Goya, El Greco y otros genios. Su edificio neoclásico es tan impresionante como su contenido.",
                rating: 4.7,
                reviews: 28900
            },
            {
                id: 23,
                name: "Playa de Zahara de los Atunes",
                province: "cadiz",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/zahara de los atunes.jpg",
                description: "Playa virgen en el parque de la Breña",
                fullDescription: "Zahara de los Atunes tiene una de las playas más vírgenes de Cádiz. Su extensión de arena dorada y aguas limpias la hacen perfecta para escapar del bullicio. El pueblo blanco en la colina completa el paisaje.",
                rating: 4.5,
                reviews: 5670
            },
            {
                id: 24,
                name: "Alcazaba de Almería",
                province: "almeria",
                category: "montaña",
                schedule: "10-18",
                image: "images/lugares/La-Alcazaba-Almería-e1695137478892.jpg",
                description: "Fortaleza musulmana del siglo X",
                fullDescription: "La Alcazaba de Almería es la mayor fortaleza musulmana de España. Construida en el siglo X, dominaba la medina y el puerto. Sus murallas y patios ofrecen vistas espectaculares de la ciudad y el mar.",
                rating: 4.4,
                reviews: 7120
            },
            {
                id: 25,
                name: "Playa de Corralejo",
                province: "fuerteventura",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa Corralejo.jpg",
                description: "Parque natural de dunas en Corralejo",
                fullDescription: "Corralejo tiene un parque natural de dunas que parece el Sahara. Las dunas de origen volcánico se unen a playas de arena blanca y aguas turquesas. Ideal para practicar windsurf y kitesurf.",
                rating: 4.6,
                reviews: 8900
            },
            {
                id: 26,
                name: "Casa Batlló",
                province: "barcelona",
                category: "monumento",
                schedule: "09-20",
                image: "images/lugares/casa batllo.jpg",
                description: "Obra maestra de Gaudí en Paseo de Gracia",
                fullDescription: "La Casa Batlló es una fantasía arquitectónica de Gaudí. Su fachada con huesos y máscaras, el interior sin líneas rectas y el tejado escamoso la hacen única. Los balcones parecen calaveras, el tejado un dragón.",
                rating: 4.7,
                reviews: 19870
            },
            {
                id: 27,
                name: "Playa de la Malvarrosa",
                province: "valencia",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa malvarosa .jpg",
                description: "Playa urbana de Valencia",
                fullDescription: "La Malvarrosa es la playa más famosa de Valencia. Con su paseo marítimo lleno de restaurantes donde disfrutar la paella, es perfecta para un día de playa y gastronomía. Sus puestas de sol son espectaculares.",
                rating: 4.3,
                reviews: 11230
            },
            {
                id: 28,
                name: "Palacio Real de Madrid",
                province: "madrid",
                category: "montaña",
                schedule: "10-18",
                image: "images/lugares/palacio real de madrid.jpg",
                description: "Residencia oficial de la familia real española",
                fullDescription: "El Palacio Real de Madrid es la residencia oficial del rey de España, aunque solo se usa para ceremonias. Con más de 3.000 habitaciones, es el palacio real más grande de Europa occidental.",
                rating: 4.5,
                reviews: 15670
            },
            {
                id: 29,
                name: "Playa de Cala Macarella",
                province: "menorca",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/cala macarella.jpg",
                description: "Calita paradisíaca en Menorca",
                fullDescription: "Cala Macarella es una de las calas más bonitas de Menorca. Sus aguas turquesas y arena blanca rodeadas de pinos la hacen un paraíso. El acceso a pie por un sendero la mantiene virgen.",
                rating: 4.8,
                reviews: 7890
            },
            {
                id: 30,
                name: "La Rioja Alta",
                province: "larioja",
                category: "montaña",
                schedule: "10-18",
                image: "images/lugares/rioja alta.jpg",
                description: "Región vinícola con bodegas centenarias",
                fullDescription: "La Rioja Alta es el corazón del vino español. Sus bodegas centenarias, viñedos infinitos y pueblos medievales crean un paisaje único. Las catas de vino y la gastronomía completan la experiencia.",
                rating: 4.6,
                reviews: 9450
            },
            {
                id: 31,
                name: "Playa de la Concha de Artedo",
                province: "asturias",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa-concha-de-artedo.jpg",
                description: "Playa rústica en el concejo de Cudillero",
                fullDescription: "La Concha de Artedo es una playa virgen rodeada de acantilados verdes. Su arena fina y aguas tranquilas la hacen perfecta para relajarse. El paisaje asturiano con sus prados y vacias la hace especial.",
                rating: 4.4,
                reviews: 4560
            },
            {
                id: 32,
                name: "Toledo",
                province: "toledo",
                category: "monumento",
                schedule: "10-18",
                image: "images/lugares/Toledo.jpg",
                description: "Ciudad de las tres culturas",
                fullDescription: "Toledo es una ciudad museo donde convivieron cristianos, musulmanes y judíos. Sus calles estrechas, la catedral gótica, la sinagoga y los mezquitas la hacen única. El Alcázar domina el paisaje.",
                rating: 4.7,
                reviews: 22340
            },
            {
                id: 33,
                name: "Playa de la Barrosa",
                province: "cadiz",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa malvarosa .jpg",
                description: "Playa de 8 km en Chiclana",
                fullDescription: "La Playa de la Barrosa tiene 8 km de arena dorada. Sus aguas poco profundas la hacen perfecta para familias. El castillo de Sancti Petri en el mar le da un toque histórico espectacular.",
                rating: 4.5,
                reviews: 12340
            },
            {
                id: 34,
                name: "Salamanca",
                province: "salamanca",
                category: "monumento",
                schedule: "10-20",
                image: "images/lugares/salamanca.jpg",
                description: "Ciudad dorada con la universidad más antigua",
                fullDescription: "Salamanca es conocida como la Ciudad Dorada por el color de su piedra. Su universidad es una de las más antiguas de Europa. La Plaza Mayor es considerada la más bella de España.",
                rating: 4.6,
                reviews: 18900
            },
            {
                id: 35,
                name: "Playa de Nerja",
                province: "malaga",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/Playa-de-Nerja.jpg",
                description: "Playas y cuevas en la Costa del Sol",
                fullDescription: "Nerja tiene playas espectaculares y las Cuevas de Nerja, un monumento natural impresionante. El Balcón de Europa ofrece vistas espectaculares del mar Mediterráneo y las montañas.",
                rating: 4.4,
                reviews: 15670
            },
            {
                id: 36,
                name: "Santiago de Compostela",
                province: "lugo",
                category: "monumento",
                schedule: "10-19",
                image: "images/lugares/Santiago-de-Compostela-scaled-e1705319664528.jpeg",
                description: "Destino del Camino de Santiago",
                fullDescription: "Santiago de Compostela es una de las ciudades más sagradas del cristianismo. Su catedral barroca es la meta del Camino. Las calles del casco antiguo están llenas de historia y espiritualidad.",
                rating: 4.8,
                reviews: 26780
            },
            {
                id: 37,
                name: "Playa de los Lances",
                province: "cadiz",
                category: "playa",
                schedule: "24h",
                image: "images/lugares/playa-lance-nuevo-mojacar-turismo-vacaciones-05.jpg",
                description: "Playa donde se descubrió América",
                fullDescription: "Los Lances en Tarifa es donde se dice que se avistó América por primera vez. Es el punto más al sur de Europa, donde se juntan el Mediterráneo y el Atlántico. Perfecta para deportes acuáticos.",
                rating: 4.3,
                reviews: 8900
            },
            {
                id: 38,
                name: "Picos de Europa",
                province: "asturias",
                category: "montaña",
                schedule: "09-18",
                image: "images/lugares/picos de europa.png",
                description: "Parque nacional con picos imponentes",
                fullDescription: "Los Picos de Europa son un paraíso para montañistas. Sus picos como el Naranjo de Bulnes o el Torrecerredo superan los 2.500 metros. El lago Enol y la Vega de Enol crean paisajes espectaculares.",
                rating: 4.9,
                reviews: 19870
            },
            {
                id: 39,
                name: "Cabo de Gata",
                province: "almeria",
                category: "playa",
                schedule: "08-20",
                image: "images/lugares/cabo-de-gata.jpg",
                description: "Parque natural con calas vírgenes y aguas cristalinas",
                fullDescription: "El Cabo de Gata-Níjar es un parque natural situado en el extremo más oriental de la provincia de Almería. Es uno de los espacios naturales de mayor valor ecológico de la costa mediterránea occidental.",
                rating: 4.7,
                reviews: 12890
            },
            {
                id: 40,
                name: "Gran Vía de Madrid",
                province: "madrid",
                category: "monumento",
                schedule: "24h",
                image: "images/lugares/gran via.jpg",
                description: "La Broadway de Madrid",
                fullDescription: "La Gran Vía es la arteria comercial y de ocio de Madrid. Sus edificios de principios del siglo XX, teatros, cines y tiendas la hacen la calle más animada de la capital. Iluminada de noche es espectacular.",
                rating: 4.4,
                reviews: 23450
            }
        ];

        this.state.setPlaces(places);
    }

    private setupEventListeners(): void {
        // Configurar todos los listeners inmediatamente
        this.setupThemeToggle();
        this.setupSimpleButtonListeners();
        this.setupModalListeners();
        this.setupSearchListeners();
        this.setupProfileListeners();
        
        console.log('Event listeners configurados correctamente');
    }

    private setupNavigationListeners(): void {
        console.log('Configurando event listeners de navegación...');
        
        // Configurar solo los botones que existen en el HTML
        this.setupButton('registerBtn', () => this.openModal('registerModal'));
        this.setupButton('loginBtn', () => this.openModal('loginModal'));
        this.setupButton('reportsBtn', () => this.goToReports());
        this.setupButton('aboutBtn', () => this.goToAbout());
        
        console.log('Event listeners configurados');
    }

    private setupSimpleButtonListeners(): void {
        console.log('Configurando botones principales...');
        
        // Configurar botones principales con onclick directo
        this.setupButton('registerBtn', () => this.openModal('registerModal'));
        this.setupButton('loginBtn', () => this.openModal('loginModal'));
        this.setupButton('reportsBtn', () => this.goToReports());
        this.setupButton('aboutBtn', () => this.goToAbout());
        
        console.log('Botones principales configurados');
    }
    
    private setupButton(buttonId: string, callback: () => void): void {
        const button = document.getElementById(buttonId);
        if (button) {
            // Eliminar listeners previos
            const newButton = button.cloneNode(true);
            button.parentNode?.replaceChild(newButton, button);
            
            // Añadir listener único
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                callback();
            });
            
            console.log(`Botón ${buttonId} configurado correctamente`);
        } else {
            console.warn(`Botón ${buttonId} no encontrado`);
        }
    }

    private setupModalListeners(): void {
        console.log('Configurando listeners de modales...');
        
        // Botones para cerrar modales
        this.setupButton('closeRegisterModal', () => this.closeModal('registerModal'));
        this.setupButton('closeLoginModal', () => this.closeModal('loginModal'));
        
        // Botones de acción en modales
        this.setupButton('registerSubmitBtn', () => this.handleRegister());
        this.setupButton('loginSubmitBtn', () => this.handleLogin());
        
        console.log('Listeners de modales configurados');
    }
    
    private setupSearchListeners(): void {
        console.log('Configurando listeners de búsqueda...');
        
        // Botones de la barra de navegación
        this.setupButton('searchBtn', () => this.handleSearch());
        this.setupButton('favoritesBtn', () => this.showFavorites());
        this.setupButton('ratingsBtn', () => this.showRatings());
        
        // Inputs de búsqueda y filtros
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        const provinceFilter = document.getElementById('provinceFilter') as HTMLSelectElement;
        const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }
        
        if (provinceFilter) {
            provinceFilter.addEventListener('change', () => this.handleSearch());
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.handleSearch());
        }
        
        console.log('Listeners de búsqueda configurados');
    }
    
    private setupProfileListeners(): void {
        console.log('Configurando listeners de perfil...');
        
        this.setupButton('profileBtn', () => this.showProfile());
        
        console.log('Listeners de perfil configurados');
    }

    private setupHomeSearchListeners(): void {
        console.log('Configurando listeners de búsqueda del home...');
        
        // Configurar el formulario de búsqueda del home
        const homeSearchForm = document.getElementById('homeSearchForm') as HTMLFormElement;
        if (homeSearchForm) {
            homeSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleHomeSearchForm();
            });
        }
        
        // Configurar inputs para búsqueda en tiempo real
        const homeSearchInput = document.getElementById('homeSearchInput') as HTMLInputElement;
        const homeProvinceFilter = document.getElementById('homeProvinceFilter') as HTMLSelectElement;
        const homeCategoryFilter = document.getElementById('homeCategoryFilter') as HTMLSelectElement;
        const homeScheduleFilter = document.getElementById('homeScheduleFilter') as HTMLSelectElement;
        
        if (homeSearchInput) {
            homeSearchInput.addEventListener('input', () => this.handleHomeSearchForm());
        }
        
        if (homeProvinceFilter) {
            homeProvinceFilter.addEventListener('change', () => this.handleHomeSearchForm());
        }
        
        if (homeCategoryFilter) {
            homeCategoryFilter.addEventListener('change', () => this.handleHomeSearchForm());
        }
        
        if (homeScheduleFilter) {
            homeScheduleFilter.addEventListener('change', () => this.handleHomeSearchForm());
        }
        
        console.log('Listeners de búsqueda del home configurados');
    }
    
    private setupThemeToggle(): void {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Eliminar event listeners previos para evitar duplicación
            const newThemeToggle = themeToggle.cloneNode(true);
            themeToggle.parentNode?.replaceChild(newThemeToggle, themeToggle);
            
            // Añadir event listener único
            newThemeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }
    }

    private handleGlobalClick(e: Event): void {
        const target = e.target as HTMLElement;
        
        // Botones de cerrar modal con data-close-modal
        const closeBtn = target.closest('[data-close-modal]');
        if (closeBtn) {
            const modalId = closeBtn.getAttribute('data-close-modal');
            if (modalId) {
                e.preventDefault();
                this.closeModal(modalId);
                return;
            }
        }
        
        // Botones con onclick="closeModal()"
        if (target.onclick && target.onclick.toString().includes('closeModal')) {
            e.preventDefault();
            const modalId = target.getAttribute('onclick')?.match(/closeModal\('([^']+)'\)/)?.[1];
            if (modalId) {
                this.closeModal(modalId);
                return;
            }
        }
        
        // Botones de favoritos
        if (target.closest('.favorite-btn')) {
            const placeId = parseInt(target.closest('.favorite-btn')?.getAttribute('data-place-id') || '0');
            if (placeId) {
                e.preventDefault();
                this.toggleFavorite(placeId);
                return;
            }
        }
        
        // Tarjetas de lugar
        if (target.closest('.place-card')) {
            const placeId = parseInt(target.closest('.place-card')?.getAttribute('data-place-id') || '0');
            if (placeId) {
                this.showPlaceDetails(placeId);
                return;
            }
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

    public renderHome(): void {
        const container = document.getElementById('mainContent');
        if (!container) return;

        const topPlaces = this.state.getTopRatedPlaces(6);
        const allPlaces = this.state.getPlaces();

        console.log('Renderizando home con bienvenida compacta -', new Date().toISOString());
        container.innerHTML = `
            <main class="container mx-auto px-4 py-8">
                <!-- Bienvenida Simple -->
                <div class="mb-8 text-center">
                    <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        <i class="fas fa-flag-espana mr-3 text-spain-red"></i>
                        Bienvenido a Spainly
                    </h1>
                    <p class="text-lg md:text-xl mb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        Descubre los tesoros de España: playas espectaculares, monumentos impresionantes y paisajes únicos
                    </p>
                    <div class="flex flex-wrap justify-center gap-6 text-sm">
                        <div class="flex items-center gap-2">
                            <i class="fas fa-map-marked-alt text-spain-red"></i>
                            <span class="text-gray-700 dark:text-gray-300 font-medium">40+ Destinos</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-star text-spain-yellow"></i>
                            <span class="text-gray-700 dark:text-gray-300 font-medium">Valoraciones Reales</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-heart text-spain-red"></i>
                            <span class="text-gray-700 dark:text-gray-300 font-medium">Guarda Favoritos</span>
                        </div>
                    </div>
                </div>

                <!-- Barra de Búsqueda y Filtros -->
                <section class="mb-12">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                        <i class="fas fa-search text-spain-red mr-3"></i>
                        Busca tu Próximo Destino
                    </h2>
                    <div id="homeSearchBar" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <form id="homeSearchForm" class="space-y-4">
                    <!-- Búsqueda principal -->
                    <div class="relative">
                        <input
                            type="text"
                            id="homeSearchInput"
                            name="query"
                            placeholder="Buscar lugares, provincias, actividades..."
                            class="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                        />
                        <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>

                    <!-- Filtros -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Provincia -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <i class="fas fa-map-marker-alt mr-2"></i>Provincia
                            </label>
                            <select
                                name="province"
                                id="homeProvinceFilter"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todas las provincias</option>
                                <option value="barcelona">Barcelona</option>
                                <option value="madrid">Madrid</option>
                                <option value="sevilla">Sevilla</option>
                                <option value="valencia">Valencia</option>
                                <option value="bilbao">Bilbao</option>
                                <option value="granada">Granada</option>
                                <option value="cordoba">Córdoba</option>
                                <option value="malaga">Málaga</option>
                                <option value="alicante">Alicante</option>
                                <option value="murcia">Murcia</option>
                                <option value="guipuzcoa">Guipúzcoa</option>
                                <option value="pontevedra">Pontevedra</option>
                                <option value="asturias">Asturias</option>
                                <option value="tenerife">Tenerife</option>
                                <option value="baleares">Baleares</option>
                            </select>
                        </div>

                        <!-- Categoría -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <i class="fas fa-filter mr-2"></i>Categoría
                            </label>
                            <select
                                name="category"
                                id="homeCategoryFilter"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todas las categorías</option>
                                <option value="playa">🏖️ Playas</option>
                                <option value="montaña">🏔️ Montañas</option>
                                <option value="monumento">🏛️ Monumentos</option>
                            </select>
                        </div>

                        <!-- Horario -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <i class="fas fa-clock mr-2"></i>Horario
                            </label>
                            <select
                                name="schedule"
                                id="homeScheduleFilter"
                                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Cualquier horario</option>
                                <option value="24h">24 horas</option>
                                <option value="08-20">Mañana (8-20h)</option>
                                <option value="09-20">Completo (9-20h)</option>
                                <option value="10-18">Oficina (10-18h)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Botón de búsqueda -->
                    <button
                        type="submit"
                        class="w-full px-6 py-3 bg-spain-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <i class="fas fa-search mr-2"></i>Buscar
                    </button>
                </form>
            </div>
                </section>

                <section class="mb-12">
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        <i class="fas fa-star text-spain-yellow mr-3"></i>
                        Lugares Recomendados
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${topPlaces.map(place => this.createSimplePlaceCard(place)).join('')}
                    </div>
                </section>
                
                <section>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        <i class="fas fa-map-marked-alt text-spain-red mr-3"></i>
                        Todos los Lugares
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="placesContainer">
                        ${allPlaces.map(place => this.createSimplePlaceCard(place)).join('')}
                    </div>
                </section>
            </main>
        `;
        
        // Reconfigurar listeners después de renderizar
        this.setupModalListeners();
        this.setupSearchListeners();
        this.setupHomeSearchListeners();
    }

    private createSimplePlaceCard(place: Place): string {
        return `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img src="${place.image}" alt="${place.name}" class="w-full h-48 object-cover" onerror="this.src='https://picsum.photos/seed/${place.id}/400/300.jpg'">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${place.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">${place.description}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>⭐ ${place.rating} (${place.reviews.toLocaleString()})</span>
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">${place.category}</span>
                    </div>
                    <div class="mt-3 flex space-x-2">
                        <button onclick="window.app.showPlaceDetails(${place.id})" class="flex-1 px-3 py-1 bg-spain-yellow text-gray-800 text-sm rounded hover:bg-yellow-400 transition-colors">
                            <i class="fas fa-info-circle mr-1"></i>Detalles
                        </button>
                        <button onclick="window.app.toggleFavoriteAndUpdate(${place.id}, this)" class="px-3 py-1 bg-spain-red text-white text-sm rounded hover:bg-red-600 transition-colors ${this.state.isFavorite(place.id) ? 'favorite-active' : ''}">
                            <i class="fas fa-heart ${this.state.isFavorite(place.id) ? 'text-yellow-300' : ''}"></i>
                        </button>
                    </div>
                </div>
            </div>
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

    
    private renderSearch(): void {
        const container = document.getElementById('mainContent');
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

    
    private renderFavorites(): void {
        const container = document.getElementById('mainContent');
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
        this.showReportsPage();
    }

    private renderAbout(): void {
        this.showAboutPage();
    }

    private showReportsPage(): void {
        const reports = [
            {
                id: 'ordesa',
                title: 'Ordesa y Monte Perdido',
                icon: 'fa-mountain',
                summary: 'Parque nacional pirenaico con valles glaciares y cascadas.',
                mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parque+Nacional+de+Ordesa+y+Monte+Perdido',
                cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_Ordesa,_Ordesa_y_Monte_Perdido_National_Park,_Spain.jpg',
                images: [
                    'https://commons.wikimedia.org/wiki/Special:FilePath/Valley_of_Ordesa,_Ordesa_y_Monte_Perdido_National_Park,_Spain.jpg',
                    'https://commons.wikimedia.org/wiki/Special:FilePath/Ordesa_Valley_4,_Ordesa_y_Monte_Perdido_National_Park,_Spain.jpg',
                    'https://commons.wikimedia.org/wiki/Special:FilePath/Tozal_del_Mallo_Panorama.jpg'
                ],
                paragraphs: [
                    'Ordesa y Monte Perdido es uno de los parques nacionales más impactantes de España por su relieve abrupto, sus bosques de hayas y su enorme valor geológico. El valle principal presenta paredes verticales, fajas naturales y un trazado de origen glaciar que convierte cada tramo en una clase abierta de geografía y naturaleza.',
                    'La ruta clásica hacia la Cola de Caballo es una de las más recomendadas para quien visita la zona por primera vez. A lo largo del recorrido aparecen cascadas muy conocidas, zonas de bosque con sombra y miradores naturales desde los que se contempla la inmensidad del valle.',
                    'Para senderistas con mayor experiencia, las fajas altas y los itinerarios de desnivel ofrecen una perspectiva aún más espectacular. Estas rutas exigen planificación previa, equipamiento adecuado y consulta de condiciones meteorológicas, especialmente fuera de temporada estival.',
                    'La biodiversidad del parque es otro de sus grandes valores. Se pueden observar aves rapaces, flora de alta montaña y distintos ecosistemas en pocos kilómetros, algo poco habitual en otros destinos. Esta variedad hace que el parque sea ideal tanto para excursionismo como para fotografía de naturaleza.',
                    'Si buscas una escapada completa, la zona combina senderismo, paisaje, tranquilidad y patrimonio local en los pueblos cercanos del Pirineo aragonés. Es un lugar que funciona igual de bien para una visita de un día como para una estancia más larga centrada en rutas de montaña.'
                ]
            },
            {
                id: 'cies',
                title: 'Las Islas Cíes',
                icon: 'fa-water',
                summary: 'Archipiélago protegido con playas de arena blanca y aguas claras.',
                mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Islas+C%C3%ADes',
                cover: 'images/lugares/islas-cies_m.jpg.image.694.390.low (2).jpg',
                images: [
                    'images/lugares/islas-cies_m.jpg.image.694.390.low (2).jpg',
                    'images/cies-mapa.jpg',
                    'images/lugares/Islas-Cies.jpg'
                ],
                paragraphs: [
                    'Las Islas Cíes forman parte del Parque Nacional Marítimo-Terrestre de las Islas Atlánticas y son uno de los espacios naturales más especiales de Galicia. Su acceso está regulado para conservar el equilibrio ambiental, por eso es importante planificar la visita con antelación en temporada alta.',
                    'La playa de Rodas es el ícono principal del archipiélago por su forma de media luna y el contraste entre aguas limpias, arena clara y pinares. Aun así, la experiencia no se limita al baño: recorrer las sendas de las islas permite descubrir miradores, acantilados y zonas de enorme valor ecológico.',
                    'Uno de los atractivos más apreciados es la red de senderos hacia faros y puntos elevados. Desde esos lugares se obtiene una vista panorámica del océano y de la ría, ideal para quienes disfrutan de fotografía de paisaje y observación de aves marinas.',
                    'Como reportaje de destino, Cíes destaca por la combinación entre belleza visual y modelo de protección natural. Es un ejemplo claro de turismo responsable: menos masificación, mayor calidad de visita y respeto por el entorno.',
                    'Si quieres aprovechar bien el viaje, conviene combinar tiempo de playa, paseo por senderos y tramos de descanso para observar el paisaje con calma. Las Cíes no son un destino para ir con prisa, sino para recorrerlo de forma pausada.'
                ]
            },
            {
                id: 'donana',
                title: 'Parque Nacional de Doñana',
                icon: 'fa-feather',
                summary: 'Humedales y dunas en uno de los ecosistemas más valiosos de Europa.',
                mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parque+Nacional+de+Do%C3%B1ana',
                cover: 'https://commons.wikimedia.org/wiki/Special:FilePath/Parque_Nacional_de_Doñana._La_Rocina.jpg',
                images: [
                    'https://commons.wikimedia.org/wiki/Special:FilePath/Parque_Nacional_de_Doñana._La_Rocina.jpg',
                    'https://commons.wikimedia.org/wiki/Special:FilePath/Doñana_1986_09.jpg',
                    'https://commons.wikimedia.org/wiki/Special:FilePath/Centro_de_Visitantes_Poblado_de_la_Plancha_20210610_43.jpg'
                ],
                paragraphs: [
                    'Doñana es una referencia internacional en biodiversidad por la amplitud y variedad de sus ecosistemas: marismas, dunas móviles, pinares, cotos y zonas de transición. Esta riqueza ambiental convierte al parque en uno de los puntos clave para especies residentes y aves migratorias.',
                    'La dinámica estacional marca totalmente la experiencia del visitante. Según la época del año, cambian los niveles de agua, la presencia de aves y el paisaje dominante. Por eso, cada visita a Doñana puede ser muy distinta incluso recorriendo áreas parecidas.',
                    'Desde el punto de vista educativo, Doñana permite entender de forma clara la relación entre conservación, clima, uso del territorio y equilibrio de ecosistemas. Es un destino ideal para turismo de naturaleza, fotografía y actividades interpretativas.',
                    'También es un ejemplo de gestión ambiental compleja, donde conviven protección estricta, investigación científica y experiencias de visita guiada. Esta combinación hace que el parque tenga un valor único tanto para expertos como para público general.',
                    'Si te interesa un reportaje de fondo sobre naturaleza española, Doñana ofrece contenido de enorme calidad: paisaje, fauna, procesos ecológicos y perspectiva de futuro sobre la preservación de espacios naturales.'
                ]
            }
        ];

        const container = document.getElementById('mainContent') ?? document.querySelector('main');
        if (!container) return;

        container.innerHTML = `
            <section class="max-w-6xl mx-auto">
                <button id="reportsBackBtn" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
                </button>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                        <i class="fas fa-newspaper text-blue-600 mr-2"></i>Reportajes
                    </h2>
                    <p class="text-gray-600 dark:text-gray-300">Haz clic en un reportaje para leer la version extensa con fotos reales.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    ${reports.map((report) => `
                        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <img src="${report.cover}" alt="${report.title}" class="w-full h-48 object-cover">
                            <div class="p-5">
                                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    <i class="fas ${report.icon} text-spain-red mr-2"></i>${report.title}
                                </h3>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">${report.summary}</p>
                                <button class="report-detail-btn px-4 py-2 bg-spain-yellow text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors" data-report-id="${report.id}">
                                    Leer reportaje
                                </button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;

        document.getElementById('reportsBackBtn')?.addEventListener('click', () => this.renderHome());
        document.querySelectorAll<HTMLButtonElement>('.report-detail-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const reportId = button.getAttribute('data-report-id');
                const selected = reports.find((r) => r.id === reportId);
                if (!selected) return;

                if (!container) return;
                container.innerHTML = `
                    <section class="max-w-5xl mx-auto">
                        <button id="backToReportsBtn" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700 transition-colors">
                            <i class="fas fa-arrow-left mr-2"></i>Volver a reportajes
                        </button>
                        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <img src="${selected.cover}" alt="${selected.title}" class="w-full h-72 object-cover">
                            <div class="p-8">
                                <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                                    <i class="fas ${selected.icon} text-spain-red mr-2"></i>${selected.title}
                                </h2>
                                ${selected.paragraphs.map((paragraph) => `
                                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${paragraph}</p>
                                `).join('')}
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    ${selected.images.map((image) => `
                                        <img src="${image}" alt="${selected.title}" class="w-full h-48 object-cover rounded-lg shadow">
                                    `).join('')}
                                </div>
                                <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <a href="${selected.mapsUrl}" target="_blank" rel="noopener noreferrer"
                                       class="inline-flex items-center px-5 py-3 bg-spain-yellow text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors">
                                        <i class="fas fa-map-marker-alt mr-2"></i>Ver ubicación en Google Maps
                                    </a>
                                </div>
                            </div>
                        </article>
                    </section>
                `;

                document.getElementById('backToReportsBtn')?.addEventListener('click', () => this.showReportsPage());
            });
        });
    }

    private showAboutPage(): void {
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
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-info-circle text-gray-600 mr-3"></i>Sobre mí
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                        
                        <!-- Descripción Personal -->
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fas fa-user text-blue-500 mr-2"></i>¿Quién soy?
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Soy un desarrollador web apasionado por crear experiencias digitales que combinen funcionalidad y diseño. 
                                Me especializo en frontend moderno y disfruto trabajando con tecnologías como TypeScript, React y Tailwind CSS. 
                                Mi objetivo es construir aplicaciones que no solo funcionen bien, sino que también ofrezcan una experiencia excepcional al usuario.
                            </p>
                        </div>
                        
                        <!-- Objetivos -->
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fas fa-bullseye text-green-500 mr-2"></i>Mis objetivos
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Quiero convertirme en un desarrollador full-stack capaz de crear aplicaciones web completas y escalables. 
                                Mi meta es dominar tanto el frontend como el backend, entender arquitecturas modernas y poder liderar proyectos 
                                desde la concepción hasta el despliegue. Busco constantemente aprender nuevas tecnologías y mejores prácticas 
                                para mejorar mis habilidades y ofrecer soluciones innovadoras.
                            </p>
                        </div>
                        
                        <!-- Cómo Contribuir -->
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fas fa-hands-helping text-purple-500 mr-2"></i>¿Cómo puedes contribuir?
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Puedes contribuir a este proyecto de varias maneras: reportando errores que encuentres, sugiriendo mejoras 
                                para la interfaz o funcionalidad, o incluso contribuyendo código directamente. Si tienes experiencia en 
                                desarrollo web y te gustaría añadir nuevas características como más lugares turísticos, filtros avanzados 
                                o integración con APIs externas, ¡tus contribuciones son bienvenidas! También puedes ayudar probando la aplicación 
                                y dándome feedback sobre la experiencia de usuario.
                            </p>
                        </div>
                        
                        <!-- Revisión de Errores -->
                        <div>
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fas fa-bug text-red-500 mr-2"></i>Revisión de errores
                            </h3>
                            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                                Me comprometo a revisar y corregir errores de manera diligente. Si encuentras algún problema, 
                                por favor repórtalo a través de GitHub Issues con la mayor cantidad de detalles posible: 
                                qué hiciste, qué esperabas que sucediera, y qué ocurrió en realidad. Reviso regularmente 
                                los reportes y trato de solucionar los problemas lo más rápido posible. También realizo 
                                pruebas exhaustivas antes de cada actualización para minimizar la aparición de nuevos errores.
                            </p>
                        </div>
                        
                        <!-- Botón GitHub -->
                        <div class="text-center py-4">
                            <a href="https://github.com/Cesarvilla44/Spainly" target="_blank" 
                               class="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                                <i class="fab fa-github mr-2"></i>
                                Ver en GitHub
                            </a>
                        </div>
                        
                        <!-- Autoría -->
                        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div class="flex items-center mb-4">
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
                                
                                <div>
                                    <h3 class="font-bold text-gray-800 dark:text-white mb-2">Tecnologías utilizadas</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">HTML5</span>
                                        <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">CSS3</span>
                                        <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">JavaScript</span>
                                        <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">TypeScript</span>
                                        <span class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm">Tailwind CSS</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 class="font-bold text-gray-800 dark:text-white mb-2">Características</h3>
                                    <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                                        <li>40 lugares turísticos famosos de España</li>
                                        <li>Sistema de búsqueda avanzada con filtros</li>
                                        <li>Gestión de favoritos</li>
                                        <li>Valoraciones de lugares</li>
                                        <li>Interfaz responsive y modo oscuro</li>
                                        <li>Desarrollado con TypeScript y mejores prácticas</li>
                                    </ul>
                                </div>
                                
                                <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        © 2026 César Villacañas Moreno. Proyecto educativo Spainly.
                                    </p>
                                </div>
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

    public toggleFavorite(placeId: number): void {
        const isFavorite = this.state.toggleFavorite(placeId);
        this.state.showMessage('conseguido', isFavorite ? 'Lugar añadido a favoritos' : 'Lugar eliminado de favoritos');
        
        // Si estamos en la vista de detalles, actualizar el botón
        if (this.currentView === 'place-details') {
            this.showPlaceDetails(placeId);
        }
    }

    public toggleFavoriteAndUpdate(placeId: number, buttonElement?: HTMLElement): void {
        const isFavorite = this.state.toggleFavorite(placeId);
        
        // Actualizar el contador en la barra de estadísticas
        this.updateFavoriteCounter();
        
        // Actualizar el botón visualmente si se proporcionó
        if (buttonElement) {
            const icon = buttonElement.querySelector('i');
            if (isFavorite) {
                buttonElement.classList.add('favorite-active');
                if (icon) icon.classList.add('text-yellow-300');
            } else {
                buttonElement.classList.remove('favorite-active');
                if (icon) icon.classList.remove('text-yellow-300');
            }
        }
        
        this.state.showMessage('conseguido', isFavorite ? 'Lugar añadido a favoritos' : 'Lugar eliminado de favoritos');
        
        // Si estamos en la vista de detalles, actualizar el botón
        if (this.currentView === 'place-details') {
            this.showPlaceDetails(placeId);
        }
    }

    private updateFavoriteCounter(): void {
        const favoriteCountElement = document.getElementById('favoriteCount');
        if (favoriteCountElement) {
            const counters = this.state.getCounters();
            favoriteCountElement.textContent = counters.favorites.toString();
        }
    }

    private updateRatingCounter(): void {
        const ratingCountElement = document.getElementById('ratingCount');
        if (ratingCountElement) {
            const counters = this.state.getCounters();
            ratingCountElement.textContent = counters.ratings.toString();
        }
    }

    public ratePlace(placeId: number): void {
        const rating = prompt('Valora este lugar (1-5):');
        if (rating && parseInt(rating) >= 1 && parseInt(rating) <= 5) {
            this.state.addRating(placeId, parseInt(rating));
            this.updateRatingCounter();
            this.state.showMessage('conseguido', 'Valoración guardada correctamente');
        }
    }

    public submitRating(placeId: number, rating: number): void {
        if (rating >= 1 && rating <= 5) {
            this.state.addRating(placeId, rating);
            this.updateRatingCounter();
            this.state.showMessage('conseguido', '¡Valoración guardada! Has dado ' + rating + ' estrellas');
        }
    }

    public toggleTheme(): void {
        this.state.toggleTheme();
    }

    // Métodos esenciales para botones
    private openModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            console.log(`Modal ${modalId} abierto`);
        }
    }

    private closeModal(modalId: string): void {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            console.log(`Modal ${modalId} cerrado`);
        }
    }

    private handleRegister(event?: Event): void {
        if (event) {
            event.preventDefault();
        }
        console.log('Procesando registro...');
        this.state.showMessage('conseguido', 'Función de registro en desarrollo');
    }

    private handleLogin(event?: Event): void {
        if (event) {
            event.preventDefault();
        }
        console.log('Procesando login...');
        this.state.showMessage('conseguido', 'Función de login en desarrollo');
    }

    public goToReports(): void {
        this.showReportsPage();
    }

    private goToAbout(): void {
        console.log('Navegando a sobre mí...');
        this.state.showMessage('conseguido', 'Sobre mí: Función en desarrollo');
    }

    private handleSearch(query: string = '', filters: FilterOptions = {}): void {
        if (!query) {
            const searchInput = document.getElementById('searchInput') as HTMLInputElement;
            const provinceFilter = document.getElementById('provinceFilter') as HTMLSelectElement;
            const categoryFilter = document.getElementById('categoryFilter') as HTMLSelectElement;
            
            query = searchInput?.value || '';
            filters.province = provinceFilter?.value || '';
            filters.category = categoryFilter?.value || '';
        }
        
        console.log('Buscando:', { query, filters });
        this.state.showMessage('conseguido', 'Búsqueda: Función en desarrollo');
    }

    private handleHomeSearchForm(): void {
        console.log('Ejecutando handleHomeSearchForm...');
        
        const homeSearchInput = document.getElementById('homeSearchInput') as HTMLInputElement;
        const homeProvinceFilter = document.getElementById('homeProvinceFilter') as HTMLSelectElement;
        const homeCategoryFilter = document.getElementById('homeCategoryFilter') as HTMLSelectElement;
        const homeScheduleFilter = document.getElementById('homeScheduleFilter') as HTMLSelectElement;
        
        const query = homeSearchInput?.value || '';
        const province = homeProvinceFilter?.value || '';
        const category = homeCategoryFilter?.value || '';
        const schedule = homeScheduleFilter?.value || '';
        
        const filters: FilterOptions = {};
        if (province) filters.province = province;
        if (category) filters.category = category as 'playa' | 'montaña' | 'monumento';
        if (schedule) filters.schedule = schedule;
        
        console.log('Búsqueda desde home form:', { query, filters });
        
        // Filtrar lugares y actualizar la vista del home
        const allPlaces = this.state.getPlaces();
        let filteredPlaces = allPlaces;
        
        // Aplicar filtros
        if (query) {
            filteredPlaces = filteredPlaces.filter(place => 
                place.name.toLowerCase().includes(query.toLowerCase()) ||
                place.description.toLowerCase().includes(query.toLowerCase()) ||
                place.fullDescription.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        if (filters.province) {
            filteredPlaces = filteredPlaces.filter(place => place.province === filters.province);
        }
        
        if (filters.category) {
            filteredPlaces = filteredPlaces.filter(place => place.category === filters.category);
        }
        
        if (filters.schedule) {
            filteredPlaces = filteredPlaces.filter(place => place.schedule === filters.schedule);
        }
        
        // Actualizar los contenedores con los resultados filtrados
        const placesContainer = document.getElementById('placesContainer');
        
        if (placesContainer) {
            if (filteredPlaces.length === 0) {
                placesContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No se encontraron lugares
                        </h3>
                        <p class="text-gray-500 dark:text-gray-500">
                            Intenta con otros filtros o términos de búsqueda
                        </p>
                    </div>
                `;
            } else {
                placesContainer.innerHTML = filteredPlaces.map(place => this.createSimplePlaceCard(place)).join('');
            }
        }
        
        // Reconfigurar listeners
        this.setupModalListeners();
    }

    public showPlaceDetails(placeId: number): void {
        const place = this.state.getPlaces().find(p => p.id === placeId);
        if (!place) return;

        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Guardar contenido actual si no está guardado
        if (!this.homeMainContent) {
            this.homeMainContent = mainContent.innerHTML;
        }

        // Generar coordenadas simuladas para Google Maps (en un proyecto real usaríamos coordenadas reales)
        const coordinates = this.getCoordinatesForPlace(place.name);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + place.province + ', Spain')}`;

        mainContent.innerHTML = `
            <section class="max-w-6xl mx-auto">
                <button onclick="window.app.restoreHomeContent()" class="mb-8 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700 transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
                </button>

                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <!-- Imagen principal -->
                    <div class="relative h-96 bg-gray-200 dark:bg-gray-700">
                        <img src="${place.image}" alt="${place.name}" class="w-full h-full object-cover" onerror="this.src='https://picsum.photos/seed/${place.id}/800/400.jpg'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h1 class="text-4xl md:text-5xl font-bold mb-4">${place.name}</h1>
                            <div class="flex flex-wrap gap-4 text-sm">
                                <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <i class="fas fa-map-marker-alt mr-2"></i>${place.province}
                                </span>
                                <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <i class="fas fa-tag mr-2"></i>${place.category}
                                </span>
                                <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <i class="fas fa-clock mr-2"></i>${place.schedule}
                                </span>
                                <span class="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                                    <i class="fas fa-star mr-2"></i>${place.rating} (${place.reviews.toLocaleString()} reseñas)
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Contenido del reportaje -->
                    <div class="p-8">
                        <!-- Descripción extendida -->
                        <div class="mb-8">
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                <i class="fas fa-info-circle text-spain-red mr-3"></i>Descripción completa
                            </h2>
                            <div class="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
                                <p class="mb-4">${place.fullDescription}</p>
                                <p class="mb-4">${place.description}</p>
                                <p>${this.generateExtendedDescription(place)}</p>
                            </div>
                        </div>

                        <!-- Información práctica -->
                        <div class="grid md:grid-cols-2 gap-8 mb-8">
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                    <i class="fas fa-info text-spain-yellow mr-2"></i>Información práctica
                                </h3>
                                <div class="space-y-3 text-gray-600 dark:text-gray-300">
                                    <div class="flex justify-between">
                                        <span><i class="fas fa-map-marker-alt mr-2"></i>Provincia:</span>
                                        <span class="font-semibold">${place.province}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span><i class="fas fa-tag mr-2"></i>Categoría:</span>
                                        <span class="font-semibold">${place.category}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span><i class="fas fa-clock mr-2"></i>Horario:</span>
                                        <span class="font-semibold">${place.schedule}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span><i class="fas fa-star mr-2"></i>Valoración:</span>
                                        <span class="font-semibold">⭐ ${place.rating}/5.0 (${place.reviews.toLocaleString()} reseñas)</span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                    <i class="fas fa-map text-spain-red mr-2"></i>Ubicación
                                </h3>
                                <div class="space-y-4">
                                    <p class="text-gray-600 dark:text-gray-300">
                                        ${place.name} se encuentra en ${place.province}, España. 
                                        Este destino es uno de los lugares más visitados de la región por su 
                                        ${place.category === 'playa' ? 'playa espectacular y servicios' : 'valor histórico y cultural'}.
                                    </p>
                                    <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" 
                                       class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <i class="fas fa-map-marked-alt mr-2"></i>
                                        Ver en Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Sistema de valoración con estrellas -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                                <i class="fas fa-star text-spain-yellow mr-3"></i>Valora este lugar
                            </h3>
                            
                            <!-- Estrellas interactivas -->
                            <div class="flex justify-center items-center space-x-4 mb-6">
                                ${[1, 2, 3, 4, 5].map(star => `
                                    <button onclick="window.app.submitRating(${place.id}, ${star})" 
                                            class="text-4xl transition-all duration-200 hover:scale-110 focus:outline-none ${star <= (this.state.getRating(place.id) || 0) ? 'text-spain-yellow' : 'text-gray-300 dark:text-gray-600 hover:text-spain-yellow'}">
                                        <i class="fas fa-star"></i>
                                    </button>
                                `).join('')}
                            </div>
                            
                            <p class="text-center text-gray-600 dark:text-gray-400 mb-4">
                                ${this.state.getRating(place.id) 
                                    ? `Has valorado con ${this.state.getRating(place.id)} estrellas` 
                                    : 'Haz clic en las estrellas para valorar'}
                            </p>
                            
                            <!-- Botón de favoritos grande -->
                            <div class="text-center">
                                <button onclick="window.app.toggleFavoriteAndUpdate(${place.id})" 
                                        class="px-8 py-3 ${this.state.isFavorite(place.id) ? 'bg-spain-red' : 'bg-gray-500'} text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center">
                                    <i class="fas fa-heart mr-2 ${this.state.isFavorite(place.id) ? 'text-yellow-300' : ''}"></i>
                                    ${this.state.isFavorite(place.id) ? 'En tus favoritos' : 'Añadir a favoritos'}
                                </button>
                            </div>
                        </div>

                        <!-- Consejos para visitar -->
                        <div class="bg-gradient-to-r from-spain-red to-spain-yellow rounded-xl p-8 text-white mb-8">
                            <h3 class="text-2xl font-bold mb-4">
                                <i class="fas fa-lightbulb mr-3"></i>Consejos para tu visita
                            </h3>
                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="font-semibold mb-2">🕐 Mejor época para visitar</h4>
                                    <p class="text-white/90">${this.getBestTimeToVisit(place)}</p>
                                </div>
                                <div>
                                    <h4 class="font-semibold mb-2">📸 Qué no te pierdas</h4>
                                    <p class="text-white/90">${this.getMustSeeItems(place)}</p>
                                </div>
                                <div>
                                    <h4 class="font-semibold mb-2">🎫 Entradas y reservas</h4>
                                    <p class="text-white/90">${this.getTicketInfo(place)}</p>
                                </div>
                                <div>
                                    <h4 class="font-semibold mb-2">🚗 Cómo llegar</h4>
                                    <p class="text-white/90">${this.getTransportInfo(place)}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Botón de acción -->
                        <div class="text-center">
                            <button onclick="window.app.restoreHomeContent()" 
                                    class="px-8 py-3 bg-spain-red text-white rounded-lg hover:bg-red-700 transition-colors">
                                <i class="fas fa-arrow-left mr-2"></i>Volver a explorar más lugares
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        `;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private getCoordinatesForPlace(placeName: string): { lat: number, lng: number } {
        // Coordenadas simuladas para lugares conocidos
        const coordinates: { [key: string]: { lat: number, lng: number } } = {
            'Sagrada Familia': { lat: 41.4036, lng: 2.1744 },
            'Alhambra': { lat: 37.1773, lng: -3.5986 },
            'Park Güell': { lat: 41.4145, lng: 2.1527 },
            'Playa de la Concha': { lat: 43.3229, lng: -1.9831 },
            'Teide': { lat: 28.2716, lng: -16.6421 },
            'Catedral de Burgos': { lat: 42.3439, lng: -3.6989 }
        };
        return coordinates[placeName] || { lat: 40.4168, lng: -3.7038 }; // Madrid por defecto
    }

    private generateExtendedDescription(place: Place): string {
        const descriptions: { [key: string]: string } = {
            'Sagrada Familia': 'La Sagrada Familia es la obra maestra de Antoni Gaudí y el símbolo más reconocido de Barcelona. Esta basílica, aún en construcción después de más de 140 años, combina elementos góticos y modernistas en una estructura única en el mundo. Sus torres esbeltas y su fachada detallada la convierten en una de las iglesias más visitadas del mundo.',
            'Alhambra': 'La Alhambra es un palacio y complejo fortificado de la época nazarí, situado en la colina de la Sabika, en Granada. Considerada una de las maravillas del mundo islámico, combina palacios, jardines y patios que reflejan la refinada cultura andalusí. El Patio de los Leones y el Generalife son sus espacios más emblemáticos.',
            'Park Güell': 'El Park Güell es un jardín público con elementos arquitectónicos situado en la parte alta de Barcelona. Diseñado por Gaudí entre 1900 y 1914, este parque es un ejemplo excepcional del modernismo catalán, con sus famosos mosaicos de trencadís, la serpiente de bancos y la casa-museo de Gaudí.',
            'Playa de la Concha': 'La Playa de la Concha es una de las playas urbanas más famosas y bellas de Europa. Situada en la bahía de San Sebastián, su forma de concha y sus arenas finas la hacen un destino privilegiado. Rodeada por montañas y con la isla de Santa Clara como telón de fondo, ofrece vistas espectaculares y aguas tranquilas.',
            'Teide': 'El Teide es el pico más alto de España con 3.718 metros, situado en el corazón del Parque Nacional del Teide en Tenerife. Este volcán activo ofrece paisajes lunares, formaciones rocosas únicas y vistas impresionantes. El teleférico permite ascender casi a la cima para contemplar el archipiélago canario.',
            'Catedral de Burgos': 'La Catedral de Burgos es una joya del gótico español declarada Patrimonio de la Humanidad por la UNESCO. Construida entre los siglos XIII y XVI, destaca por sus imponentes agujas, el cimborrio de crucero de Diego de Siloé y la rica decoración escultórica. Sus chapiteles y el famoso Cid Campeador forman parte de su historia legendaria.'
        };
        return descriptions[place.name] || `${place.name} es uno de los destinos más impresionantes de España, ofreciendo una experiencia única que combina historia, cultura y belleza natural. Este lugar representa lo mejor del patrimonio español y atrae a visitantes de todo el mundo por su singularidad y valor artístico.`;
    }

    private getBestTimeToVisit(place: Place): string {
        if (place.category === 'playa') {
            return 'Los meses de junio a septiembre ofrecen las mejores temperaturas para disfrutar de la playa. Julio y agosto son los más cálidos pero también los más concurridos.';
        } else if (place.name === 'Teide') {
            return 'Primavera y otoño son ideales para evitar el calor extremo del verano y el frío del invierno. Los días despejados ofrecen las mejores vistas desde la cima.';
        } else {
            return 'Primavera y otoño son las mejores estaciones para visitar, con temperaturas agradables y menos multitudes. El verano puede ser muy concurrido en zonas turísticas.';
        }
    }

    private getMustSeeItems(place: Place): string {
        const items: { [key: string]: string } = {
            'Sagrada Familia': 'Las fachadas del Nacimiento y la Pasión, el interior con sus columnas inclinadas como un bosque, y las vistas desde las torres.',
            'Alhambra': 'El Patio de los Leones, los Palacios Nazaríes, el Generalife y las vistas desde la Torre de la Vela.',
            'Park Güell': 'El Banc de Trencadís, la Sala Hipóstila, la Casa-Museo de Gaudí y las vistas de Barcelona desde la parte alta.',
            'Playa de la Concha': 'El paseo marítimo, el Monte Urgull, la isla de Santa Clara y el atardecer desde la playa.',
            'Teide': 'El cráter del Teide, las rocas de García, el paisaje marciano y las vistas del archipiélago desde el teleférico.',
            'Catedral de Burgos': 'Las agujas gemelas, el cimborrio, los chapiteles y el claustro.'
        };
        return items[place.name] || 'No te pierdas los puntos más emblemáticos y las vistas panorámicas que ofrece este lugar único.';
    }

    private getTicketInfo(place: Place): string {
        if (place.name === 'Sagrada Familia') {
            return 'Es recomendable comprar entradas online con antelación, especialmente en temporada alta. Hay diferentes tipos de visitas: audioguía, acceso a torres o visitas guiadas.';
        } else if (place.name === 'Alhambra') {
            return 'Las entradas deben comprarse online con mucha antelación, especialmente para el Palacio Nazarí. Se vende un número limitado de entradas cada día.';
        } else if (place.name === 'Teide') {
            return 'El acceso al parque nacional es gratuito, pero el teleférico requiere entrada. Reserva online para evitar esperas, especialmente en temporada alta.';
        } else {
            return 'Consulta la web oficial para información sobre entradas y horarios. Algunos lugares ofrecen descuentos para estudiantes, mayores o residentes.';
        }
    }

    private getTransportInfo(place: Place): string {
        if (place.name === 'Sagrada Familia') {
            return 'Metro L2 y L5 (Sagrada Familia) o L4 y L5 (Verdaguer). Varias líneas de autobús urbanos también llegan.';
        } else if (place.name === 'Alhambra') {
            return 'Autobús urbanos C30, C32, C34 desde el centro de Granada. También se puede llegar a pie en unos 20-30 minutos.';
        } else if (place.name === 'Playa de la Concha') {
            return 'Autobús urbano línea 28, o a pie desde el centro de San Sebastián en 15-20 minutos.';
        } else {
            return 'Consulta las opciones de transporte público local. La mayoría de los lugares importantes son accesibles en autobús urbano o metro.';
        }
    }

    public restoreHomeContent(): void {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent || !this.homeMainContent) return;
        mainContent.innerHTML = this.homeMainContent;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private showFavorites(): void {
        console.log('Mostrando favoritos...');
        this.state.showMessage('conseguido', 'Favoritos: Función en desarrollo');
    }

    private showRatings(): void {
        console.log('Mostrando valoraciones...');
        this.state.showMessage('conseguido', 'Valoraciones: Función en desarrollo');
    }

    private showProfile(): void {
        console.log('Mostrando perfil...');
        this.state.showMessage('conseguido', 'Perfil: Función en desarrollo');
    }
}

// Inicialización de la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = SpainlyApp.getInstance();
        window.app = app;
        app.renderHome(); // Renderizar el home al iniciar
        console.log('Spainly App inicializada correctamente');
    });
} else {
    const app = SpainlyApp.getInstance();
    window.app = app;
    app.renderHome(); // Renderizar el home al iniciar
    console.log('Spainly App inicializada correctamente');
}

export default SpainlyApp;
