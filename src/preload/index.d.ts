import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    //electron: ElectronAPI
    api: {
      catchPokemon: (name: string, url: string) => Promise<void>
      getPokemon: () => Promise<Pokemon[]>
      deletePokemon: (id: number) => Promise<void>
    }
  }
}
