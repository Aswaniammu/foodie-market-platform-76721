import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Navbar({ cartItemsCount }) {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand"><Link to="/">Foodie Market</Link></div>
      <ul className="navbar-links">
        <li><Link to="/catalog">Catalog</Link></li>
        <li><Link to="/cart">Cart {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}</Link></li>
        {isAuthenticated &&
          <>
            <li><Link to="/orders">Orders</Link></li>
            <li><span className="navbar-user">Hi, {user.username}</span></li>
            <li>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </li>
          </>
        }
        {!isAuthenticated &&
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        }
      </ul>
    </nav>
  );
}
