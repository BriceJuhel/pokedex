import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import TypeFilterCheckbox from '../components/TypeFilterCheckbox';

interface Pokemon {
  name: string;
  image: string;
  pokedexId: number;
  types: string[];
  apiTypes: { name: string }[];
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
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>(pokemonList.slice(0, 20)); // Charger les 30 premiers Pokémon
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Suivre la page actuelle

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  


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
    // Observer pour le chargement de plus de Pokémon lors du défilement
    applyFilters();
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Lorsque l'utilisateur atteint le bas de la liste actuelle, chargez plus de Pokémon
        loadMore();
      }
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      // Nettoyez l'observateur lorsqu'il n'est plus nécessaire
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [selectedTypes, searchTerm, currentPage]);

  const loadMore = () => {
    // Calculez la prochaine page à charger
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    // Chargez les 30 prochains Pokémon (ou une autre quantité si vous le souhaitez)
    const startIndex = (nextPage - 1) * 30;
    const endIndex = startIndex + 30;
    const nextPokemonPage = pokemonList.slice(startIndex, endIndex);

    // Ajoutez les nouveaux Pokémon à la liste existante
    setFilteredPokemonList((prevList) => [...prevList, ...nextPokemonPage]);
  };
  

  const applyFilters = () => {
    let filteredList = pokemonList;

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filteredList = filteredList.filter((pokemon) =>
        selectedTypes.every((type) => pokemon.types.includes(type))
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

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <Layout title="Pokédex">
      <div className="bg-zinc-100">
        <div className="mx-auto max-w-2xl px-4 py-2 sm:px-6 sm:py-2 lg:max-w-7xl lg:px-8 bg-zinc-100">
          <h2 className="sr-only">Pokédex</h2>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mb-16">
            <Link legacyBehavior href="/jeu">
              <span>
                <i className="fas fa-trophy mr-2"></i>Qui est ce Pokémon ?
              </span>
            </Link>
          </button>

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

          <div className="relative mt-4" ref={filterMenuRef}>
            {/* Menu déroulant pour filtrer par type */}
            <button
              onClick={toggleFilterMenu}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
              Filtrer par Type
            </button>
            {isFilterMenuOpen && (
              <div className="bg-white rounded-md shadow-lg absolute z-10 mt-2 w-max">
                <div
                  className={`py-1 px-1 grid grid-cols-3 text-sm sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {pokemonTypes.map((type) => (
                    <TypeFilterCheckbox
                      key={type.name}
                      type={type}
                      checked={selectedTypes.includes(type.name)}
                      onChange={() => handleTypeChange(type.name)}
                    />
                  ))}
                </div>
                <button
                  onClick={resetFilters}
                  className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100"
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          <div className={isFilterMenuOpen ? 'mt-56' : 'mt-8'}>
            {filteredPokemonList.length === 0 ? (
              <p className="mt-4 text-red-500">Aucun Pokémon ne correspond à la recherche.</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8">
                {/* Affichage des Pokémon filtrés */}
                {filteredPokemonList.map((pokemon) => (
                  <Link legacyBehavior key={pokemon.pokedexId} href={`/pokemon/${pokemon.pokedexId}`}>
                    <a className="group">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-slate-200 xl:aspect-h-8 xl:aspect-w-7">
                        <img
                          src={pokemon.image}
                          alt={pokemon.name}
                          className="h-full w-full object-fill object-center group-hover:opacity-80 hover:-translate-y-1 transition-transform"
                        />
                      </div>
                      <h3 className="mt-4 text-xl text-gray-700 font-bold">
                        <span className="font-semibold text-teal-600">#{pokemon.pokedexId}</span> {pokemon.name}
                      </h3>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-4" ref={loadMoreRef}>
            {/* Load More */}
          </div>
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
