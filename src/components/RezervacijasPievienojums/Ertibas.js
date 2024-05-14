import * as React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaptopIcon from '@mui/icons-material/Laptop';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TvIcon from '@mui/icons-material/Tv';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import KitchenIcon from '@mui/icons-material/Kitchen';
import Box from '@mui/material/Box';
import CabinIcon from '@mui/icons-material/Cabin';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import BedIcon from '@mui/icons-material/Bed';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BathtubIcon from '@mui/icons-material/Bathtub';
import ShowerIcon from '@mui/icons-material/Shower';
import FireplaceIcon from '@mui/icons-material/Fireplace';
const amenitiesList = [
  { value: 'wifi', label: 'Wi-Fi', icon: <WifiIcon /> },
  { value: 'tv', label: 'Televizors', icon: <TvIcon /> },
  { value: 'Bed', label: 'Gulta', icon: <BedIcon /> },
  { value: 'laptop', label: 'Portatīvais dators', icon: <LaptopIcon /> },
  { value: 'ac', label: 'Gaisa kondicionieris', icon: <AcUnitIcon /> },
  { value: 'parking', label: 'Autostāvvieta', icon: <LocalParkingIcon /> },
  { value: 'pool', label: 'Baseins', icon: <PoolIcon /> },
  { value: 'kitchen', label: 'Virtuve', icon: <KitchenIcon /> },
  { value: 'camera', label: 'Kamera', icon: <VideocamIcon /> },
  { value: 'laundry', label: 'Veļas mazgātava', icon: <LocalLaundryServiceIcon /> },
  { value: 'Grill', label: 'Grils', icon: <OutdoorGrillIcon /> },
  { value: 'Sport', label: 'Sporta inventārs', icon: <FitnessCenterIcon /> },
  { value: 'sauna', label: 'Pirts', icon: <BathtubIcon /> },
  { value: 'shower', label: 'Duša', icon: <ShowerIcon /> },
  { value: 'kamins', label: 'Kamins', icon: <FireplaceIcon /> },
];

export default function Ertibas() {
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);

  const handleAmenitiesChange = (event, newAmenities) => {
    setSelectedAmenities(newAmenities);
  };

  return (
    <Grid container spacing={1}>
      {amenitiesList.map((amenity) => (
        <Grid item xs={4} key={amenity.value}>
          <ToggleButtonGroup
            value={selectedAmenities}
            onChange={handleAmenitiesChange}
            aria-label="amenities"
            sx={{ justifyContent: 'center' }}
          >
            <ToggleButton value={amenity.value} aria-label={amenity.label} sx={{ width: '200px',height:'120px', flexDirection: 'column', gap: 1 }}>
              <Box>
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
