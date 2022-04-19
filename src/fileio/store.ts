


import * as fs from 'fs';
import dayjs from 'dayjs';
import Store from 'electron-store';
// 形式
// <DATETIME>: 2021-01-08T22:00:00+09:00
// <DATE>: 2021/01/08
// <DATE8D>: 20210108
// <TODAY_**>: returns today <**>
// <RANDOM_STR>: 16 digits random string


const diaryTemplate = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/diary.md','utf-8')}`;
const diaryTemplateYesterday = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/yesterday-diary.md','utf-8')}`;
const articleTemplate = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/article.md','utf-8')}`;

const schema: any = {
  common: {
    type: 'object',
    default: {
      contentBasePath: '/Users/reud/Projects/prosaic-dustbox/content/',
    }
  },
  diary: {
    type: 'object',
    default: {
      title: '<TODAY_DATE>の日記',
      date: '<TODAY_DATE>',
      time: '22:00',
      author: 'reud',
      category: 'diary',
      templateStr: diaryTemplate,
      path: 'diary/',
      folderName: '<TODAY_DATE8D>',
    },
  },
  yesterdayDiary: {
    type: 'object',
    default: {
      title: '<YESTERDAY_DATE>の日記',
      date: '<YESTERDAY_DATE>',
      time: '22:00',
      author: 'reud',
      category: 'diary',
      templateStr: diaryTemplateYesterday,
      path: 'diary/',
      folderName: '<YESTERDAY_DATE8D>',
    },
  },
  article: {
    type: 'object',
    default: {
      title: '<TODAY_DATE>の記事',
      date: '<TODAY_DATE>',
      time: '22:00',
      author: 'reud',
      category: '書き殴り',
      templateStr: articleTemplate,
      path: 'v2_post/',
      folderName: '<RANDOM_STR>',
    },
  },
  workingAbsoluteDirectory: {
    type: 'string',
  },
  tags: {
    type: 'array',
    default: [  // Topがデフォルトとして選択される
      'diary',
      'レポ',
      'イベント',
      'ポエム',
      '書き殴り',
      'ハッカソン',
      'ISUCON',
      'AtCoder',
    ]
  },
  templates: {
    type: 'object'
  },
  authors: {
    type: 'array',
    default: [
      'reud',
    ]
  },
  recentlyOpenFiles: {
    type: 'array'
  }
};

const randomString = () => {
  const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const N=16
  return Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
}
const store = new Store({schema});
// eslint-disable-next-line @typescript-eslint/ban-types
export const replaceSpecialItems = (obj: unknown) => {
  const keys = Object.keys(obj);
  const today = dayjs(new Date());
  const yesterday = today.subtract(1,'d');
  // eslint-disable-next-line @typescript-eslint/ban-types
  const ret:{ [s :string]:string }= {...(obj as {})};
  keys.forEach((k: string) => {
    ret[k] = ret[k].replaceAll('<TODAY_DATETIME>',today.format());
    ret[k] = ret[k].replaceAll('<TODAY_DATE>',today.format('YYYY/MM/DD'));
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

export const storeDelete = (key: string) => {
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
