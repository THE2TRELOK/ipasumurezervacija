import { useState } from "react";
import logo from "./logo.svg"
import "./strength.css";
import house from "./house.png";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const strengthLabels = ["vaja", "videja", "videja", "stipra", "stipra"];

export const PasswordStrength = ({ placeholder, onChange }) => {

   
  const addTodo = (e) => {
      e.preventDefault();        
  }
  const handlePasswordChange = (password) => {
    console.log("Password changed:", password);
  };

  const [strength, setStrength] = useState("");

  const getStrength = (password) => {
    let strengthIndicator = -1;

    if (/[a-z]/.test(password)) strengthIndicator++;
    if (/[A-Z]/.test(password)) strengthIndicator++;
    if (/\d/.test(password)) strengthIndicator++;
    if (/[^a-zA-Z0-9]/.test(password)) strengthIndicator++;

    if (password.length >= 16) strengthIndicator++;

    return strengthLabels[strengthIndicator];
  };

  const handleChange = (event) => {
    setStrength(getStrength(event.target.value));
    onChange(event.target.value);
  };

  return (
    <>
      <input
        name="password"
        spellCheck="false"
        className="control"
        type="password"
        placeholder={placeholder}
        onChange={handleChange}
      />
      <div className={`bars ${strength}`}>
        <div></div>
      </div>
      <div className="strength">{strength && `${strength} parole`}</div>
    </>
  );
};

export const PasswordStrengthExample = () => {
  const handleChange = (value) => console.log(value);

  
  return (
    
          
          <PasswordStrength placeholder="Parole" onChange={handleChange}
          
          />
          
        
  );
};