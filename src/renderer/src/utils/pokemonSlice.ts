import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface Pokemon {
  name: string
  url: string
  id?: number // Added for type filtering
}

interface PokemonState {
  pokemons: Pokemon[]
  total: number
  loading: boolean
  error: string | null
  currentPage: number
  pageSize: number
  types: { name: string; url: string }[] // List of Pokémon types
  selectedType: string | null // Single selected type
}

const initialState: PokemonState = {
  pokemons: [],
  total: 150,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 24,
  types: [],
  selectedType: null // No type selected by default
}

// Async thunk to fetch Pokémon data
export const fetchPokemons = createAsyncThunk(
  'pokemons/fetchPokemons',
  async ({ page, limit }: { page: number; limit: number }) => {
    const offset = (page - 1) * limit

    // Ensure offset and limit are within the 150 Pokémon range
    const cappedOffset = Math.min(offset, 150)
    const cappedLimit = Math.min(limit, 150 - cappedOffset)

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?offset=${cappedOffset}&limit=${cappedLimit}`
    )
    const data = await response.json()
    return { results: data.results, count: 150 } // Fixed count to 150
  }
)

// Fetch Pokémon types
export const fetchTypes = createAsyncThunk('pokemons/fetchTypes', async () => {
  const response = await fetch('https://pokeapi.co/api/v2/type/')
  const data = await response.json()

  // Filter out irrelevant types
  const filteredTypes = data.results.filter(
    (type: { name: string }) => type.name !== 'shadow' && type.name !== 'unknown'
  )

  return filteredTypes
})

// Fetch Pokémon by type
export const fetchPokemonsByType = createAsyncThunk(
  'pokemons/fetchPokemonsByType',
  async ({ type, page, limit }: { type: string; page: number; limit: number }) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
    const data = await response.json()

    // Filter Pokémon with IDs between 1 and 150
    const filteredPokemons = data.pokemon
      .map((entry: { pokemon: { name: string; url: string } }) => {
        const id = parseInt(entry.pokemon.url.split('/').slice(-2, -1)[0], 10)
        return { name: entry.pokemon.name, url: entry.pokemon.url, id }
      })
      .filter((pokemon: { id: number }) => pokemon.id >= 1 && pokemon.id <= 150)

    // Paginate results
    const offset = (page - 1) * limit
    const paginatedPokemons = filteredPokemons.slice(offset, offset + limit)

    return { results: paginatedPokemons, count: filteredPokemons.length }
  }
)

const pokemonSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload
    },
    setType(state, action) {
      const type = action.payload
      state.selectedType = state.selectedType === type ? null : type // Toggle selection
      state.currentPage = 1 // Reset to the first page on type change
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload
      })
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false
        state.pokemons = action.payload.results
        state.total = action.payload.count
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
      .addCase(fetchPokemonsByType.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPokemonsByType.fulfilled, (state, action) => {
        state.loading = false
        state.pokemons = action.payload.results // Replace with filtered Pokémon
        state.total = action.payload.count // Update total to match filtered results
      })
      .addCase(fetchPokemonsByType.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Something went wrong'
      })
  }
})

export const { setPage, setType } = pokemonSlice.actions
export default pokemonSlice.reducer
