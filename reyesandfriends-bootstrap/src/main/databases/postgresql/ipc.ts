
import { ipcMain } from "electron";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { shell } from "electron";
import { readConfig, getDefaultWorkdir, getConfigDir } from "../../settings/ipc"

function postgresqlScriptsDir() {
  const config = readConfig();
  const baseDir = config.workdir ? config.workdir : getDefaultWorkdir();
  return path.join(baseDir, "databases", "postgresql");
}

const configDir = getConfigDir();
const postgresqlScriptsListPath = () => path.join(configDir, "postgresql_scripts.json");

function ensurePostgreSQLScripts() {
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  const listPath = postgresqlScriptsListPath();
  if (!fs.existsSync(listPath)) fs.writeFileSync(listPath, JSON.stringify([], null, 2));
}

function readPostgreSQLScripts() {
  ensurePostgreSQLScripts();
  return JSON.parse(fs.readFileSync(postgresqlScriptsListPath(), "utf-8"));
}

function writePostgreSQLScripts(data: any) {
  ensurePostgreSQLScripts();
  fs.writeFileSync(postgresqlScriptsListPath(), JSON.stringify(data, null, 2));
}

ipcMain.handle("postgresqlScripts:getAll", async () => {
  return readPostgreSQLScripts();
});

ipcMain.handle("postgresqlScripts:add", async (_event, script) => {
  const scripts = readPostgreSQLScripts();
  scripts.push(script);
  writePostgreSQLScripts(scripts);
  return scripts;
});

ipcMain.handle("postgresqlScripts:update", async (_event, index: number, script) => {
  const scripts = readPostgreSQLScripts();
  if (index >= 0 && index < scripts.length) {
    scripts[index] = script;
    writePostgreSQLScripts(scripts);
  }
  return scripts;
});

ipcMain.handle("postgresqlScripts:removeAt", async (_event, index: number) => {
  const scripts = readPostgreSQLScripts();
  if (index >= 0 && index < scripts.length) {
    const script = scripts[index];
    const sqlDir = path.join(postgresqlScriptsDir(), script.dbName);
    try {
      if (fs.existsSync(sqlDir)) {
        // Eliminar todos los archivos y subcarpetas dentro de sqlDir
        const deleteRecursive = (dirPath: string) => {
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
        deleteRecursive(sqlDir);
      }
    } catch {}
    scripts.splice(index, 1);
    writePostgreSQLScripts(scripts);
  }
  return scripts;
});

ipcMain.handle("postgresqlScripts:generateSQLFile", async (_event, index: number, filename: string, content: string, saveDir: string | null) => {
  const scripts = readPostgreSQLScripts();
  if (index < 0 || index >= scripts.length) return { success: false, error: "Índice inválido" };
  const dbName = scripts[index].dbName;
  let targetDir = saveDir;
  if (!targetDir) {
    const config = readConfig();
    const baseDir = config.workdir ? config.workdir : getDefaultWorkdir();
    targetDir = path.join(baseDir, "databases", "postgresql", dbName);
  } else {
    targetDir = path.join(targetDir, dbName);
  }
  await fsp.mkdir(targetDir, { recursive: true });
  const filePath = path.join(targetDir, filename);
  try {
    await fsp.writeFile(filePath, content, "utf-8");
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
});

ipcMain.handle("postgresqlScripts:fileExists", async (_event, filename: string, saveDir: string | null, dbName?: string) => {
  let targetDir = saveDir;
  if (!targetDir) {
    const config = readConfig();
    const baseDir = config.workdir ? config.workdir : getDefaultWorkdir();
    targetDir = path.join(baseDir, "databases", "postgresql", dbName || "");
  } else {
    targetDir = path.join(targetDir, dbName || "");
  }
  const filePath = path.join(targetDir, filename);
  try {
    await fsp.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle("postgresqlScripts:openScriptsDir", async () => {
  const dir = postgresqlScriptsDir();
  await fsp.mkdir(dir, { recursive: true });
  return shell.openPath(dir);
});
