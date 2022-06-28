import React from 'react';
import { Divider, Grid, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { HomeState } from '@renderer/pages/home/Home';

interface ProjectCardInterface {
  projectName: string;
  projectPath: string;
}

export const ProjectCard: React.FC<ProjectCardInterface> = (props) => {

  return (
    <Link to="/home"
          state={{ projectPath: props.projectPath } as HomeState}
          style={{ textDecoration: 'none' }}
    >
      <Paper>
        <Grid container spacing={1}>
          <Grid item xs={2}>
              <Typography sx={{height:1}}
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          fontSize={24}
                          fontWeight={'bold'}
              >
                {props.projectName.slice(0,2).toUpperCase()}
              </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem style={{marginRight:"-1px"}} />
          <Grid item xs={10}>
              <h5>
                {props.projectName}
              </h5>
              <small>
                {props.projectPath}
              </small>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  )
}
