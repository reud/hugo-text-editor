import Drawer from '@mui/material/Drawer';
import React from 'react';
import { Box, Button, Grid, IconButton, styled, Typography } from '@mui/material';
import { pickRandomEmoji } from '@src/util';
import packageJson from './../../../../package.json';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, useNavigate } from 'react-router-dom';
import { HomeState } from '@renderer/pages/home/Home';

const BottomButton = styled(IconButton)({
  bottom: 1.0,
  left: 0,
  position: "absolute",
})


export const Top: React.FC = () => {
  const nav = useNavigate();

  const  openProject = async () => {
    const renderer = (window as any).home.getIpcRenderer();
    const path = await renderer.invoke('openProject');
    if (path === '') return;
    console.log('path',path);
    const state: HomeState = { projectPath: path };
    nav('/home',{
      state,
    })
  }


  return (
    <div>
      <React.Fragment key="drawer">
        <Drawer anchor="left" open={true} variant="permanent" PaperProps={{
          sx: {
            backgroundColor: "#FBFBFB"
          }
        }}>
          <Box sx={{
            width: 200,
            m: 3,
          }}>
            <Grid container columnSpacing={3} >
              <Grid item>
                <Box sx = {{ fontSize: 32 }}>
                  {pickRandomEmoji()}
                </Box>
              </Grid>
              <Grid item>
                <Typography sx = {{ fontWeight: 'bold'}}>
                  Hugo Text Writer
                </Typography>
                <Typography variant="caption">
                  version {packageJson.version}
                </Typography>
              </Grid>
            </Grid>
            <Link to="/settings">
              <Button sx={{mt: 5,width: 200}}
                      variant="outlined"
                      size="medium"
                      onClick={openProject}>
                Open
              </Button>
            </Link>
          </Box>
          <BottomButton size="medium">
            <SettingsIcon fontSize="medium"/>
          </BottomButton>
        </Drawer>
      </React.Fragment>

    </div>
  )
}