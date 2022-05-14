
export interface WritingDataSettings {
  title: string;
  datetime: string;
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
  disabled: boolean;
}

export interface ProjectInfoCardProps {
  projectPath: string;
  isExist: boolean;
}

export interface RecentDataset {
  title: string;
  place: string;
}