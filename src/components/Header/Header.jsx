import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
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
    navigate("/Profils");
  };

  return (
    <header>
      <div className="header-container">
        <nav className="header-nav-bar">
          <div className="header-nav-logo">
            <a onClick={handleMainClick}>
              <img
                src="https://png.pngtree.com/png-clipart/20220131/original/pngtree-housing-logo-with-gold-line-house-png-image_7261238.png"
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
            <Button onClick={handleMainClick}>
            <AdminPanelSettingsIcon
              style={{ margin: "10px 10px", width: "100px", height: "50px" }}
            />
          </Button>
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
