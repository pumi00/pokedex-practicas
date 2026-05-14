import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import PokemonCard from './PokemonCard';

interface Props {
    pokemons: any[];
    loading: boolean;
    onEndReached?: () => void;
    onFavoriteToggle?: (id: number, isFav: boolean) => void;
}

export default function PokemonList({ pokemons, loading, onEndReached, onFavoriteToggle }: Props) {
    const { width } = useWindowDimensions();
    const numColumns = Math.max(2, Math.floor(width / 180));
    const cardWidth = (width - 16 * (numColumns + 1)) / numColumns;

    if (loading && pokemons.length === 0) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#E53935" />
            </View>
        );
    }

    return (
        <FlatList
            data={pokemons}
            key={numColumns}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <PokemonCard
                    pokemon={item}
                    cardWidth={cardWidth}
                />
            )}
            numColumns={numColumns}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.list}
            columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
            ListFooterComponent={
                onEndReached ? (
                    <View style={styles.footerContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#E53935" />
                        ) : (
                            <TouchableOpacity style={styles.loadMoreBtn} onPress={onEndReached}>
                                <Text style={styles.loadMoreText}>Cargar más Pokémon</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : null
            }
        />
    );
}

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16, gap: 16 },
    row: { gap: 16, justifyContent: 'space-between' },
    footerContainer: { alignItems: 'center', paddingVertical: 20 },
    loadMoreBtn: {
        backgroundColor: '#E53935',
        paddingHorizontal: 24, paddingVertical: 12,
        borderRadius: 24, elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, shadowRadius: 4,
    },
    loadMoreText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});