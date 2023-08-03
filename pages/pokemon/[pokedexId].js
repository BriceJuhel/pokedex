import Layout from '../../components/Layout';
import Link from 'next/link';

export default function PokemonPage({ pokemon }) {
    return (
        <Layout title={`Détails de ${pokemon.name}`}>
      <div className="bg-white mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-2 lg:px-8">
        <div className="flex justify-end items-center mb-4">
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            <span className="font-semibold text-teal-600">#{pokemon.pokedexId}</span> {pokemon.name}
          </h2>
  
          <div className="flex mt-4 space-x-4">
            {pokemon.apiTypes.map((type) => (
              <div key={type.name} className="flex items-center">
                <img src={type.image} alt={type.name} className="w-5 h-5 mr-2 inline-block" />
                <span>{type.name}</span>
              </div>
            ))}
          </div>
  
          <hr className="my-6" />
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex justify-center">
              <img src={pokemon.image} alt={pokemon.name} className="w-full max-w-md object-contain" />
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Statistiques de base :</h3>
              <ul className="list-disc list-inside list-none">
                <li>
                  <span className="font-bold">PV : {pokemon.stats.HP}</span>
                  <div className="w-full h-4 rounded-md mt-1 bg-gray-200">
                    <div
                      className="h-full bg-teal-400 rounded-md"
                      style={{ width: `${(pokemon.stats.HP / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
                <li>
                  <span className="font-bold">Attaque : {pokemon.stats.attack}</span>
                  <div className="w-full h-4 rounded-md mt-1 bg-gray-200">
                    <div
                      className="h-full bg-teal-400 rounded-md"
                      style={{ width: `${(pokemon.stats.attack / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
                <li>
                  <span className="font-bold">Défense : {pokemon.stats.defense}</span>
                  <div className="w-full h-4 rounded-md mt-1 bg-gray-200">
                    <div
                      className="h-full bg-teal-400 rounded-md"
                      style={{ width: `${(pokemon.stats.defense / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
                <li>
                  <span className="font-bold">Attaque Spéciale : {pokemon.stats.special_attack}</span>
                  <div className="w-full h-4 rounded-md mt-1 bg-gray-200">
                    <div
                      className="h-full bg-teal-400 rounded-md"
                      style={{ width: `${(pokemon.stats.special_attack / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
                <li>
                  <span className="font-bold">Défense Spéciale : {pokemon.stats.special_defense}</span>
                  <div className="w-full h-4 rounded-md mt-1 bg-gray-200">
                    <div
                      className="h-full bg-teal-400 rounded-md"
                      style={{ width: `${(pokemon.stats.special_defense / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
                <li>
                  <span className="font-bold">Vitesse : {pokemon.stats.speed}</span>
                  <div className="w-full h-4 rounded-md mt-1 bg-gray-200">
                    <div
                      className="h-full bg-teal-400 rounded-md"
                      style={{ width: `${(pokemon.stats.speed / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
                {/* Ajoutez les autres statistiques ici */}
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  export async function getStaticPaths() {
    const res = await fetch('https://pokebuildapi.fr/api/v1/pokemon/');
    const data = await res.json();
    const pokedexIds = data.map((pokemon) => pokemon.pokedexId);
  
    const paths = pokedexIds.map((pokedexId) => ({ params: { pokedexId: pokedexId.toString() } }));
  
    return {
      paths: paths,
      fallback: false,
    };
  }

export async function getStaticProps({ params }) {
  // Récupérez les données du Pokémon en utilisant le pokedexId depuis les paramètres
  const pokemon = await fetchPokemonData(params.pokedexId);

  // Remplacez fetchPokemonData par la fonction pour récupérer les données du Pokémon depuis l'API

  return {
    props: {
      pokemon,
    },
  };
}

async function fetchPokemonData(pokedexId) {
    // Utilisez l'API pour récupérer les données du Pokémon en utilisant le pokedexId
    const res = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`);
    const data = await res.json();
  
    // Formatez les données du Pokémon comme vous en avez besoin, assurez-vous que apiTypes et apiResistances sont correctement récupérés
    const formattedPokemonData = {
      name: data.name,
      pokedexId: data.pokedexId,
      image: data.image,
      sprite: data.sprite,
      apiTypes: data.apiTypes || [], // Assurez-vous que les données des types sont correctement récupérées depuis l'API
      stats: data.stats,
      apiResistances: data.apiResistances || [], // Assurez-vous que les données de résistance sont correctement récupérées depuis l'API
      // Ajoutez d'autres propriétés ici si nécessaire
    };
  
    return formattedPokemonData;
  }