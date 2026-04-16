import React from 'react';
import { Place } from '../types.js';

interface PlaceCardProps {
    place: Place;
    onDetails: (placeId: number) => void;
    onFavorite: (placeId: number) => void;
    isFavorite: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ 
    place, 
    onDetails, 
    onFavorite, 
    isFavorite 
}) => {
    const handleClick = () => {
        onDetails(place.id);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavorite(place.id);
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
            onClick={handleClick}
        >
            <img 
                src={place.image} 
                alt={place.name} 
                className="w-full h-48 object-cover"
                loading="lazy"
            />
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {place.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {place.description}
                </p>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <i className="fas fa-star text-yellow-500 mr-1"></i>
                        <span className="text-gray-700 dark:text-gray-300">
                            {place.rating}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                            ({place.reviews})
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {place.schedule}
                        </span>
                        <button
                            onClick={handleFavoriteClick}
                            className={`p-2 rounded-full transition-colors ${
                                isFavorite 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                        >
                            <i className={`fas fa-heart ${isFavorite ? '' : 'far'}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceCard;
