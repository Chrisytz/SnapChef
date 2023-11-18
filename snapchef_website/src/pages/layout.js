import React from "react";

import { Link } from "react-router-dom";

export default function Nav(){

  return(
        <div className="navbar">
          <div className="logo">Shopio</div>
           <ul className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/history">History </Link>
           </ul>
        </div>
  );

}