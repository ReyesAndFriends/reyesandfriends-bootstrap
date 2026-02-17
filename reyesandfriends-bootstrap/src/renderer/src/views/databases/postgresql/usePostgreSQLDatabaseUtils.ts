
import { useState, useCallback } from "react";
import type { PostgreSQLScriptConfig } from "./types";

const api = (window as any).postgresqlScriptsAPI;

export function generatePostgreSQLScript(config: PostgreSQLScriptConfig) {
  // config: { dbName, userName, userPassword, privileges, host, charset }
  const db = config.dbName;
  const user = config.userName;
  const pass = config.userPassword;
  const privs = config.privileges;
  const host = config.host || "localhost";
  const charset = config.charset || "UTF8";
  let sql = `CREATE DATABASE \"${db}\" ENCODING '${charset}';\n`;
  sql += `CREATE USER \"${user}\" WITH PASSWORD '${pass}';\n`;
  sql += `GRANT ${privs} ON DATABASE \"${db}\" TO \"${user}\";\n`;
  return sql;
}

export function usePostgreSQLDatabaseUtils() {
  const [scripts, setScripts] = useState<PostgreSQLScriptConfig[]>([]);

  const fetchScripts = useCallback(async () => {
    const data = await api.getAll();
    setScripts(data);
  }, []);

  const addScript = useCallback(async (script: PostgreSQLScriptConfig) => {
    const data = await api.add(script);
    setScripts(data);
  }, []);

  const updateScript = useCallback(async (index: number, script: PostgreSQLScriptConfig) => {
    const data = await api.update(index, script);
    setScripts(data);
  }, []);

  const removeScript = useCallback(async (index: number) => {
    const data = await api.removeAt(index);
    setScripts(data);
  }, []);

  return {
    scripts,
    fetchScripts,
    addScript,
    updateScript,
    removeScript,
    generatePostgreSQLScript,
  };
}
