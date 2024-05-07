import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Tabs, message } from "antd";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import liepaja from "./Liepaja.jpg";
import { PasswordStrength } from "../PasswordStrength/PasswordStrength";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router";
import { Padding } from "@mui/icons-material";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/THE2TRELOK">
        IpasumuRezervacija
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [activeTab, setActiveTab] = useState("1");
  const [namee, setNamee] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword); 
  };

  const handleMainClick = () => {
    navigate("/");
  };

  const handleRegister = async () => {
    try {
      // Check if the user is already registered
      const userRef = doc(db, "Users", email);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        message.error("Šis e-pasts jau ir reģistrēts.");
        return;
      }
  
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered successfully:", userCredential.user);
  
      // Set the user's data in the database
      await setDoc(userRef, {
        Vards: namee,
        Uzvards: surname,
        Epasts: email,
      });
  
      const role = "user";
      await auth.currentUser.assignRole(role);

      setUser(userCredential.user.email);
      message.success("Registracija veiksmiga");
    } catch (error) {
      console.error("Error registering user: ", error.code, error.message);
      message.error("Registracija neizdevas");
    }
  };

 const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in successfully:", userCredential.user);

      const userDocRef = doc(db, "Users", userCredential.user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      setUser({
        email: userCredential.user.email,
        namee: userDocSnapshot.data().Vards,
        surname: userDocSnapshot.data().Uzvards,
      });

      // Начало сеанса браузера
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          // Сеанс браузера успешно начат.
          setUser(userCredential.user.email);
          navigate("/Profils");
          message.success("Pieslegsanas veiksmiga");
        })
        .catch((error) => {
          // Ошибка при начале сеанса браузера.
          console.error("Error setting persistence: ", error);
          message.error("Neizdevas Pieslegties");
        });
    } catch (error) {
      console.error("Error logging in: ", error);
      message.error("Neizdevas Pieslegties");
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const items = [
    {
      key: "1",
      label: "Pieslegties sistemai",
      children: "",
    },
    {
      key: "2",
      label: "",
      children: "",
    },
    {
      key: "3",
      label: "Registreties",
      children: "",
    },
  ];

  return (
    <ThemeProvider theme={defaultTheme}>
      {contextHolder}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${liepaja})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Button onClick={handleMainClick}>
            <ArrowBackIcon
              style={{ margin: "10px 10px", width: "100px", height: "50px" }}
            />
          </Button>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Tabs
              defaultActiveKey="1"
              items={items}
              onChange={handleTabChange}
            />
            <Box
              component="form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              sx={{ mt: 1, display: activeTab === "1" ? "block" : "none" }}
            >
              {/* Login Form */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Epasta Adrese"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Parole"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Atcereties mani"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Pieslegties
              </Button>
            </Box>
            <Box
              component="form"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
              sx={{
                width: 735,
                mt: 1,
                display: activeTab === "3" ? "block" : "none",
              }}
            >
              {/* Registration Form */}
              <TextField
                margin="normal"
                required
                fullWidth
                value={namee}
                onChange={(e) => setNamee(e.target.value)}
                label="Vards"
                name="namee"
                autoComplete="given-name"
                autoFocus={activeTab === "3"}
                sx={{ mb: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                label="Uzvards"
                name="surname"
                autoComplete="family-name"
                sx={{ mb: 1 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Epasta Adrese"
                name="email"
                autoComplete="email"
                sx={{ mb: 1 }}
              />
              <PasswordStrength
                margin="normal"
                required
                fullWidth
                name="password"
                label="Parole"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                sx={{ mb: 1 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registreties
              </Button>
            </Box>

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
