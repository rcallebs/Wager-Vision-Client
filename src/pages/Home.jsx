import React from "react";
import { NavLink } from "react-router-dom";

const Home = ({ user }) => {
  return (
    <div>
      <h1>Welcome {user ? user.name : "Guest"}</h1>
      <div className="home-welcome">
        <h2>Good teams win. Great teams cover.</h2>
      </div>
      <div className="homepage links">
        <NavLink to="/auth/register" className="nav-link">
          New User
        </NavLink>
        <NavLink to="/auth/login" className="nav-link">
          Login
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
