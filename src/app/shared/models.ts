export interface ItemLS {
    name: string,
    description: string;
    audioUrl?: string
    audioAutoplay?: boolean;
}

export interface ItemByLanguage {
    language: string;
    itemLS: ItemLS // language specific data
}

export interface Item {
    name: string;
    id?: string;
    isMainPage: boolean;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    itemsByLanguage?: ItemByLanguage[] // array of items sorted by language
}

export interface Venue {
    id?: string;
    owner: string;
    name: string;
    logoUrl?: string;
    items?: Item[] // array of items
}
export interface UserRoles {
    admin: boolean;
}

export interface ItemLocation {
    id?: string;
    latitude: number;
    longitude: number;
}
