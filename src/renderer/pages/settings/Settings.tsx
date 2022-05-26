import React from 'react';
import {
  Button,
  Checkbox, Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Delete, Folder } from '@mui/icons-material';
import { Bottom } from '@renderer/pages/settings/atoms/Bottom';
import { FilePathInputField } from '@renderer/pages/edit/components/FilePathInputField';
import { WritingData } from '@src/structure';


// TODO: UIについて考える。
export const Settings: React.FC = () => {

  const [useDiaryState,setUseDiaryState] = React.useState(true);
  const [useArticleState, setUseArticleState] = React.useState(true);
  const [diaryFolderPath, setDiaryFolderPath] = React.useState('');
  const [articleFolderPath, setArticleFolderPath] = React.useState('');
  const [diaryTemplatePath, setDiaryTemplatePath] = React.useState('');
  const [diaryArticlePath, setArticleTemplatePath] = React.useState('');
  const [authors, setAuthors] = React.useState(['author1','author2','author3']);
  const [tags, setTags] = React.useState(['tag1','tag2','tag3']);
  const mockProjectPath = "/Users/reud/Projects/prosaic-dustbox/"


  const checkFolderExistApi:(path: string)=>boolean = (window as any)
    .settings
    .checkFolderExist;
  const checkFileExistApi:(path: string)=>boolean = (window as any)
    .settings
    .checkFileExist;


  const openDiaryFolder = (defaultPath: string) => {
    return (window as any).settings.getIpcRenderer().invoke('openDiaryFolder',defaultPath)
  };

  const openArticleFolder = (defaultPath: string) => {
    return (window as any).settings.getIpcRenderer().invoke('openArticleFolder',defaultPath)
  };

  const openDiaryTemplateFile = (defaultPath: string) => {
    return (window as any).settings.getIpcRenderer().invoke('openDiaryTemplateFile',defaultPath)
  };

  const openArticleTemplateFile = (defaultPath: string) => {
    return (window as any).settings.getIpcRenderer().invoke('openArticleTemplateFile',defaultPath)
  };

  const isMarkdownFile = (path: string) => {
    const splitted = path.split('.');
    if (splitted.length < 1) return false;
    return splitted[splitted.length - 1] === "md";
  }

  const handleUseDiaryCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseDiaryState(event.target.checked);
  };
  const handleUseArticleCheckBoxChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setUseArticleState(ev.target.checked);
  }

  const diaryPathConstraint = (path: string) => {
    return checkFolderExistApi(mockProjectPath+path);
  }
  const articlePathConstraint = (path: string) => {
    return checkFolderExistApi(mockProjectPath+path);
  }
  const diaryTemplateConstraint = (path: string) => {
    if (!isMarkdownFile(path)) return false;
    return checkFileExistApi(mockProjectPath+path);
  }
  const articleTemplateConstraint = (path: string) => {
    if (!isMarkdownFile(path)) return false;
    return checkFileExistApi(mockProjectPath+path);
  }

  return (
    <div id='settings'>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography>⚙️ [Project Name] Settings</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            place: /User/reud/hoge/huga/.hugo-text-writer/config.json
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item>
          <Paper variant="outlined">
            <h3>📖Diary</h3>
            <FormControlLabel control={
              <Checkbox
                defaultChecked
                onChange={handleUseDiaryCheckBoxChange}/>
            }
                              label="UseForDiaryWriting" />
            <FormGroup>
              <FilePathInputField
                defaultValue="content/v2_post"
                onValueChanged={(v) => {setDiaryFolderPath(v);}}
                constraint={diaryPathConstraint}
                errorString={"Folder Not Found"}
                label={"Diary Path(ProjectRelative)"}
                folderIconPushed={async () => {
                  const path = await openDiaryFolder(mockProjectPath);
                  return path.replace(mockProjectPath,'');
                }}
                disabled={!useDiaryState} />
              <Grid container>
                <FilePathInputField
                  defaultValue="template/diary.md"
                  onValueChanged={(v) => {setDiaryTemplatePath(v);}}
                  constraint={diaryTemplateConstraint}
                  errorString={"File Not Found or Bad Extension (.md only)"}
                  label={"Diary Template(ProjectRelative)"}
                  folderIconPushed={async () => {
                    const path = await openDiaryTemplateFile(mockProjectPath);
                    return path.replace(mockProjectPath,'');
                  }}
                  disabled={!useDiaryState} />
              </Grid>
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item>
          <Paper variant="outlined">
            <h3>📚Article</h3>
            <FormGroup>
              <FormControlLabel control={<Checkbox
                defaultChecked
                onChange={handleUseArticleCheckBoxChange}/>}
                                label="UseForArticleWriting" />
              <Grid container>
                <FilePathInputField
                  defaultValue="content/diary"
                  onValueChanged={(v) => {setArticleFolderPath(v);}}
                  constraint={articlePathConstraint}
                  errorString={"Folder Not Found"}
                  label={"Article Path(ProjectRelative)"}
                  folderIconPushed={async () => {
                    const path = await openArticleFolder(mockProjectPath);
                    return path.replace(mockProjectPath,'');
                  }}
                  disabled={!useArticleState} />
              </Grid>
              <Grid container>
                <FilePathInputField
                  defaultValue="template/article.md"
                  onValueChanged={(v) => {setArticleTemplatePath(v);}}
                  constraint={articleTemplateConstraint}
                  errorString={"File Not Found or Bad Extension (.md only)"}
                  label={"Article Template(ProjectRelative)"}
                  folderIconPushed={async () => {
                    const path = await openArticleTemplateFile(mockProjectPath);
                    return path.replace(mockProjectPath,'');
                  }}
                  disabled={!useArticleState} />
              </Grid>
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item />
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={3} justifyContent="center">
        <Grid item>
          <Paper variant="outlined">
            <h4>🔖Tags</h4>
            <Grid container>
              <TextField id="standard-basic" label="Add New Tag" variant="standard" />
              <Button variant="contained">Add</Button>
            </Grid>
            <List dense={false}>
              {
                tags.map((v,i) => {
                  return (
                    <ListItem key={v} secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={
                        () => {
                          const array = [...tags];
                          array.splice(i,1);
                          setTags(array);
                        }
                      }>
                        <Delete />
                      </IconButton>
                    }>
                      {v}
                    </ListItem>
                  )
                })
              }
            </List>
          </Paper>
        </Grid>
        <Grid item>
          <Paper variant="outlined">
            <h4>👨‍🦲Authors</h4>
            <Grid container>
              <TextField id="standard-basic" label="Add New Tag" variant="standard" />
              <Button variant="contained">Add</Button>
            </Grid>
            <List dense={false}>
              {
                authors.map((v,i) => {
                  return (
                    <ListItem key={v} secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={
                        () => {
                          const array = [...authors];
                          array.splice(i,1);
                          setAuthors(array);
                        }
                      }>
                        <Delete />
                      </IconButton>
                    }>
                      {v}
                    </ListItem>
                  )
                })
              }
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{height:100}} />
      <Bottom />
    </div>
  )
}