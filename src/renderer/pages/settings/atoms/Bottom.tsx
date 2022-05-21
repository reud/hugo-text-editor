import React, { useEffect } from 'react';
import { Button, Paper } from '@mui/material';





export const Bottom: React.FC = () => {
  return (
    <Paper sx={{position: 'fixed', bottom: 0,left: 0,right: 0}} >
      <Button>
        Button A
      </Button>
      <Button>
        Button A
      </Button>
      <Button>
        Button A
      </Button>
    </Paper>
  )
}