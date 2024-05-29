import React, { useState, useEffect } from "react";
import { message, Upload, Layout } from "antd";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
  Button,
  Divider,
  Grid,
  Container,
} from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { LikeOutlined } from "@ant-design/icons";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
        createdAt: userData.createdAt, // Include the existing createdAt value
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

  return (
    <ThemeProvider theme={theme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px" }}>
            <Grid container spacing={4}>
              <Grid item xs={8} md={3}>
                <Paper
                  elevation={8}
                  sx={{
                    position: "sticky",
                    top: "16px",
                    padding: "1rem",
                    textAlign: "center",
                    borderRadius: "1rem",
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
                    </Box>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} md={8}>
                <Container>
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
                      <Button
                        variant="contained"
                        sx={{ marginTop: "2rem" }}
                        onClick={() => setEditModalVisible(true)}
                      >
                        Rediģet
                      </Button>
                    </Box>
                  )}
                </Container>
              </Grid>
            </Grid>
          </Content>
        </Layout>
      </Layout>
      <Dialog
        open={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <DialogTitle>Rediģet datus</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Vards"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Uzvards"
            value={editedSurname}
            onChange={(e) => setEditedSurname(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Upload
              name="avatar"
              action=""
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  setEditedImage(reader.result);
                };
                return false;
              }}
            >
              <Button variant="contained" startIcon={<UploadFileIcon />}>
                Augšpieladet attelu
              </Button>
            </Upload>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
          <Button onClick={updateUserData} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Profils;
