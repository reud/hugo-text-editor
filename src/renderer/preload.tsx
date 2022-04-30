import { contextBridge,ipcRenderer } from  'electron';
import {
  deleteNotExistData,
  pullRecentlyData,
  pushRecentlyData,
  replaceSpecialItems,
  storeGet, storeGetAll, storeSet, storeSetAll,
} from '@src/fileio/store';
import {
  frontMatterMerge,
  frontMatterSeparate, openFolder,
  readFile,
  readFileAndParse,
  setupFileGenFunction,
} from '@src/fileio/file';
import { RecentDataset, WritingData } from '@src/structure';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { StoreData } from '@src/fileio/storeSchema';


contextBridge.exposeInMainWorld('settings',{
  storeGetAll: ():StoreData => {
    return storeGetAll();
  },
  storeSetAll: (storeData: StoreData) => {
    storeSetAll(storeData);
  }
})


contextBridge.exposeInMainWorld('home', {
  genRecentlyDataset: ():RecentDataset[] => {
    const pulled = pullRecentlyData();
    const paths = deleteNotExistData(pulled);
    return paths.map((p) => {
      const dataStr = readFile(p);
      const {attributes} = frontMatterSeparate(dataStr) as any;
      console.log('attributes',attributes);
      return {
        title: attributes.title,
        place: p
      }
    });
  },
  getSettings: () => {
    return {
      common: replaceSpecialItems(storeGet('common')),
      diary: replaceSpecialItems(storeGet('diary')),
      article: replaceSpecialItems(storeGet('article')),
      yesterdayDiary: replaceSpecialItems(storeGet('yesterdayDiary'))
    }
  },
  readFileAndParse: (path:string):WritingData => {
    return readFileAndParse(path);
  },
  checkFileExist: (path: string) => {
    return fs.existsSync(path);
  },
  getIpcRenderer: () => {
    return ipcRenderer;
  }
})

contextBridge.exposeInMainWorld('editor', {
  exec: (cmd: string,folderPlace: string) => {
    const {contentBasePath} = storeGet('common') as {contentBasePath: string};

    return execSync(`${cmd} 2>&1; true`,{
      cwd: `${contentBasePath}${folderPlace}/`
    }).toString();
  },
  newFileGenerator: (isContinue: boolean,folderPath: string,statement: string) => {
    return setupFileGenFunction(isContinue,folderPath,statement);
  },
  fetchCommonSettings: () => {
    return storeGet('common');
  },
  pushRecentlyData: (p: string) => {
    return pushRecentlyData(p);
  },
  frontMatterMerge: (attributes: any,body: string) => {
    return frontMatterMerge(attributes,body);
  },
  storeSet: (key: string,value: string) => {
    return storeSet(key,value);
  },
  getCategories: () => {
    return storeGet('tags');
  },
  getAuthors: () => {
    return storeGet('authors');
  },
  getTemplates: () => {
    return storeGet('templates');
  }
});

