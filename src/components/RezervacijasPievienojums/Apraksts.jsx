import * as React from 'react';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 

export default function Apraksts() {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Īsi aprakstiet savu māju</Typography>
      <TextField
        id="outlined-multiline-flexible"
        multiline
        maxRows={15}
        fullWidth
        variant="outlined"
        placeholder="Ievadiet aprakstu savai mājai..."
      />
      <Typography variant="h6">Cilvēku skaits, kas ērti jutīsies jūsu mājā  </Typography>
      <TextField
        id="outlined-number"
        type="number"
        fullWidth
        variant="outlined"
        placeholder="Ievadiet cilvēku skaitu."
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
    </Stack>
  );
}