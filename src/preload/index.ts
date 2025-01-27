import { contextBridge, ipcRenderer } from 'electron'

// Ensure context isolation is enabled
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('api', {
    // Expose the "getPokemonCount" method to retrieve the count of Pokémon
    getPokemonCount: () => ipcRenderer.invoke('get-pokemon-count'),

    // Expose the "savePokemon" method to save a new Pokémon
    savePokemon: (name: string, url: string) => ipcRenderer.invoke('save-pokemon', { name, url }),

    // Expose the "getPokemon" method to retrieve all Pokémon
    getPokemon: () => ipcRenderer.invoke('get-pokemon')
  })
} catch (error) {
  console.error(error)
}
