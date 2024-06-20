import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Space,
  message,
  Modal,
  Form,
  Input,
  Upload,
  InputNumber,
  Select,
  Divider,
  Typography,
} from "antd";
import { AgGridReact } from "ag-grid-react";
import { db, auth } from "../../firebase"; // Assuming you have your firebase setup
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Navbar from "../LeftSideNav/Navbar";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { useNavigate } from "react-router";
import moment from "moment";

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

const Rezervacijas = () => {
  const [rowData, setRowData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editHouse, setEditHouse] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [reservationsModalVisible, setReservationsModalVisible] = useState(false);
  const [selectedHouseReservations, setSelectedHouseReservations] = useState([]);
  const navigate = useNavigate();

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      setNewImages([...newImages, info.file.response.url]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        message.error("User not authenticated");
        return;
      }

      const reservationsCollection = collection(db, "Reservations");
      const q = query(
        reservationsCollection,
        where("userId", "==", user.uid),
        orderBy("startDate", "desc") // Sort by start date
      );
      try {
        const storage = getStorage();
        const querySnapshot = await getDocs(q);
        const reservationsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const reservationData = doc.data();
            const houseData = await getHouseData(reservationData.houseId);
            if (houseData) {
              const images = await Promise.all(
                houseData.Images.map(async (imageUrl) => {
                  try {
                    return await getDownloadURL(ref(storage, imageUrl));
                  } catch (error) {
                    console.error("Error fetching image:", error);
                    return null;
                  }
                })
              );
              return {
                id: doc.id,
                ...reservationData,
                ...houseData,
                Images: images,
              };
            } else {
              return null; // Exclude reservations with missing houses
            }
          })
        );
        const filteredData = reservationsData.filter((data) => data !== null);
        setRowData(filteredData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        message.error(
          "Could not fetch data. Please ensure the necessary index is created."
        );
      }
    };

    fetchData();
  }, []);

  const handleEditHouse = (house) => {
    setEditHouse(house); // Set the house data to editHouse
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
      if (editHouse.uid) { // Only save if editHouse.uid exists
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

        // Clear new images and close the modal
        setIsEditing(false); // Close the modal
        setNewImages([]); // Clear the new images

        // Optionally reset editHouse to an empty object
        setEditHouse({}); // Reset editHouse state

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

  const getHouseData = async (houseId) => {
    const houseDocRef = doc(db, "Houses", houseId);
    try {
      const docSnap = await getDoc(houseDocRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.warn("House document not found:", houseId);
        return null; 
      }
    } catch (error) {
      console.error("Error fetching house data:", error);
      return null;
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

  const handleCancelReservation = async (reservationId) => {
    try {
      const reservationDocRef = doc(db, "Reservations", reservationId);
      await updateDoc(reservationDocRef, {
        Status: "Atcelts",
        startDate: null,
        endDate: null,
      });
      message.success("Rezervācija veiksmīgi atcelta!");
      // Update the rowData to reflect the change
      setRowData((prevData) =>
        prevData.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, Status: "Atcelts", startDate: null, endDate: null }
            : reservation
        )
      );
    } catch (error) {
      console.error("Kļūda atceļot rezervāciju:", error);
      message.error("Kļūda atceļot rezervāciju");
    }
  };

  const columnDefs = [
    { headerName: "Nosaukums", field: "Name", flex: 1 },
    { headerName: "Cena", field: "Price", flex: 1 },
    { headerName: "Statuss", field: "Status", flex: 1 },
    {
      headerName: "Datums no",
      field: "startDate",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? moment(params.value.toDate()).format("YYYY-MM-DD") : "-", // Format date
    },
    {
      headerName: "Datums līdz",
      field: "endDate",
      flex: 1,
      valueFormatter: (params) =>
        params.value ? moment(params.value.toDate()).format("YYYY-MM-DD") : "-", // Format date
    },
    {
      headerName: "Darbības",
      field: "Actions",
      flex: 1,
      sortable: false,
      cellRenderer: (params) => (
        <>
          <Button
            className="edit-orange"
            icon={<EyeOutlined />}
            onClick={() => handleViewReservations(params.data)}
          />
          {/* Only show cancel button if status is not "Atcelts" */}
          {params.data.Status !== "Atcelts" && (
            <Button
              className="cancel-red"
              icon={<CloseOutlined />}
              style={{ marginLeft: 10 }}
              onClick={() => handleCancelReservation(params.data.id)}
            >
              Atcelt
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div className="ag-theme-material" style={{ height: "80vh" }}>
                <AgGridReact columnDefs={columnDefs} rowData={rowData} />
              </div>
            </Space>
          </Content>
        </Layout>
      </Layout>

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
                <p>
                  <strong>Statuss:</strong> {reservation.Status} 
                </p>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Rezervacijas; 