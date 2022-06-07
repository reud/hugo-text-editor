import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
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
      <div>
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <Paper sx={{height:1}}>
              <Typography sx={{height:1}}
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          fontSize={24}
                          fontWeight={'bold'}
              >
                {props.projectName.slice(0,2).toUpperCase()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={11}>
            <Paper>
              <h5>
                {props.projectName}
              </h5>
              <small>
                {props.projectPath}
              </small>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Link>
  )
}