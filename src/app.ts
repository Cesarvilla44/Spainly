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
            ? 'http://localhost:3000' 
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
            },
            {
                id: 6,
                name: "Mezquita de Córdoba",
                province: "cordoba",
                category: "montaña",
                schedule: "10-19",
                image: "images\\lugares\\mezquita de cordoba.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Las_Gredas_de_Bolnuevo.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Mount_Teide_from_Tenerife.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Playa_de_la_Victoria_Cadiz.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Alc%C3%A1zar_de_Segovia_04.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ses_Illetes_Beach_Formentera.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/El_Escorial_from_the_air_-_2017.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Rodas_Beach_Cies_Islands.jpg/400/300.jpg",
                description: "La playa más famosa de las Islas Cíes",
                fullDescription: "La Playa de Rodas en las Islas Cíes es un paraíso accesible solo en barco. Sus aguas cristalinas y arena blanca la hacen perfecta para bucear y relajarse. El parque natural la protege manteniéndola virgen.",
                rating: 4.8,
                reviews: 10230
            },
            {
                id: 14,
                name: "Ciudad de las Artes y las Ciencias",
                province: "valencia",
                category: "montaña",
                schedule: "10-19",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ciudad_de_las_Artes_y_las_Ciencias_-_Valencia_-_Espa%C3%B1a_2016.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Playa_de_Monsul_Cabo_de_Gata.jpg/400/300.jpg",
                description: "Playa volcánica en el Cabo de Gata",
                fullDescription: "La Playa de Mónsul es famosa por su dunas de arena volcánica oscura y su peña en el mar. Fue escenario de películas como Indiana Jones. Sus aguas transparentes y paisaje árido la hacen única.",
                rating: 4.6,
                reviews: 7230
            },
            {
                id: 16,
                name: "Guggenheim Bilbao",
                province: "bilbao",
                category: "montaña",
                schedule: "10-20",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Guggenheim_Museum_Bilbao.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Playa_de_la_Caleta_Cadiz.jpg/400/300.jpg",
                description: "Playa histórica donde aterrizó Colón",
                fullDescription: "La Playa de la Caleta es la única playa de arena en el casco antiguo de Cádiz. Su historia es legendaria, se dice que fue el último lugar europeo que pisó Cristóbal Colón antes de llegar a América.",
                rating: 4.3,
                reviews: 6780
            },
            {
                id: 18,
                name: "Acueducto de Segovia",
                province: "segovia",
                category: "montaña",
                schedule: "24h",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Acueduct_of_Segovia-01.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Benidorm_beach_view.jpg/400/300.jpg",
                description: "Playas de Levante y Poniente en Benidorm",
                fullDescription: "Benidorm tiene dos playas principales: Levante y Poniente. Con aguas tranquilas y arena dorada, son perfectas para familias. El skyline de la ciudad las convierte en las playas urbanas más espectaculares de España.",
                rating: 4.2,
                reviews: 21340
            },
            {
                id: 20,
                name: "Catedral de Burgos",
                province: "burgos",
                category: "montaña",
                schedule: "10-19",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Burgos_Cathedral_-_Facade.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Las_Teresitas_Beach_Tenerife.jpg/400/300.jpg",
                description: "Playa con arena blanca traída del Sahara",
                fullDescription: "Las Teresitas es una playa artificial creada con arena traída del Sahara. Sus aguas tranquilas y el paisaje montaña la hacen especial. Perfecta para nadar y disfrutar de vistas espectaculares del Anaga.",
                rating: 4.4,
                reviews: 9870
            },
            {
                id: 22,
                name: "Museo del Prado",
                province: "madrid",
                category: "montaña",
                schedule: "10-20",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Museo_del_Prado_-_Madrid_-_Spain_2015.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Playa_de_Zahara_de_los_Atunes.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Alcazaba_de_Almeria_01.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Corralejo_Dunes_Fuerteventura.jpg/400/300.jpg",
                description: "Parque natural de dunas en Corralejo",
                fullDescription: "Corralejo tiene un parque natural de dunas que parece el Sahara. Las dunas de origen volcánico se unen a playas de arena blanca y aguas turquesas. Ideal para practicar windsurf y kitesurf.",
                rating: 4.6,
                reviews: 8900
            },
            {
                id: 26,
                name: "Casa Batlló",
                province: "barcelona",
                category: "montaña",
                schedule: "09-20",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Casa_Batll%C3%B3_-_Barcelona.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Malvarrosa_beach_valencia.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Palacio_Real_de_Madrid_2016.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Cala_Macarella_Menorca.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Rioja_vineyards_Spain.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Playa_de_Artedo_Cudillero.jpg/400/300.jpg",
                description: "Playa rústica en el concejo de Cudillero",
                fullDescription: "La Concha de Artedo es una playa virgen rodeada de acantilados verdes. Su arena fina y aguas tranquilas la hacen perfecta para relajarse. El paisaje asturiano con sus prados y vacias la hace especial.",
                rating: 4.4,
                reviews: 4560
            },
            {
                id: 32,
                name: "Toledo",
                province: "toledo",
                category: "montaña",
                schedule: "10-18",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Toledo_-_Montage_of_the_city.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/La_Barroza_beach_chiclana.jpg/400/300.jpg",
                description: "Playa de 8 km en Chiclana",
                fullDescription: "La Playa de la Barrosa tiene 8 km de arena dorada. Sus aguas poco profundas la hacen perfecta para familias. El castillo de Sancti Petri en el mar le da un toque histórico espectacular.",
                rating: 4.5,
                reviews: 12340
            },
            {
                id: 34,
                name: "Salamanca",
                province: "salamanca",
                category: "montaña",
                schedule: "10-20",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Plaza_Mayor_de_Salamanca.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Balcon_de_Europa_Nerja.jpg/400/300.jpg",
                description: "Playas y cuevas en la Costa del Sol",
                fullDescription: "Nerja tiene playas espectaculares y las Cuevas de Nerja, un monumento natural impresionante. El Balcón de Europa ofrece vistas espectaculares del mar Mediterráneo y las montañas.",
                rating: 4.4,
                reviews: 15670
            },
            {
                id: 36,
                name: "Santiago de Compostela",
                province: "lugo",
                category: "montaña",
                schedule: "10-19",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Santiago_de_Compostela_-_Cathedral.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Playa_de_los_Lances_Tarifa.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Naranjo_de_Bulnes_-_Picos_de_Europa.jpg/400/300.jpg",
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
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Cabo_de_Gata_-_Playa_de_los_Muertos.jpg/400/300.jpg",
                description: "Parque natural con calas vírgenes y aguas cristalinas",
                fullDescription: "El Cabo de Gata-Níjar es un parque natural situado en el extremo más oriental de la provincia de Almería. Es uno de los espacios naturales de mayor valor ecológico de la costa mediterránea occidental.",
                rating: 4.7,
                reviews: 12890
            },
            {
                id: 40,
                name: "Gran Vía de Madrid",
                province: "madrid",
                category: "montaña",
                schedule: "24h",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Gran_Via_Madrid_2015.jpg/400/300.jpg",
                description: "La Broadway de Madrid",
                fullDescription: "La Gran Vía es la arteria comercial y de ocio de Madrid. Sus edificios de principios del siglo XX, teatros, cines y tiendas la hacen la calle más animada de la capital. Iluminada de noche es espectacular.",
                rating: 4.4,
                reviews: 23450
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
        console.log('Configurando event listeners de navegación...');
        
        // Configurar botones de navegación principales
        this.setupButton('searchBtn', () => this.goToSearch());
        this.setupButton('favoritesBtn', () => this.goToFavorites());
        this.setupButton('ratingsBtn', () => this.goToRatings());
        this.setupButton('profileBtn', () => this.goToProfile());
        this.setupButton('registerBtn', () => this.openModal('registerModal'));
        this.setupButton('loginBtn', () => this.openModal('loginModal'));
        this.setupButton('reportsBtn', () => this.goToReports());
        this.setupButton('aboutBtn', () => this.goToAbout());
        
        console.log('Event listeners configurados');
    }

    private setupButton(buttonId: string, clickHandler: () => void): void {
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

    private setupThemeToggle(): void {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
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
        this.showReportsPage();
    }

    private renderAbout(): void {
        this.showAboutPage();
    }

    private showReportsPage(): void {
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
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
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
                            <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h3 class="font-bold text-gray-800 dark:text-white mb-2">Tesoros Históricos</h3>
                                <p class="text-gray-600 dark:text-gray-300">Explora los monumentos y sitios históricos que han marcado la historia de España.</p>
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

// Inicialización de la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = SpainlyApp.getInstance();
        window.app = app;
        console.log('Spainly App inicializada correctamente');
    });
} else {
    const app = SpainlyApp.getInstance();
    window.app = app;
    console.log('Spainly App inicializada correctamente (DOM ya listo)');
}

export default SpainlyApp;
