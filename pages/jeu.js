import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Jeu() {
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const totalSteps = 10; // Total number of game steps

  const API_URL = 'https://pokebuildapi.fr/api/v1/pokemon';

  // Function to start a new game step
  const startNewStep = () => {
    const randomPokemonId = Math.floor(Math.random() * 898) + 1; // Replace 807 with the total number of Pokémon
    fetch(`${API_URL}/${randomPokemonId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedPokemon(data);
        setGuess('');
      })
      .catch((error) => console.error(error));
  };

  // Function to check the player's guess
  const checkGuess = () => {
    if (selectedPokemon.name.toLowerCase() === guess.toLowerCase()) {
      setScore(score + 1);
    }
    setStep(step + 1);
    startNewStep();
  };

  useEffect(() => {
    startNewStep(); // Start the game on page load
  }, []);

  return (
    <Layout title="Jeu de Devinettes Pokémon">
      <div className="container mx-auto max-w-6xl py-8">
        <h1 className="text-2xl font-semibold mb-4">Jeu de Devinettes Pokémon</h1>
        {selectedPokemon && (
          <div>
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="w-32 h-32 mb-2"
            />
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Devinez le nom du Pokémon"
              className="border border-gray-300 rounded p-2 w-full mb-2"
            />
            <button onClick={checkGuess} className="bg-blue-500 text-white px-4 py-2 rounded">
              Soumettre
            </button>
          </div>
        )}
        {step <= totalSteps && <p className="mt-4">Étape {step} sur {totalSteps}</p>}
        {step > totalSteps && (
          <p className="mt-4">
            Jeu terminé ! Votre score : {score}/{totalSteps}
          </p>
        )}
      </div>
    </Layout>
  );
}
