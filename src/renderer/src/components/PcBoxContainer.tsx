import { useEffect, useState } from 'react'
import { PokemonCard } from '@/components/PokemonCard'

// Fetch Pokémon list from API

export const PcBoxContainer = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/')
        const data = await response.json()
        setPokemons(data)
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch Pokémon:', error)
      }
    }
    fetchPokemons()
  }, [])

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold">Pc Box</h2>
      {pokemons.length === 0 ? (
        <div>There is not Pokemons in the Pc Box yet.</div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 py-8">
          {pokemons.map((pokemon, index) => (
            <PokemonCard key={index} name={pokemon.name} url={pokemon.url} button={false} />
          ))}
        </ul>
      )}
    </div>
  )
}
