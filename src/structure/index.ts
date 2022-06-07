
export interface WritingDataSettings {
  title: string;
  datetime: string;
  author: string;
  category: string;
  templateStr: string;
  path: string; // ex: content/article/
  folderName: string; // ex: 20220615
}

export interface WritingData extends WritingDataSettings{
  isContinue: boolean,
  draft: boolean
}


export interface EditState {
  projectPath: string;
  writingData: WritingData;
}


export interface InfoCardProps extends EditState {
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

export interface FrontMatter {
  title: string
  date: string
  author: string
  categories: string
  libraries: Array<string>
  draft: boolean
}