import Store, { Schema } from 'electron-store';


export interface ProjectConfigInterface {
  diary: GenreInterface | null;
  article: GenreInterface | null;
  tags: string[];
  authors: string[];
}

interface GenreInterface {
  templatePath: string;
  folderPath: string;
}

const schema: Schema<ProjectConfigInterface> = {
  article: {
    type: ['object','null'],
    properties: {
      templatePath: {
        type: 'string',
        default: 'template/article.md'
      },
      folderPath: {
        type: 'string',
        default: 'content/'
      }
    },
    default: {
      templatePath: 'template/article.md',
      folderPath: 'content/'
    }
  },
  diary: {
    type: ['object','null'],
    default: null
  },
  tags: {
    type: 'array',
    default: ['general']
  },
  authors: {
    type: 'array',
    default: ['Anonymous']
  }
}

export const openProjectConfigFile = (projectPath: string): Store<ProjectConfigInterface> => {
  const workPath = projectPath + '/.hugo-text-writer';

  return new Store<ProjectConfigInterface>({
    name: 'project-config',
    cwd: workPath,
    schema
  });
}
