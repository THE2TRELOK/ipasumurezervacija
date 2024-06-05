import * as React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaptopIcon from '@mui/icons-material/Laptop';
import TvIcon from '@mui/icons-material/Tv';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import KitchenIcon from '@mui/icons-material/Kitchen';
import Box from '@mui/material/Box';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import BedIcon from '@mui/icons-material/Bed';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ShowerIcon from '@mui/icons-material/Shower';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import SpeakerIcon from '@mui/icons-material/Speaker';
import { useState } from 'react';

const amenitiesList = [
  { value: 'wifi', label: 'Wi-Fi', icon: <WifiIcon /> },
  { value: 'Televizors', label: 'Televizors', icon: <TvIcon /> },
  { value: 'Gulta', label: 'Gulta', icon: <BedIcon /> },
  { value: 'Portatīvais_dators', label: 'Portatīvais dators', icon: <LaptopIcon /> },
  { value: 'kondicionieris', label: 'kondicionier', icon: <AcUnitIcon /> },
  { value: 'Autostāvvieta', label: 'Stāvvieta', icon: <LocalParkingIcon /> },
  { value: 'Baseins', label: 'Baseins', icon: <PoolIcon /> },
  { value: 'Virtuve', label: 'Virtuve', icon: <KitchenIcon /> },
  { value: 'Kamera', label: 'Kamera', icon: <VideocamIcon /> },
  { value: 'laundry', label: 'Veļas mazgātava', icon: <LocalLaundryServiceIcon /> },
  { value: 'Grils', label: 'Grils', icon: <OutdoorGrillIcon /> },
  { value: 'Sporta_inventārs', label: 'Sporta inventārs', icon: <FitnessCenterIcon /> },
  { value: 'sauna', label: 'Pirts', icon: <BathtubIcon /> },
  { value: 'Duša', label: 'Duša', icon: <ShowerIcon /> },
  { value: 'kamins', label: 'Kamins', icon: <FireplaceIcon /> },
  { value: 'Muzika', label: 'Muzika', icon: <SpeakerIcon /> },
];

export default function Ertibas({ onAmenitiesChange }) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleAmenitiesChange = (event, newAmenities) => {
    setSelectedAmenities(newAmenities);
    onAmenitiesChange(newAmenities); // 
  };

  return (
    <Grid container spacing={1}>
      {amenitiesList.map((amenity) => (
        <Grid item xs={3} key={amenity.value}>
          <ToggleButtonGroup
            value={selectedAmenities}
            onChange={handleAmenitiesChange}
            aria-label="amenities"
            sx={{ justifyContent: 'center' }}
          >
            <ToggleButton value={amenity.value} aria-label={amenity.label} sx={{ width: '160px',height:'105px', flexDirection: 'column', margin:"0",padding:5 }}>
              <Box marginTop={1}>
                {amenity.icon}
              </Box>
              <Box>
                {amenity.label}
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ))}
    </Grid>
  );
}
