import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapSelector from './MapSelector';

export default function Lokacija({ handleAprakstsChange, aprakstsData }) {
  const { Apraksts, nummurs } = aprakstsData;
  const [description, setDescription] = useState(Apraksts);
  const [people, setPeople] = useState(nummurs);
  const [location, setLocation] = useState(null);



  return (
    <Stack spacing={2}>
      <Typography variant="h6">Īsi aprakstiet savu māju</Typography>
    <MapSelector/>
    
    </Stack>
  );
}
