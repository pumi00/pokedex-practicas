import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PokemonList from '../src/components/PokemonList';
import SearchBar from '../src/components/SearchBar';
import TypeFilter from '../src/components/TypeFilter';
import { getPokemonList, searchPokemon } from '../src/services/pokemonService';

export default function HomeScreen() {
    const [pokemons, setPokemons] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [offset, setOffset] = useState(0);
    const [searching, setSearching] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const router = useRouter();

    const loadPokemons = async (reset = false) => {
        if (loading) return;
        setLoading(true);
        setError('');
        try {
            const currentOffset = reset ? 0 : offset;
            const data = await getPokemonList(currentOffset);
            if (reset) {
                setPokemons(data);
                setOffset(21);
            } else {
                setPokemons(prev => {
                    const existingIds = new Set(prev.map((p: any) => p.id));
                    const newPokemons = data.filter((p: any) => !existingIds.has(p.id));
                    return [...prev, ...newPokemons];
                });
                setOffset(currentOffset + 21);
            }
        } catch (e) {
            setError('Error al cargar los Pokémon. Revisa tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (name: string) => {
        if (!name.trim()) return;
        setLoading(true);
        setError('');
        setSearching(true);
        setSelectedType('all');
        try {
            const results = await searchPokemon(name);
            setPokemons(results);
        } catch (e: any) {
            setError(e.message || `No se encontró ningún Pokémon llamado "${name}"`);
            setPokemons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearching(false);
        setSelectedType('all');
        setPokemons([]);
        setOffset(0);
        loadPokemons(true);
    };

    const filteredPokemons = selectedType === 'all'
        ? pokemons
        : pokemons.filter((p: any) =>
            p.types.some((t: any) => t.type.name === selectedType)
        );

    useEffect(() => {
        loadPokemons(true);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokédex</Text>
                <TouchableOpacity onPress={() => router.push('/favorites')} style={styles.favBtn}>
                    <Ionicons name="heart" size={28} color="#E53935" />
                </TouchableOpacity>
            </View>
            <SearchBar onSearch={handleSearch} onClear={handleClear} />
            <TypeFilter selected={selectedType} onSelect={setSelectedType} />
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <PokemonList
                    pokemons={filteredPokemons}
                    loading={loading}
                    onEndReached={!searching ? () => loadPokemons() : undefined}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#E53935',
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    favBtn: {
        padding: 8,
    },
});