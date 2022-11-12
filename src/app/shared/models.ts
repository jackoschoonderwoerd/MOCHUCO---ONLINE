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
    itemsByLanguage?: ItemByLanguage[] // array of items sorted by language
}

export interface Venue {
    id?: string;
    name: string;
    items?: Item[] // array of items
}
