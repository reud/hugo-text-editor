import { ipcRenderer } from 'electron';
import fs from 'fs';
import { openProjectConfigFile, ProjectConfigInterface } from '@src/fileio/projectConfig';
import { FrontMatter, RecentDataset, WritingData } from '@src/structure';



import {
  frontMatterMerge,
  frontMatterSeparate,
  readFile,
  readFileAndParse,
  setupFileGenFunction,
} from '@src/fileio/file';
import { execSync } from 'child_process';
import { FileServerConfig } from '@src/server/server';
import { getGlobalStore } from '@src/fileio/globalStore';

const api = {
  checkFolderExist: (path: string) => {
    if(!fs.existsSync(path)) return false;
    return fs.lstatSync(path).isDirectory();
  },
  checkFileExist: (path: string) => {
    if(!fs.existsSync(path)) return false;
    return fs.lstatSync(path).isFile();
  },
  getIpcRenderer: () => {
    return ipcRenderer;
  },
  openProjectConfigFile: (projectPath: string): ProjectConfigInterface => {
    return openProjectConfigFile(projectPath).store;
  },
  genRecentlyDataset: (projectPath: string):RecentDataset[] => {
    const store = openProjectConfigFile(projectPath);
    const recentlyOpenFiles = store.get('recentlyOpenFiles') || [];
    console.log('recentlyOpenFiles: ',recentlyOpenFiles);
    const paths = recentlyOpenFiles.filter((p) => fs.existsSync(p));
    console.log('paths: ',paths);
    return paths.map((p) => {
      const dataStr = readFile(p);
      const {attributes} = frontMatterSeparate(dataStr);
      console.log('attributes',attributes);
      return {
        title: attributes.title,
        place: p
      }
    });
  },
  readFileAndParse: (projectPath: string,projectRelativePath:string):WritingData => {
    return readFileAndParse(projectPath,projectRelativePath);
  },
  exec: (cmd: string,cwd: string) => {
    return execSync(`${cmd} 2>&1; true`,{
      cwd
    }).toString();
  },
  newFileGenerator: (isContinue: boolean,folderPath: string,statement: string) => {
    return setupFileGenFunction(isContinue,folderPath,statement);
  },
  pushRecentlyData: (projectPath: string,path: string) => {
    const store = openProjectConfigFile(projectPath);
    let recentlyOpenFiles = store.get('recentlyOpenFiles') || [];

    if (recentlyOpenFiles.indexOf(path) > -1) {
      const idx = recentlyOpenFiles.indexOf(path);
      recentlyOpenFiles.splice(idx,1);
    }
    recentlyOpenFiles.push(path);
    // size fix
    recentlyOpenFiles = recentlyOpenFiles.slice(-10);
    store.set({recentlyOpenFiles});
  },
  frontMatterMerge: (attributes: FrontMatter,body: string) => {
    return frontMatterMerge(attributes,body);
  },
  storeSet: (projectPath: string,kv: Partial<ProjectConfigInterface>) => {
    const store = openProjectConfigFile(projectPath);
    store.set(kv);
  },
  storeGet: <Key extends keyof ProjectConfigInterface>(projectPath: string,key: Key): ProjectConfigInterface[Key] => {
    const store = openProjectConfigFile(projectPath);
    return store.get(key);
  },
  getFileServerPort: () => {
    return FileServerConfig.getInstance().port;
  },
  setCwd: (cwd: string) => {
     FileServerConfig.getInstance().cwd = cwd;
  },
  pushRecentlyOpenProject: (projectPath: string) => {
    const store = getGlobalStore();
    let recentlyOpenProjects = store.get('recentlyOpenProjects');
    if (recentlyOpenProjects) {
      const alreadyIndex = recentlyOpenProjects.indexOf(projectPath);
      if (alreadyIndex > -1) {
        recentlyOpenProjects.splice(alreadyIndex,1);
      }
      recentlyOpenProjects.push(projectPath);
      recentlyOpenProjects = recentlyOpenProjects.slice(-10);
      store.set({recentlyOpenProjects});
    } else store.set('recentlyOpenProjects',[projectPath]);
  },
  pullRecentlyOpenProject: ():Array<string> => {
    const store = getGlobalStore();
    return store.get('recentlyOpenProjects');
  }
}

export default {
  ...api
};