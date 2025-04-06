
const POKEAPI = "https://pokeapi.co/api/v2"



async function getPokemonTypes() {
    let typesData = [];
    let nextUrl = `${POKEAPI}/type`;
    
    try {
        while (nextUrl) {
            const res = await fetch(nextUrl);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            typesData.push(...data.results);
            nextUrl = data.next; // Actualiza la URL para la siguiente página
        }
        
        return typesData;
        
    } catch (error) {
        console.error('Error fetching types:', error);
        throw error;
    }
}


async function getPokemonsByType( typeUrl ) {

    const res = await fetch(typeUrl);
    const data = await res.json();

    const pokemons = data.pokemon

    let pokemonsData = [];

    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i].pokemon;

        console.log("getting data for", pokemon.name)
        const resPokemonData = await fetch(pokemon.url);
        const pokemonData = await resPokemonData.json();
        pokemonsData.push({
            name: pokemon.name,
            height: pokemonData.height
        });
       
    }

    return pokemonsData

}

async function getAverageHeight() {

    let pokemonsByType = {};
    
// let pokemonsByType = {
// dark: [
//     { name: 'umbreon', height: 10 },
//     { name: 'murkrow', height: 5 },
//     { name: 'sneasel', height: 9 },
//     { name: 'houndour', height: 6 },
//     { name: 'houndoom', height: 14 },
//     { name: 'tyranitar', height: 20 },
//     { name: 'poochyena', height: 5 },
//     { name: 'mightyena', height: 10 },
//     { name: 'nuzleaf', height: 10 },
//     { name: 'shiftry', height: 13 },
//     { name: 'sableye', height: 5 },
//     { name: 'carvanha', height: 8 },
//     { name: 'sharpedo', height: 18 },
//     { name: 'cacturne', height: 13 },
//     { name: 'crawdaunt', height: 11 },
//     { name: 'absol', height: 12 },
//     { name: 'honchkrow', height: 9 },
//     { name: 'stunky', height: 4 },
//     { name: 'skuntank', height: 10 },
//     { name: 'spiritomb', height: 10 },
//     { name: 'drapion', height: 13 },
//     { name: 'weavile', height: 11 },
//     { name: 'darkrai', height: 15 },
//     { name: 'purrloin', height: 4 },
//     { name: 'liepard', height: 11 },
//     { name: 'sandile', height: 7 },
//     { name: 'krokorok', height: 10 },
//     { name: 'krookodile', height: 15 },
//     { name: 'scraggy', height: 6 },
//     { name: 'scrafty', height: 11 },
//     { name: 'zorua', height: 7 },
//     { name: 'zoroark', height: 16 },
//     { name: 'pawniard', height: 5 },
//     { name: 'bisharp', height: 16 },
//     { name: 'vullaby', height: 5 },
//     { name: 'mandibuzz', height: 12 },
//     { name: 'deino', height: 8 },
//     { name: 'zweilous', height: 14 },
//     { name: 'hydreigon', height: 18 },
//     { name: 'greninja', height: 15 },
//     { name: 'pangoro', height: 21 },
//     { name: 'inkay', height: 4 },
//     { name: 'malamar', height: 15 },
//     { name: 'yveltal', height: 58 },
//     { name: 'incineroar', height: 18 },
//     { name: 'guzzlord', height: 55 },
//     { name: 'nickit', height: 6 },
//     { name: 'thievul', height: 12 },
//     { name: 'impidimp', height: 4 },
//     { name: 'morgrem', height: 8 },
//     { name: 'grimmsnarl', height: 15 },
//     { name: 'obstagoon', height: 16 },
//     { name: 'morpeko-full-belly', height: 3 },
//     { name: 'urshifu-single-strike', height: 19 },
//     { name: 'zarude', height: 18 },
//     { name: 'overqwil', height: 25 },
//     { name: 'meowscarada', height: 15 },
//     { name: 'lokix', height: 10 },
//     { name: 'maschiff', height: 5 },
//     { name: 'mabosstiff', height: 11 },
//     { name: 'bombirdier', height: 15 },
//     { name: 'kingambit', height: 20 },
//     { name: 'brute-bonnet', height: 12 },
//     { name: 'iron-jugulis', height: 13 },
//     { name: 'wo-chien', height: 15 },
//     { name: 'chien-pao', height: 19 },
//     { name: 'ting-lu', height: 27 },
//     { name: 'chi-yu', height: 4 },
//     { name: 'roaring-moon', height: 20 },
//     { name: 'gyarados-mega', height: 65 },
//     { name: 'houndoom-mega', height: 19 },
//     { name: 'tyranitar-mega', height: 25 },
//     { name: 'absol-mega', height: 12 },
//     { name: 'sableye-mega', height: 5 },
//     { name: 'sharpedo-mega', height: 25 },
//     { name: 'hoopa-unbound', height: 65 },
//     { name: 'rattata-alola', height: 3 },
//     { name: 'raticate-alola', height: 7 },
//     { name: 'raticate-totem-alola', height: 14 },
//     { name: 'meowth-alola', height: 4 },
//     { name: 'persian-alola', height: 11 },
//     { name: 'grimer-alola', height: 7 },
//     { name: 'muk-alola', height: 10 },
//     { name: 'greninja-battle-bond', height: 15 },
//     { name: 'greninja-ash', height: 15 },
//     { name: 'moltres-galar', height: 20 },
//     { name: 'zigzagoon-galar', height: 4 },
//     { name: 'linoone-galar', height: 5 },
//     { name: 'morpeko-hangry', height: 3 },
//     { name: 'zarude-dada', height: 18 },
//     { name: 'grimmsnarl-gmax', height: 320 },
//     { name: 'urshifu-single-strike-gmax', height: 290 },
//     { name: 'qwilfish-hisui', height: 5 },
//     { name: 'samurott-hisui', height: 15 }
//   ],
//   fairy: [
//     { name: 'clefairy', height: 6 },
//     { name: 'clefable', height: 13 },
//     { name: 'jigglypuff', height: 5 },
//     { name: 'wigglytuff', height: 10 },
//     { name: 'mr-mime', height: 13 },
//     { name: 'cleffa', height: 3 },
//     { name: 'igglybuff', height: 3 },
//     { name: 'togepi', height: 3 },
//     { name: 'togetic', height: 6 },
//     { name: 'marill', height: 4 },
//     { name: 'azumarill', height: 8 },
//     { name: 'snubbull', height: 6 },
//     { name: 'granbull', height: 14 },
//     { name: 'ralts', height: 4 },
//     { name: 'kirlia', height: 8 },
//     { name: 'gardevoir', height: 16 },
//     { name: 'azurill', height: 2 },
//     { name: 'mawile', height: 6 },
//     { name: 'mime-jr', height: 6 },
//     { name: 'togekiss', height: 15 },
//     { name: 'cottonee', height: 3 },
//     { name: 'whimsicott', height: 7 },
//     { name: 'flabebe', height: 1 },
//     { name: 'floette', height: 2 },
//     { name: 'florges', height: 11 },
//     { name: 'spritzee', height: 2 },
//     { name: 'aromatisse', height: 8 },
//     { name: 'swirlix', height: 4 },
//     { name: 'slurpuff', height: 8 },
//     { name: 'sylveon', height: 10 },
//     { name: 'dedenne', height: 2 },
//     { name: 'carbink', height: 3 },
//     { name: 'klefki', height: 2 },
//     { name: 'xerneas', height: 30 },
//     { name: 'diancie', height: 7 },
//     { name: 'primarina', height: 18 },
//     { name: 'cutiefly', height: 1 },
//     { name: 'ribombee', height: 2 },
//     { name: 'morelull', height: 2 },
//     { name: 'shiinotic', height: 10 },
//     { name: 'comfey', height: 1 },
//     { name: 'mimikyu-disguised', height: 2 },
//     { name: 'tapu-koko', height: 18 },
//     { name: 'tapu-lele', height: 12 },
//     { name: 'tapu-bulu', height: 19 },
//     { name: 'tapu-fini', height: 13 },
//     { name: 'magearna', height: 10 },
//     { name: 'hatterene', height: 21 },
//     { name: 'impidimp', height: 4 },
//     { name: 'morgrem', height: 8 },
//     { name: 'grimmsnarl', height: 15 },
//     { name: 'milcery', height: 2 },
//     { name: 'alcremie', height: 3 },
//     { name: 'zacian', height: 28 },
//     { name: 'enamorus-incarnate', height: 16 },
//     { name: 'fidough', height: 3 },
//     { name: 'dachsbun', height: 5 },
//     { name: 'tinkatink', height: 4 },
//     { name: 'tinkatuff', height: 7 },
//     { name: 'tinkaton', height: 7 },
//     { name: 'scream-tail', height: 12 },
//     { name: 'flutter-mane', height: 14 },
//     { name: 'iron-valiant', height: 14 },
//     { name: 'fezandipiti', height: 14 },
//     { name: 'gardevoir-mega', height: 16 },
//     { name: 'mawile-mega', height: 10 },
//     { name: 'floette-eternal', height: 2 },
//     { name: 'altaria-mega', height: 15 },
//     { name: 'audino-mega', height: 15 },
//     { name: 'diancie-mega', height: 11 },
//     { name: 'ninetales-alola', height: 11 },
//     { name: 'mimikyu-busted', height: 2 },
//     { name: 'mimikyu-totem-disguised', height: 4 },
//     { name: 'mimikyu-totem-busted', height: 4 },
//     { name: 'magearna-original', height: 10 },
//     { name: 'ribombee-totem', height: 4 },
//     { name: 'rapidash-galar', height: 17 },
//     { name: 'weezing-galar', height: 30 },
//     { name: 'zacian-crowned', height: 28 },
//     { name: 'hatterene-gmax', height: 260 },
//     { name: 'grimmsnarl-gmax', height: 320 },
//     { name: 'alcremie-gmax', height: 300 },
//     { name: 'enamorus-therian', height: 16 }
//   ],
//   stellar: [],
//   unknown: [],
//   shadow: []
// };
    const pokemonTypes = await getPokemonTypes();




    

    const pokemonPromises = pokemonTypes.map(type => getPokemonsByType(type.url));
    const pokemons = await Promise.all(pokemonPromises);

    pokemonTypes.forEach((type, index) => {
        pokemonsByType[type.name] = pokemons[index];
    });


let averggeByType = {}

for (let type in pokemonsByType) {
    averggeByType[type] = (pokemonsByType[type].map(pokemon => pokemon.height).reduce((a, b) => a + b, 0) / pokemonsByType[type].length).toFixed(3);
}

return averggeByType;
    
}

async function main() {

const averageHeight = await getAverageHeight();
console.log("🚀 ~ main ~ averageHeight:", averageHeight)

}

main();