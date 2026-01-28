import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI;
    api: unknown;
    apacheServersAPI: {
      getAll: () => Promise<any[]>;
      saveAll: (data: any[]) => Promise<void>;
      add: (server: any) => Promise<any[]>;
      removeAt: (index: number) => Promise<any[]>;
    };
    settingsAPI: {
      getWorkdir: () => Promise<string>;
      setWorkdir: (path: string) => Promise<void>;
      selectWorkdir: () => Promise<string | null>;
      getDefaultWorkdir: () => Promise<string>;
      openConfigDir: () => Promise<void>;
    };
  }
}
