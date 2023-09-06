import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Jeu() {
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [guess, setGuess] = useState('');
  const [responses, setResponses] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [usedPokemonIds, setUsedPokemonIds] = useState([]);
  const totalSteps = 20;

  const API_URL = 'https://pokebuildapi.fr/api/v1/pokemon';

  const startNewStep = () => {
    const getRandomPokemonId = () => Math.floor(Math.random() * 496) + 1;

    let randomPokemonId = getRandomPokemonId();
    while (usedPokemonIds.includes(randomPokemonId)) {
      randomPokemonId = getRandomPokemonId();
    }

    fetch(`${API_URL}/${randomPokemonId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedPokemon(data);
        setGuess('');
        setUsedPokemonIds([...usedPokemonIds, randomPokemonId]);
      })
      .catch((error) => console.error(error));
  };

  const checkGuess = () => {
    if (!selectedPokemon) {
      return;
    }

    const cleanGuess = guess.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanName = selectedPokemon.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
      guess: guess,
      isCorrect: isCorrect,
    };
    setResponses([...responses, response]);
    setStep(step + 1);

    if (step < totalSteps) {
      startNewStep();
    }
  };

  const startGame = () => {
    setIsGameStarted(true);
    setUsedPokemonIds([]);
    startNewStep();
  };

  useEffect(() => {
    setIsGameStarted(false);
  }, []);

  const resetGame = () => {
    setScore(0);
    setStep(1);
    setResponses([]);
    setSelectedPokemon(null);
    startGame();
  };

  return (
    <Layout title="Quel est ce Pokémon ?">
      <div className="flex flex-col m-h-screen items-center">
        {isGameStarted ? (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Quel est ce Pokémon ?</h1>
            {selectedPokemon && step <= totalSteps && (
              <div>
                <img
                  src={selectedPokemon.image}
                  alt={selectedPokemon.name}
                  className="w-64 h-64 mb-2"
                />
                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        checkGuess();
                      }
                    }}
                    placeholder="Nom du Pokémon"
                    className="border border-gray-300 rounded p-2 mb-2 w-max"
                  />
                  <button onClick={checkGuess} className="bg-blue-500 text-white px-4 py-2 w-fit rounded">
                    Suivant
                  </button>
                </div>
              </div>
            )}
            {step > totalSteps && (
  <div className="mt-4">
    <p className='font-bold text-3xl mb-4'>Votre score : {score}/{totalSteps}</p>
    <button onClick={resetGame} className="bg-blue-500 text-white px-4 py-2 rounded mt-4 mb-8">
      Rejouer
    </button>
    <ul>
      {responses.map((response, index) => (
        <li key={index} className={response.isCorrect ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
          <img
            src={response.image}
            alt={response.name}
            className="w-40 h-40 mr-2 inline-block"
          />
          <span>{response.name} ({response.guess})</span> {/* Ajoutez ici la réponse du joueur */}
        </li>
      ))}
    </ul>                
  </div>
)}
          </div>
        ) : (
          <div>
              <img src="/images/pkm.jpg" alt="Image Pokémon" className="object-cover h-48 w-96 mb-4 rounded" />
              <h1 className="text-2xl font-semibold mb-4">Quel est ce Pokémon ?</h1>
              <p>Le but du jeu est de deviner le nom du Pokémon à partir de son image. Vous avez 20 pokémons à deviner.</p>
              <button onClick={startGame} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Commencer
              </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
