import { expressStartApp } from '@src/server/server';
import contextBridge = Electron.contextBridge;
import { replaceSpecialItems, storeGet } from '@src/fileio/store';


expressStartApp();

contextBridge.exposeInMainWorld('electron',{
  getSettings: () => {
    return {
      common: replaceSpecialItems(storeGet('common')),
      diary: replaceSpecialItems(storeGet('diary')),
      article: replaceSpecialItems(storeGet('article')),
      yesterdayDiary: replaceSpecialItems(storeGet('yesterdayDiary'))
    }
  },
})