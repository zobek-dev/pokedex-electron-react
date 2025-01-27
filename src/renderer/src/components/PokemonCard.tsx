import { useEffect, useState } from 'react'

// Fetch Pokémon details
const fetchSinglePokemon = async (url: string): Promise<Pokemon | undefined> => {
  try {
    const response = await fetch(url)
    const data: Pokemon = await response.json()
    return data
  } catch (err) {
    console.error(err)
  }
}

export const PokemonCard = ({ name, url, button = true }: PokemonInfo) => {
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined)

  if (!window.api) {
    console.error('window.api is not available. Check your preload script.')
  }

  // Fetch Pokémon details on component mount
  useEffect(() => {
    fetchSinglePokemon(url).then((data) => setPokemon(data))
  }, [url])

  // Handle "Catch It" button click
  const handleCatchPokemon = async () => {
    if (!pokemon) return

    try {
      // Query current count from SQLite
      const currentCount = await (window as any).api.getPokemonCount()

      if (currentCount < 6) {
        // Save locally in SQLite
        const result = await (window as any).api.savePokemon(name, url)
        console.log('Pokemon saved locally:', result)
        alert(`Caught ${pokemon.name}!`)
      } else {
        // Save to backend if SQLite has 6 Pokémon
        const backendResponse = await fetch('http://localhost:3500/api/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            url: url
          })
        })

        if (!backendResponse.ok) {
          throw new Error(`Error saving Pokémon to backend: ${backendResponse.statusText}`)
        }

        const backendResult = await backendResponse.json()
        console.log('Pokemon saved to backend:', backendResult)
        alert(`Caught ${pokemon.name} and sent it to the Professor!`)
      }
    } catch (error) {
      console.error('Failed to catch Pokémon:', error)
      alert('Failed to catch Pokémon. Please try again.')
    }
  }

  return (
    <li className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center py-10 px-4">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={pokemon?.sprites.front_default || 'placeholder.png'}
          alt={pokemon?.name || 'Pokémon'}
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white capitalize">
          {name}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {pokemon?.types[0]?.type?.name || 'Unknown Type'}
        </span>
        {button && (
          <div className="flex mt-4 md:mt-6">
            <button
              onClick={handleCatchPokemon}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Catch It
            </button>
          </div>
        )}
      </div>
    </li>
  )
}
