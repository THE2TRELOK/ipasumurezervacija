import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../index.css";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function Apartamenti() {
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersRef = collection(db, "Houses");
        const q = query(offersRef, where("Status", "==", "Apstiprināts"));
        const querySnapshot = await getDocs(q);
        const offersData = [];
        querySnapshot.forEach((doc) => {
          offersData.push({ id: doc.id, ...doc.data() });
        });
        setOffers(offersData);
        console.log("Fetched offers:", offersData); // Debugging line
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOffers = offers.slice(startIndex, endIndex);

  return (
    <>
      <Header />
      <div style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}
        >
          Visi piedavajumi
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {currentOffers.map((offer, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link
                to={`/offer/${offer.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  style={{
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <CardActionArea>
                    <img
                      src={offer.Images[0]}
                      alt={offer.Name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        style={{ color: "#333" }}
                      >
                        {offer.Name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Pilseta: {offer.City}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Cena: {offer.Price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Ietilpiba: {offer.PeopleCount} cilveki
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(offers.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </div>
      <Footer />
    </>
  );
}
