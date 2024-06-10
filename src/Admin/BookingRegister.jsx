import React, { useState, useEffect } from "react";
import { Button, Layout, Space, message, Modal, Avatar, Carousel } from "antd";
import { AgGridReact } from "ag-grid-react";
import { db, auth } from "../firebase";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "./UserRegisterCSS.css";
import RegistrationModal from "../components/LeftSideNav/RegistrationModal";
import Navbar from "../components/LeftSideNav/Navbar";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  CheckOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import auth functions from Firebase
import { useNavigate } from "react-router";

const { Content } = Layout;

const Bookingregister = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [namee, setNamee] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rowData, setRowData] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [houseDetails, setHouseDetails] = useState(null);
  const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);

  const navigate = useNavigate;

  const columnDefs = [
    { headerName: "UID", field: "uid", flex: 1 },
    { headerName: "Pilseta", field: "City", flex: 1 },
    { headerName: "Vards", field: "Name", flex: 1 },
    { headerName: "Saimnieks", field: "Owner", flex: 1 },
    { headerName: "Loma", field: "Role", flex: 1 },
    { headerName: "Uztaisīts", field: "createdAt", flex: 1 },
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
            disabled={params.data.Status !== "Apstiprināts"} // Disable edit button if user status is not Aktīvs
            onClick={() => editUserDetails(params.data)}
          />
          {params.data.Status === "Apstiprināts" ? (
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => viewHouseDetails(params.data)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, "Houses");
      try {
        const queryConstraint = query(
          usersCollection,
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(queryConstraint);
        const usersData = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setRowData(usersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error(
          "Could not fetch user data. Make sure the index is built."
        );
      }
    };

    fetchData();
  }, []);

  const handleOk = async (values, role) => {
    const passwordToUse =
      newPassword.trim() !== "" ? newPassword : values.password;

    try {
      // Check if editing an existing user and editUser is not null
      if (editUser && editUser.uid) {
        await updateUserDetails(
          { ...values, password: passwordToUse },
          editUser.uid
        );
      } else {
        // Creating new user
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
          Status: "Aktīvs",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        message.success("New user created successfully!");
      }

      // Reset states and close modal
      setIsEditModalOpen(false);
      setIsManagerModalOpen(false);
      setIsPassengerModalOpen(false);
      setNamee("");
      setSurname("");
      setEmail("");
      setPassword("");
      setNewPassword("");
      setEditUser(null); // Reset editUser to null
    } catch (error) {
      console.error("Failed to save user details:", error);
      message.error("Failed to save user details.");
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setIsManagerModalOpen(false);
    setIsPassengerModalOpen(false);
    setNamee(""); // Optionally reset these if you want a fresh start when the modal reopens
    setSurname("");
    setEmail("");
    setPassword("");
    setNewPassword("");
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const deactivateUser = async (user) => {
    try {
      const userDocRef = doc(db, "Houses", user.uid); // Make sure we are updating the Houses collection
      await setDoc(
        userDocRef,
        {
          Status: "Deaktivizēts",
          updatedAt: new Date(), // Add an updatedAt field to track updates
        },
        { merge: true } // Use merge option to update only the specified fields
      );
      // Update local state after database update
      const updatedRowData = rowData.map((rowDataItem) => {
        if (rowDataItem.uid === user.uid) {
          return { ...rowDataItem, Status: "Deaktivizēts" };
        }
        return rowDataItem;
      });
      setRowData(updatedRowData);
      message.success("Lietotājs veiksmīgi deaktivizēts");
    } catch (error) {
      console.error(
        "Kļūda lietotāja deaktivizēšanā: ",
        error.code,
        error.message
      );
      message.error("Kļūda lietotāja deaktivizēšanā");
    }
  };

  const activateUser = async (user) => {
    try {
      const userDocRef = doc(db, "Houses", user.uid); // Make sure we are updating the Houses collection
      await setDoc(
        userDocRef,
        {
          Status: "Apstiprināts",
          updatedAt: new Date(), // Add an updatedAt field to track updates
        },
        { merge: true } // Use merge option to update only the specified fields
      );
      // Update local state after database update
      const updatedRowData = rowData.map((rowDataItem) => {
        if (rowDataItem.uid === user.uid) {
          return { ...rowDataItem, Status: "Apstiprināts" };
        }
        return rowDataItem;
      });
      setRowData(updatedRowData);
      message.success("Lietotājs veiksmīgi aktivizēts");
    } catch (error) {
      console.error(
        "Kļūda lietotāja aktivizēšanā: ",
        error.code,
        error.message
      );
      message.error("Kļūda lietotāja aktivizēšanā");
    }
  };

  const updateUserDetails = async (values, uid) => {
    try {
      const userDocRef = doc(db, "Users", uid);
      // Update the document without touching the createdAt field
      await setDoc(
        userDocRef,
        {
          Name: values.name,
          Surname: values.surname,
          Email: values.email,
          Role: editUser.role, // Use the existing role from editUser state
          Status: "Aktīvs",
          updatedAt: new Date(), // Update only the updatedAt field
        },
        { merge: true }
      ); // Use merge option to ensure that only provided fields are updated
      message.success("Пользователь успешно обновлен");
    } catch (error) {
      console.error(
        "Ошибка обновления пользователя: ",
        error.code,
        error.message
      );
      message.error("Ошибка обновления пользователя");
    }
  };

  const editUserDetails = (user) => {
    setEditUser(user);
    setNamee(user.Name);
    setSurname(user.Surname);
    setEmail(user.Email);
    setIsEditModalOpen(true);
  };

  const viewHouseDetails = async (house) => {
    try {
      const houseDocRef = doc(db, "Houses", house.uid);
      const houseDoc = await getDoc(houseDocRef);
      if (houseDoc.exists()) {
        setHouseDetails(houseDoc.data());
        setIsHouseModalOpen(true);
      } else {
        message.error("House details not found.");
      }
    } catch (error) {
      console.error("Failed to fetch house details:", error);
      message.error("Failed to fetch house details.");
    }
  };

  const handleHouseModalOk = () => {
    setIsHouseModalOpen(false);
    setHouseDetails(null);
  };

  const handleHouseModalCancel = () => {
    setIsHouseModalOpen(false);
    setHouseDetails(null);
  };

  return (
    <Layout>
      <Navbar />
      <Layout>
        <Content style={{ padding: "20px" }}>
          <Space
            direction="horizontal"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h2>Registration Details</h2>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsManagerModalOpen(true)}
            >
              Add New User
            </Button>
          </Space>
          <div className="ag-theme-material" style={{ height: 600 }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              animateRows={true}
              domLayout="autoHeight"
              overlayLoadingTemplate={`<span class="ag-overlay-loading-center">Loading...</span>`}
              overlayNoRowsTemplate={`<span class="ag-overlay-no-rows-center">No data available</span>`}
            />
          </div>
        </Content>
      </Layout>
      <RegistrationModal
        visible={isEditModalOpen}
        onCancel={handleCancel}
        onCreate={handleOk}
        initialValues={{
          name: namee,
          surname: surname,
          email: email,
          password: password,
        }}
        editUser={editUser} // Pass editUser prop to RegistrationModal
        handlePasswordChange={handlePasswordChange}
        newPassword={newPassword}
      />
      <Modal
        title="Piedāvājuma informācija"
        visible={isHouseModalOpen}
        onOk={handleHouseModalOk}
        onCancel={handleHouseModalCancel}
        footer={[
          <Button key="back" onClick={handleHouseModalCancel}>
            Atpakaļ
          </Button>,
        ]}
      >
        {houseDetails && (
          <div>
            <p><strong>Nosaukums:</strong> {houseDetails.Name}</p>
            <p><strong>Pilseta:</strong> {houseDetails.City}</p>
            <p><strong>Saimnieks:</strong> {houseDetails.Owner}</p>
            <p><strong>Status:</strong> {houseDetails.Status}</p>
            <Carousel autoplay>
              {houseDetails.Images &&
                houseDetails.Images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`House Image ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ))}
            </Carousel>
            <p><strong>Apraksts:</strong> {houseDetails.Description}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Bookingregister;
