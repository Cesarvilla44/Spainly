// Componente PlaceCard mejorado con TypeScript (sin JSX)
import { Place } from '../types.js';

export interface PlaceCardProps {
    place: Place;
    onDetails: (placeId: number) => void;
    onFavorite: (placeId: number) => void;
    isFavorite: boolean;
}

export class PlaceCard {
    private props: PlaceCardProps;

    constructor(props: PlaceCardProps) {
        this.props = props;
    }

    public render(): string {
        const { place, onDetails, onFavorite, isFavorite } = this.props;
        
        return `
            <div class="place-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer" 
                 data-place-id="${place.id}">
                <img src="${place.image}" alt="${place.name}" class="w-full h-48 object-cover" loading="lazy">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">${place.name}</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">${place.description}</p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center">
                            <i class="fas fa-star text-yellow-500 mr-1"></i>
                            <span class="text-gray-700 dark:text-gray-300">${place.rating}</span>
                            <span class="text-gray-500 text-sm ml-2">(${place.reviews})</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-500 dark:text-gray-400">${place.schedule}</span>
                            <button onclick="app.toggleFavorite(${place.id})" 
                                    class="p-2 rounded-full transition-colors ${
                                        isFavorite 
                                            ? 'bg-red-500 text-white' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    }">
                                <i class="fas fa-heart ${isFavorite ? '' : 'far'}"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

export default PlaceCard;
