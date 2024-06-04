import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


export default function Apraksts({ handleAprakstsChange, aprakstsData }) {
  const { Apraksts, nummurs } = aprakstsData;
  const [description, setDescription] = useState(Apraksts);
  const [people, setPeople] = useState(nummurs);
  const [location, setLocation] = useState(null);

  const handleAprakstChange = (e) => {
    setDescription(e.target.value);
    handleAprakstsChange("Apraksts1", e.target.value);
  };
  
  const handleNummursChange = (e) => {
    setPeople(e.target.value);
    handleAprakstsChange("Nummurs", e.target.value);
  };

  const handleLocationSelect = (latlng) => {
    setLocation(latlng);
    handleAprakstsChange("Location", latlng);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Īsi aprakstiet savu māju</Typography>
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
      <Typography variant="h6">Cilvēku skaits, kas ērti jutīsies jūsu mājā</Typography>
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
  );
}
