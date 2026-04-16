// Componente SearchBar mejorado con TypeScript (sin JSX)
import { FilterOptions } from '../types.js';

export interface SearchBarProps {
    onSearch: (query: string, filters: FilterOptions) => void;
    loading?: boolean;
}

export class SearchBar {
    private props: SearchBarProps;
    private containerId: string;

    constructor(props: SearchBarProps, containerId: string = 'searchBar') {
        this.props = props;
        this.containerId = containerId;
    }

    public render(): string {
        const { loading } = this.props;
        
        return `
            <div id="${this.containerId}" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <form id="searchForm" class="space-y-4">
                    <!-- Búsqueda principal -->
                    <div class="relative">
                        <input
                            type="text"
                            id="searchInput"
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
                        ${loading ? 'disabled' : ''}
                        class="w-full px-6 py-3 bg-spain-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        ${loading ? 
                            '<i class="fas fa-spinner fa-spin mr-2"></i>Buscando...' : 
                            '<i class="fas fa-search mr-2"></i>Buscar'
                        }
                    </button>
                </form>
            </div>
        `;
    }

    public setupEventListeners(): void {
        const form = document.getElementById('searchForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }
    }

    private handleSearch(): void {
        const form = document.getElementById('searchForm') as HTMLFormElement;
        if (!form) return;

        const formData = new FormData(form);
        const query = formData.get('query') as string || '';
        const province = formData.get('province') as string;
        const category = formData.get('category') as string;
        const schedule = formData.get('schedule') as string;

        const filters: FilterOptions = {};
        if (province) filters.province = province;
        if (category) filters.category = category as 'playa' | 'montaña' | 'monumento';
        if (schedule) filters.schedule = schedule;

        this.props.onSearch(query, filters);
    }

    public setLoading(loading: boolean): void {
        this.props.loading = loading;
        this.update();
    }

    private update(): void {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.outerHTML = this.render();
            this.setupEventListeners();
        }
    }
}

export default SearchBar;
