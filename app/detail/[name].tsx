import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { addFavorite, isFavorite, removeFavorite } from '../../src/services/favoritesService';
import { getEvolutionChain, getPokemonByName } from '../../src/services/pokemonService';


const typeColors: Record<string, string> = {
    fire: '#FF6B6B', water: '#4FC3F7', grass: '#81C784',
    electric: '#FFD54F', psychic: '#F48FB1', ice: '#80DEEA',
    dragon: '#7986CB', dark: '#616161', fairy: '#F8BBD9',
    normal: '#BCAAA4', fighting: '#FF7043', flying: '#90CAF9',
    poison: '#CE93D8', ground: '#FFCC80', rock: '#B0BEC5',
    bug: '#AED581', ghost: '#7E57C2', steel: '#B0BEC5',
};

export default function DetailScreen() {
    const { name } = useLocalSearchParams();
    const [pokemon, setPokemon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [evolutions, setEvolutions] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPokemonByName(name as string);
                setPokemon(data);
                const fav = await isFavorite(data.id);
                setFavorite(fav);
            } catch (e) {
                setError('No se pudo cargar el Pokémon.');
            } finally {
                setLoading(false);
            }

            // Cadena evolutiva separada para que no rompa la pantalla
            try {
                const evoChain = await getEvolutionChain(name as string);
                setEvolutions(evoChain);
            } catch (e) {
                console.log('No se pudo cargar la cadena evolutiva');
            }
        };
        load();
    }, [name]);

    const toggleFavorite = async () => {
        if (!pokemon) return;
        if (favorite) {
            await removeFavorite(pokemon.id);
            setFavorite(false);
        } else {
            await addFavorite(pokemon);
            setFavorite(true);
        }
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#E53935" />
        </View>
    );

    if (error) return (
        <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
        </View>
    );

    const type = pokemon.types[0].type.name;
    const color = typeColors[type] || '#BCAAA4';
    const image = pokemon.sprites.other['official-artwork'].front_default;

    return (
        <ScrollView style={[styles.container, { backgroundColor: color }]}>
            <View style={styles.header}>
                <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favButton}>
                    <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            <Text style={styles.name}>{pokemon.name}</Text>
            <Image source={{ uri: image }} style={styles.image} />

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Tipos</Text>
                <View style={styles.row}>
                    {pokemon.types.map((t: any) => (
                        <View key={t.type.name} style={[styles.badge, { backgroundColor: color }]}>
                            <Text style={styles.badgeText}>{t.type.name}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Info</Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Altura</Text>
                        <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Peso</Text>
                        <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Habilidades</Text>
                <View style={styles.row}>
                    {pokemon.abilities.map((a: any) => (
                        <View key={a.ability.name} style={styles.abilityBadge}>
                            <Text style={styles.abilityText}>{a.ability.name}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Estadísticas</Text>
                {pokemon.stats.map((s: any) => (
                    <View key={s.stat.name} style={styles.statRow}>
                        <Text style={styles.statName}>{s.stat.name}</Text>
                        <View style={styles.statBarBg}>
                            <View style={[styles.statBar, { width: `${(s.base_stat / 255) * 100}%`, backgroundColor: color }]} />
                        </View>
                        <Text style={styles.statValue}>{s.base_stat}</Text>
                    </View>
                ))}
                {evolutions.length > 1 && (
                    <>
                        <Text style={styles.sectionTitle}>Cadena Evolutiva</Text>
                        <View style={styles.evoRow}>
                            {evolutions.map((evo: any, index: number) => (
                                <View key={evo.id} style={styles.evoContainer}>
                                    <View style={styles.evoItem}>
                                        <Image
                                            source={{ uri: evo.sprites.other['official-artwork'].front_default }}
                                            style={styles.evoImage}
                                        />
                                        <Text style={styles.evoName}>{evo.name}</Text>
                                    </View>
                                    {index < evolutions.length - 1 && (
                                        <Text style={styles.evoArrow}>→</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    error: { color: '#E53935', fontSize: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    id: { color: 'rgba(0,0,0,0.3)', fontWeight: 'bold' },
    favButton: { padding: 8 },
    favIcon: { fontSize: 28 },
    name: { fontSize: 32, fontWeight: 'bold', color: '#fff', textTransform: 'capitalize', paddingHorizontal: 16 },
    image: { width: 220, height: 220, alignSelf: 'center' },
    card: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, marginTop: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 8 },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
    badgeText: { color: '#fff', fontWeight: 'bold', textTransform: 'capitalize' },
    infoRow: { flexDirection: 'row', gap: 16 },
    infoBox: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, alignItems: 'center' },
    infoLabel: { color: '#999', fontSize: 13 },
    infoValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    abilityBadge: { backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    abilityText: { textTransform: 'capitalize', color: '#555' },
    statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    statName: { width: 100, fontSize: 12, color: '#666', textTransform: 'capitalize' },
    statBarBg: { flex: 1, height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
    statBar: { height: 8, borderRadius: 4 },
    statValue: { width: 35, fontSize: 12, fontWeight: 'bold', color: '#333', textAlign: 'right' },
    evoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    evoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    evoItem: {
        alignItems: 'center',
    },
    evoImage: {
        width: 80,
        height: 80,
    },
    evoName: {
        fontSize: 12,
        textTransform: 'capitalize',
        color: '#555',
        textAlign: 'center',
    },
    evoArrow: {
        fontSize: 24,
        color: '#999',
        marginHorizontal: 8,
    },
});