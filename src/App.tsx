import { useState } from 'react'

function App() {
  const [pokemonId, setPokemonId] = useState<number | null>(null)

  const getRandomPokemon = () => {
    // ポケモンの図鑑番号は現在1025まで
    const randomId = Math.floor(Math.random() * 1025) + 1
    setPokemonId(randomId)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">
        Random Pokemon!
      </h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        {pokemonId ? (
          <p className="text-2xl font-bold text-blue-600 mb-4">ID: {pokemonId}</p>
        ) : (
          <p className="text-slate-500 mb-4">ボタンを押してね</p>
        )}

        <button
          onClick={getRandomPokemon}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          ポケモンを呼ぶ
        </button>
      </div>
    </div>
  )
}

export default App