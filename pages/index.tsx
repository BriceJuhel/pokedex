// pages/index.tsx
import React, { useEffect, useState } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link';
import TypeFilterCheckbox from '../components/TypeFilterCheckbox';

interface Pokemon {
  name: string;
  image: string;
  pokedexId: number;
  types: string[];
}

interface HomeProps {
  pokemonList: Pokemon[];
}

interface PokemonType {
  name: string;
  image: string;
}

const Home: React.FC<HomeProps> = ({ pokemonList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>(pokemonList);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);

  useEffect(() => {
    // Fetch the types from the API
    const fetchTypes = async () => {
      try {
        const res = await fetch('https://pokebuildapi.fr/api/v1/types');
        const data = await res.json();

        // Extract the necessary information (name, image) for each type
        const types: PokemonType[] = data.map((type: any) => ({
          name: type.name,
          image: type.image,
        }));
        setPokemonTypes(types);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    // Apply filters whenever the selected types or search term change
    applyFilters();
  }, [selectedTypes, searchTerm]);

  const applyFilters = () => {
    let filteredList = pokemonList;

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filteredList = filteredList.filter((pokemon) =>
        pokemon.types && selectedTypes.some((type) => pokemon.types.includes(type))
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filteredList = filteredList.filter((pokemon) =>
        pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }

    setFilteredPokemonList(filteredList);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(type)) {
        return prevSelectedTypes.filter((selectedType) => selectedType !== type);
      } else {
        return [...prevSelectedTypes, type];
      }
    });
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSearchTerm('');
  };

  return (
    <Layout title="Pokédex">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-2 sm:px-6 sm:py-2 lg:max-w-7xl lg:px-8 bg-zinc-100">
          <h2 className="sr-only">Pokédex</h2>

          <div className="relative rounded-md shadow-sm">
            {/* La barre de recherche */}
            <label htmlFor="search" className="sr-only">
              Rechercher un Pokémon
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-10 h-10 text-teal-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-16 pr-12 py-6 text-xl border-gray-300 rounded-md"
                placeholder="Rechercher un Pokémon"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="relative rounded-md shadow-sm mt-4">
            {/* Menu déroulant pour filtrer par type */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-10 h-10 text-teal-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="pl-16 grid grid-cols-4 gap-4">
              {/* Affichage des checkboxes de type */}
              {pokemonTypes.map((type) => (
                <TypeFilterCheckbox
                  key={type.name}
                  type={type}
                  checked={selectedTypes.includes(type.name)}
                  onChange={() => handleTypeChange(type.name)}
                />
              ))}
              <button
                onClick={resetFilters}
                className="text-sm text-indigo-600 hover:underline focus:outline-none col-span-4"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {filteredPokemonList.length === 0 ? (
            <p className="mt-4 text-red-500">Aucun Pokémon ne correspond à la recherche.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-8">
              {/* Affichage des Pokémon filtrés */}
              {filteredPokemonList.map((pokemon) => (
                <Link legacyBehavior key={pokemon.pokedexId} href={`/pokemon/${pokemon.pokedexId}`}>
                  <a className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-slate-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-80 hover:-translate-y-1 transition-transform"
                      />
                    </div>
                    <h3 className="mt-4 text-xl text-gray-700 font-bold">
                      <span className="font-semibold text-teal-600">#{pokemon.pokedexId}</span>{' '}
                      {pokemon.name}
                    </h3>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticProps() {
  try {
    const res = await fetch('https://pokebuildapi.fr/api/v1/pokemon/limit/151');
    const data: Pokemon[] = await res.json();

    const pokemonList = data.map((pokemon) => ({
      name: pokemon.name,
      image: pokemon.image,
      pokedexId: pokemon.pokedexId,
      types: pokemon.apiTypes.map((type: any) => type.name),

    }));

    return {
      props: {
        pokemonList,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        pokemonList: [],
      },
    };
  }
}

export default Home;

