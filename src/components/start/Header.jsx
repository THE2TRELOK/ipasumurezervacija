import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { PasswordStrengthExample } from "../PasswordStrength/PasswordStrength";
import { useUser } from "../UserContext";

const Header = () => {
  const { setUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [namee, setNamee] = useState("");
  const [surname, setSurname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Устанавливаем состояние входа, если пользователь залогинен
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Устанавливаем состояние входа, если пользователь залогинен
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const handlePasswordChange = (password) => {
    console.log("Password changed:", password);
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered successfully:", userCredential.user);
      handleOk();
      setUser(userCredential.user.email);
      message.success("Registracija veiksmiga");

      const userDocRef = doc(db, "Users", userCredential.user.uid);
      await setDoc(userDocRef, {
        Vards: namee,
        Uzvards: surname,
        Epasts: email,
      });
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

      // Получаем данные из базы данных
      const userDocRef = doc(db, "Users", userCredential.user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      // Устанавливаем данные пользователя в контекст
      setUser({
        email: userCredential.user.email,
        namee: userDocSnapshot.data().Vards,
        surname: userDocSnapshot.data().Uzvards,
      });

      handleOk();
      setUser(userCredential.user.email);
      navigate("/Profils");
      message.success("Ielogosanas veiksmiga");
    } catch (error) {
      console.error("Error logging in: ", error);
      message.error("Login neizdevas");
    }
  };

  const handleApartamentiClick = () => {
    navigate("/Apartamenti");
  };

  const handleMainClick = () => {
    navigate("/");
  };

  const handleProfilsClick = () => {
    if (isLoggedIn) {
      navigate("/Profils");
    } else {
      navigate("/");
    }
  };

  return (
    <header>
      {contextHolder}
      <div className="header-container">
        <nav className="header-nav-bar">
          <div className="header-nav-logo">
            <a onClick={handleMainClick}>
              <img
                src="https://png.pngtree.com/png-clipart/20220131/original/pngtree-housing-logo-with-gold-line-house-png-image_7261238.png"
                alt="logo"
                id="logo"
              />
            </a>
          </div>
          <ul className="header-nav-lists">
            <li className="header-nav-list">
             

              <Button
                onClick={handleMainClick}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Sakums
              </Button>
              
            </li>
            <li className="header-nav-list"></li>
            {isLoggedIn && (
              <li className="header-nav-list">
                <Button
                onClick={handleProfilsClick}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Profils
              </Button>
              </li>
            )}
            <li className="header-nav-list">
              <Button
                onClick={handleApartamentiClick}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Apartamenti
              </Button>
            </li>
            
            <li className="header-nav-list">
              <Button
                onClick={showModal}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Registreties
              </Button>

              <Button
                onClick={showModal2}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Login
              </Button>
            </li>
          </ul>

          <Modal
            style={{ textAlign: "center" }}
            title="Registreties sistema"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="ielogoties"
            cancelText="atcelt"
            okButtonProps={{ style: { display: "none", lineHeight: "0" } }}
            cancelButtonProps={{
              style: {
                backgroundColor: "rgba(49, 49, 54, 0.993)",
                color: "white",
                padding: "10px",
                width: "80px",
                lineHeight: "0",
              },
            }}
          >
            {/* <PasswordStrengthExample onChange={handlePasswordChange} /> */}
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={handleRegister}
              onFinishFailed={console.error}
            >
              <Form.Item
                label="Epasts"
                name="email"
                rules={[
                  { required: true, message: "Ludzu ievadiet jusu epastu" },
                ]}
              >
                <Input onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Vards"
                name="namee"
                rules={[
                  { required: true, message: "Ludzu ievadiet savu vardu" },
                ]}
              >
                <Input onChange={(e) => setNamee(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Uzvards"
                name="surname"
                rules={[
                  { required: true, message: "Ludzu ievadiet savu uzvardu" },
                ]}
              >
                <Input onChange={(e) => setSurname(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Parole"
                name="password"
                rules={[
                  { required: true, message: "Ludzu ievadiet jusu paroli!" },
                ]}
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  padding: "3px",
                  width: "100px",
                }}
              >
                Register
              </Button>
            </Form>
          </Modal>

          <Modal
            style={{ textAlign: "center" }}
            title="Ielogoties sistema"
            open={isModalOpen2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            okText="Ielogoties"
            cancelText="Atcelt"
            okButtonProps={{ style: { display: "none", lineHeight: "0" } }}
            cancelButtonProps={{
              style: {
                backgroundColor: "rgba(49, 49, 54, 0.993)",
                color: "white",
                padding: "3px",
                width: "80px",
                lineHeight: "0",
              },
            }}
          >
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              onFinishFailed={console.error}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  padding: "3px",
                  width: "100px",
                }}
              >
                Login
              </Button>
            </Form>
          </Modal>
        </nav>
      </div>
    </header>
  );
};

export default Header;
