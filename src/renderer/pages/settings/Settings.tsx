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


// TODO: UIについて考える。
export const Settings: React.FC = () => {

  const [useDiaryState,setUseDiaryState] = React.useState(true);
  const mockProjectPath = "/Users/reud/Projects/prosaic-dustbox/"

  const checkFolderExistApi:(path: string)=>boolean = (window as any)
    .settings
    .checkFolderExist;
  const checkFileExistApi:(path: string)=>boolean = (window as any)
    .settings
    .checkFileExist;

  const isMarkdownFile = (path: string) => {
    const splitted = path.split('.');
    if (splitted.length < 1) return false;
    return splitted[splitted.length - 1] === "md";
  }

  const handleUseDiaryCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseDiaryState(event.target.checked);
  };

  const diaryPathConstraint = (path: string) => {
    return checkFolderExistApi(mockProjectPath+path);
  }
  const diaryTemplateConstraint = (path: string) => {
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
              <Checkbox defaultChecked  onChange={handleUseDiaryCheckBoxChange}/>
            }
                              label="UseForDiaryWriting" />
            <FormGroup>
              <FilePathInputField
                defaultValue="content/v2_post"
                onValueChanged={(v) => {console.log(v)}}
                constraint={diaryPathConstraint}
                errorString={"Folder Not Found"}
                label={"Diary Path(ProjectRelative)"}
                folderIconPushed={() => "hugahuga"}
                disabled={!useDiaryState} />
              <Grid container>
                <FilePathInputField
                  defaultValue="template/diary.md"
                  onValueChanged={(v) => {console.log(v)}}
                  constraint={diaryTemplateConstraint}
                  errorString={"File Not Found or Bad Extension (.md only)"}
                  label={"Diary Template(ProjectRelative)"}
                  folderIconPushed={() => "hugahuga"}
                  disabled={!useDiaryState} />
              </Grid>
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item>
          <Paper variant="outlined">
            <h3>📚Article</h3>
            <FormGroup>
              <FormControlLabel control={<Checkbox defaultChecked />} label="UseForArticleWriting" />
              <Grid container>
                <Grid item sx={{mt: 2,mr: 3}}>
                  Diary Path(ProjectRelative):
                </Grid>
                <Grid item sx={{mt: 1,mr: 3,width: 400}}>
                  <TextField
                    error
                    id="standard-error-helper-text"
                    defaultValue="hoge/huga/nyaa"
                    helperText="Folder Not Found."
                    variant="standard"
                    sx={{width:400}}
                  />
                </Grid>
                <Grid item>
                  <IconButton size="medium">
                    <Folder fontSize="large"/>
                  </IconButton>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item sx={{mt: 2,mr: 3}}>
                  Diary Template(ProjectRelative):
                </Grid>
                <Grid item sx={{mt: 1,mr: 3,width: 400}}>
                  <TextField
                    error
                    id="standard-error-helper-text"
                    defaultValue="hoge/huga/nyaa"
                    helperText="File Not Found (.md)"
                    variant="standard"
                    sx={{width:400}}
                  />
                </Grid>
                <Grid item>
                  <IconButton size="medium">
                    <Folder fontSize="large"/>
                  </IconButton>
                </Grid>
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
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }>
                tag1
              </ListItem>
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }>
                tag2
              </ListItem>
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }>
                tag3
              </ListItem>
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
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }>
                author1
              </ListItem>
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }>
                author2
              </ListItem>
              <ListItem secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }>
                author3
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Bottom />
    </div>
  )
}