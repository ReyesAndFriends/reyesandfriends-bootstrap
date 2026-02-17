import { electronAPI } from "@electron-toolkit/preload";
import "./databases/mysql/mysqlAPI";
import "./http-servers/apache/apacheAPI";
import "./http-servers/nginx/nginxAPI";
import "./settings/settingsAPI";

import { contextBridge } from "electron";
contextBridge.exposeInMainWorld("electron", electronAPI);