import React, { useState, useEffect } from "react";
import { Button, Layout, Space, message } from "antd";
import { AgGridReact } from "ag-grid-react";
import { db,auth } from "../firebase";
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
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import auth functions from Firebase

const { Content } = Layout;

const UserRegister = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [namee, setNamee] = useState(""); // Valsts lietotāja vārds
  const [surname, setSurname] = useState(""); // Valsts lietotāja uzvārds
  const [email, setEmail] = useState(""); // Valsts lietotāja e-pasts
  const [password, setPassword] = useState(""); // Valsts lietotāja parole
  const [rowData, setRowData] = useState([]);
  const [newPassword, setNewPassword] = useState(""); // Valsts jauna parole

  const [editUser, setEditUser] = useState(null);

  const columnDefs = [
    { headerName: "UID", field: "uid", flex: 1 },
    { headerName: "Vārds", field: "Name", flex: 1 },
    { headerName: "Uzvārds", field: "Surname", flex: 1 },
    { headerName: "E-pasts", field: "Email", flex: 1 },
    { headerName: "Loma", field: "Role", flex: 1 },
    { headerName: "Statuss", field: "Status", flex: 1 },
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
            disabled={params.data.Status !== "Aktīvs"} // Disable edit button if user status is not Aktīvs
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
      const usersCollection = collection(db, "Users");
      try {
        // Build a query using both where and orderBy that relies on a composite index
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
    console.log(`Neaktīvs lietotājs:`, user);
    try {
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(userDocRef, {
        ...user,
        Status: "Inactive",
      });
      // Atjauno vietējo stāvokli pēc datubāzes atjaunināšanas
      const updatedRowData = rowData.map((rowDataItem) => {
        if (rowDataItem.uid === user.uid) {
          return { ...rowDataItem, Status: "Inactive" };
        }
        return rowDataItem;
      });
      setRowData(updatedRowData);
      message.success("Lietotājs veiksmīgi deaktivēts");
    } catch (error) {
      console.error(
        "Kļūda lietotāja deaktivēšanā: ",
        error.code,
        error.message
      );
      message.error("Kļūda lietotāja deaktivēšanā");
    }
  };

  const activateUser = async (user) => {
    console.log(`Aktīvs lietotājs:`, user);
    try {
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(userDocRef, {
        ...user,
        Status: "Aktīvs",
      });
      // Atjauno vietējo stāvokli pēc datubāzes atjaunināšanas
      const updatedRowData = rowData.map((rowDataItem) => {
        if (rowDataItem.uid === user.uid) {
          return { ...rowDataItem, Status: "Aktīvs" };
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
    console.log("Editing user:", user); // Log to see what is being passed
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
                  onClick={() => setIsManagerModalOpen(true)}
                >
                  Pievienot adminu
                </Button>
                <Button
                  icon={<UserAddOutlined />}
                  onClick={() => setIsPassengerModalOpen(true)}
                >
                  Pievienot lietotaju
                </Button>
              </Button.Group>

              <div className="ag-theme-material" style={{ height: "80vh" }}>
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  pagination={true}
                />
              </div>
            </Space>
          </Content>
        </Layout>
      </Layout>

      <RegistrationModal
        props={"PIEVIENOT Adminu"}
        title="Jauns menedžera konts"
        visible={isManagerModalOpen}
        onOk={(values) => handleOk(values, "Admin")}
        onCancel={handleCancel}
        isEditMode={isEditModalOpen} // Padod isEditMode īpašību, pamatojoties uz isEditModalOpen stāvokli
      />

      <RegistrationModal
        props={"PIEVIENOT Lietotaju"}
        title="Jauns pasažiera konts"
        visible={isPassengerModalOpen}
        onOk={(values) => handleOk(values, "Lietotajs")}
        onCancel={handleCancel}
        isEditMode={isEditModalOpen} // Padod isEditMode īpašību, pamatojoties uz isEditModalOpen stāvokli
      />

      <RegistrationModal
        props={"SAGLABĀT IZMAIŅAS"}
        title="Rediģēt lietotāja kontu"
        visible={isEditModalOpen}
        onOk={(values) => handleOk(values, editUser.role)} // Pass role from editUser
        onCancel={handleCancel}
        initialValues={
          editUser
            ? {
                name: editUser.name,
                surname: editUser.surname,
                email: editUser.email,
                password: "",
              }
            : {}
        }
        isEditMode={true}
      />
    </>
  );
};

export default UserRegister;
