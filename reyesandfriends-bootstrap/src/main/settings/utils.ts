import fs from "fs";
import path from "path";
import os from "os";

export function getConfigDir() {
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

export function getDefaultWorkdir() {
  const home = os.homedir();
  if (os.platform() === "win32") {
    return path.join(home, "Documents", "reyesandfriends-bootstrap");
  } else {
    return path.join(home, "reyesandfriends-bootstrap");
  }
}

export function readConfig() {
  const configDir = getConfigDir();
  const configPath = path.join(configDir, "settings.json");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ workdir: getDefaultWorkdir() }, null, 2));
  }
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
