import * as fs from 'fs';
import dayjs from 'dayjs';
import Store from 'electron-store';
import yaml from 'yaml';
import fm from 'front-matter';
import { storeGet } from '@src/fileio/store';
import { WritingData } from '@src/structure';

export const setupFileGenFunction = (isContinue: boolean,folderPath: string,statement: string) => {
  const { contentBasePath } = storeGet('common') as {contentBasePath: string};
  if (!isContinue) {
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

