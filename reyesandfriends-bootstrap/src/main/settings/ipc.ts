import { ipcMain, dialog } from "electron";
import fs from "fs";
import path from "path";
import os from "os";

const configDir = getConfigDir();
const configPath = path.join(configDir, "settings.json");

function getConfigDir() {
  const home = os.homedir();
  const platform = os.platform();
  if (platform === "win32") {
    return path.join(home, "AppData", "Roaming", "reyesandfriends-bootstrap");
  } else if (platform === "darwin") {
    return path.join(home, "Library", "Application Support", "reyesandfriends-bootstrap");
  } else {
    return path.join(home, ".reyesandfriends-bootstrap");
  }
}

function getDefaultWorkdir() {
  const home = os.homedir();
  if (os.platform() === "win32") {
    return path.join(home, "Documents", "reyesandfriends-bootstrap");
  } else {
    return path.join(home, "reyesandfriends-bootstrap");
  }
}

function ensureConfig() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ workdir: getDefaultWorkdir() }, null, 2));
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
