import { ElectronAPI } from '@electron-toolkit/preload';


  interface Window {
    electron: ElectronAPI;
    api: unknown;

    settingsAPI: {
      getWorkdir: () => Promise<string>;
      setWorkdir: (path: string) => Promise<void>;
      selectWorkdir: () => Promise<string | null>;
      getDefaultWorkdir: () => Promise<string>;
      openApacheConfigDir: () => Promise<string>;
      openNginxConfigDir: () => Promise<string>;
    };

    apacheServersAPI: {
      getAll: () => Promise<any[]>;
      saveAll: (data: any[]) => Promise<void>;
      add: (server: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      saveConfFile: (
        filename: string,
        content: string,
        saveDir: string | null,
        domains?: string | string[]
      ) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (
        filename: string,
        saveDir: string | null,
        domains?: string | string[]
      ) => Promise<boolean>;
    };

    nginxServersAPI: {
      getAll: () => Promise<any[]>;
      saveAll: (data: any[]) => Promise<void>;
      add: (server: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      saveConfFile: (
        filename: string,
        content: string,
        saveDir: string | null,
        domains?: string | string[]
      ) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (
        filename: string,
        saveDir: string | null,
        domains?: string | string[]
      ) => Promise<boolean>;
    };

    mysqlScriptsAPI: {
      getAll: () => Promise<any[]>;
      add: (script: any) => Promise<any[]>;
      update: (index: number, script: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      generateSQLFile: (index: number, filename: string, content: string, saveDir: string | null) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (filename: string, saveDir: string | null, dbName?: string) => Promise<boolean>;
      openScriptsDir: () => Promise<string>;
    };

    postgresqlScriptsAPI: {
      getAll: () => Promise<any[]>;
      add: (script: any) => Promise<any[]>;
      update: (index: number, script: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      generateSQLFile: (index: number, filename: string, content: string, saveDir: string | null) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (filename: string, saveDir: string | null, dbName?: string) => Promise<boolean>;
      openScriptsDir: () => Promise<string>;
    };
  }
