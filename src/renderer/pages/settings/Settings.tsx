import React from 'react';
import { storeGet } from '@src/fileio/store';
import { StoreData } from '@src/fileio/storeSchema';


// TODO: UIについて考える。
const Settings: React.FC = () => {
  const storeData:StoreData =  (window as any).settings.storeGetAll();

  return <div>hogehuga</div>
}