import { ipcMain, shell } from "electron";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { getConfigDir } from "../../settings/ipc";

const configDir = getConfigDir();
const nginxServersPath = path.join(configDir, "nginx_servers.json");

function ensureNginxServers() {
  if (!fs.existsSync(nginxServersPath)) {
    fs.writeFileSync(nginxServersPath, JSON.stringify([], null, 2));
  }
}

function readNginxServers() {
  ensureNginxServers();
  return JSON.parse(fs.readFileSync(nginxServersPath, "utf-8"));
}

function writeNginxServers(data: any) {
  ensureNginxServers();
  fs.writeFileSync(nginxServersPath, JSON.stringify(data, null, 2));
}

ipcMain.handle("nginxServers:getAll", async () => {
  return readNginxServers();
});

ipcMain.handle("nginxServers:saveAll", async (_event, data) => {
  writeNginxServers(data);
});

ipcMain.handle("nginxServers:add", async (_event, server) => {
  const servers = readNginxServers();
  servers.push(server);
  writeNginxServers(servers);
  return servers;
});

ipcMain.handle("nginxServers:removeAt", async (_event, index: number) => {
  const servers = readNginxServers();
  if (index >= 0 && index < servers.length) {
    const server = servers[index];
    // Derivar la carpeta a eliminar igual que en saveConfFile
    const config = JSON.parse(fs.readFileSync(path.join(configDir, "settings.json"), "utf-8"));
    let baseDir = config.workdir && typeof config.workdir === "string"
      ? config.workdir
      : require("os").homedir();
    let targetDir = path.join(baseDir, "http-configs", "nginx");
    let domainFolder = "";
    if (server && server.domains) {
      domainFolder = Array.isArray(server.domains) ? server.domains.join("_") : server.domains;
      targetDir = path.join(targetDir, domainFolder);
    }
    if (fs.existsSync(targetDir)) {
      const deleteRecursive = (dirPath) => {
        if (fs.existsSync(dirPath)) {
          fs.readdirSync(dirPath).forEach((file) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
              deleteRecursive(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(dirPath);
        }
      };
      deleteRecursive(targetDir);
    }
    servers.splice(index, 1);
    writeNginxServers(servers);
  }
  return servers;
});

ipcMain.handle("nginxServers:saveConfFile", async (_event, filename: string, content: string, saveDir: string | null, domains?: string | string[]) => {
  try {
    let targetDir = saveDir;
    let domainFolder = "";
    if (!targetDir) {
      const config = JSON.parse(fs.readFileSync(path.join(configDir, "settings.json"), "utf-8"));
      let baseDir = config.workdir && typeof config.workdir === "string"
        ? config.workdir
        : require("os").homedir();
      targetDir = path.join(baseDir, "http-configs", "nginx");
    }
    if (domains) {
      domainFolder = Array.isArray(domains) ? domains.join("_") : domains;
      targetDir = path.join(targetDir, domainFolder);
    }
    await fsp.mkdir(targetDir, { recursive: true });
    const filePath = path.join(targetDir, filename);
    await fsp.writeFile(filePath, content, "utf-8");
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle("nginxServers:fileExists", async (_event, filename: string, saveDir: string | null, domains?: string | string[]) => {
  let targetDir = saveDir;
  let domainFolder = "";
  if (!targetDir) {
    const config = JSON.parse(fs.readFileSync(path.join(configDir, "settings.json"), "utf-8"));
    let baseDir = config.workdir && typeof config.workdir === "string"
      ? config.workdir
      : require("os").homedir();
    targetDir = path.join(baseDir, "http-configs", "nginx");
  }
  if (domains) {
    domainFolder = Array.isArray(domains) ? domains.join("_") : domains;
    targetDir = path.join(targetDir, domainFolder);
  }
  const filePath = path.join(targetDir, filename);
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle("settings:openNginxConfigDir", async () => {
  const config = JSON.parse(fs.readFileSync(path.join(configDir, "settings.json"), "utf-8"));
  let baseDir = config.workdir && typeof config.workdir === "string"
    ? config.workdir
    : require("os").homedir();
  const nginxDir = path.join(baseDir, "http-configs", "nginx");
  await fsp.mkdir(nginxDir, { recursive: true });
  return shell.openPath(nginxDir);
});
