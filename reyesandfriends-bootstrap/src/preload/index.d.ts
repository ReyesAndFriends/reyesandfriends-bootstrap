import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;

    settingsAPI: {
      getWorkdir: () => Promise<string>;
      setWorkdir: (path: string) => Promise<void>;
      selectWorkdir: () => Promise<string | null>;
      getDefaultWorkdir: () => Promise<string>;
      openApacheConfigDir: () => Promise<void>;
      openNginxConfigDir: () => Promise<void>;
    };

    apacheServersAPI: {
      getAll: () => Promise<any[]>;
      saveAll: (data: any[]) => Promise<void>;
      add: (server: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      saveConfFile: (filename: string, content: string, saveDir: string | null) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (filename: string, saveDir: string | null) => Promise<boolean>;
    };

    nginxServersAPI: {
      getAll: () => Promise<any[]>;
      saveAll: (data: any[]) => Promise<void>;
      add: (server: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
      saveConfFile: (filename: string, content: string, saveDir: string | null) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      fileExists: (filename: string, saveDir: string | null) => Promise<boolean>;
    };
  }
}
