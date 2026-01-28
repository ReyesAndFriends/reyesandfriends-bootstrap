import { ipcMain, dialog, shell } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

declare global {
  interface Window {
    settingsAPI?: {
      getWorkdir: () => Promise<string>;
      setWorkdir: (path: string) => Promise<void>;
      selectWorkdir: () => Promise<string | null>;
      getDefaultWorkdir: () => Promise<string>;
    };
  }
}

function getConfigDir() {
  const home = os.homedir();
  const platform = os.platform();
  if (platform === "win32") {
    return path.join(home, "AppData", "Roaming", "reyesandfriends-bootstrap");
  } else if (platform === "darwin") {
    return path.join(home, "Library", "Application Support", "reyesandfriends-bootstrap");
  } else {
    return path.join(home, ".config", "reyesandfriends-bootstrap");
  }
}

function getDefaultWorkdir() {
  const home = os.homedir();
  return path.join(home, "ReyesAndFriendsBootstrap");
}

const configDir = getConfigDir();
const configPath = path.join(configDir, "settings.json");
const apacheServersPath = path.join(configDir, "apache_servers.json");

function ensureConfig() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  if (!fs.existsSync(configPath)) {
    const defaultConfig = { workdir: getDefaultWorkdir() };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  }
}

function readConfig() {
  ensureConfig();
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function writeConfig(config: any) {
  ensureConfig();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function ensureApacheServers() {
  if (!fs.existsSync(apacheServersPath)) {
    fs.writeFileSync(apacheServersPath, JSON.stringify([], null, 2));
  }
}

function readApacheServers() {
  ensureApacheServers();
  return JSON.parse(fs.readFileSync(apacheServersPath, "utf-8"));
}

function writeApacheServers(data: any) {
  ensureApacheServers();
  fs.writeFileSync(apacheServersPath, JSON.stringify(data, null, 2));
}

// IPC handlers
ipcMain.handle("settings:getWorkdir", async () => {
  const config = readConfig();
  return config.workdir;
});

ipcMain.handle("settings:setWorkdir", async (_event, newPath: string) => {
  const config = readConfig();
  config.workdir = newPath;
  writeConfig(config);
});

ipcMain.handle("settings:getDefaultWorkdir", async () => {
  return getDefaultWorkdir();
});

ipcMain.handle("settings:selectWorkdir", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

// IPC handlers para Apache Servers
ipcMain.handle("apacheServers:getAll", async () => {
  return readApacheServers();
});

ipcMain.handle("apacheServers:saveAll", async (_event, data) => {
  writeApacheServers(data);
});

ipcMain.handle("apacheServers:add", async (_event, server) => {
  const servers = readApacheServers();
  servers.push(server);
  writeApacheServers(servers);
  return servers;
});

ipcMain.handle("apacheServers:removeAt", async (_event, index: number) => {
  const servers = readApacheServers();
  if (index >= 0 && index < servers.length) {
    servers.splice(index, 1);
    writeApacheServers(servers);
  }
  return servers;
});

// Al final de los handlers IPC, agregar:
ipcMain.handle("settings:openConfigDir", async () => {
  // Lee el workdir desde settings.json y abre ese directorio
  const config = readConfig();
  if (config.workdir && typeof config.workdir === "string") {
    return shell.openPath(config.workdir);
  }
  // Si no existe, abre el directorio por defecto
  return shell.openPath(getDefaultWorkdir());
});