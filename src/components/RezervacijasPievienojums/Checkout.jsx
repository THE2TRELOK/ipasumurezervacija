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
  Card,
  Typography,
  Stack,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddressForm from "./AddressForm";
import Ertibas from "./Ertibas";
import Apraksts from "./Apraksts";
import Bildes from "./Bildes";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const steps = ["Adreses dati", "Ērtibas", "Apraksts", "Bildes"];

function getStepContent(
  step,
  handleFormChange,
  formData,
  handleAprakstsChange,
  aprakstsData,
  handleAmenitiesChange,
  selectedAmenities,
  handleImagesChange
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
    default:
      return (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
      );
  }
}

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

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Ludzu aizpildiet visus laukus!",
    });
  };
  const [formData, setFormData] = useState({
    bookName: "",
    address1: "",
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

  const addresFetch = async () => {
    const auth = getAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : null;

    if (!uid) {
      console.error("User is not authenticated");
      return;
    }
    try {
      const uploadedImageUrls = await uploadImages(imageFiles);
      const houseData = {
        Name: formData.bookName,
        Address1: formData.address1,
        Address2: formData.address2,
        City: formData.city,
        Zip: formData.zip,
        Status: "Aizsutits",
        Description: aprakstsData.Apraksts1,
        PeopleCount: aprakstsData.Nummurs,
        Amenities: selectedAmenities,
        Images: uploadedImageUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
        Owner: uid,
      };

      const userDocRef = collection(db, "Houses");
      await addDoc(userDocRef, houseData);

      console.log("Data successfully sent to Firestore!");
      setActiveStep(steps.length);
    } catch (error) {
      console.error("Error sending data to Firestore:", error);
      throw error;
    }
  };

  const handleAprakstsChange = (name, value) => {
    setAprakstsData({
      ...aprakstsData,
      [name]: value,
    });
  };

  const handleFormChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAmenitiesChange = (newAmenities) => {
    setSelectedAmenities(newAmenities);
  };

  const handleImagesChange = (files) => {
    setImageFiles(files);
  };

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
      default:
        return true;
    }
  };

  const validateAddressForm = () => {
    const { bookName, address1, address2, city, zip } = formData;
    return bookName && address1 && address2 && city && zip;
  };

  const validateErtibas = () => {
    return selectedAmenities.length > 0;
  };

  const validateApraksts = () => {
    const { Apraksts1, Nummurs } = aprakstsData;
    return Apraksts1 && Nummurs;
  };

  const validateImages = () => {
    return imageFiles.length >= 3;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        addresFetch();
      } else {
        setActiveStep(activeStep + 1);
      }
    } else {
      warning();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      {contextHolder}
      <CssBaseline />
      <Grid container sx={{ height: { xs: "100%", sm: "100dvh" } }}>
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },

            alignItems: "start",
            pt: 4,
            px: 10,
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: 150,
            }}
          >
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              component="a"
              href="/profils"
              sx={{ ml: "-8px" }}
            >
              Atgriezties
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          ></Box>
        </Grid>
        <Grid
          item
          sm={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            ></Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexGrow: 1,
                height: 150,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{
                  width: "100%",
                  height: 40,
                }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-child": { pl: 0 },
                      ":last-child": { pr: 0 },
                    }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card
            sx={{
              display: { xs: "flex", md: "none" },
              width: "100%",
            }}
          ></Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">🏠</Typography>
                <Typography variant="h5">Paldies!</Typography>
                <Typography variant="body" color="text.secondary">
                  Paldies, ka izmantojat mūsu pakalpojumus, jūsu piedāvājums ir
                  nosūtīts administratoram parbaudes nolukiem, un drīz to varēs
                  redzēt arī citi lietotāji.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
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
              <React.Fragment>
                {getStepContent(
                  activeStep,
                  handleFormChange,
                  formData,
                  handleAprakstsChange,
                  aprakstsData,
                  handleAmenitiesChange,
                  selectedAmenities,
                  handleImagesChange
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                    alignItems: "end",
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: "60px",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                      }}
                    >
                      Atgriezties
                    </Button>
                  )}

                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{
                        display: { xs: "flex", sm: "none" },
                      }}
                    >
                      Atpakaļ
                    </Button>
                  )}
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={addresFetch}
                      sx={{
                        width: { xs: "100%", sm: "fit-content" },
                      }}
                    >
                      Apstiprināt
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      sx={{
                        width: { xs: "100%", sm: "fit-content" },
                      }}
                    >
                      Talāk
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
