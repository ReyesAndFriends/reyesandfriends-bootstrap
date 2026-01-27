import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'

const CONFIG_DIR = app.getPath('userData')
const CONFIG_PATH = path.join(CONFIG_DIR, "settings.json")

function ensureConfig() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({}))
  }
}

function readConfig(): Record<string, string> {
  ensureConfig()
  try {
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function writeConfig(config: Record<string, string>) {
  ensureConfig()
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2))
}

function setConfig(key: string, value: string) {
  const config = readConfig()
  config[key] = value
  writeConfig(config)
  if (key === "workdir" && value) {
    if (!fs.existsSync(value)) {
      fs.mkdirSync(value, { recursive: true })
    }
  }
}

function getConfig(key: string, defaultValue: string, cb: (val: string | null) => void) {
  const config = readConfig()
  if (typeof config[key] === "string") {
    cb(config[key])
  } else {
    cb(defaultValue)
  }
}

function getDefaultWorkdir() {
  const platform = process.platform
  if (platform === "win32") {
    return path.join(app.getPath('home'), 'ReyesAndFriendsBootstrap')
  } else if (platform === "darwin") {
    return path.join(app.getPath('home'), 'ReyesAndFriendsBootstrap')
  } else {
    return path.join(app.getPath('home'), 'ReyesAndFriendsBootstrap')
  }
}

function getWorkdir(): Promise<string> {
  return new Promise((resolve) => {
    getConfig("workdir", getDefaultWorkdir(), (pathValue) => {
      if (pathValue == null) {
        throw new Error("getDefaultWorkdir() returned null or undefined");
      }
      getConfig("workdir", "", (val) => {
        if (val === null || val === "") setConfig("workdir", pathValue)
        if (!fs.existsSync(pathValue)) {
          fs.mkdirSync(pathValue, { recursive: true })
        }
        resolve(pathValue)
      })
    })
  })
}

function setWorkdir(newPath: string): Promise<void> {
  return new Promise((resolve) => {
    setConfig("workdir", newPath)
    resolve()
  })
}

export {
  setConfig,
  getConfig,
  getDefaultWorkdir,
  getWorkdir,
  setWorkdir,
}
