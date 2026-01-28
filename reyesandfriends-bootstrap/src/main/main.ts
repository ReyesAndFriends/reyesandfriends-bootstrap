import { ipcMain, dialog, shell } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as fsp from "fs/promises";

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
    const server = servers[index];
    let firstDomain = "";
    if (server && typeof server.domains === "string") {
      firstDomain = server.domains.split(",")[0].trim();
    } else if (Array.isArray(server.domains) && server.domains.length > 0) {
      firstDomain = String(server.domains[0]).trim();
    }

    if (firstDomain) {
      const config = readConfig();
      const baseDir = config.workdir
        ? config.workdir
        : getDefaultWorkdir();
      const apacheDir = path.join(baseDir, "http-configs", "apache");

      const confFileName = `${firstDomain.replace(/\./g, "_")}.conf`;
      const confFile = path.join(apacheDir, confFileName);
      try {
        if (fs.existsSync(confFile)) {
          await fsp.unlink(confFile);
        } else {
        }
      } catch (err) {
      }
    }
    servers.splice(index, 1);
    writeApacheServers(servers);
  }
  return servers;
});

// Al final de los handlers IPC, agregar:
ipcMain.handle("settings:openConfigDir", async () => {
  // Lee el workdir desde settings.json y abre el subdirectorio http-configs/apache
  const config = readConfig();
  let baseDir = config.workdir && typeof config.workdir === "string"
    ? config.workdir
    : getDefaultWorkdir();
  const apacheDir = path.join(baseDir, "http-configs", "apache");
  // Crear el directorio si no existe
  await fsp.mkdir(apacheDir, { recursive: true });
  return shell.openPath(apacheDir);
});

// NUEVO: Guardar archivo .conf en el directorio seleccionado
ipcMain.handle("apacheServers:saveConfFile", async (_event, filename: string, content: string, saveDir: string | null) => {
  try {
    let targetDir = saveDir;
    if (!targetDir) {
      // Si no se especifica, usar workdir/http-configs/apache
      const config = readConfig();
      targetDir = config.workdir
        ? path.join(config.workdir, "http-configs", "apache")
        : path.join(getDefaultWorkdir(), "http-configs", "apache");
    }
    // Crear el directorio si no existe
    await fsp.mkdir(targetDir, { recursive: true });
    const filePath = path.join(targetDir, filename);
    await fsp.writeFile(filePath, content, "utf-8");
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle("apacheServers:fileExists", async (_event, filename: string, saveDir: string | null) => {
  let targetDir = saveDir;
  if (!targetDir) {
    const config = readConfig();
    targetDir = config.workdir
      ? path.join(config.workdir, "http-configs", "apache")
      : path.join(getDefaultWorkdir(), "http-configs", "apache");
  }
  const filePath = path.join(targetDir, filename);
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
});