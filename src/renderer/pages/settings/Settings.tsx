import React, { useEffect } from 'react';
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
import { FilePathInputField } from '@renderer/pages/settings/components/FilePathInputField';
import { WritingData } from '@src/structure';
import Store from 'electron-store';
import { ProjectConfigInterface } from '@src/fileio/projectConfig';
import { useLocation, useNavigate } from 'react-router-dom';

interface SettingsState {
  projectPath: string;
}

export const Settings: React.FC= () => {
  const location = useLocation();
  const state = location.state as SettingsState;
  console.log('settings loading: ',state);
  // FIXME: 関係ないパスなのにコンポーネントが読み込まれてしまうことがある。
  if (state == null)
  {
    return (<div></div>);
  }
  const projectConfigStore = (window as any).settings
                              .openProjectConfigFile(state.projectPath) as Store<ProjectConfigInterface>;

  console.log('projectConfigStore: ',projectConfigStore);
  const initialProjectConfig = projectConfigStore.store;
  console.log('initialProjectConfig: ',initialProjectConfig);

  const projectName = state.projectPath.split('/')[state.projectPath.split('/').length - 1];

  const [useDiaryState,setUseDiaryState] = React.useState(!!initialProjectConfig.diary);
  const [useArticleState, setUseArticleState] = React.useState(!!initialProjectConfig.article);
  const [diaryFolderPath, setDiaryFolderPath] = React.useState(initialProjectConfig.diary?.folderPath || '');
  const [articleFolderPath, setArticleFolderPath] = React.useState(initialProjectConfig.article?.folderPath || '');
  const [diaryTemplatePath, setDiaryTemplatePath] = React.useState(initialProjectConfig.diary?.templatePath || '');
  const [articleTemplatePath, setArticleTemplatePath] = React.useState(initialProjectConfig.article?.templatePath || '');

  const [okButtonEnable, setOKButtonEnable] = React.useState(false);
  const [applyButtonEnable,setApplyButtonEnable] = React.useState(false);

  const [authors, setAuthors] = React.useState(initialProjectConfig.authors);
  const [tags, setTags] = React.useState(initialProjectConfig.tags);

  const [tagField,setTagField] = React.useState("");
  const [authorField,setAuthorField] = React.useState("");

  const [allData,setAllData] = React.useState<ProjectConfigInterface>(initialProjectConfig);

  useEffect(
    () => {
      let passConstraints = true;
      if (useDiaryState) {
        if(!diaryTemplateConstraint(diaryTemplatePath)) {
          console.log('check constraint: diaryTemplateConstraint failed');
          passConstraints = false;
        }
        if(!diaryPathConstraint(diaryFolderPath)) {
          console.log('check constraint: diaryPathConstraint failed');
          passConstraints = false;
        }
      }
      if (useArticleState) {
        if (!articlePathConstraint(articleFolderPath)) {
          console.log('check constraint: articlePathConstraint failed');
          passConstraints = false;
        }
        if (!articleTemplateConstraint(articleTemplatePath)) {
          console.log('check constraint: articleTemplateConstraint failed');
          passConstraints = false;
        }
      }
      if(!authorsConstraint()) passConstraints = false;
      if (!tagsConstraint()) passConstraints = false;

      if (passConstraints) {
        setAllData({
          article: useArticleState ? { folderPath: articleFolderPath, templatePath: articleTemplatePath } : null,
          authors: authors,
          diary: useDiaryState ? { folderPath: diaryFolderPath, templatePath: diaryTemplatePath } : null,
          tags: tags
        });
      }
      setOKButtonEnable(passConstraints);
      setApplyButtonEnable(passConstraints);
    },[
      useDiaryState,
      useArticleState,
      diaryFolderPath,
      articleFolderPath,
      diaryTemplatePath,
      articleTemplatePath,
      tags,
      authors
    ]);

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
    return checkFolderExistApi(state.projectPath+path);
  }
  const articlePathConstraint = (path: string) => {
    return checkFolderExistApi(state.projectPath+path);
  }
  const diaryTemplateConstraint = (path: string) => {
    if (!isMarkdownFile(path)) return false;
    return checkFileExistApi(state.projectPath+path);
  }
  const articleTemplateConstraint = (path: string) => {
    if (!isMarkdownFile(path)) return false;
    return checkFileExistApi(state.projectPath+path);
  }

  const tagsConstraint = () => {
    return tags.length > 0;
  }

  const authorsConstraint = () => {
    return authors.length > 0;
  }

  return (
    <div id='settings'>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography>⚙️ {projectName} Settings</Typography>
        </Grid>
        <Grid item>
          <Typography variant="caption">
            place: {state.projectPath}/.hugo-text-writer/config.json
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
                defaultValue={diaryFolderPath}
                onValueChanged={(v) => {setDiaryFolderPath(v);}}
                constraint={diaryPathConstraint}
                errorString={"Folder Not Found"}
                label={"Diary Path(ProjectRelative)"}
                folderIconPushed={async () => {
                  const path = await openDiaryFolder(state.projectPath);
                  return path.replace(state.projectPath,'');
                }}
                disabled={!useDiaryState} />
              <Grid container>
                <FilePathInputField
                  defaultValue={diaryTemplatePath}
                  onValueChanged={(v) => {setDiaryTemplatePath(v);}}
                  constraint={diaryTemplateConstraint}
                  errorString={"File Not Found or Bad Extension (.md only)"}
                  label={"Diary Template(ProjectRelative)"}
                  folderIconPushed={async () => {
                    const path = await openDiaryTemplateFile(state.projectPath);
                    return path.replace(state.projectPath,'');
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
                  defaultValue={articleFolderPath}
                  onValueChanged={(v) => {setArticleFolderPath(v);}}
                  constraint={articlePathConstraint}
                  errorString={"Folder Not Found"}
                  label={"Article Path(ProjectRelative)"}
                  folderIconPushed={async () => {
                    const path = await openArticleFolder(state.projectPath);
                    return path.replace(state.projectPath,'');
                  }}
                  disabled={!useArticleState} />
              </Grid>
              <Grid container>
                <FilePathInputField
                  defaultValue={articleTemplatePath}
                  onValueChanged={(v) => {setArticleTemplatePath(v);}}
                  constraint={articleTemplateConstraint}
                  errorString={"File Not Found or Bad Extension (.md only)"}
                  label={"Article Template(ProjectRelative)"}
                  folderIconPushed={async () => {
                    const path = await openArticleTemplateFile(state.projectPath);
                    return path.replace(state.projectPath,'');
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
              <TextField
                         label="Add New Tag"
                         variant="standard"
                         value={tagField}
                         onChange={(ev) => setTagField(ev.target.value)}
                         id="standard-error-helper-text"
                         error={tags.length == 0}
                         helperText="tags can not empty"
              />
              <Button variant="contained"
                      onClick={() => {
                        const v = [...tags];
                        v.push(tagField);
                        setTags(v);
                      }}
              >Add</Button>
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
              <TextField label="Add Author Tag"
                         variant="standard"
                         value={authorField}
                         onChange={(ev) => setAuthorField(ev.target.value)}
                         id="standard-error-helper-text"
                         error={authors.length == 0}
                         helperText="authors can not empty"

              />
              <Button variant="contained"
                      onClick={() => {
                        const v = [...authors];
                        v.push(authorField);
                        setAuthors(v);
                      }}
              >Add</Button>
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
      <Bottom  OnCancelClicked={() => console.log('')}
               OnApplyClicked={() => {
                 projectConfigStore.store = allData;
               }}
               OnOKClicked={() => {
                 projectConfigStore.store = allData;
                 console.log(projectConfigStore.store);
               }}
               applyButtonEnable={applyButtonEnable}
               okButtonEnable={okButtonEnable}
      />
    </div>
  )
}