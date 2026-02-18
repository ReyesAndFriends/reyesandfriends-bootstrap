import { electronAPI } from "@electron-toolkit/preload";

import "./databases/mysql/mysqlAPI";
import "./databases/postgresql/postgresqlAPI";

import "./http-servers/apache/apacheAPI";
import "./http-servers/nginx/nginxAPI";

import "./secrets/flask/flaskAPI";

import "./settings/settingsAPI";

import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electron", electronAPI);