import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { WritingData } from '@src/structure';
import { hot } from 'react-hot-loader';
import { LeftDrawer } from '@renderer/pages/edit/atoms/LeftDrawer';
import { Button, FormControl, FormGroup, Input, InputAdornment, InputLabel, List } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SimpleMdeReact from 'react-simplemde-editor';

import "../../../../node_modules/easymde/dist/easymde.min.css";


const Edit: React.FC = () => {
  const location = useLocation();
  const state = location.state as WritingData;
  const [shellInputState,setShellInputState] = useState("");
  const [shellOutState,setShellOutState] = useState("");
  const [sharedState,setSharedState] = useState<WritingData>(state);
  // 何故かsharedStateだと上手くいかないのでタイトル部分だけ外に出す。
  const [titleState,setTitleState] = useState<string>(state.title);
  const [saveLoadingState,setSaveLoadingState] = useState<boolean>(false);

  const handleContentChange =(v: string) => {
    const s = sharedState;
    s.templateStr = v;
    setSharedState(s);
  };

  const handleArticleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleState(event.target.value);
    const s = sharedState;
    s.title = event.target.value;
    setSharedState(s);
  };
  const handleShellInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShellInputState(event.target.value);
  };


  const {contentBasePath} = (window as any).editor.fetchCommonSettings();

  const saveWork = () => {
    setSaveLoadingState(true);
    const fileGenerator = (window as any).editor.newFileGenerator(state.isContinue,state.path+state.folderName,'');
    const work = () => {
      return new Promise((resolve,reject) => {
        // front matter作成
        const frontMatter = {
          title: sharedState.title,
          date: sharedState.datetime,
          author: sharedState.author,
          categories: sharedState.category,
          libraries: ['mathjax'],
          draft: sharedState.draft,
        };
        // front matterが付いたmdを作成
        const merged = (window as any).editor.frontMatterMerge(frontMatter,sharedState.templateStr);
        console.log(merged);
        // 保存
        fileGenerator.save(merged);
        resolve(true);
      });
    }
    work().then(() => {
      setSaveLoadingState(false);
    })
  }

  useEffect(() => {
    const shellOutEl = document.getElementById('outlined-multiline-static');
    shellOutEl.scrollTop = shellOutEl.scrollHeight;
  },[shellOutState])

  useEffect(() => {
    const p = `${contentBasePath}${state.path}${state.folderName}/index.md`;
    (window as any).editor.pushRecentlyData(p);
    (window as any).editor.storeSet('workingAbsoluteDirectory',`${contentBasePath}${state.path}${state.folderName}/`);
    saveWork();
    const ss = sharedState;
    ss.isContinue = true;
    setSharedState(ss);
  },[])

  const easymdeOptions = useMemo(() => {
    return {
      uploadImage: true,
      imageMaxSize: 1024 * 1024 * 10,
      imageUploadEndpoint: 'http://localhost:12348/upload',
      imagePathAbsolute: true,
      spellChecker: false,
      renderingConfig: {
        markedOptions: {
          baseUrl: `file://${contentBasePath + state.path + state.folderName}/`
        }
      }
    };
  },[]);

  return (
    <div id="edit">
      <List disablePadding>
        <FormGroup>
          <LeftDrawer {...{sharedState,setSharedState}}/>
          <Box pt={3}>
            <TextField fullWidth label={'記事タイトル'}  value={titleState} onChange={handleArticleTitleChange}/>
          </Box>
          <SimpleMdeReact options={easymdeOptions} value={sharedState.templateStr} onChange={handleContentChange} />
          <Button fullWidth variant="contained" color='primary' disabled={saveLoadingState} onClick={saveWork}>Save</Button>
          <Box p={3}>
            <TextField
              id="outlined-multiline-static"
              label="shellOutput"
              multiline
              rows={12}
              disabled={true}
              fullWidth
              value={shellOutState}
              inputProps={{style: {fontSize: 12}}}
            />
          </Box>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <InputLabel htmlFor="standard-adornment-amount">Shell</InputLabel>
            <Input
              id="standard-adornment-amount"
              value={shellInputState}
              onChange={handleShellInputChange}
              onKeyUp={(e) => {
                if (e.key == 'Enter') {
                  const output = (window as any).editor.exec(shellInputState,state.path+ state.folderName);
                  setShellOutState(shellOutState+ `ｷﾀ━(ﾟ∀ﾟ)━! > ${shellInputState}\n` + `${output}\n`);
                  setShellInputState("");
                }
              }}
              startAdornment={<InputAdornment position="start">{'ｷﾀ━(ﾟ∀ﾟ)━! >'}</InputAdornment>}
            />
            <p>
              {JSON.stringify(sharedState)}
            </p>
          </FormControl>
        </FormGroup>
      </List>
    </div>
  )
}

export default hot(module)(Edit);