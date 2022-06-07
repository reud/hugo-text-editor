import * as fs from 'fs';
import yaml from 'yaml';
import fm from 'front-matter';

import { FrontMatter, WritingData } from '@src/structure';
import { dialog } from 'electron';
import { openProjectConfigFile } from '@src/fileio/projectConfig';

export const setupFileGenFunction = (isContinue: boolean,folderPath: string,statement: string) => {
  if (!isContinue) {
    console.log('checking path: ',folderPath);
    if (fs.existsSync(folderPath)) {
      throw new Error('すでにファイルかフォルダが存在しています');
    }
    fs.mkdirSync(folderPath);
  }
  fs.writeFileSync(folderPath+'/index.md',statement);
  return {
    save: (statement: string) => {
      fs.writeFileSync(folderPath+'/index.md',statement);
    }
  } 
}

export const frontMatterSeparate = (frontMatterMarkdown: string) => {
  const frontMatterParsed = fm<Partial<FrontMatter>>(frontMatterMarkdown);
  console.log('separate result',frontMatterParsed);
  return frontMatterParsed;
}

export const frontMatterMerge = (attributes: FrontMatter,body: string) => {
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

export const readFileAndParse = (projectPath: string,projectRelativePath:string): WritingData  => {
  const mdStr = readFile(projectPath+projectRelativePath);
  const {attributes, body} = frontMatterSeparate(mdStr);

  // remove content base
  // `${contentBasePath}${obj.path}${obj.folderName}/index.md`
  const splitted = projectRelativePath.split('/');
  const folderName = splitted[splitted.length -2]; // 最後の一個前がfolderName
  const path = projectRelativePath.replace(`${folderName}/index.md`,'');

  return {
    title: attributes.title,
    datetime: attributes.date,
    author: attributes.author,
    category: attributes.categories,
    templateStr: body,
    path,
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


export const openFolder = (defaultPath: string): string => {
  const ret = dialog.showOpenDialogSync({
    title: '編集する記事の存在するディレクトリの選択',
    defaultPath,
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
