import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Divider } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../../firebase";
import logo from "./House.svg";
import {
  CalendarOutlined,
  FileSearchOutlined,
  UnorderedListOutlined,
  FolderOutlined,
  CopyOutlined,
  SettingOutlined,
  UserOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./componentCSS.css";
import dayjs from "dayjs";
import { auth } from "../../firebase";

const { Sider } = Layout;
const { Title, Text } = Typography;

const Navbar = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"));
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const role = await getUserRole(user.uid);
        console.log("User role:", role);
        setUserRole(role);
      } else {
        console.log("Пользователь не аутентифицирован");
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCurrentTime(dayjs().format("HH:mm"));
    }, 60000); // Update time every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {});
  };
  return (
    <Sider className="sidebar" width={250} theme="light">
      <Link to="/calendar" className="logo">
        <img src={logo} alt="Logo" className="login-logo" />
        <Title className="logo-text" level={2}>
          Estato Rent
        </Title>
      </Link>
      <Menu mode="vertical" defaultSelectedKeys={[location.pathname]}>
      
        {userRole === "Admin" && (
          <>
            <Divider className="antd-divider" />
            <Menu.Item key="/userregistry" icon={<UserOutlined />}>
              <Link to="/userregistry">Lietotāju reģistrs</Link>
            </Menu.Item>
          </>
        )}
         {userRole === "Admin" && (
          <>
            <Menu.Item key="/bookingregister" icon={<FileSearchOutlined />}>
              <Link to="/bookingregister">Māju reģistrs</Link>
            </Menu.Item>
          </>
        )}
        <Menu.Item key="/profils" icon={<DatabaseOutlined />}>
          <Link to="/profils">Profils</Link>
        </Menu.Item>
        <Divider className="antd-divider" />
        <Menu.Item key="/manasrezervacijas" icon={<SettingOutlined />}>
          <Link to="/manasrezervacijas">Mana māja</Link>
        </Menu.Item>
        <Divider className="antd-divider" />
        <Menu.Item key="/rezervacijas" icon={<SettingOutlined />}>
          <Link to="/rezervacijas">Rezervācijas</Link>
        </Menu.Item>
      
         <Menu.Item key="/" icon={<SettingOutlined />}>
          <Link to="/">Iziet no kabineta</Link>
        </Menu.Item>
        <Menu.Item
          key="/logout"
          icon={<LogoutOutlined />}
          onClick={handleLogOut}
        >
          Atslēgties
        </Menu.Item>
      </Menu>
      <Divider className="antd-divider" />
      <div className="footerNav">
        <Text className="time">{currentTime}</Text>
        <Text className="footer-text">
          <Divider className="antd-divider" />
          {" © "}
          <Link color="inherit" href="https://github.com/THE2TRELOK">
            EstatoRent
          </Link>
          <br />
          Visas tiesības aizsargātas.
        </Text>
      </div>
    </Sider>
  );
};

export default Navbar;
