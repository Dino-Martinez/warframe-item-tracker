import React from 'react';
import './Header.css';
import {NavLink} from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
    <nav className="navbar navbar-dark bg-dark">
      <ul className="navbar-nav">
        <li className="nav-item">
        <NavLink className="nav-link" activeClassName="text-danger" exact to="/">HOME</NavLink>
        </li>
        <li className="nav-item">
        <NavLink className="nav-link" activeClassName="text-danger" to="/watchlist">WATCH LIST</NavLink>
        </li>
      </ul>
    </nav>
    );
  }
}

export default Header;
