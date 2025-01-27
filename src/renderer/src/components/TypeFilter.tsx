import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/utils/store' // Adjust the path to your store file
import {
  fetchTypes,
  fetchPokemons,
  fetchPokemonsByType,
  setType,
  setPage
} from '@/utils/pokemonSlice'

export const TypeFilter = () => {
  const types = useSelector((state: RootState) => state.pokemons.types)
  const selectedType = useSelector((state: RootState) => state.pokemons.selectedType)
  const currentPage = useSelector((state: RootState) => state.pokemons.currentPage)
  const pageSize = useSelector((state: RootState) => state.pokemons.pageSize)
  const dispatch = useDispatch<AppDispatch>()

  // Fetch Pokémon types once on mount
  useEffect(() => {
    if (!types.length) {
      dispatch(fetchTypes())
    }
  }, [dispatch, types.length])

  // Fetch Pokémon list based on type or pagination
  useEffect(() => {
    if (selectedType === null) {
      dispatch(fetchPokemons({ page: currentPage, limit: pageSize }))
    } else {
      const selectedTypeObject = types.find((type) => type.name === selectedType)
      if (selectedTypeObject) {
        const typeId = selectedTypeObject.url.split('/').slice(-2, -1)[0]
        dispatch(fetchPokemonsByType({ type: typeId, page: currentPage, limit: pageSize }))
      }
    }
  }, [dispatch, selectedType, currentPage, pageSize, types])

  // Handle type selection
  const handleTypeClick = (typeName: string | null) => {
    dispatch(setType(typeName))
    dispatch(setPage(1)) // Reset to the first page on type change
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Add the "All" button */}
      <button
        key="all"
        onClick={() => handleTypeClick(null)}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          selectedType === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        All
      </button>

      {types.map((type) => (
        <button
          key={type.name}
          onClick={() => handleTypeClick(type.name)}
          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
            selectedType === type.name ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {type.name}
        </button>
      ))}
    </div>
  )
}
