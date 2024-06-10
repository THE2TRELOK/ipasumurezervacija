// Importē nepieciešamos moduļus un komponentes no bibliotēkām
import React, { useState } from "react";
import { Result, message } from "antd";
import {
  CssBaseline,
  Box,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Stack,
  IconButton,
  Link,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddressForm from "./AddressForm";
import Ertibas from "./Ertibas";
import Apraksts from "./Apraksts";
import Bildes from "./Bildes";
import Lokacija from "./Lokacija";
import { collection, addDoc, GeoPoint } from "firebase/firestore";
import { db } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import StepIcon from "@mui/material/StepIcon";

// Definē soļus Stepper komponentei
const steps = ["Adreses dati", "Ērtības", "Apraksts", "Bildes", "Lokācija"];

// Funkcija, kas atgriež saturu atkarībā no pašreizējā soli
function getStepContent(
  step,
  handleFormChange,
  formData,
  handleAprakstsChange,
  aprakstsData,
  handleAmenitiesChange,
  selectedAmenities,
  handleImagesChange,
  handleLocationChange
) {
  switch (step) {
    case 0:
      return (
        <AddressForm handleFormChange={handleFormChange} formData={formData} />
      );
    case 1:
      return (
        <Ertibas
          onAmenitiesChange={handleAmenitiesChange}
          selectedAmenities={selectedAmenities}
        />
      );
    case 2:
      return (
        <Apraksts
          handleAprakstsChange={handleAprakstsChange}
          aprakstsData={aprakstsData}
        />
      );
    case 3:
      return <Bildes onImagesChange={handleImagesChange} />;
    case 4:
      return <Lokacija handleLocationChange={handleLocationChange} />;
    default:
      return (
        <Result
          status="404"
          title="404"
          subTitle="Atvainojiet, apmeklētā lapa neeksistē."
          extra={<Button type="primary">Atpakaļ uz sākumlapu</Button>}
        />
      );
  }
}

// Funkcija, kas augšupielādē attēlus uz krātuvi
const uploadImages = async (files) => {
  const storage = getStorage();
  const urls = await Promise.all(
    files.map(async (file) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      return downloadURL;
    })
  );
  return urls;
};

// Galvenā komponente
export default function Checkout() {
  // Valsts mainīgie
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState({
    bookName: "",
    address1: "",
    cena: "",
    address2: "",
    city: "",
    zip: "",
  });
  const [aprakstsData, setAprakstsData] = useState({
    Apraksts1: "",
    Nummurs: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [locationData, setLocationData] = useState(null);

  // Brīdinājuma funkcija
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Lūdzu, aizpildiet visus laukus!",
    });
  };
  
  // Funkcija, kas pievieno mājas datus Firestore
  const addresFetch = async () => {
    const auth = getAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : null;

    if (!uid) {
      console.error("Lietotājs nav autentificējies");
      return;
    }

    try {
      const uploadedImageUrls = await uploadImages(imageFiles);
      const houseData = {
        Name: formData.bookName,
        Address1: formData.address1,
        Address2: formData.address2,
        Price: formData.cena,
        City: formData.city,
        Zip: formData.zip,
        Status: "Aizsūtīts",
        Description: aprakstsData.Apraksts1,
        PeopleCount: aprakstsData.Nummurs,
        Amenities: selectedAmenities,
        Images: uploadedImageUrls,
        Location: locationData,
        createdAt: new Date(),
        updatedAt: new Date(),
        Owner: uid,
      };

      const userDocRef = collection(db, "Mājas");
      await addDoc(userDocRef, houseData);

      console.log("Dati veiksmīgi nosūtīti uz Firestore!");
      setActiveStep(steps.length);
    } catch (error) {
      console.error("Kļūda sūtot datus uz Firestore:", error);
      throw error;
    }
  };

  // Funkcija, kas apstrādā apraksta datu izmaiņas
  const handleAprakstsChange = (name, value) => {
    setAprakstsData({
      ...aprakstsData,
      [name]: value,
    });
  };

  // Funkcija, kas apstrādā formas datu izmaiņas
  const handleFormChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funkcija, kas apstrādā izmaiņas ērtībās
  const handleAmenitiesChange = (newAmenities) => {
    setSelectedAmenities(newAmenities);
  };

  // Funkcija, kas apstrādā izmaiņas attēlos
  const handleImagesChange = (files) => {
    setImageFiles(files);
  };

  // Funkcija, kas apstrādā izmaiņas lokācijā
  const handleLocationChange = (location) => {
    const { lat, lng } = location;
    const geoPoint = new GeoPoint(lat, lng);
    setLocationData(geoPoint);
  };

  // Funkcija, kas validē soli
  const validateStep = (step) => {
    switch (step) {
      case 0:
        return validateAddressForm();
      case 1:
        return validateErtibas();
      case 2:
        return validateApraksts();
      case 3:
        return validateImages();
      case 4:
        return validateLocation();
      default:
        return true;
    }
  };

  // Funkcija, kas validē adreses formu
  const validateAddressForm = () => {
    const { bookName, address1, address2, city, zip, cena } = formData;
    return bookName && address1 && address2 && city && zip && cena;
  };

  // Funkcija, kas validē ērtības
  const validateErtibas = () => {
    return selectedAmenities.length > 0;
  };

  // Funkcija, kas validē aprakstu
  const validateApraksts = () => {
    const { Apraksts1, Nummurs } = aprakstsData;
    return Apraksts1 && Nummurs;
  };

  // Funkcija, kas validē attēlus
  const validateImages = () => {
    return imageFiles.length >= 3;
  };

  // Funkcija, kas validē lokāciju
  const validateLocation = () => {
    return locationData !== null;
  };

  // Funkcija, kas pāreja uz nākamo soli
  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        addresFetch();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      warning();
    }
  };

  // Funkcija, kas pāreja atpakaļ uz iepriekšējo soli
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <CssBaseline />
      {contextHolder}
      <Grid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url("https://images.pexels.com/photos/731082/pexels-photo-731082.jpeg?cs=srgb&dl=pexels-sebastians-731082.jpg&fm=jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        container
        sx={{ height: { xs: "100%", sm: "100dvh" } }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          lg={6}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            backgroundColor: "#fff",
            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Link
            href="/Profils"
            style={{ alignSelf: "start", marginBottom: "16px" }}
          >
            <IconButton>
              <ArrowBackRoundedIcon />
              Atgriezties profila
            </IconButton>
          </Link>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            style={{ marginBottom: "2rem" }}
          >
            <Stepper activeStep={activeStep} style={{ width: "100%" }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepIcon
                    style={{
                      backgroundColor: "#151f28", // Apļa krāsa
                      color: "#fff",
                    }}
                  >
                    {index + 1}
                  </StepIcon>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">🏠</Typography>
                <Typography variant="h5">Paldies!</Typography>
                <Typography variant="body" color="text.secondary">
                  Paldies, ka izmantojat mūsu pakalpojumus, jūsu piedāvājums ir
                  nosūtīts administratoram parbaudes nolūkiem, un drīz to varēs
                  redzēt arī citi lietotāji.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    width: "100%",
                    height: 40,
                    alignSelf: "start",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  component="a"
                  href="/profils"
                >
                  Atgriezties profilā
                </Button>
              </Stack>
            ) : (
              <Box style={{ marginTop: "2rem", width: "100%" }}>
                {getStepContent(
                  activeStep,
                  handleFormChange,
                  formData,
                  handleAprakstsChange,
                  aprakstsData,
                  handleAmenitiesChange,
                  selectedAmenities,
                  handleImagesChange,
                  handleLocationChange
                )}
              </Box>
            )}
            <Box
              display="flex"
              justifyContent="space-between"
              style={{ marginTop: "2rem", width: "100%" }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#151f28", color:"#fff" }}
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBackRoundedIcon />}
              >
                Atpakaļ
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: "#151f28" }}
                onClick={handleNext}
                endIcon={
                  activeStep === steps.length - 1 ? (
                    <ChevronRightRoundedIcon />
                  ) : (
                    <ChevronRightRoundedIcon />
                  )
                }
              >
                {activeStep === steps.length - 1 ? "Apstiprināt" : "Turpināt"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
