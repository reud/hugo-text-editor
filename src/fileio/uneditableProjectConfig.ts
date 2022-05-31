import * as fs from 'fs';
import dayjs from 'dayjs';
import Store, { Schema } from 'electron-store';
import { randomString } from '@src/util';
import { ProjectConfigInterface } from '@src/fileio/projectConfig';


// 形式
// <DATETIME>: 2021-01-08T22:00:00+09:00
// <DATE>: 2021/01/08
// <DATE8D>: 20210108
// <TODAY_**>: returns today <**>
// <RANDOM_STR>: 16 digits random string
const diaryTemplate = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/diary.md','utf-8')}`;
const articleTemplate = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/article.md','utf-8')}`;



export interface UnEditableProjectConfigInterface {
  diary: DefaultEditorConfig;
  article: DefaultEditorConfig;
  recentlyOpenFiles: Array<string>;
}

export interface DefaultEditorConfig {
  title: string;
  datetime: string;
  author: string;
  category: string;
  templateStr: string;
  folderName: string;
}

const diarySchema: Schema<DefaultEditorConfig> = {
    title: {
      type: 'string',
      default: '<TODAY_DATE>の日記'
    },
    datetime: {
      type: 'string',
      default: '<TODAY_DATETIME>'
    },
    author: {
      type: 'string',
      default: 'Anonymous'
    },
    category: {
      type: 'string',
      default: 'diary'
    },
    templateStr: {
      type: 'string',
      default: diaryTemplate
    },
    folderName: {
      type: 'string',
      default: '<TODAY_DATE8D>'
    },
}

const articleSchema: Schema<DefaultEditorConfig> = {
  title: {
    type: 'string',
    default: '<TODAY_DATE>の記事'
  },
  datetime: {
    type: 'string',
    default: '<TODAY_DATETIME>'
  },
  author: {
    type: 'string',
    default: 'Anonymous'
  },
  category: {
    type: 'string',
    default: 'article'
  },
  templateStr: {
    type: 'string',
    default: articleTemplate
  },
  folderName: {
    type: 'string',
    default: '<RANDOM_STR>'
  },
}

export const schema: Schema<UnEditableProjectConfigInterface> = {
  diary: {
    type: 'object',
    properties: diarySchema,
    default: {
      title: diarySchema.title.default,
      datetime: diarySchema.datetime.default,
      author: diarySchema.author.default,
      category: diarySchema.category.default,
      templateStr: diarySchema.templateStr.default,
      folderName: diarySchema.folderName.default,
    }
  },
  article: {
    type: 'object',
    properties: articleSchema,
    default: {
      title: articleSchema.title.default,
      datetime: articleSchema.datetime.default,
      author: articleSchema.author.default,
      category: articleSchema.category.default,
      templateStr: articleSchema.templateStr.default,
      folderName: articleSchema.folderName.default,
    }
  },
  recentlyOpenFiles: {
    type: 'array',
    default: [],
  },
}

const uneditableProjectConfig = new Store<UnEditableProjectConfigInterface>({schema});

export const storeGet = (key: string) => {
  return uneditableProjectConfig.get(key);
}

export const storeGetAll = ():UnEditableProjectConfigInterface => {
  return uneditableProjectConfig.store;
}

export const storeSetAll = (UnEditableProjectConfigInterface: UnEditableProjectConfigInterface) => {
  uneditableProjectConfig.store = UnEditableProjectConfigInterface;
}

export const storeDelete = (key: keyof UnEditableProjectConfigInterface) => {
  return uneditableProjectConfig.delete(key);
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
    uneditableProjectConfig.set('recentlyOpenFiles',l);
  } else {
    uneditableProjectConfig.set('recentlyOpenFiles',[path]);
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
  uneditableProjectConfig.set(k,v);
}

export const openUnEditableProjectConfigFileWithInitiate = (projectPath: string,projectConfig: ProjectConfigInterface):
  Store<UnEditableProjectConfigInterface> => {
  const workPath = projectPath + '/.hugo-text-writer';
  const store = new Store<UnEditableProjectConfigInterface>({
    name: 'project-config2',
    cwd: workPath,
    schema
  });
  if (projectConfig.article) {
    const a = store.get('article');
    a.templateStr =  `${fs.readFileSync(projectConfig.article.templatePath, 'utf-8')}`;
    store.set('article',a);
  }
  if (projectConfig.diary) {
    const a = store.get('diary');
    a.templateStr = `${fs.readFileSync(projectConfig.diary.templatePath,'utf-8')}`;
    store.set('diary',a);
  }
  return store;
}