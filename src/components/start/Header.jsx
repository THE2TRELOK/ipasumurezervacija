import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

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
              <Button
                onClick={handleMainClick}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Sakums
              </Button>
            </li>
            <li className="header-nav-list"></li>
            {isLoggedIn && (
              <li className="header-nav-list">
                <Button
                  onClick={handleProfilsClick}
                  style={{
                    backgroundColor: "rgba(49, 49, 54, 0.993)",
                    color: "white",
                    lineHeight: "0",
                    padding: "20px",
                  }}
                >
                  Profils
                </Button>
              </li>
            )}
            <li className="header-nav-list">
              <Button
                onClick={handleApartamentiClick}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
                Apartamenti
              </Button>
            </li>

            <li className="header-nav-list">
              <Button
                onClick={handleLoginClick}
                style={{
                  backgroundColor: "rgba(49, 49, 54, 0.993)",
                  color: "white",
                  lineHeight: "0",
                  padding: "20px",
                }}
              >
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
