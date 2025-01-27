import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PokemonCard, TypeFilter, Spinner } from '@/components'
import { fetchPokemons, setPage } from '@/utils/pokemonSlice'
import { RootState, AppDispatch } from '@/utils/store'

export const WildPokemonContainer = () => {
  const dispatch: AppDispatch = useDispatch()

  // Extract necessary state from Redux store
  const { pokemons, total, currentPage, pageSize, loading, error, selectedType } = useSelector(
    (state: RootState) => state.pokemons
  )

  // Fetch Pokémon data when component mounts or dependencies change
  useEffect(() => {
    dispatch(fetchPokemons({ page: currentPage, limit: pageSize }))
  }, [dispatch, currentPage, pageSize])

  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setPage(page))
    }
  }

  return (
    <div className="py-6">
      {/* TypeFilter for filtering Pokémon by type */}
      <TypeFilter />

      {/* Display loading, error, or Pokémon list */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500">Error: {error}</p>
      ) : pokemons.length === 0 ? (
        <p className="text-center text-lg font-medium text-gray-500 dark:text-gray-400">
          {selectedType
            ? `No Pokémon found for the selected type "${selectedType}".`
            : 'No Pokémon available at the moment.'}
        </p>
      ) : (
        <>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {pokemons.map((pokemon, index) => (
              <PokemonCard key={index} name={pokemon.name} url={pokemon.url} />
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-lg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
