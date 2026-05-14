import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addFavorite, isFavorite, removeFavorite } from '../../src/services/favoritesService';

const typeColors: Record<string, string> = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0',
    electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
    fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
    flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
    dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC',
};

const typeIcons: Record<string, string> = {
    normal: '⭐', fire: '🔥', water: '💧', electric: '⚡',
    grass: '🌿', ice: '❄️', fighting: '🥊', poison: '☠️',
    ground: '🌍', flying: '🌬️', psychic: '🔮', bug: '🐛',
    rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌑',
    steel: '⚙️', fairy: '✨',
};

interface Props {
    pokemon: any;
    cardWidth: number;
    onFavoriteToggle?: (pokemonId: number, isFavorite: boolean) => void;
}

export default function PokemonCard({ pokemon, cardWidth, onFavoriteToggle }: Props) {
    const router = useRouter();
    const [favorite, setFavorite] = useState(false);

    const type1 = pokemon.types[0].type.name;
    const type2 = pokemon.types[1]?.type.name;
    const color1 = typeColors[type1] || '#A8A878';
    const color2 = type2 ? typeColors[type2] || '#A8A878' : color1;
    const image = pokemon.sprites.other['official-artwork'].front_default;

    // useFocusEffect para refrescar el estado del corazón
    // cada vez que la pantalla vuelve a estar en foco
    useFocusEffect(
        useCallback(() => {
            isFavorite(pokemon.id).then(setFavorite);
        }, [pokemon.id])
    );

    const toggleFavorite = async (e: any) => {
        e.stopPropagation();
        if (favorite) {
            await removeFavorite(pokemon.id);
            setFavorite(false);
            onFavoriteToggle?.(pokemon.id, false);
        } else {
            await addFavorite(pokemon);
            setFavorite(true);
            onFavoriteToggle?.(pokemon.id, true);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push(`/detail/${pokemon.name}`)}
            style={[styles.wrapper, { width: cardWidth }]}
        >
            <View style={[styles.card, { backgroundColor: color1 }]}>
                {type2 && (
                    <View style={[styles.secondTypeOverlay, { backgroundColor: color2 }]} />
                )}
                <View style={styles.circleBg} />
                <View style={styles.header}>
                    <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
                    <TouchableOpacity
                        onPress={toggleFavorite}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons
                            name={favorite ? 'heart' : 'heart-outline'}
                            size={18}
                            color={favorite ? '#fff' : 'rgba(255,255,255,0.7)'}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{pokemon.name}</Text>
                <View style={styles.types}>
                    {pokemon.types.map((t: any) => (
                        <View key={t.type.name} style={styles.typeBadge}>
                            <Text style={styles.typeIcon}>{typeIcons[t.type.name] ?? '•'}</Text>
                            <Text style={styles.typeText}>{t.type.name}</Text>
                        </View>
                    ))}
                </View>
                <Image source={{ uri: image }} style={styles.image} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    wrapper: { margin: 0 },
    card: {
        borderRadius: 20,
        padding: 12,
        overflow: 'hidden',
        minHeight: 155,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    secondTypeOverlay: {
        position: 'absolute',
        bottom: 0, right: 0,
        width: '55%', height: '100%',
        borderTopLeftRadius: 80,
        opacity: 0.7,
    },
    circleBg: {
        position: 'absolute',
        width: 120, height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.1)',
        bottom: -25, right: -15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    id: { color: 'rgba(0,0,0,0.3)', fontWeight: '700', fontSize: 11 },
    name: {
        fontSize: 15, fontWeight: '800',
        textTransform: 'capitalize', color: '#fff',
        marginBottom: 6,
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    types: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
    typeBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 6, paddingVertical: 2,
        borderRadius: 20, gap: 2,
    },
    typeIcon: { fontSize: 9 },
    typeText: { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
    image: { width: 90, height: 90, position: 'absolute', bottom: 0, right: 4 },
});