import React, { useState, useCallback } from 'react';
import { FilterOptions } from '../types.js';

interface SearchBarProps {
    onSearch: (query: string, filters: FilterOptions) => void;
    loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<FilterOptions>({});

    const provinces = [
        'barcelona', 'madrid', 'sevilla', 'valencia', 'bilbao', 
        'granada', 'cordoba', 'malaga', 'alicante', 'murcia',
        'guipuzcoa', 'pontevedra', 'asturias', 'tenerife', 'baleares'
    ];

    const categories = [
        { value: 'playa', label: 'Playas', icon: 'fa-umbrella-beach' },
        { value: 'montaña', label: 'Montañas', icon: 'fa-mountain' },
        { value: 'monumento', label: 'Monumentos', icon: 'fa-landmark' }
    ];

    const schedules = [
        { value: '24h', label: '24 horas' },
        { value: '08-20', label: 'Mañana (8-20h)' },
        { value: '10-18', label: 'Oficina (10-18h)' },
        { value: '09-20', label: 'Completo (9-20h)' }
    ];

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query, filters);
    }, [query, filters, onSearch]);

    const handleFilterChange = useCallback((key: keyof FilterOptions, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Búsqueda principal */}
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar lugares, provincias, actividades..."
                        className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                    />
                    <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Provincia */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <i className="fas fa-map-marker-alt mr-2"></i>Provincia
                        </label>
                        <select
                            value={filters.province || ''}
                            onChange={(e) => handleFilterChange('province', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Todas las provincias</option>
                            {provinces.map(province => (
                                <option key={province} value={province}>
                                    {province.charAt(0).toUpperCase() + province.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <i className="fas fa-filter mr-2"></i>Categoría
                        </label>
                        <select
                            value={filters.category || ''}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    <i className={`fas ${category.icon} mr-2`}></i>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Horario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <i className="fas fa-clock mr-2"></i>Horario
                        </label>
                        <select
                            value={filters.schedule || ''}
                            onChange={(e) => handleFilterChange('schedule', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-spain-red dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Cualquier horario</option>
                            {schedules.map(schedule => (
                                <option key={schedule.value} value={schedule.value}>
                                    {schedule.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Botón de búsqueda */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-spain-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                        <i className="fas fa-search mr-2"></i>
                    )}
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
