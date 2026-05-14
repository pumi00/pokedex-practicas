import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const TYPES = [
    'all', 'fire', 'water', 'grass', 'electric', 'psychic',
    'ice', 'dragon', 'dark', 'fairy', 'normal', 'fighting',
    'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel'
];

const typeColors: Record<string, string> = {
    all: '#666', fire: '#F08030', water: '#6890F0', grass: '#78C850',
    electric: '#F8D030', psychic: '#F85888', ice: '#98D8D8',
    dragon: '#7038F8', dark: '#705848', fairy: '#EE99AC',
    normal: '#A8A878', fighting: '#C03028', flying: '#A890F0',
    poison: '#A040A0', ground: '#E0C068', rock: '#B8A038',
    bug: '#A8B820', ghost: '#705898', steel: '#B8B8D0',
};

const typeIcons: Record<string, string> = {
    all: '🔍', fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
    psychic: '🔮', ice: '❄️', dragon: '🐉', dark: '🌑', fairy: '✨',
    normal: '⭐', fighting: '🥊', flying: '🌬️', poison: '☠️',
    ground: '🌍', rock: '🪨', bug: '🐛', ghost: '👻', steel: '⚙️',
};

interface Props {
    selected: string;
    onSelect: (type: string) => void;
}

export default function TypeFilter({ selected, onSelect }: Props) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {TYPES.map((type) => (
                <TouchableOpacity
                    key={type}
                    onPress={() => onSelect(type)}
                    style={[
                        styles.badge,
                        { backgroundColor: typeColors[type] },
                        selected === type && styles.selected,
                    ]}
                >
                    <Text style={styles.icon}>{typeIcons[type]}</Text>
                    <Text style={styles.text}>{type}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 56,
        marginVertical: 6,
    },
    content: {
        paddingHorizontal: 12,
        gap: 8,
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        opacity: 0.75,
        gap: 4,
    },
    selected: {
        opacity: 1,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    icon: {
        fontSize: 12,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'capitalize',
        fontSize: 12,
    },
});