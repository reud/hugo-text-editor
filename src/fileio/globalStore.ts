import Store, { Schema } from 'electron-store';


export interface GlobalStoreData {
  recentlyOpenProjects: Array<string>;
}

export const globalStoreSchema: Schema<GlobalStoreData> = {
  recentlyOpenProjects: {
    type: 'array',
    default: []
  },
}

const globalStore = new Store<GlobalStoreData>({ schema: globalStoreSchema });

export const globalStoreGetAll = (): GlobalStoreData => {
  return globalStore.store;
}

// path: フルパス
export const pushRecentlyProjects = (path:string) => {
  let recentlyOpenProjects = globalStoreGetAll().recentlyOpenProjects;
  if (recentlyOpenProjects) {
    // delete duplicate
    const alreadyIndex = recentlyOpenProjects.indexOf(path);
    // if index found
    if (alreadyIndex > -1) {
      // remove element
      recentlyOpenProjects.splice(alreadyIndex,1);
    }
    recentlyOpenProjects.push(path);
    // fix size
    recentlyOpenProjects = recentlyOpenProjects.slice(-10);
    globalStore.set('recentlyOpenProjects',recentlyOpenProjects);
  } else {
    globalStore.set('recentlyOpenProjects',[path]);
  }
};