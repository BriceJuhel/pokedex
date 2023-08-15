import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Jeu() {
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [responses, setResponses] = useState([]); // Tableau pour stocker les réponses
  const totalSteps = 10; // Total number of game steps

  const API_URL = 'https://pokebuildapi.fr/api/v1/pokemon';

  // Function to start a new game step
  const startNewStep = () => {
    const randomPokemonId = Math.floor(Math.random() * 898) + 1; // Replace 898 with the total number of Pokémon
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
    const cleanGuess = guess.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents
    const cleanName = selectedPokemon.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accents

    const levenshteinDistance = (a, b) => {
      const dp = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));

      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
      }

      return dp[a.length][b.length];
    };

    const isCorrect = cleanGuess === cleanName || levenshteinDistance(cleanGuess, cleanName) <= 2;

    if (isCorrect) {
      setScore(score + 1);
    }

    const response = {
      name: selectedPokemon.name,
      image: selectedPokemon.image,
      guess: guess, // Store the player's guess in the response
      isCorrect: isCorrect,
    };
    setResponses([...responses, response]);
    setStep(step + 1);

    if (step < totalSteps) {
      startNewStep();
    }
  };

  useEffect(() => {
    startNewStep(); // Start the game on page load
  }, []);

  return (
    <Layout title="Quel est ce Pokémon ?">
      <div className="container mx-auto max-w-6xl py-8">
        <h1 className="text-2xl font-semibold mb-4">Quel est ce Pokémon ?</h1>
        {selectedPokemon && step <= totalSteps && (
          <div>
            <img
              src={selectedPokemon.image}
              alt={selectedPokemon.name}
              className="w-64 h-64 mb-2"
            />
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  checkGuess();
                }
              }}
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
          <div className="mt-4">
            <p>Jeu terminé ! Votre score : {score}/{totalSteps}</p>
            <h2 className="mt-4">Résumé des réponses :</h2>
            <ul>
              {responses.map((response, index) => (
                <li key={index} className={response.isCorrect ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                  <img
                    src={response.image}
                    alt={response.name}
                    className="w-40 h-40 mr-2 inline-block"
                  />
                  <span>{response.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
