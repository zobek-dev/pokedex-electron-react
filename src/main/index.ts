import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Database from 'better-sqlite3'

// Initialize SQLite database
const db = new Database('database.db', { verbose: console.log })

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS pokemon (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
).run()

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'Pokedex',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC to "catch" a Pokémon
ipcMain.handle('catch-pokemon', (_, { name, url }) => {
  // Begin a transaction
  const transaction = db.transaction(() => {
    // Check the current number of Pokémon in the database
    const count = db.prepare('SELECT COUNT(*) AS count FROM pokemon').get().count

    // If there are already 6 Pokémon, delete the oldest one
    if (count >= 6) {
      db.prepare(
        'DELETE FROM pokemon WHERE id = (SELECT id FROM pokemon ORDER BY timestamp ASC LIMIT 1)'
      ).run()
    }

    // Add the new Pokémon to the database
    const stmt = db.prepare('INSERT INTO pokemon (name, url) VALUES (?, ?)')
    const result = stmt.run(name, url)

    return { id: result.lastInsertRowid, name, url, timestamp: new Date().toISOString() }
  })

  return transaction()
})

// IPC to retrieve all Pokémon
ipcMain.handle('get-pokemon', () => {
  const stmt = db.prepare('SELECT * FROM pokemon ORDER BY timestamp DESC')
  return stmt.all()
})

// Quit the app when all windows are closed, except on macOS
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
