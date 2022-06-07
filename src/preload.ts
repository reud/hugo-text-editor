import { expressStartApp } from '@src/server/server';
import { contextBridge } from 'electron';
import api from '@src/api';


contextBridge.exposeInMainWorld("api", api);
expressStartApp();

