import React from "react";
import "./nav.css"
import '../App.css';
import { Link } from "react-router-dom";

export default function Nav(){

  return(
        <div className="navbar">
           <ul className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/history">History </Link>
              <Link to="/webcam">Webcam </Link>
           </ul>
        </div>
  );

}