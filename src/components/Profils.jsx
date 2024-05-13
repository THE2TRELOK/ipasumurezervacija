import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Space,
  message,
  Modal,
  Input,
  Upload,
  Avatar,
} from "antd";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import Navbar from "../components/LeftSideNav/Navbar";
const { Content } = Layout;
import { Box, Paper } from "@mui/material";
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
      if (editedImage) {
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadString(imageRef, editedImage, "data_url");
        const imageUrl = await getDownloadURL(imageRef);

        await setDoc(
          doc(db, "Users", auth.currentUser.uid),
          {
            Name: editedName,
            Surname: editedSurname,
            Image: imageUrl,
          },
          { merge: true }
        );
      } else {
        await setDoc(
          doc(db, "Users", auth.currentUser.uid),
          {
            Name: editedName,
            Surname: editedSurname,
          },
          { merge: true }
        );
      }
      message.success("Dati veiksmigi atjaunoti");
      setEditModalVisible(false);
    } catch (error) {
      message.error("Kluda atjaunojot datus");
      console.error(error);
    }
  };

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
                  <Paper
                    elevation={3}
                    style={{ padding: 40, textAlign: "center" }}
                  >
                    <Space direction="vertical">
                      <Avatar
                        alt={userData.Name}
                        src={editedImage || userData.Image}
                        style={{ width: 200, height: 200, margin: "0 auto" }}
                      />
                      <h2>{userData.Name}</h2>
                      <p>Epasts: {userData.Email}</p>
                      <p>Uzvards: {userData.Surname}</p>
                      <p>
                        Registracijas datums:{" "}
                        {userData.createdAt.toDate().toLocaleDateString()}
                      </p>
                      <Button onClick={() => setEditModalVisible(true)}>
                        Rediģet
                      </Button>
                    </Space>
                  </Paper>
                </Box>
              )}
            </Space>
          </Content>
        </Layout>
      </Layout>
      {/* Модальное окно для редактирования данных */}
      <Modal
        title="Rediģet datus"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={updateUserData}
      >
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Vards"
        />
        <Input
          value={editedSurname}
          onChange={(e) => setEditedSurname(e.target.value)}
          placeholder="Uzvards"
        />
        {/* Компонент для загрузки фото */}
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
          <Button>Augšpieladet attelu</Button>
        </Upload>
      </Modal>
    </>
  );
};

export default Profils;
