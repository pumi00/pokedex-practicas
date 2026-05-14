import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'pokemon_favorites';

// Solo guardamos lo esencial
interface SavedPokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: { other: { 'official-artwork': { front_default: string } } };
    height: number;
    weight: number;
    abilities: { ability: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
}

const slimPokemon = (pokemon: any): SavedPokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types,
    sprites: {
        other: {
            'official-artwork': {
                front_default: pokemon.sprites.other['official-artwork'].front_default
            }
        }
    },
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities,
    stats: pokemon.stats,
});

export const getFavorites = async (): Promise<any[]> => {
    try {
        const data = await AsyncStorage.getItem(KEY);
        const parsed = data ? JSON.parse(data) : [];
        // Filtra por si acaso hay algún item corrupto
        return parsed.filter((p: any) => p?.id != null && p?.types?.length > 0);
    } catch {
        return [];
    }
};

export const addFavorite = async (pokemon: any): Promise<void> => {
    const favorites = await getFavorites();
    const exists = favorites.find((p) => p.id === pokemon.id);
    if (!exists) {
        const slim = slimPokemon(pokemon);  // 👈 guarda versión reducida
        await AsyncStorage.setItem(KEY, JSON.stringify([...favorites, slim]));
    }
};

export const removeFavorite = async (id: number): Promise<void> => {
    const favorites = await getFavorites();
    const updated = favorites.filter((p) => p.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
};

export const isFavorite = async (id: number): Promise<boolean> => {
    const favorites = await getFavorites();
    return favorites.some((p) => Number(p.id) === Number(id));
};