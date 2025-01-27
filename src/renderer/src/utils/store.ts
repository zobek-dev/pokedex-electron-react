import { configureStore } from '@reduxjs/toolkit'
import tabReducer from './tabSlice'
import pokemonSlice from './pokemonSlice'
import { ThunkAction, Action } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    tabs: tabReducer,
    pokemons: pokemonSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
