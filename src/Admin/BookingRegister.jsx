import React, { useState, useEffect } from "react";
import { Button, Layout, Space, message, Modal, Avatar, Carousel, Form, Input, Upload, InputNumber, Select, Divider, Typography } from "antd";
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
  PlusOutlined,
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
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import auth functions from Firebase
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import moment from "moment";

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

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
  const [isEditing, setIsEditing] = useState(false);
  const [editHouse, setEditHouse] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [reservationsModalVisible, setReservationsModalVisible] = useState(false);
  const [selectedHouseReservations, setSelectedHouseReservations] = useState([]);

  const navigate = useNavigate();

  const columnDefs = [
    { headerName: "UID", field: "uid", flex: 1 },
    { headerName: "Pilseta", field: "City", flex: 1 },
    { headerName: "Vards", field: "Name", flex: 1 },
    { headerName: "Saimnieks", field: "Owner", flex: 1 },
  
    {
      headerName: "",
      field: "Actions",
      flex: 1,
      sortable: false,
      cellRenderer: (params) => (
        <>
        
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
      message.success("Īpašums veiksmīgi deaktivizēts");
    } catch (error) {
      console.error(
        "Kļūda Īpašuma deaktivizēšanā: ",
        error.code,
        error.message
      );
      message.error("Kļūda Īpašuma deaktivizēšanā");
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
      message.success("Īpašums veiksmīgi aktivizēts");
    } catch (error) {
      console.error(
        "Kļūda Īpašuma aktivizēšanā: ",
        error.code,
        error.message
      );
      message.error("Kļūda Īpašuma aktivizēšanā");
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

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setNewImages([...newImages, info.file.response.url]);
    }
  };

  const uploadImage = async (file) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.uid}`);
    const uploadTask = uploadBytes(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleEditHouse = (house) => {
    setEditHouse(house);
    setNewImages(house.Images || []);
    setIsEditing(true);
  };

  const handleDeleteHouse = async (houseId) => {
    try {
      await deleteDoc(doc(db, "Houses", houseId));
      setRowData((prevData) =>
        prevData.filter((house) => house.uid !== houseId)
      );
      message.success("Mājas sludinājums veiksmīgi dzēsts!");
    } catch (error) {
      console.error("Kļūda dzēšot mājas sludinājumu:", error);
      message.error("Kļūda dzēšot mājas sludinājumu");
    }
  };

  const handleSaveHouse = async () => {
    try {
      if (editHouse.uid) {
        const houseDocRef = doc(db, "Houses", editHouse.uid);
        await setDoc(
          houseDocRef,
          { ...editHouse, Images: newImages },
          { merge: true }
        );

        // Update rowData with the new values (using the existing house object)
        const updatedRowData = rowData.map((house) =>
          house.uid === editHouse.uid
            ? { ...house, ...editHouse, Images: newImages }
            : house
        );
        setRowData(updatedRowData);

        setIsEditing(false);
        setNewImages([]);
        setEditHouse({});
        message.success("Mājas sludinājums veiksmīgi atjaunināts!");
      } else {
        message.error("Mājas ID nav pieejams");
      }
    } catch (error) {
      console.error("Kļūda saglabājot mājas sludinājumu:", error);
      message.error("Kļūda saglabājot mājas sludinājumu");
    }
  };

  const handleViewReservations = async (house) => {
    const reservationsCollection = collection(db, "Reservations");
    const q = query(
      reservationsCollection,
      where("houseId", "==", house.uid)
    );
    try {
      const querySnapshot = await getDocs(q);
      const reservationsData = querySnapshot.docs.map(async (doc) => {
        const reservationData = doc.data();
        const userData = await getUserData(reservationData.userId); 
        return {
          id: doc.id,
          ...reservationData,
          ...userData,
        };
      });
      const resolvedReservations = await Promise.all(reservationsData);
      setSelectedHouseReservations(resolvedReservations);
      setReservationsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      message.error("Could not fetch reservations.");
    }
  };

  const getUserData = async (userId) => {
    const userDocRef = doc(db, "Users", userId); 
    try {
      const docSnap = await getDoc(userDocRef); 
      if (docSnap.exists()) {
        return docSnap.data(); 
      } else {
        console.warn("User document not found:", userId);
        return null; 
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
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
            <h2>Mājas</h2>
            
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
        editUser={editUser} 
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
      <Modal
        title="Rediģēt mājas sludinājumu"
        visible={isEditing}
        onOk={handleSaveHouse}
        onCancel={() => setIsEditing(false)}
        okText="Saglabāt"
        cancelText="Atcelt"
      >
        {editHouse && (
          <Form
            key={editHouse.uid} // Force re-render with a unique key
            layout="vertical"
            initialValues={{
              Name: editHouse.Name,
              Address1: editHouse.Address1,
              Address2: editHouse.Address2,
              City: editHouse.City,
              Description: editHouse.Description,
              Price: editHouse.Price,
              PeopleCount: editHouse.PeopleCount,
              Zip: editHouse.Zip,
              Status: editHouse.Status,
            }}
            onValuesChange={(changedValues, allValues) =>
              setEditHouse((prev) => ({ ...prev, ...allValues }))
            }
          >
            <Form.Item
              name="Name"
              label="Nosaukums"
              rules={[{ required: true, message: "Lūdzu, ievadiet nosaukumu" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Address1"
              label="Adrese 1"
              rules={[
                {
                  required: true,
                  message: "Lūdzu, ievadiet adresi",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="Address2" label="Adrese 2">
              <Input />
            </Form.Item>
            <Form.Item
              name="City"
              label="Pilsēta"
              rules={[
                {
                  required: true,
                  message: "Lūdzu, ievadiet pilsētu",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="Description" label="Apraksts">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="Price"
              label="Cena"
              rules={[
                {
                  required: true,
                  message: "Lūdzu, ievadiet cenu",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="PeopleCount"
              label="Cilvēku skaits"
              rules={[
                {
                  required: true,
                  message: "Lūdzu, ievadiet cilvēku skaitu",
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="Zip"
              label="Pasta indekss"
              rules={[
                {
                  required: true,
                  message: "Lūdzu, ievadiet pasta indeksu",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Status"
              label="Statuss"
              rules={[
                {
                  required: true,
                  message: "Lūdzu, izvēlieties statusu",
                },
              ]}
            >
              <Select>
                <Option value="Apstiprināts">Apstiprināts</Option>
                <Option value="Neapstiprināts">Neapstiprināts</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Attēli">
              <Upload
                listType="picture-card"
                customRequest={async (options) => {
                  try {
                    const imageUrl = await uploadImage(options.file);
                    options.onSuccess({ url: imageUrl });
                  } catch (error) {
                    options.onError(error);
                  }
                }}
                onRemove={(file) => {
                  setNewImages((prevImages) =>
                    prevImages.filter((image) => image !== file.url)
                  );
                }}
                fileList={newImages.map((image) => ({
                  uid: image,
                  url: image,
                  status: "done",
                }))}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Pievienot attēlu</div>
                </div>
              </Upload>
            </Form.Item>
          </Form>
        )}
      </Modal>
      <Modal
        title="Rezervācijas"
        visible={reservationsModalVisible}
        onCancel={() => setReservationsModalVisible(false)}
        footer={null}
        style={{ top: 20 }} // Adjust the modal position if needed
      >
        {selectedHouseReservations.length === 0 ? (
          <p>Nav rezervāciju šai mājai.</p>
        ) : (
          <div style={{ padding: 20 }}>
            {selectedHouseReservations.map((reservation) => (
              <div key={reservation.id} style={{ marginBottom: 20 }}>
                <Title level={4}>Rezervācijas informācija</Title>
                <Divider />
                <p>
                  <strong>Vārds:</strong> {reservation.Name}
                </p>
                <p>
                  <strong>Uzvārds:</strong> {reservation.Surname}
                </p>
                <p>
                  <strong>E-pasts:</strong> {reservation.Email}
                </p>
                <p>
                  <strong>Datums no:</strong>{" "}
                  {moment(reservation.startDate.toDate()).format(
                    "YYYY-MM-DD"
                  )}
                </p>
                <p>
                  <strong>Datums līdz:</strong>{" "}
                  {moment(reservation.endDate.toDate()).format("YYYY-MM-DD")}
                </p>
                <p>
                  <strong>Cena:</strong> {reservation.totalCost} €
                </p>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Bookingregister;