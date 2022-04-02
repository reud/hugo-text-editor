import * as fs from 'fs';
import dayjs from 'dayjs';
import Store from 'electron-store';
import yaml from 'yaml';
import fm from 'front-matter';
import { storeGet } from '@src/fileio/store';
import { WritingData } from '@src/structure';

export class FileGenerator {
  // folderPath: diary/hogehuga のイメージ
  private contentBasePath: string;
  private folderPath: string;
  public save: (statement:string) => void;
  constructor(isContinue: boolean,folderPath: string,statement: string) {
    const store = new Store();
    const { contentBasePath } = store.get('common') as {contentBasePath: string};
    this.contentBasePath = contentBasePath;
    this.folderPath = folderPath;
    if (!isContinue) {
      if (fs.existsSync(contentBasePath+folderPath)) {
        throw new Error('すでにファイルかフォルダが存在しています');
      }
      fs.mkdirSync(contentBasePath+folderPath);
    }
    fs.writeFileSync(contentBasePath+folderPath+'/index.md',statement);
    this.save = (statement) => {
      fs.writeFileSync(this.contentBasePath+this.folderPath+'/index.md',statement);
    };
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
  const date = dayjs(attributes.date);
  return {
    title: attributes.title,
    date: date.format('YYYY/MM/DD'),
    time: attributes.time,
    author: attributes.author,
    category: attributes.categories[0],
    templateStr: body,
    path: objPath,
    folderName: folderName,
    isContinue: true,
    draft: attributes.draft || false,
  };

}

