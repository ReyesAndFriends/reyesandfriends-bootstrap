import { ipcMain, shell } from "electron";
import fs from "fs";
import path from "path";
import { getConfigDir } from "../../settings/ipc";

const configDir = getConfigDir();
const flasKeysPath = path.join(configDir, "flask_keys.json");

function ensureFlaskKeys() {
  if (!fs.existsSync(flasKeysPath)) {
    fs.writeFileSync(flasKeysPath, JSON.stringify({}, null, 2));
  }
}

function readFlaskKeys() {
  ensureFlaskKeys();
  return JSON.parse(fs.readFileSync(flasKeysPath, "utf-8"));
}

function writeFlaskKeys(data: any) {
  ensureFlaskKeys();
  fs.writeFileSync(flasKeysPath, JSON.stringify(data, null, 2));
}

function openFlaskKeysDir() {
  ensureFlaskKeys();
  const config = JSON.parse(fs.readFileSync(path.join(configDir, "settings.json"), "utf-8"));
  let baseDir = config.workdir && typeof config.workdir === "string"
    ? config.workdir
    : require("os").homedir();
  const flaskDir = path.join(baseDir, "secrets", "flask");
  shell.showItemInFolder(flaskDir);
}


ipcMain.handle("flaskKeys:getAll", async () => {
  return readFlaskKeys();
});

ipcMain.handle("flaskKeys:saveAll", async (_event, data) => {
  writeFlaskKeys(data);
});

ipcMain.handle("flaskKeys:add", async (_event, key) => {
  const keys = readFlaskKeys();
  if (!key || typeof key.name !== "string" || typeof key.value !== "string") {
    throw new Error("Cada key debe tener 'name' y 'value' de tipo string");
  }
  keys[key.name] = { name: key.name, value: key.value, description: key.description || "" };
  writeFlaskKeys(keys);
  return keys;
});

ipcMain.handle("flaskKeys:removeAt", async (_event, index) => {
  const keys = readFlaskKeys();
  const keyNames = Object.keys(keys);
  if (typeof index === "number" && index >= 0 && index < keyNames.length) {
    const keyName = keyNames[index];
    delete keys[keyName];
    writeFlaskKeys(keys);
  }
  return keys;
});

ipcMain.handle("flaskKeys:openDir", async () => {
  openFlaskKeysDir();
});