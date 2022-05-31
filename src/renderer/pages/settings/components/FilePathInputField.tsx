import React, { useEffect, useState } from 'react';
import { Grid, IconButton, TextField } from '@mui/material';
import { Folder } from '@mui/icons-material';


interface FilePathInputFieldInterface {
  onValueChanged: (value: string)=>void;
  constraint: (value: string) => boolean; // if false, this field appears error
  errorString: string;
  label: string;
  folderIconPushed: ()=>Promise<string>;
  disabled: boolean;
  defaultValue: string;
}

export const FilePathInputField: React.FC<FilePathInputFieldInterface> = (props) => {

  const [currentValue,setCurrentValue] = useState(props.defaultValue);
  const [isError,setIsError] = useState(false);
  const [helperText, setHelperText] = useState("");

  useEffect(()=> {
    const constraintResult = props.constraint(currentValue);
    setIsError(!constraintResult);
    setHelperText(constraintResult ? "" : props.errorString);
    props.onValueChanged(currentValue);
  },[currentValue])

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value as string);
  };

  return (
    <div>
      <Grid container>
        <Grid item sx={{mt: 2,mr: 3}}>
          {props.label}:
        </Grid>
        <Grid item sx={{mt: 1,mr: 3,width: 400}}>
          <TextField
            error={(()=> {
              if (props.disabled) {
                return false;
              }
              return isError;
            })()}
            id="standard-error-helper-text"
            helperText={(()=> {
              if (props.disabled) {
                return "";
              }
              return helperText;
            })()}
            variant="standard"
            disabled={props.disabled}
            sx={{width:400}}
            onChange={handleValueChange}
            value={currentValue}
          />
        </Grid>
        <Grid item>
          <IconButton size="medium" onClick={async () => {
            const result = await props.folderIconPushed();
            console.log(result);
            setCurrentValue(result);
          }}>
            <Folder fontSize="large"/>
          </IconButton>
        </Grid>
      </Grid>
    </div>
  )
}