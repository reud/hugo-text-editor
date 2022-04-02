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
  const [articleTitleState,setArticleTitleState] = useState("");
  const [contentState,setContentState] = useState("");
  const [shellInputState,setShellInputState] = useState("");
  const [shellOutState,setShellOutState] = useState("");

  const handleContentChange = useCallback((v: string) => {
    setContentState(v);
  },[]);
  const handleArticleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArticleTitleState(event.target.value);
  };
  const handleShellInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShellInputState(event.target.value);
  };

  useEffect(() => {
    const shellOutEl = document.getElementById('outlined-multiline-static');
    shellOutEl.scrollTop = shellOutEl.scrollHeight;
  },[shellOutState])

  const easymdeOptions = useMemo(() => {
    return {
      uploadImage: true,
      imageMaxSize: 1024 * 1024 * 10,
      imageUploadEndpoint: 'http://localhost:12348/upload',
      imagePathAbsolute: true,
      spellChecker: false,
      renderingConfig: {
        markedOptions: {
          baseUrl: `file://hogehuga/`
        }
      }
    };
  },[]);

  console.log(state);
  return (
    <div id="edit">
      <List disablePadding>
        <FormGroup>
          <LeftDrawer />
          <Box pt={3}>
            <TextField fullWidth label={'記事タイトル'}  value={articleTitleState} onChange={handleArticleTitleChange}/>
          </Box>
          <SimpleMdeReact options={easymdeOptions} value={contentState} onChange={handleContentChange} />
          <Button fullWidth variant="contained" color='primary'>Save</Button>
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
          </FormControl>
        </FormGroup>
      </List>
    </div>
  )
}

export default hot(module)(Edit);