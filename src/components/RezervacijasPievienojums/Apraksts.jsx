import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function Apraksts({ handleAprakstsChange, aprakstsData }) {
  const { Apraksts, nummurs } = aprakstsData;
  const [description, setDescription] = useState(Apraksts);
  const [people, setPeople] = useState(nummurs);

  const handleAprakstChange = (e) => {
    setDescription(e.target.value);
    handleAprakstsChange("Apraksts1", e.target.value);
  };

  const handleNummursChange = (e) => {
    setPeople(e.target.value);
    handleAprakstsChange("Nummurs", e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Stack    spacing={2}
  
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width:"800px"
  }} width="100%" maxWidth="800px">
        <Typography variant="h6" align="center">Īsi aprakstiet savu māju</Typography>
        <TextField
          id="outlined-multiline-flexible"
          multiline
          name="Apraksts1"
          maxRows={15}
          value={description}
          onChange={handleAprakstChange}
          fullWidth
          variant="outlined"
          placeholder="Ievadiet aprakstu savai mājai..."
        />
        <Typography variant="h6" align="center">Cilvēku skaits, kas ērti jutīsies jūsu mājā</Typography>
        <TextField
          id="outlined-number"
          type="number"
          name="Nummurs"
          value={people}
          onChange={handleNummursChange}
          fullWidth
          variant="outlined"
          placeholder="Ievadiet cilvēku skaitu."
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </Stack>
    </Box>
  );
}
