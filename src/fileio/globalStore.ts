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

export const getGlobalStore = () => {
  return new Store<GlobalStoreData>({schema: globalStoreSchema});
}

