import React, { useState, useEffect } from "react";
import { Button, Layout, Space, message } from "antd";
import { AgGridReact } from "ag-grid-react";
import { db, auth } from "../firebase";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Header from "../components/Header/Header";
import "../Admin/UserRegisterCSS.css";

import RegistrationModal from "../components/LeftSideNav/RegistrationModal";
import Navbar from "../components/LeftSideNav/Navbar";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  doc,
  setDoc,
  collection,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const { Content } = Layout;

const Profils = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
        } else {
          console.log("User data not found");
        }
      } else {
        console.log("User not logged in");
      }
    };
    fetchUserData();
  }, []);

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {userData && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      <Paper
                        elevation={3}
                        style={{ padding: 40, textAlign: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 20,
                          }}
                        >
                          <Avatar
                            alt={userData.Name}
                            src={userData.Image}
                            sx={{ width: 200, height: 200 }}
                          />
                          <Box>
                            <h2>{userData.Name}</h2>
                            <p>Epasts: {userData.Email}</p>
                            <p>Uzvards: {userData.Surname}</p>
                            <p>
                              Registracijas datums:{" "}
                              {userData.createdAt.toDate().toLocaleDateString()}
                            </p>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Space>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Profils;
