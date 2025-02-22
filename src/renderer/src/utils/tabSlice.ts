import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTab: 'Wild Pokemon' // Default active tab
}

const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    }
  }
})

export const { setActiveTab } = tabSlice.actions

export default tabSlice.reducer
