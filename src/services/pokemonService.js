const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async (limit = 20) => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) throw new Error('Error al obtener la lista de Pokémon');
    const data = await response.json();

    const details = await Promise.all(
        data.results.map(p => getPokemonByName(p.name))
    );
    return details;
};

export const getPokemonByName = async (name) => {
    const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
    if (!response.ok) throw new Error(`Pokémon "${name}" no encontrado`);
    const data = await response.json();
    return data;
};

export const getEvolutionChain = async (pokemonName) => {
    try {
        // Obtenemos la especie — para formas regionales/megas usamos el nombre base
        const baseName = pokemonName
            .replace(/-mega.*$/, '')           
            .replace(/-alola$/, '')  
            .replace(/-galar$/, '')  
            .replace(/-hisui$/, '')  
            .replace(/-paldea$/, '')  
            .replace(/-origin$/, '')  
            .replace(/-therian$/, '')  
            .replace(/-black$/, '')  
            .replace(/-white$/, '')  
            .replace(/-incarnate$/, '')  
            .replace(/-land$/, '')  
            .replace(/-sky$/, ''); 

        const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${baseName}`);
        if (!speciesRes.ok) return [];
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        if (!evoRes.ok) return [];
        const evoData = await evoRes.json();

        // Recorre todas las ramas recursivamente
        const extractNames = (chain) => {
            const names = [chain.species.name];
            if (chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(evo => {
                    names.push(...extractNames(evo));
                });
            }
            return names;
        };

        const allNames = [...new Set(extractNames(evoData.chain))];

        // Para cada Pokémon en la cadena, intentamos obtener la forma regional si aplica
        const getSuffix = (name) => {
            if (pokemonName.endsWith('-alola')) return '-alola';
            if (pokemonName.endsWith('-galar')) return '-galar';
            if (pokemonName.endsWith('-hisui')) return '-hisui';
            if (pokemonName.endsWith('-paldea')) return '-paldea';
            return '';
        };

        const suffix = getSuffix(pokemonName);

        const evolutions = await Promise.all(
            allNames.map(async (n) => {
                // Intenta primero con la forma regional
                if (suffix) {
                    try {
                        return await getPokemonByName(`${n}${suffix}`);
                    } catch {
                        // Si no existe la forma regional, usa el normal
                        return await getPokemonByName(n);
                    }
                }
                return await getPokemonByName(n);
            })
        );

        return evolutions;
    } catch (e) {
        console.log('Error cadena evolutiva:', e);
        return [];
    }
};

export const searchPokemon = async (query) => {
    const q = query.toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quita tildes

    // Mapeo de nombres regionales en español/inglés
    const regionalMap = {
        'alolan': 'alola',
        'galarian': 'galar',
        'hisuian': 'hisui',
        'paldean': 'paldea',
        'alola': 'alola',
        'galar': 'galar',
        'hisui': 'hisui',
        'paldea': 'paldea',
    };

    // Si es un número busca por ID directamente
    if (!isNaN(q)) {
        const pokemon = await getPokemonByName(q);
        return [pokemon];
    }

    // Detecta si busca forma regional
    let searchQuery = q;
    for (const [key, region] of Object.entries(regionalMap)) {
        if (q.includes(key)) {
            const baseName = q.replace(key, '').trim().replace(/\s+/g, '-');
            searchQuery = `${baseName}-${region}`;
            break;
        }
    }

    // Intenta búsqueda exacta primero
    try {
        const pokemon = await getPokemonByName(searchQuery.replace(/\s+/g, '-'));
        return [pokemon];
    } catch { }

    // Si falla, busca en la lista completa
    const res = await fetch(`${BASE_URL}/pokemon?limit=2000`);
    const data = await res.json();

    const matches = data.results.filter(p =>
        p.name.includes(searchQuery.replace(/\s+/g, '-'))
    );

    if (matches.length === 0) throw new Error(`No se encontró "${query}"`);

    // Limitamos a 20 resultados para no saturar
    const limited = matches.slice(0, 20);
    const details = await Promise.all(limited.map(p => getPokemonByName(p.name)));
    return details;
};
