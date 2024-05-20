import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Modal,
  Fade,
  Button,
} from "@mui/material";
import { Carousel, Image } from "antd";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Header from "./Header/Header";
import "../index.css";

export default function Apartamenti() {
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      const offersRef = collection(db, "Houses");
      const q = query(offersRef, where("Status", "==", "Aizsutits"));
      const querySnapshot = await getDocs(q);
      const offersData = [];
      querySnapshot.forEach((doc) => {
        offersData.push({ id: doc.id, ...doc.data() });
      });
      setOffers(offersData);
    };

    fetchOffers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenModal = (offer) => {
    setSelectedOffer(offer);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = offers.slice(startIndex, endIndex);

  return (
    <div style={{ backgroundColor: "rgba(49, 49, 54, 0.993)", padding: "20px" }}>
      <Header />
      <Box p={4}>
        <Typography variant="h4" gutterBottom style={{ color: "#d4af37" }}>
          Visi piedāvājumi
        </Typography>
        <Grid container spacing={3}>
          {currentOffers.map((offer, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card style={{ backgroundColor: "#d4af37", height: "100%" }}>
                <CardActionArea onClick={() => handleOpenModal(offer)}>
                  <Carousel autoplay>
                    {offer.Images.map((image, index) => (
                      <div key={index}>
                        <Image src={image} alt={`Image ${index}`} style={{ width: "100%" }} />
                      </div>
                    ))}
                  </Carousel>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {offer.Name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {offer.Description.length > 100
                        ? offer.Description.substring(0, 100) + "..."
                        : offer.Description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(offers.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            shape="rounded"
            style={{ color: "#d4af37" }}
          />
        </Box>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
         
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "white",
                boxShadow: 24,
                p: 4,
                maxHeight: "80%",
                overflowY: "auto",
                borderRadius: "8px",
                maxWidth: "90vw",
                width: "fit-content",
              }}
            >
              <Typography variant="h5" gutterBottom style={{ color: "#d4af37" }}>
                {selectedOffer?.Name}
              </Typography>
              <Carousel autoplay prevArrow={<Button>←</Button>} nextArrow={<Button>→</Button>}>
                {selectedOffer?.Images.map((image, index) => (
                  <div key={index}>
                    <Image src={image} alt={`Image ${index}`} style={{ width: "100%" }} />
                  </div>
                ))}
              </Carousel>
              <Typography gutterBottom>
                <strong>Apraksts:</strong> {selectedOffer?.Description}
              </Typography>
              <Typography gutterBottom>
                <strong>Ietilpība:</strong> {selectedOffer?.PeopleCount}
              </Typography>
              <Typography gutterBottom>
                <strong>Ertibas:</strong> {selectedOffer?.Amenities.join(", ")}
              </Typography>
              <Box display="flex" justifyContent="center">
                <Button variant="contained" onClick={handleCloseModal}>
                  Aizvērt
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </div>
  );
}
