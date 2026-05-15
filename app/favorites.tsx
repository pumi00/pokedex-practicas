import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import PokemonList from '../src/components/PokemonList';
import { getFavorites } from '../src/services/favoritesService';

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                setLoading(true);
                const data = await getFavorites();
                setFavorites(data);
                setLoading(false);
            };
            load();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Mis Favoritos</Text>
            {!loading && favorites.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No tienes Pokémon favoritos aún</Text>
                    <Text style={styles.emptyIcon}>🤍</Text>
                </View>
            ) : (
                <PokemonList pokemons={favorites} loading={loading} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', padding: 16, color: '#333' },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
    emptyText: { fontSize: 16, color: '#999' },
    emptyIcon: { fontSize: 48 },
});