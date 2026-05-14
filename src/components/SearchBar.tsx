import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    onSearch: (name: string) => void;
    onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: Props) {
    const [text, setText] = useState('');

    const handleSearch = () => {
        if (!text.trim()) return;
        onSearch(text.trim());
    };

    const handleClear = () => {
        setText('');
        onClear();
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Nombre, número o forma regional..."
                    placeholderTextColor="#bbb"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSearch}
                    autoCapitalize="none"
                    returnKeyType="search"
                />
                {text.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                        <Ionicons name="close-circle" size={18} color="#bbb" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        alignItems: 'center',
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 6,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 14,
        color: '#333',
    },
    clearBtn: {
        padding: 4,
    },
    button: {
        backgroundColor: '#E53935',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});