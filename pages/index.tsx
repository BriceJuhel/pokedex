import React, { useEffect, useState } from 'react';
import Layout from "../components/Layout";
import Link from 'next/link';

interface Pokemon {
  name: string;
  image: string;
  pokedexId: number;
}

interface HomeProps {
  pokemonList: Pokemon[];
}

const Home: React.FC<HomeProps> = ({ pokemonList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>(pokemonList);

  useEffect(() => {
    if (pokemonList) {
      const filteredList = pokemonList.filter(
        (pokemon) => pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredPokemonList(filteredList);
    }
  }, [searchTerm, pokemonList]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Layout title="Pokédex">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-2 sm:px-6 sm:py-2 lg:max-w-7xl lg:px-8 bg-zinc-100">
          <h2 className="sr-only">Pokédex</h2>

          <div className="relative rounded-md shadow-sm">
            <label htmlFor="search" className="sr-only">
              Rechercher un Pokémon
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

          {filteredPokemonList && filteredPokemonList.length === 0 ? (
            <p className="mt-4 text-red-500">Aucun Pokémon ne correspond à la recherche.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-8">
              {filteredPokemonList?.map((pokemon) => (
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
                      <span className="font-semibold text-teal-600">
                        #{pokemon.pokedexId}
                      </span> {pokemon.name}
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
    const data = await res.json();

       // Extract the necessary information (name, image, pokedexID) from the API response
    const pokemonList = data.map((pokemon) => ({
      name: pokemon.name,
      image: pokemon.image, // Replace 'image' with the correct property name from the API response
      pokedexId: pokemon.pokedexId, // Replace 'pokedexID' with the correct property name from the API response
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
        pokemonList: [], // Return an empty list in case of an error
      },
    };
  }
}

export default Home;



