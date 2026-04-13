// Spainly App - Lógica completa de la aplicación
class SpainlyApp {
    constructor() {
        this.places = [];
        this.searches = [];
        this.favorites = [];
        this.ratings = [];
        this.currentUser = null;
        this.counters = {
            searches: 0,
            favorites: 0,
            ratings: 0,
            user: 0
        };
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    async init() {
        await this.loadPlaces();
        this.loadCounters();
        this.loadUser();
        this.setupEventListeners();
        this.applyTheme();
        this.renderPlaces();
        this.renderRecommendedPlaces();
        this.showConseguido('¡Conseguido! Aplicación iniciada correctamente');
        
        // Conectar con el servidor
        this.connectToServer();
    }

    async connectToServer() {
    try {
        // Unificamos la ruta para que siempre use el prefijo /api que configuramos en vercel.json
        const API_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/health' 
            : '/api/health';


        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success) {
            this.showConseguido(data.message); // Mostrará: "¡Conseguido! Servidor Spainly funcionando..."
        }
    } catch (error) {
        console.error('Error conectando al servidor:', error);
        this.showError('No se pudo conectar con el servidor backend');
    }
}


    async loadPlaces() {
        // 40 lugares famosos de España
        this.places = [
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
                image: "https://picsum.photos/seed/bolnuevo/400/300",
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
                category: "montaña",
                schedule: "10-18",
                image: "https://picsum.photos/seed/alcazar/400/300",
                description: "Castillo medieval inspirador de Disney",
                fullDescription: "El Alcázar de Segovia es uno de los castillos más impresionantes de España. Su arquitectura medieval inspiró a Walt Disney para el castillo de la Bella Durmiente. Las vistas desde su torre del homenaje son espectaculares.",
                rating: 4.6,
                reviews: 11230
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
                category: "montaña",
                schedule: "10-18",
                image: "https://picsum.photos/seed/escorial/400/300",
                description: "Monumento renacentista y residencia real",
                fullDescription: "El Monasterio de San Lorenzo de El Escorial es una joya del Renacimiento español. Construido por Felipe II, combina monasterio, palacio, biblioteca y mausoleo. Su arquitectura sobria y majestuosa refleja el poder de la España del siglo XVI.",
                rating: 4.5,
                reviews: 9450
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
                image: "https://picsum.photos/seed/cac/400/300",
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
                image: "https://picsum.photos/seed/monsul/400/300",
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
                image: "https://picsum.photos/seed/caleta/400/300",
                description: "Playa histórica donde aterizó Colón",
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
                image: "https://picsum.photos/seed/catedralburgos/400/300",
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
                image: "https://picsum.photos/seed/prado/400/300",
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
                image: "https://picsum.photos/seed/zahara/400/300",
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
                image: "https://picsum.photos/seed/alcazaba/400/300",
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
                image: "https://picsum.photos/seed/corralejo/400/300",
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
                image: "https://picsum.photos/seed/batllo/400/300",
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
                image: "https://picsum.photos/seed/palacioreal/400/300",
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
                image: "https://picsum.photos/seed/artedo/400/300",
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
                image: "https://picsum.photos/seed/salamanca/400/300",
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
                image: "https://picsum.photos/seed/lances/400/300",
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
                name: "Playa de Mónsul",
                province: "almeria",
                category: "playa",
                schedule: "24h",
                image: "https://picsum.photos/seed/monsul2/400/300",
                description: "Playa volcánica en el Cabo de Gata",
                fullDescription: "Mónsul es famosa por su dunas volcánicas y su peña. Fue escenario de Indiana Jones y el Último Cruzado. Sus aguas cristalinas y paisaje lunar la hacen única en el Mediterráneo.",
                rating: 4.6,
                reviews: 7230
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
    }

    loadCounters() {
        const saved = localStorage.getItem('counters');
        if (saved) {
            this.counters = JSON.parse(saved);
        }
        this.updateCountersDisplay();
    }

    saveCounters() {
        localStorage.setItem('counters', JSON.stringify(this.counters));
    }

    loadUser() {
        const saved = localStorage.getItem('currentUser');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            this.counters.user = 1;
            this.updateCountersDisplay();
        }
    }

    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('searchInput').addEventListener('input', () => this.filterPlaces());
        document.getElementById('provinceFilter').addEventListener('change', () => this.filterPlaces());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterPlaces());
        document.getElementById('scheduleFilter').addEventListener('change', () => this.filterPlaces());

        // Botones del header
        document.getElementById('registerBtn').addEventListener('click', () => this.openModal('registerModal'));
        document.getElementById('loginBtn').addEventListener('click', () => this.openModal('loginModal'));
        document.getElementById('reportsBtn').addEventListener('click', () => this.goToReports());
        document.getElementById('aboutBtn').addEventListener('click', () => this.goToAbout());
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Formularios
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));

        // Contadores
        document.getElementById('searchCounter').addEventListener('click', () => this.goToSearches());
        document.getElementById('favoriteCounter').addEventListener('click', () => this.goToFavorites());
        document.getElementById('ratingCounter').addEventListener('click', () => this.goToRatings());
        document.getElementById('userCounter').addEventListener('click', () => this.goToProfile());
    }

    renderPlaces() {
        const container = document.getElementById('allPlaces');
        container.innerHTML = '';
        
        this.places.forEach(place => {
            const card = this.createPlaceCard(place);
            container.appendChild(card);
        });
    }

    renderRecommendedPlaces() {
        const container = document.getElementById('recommendedPlaces');
        container.innerHTML = '';
        
        // Tomar los primeros 6 lugares como recomendados
        const recommended = this.places.slice(0, 6);
        recommended.forEach(place => {
            const card = this.createPlaceCard(place);
            container.appendChild(card);
        });
    }

    createPlaceCard(place) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer';
        card.innerHTML = `
            <img src="${place.image}" alt="${place.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">${place.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">${place.description}</p>
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <i class="fas fa-star text-spain-yellow mr-1"></i>
                        <span class="text-sm text-gray-700 dark:text-gray-300">${place.rating}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="app.toggleFavorite(${place.id})" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900">
                            <i class="fas fa-heart text-red-500"></i>
                        </button>
                        <button onclick="app.ratePlace(${place.id})" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-yellow-100 dark:hover:bg-yellow-900">
                            <i class="fas fa-star text-spain-yellow"></i>
                        </button>
                        <button onclick="app.showPlaceDetail(${place.id})" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900">
                            <i class="fas fa-info-circle text-blue-500"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    filterPlaces() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const province = document.getElementById('provinceFilter').value;
        const category = document.getElementById('categoryFilter').value;
        const schedule = document.getElementById('scheduleFilter').value;

        const filtered = this.places.filter(place => {
            const matchesSearch = place.name.toLowerCase().includes(searchTerm) || 
                              place.description.toLowerCase().includes(searchTerm);
            const matchesProvince = !province || place.province === province;
            const matchesCategory = !category || place.category === category;
            const matchesSchedule = !schedule || place.schedule === schedule;

            return matchesSearch && matchesProvince && matchesCategory && matchesSchedule;
        });

        const container = document.getElementById('allPlaces');
        container.innerHTML = '';
        
        filtered.forEach(place => {
            const card = this.createPlaceCard(place);
            container.appendChild(card);
        });

        if (searchTerm || province || category || schedule) {
            this.incrementSearches();
        }
    }

    incrementSearches() {
        this.counters.searches++;
        this.updateCountersDisplay();
        this.saveCounters();
        this.showConseguido('¡Conseguido! Búsqueda realizada');
    }

    toggleFavorite(placeId) {
        const place = this.places.find(p => p.id === placeId);
        if (place) {
            const index = this.favorites.findIndex(f => f.id === placeId);
            if (index === -1) {
                this.favorites.push(place);
                this.counters.favorites++;
                this.showConseguido('¡Conseguido! Lugar añadido a favoritos');
            } else {
                this.favorites.splice(index, 1);
                this.counters.favorites--;
                this.showConseguido('¡Conseguido! Lugar eliminado de favoritos');
            }
            this.updateCountersDisplay();
            this.saveCounters();
        }
    }

    ratePlace(placeId) {
        const rating = prompt('Valora este lugar (1-5 estrellas):');
        if (rating && rating >= 1 && rating <= 5) {
            const place = this.places.find(p => p.id === placeId);
            if (place) {
                this.ratings.push({
                    placeId: placeId,
                    placeName: place.name,
                    rating: parseInt(rating),
                    date: new Date().toISOString()
                });
                this.counters.ratings++;
                this.updateCountersDisplay();
                this.saveCounters();
                this.showConseguido(`¡Conseguido! Has valorado ${place.name} con ${rating} estrellas`);
            }
        }
    }

    showPlaceDetail(placeId) {
        const place = this.places.find(p => p.id === placeId);
        if (place) {
            // Crear página de detalle
            this.showPlaceDetailPage(place);
        }
    }

    showPlaceDetailPage(place) {
        const detailHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${place.name} - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <img src="${place.image}" alt="${place.name}" class="w-full h-96 object-cover">
                        <div class="p-8">
                            <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">${place.name}</h1>
                            <div class="flex items-center mb-6">
                                <i class="fas fa-star text-spain-yellow mr-2"></i>
                                <span class="text-lg text-gray-700 dark:text-gray-300">${place.rating} (${place.reviews} reseñas)</span>
                            </div>
                            
                            <div class="mb-6">
                                <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-3">Información completa</h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${place.fullDescription}</p>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        <i class="fas fa-map-marker-alt text-spain-red mr-2"></i>Ubicación
                                    </h3>
                                    <p class="text-gray-600 dark:text-gray-300">${place.province.charAt(0).toUpperCase() + place.province.slice(1)}</p>
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        <i class="fas fa-clock text-spain-yellow mr-2"></i>Horario
                                    </h3>
                                    <p class="text-gray-600 dark:text-gray-300">${this.formatSchedule(place.schedule)}</p>
                                </div>
                            </div>
                            
                            <div class="mb-6">
                                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-3">Fotos del lugar</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <img src="https://picsum.photos/seed/${place.name}1/400/300" alt="${place.name} 1" class="w-full h-32 object-cover rounded-lg">
                                    <img src="https://picsum.photos/seed/${place.name}2/400/300" alt="${place.name} 2" class="w-full h-32 object-cover rounded-lg">
                                    <img src="https://picsum.photos/seed/${place.name}3/400/300" alt="${place.name} 3" class="w-full h-32 object-cover rounded-lg">
                                </div>
                            </div>
                            
                            <div class="flex space-x-4">
                                <button onclick="app.toggleFavorite(${place.id})" class="px-6 py-3 bg-spain-red text-white rounded-lg hover:bg-red-700">
                                    <i class="fas fa-heart mr-2"></i>Añadir a favoritos
                                </button>
                                <button onclick="app.ratePlace(${place.id})" class="px-6 py-3 bg-spain-yellow text-gray-800 rounded-lg hover:bg-yellow-500">
                                    <i class="fas fa-star mr-2"></i>Valorar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(detailHTML);
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

    updateCountersDisplay() {
        document.getElementById('searchCount').textContent = this.counters.searches;
        document.getElementById('favoriteCount').textContent = this.counters.favorites;
        document.getElementById('ratingCount').textContent = this.counters.ratings;
        document.getElementById('userCount').textContent = this.counters.user;
    }

    openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.getElementById(modalId).classList.add('flex');
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        this.currentUser = { username, email };
        this.counters.user = 1;
        this.saveUser();
        this.updateCountersDisplay();
        this.closeModal('registerModal');
        this.showConseguido('¡Conseguido! Usuario registrado correctamente');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simular login
        this.currentUser = { username: email.split('@')[0], email };
        this.counters.user = 1;
        this.saveUser();
        this.updateCountersDisplay();
        this.closeModal('loginModal');
        this.showConseguido('¡Conseguido! Sesión iniciada correctamente');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.getElementById(modalId).classList.remove('flex');
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
        this.showConseguido(`¡Conseguido! Cambio a modo ${this.theme === 'light' ? 'claro' : 'oscuro'}`);
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    goToSearches() {
        this.showSearchesPage();
    }

    goToFavorites() {
        this.showFavoritesPage();
    }

    goToRatings() {
        this.showRatingsPage();
    }

    goToProfile() {
        this.showProfilePage();
    }

    goToAbout() {
        this.showAboutPage();
    }

    goToReports() {
        this.showReportsPage();
    }

    showSearchesPage() {
        const searchesHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Historial de Búsquedas - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-search text-spain-red mr-3"></i>Historial de Búsquedas
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Has realizado <strong>${this.counters.searches}</strong> búsquedas.</p>
                        <div class="space-y-2">
                            <p class="text-gray-500 dark:text-gray-400">Las búsquedas se mostrarán aquí a medida que realices nuevas búsquedas.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(searchesHTML);
    }

    showFavoritesPage() {
        const favoritesHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mis Favoritos - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-heart text-spain-red mr-3"></i>Mis Favoritos
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Tienes <strong>${this.counters.favorites}</strong> lugares favoritos.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${this.favorites.map(place => `
                                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h3 class="font-bold text-gray-800 dark:text-white">${place.name}</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">${place.description}</p>
                                </div>
                            `).join('')}
                        </div>
                        ${this.favorites.length === 0 ? '<p class="text-gray-500 dark:text-gray-400">No tienes lugares favoritos todavía.</p>' : ''}
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(favoritesHTML);
    }

    showRatingsPage() {
        const ratingsHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mis Valoraciones - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-star text-spain-yellow mr-3"></i>Mis Valoraciones
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <p class="text-gray-600 dark:text-gray-300 mb-4">Has realizado <strong>${this.counters.ratings}</strong> valoraciones.</p>
                        <div class="space-y-4">
                            ${this.ratings.map(rating => `
                                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <h3 class="font-bold text-gray-800 dark:text-white">${rating.placeName}</h3>
                                            <p class="text-sm text-gray-600 dark:text-gray-300">${new Date(rating.date).toLocaleDateString()}</p>
                                        </div>
                                        <div class="flex items-center">
                                            ${Array.from({length: 5}, (_, i) => 
                                                `<i class="fas fa-star ${i < rating.rating ? 'text-spain-yellow' : 'text-gray-300'}"></i>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ${this.ratings.length === 0 ? '<p class="text-gray-500 dark:text-gray-400">No has valorado lugares todavía.</p>' : ''}
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(ratingsHTML);
    }

    showProfilePage() {
        const profileHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mi Perfil - Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                        <i class="fas fa-user text-spain-red mr-3"></i>Mi Perfil
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de usuario</label>
                            <input type="text" id="profileUsername" value="${this.currentUser?.username || ''}" 
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white">
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                            <input type="email" id="profileEmail" value="${this.currentUser?.email || ''}" 
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white">
                        </div>
                        
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Foto de perfil</label>
                            <input type="file" id="profileAvatar" accept="image/*" 
                                   class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white">
                        </div>
                        
                        <button onclick="app.saveProfile()" class="px-6 py-3 bg-spain-yellow text-gray-800 rounded-lg hover:bg-yellow-500">
                            <i class="fas fa-save mr-2"></i>Guardar cambios
                        </button>
                        
                        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Estadísticas</h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-spain-red">${this.counters.searches}</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-300">Búsquedas</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-spain-red">${this.counters.favorites}</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-300">Favoritos</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-spain-yellow">${this.counters.ratings}</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-300">Valoraciones</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-spain-red">1</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-300">Usuario</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(profileHTML);
    }

    saveProfile() {
        const username = document.getElementById('profileUsername').value;
        const email = document.getElementById('profileEmail').value;
        
        this.currentUser = { ...this.currentUser, username, email };
        this.saveUser();
        this.showConseguido('¡Conseguido! Perfil actualizado correctamente');
    }

    showReportsPage() {
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
                    
                    <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                        <i class="fas fa-newspaper text-blue-600 mr-3"></i>Reportajes Turísticos
                    </h1>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Ordesa -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/ordesa/600/400" alt="Ordesa" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-mountain text-spain-red mr-2"></i>Ordesa y Monte Perdido
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    El Parque Nacional de Ordesa y Monte Perdido es uno de los lugares más espectaculares de los Pirineos. 
                                    Sus cañones, cascadas y picos imponentes crean un paisaje de ensueño. El Circo de Soaso, 
                                    conocido como la "Catedral del Parque", es impresionante. Rutas como la del Añisclo o la gruta de Casterás 
                                    te harán sentir en otro mundo.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Huesca, Aragón
                                </div>
                            </div>
                        </div>

                        <!-- Grazalema -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/grazalema/600/400" alt="Grazalema" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-tree text-green-600 mr-2"></i>Parque Natural de Grazalema
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    El Parque Natural de Grazalema es un paraíso de biodiversidad en Cádiz. Sus pinsapos milenarios, 
                                    el pueblo blanco de Grazalema y la Garganta Verde crean un entorno único. La ruta de la Garganta Verde 
                                    es imprescindible, con sus paredes verticales y el río que serpentea entre ellas. 
                                    En primavera, el espectáculo de las flores silvestres es inolvidable.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Cádiz, Andalucía
                                </div>
                            </div>
                        </div>

                        <!-- Islas Cíes -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/cies/600/400" alt="Islas Cíes" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-umbrella-beach text-blue-500 mr-2"></i>Las Islas Cíes
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    Las Islas Cíes son el paraíso gallego. Este archipiélago protegido solo es accesible en barco. 
                                    La Playa de Rodas, con su forma de media luna, es considerada una de las más bonitas del mundo. 
                                    Las rutas de senderismo te llevarán a miradores espectaculares como el Faro del Príncipe. 
                                    Un lugar donde la naturaleza reina sin perturbaciones.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Pontevedra, Galicia
                                </div>
                            </div>
                        </div>

                        <!-- Lugares icónicos de Baleares -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/baleares/600/400" alt="Baleares" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-landmark text-spain-yellow mr-2"></i>Lugares Icónicos de Baleares
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    Mallorca, Menorca, Ibiza y Formentera guardan joyas únicas. La Catedral de Palma, 
                                    las calas de Menorca como Macarella, las salinas de Ibiza y las playas de Formentera. 
                                    Cada isla tiene su personalidad: Mallorca monumental, Menorca tranquila, Ibiza festiva y Formentera virgen. 
                                    Un archipiélago para todos los gustos.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Islas Baleares
                                </div>
                            </div>
                        </div>

                        <!-- Zaragoza -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/zaragoza/600/400" alt="Zaragoza" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-church text-purple-600 mr-2"></i>Qué ver en Zaragoza
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    Zaragoza es una ciudad con 2000 años de historia. La Basílica del Pilar es su corazón espiritual, 
                                    la Aljafería su joya musulmana y el Palacio de la Aljafería su tesoro mudéjar. 
                                    El Puente de Piedra, el Museo Goya y el Tapeo por el Tubo completan una visita inolvidable. 
                                    En octubre, las Fiestas del Pilar la transforman.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Zaragoza, Aragón
                                </div>
                            </div>
                        </div>

                        <!-- Panticosa -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/panticosa/600/400" alt="Panticosa" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-hot-tub text-cyan-600 mr-2"></i>Los Balnearios de Panticosa
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    Los Balnearios de Panticosa son un remanso de paz en el Pirineo. Sus aguas termales, 
                                    conocidas desde tiempos romanos, brotan a 1.600 metros de altitud. El hotel Balneario, 
                                    de estilo francés, ofrece tratamientos de salud y relax. El entorno del Valle de Tena es espectacular, 
                                    ideal para combinar bienestar y naturaleza.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Huesca, Aragón
                                </div>
                            </div>
                        </div>

                        <!-- Pico Cares -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/cares/600/400" alt="Pico Cares" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-hiking text-orange-600 mr-2"></i>La Ruta del Pico Cares
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    La Ruta del Pico Cares es una de las más espectaculares de España. Este sendero de 12 km 
                                    discurre por un desfiladero impresionante entre los Picos de Europa. Las paredes verticales de más de 1.000 metros 
                                    y el río Cares serpenteando por el fondo crean un paisaje sobrecogedor. El Puente de los Rebecos 
                                    y el Mirador de la Canal de Tejedo son puntos inolvidables.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    León/Asturias
                                </div>
                            </div>
                        </div>

                        <!-- Mejores playas -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/playas/600/400" alt="Playas" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-umbrella-beach text-blue-500 mr-2"></i>Las Mejores Playas del País
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    España tiene playas para todos los gustos. Ses Illetes en Formentera, la Concha en San Sebastián, 
                                    las Teresitas en Tenerife, Bolnuevo en Murcia, Rodas en las Cíes, Mónsul en Almería... 
                                    Cada costa tiene su personalidad: desde las calas escondidas del Mediterráneo hasta las playas salvajes 
                                    del Cantábrico. Un litoral de 8.000 km lleno de paraísos.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Todo el litoral español
                                </div>
                            </div>
                        </div>

                        <!-- Doñana -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/donana/600/400" alt="Doñana" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-leaf text-green-700 mr-2"></i>El Parque Regional de Doñana
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    Doñana es el espacio natural más importante de Europa. Sus marismas, dunas y pinares 
                                    albergan miles de especies. Es el paso y refugio de aves migratorias entre Europa y África. 
                                    El lince ibérico, el águila imperial y el camaleño son sus habitantes más famosos. 
                                    Un ecosistema único en el mundo.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Huelva/Sevilla/Cádiz
                                </div>
                            </div>
                        </div>

                        <!-- Delta del Ebro -->
                        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <img src="https://picsum.photos/seed/ebro/600/400" alt="Delta del Ebro" class="w-full h-48 object-cover">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    <i class="fas fa-water text-blue-600 mr-2"></i>El Delta del Ebro
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    El Delta del Ebro es un paraíso de agua y tierra. Sus 320 km² de humedales, 
                                    arrozales y playas son un refugio para la vida silvestre. Las islas de Buda y Sant Antoni, 
                                    el Museo del Ebro y las rutas en barco por los canales te descubren un mundo único. 
                                    Un lugar donde el río abraza el mar creando vida.
                                </p>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <i class="fas fa-map-marker-alt mr-2"></i>
                                    Tarragona, Cataluña
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(reportsHTML);
    }

    showAboutPage() {
        const aboutHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Sobre Spainly</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body class="bg-gray-50 dark:bg-gray-900">
                <div class="container mx-auto px-4 py-8">
                    <button onclick="history.back()" class="mb-6 px-4 py-2 bg-spain-red text-white rounded-lg hover:bg-red-700">
                        <i class="fas fa-arrow-left mr-2"></i>Volver
                    </button>
                    
                    <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                        <i class="fas fa-info-circle text-spain-yellow mr-3"></i>Sobre Spainly
                    </h1>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">¿Qué es Spainly?</h2>
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            Spainly es una plataforma web completa para descubrir y explorar los lugares más fascinantes de España. 
                            Nuestra misión es conectar a los viajeros con las maravillas de la geografía española, 
                            desde playas paradisíacas hasta imponentes montañas, pasando por monumentos históricos 
                            y ciudades llenas de cultura.
                        </p>
                        
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">Características Principales</h3>
                        <ul class="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                            <li>Búsqueda avanzada con filtros por provincia, categoría y horario</li>
                            <li>40 lugares famosos de España con información detallada</li>
                            <li>Sistema de favoritos y valoraciones</li>
                            <li>Reportajes extensos sobre destinos turísticos</li>
                            <li>Modo claro/oscuro para mayor comodidad</li>
                            <li>Perfil de usuario personalizable</li>
                        </ul>
                        
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">Tecnología</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6">
                            Spainly está desarrollado con tecnología moderna: HTML5, CSS3 con Tailwind CSS, 
                            JavaScript vanilla para máxima compatibilidad y rendimiento. 
                            Mi diseño es responsive y accesible, funcionando perfectamente 
                            en todos los dispositivos.
                        </p>
                        
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">GitHub</h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">
                            El código fuente de Spainly es abierto y está disponible en GitHub. 
                            Puedes contribuir, reportar issues o simplemente explorar cómo funciona la aplicación.
                        </p>
                        <div class="text-center">
                            <a href="https://github.com/Cesarvilla44/Spainly" target="_blank" 
                               class="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
                                <i class="fab fa-github mr-2"></i>
                                Ver en GitHub
                            </a>
                        </div>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-3">Autor</h3>
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-spain-red rounded-full flex items-center justify-center">
                                <i class="fas fa-user text-white text-2xl"></i>
                            </div>
                            <div>
                                <p class="font-bold text-gray-800 dark:text-white">César Villacañas Moreno</p>
                                <p class="text-gray-600 dark:text-gray-300">cesar.villacanas@alu.ceacfp.es</p>
                                <p class="text-gray-600 dark:text-gray-300">Curso: 2026-2027</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        const newWindow = window.open();
        newWindow.document.write(aboutHTML);
    }

    showConseguido(message = '¡Conseguido!') {
        const conseguidoEl = document.getElementById('conseguidoMessage');
        const textEl = document.getElementById('conseguidoText');
        
        textEl.textContent = message;
        conseguidoEl.classList.remove('hidden');
        
        setTimeout(() => {
            conseguidoEl.classList.add('hidden');
        }, 3000);
    }
}

// Inicializar la aplicación
const app = new SpainlyApp();
