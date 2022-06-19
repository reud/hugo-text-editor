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

class GenreInterface {
}

interface CanSettingConfig {
  diary: Partial<GenreInterface> | null;
  article: Partial<GenreInterface> | null;
  tags: string[];
  authors: string[];
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
  const initialProjectConfig = api
                              .openProjectConfigFile(state.projectPath) as ProjectConfigInterface;

  const update = (config: CanSettingConfig) => {
    if (config.article) {
      const nowArticle = api.storeGet(state.projectPath,'article');
      const update = config.article
      const updated = {...nowArticle,...update};
      api.storeSet(state.projectPath,{article: updated});
    } else api.storeSet(state.projectPath,{article: null});

    if (config.diary) {
      const nowDiary = api.storeGet(state.projectPath,'diary');
      const update = config.diary
      const updated = {...nowDiary,...update};
      api.storeSet(state.projectPath,{diary: updated});
    } else api.storeSet(state.projectPath,{diary: null});

    api.storeSet(state.projectPath,{tags});
    api.storeSet(state.projectPath,{authors});

  }

  const nav = useNavigate();

  const projectName = state.projectPath.split('/')[state.projectPath.split('/').length - 1];

  const [useDiaryState,setUseDiaryState] = React.useState(!!initialProjectConfig.diary);
  const [useArticleState, setUseArticleState] = React.useState(!!initialProjectConfig.article);
  const [diaryFolderPath, setDiaryFolderPath] = React.useState(initialProjectConfig.diary?.folderPath || '');
  const [articleFolderPath, setArticleFolderPath] = React.useState(initialProjectConfig.article?.folderPath || '');

  const [okButtonEnable, setOKButtonEnable] = React.useState(false);
  const [applyButtonEnable,setApplyButtonEnable] = React.useState(false);

  const [authors, setAuthors] = React.useState(initialProjectConfig.authors);
  const [tags, setTags] = React.useState(initialProjectConfig.tags);

  const [tagField,setTagField] = React.useState("");
  const [authorField,setAuthorField] = React.useState("");

  const [data,setData] = React.useState<CanSettingConfig>(initialProjectConfig);

  useEffect(
    () => {
      let passConstraints = true;
      if (useDiaryState) {

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

      }
      if(!authorsConstraint()) passConstraints = false;
      if (!tagsConstraint()) passConstraints = false;

      if (passConstraints) {
        setData({
          article: useArticleState ? { folderPath: articleFolderPath } : null,
          authors: authors,
          diary: useDiaryState ? { folderPath: diaryFolderPath } : null,
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
      tags,
      authors
    ]);

  const checkFolderExistApi:(path: string)=>boolean = api
    .checkFolderExist;
  const checkFileExistApi:(path: string)=>boolean = api
    .checkFileExist;


  const openDiaryFolder = (defaultPath: string) => {
    return api.getIpcRenderer().invoke('openDiaryFolder',defaultPath)
  };

  const openArticleFolder = (defaultPath: string) => {
    return api.getIpcRenderer().invoke('openArticleFolder',defaultPath)
  };

  const openDiaryTemplateFile = (defaultPath: string) => {
    return api.getIpcRenderer().invoke('openDiaryTemplateFile',defaultPath)
  };

  const openArticleTemplateFile = (defaultPath: string) => {
    return api.getIpcRenderer().invoke('openArticleTemplateFile',defaultPath)
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
    return checkFolderExistApi(state.projectPath+'/'+path);
  }
  const articlePathConstraint = (path: string) => {
    return checkFolderExistApi(state.projectPath+'/'+path);
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
      <Bottom  OnCancelClicked={() => {nav('/home',{state: {projectPath: state.projectPath}})}}
               OnApplyClicked={() => {
                 update(data);
               }}
               OnOKClicked={() => {
                 update(data);
                 console.log(data);
                 nav('/home',{state: {projectPath: state.projectPath}})
               }}
               applyButtonEnable={applyButtonEnable}
               okButtonEnable={okButtonEnable}
      />
    </div>
  )
}