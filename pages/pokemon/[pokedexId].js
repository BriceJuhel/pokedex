import Layout from '../../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PokemonPage({ pokemon }) {
  const router = useRouter();
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      goToPreviousPokemon();
    } else if (deltaX < -50) {
      goToNextPokemon();
    }
  };

  const goToNextPokemon = () => {
    const nextPokedexId = pokemon.pokedexId + 1;
    router.push(`/pokemon/${nextPokedexId}`);
  };

  const goToPreviousPokemon = () => {
    if (pokemon.pokedexId > 1) {
      const previousPokedexId = pokemon.pokedexId - 1;
      router.push(`/pokemon/${previousPokedexId}`);
    }
  };

  return (
    <Layout title={`Détails de ${pokemon.name}`}>
      <div
        className="bg-white mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-2 lg:px-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      ></div>
      <div className="bg-white mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-2 lg:px-8">
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
            </ul>
          </div>
        </div>

        {pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900">Évolution(s) :</h3>
            <div className="flex items-center space-x-4">
              {pokemon.apiEvolutions.map((evolution) => (
                <div key={evolution.name} className="flex items-center">
                  <Link legacyBehavior href={`/pokemon/${evolution.pokedexId}`}>
                    <a>
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.pokedexId}.png`}
                        alt={evolution.name}
                        className="w-30 h-30 mr-2"
                      />
                    </a>
                  </Link>
                  <span>{evolution.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          {pokemon.pokedexId > 1 && (
            <button
              onClick={goToPreviousPokemon}
              className="inline-block text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &#9664; Précédent
            </button>
          )}
          <button
            onClick={goToNextPokemon}
            className="inline-block text-gray-500 hover:text-gray-700 focus:outline-none ml-4"
          >
            Suivant &#9654;
          </button>
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
  const pokemon = await fetchPokemonData(params.pokedexId);
  return {
    props: {
      pokemon,
    },
  };
}

async function fetchPokemonData(pokedexId) {
  const res = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`);
  const data = await res.json();

  const formattedPokemonData = {
    name: data.name,
    pokedexId: data.pokedexId,
    image: data.image,
    sprite: data.sprite,
    apiTypes: data.apiTypes || [],
    stats: data.stats,
    apiEvolutions: data.apiEvolutions || [],
    apiResistances: data.apiResistances || [],
  };

  return formattedPokemonData;
}
