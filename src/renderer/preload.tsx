import { contextBridge } from  'electron';
import { deleteNotExistData, pullRecentlyData, replaceSpecialItems, storeGet } from '@src/fileio/store';
import { frontMatterSeparate, readFile, readFileAndParse } from '@src/fileio/file';
import { RecentDataset, WritingData } from '@src/structure';
import { execSync } from 'child_process';




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
})

contextBridge.exposeInMainWorld('editor', {
  exec: (cmd: string,folderPlace: string) => {
    const {contentBasePath} = storeGet('common') as {contentBasePath: string};

    return execSync(`${cmd} 2>&1; true`,{
      cwd: `${contentBasePath}${folderPlace}/`
    }).toString();
  }
})