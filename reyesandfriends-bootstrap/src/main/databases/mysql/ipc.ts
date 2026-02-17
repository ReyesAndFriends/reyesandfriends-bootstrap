import { ipcMain } from "electron";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { shell } from "electron";
import { readConfig, getDefaultWorkdir, getConfigDir } from "../../settings/utils"

function mysqlScriptsDir() {
  const config = readConfig();
  const baseDir = config.workdir ? config.workdir : getDefaultWorkdir();
  return path.join(baseDir, "databases", "mysql");
}

const configDir = getConfigDir();
const mysqlScriptsListPath = () => path.join(configDir, "mysql_scripts.json");

function ensureMySQLScripts() {
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  const listPath = mysqlScriptsListPath();
  if (!fs.existsSync(listPath)) fs.writeFileSync(listPath, JSON.stringify([], null, 2));
}

function readMySQLScripts() {
  ensureMySQLScripts();
  return JSON.parse(fs.readFileSync(mysqlScriptsListPath(), "utf-8"));
}

function writeMySQLScripts(data: any) {
  ensureMySQLScripts();
  fs.writeFileSync(mysqlScriptsListPath(), JSON.stringify(data, null, 2));
}

ipcMain.handle("mysqlScripts:getAll", async () => {
  return readMySQLScripts();
});

ipcMain.handle("mysqlScripts:add", async (_event, script) => {
  const scripts = readMySQLScripts();
  scripts.push(script);
  writeMySQLScripts(scripts);
  return scripts;
});

ipcMain.handle("mysqlScripts:update", async (_event, index: number, script) => {
  const scripts = readMySQLScripts();
  if (index >= 0 && index < scripts.length) {
    scripts[index] = script;
    writeMySQLScripts(scripts);
  }
  return scripts;
});

ipcMain.handle("mysqlScripts:removeAt", async (_event, index: number) => {
  const scripts = readMySQLScripts();
  if (index >= 0 && index < scripts.length) {
    const script = scripts[index];
    const sqlDir = path.join(mysqlScriptsDir(), script.dbName);
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
    writeMySQLScripts(scripts);
  }
  return scripts;
});

ipcMain.handle("mysqlScripts:generateSQLFile", async (_event, index: number, filename: string, content: string, saveDir: string | null) => {
  const scripts = readMySQLScripts();
  if (index < 0 || index >= scripts.length) return { success: false, error: "Índice inválido" };
  const dbName = scripts[index].dbName;
  let targetDir = saveDir;
  if (!targetDir) {
    const config = readConfig();
    const baseDir = config.workdir ? config.workdir : getDefaultWorkdir();
    targetDir = path.join(baseDir, "databases", "mysql", dbName);
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

ipcMain.handle("mysqlScripts:fileExists", async (_event, filename: string, saveDir: string | null, dbName?: string) => {
  let targetDir = saveDir;
  if (!targetDir) {
    const config = readConfig();
    const baseDir = config.workdir ? config.workdir : getDefaultWorkdir();
    targetDir = path.join(baseDir, "databases", "mysql", dbName || "");
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

ipcMain.handle("mysqlScripts:openScriptsDir", async () => {
  const dir = mysqlScriptsDir();
  await fsp.mkdir(dir, { recursive: true });
  return shell.openPath(dir);
});
