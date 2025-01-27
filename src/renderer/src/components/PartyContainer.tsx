import { useEffect, useState } from 'react'
import { PokemonCard } from '@/components/PokemonCard'

export const PartyContainer = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  // Fetch Pokémon list from SQLite
  const fetchPokemons = async () => {
    try {
      const fetchedPokemons = await window.api.getPokemon()
      setPokemons(fetchedPokemons)
    } catch (error) {
      console.error('Failed to fetch Pokémon:', error)
    }
  }

  // Fetch Pokémon on component mount
  useEffect(() => {
    fetchPokemons()
  }, [])

  console.log(pokemons)
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold">Pokemon Party</h2>
      {pokemons.length === 0 ? (
        <div>There is not Pokemons in the party yet.</div>
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
