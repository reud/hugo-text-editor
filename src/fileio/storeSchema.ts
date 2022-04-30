import { Schema } from 'electron-store';
import fs from 'fs';

// 形式
// <DATETIME>: 2021-01-08T22:00:00+09:00
// <DATE>: 2021/01/08
// <DATE8D>: 20210108
// <TODAY_**>: returns today <**>
// <RANDOM_STR>: 16 digits random string
const diaryTemplate = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/diary.md','utf-8')}`;
const diaryTemplateYesterday = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/yesterday-diary.md','utf-8')}`;
const articleTemplate = `${fs.readFileSync('/Users/reud/Projects/hugo-text-editor/template/article.md','utf-8')}`;


export interface StoreData {
  common:{
    contentBasePath: string
  },
  diary: EditorData;
  yesterdayDiary: EditorData;
  article: EditorData;
  workingAbsoluteDirectory: string
  tags: Array<string>;
  templates: Record<string, string>;
  authors: Array<string>;
  recentlyOpenFiles: Array<string>;
}

export interface EditorData {
  title: string;
  datetime: string;
  author: string;
  category: string;
  templateStr: string;
  path: string;
  folderName: string;
}

export const schema: Schema<StoreData> = {
    article: {
      type: 'object',
      properties: {
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
          default: 'reud'
        },
        category: {
          type: 'string',
          default: '書き殴り'
        },
        templateStr: {
          type: 'string',
          default: articleTemplate
        },
        path: {
          type: 'string',
          default: 'v2_post/'
        },
        folderName: {
          type: 'string',
          default: '<RANDOM_STR>'
        }
      }
    },
    authors: {
      type: 'array',
      default: [
        'reud'
      ]
    },
    common: {
      type: 'object',
      default: {
        contentBasePath: '/Users/reud/Projects/prosaic-dustbox/content/',
      }
    },
    diary: {
      type: 'object',
      default: {
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
          default: 'reud'
        },
        category: {
          type: 'string',
          default: 'diary'
        },
        templateStr: {
          type: 'string',
          default: diaryTemplate
        },
        path: {
          type: 'string',
          default: 'diary/'
        },
        folderName: {
          type: 'string',
          default: '<TODAY_DATE8D>'
        },
      },
    },
    recentlyOpenFiles: {
      type: 'array',
      default: [],
    },
    tags: {
      type: 'array',
      default: [
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
      type: 'object',
      default: {}
    },
    workingAbsoluteDirectory: {
      type: 'string',
      default: ''
    },
    yesterdayDiary: {
      type: 'object',
      default: {
        title: {
          type: 'string',
          default: '<YESTERDAY_DATE>の日記',
        },
        datetime: {
          type: 'string',
          default: '<YESTERDAY_DATETIME>',
        },
        author: {
          type: 'string',
          default: 'reud'
        },
        category: {
          type: 'string',
          default: 'diary'
        },
        templateStr: {
          type: 'string',
          default: diaryTemplateYesterday
        }
      }
    }
}