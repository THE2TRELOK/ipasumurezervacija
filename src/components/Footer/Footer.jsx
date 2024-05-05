import React from "react";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faGithub,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="item1"></div>

        <div className="item2">
          <FontAwesomeIcon icon={faCopyright} />{" "}
          <span style={{ paddingLeft: 5 }}>
            {new Date().getFullYear()} Rezervacija. Visas tiesibas aizsargatas.
          </span>
        </div>
        <a href="https://github.com" target="_blank" className="item3">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a href="http://fb.com" target="_blank" className="item4">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="https://www.youtube.com/" target="_blank" className="item5">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
