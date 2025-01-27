import { contextBridge, ipcRenderer } from 'electron'

// Ensure context isolation is enabled
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('api', {
    // Expose the "catchPokemon" method to save Pokémon
    catchPokemon: (name, url) => ipcRenderer.invoke('catch-pokemon', { name, url }),

    // Expose the "getPokemon" method to retrieve all Pokémon
    getPokemon: () => ipcRenderer.invoke('get-pokemon'),

    // Optional: If you want to add a delete function, expose it here
    deletePokemon: (id) => ipcRenderer.invoke('delete-pokemon', id)
  })
} catch (error) {
  console.error(error)
}
