import React, { useEffect } from 'react';
import { Button, Paper } from '@mui/material';


interface BottomInterface {
  OnCancelClicked: () => void;
  OnApplyClicked: () => void;
  OnOKClicked: () => void;
  applyButtonEnable: boolean;
  okButtonEnable: boolean;
}



export const Bottom: React.FC<BottomInterface> = (props) => {
  return (
    <Paper sx={{position: 'fixed', bottom: 10,right: 20}} >
      <Button variant="outlined" sx = {{m:1}} onClick={props.OnCancelClicked}>
        Cancel
      </Button>
      <Button variant="outlined" sx = {{m:1}} disabled={!props.applyButtonEnable}
              onClick={props.OnApplyClicked}>
        Apply
      </Button>
      <Button variant="contained" sx = {{m:1}} onClick={props.OnOKClicked}
              disabled={!props.okButtonEnable}>
        OK
      </Button>
    </Paper>
  )
}