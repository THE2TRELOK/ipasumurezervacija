import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Calendarnbook from "./components/start/Calendarnbook";
import Footer from "./components/Footer/Footer";
import Review from "./components/start/Review";
import Apartamenti from "./components/Apartamenti";
import Popular from "./components/start/Popular";
import Main from "./components/start/Main";
import Profils from "./components/Profils";
import UserRegister from "./Admin/UserRegister.jsx";
import Login from "./components/Login/Login";
import Checkout from "./components/RezervacijasPievienojums/Checkout.jsx";
import { useEffect, useState } from "react";
import { auth, getUserRole } from "./firebase.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Result, Button } from "antd";
import { UserProvider, useUser } from "./components/UserContext";
function NotFound() {
  const navigateToHome = () => {
    window.location.href = "/";
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Atvainojiet, jūsu apmeklētā lapa neeksistē."
      extra={
        <Button type="primary" onClick={navigateToHome}>
          Atgriezties mājās
        </Button>
      }
    />
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(true);
      if (user) {
        getUserRole(user.uid).then((role) => {
          setUserRole(role);
          setIsLoading(false);
        });
      } else {
        setUserRole(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {" "}
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 24,
              }}
            />
          }
        />
      </div>
    );
  }

  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/header" element={<Header />} />
            <Route path="/calendarnbook" element={<Calendarnbook />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/review" element={<Review />} />
            <Route path="/apartamenti" element={<Apartamenti />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/profils"
              element={
                userRole === "Admin" || userRole === "User" ? (
                  <Profils />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/userregistry"
              element={
                userRole === "Admin" ? (
                  <UserRegister />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="*" element={<Navigate to="/not-found" />} />

            <Route path="/not-found" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
