import * as fs from 'fs';
import yaml from 'yaml';
import fm from 'front-matter';
import {
  openUnEditableProjectConfigFileWithInitiate,
  storeGet,
  UnEditableProjectConfigInterface,
} from '@src/fileio/uneditableProjectConfig';
import { WritingData } from '@src/structure';
import { dialog } from 'electron';
import { openProjectConfigFile, ProjectConfigInterface } from '@src/fileio/projectConfig';

export const setupFileGenFunction = (isContinue: boolean,folderPath: string,statement: string) => {
  const { contentBasePath } = storeGet('common') as {contentBasePath: string};
  if (!isContinue) {
    console.log('checking path: ',contentBasePath+folderPath);
    if (fs.existsSync(contentBasePath+folderPath)) {
      throw new Error('すでにファイルかフォルダが存在しています');
    }
    fs.mkdirSync(contentBasePath+folderPath);
  }
  fs.writeFileSync(contentBasePath+folderPath+'/index.md',statement);
  return {
    save: (statement: string) => {
      fs.writeFileSync(contentBasePath+folderPath+'/index.md',statement);
    }
  } 
}

export const frontMatterSeparate = (frontMatterMarkdown: string) => {
  const frontMatterParsed = fm(frontMatterMarkdown);
  console.log('separate result',frontMatterParsed);
  return {attributes: frontMatterParsed.attributes,body: frontMatterParsed.body};
}

export const frontMatterMerge = (attributes: any,body: string) => {
  const mdTemplate = `---
<FRONT_MATTER>---
<BODY>
`;
  const frontMatter = yaml.stringify(attributes);
  let result = mdTemplate.replace('<FRONT_MATTER>',frontMatter);
  result = result.replace('<BODY>',body);
  return result;
}

export const readFile = (path:string) => {
  return `${fs.readFileSync(path,'utf-8')}`;
}

export const readFileAndParse = (path: string): WritingData  => {
  const mdStr = readFile(path);
  const {attributes, body} = frontMatterSeparate(mdStr) as any;
  const {contentBasePath} = storeGet('common') as {contentBasePath: string};
  // remove content base
  const p = path.replace(contentBasePath,'');
  // `${contentBasePath}${obj.path}${obj.folderName}/index.md`
  const splitted = p.split('/');
  const folderName = splitted[splitted.length -2];
  const objPath = splitted.slice(0,splitted.length-2).join('/') + '/';
  return {
    title: attributes.title,
    datetime: attributes.date,
    author: attributes.author,
    category: attributes.categories,
    templateStr: body,
    path: objPath,
    folderName: folderName,
    isContinue: true,
    draft: attributes.draft || false,
  };

}


export const checkAndInitializeDirectory = (projectPath: string) => {
  // ディレクトリがあるかどうか
  const isExist = fs.existsSync(projectPath + '/.hugo-text-writer');
  if (!isExist) {
    fs.mkdirSync(projectPath + '/.hugo-text-writer');
  }

  if (!fs.statSync(projectPath + '/.hugo-text-writer').isDirectory()) {
    fs.mkdirSync(projectPath + '/.hugo-text-writer');
  }
  // 設定ファイルの初期化
  openProjectConfigFile(projectPath);
}


export const openProject = (): string => {
  const homedir = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"];
  const ret = dialog.showOpenDialogSync({
    title: 'hugoプロジェクトのルートフォルダの選択',
    defaultPath: homedir,
    properties: [
      'openDirectory'
    ]
  });
  const v = ret == undefined ?  '' : ret[0];
  if (v == '') return '';

  checkAndInitializeDirectory(v);
  return v;
}


export const openFolder = (): string => {
  const {contentBasePath} = storeGet('common') as {contentBasePath: string};
  const ret = dialog.showOpenDialogSync({
    title: '編集する記事の存在するディレクトリの選択',
    defaultPath: contentBasePath,
    properties: [
      'openDirectory'
    ]
  });
  return ret == undefined ?  '' : ret[0];
}

export const openDiaryFolder = (defaultPath: string): string => {
  const ret = dialog.showOpenDialogSync({
    title: '日記の存在するディレクトリの選択',
    defaultPath: defaultPath,
    properties: [
      'openDirectory'
    ]
  });
  return ret == undefined ?  '' : ret[0];
}

export const openArticleFolder = (defaultPath: string): string => {
  const ret = dialog.showOpenDialogSync({
    title: '記事の存在するディレクトリの選択',
    defaultPath: defaultPath,
    properties: [
      'openDirectory'
    ]
  });
  return ret == undefined ?  '' : ret[0];
}

export const openDiaryTemplateFile = (defaultPath: string): string => {
  const ret = dialog.showOpenDialogSync({
    title: '日記のテンプレートファイルの選択',
    defaultPath: defaultPath,
    properties: [
      'openFile'
    ],
    filters: [
      { name: 'MarkdownFile', extensions: ['md'] },
    ]
  });
  return ret == undefined ?  '' : ret[0];
}


export const openArticleTemplateFile = (defaultPath: string): string => {
  const ret = dialog.showOpenDialogSync({
    title: '記事のテンプレートファイルの選択',
    defaultPath: defaultPath,
    properties: [
      'openFile'
    ],
    filters: [
      { name: 'MarkdownFile', extensions: ['md'] },
    ]
  });
  const v = ret == undefined ?  '' : ret[0];
  console.log(v);
  return v;
}

export interface ProjectConfig {
  UnEditableProjectConfig: UnEditableProjectConfigInterface;
  ProjectConfig: ProjectConfigInterface;
}

export const fetchProjectConfigFromProjectPath = (projectPath: string): ProjectConfig => {
  const projectConfig = openProjectConfigFile(projectPath);
  const uneditable = openUnEditableProjectConfigFileWithInitiate(projectPath,projectConfig.store);
  console.log('config: ',projectConfig.store);
  console.log('uneditable: ',uneditable.store);
  return { ProjectConfig: projectConfig.store, UnEditableProjectConfig: uneditable.store }
}