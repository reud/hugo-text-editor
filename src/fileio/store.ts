


import * as fs from 'fs';
import dayjs from 'dayjs';
import Store from 'electron-store';
import { schema, StoreData } from '@src/fileio/storeSchema';
import { randomString } from '@src/util';


// 形式
// <DATETIME>: 2021-01-08T22:00:00+09:00
// <DATE>: 2021/01/08
// <DATE8D>: 20210108
// <TODAY_**>: returns today <**>
// <RANDOM_STR>: 16 digits random string








const store = new Store<StoreData>({schema});

// eslint-disable-next-line @typescript-eslint/ban-types
export const replaceSpecialItems = (obj: unknown) => {
  const keys = Object.keys(obj);
  const today = dayjs(new Date());
  const yesterday = today.subtract(1,'d');
  // eslint-disable-next-line @typescript-eslint/ban-types
  const ret:{ [s :string]:string }= {...(obj as {})};
  keys.forEach((k: string) => {
    ret[k] = ret[k].replaceAll('<TODAY_DATETIME>',today.format("YYYY-MM-DDTHH:mm:00+09:00"));
    ret[k] = ret[k].replaceAll('<TODAY_DATE>',today.format('YYYY/MM/DD'));
    ret[k] = ret[k].replaceAll('<YESTERDAY_DATETIME>',yesterday.format("YYYY-MM-DDTHH:mm:00+09:00"));
    ret[k] = ret[k].replaceAll('<YESTERDAY_DATE>',yesterday.format('YYYY/MM/DD'));
    ret[k] = ret[k].replaceAll('<TODAY_DATE8D>',today.format('YYYYMMDD'));
    ret[k] = ret[k].replaceAll('<YESTERDAY_DATE8D>',yesterday.format('YYYYMMDD'));
    ret[k] = ret[k].replaceAll('<RANDOM_STR>',randomString());
  });
  return ret;
}

export const generateDiaryDefaults = () => {
  const data = store.get('diary');
  return JSON.stringify(replaceSpecialItems(data));
}

export const generateArticleDefaults = () => {
  const data = store.get('article');
  return JSON.stringify(replaceSpecialItems(data));
}

export const storeGet = (key: string) => {
  return store.get(key);
}

export const storeGetAll = ():StoreData => {
  return store.store;
}

export const storeSetAll = (storeData: StoreData) => {
  store.store = storeData;
}

export const storeDelete = (key: keyof StoreData) => {
  return store.delete(key);
}

// path: フルパス
export const pushRecentlyData = (path:string) => {
  let l = storeGet('recentlyOpenFiles') as string[];
  if (l) {
    // delete duplicate
    const alreadyIndex = l.indexOf(path);
    // if index found
    if (alreadyIndex > -1) {
      // remove element
      l.splice(alreadyIndex,1);
    }
    l.push(path);
    // fix size
    l = l.slice(-10);
    store.set('recentlyOpenFiles',l);
  } else {
    store.set('recentlyOpenFiles',[path]);
  }
};

// path: フルパス
export const pullRecentlyData = (): string[] => {
  const l = storeGet('recentlyOpenFiles') as string[];
  if (l) {
    return l;
  } else {
    return [];
  }
}

// 最近開いたファイルの中で存在しないものを消す
export const deleteNotExistData = (l: string[]) => {
  const ret:string[] = [];
  l.forEach((p) => {
    // fs.existsSync
    if (fs.existsSync(p)) {
      ret.push(p);
    }
  });
  return ret;
}

export const storeSet = (k:string,v:unknown) => {
  store.set(k,v);
}
