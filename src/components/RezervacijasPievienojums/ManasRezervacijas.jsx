import React, { useState, useEffect } from "react";
import { Button, Layout, Space, message } from "antd";
import { AgGridReact } from "ag-grid-react";
import { db, auth } from "../../firebase";
import RegistrationModal from "../LeftSideNav/RegistrationModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Navbar from "../LeftSideNav/Navbar";
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
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";

const { Content } = Layout;

const Manasrezervacijas = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const columnDefs = [
    { headerName: "UID", field: "uid", flex: 1 },
    { headerName: "Pilseta", field: "City", flex: 1 },
    { headerName: "Vards", field: "Name", flex: 1 },
    { headerName: "Status", field: "Status", flex: 1 },
    {
      headerName: "",
      field: "Actions",
      flex: 1,
      sortable: false,
      cellRenderer: (params) => (
        <>
          <Button
            className="edit-orange"
            icon={<EditOutlined />}
            style={{ marginRight: 10 }}
            disabled={params.data.Status !== "Aktīvs"}
            onClick={() => editUserDetails(params.data)}
          />
          {params.data.Status === "Aktīvs" ? (
            <Button
              icon={<DeleteOutlined />}
              onClick={() => deactivateUser(params.data)}
            />
          ) : (
            <Button
              icon={<CheckOutlined />}
              onClick={() => activateUser(params.data)}
            />
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        message.error("User not authenticated");
        return;
      }

      const housesCollection = collection(db, "Houses");
      const q = query(
        housesCollection,
        where("Owner", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      try {
        const querySnapshot = await getDocs(q);
        const housesData = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setRowData(housesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error(
          "Could not fetch data. Please ensure the necessary index is created."
        );
      }
    };

    fetchData();
  }, []);

  const handleOk = async (values, role) => {
    const passwordToUse =
      newPassword.trim() !== "" ? newPassword : values.password;
    try {
      if (editUser && editUser.uid) {
        await updateUserDetails(
          { ...values, password: passwordToUse },
          editUser.uid
        );
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          passwordToUse
        );
        const userDocRef = doc(db, "Users", userCredential.user.uid);
        await setDoc(userDocRef, {
          Name: values.name,
          Surname: values.surname,
          Email: values.email,
          Role: role,
          Owner: auth.currentUser.uid,
          Status: "Aktīvs",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        message.success("New user created successfully!");
      }

      setIsEditModalOpen(false);
      setIsManagerModalOpen(false);
      setIsPassengerModalOpen(false);
      setEditUser(null);
      setNewPassword("");
    } catch (error) {
      console.error("Failed to save user details:", error);
      message.error("Failed to save user details.");
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsManagerModalOpen(false);
    setIsPassengerModalOpen(false);
    setEditUser(null);
    setNewPassword("");
  };

  const deactivateUser = async (user) => {
    try {
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(
        userDocRef,
        { ...user, Status: "Inactive" },
        { merge: true }
      );
      setRowData((prevData) =>
        prevData.map((item) =>
          item.uid === user.uid ? { ...item, Status: "Inactive" } : item
        )
      );
      message.success("Lietotājs veiksmīgi deaktivēts");
    } catch (error) {
      console.error("Kļūda lietotāja deaktivēšanā:", error);
      message.error("Kļūda lietotāja deaktivēšanā");
    }
  };

  const activateUser = async (user) => {
    try {
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(userDocRef, { ...user, Status: "Aktīvs" }, { merge: true });
      setRowData((prevData) =>
        prevData.map((item) =>
          item.uid === user.uid ? { ...item, Status: "Aktīvs" } : item
        )
      );
      message.success("Lietotājs veiksmīgi aktivizēts");
    } catch (error) {
      console.error("Kļūda lietotāja aktivizēšanā:", error);
      message.error("Kļūda lietotāja aktivizēšanā");
    }
  };

  const updateUserDetails = async (values, uid) => {
    try {
      const userDocRef = doc(db, "Users", uid);
      await setDoc(
        userDocRef,
        {
          Name: values.name,
          Surname: values.surname,
          Email: values.email,
          Role: editUser.role,
          Status: "Aktīvs",
          updatedAt: new Date(),
        },
        { merge: true }
      );
      message.success("Пользователь успешно обновлен");
    } catch (error) {
      console.error("Ошибка обновления пользователя:", error);
      message.error("Ошибка обновления пользователя");
    }
  };

  const editUserDetails = (user) => {
    setEditUser({
      uid: user.uid,
      name: user.Name,
      surname: user.Surname,
      email: user.Email,
      role: user.Role,
      status: user.Status,
    });
    setIsEditModalOpen(true);
  };

  const handleHouseClick = () => {
    navigate("/Checkout");
  };
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button.Group style={{ marginBottom: "65px" }}>
                <Button
                  icon={<UserAddOutlined />}
                  onClick={handleHouseClick}
                ></Button>
              </Button.Group>
              <div className="ag-theme-material" style={{ height: "80vh" }}>
                <AgGridReact columnDefs={columnDefs} rowData={rowData} />
              </div>
            </Space>
          </Content>
        </Layout>
      </Layout>
      <RegistrationModal
        visible={isEditModalOpen}
        onOk={(values) => handleOk(values, editUser ? editUser.role : "User")}
        onCancel={handleCancel}
        isEditMode={isEditModalOpen}
        user={editUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
      />
      <RegistrationModal
        visible={isManagerModalOpen}
        onOk={(values) => handleOk(values, "Manager")}
        onCancel={handleCancel}
        isEditMode={false}
      />
      <RegistrationModal
        visible={isPassengerModalOpen}
        onOk={(values) => handleOk(values, "User")}
        onCancel={handleCancel}
        isEditMode={false}
      />
    </>
  );
};

export default Manasrezervacijas;
