import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DateTimePicker from '@mui/lab/DateTimePicker';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
// NOTE: なぜかeslintが見つけてくれないけどちゃんと動く
// eslint-disable-next-line import/named
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

export const LeftDrawer: React.FC = () => {

  const [usingState, setUsingState] = React.useState(false);
  const [dateTimeState, setDateTimeState] = React.useState<Date | null>(null);
  const [draftState, setDraftState] = React.useState<boolean>(false);
  const [selectedAuthorState, setSelectedAuthorState] = React.useState<string>("");
  const [selectedCategoryState, setSelectedCategoryState] = React.useState<string>("");

  const handleDateTimeState = (newValue: Date | null) => {
    setDateTimeState(newValue);
  }
  const handleDraftState = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraftState(event.target.checked);
  };
  const handleSelectAuthorChange = (event: SelectChangeEvent) => {
    setSelectedAuthorState(event.target.value as string);
  };
  const handleSelectCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategoryState(event.target.value as string);
  };

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setUsingState(open);
      };

  const list = () => (
    <Box
      sx={ {width: 250,m: 3} }
      role="presentation"
    >
      <Typography variant={'h5'} align={'center'} pb={3}>
        HugoText-Writer
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <List disablePadding>
          <FormGroup>
            <DateTimePicker
              label="投稿日時"
              value={dateTimeState}
              onChange={handleDateTimeState}
              renderInput={(params) => <TextField {...params} />}
            />
            <FormControlLabel control={<Checkbox checked={draftState} onChange={handleDraftState} />} label="Draft" />
            <InputLabel id="author-label">Author</InputLabel>
            <Select
              labelId="author-label"
              value={selectedAuthorState}
              label="Author"
              onChange={handleSelectAuthorChange}
            >
              <MenuItem value={'reud'}>reud</MenuItem>
            </Select>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategoryState}
              label="category"
              onChange={handleSelectCategoryChange}
            >
              <MenuItem value={'diary'}>diary</MenuItem>
            </Select>
            <Box pt={3} width={250}>
              <TextField fullWidth label={'Folder Place'} disabled={true} value={'diary/99991231'}/>
            </Box>
            <Box pt={3}>
              <TextField fullWidth label={'Last Generated'} disabled={true} value={'2022-04-03T07:32:42+09:00'}/>
            </Box>
          </FormGroup>
        </List>
      </LocalizationProvider>
    </Box>
  );

  return (
    <div>
        <React.Fragment key="drawer">
          <Button onClick={toggleDrawer(true)}>INFO</Button>
          <Drawer
            anchor="left"
            open={usingState}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>
        </React.Fragment>
    </div>
  );
}