import React, { useState, useEffect } from "react";
import { message, Upload, Layout, Button as AntButton } from "antd";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import Navbar from "../components/LeftSideNav/Navbar";
import {
  Box,
  Paper,
  Typography,
  Avatar as MuiAvatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  Grid,
  Container,
  Button,
  Link
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { LikeOutlined } from "@ant-design/icons";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import CheckoutForm from "./CheckoutForm"; // Import CheckoutForm

const { Content } = Layout;

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "url('https://img.freepik.com/free-vector/gray-abstract-wireframe-background_53876-99911.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});

const Profils = () => {
  const [userData, setUserData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSurname, setEditedSurname] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
          setEditedName(userDocSnapshot.data().Name);
          setEditedSurname(userDocSnapshot.data().Surname);
          setEditedImage(userDocSnapshot.data().Image);
        } else {
          console.log("User data not found");
        }
      } else {
        console.log("User not logged in");
      }
    };
    fetchUserData();
  }, []);

  const updateUserData = async () => {
    try {
      let userDataToUpdate = {
        Name: editedName,
        Surname: editedSurname,
        createdAt: userData.createdAt, 
      };

      // Check if editedImage exists and is a data URL
      if (editedImage && editedImage.startsWith("data:image")) {
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadString(imageRef, editedImage, "data_url");
        const imageUrl = await getDownloadURL(imageRef);

        // If image is present and valid, include it in the data to update
        userDataToUpdate = {
          ...userDataToUpdate,
          Image: imageUrl,
        };
      }

      // Update user data
      await setDoc(doc(db, "Users", auth.currentUser.uid), userDataToUpdate, {
        merge: true,
      });

      // Update state immediately
      setUserData(userDataToUpdate);

      message.success("Dati veiksmigi atjaunoti");
      setEditModalVisible(false);
    } catch (error) {
      message.error("Kluda atjaunojot datus");
      console.error(error);
    }
  };

  const handlePayment = async () => {
    try {
      // Navigate to the fake payment page
      navigate('/CheckoutForm', { state: { amount: paymentAmount, userData: userData } }); 
    } catch (error) {
      message.error("Kluda maksājuma apstrādes laikā");
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Paper
                  elevation={8}
                  sx={{
                    position: "sticky",
                    top: "16px",
                    padding: "1rem",
                    textAlign: "center",
                    borderRadius: "1rem",
                    backgroundColor: "#f0f2f5",
                  }}
                >
                  {userData && (
                    <Box>
                      <MuiAvatar
                        alt={userData.Name}
                        src={editedImage || userData.Image}
                        sx={{ width: 80, height: 80, margin: "0 auto" }}
                      />
                      <Typography variant="h6" sx={{ marginTop: "1rem" }}>
                        {userData.Name}
                      </Typography>
                      <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
                        <LikeOutlined style={{ verticalAlign: "middle" }} /> 200 Atsauksmes
                      </Typography>
                      <Divider sx={{ marginY: "1rem" }} />
                      <Typography variant="body2" color="textSecondary">
                        Registracijas datums:{" "}
                        {userData.createdAt
                          ? userData.createdAt.toDate().toLocaleDateString()
                          : "Unknown"}
                      </Typography>
                      <Divider sx={{ marginY: "1rem" }} />
                      <Typography variant="h6" gutterBottom>
                        Jūsu konta:
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {userData.balance} EUR
                      </Typography>
                      <Box sx={{ marginTop: "2rem" }}>
                        <Typography variant="h6" gutterBottom>
                          Veikt maksājumu
                        </Typography>
                        <TextField
                          label="Ievadiet summu"
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          fullWidth
                          margin="normal"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handlePayment}
                        >
                          Turpināt
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={8}
                  sx={{
                    padding: "1rem",
                    textAlign: "left",
                    borderRadius: "1rem",
                    backgroundColor: "#fff",
                  }}
                >
                  {userData && (
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Jūsu informācija
                      </Typography>
                      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                        Vards: {userData.Name}
                      </Typography>
                      <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                        Uzvards: {userData.Surname}
                      </Typography>
                      <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                        Epasts: {userData.Email}
                      </Typography>
                      <Divider sx={{ marginY: "1.5rem" }} />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditModalVisible(true)}
                      >
                        Rediget
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Content>
        </Layout>
      </Layout>

      <Dialog open={editModalVisible} onClose={() => setEditModalVisible(false)}>
        <DialogTitle>Rediget profilu</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vards"
            type="text"
            fullWidth
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Uzvards"
            type="text"
            fullWidth
            value={editedSurname}
            onChange={(e) => setEditedSurname(e.target.value)}
          />
          <Upload
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                setEditedImage(e.target.result);
              };
              reader.readAsDataURL(file);
              return false; // Prevent upload
            }}
            showUploadList={false}
          >
            <Button variant="outlined" component="span" startIcon={<UploadFileIcon />}>
              Augšuplādēt jaunu attēlu
            </Button>
          </Upload>
          {editedImage && (
            <MuiAvatar alt="Preview" src={editedImage} sx={{ width: 80, height: 80, marginTop: '1rem' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalVisible(false)} color="primary">
            Atcelt
          </Button>
          <Button onClick={updateUserData} color="primary">
            Saglabat
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Profils;