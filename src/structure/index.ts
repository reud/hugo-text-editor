
export interface WritingDataSettings {
  title: string;
  date: string;
  time: string;
  author: string;
  category: string;
  templateStr: string;
  path: string;
  folderName: string;
}

export interface WritingData extends WritingDataSettings{
  isContinue: boolean,
  draft: boolean
}

export interface InfoCardProps extends WritingData {
  label: string;
  savePlace: string;
}

export interface RecentDataset {
  title: string;
  place: string;
}