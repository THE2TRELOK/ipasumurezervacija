import React, { useState, useEffect } from "react";
import { Button, Layout, Space, message } from "antd";
import { AgGridReact } from "ag-grid-react";
import { db,auth } from "../firebase";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Header from "../components/Header/Header";
// import "../../App.css";
import "../Admin/UserRegisterCSS.css";
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

const Profils = () => {
 
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Layout className="site-layout">
          <Content style={{ margin: "16px 16px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              
              <div className="ag-theme-material" style={{ height: "96vh" }}>
                
              </div>
            </Space>
          </Content>
        </Layout>
      </Layout>

      

    
    </>
  );
};

export default Profils;
