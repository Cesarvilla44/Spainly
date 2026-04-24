// Tipos para la aplicación Spainly

export interface Place {
    id: number;
    name: string;
    province: string;
    category: 'playa' | 'montaña' | 'monumento';
    schedule: string;
    image: string;
    description: string;
    fullDescription: string;
    rating: number;
    reviews: number;
}

export interface User {
    username: string;
    email: string;
    password?: string;
    profileName?: string;
    birthDate?: string;
    bio?: string;
    photo?: string; // Base64 de la imagen
    keepSession?: boolean;
    favorites?: number[];
    ratings?: number[];
}

export interface Counter {
    searches: number;
    favorites: number;
    ratings: number;
    user: number;
}

export interface Search {
    id: string;
    query: string;
    filters: {
        province?: string;
        category?: string;
        schedule?: string;
    };
    timestamp: number;
}

export interface Rating {
    id: string;
    placeId: number;
    rating: number;
    comment: string;
    timestamp: number;
}

export type Theme = 'light' | 'dark';

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ModalState {
    isOpen: boolean;
    type: 'register' | 'login' | null;
}

export interface FilterOptions {
    province?: string;
    category?: string;
    schedule?: string;
}
