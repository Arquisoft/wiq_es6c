import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ loggedIn, handleLogout }) => {
  return (
    <nav>
      <div className="logo">
        <img src=" " alt="Logo de la aplicación" />
      </div>
      <ul className="nav-links">
        {loggedIn ? (
          <div>
            <li>
              <Link to=" ">Perfil</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </li>
          </div>
        ): 
          <div> </div>
        }
      </ul>
    </nav>
  );
};

export default Navbar;