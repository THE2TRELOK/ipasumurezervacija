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
import OfferDetails from "./components/start/OfferDetails.jsx";
import { useEffect, useState } from "react";
import { auth, getUserRole } from "./firebase.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Result, Button } from "antd";
import { UserProvider, useUser } from "./components/UserContext";
import Manasrezervacijas from "./components/ManasRezervacijas/ManasRezervacijas.jsx";
import CheckoutForm from "./components/CheckoutForm.js";
import Bookingregister from "./Admin/BookingRegister.jsx";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Rezervacijas from "./components/Rezervacijas/Rezervacijas.jsx";
import Chat from "./components/Chat/Chat.jsx";

// Ваша публичная Stripe API ключ
const stripePromise = loadStripe("pk_test_51ObI6xHCqLwHfBqfls20T9gJk1iPhhEwTjPGWsD11bMCbawy3u7ot4nl14ghADC10xxJzr1iq7T7uRI339nG9cU700H9NU3Dic");

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
          <Elements stripe={stripePromise}> {/* Wrap Stripe routes here */}
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/calendarnbook" element={<Calendarnbook />} />
              <Route path="/review" element={<Review />} />
              <Route path="/apartamenti" element={<Apartamenti />} />
              <Route path="/popular" element={<Popular />} />
              <Route
                path="/bookingregister"
                element={
                  userRole === "Admin" ? (
                    <Bookingregister />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
                 <Route
                path="/manasrezervacijas"
                element={
                  userRole === "User" || userRole === "Admin" ? (
                    <Manasrezervacijas />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/Rezervacijas"
                element={
                  userRole === "User" || userRole === "Admin" ? (
                    <Rezervacijas />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
               <Route
                path="/checkoutform"
                element={
                  userRole === "User" || userRole === "Admin" ? (
                    <CheckoutForm />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
               <Route
                path="/chat"
                element={
                  userRole === "User" || userRole === "Admin" ? (
                    <Chat />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/checkout"
                element={
                  userRole === "User" || userRole === "Admin" ? (
                    <Checkout />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
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
              <Route path="/offer/:id" element={<OfferDetails />} /> {/* Новый маршрут */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Elements>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;