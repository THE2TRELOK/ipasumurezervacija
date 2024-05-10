import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.png"
import "./header.css";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleApartamentiClick = () => {
    navigate("/Apartamenti");
  };

  const handleMainClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/Login");
  };

  const handleProfilsClick = () => {
    navigate("/userregistry");
  };

  return (
    <header>
      <div className="header-container">
        <nav className="header-nav-bar">
          <div className="header-nav-logo">
            <a onClick={handleMainClick}>
              <img
                src={Logo}
                alt="logo"
                id="logo"
              />
            </a>
          </div>
          <ul className="header-nav-lists">
            <li className="header-nav-list">
              <Button className="Buttons" onClick={handleMainClick}>
                Sakums
              </Button>
            </li>
            <li className="header-nav-list"></li>
           
              <li className="header-nav-list">
                <Button className="Buttons" onClick={handleProfilsClick}>
                  Profils
                </Button>
              </li>
           
            <li className="header-nav-list">
              <Button className="Buttons" onClick={handleApartamentiClick}>
                Apartamenti
              </Button>
            </li>

            <li className="header-nav-list">
              <Button className="Buttons" onClick={handleLoginClick}>
                Pieslegties
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
